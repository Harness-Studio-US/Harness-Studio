import type { ChatMessage, StreamEvent } from "./chat";
import { buildAttachmentBlock, historyNote, type Attachment } from "./files";

/**
 * Runs Harness Copilot and Harness Code against a real model on your own
 * machine instead of the scripted demo replies.
 *
 * The browser calls `/api/ollama`, which the dev server forwards to a local
 * Ollama (see vite.config.ts). Set `VITE_AI_MODEL` to switch it on; leave it
 * empty and the shipped demo behaves exactly as before.
 */
const codeModel = String(import.meta.env.VITE_AI_MODEL ?? "").trim();

/**
 * Copilot can talk to its own model, so each chat carries its own instructions
 * on the machine (harness-code and harness-copilot). With no override both
 * chats use the one model, which is how a single-model setup still works.
 */
const copilotModel =
  String(import.meta.env.VITE_AI_COPILOT_MODEL ?? "").trim() || codeModel;

/** The Ollama model behind a chat. */
export function modelNameFor(chat: "copilot" | "code"): string {
  return chat === "code" ? codeModel : copilotModel;
}

/**
 * Where the model answers. Locally that is Vite's /api/ollama proxy. A hosted
 * build (GitHub Pages) has no dev server, so it calls an absolute endpoint
 * instead — an HTTPS tunnel in front of Ollama on the machine running it.
 *   VITE_AI_ENDPOINT=https://model.example.com/v1
 */
const endpoint = String(import.meta.env.VITE_AI_ENDPOINT ?? "").trim().replace(/\/+$/, "");

const chatUrl = endpoint ? `${endpoint}/chat/completions` : "/api/ollama/chat/completions";

export function isRealEngineEnabled(): boolean {
  return codeModel.length > 0;
}

/**
 * Prompts for a small model on a laptop: short lines, one clear shape per
 * answer, and the file contract spelled out with an example. Long rule lists
 * cost context the 4k window cannot spare and a 4B model follows them worse.
 *
 * The fence syntax below is load-bearing — src/lib/files.ts parses
 * ```file:NAME blocks into cards, and src/lib/codeFiles.ts turns each
 * language-tagged block into a project file.
 */
export const CODE_SYSTEM_PROMPT = [
  "You are Harness Code, the coding chat inside Harness Studio. You answer with working code, not plans.",
  "Every answer has one shape:",
  "1. One short line saying what the code does. Skip it only for a one-word fix.",
  "2. The code: one fenced block per file, tagged with the language (tsx, ts, js, jsx, css, sql, json, py, html).",
  "   Each block becomes a file in the project. The first block of a language takes its default name",
  "   (tsx → Component.tsx, ts → module.ts, css → styles.css, sql → migration.sql); the same tag again replaces that file.",
  "3. At most three sentences of notes after the code: what to change, what to watch, or the next step.",
  "Rules:",
  "- Complete files, ready to paste. No placeholders, no '...rest of the code', no comments that say nothing.",
  "- Use current syntax: React 18+ function components, TypeScript strict, ESM imports. Show every import you use.",
  "- If the message is a question rather than a task, answer in two or three sentences and add code only if it helps.",
  "- If the request is too vague to code against, ask one specific question instead of guessing.",
  "- Never restate the request, never announce what you are about to do, never pad with praise or caveats.",
  "Files:",
  "- For a file that is not project code (a README, CSV or notes), put its full contents in a fence whose first line is",
  "  ```file:NAME (for example ```file:notes.md) — the page shows it as a card the user can preview or download.",
  "- Attached files arrive above the message between --- file: NAME --- and --- end of NAME ---. Read them and answer",
  "  from them. Never say you cannot see an attachment; if one was not readable as text, say that plainly.",
].join("\n");

export const COPILOT_SYSTEM_PROMPT = [
  "You are Harness, the AI teammate inside Harness Studio: a web page where someone builds and fixes their project with you.",
  "Answer first, explain second. Two to four short sentences for a normal question; a numbered list only when the answer is a sequence of steps.",
  "No preamble: never open with 'Sure', 'Great question', or a restatement of what was asked, and never announce what you are about to do.",
  "Be concrete — name the file, the value or the screen you mean. Harness Studio has four screens: Copilot, Code, Settings and Guide. Do not mention any other part of it.",
  "If you need one missing detail, ask a single short question at the end. If you do not know something about their project, say so instead of inventing it.",
  "Markdown is fine: **bold** for a button or file name, `code` for identifiers, bullets for parallel items. Keep code inline unless it is a whole function.",
  "Files:",
  "- To hand over a file, write one short line about it, then its full contents in a fence whose first line is ```file:NAME",
  "  (for example ```file:notes.md). The page turns it into a card the user can preview or download; never repeat the contents outside the fence.",
  "- Attached files arrive above the message between --- file: NAME --- and --- end of NAME ---. Read them and answer from them.",
  "  Never say you cannot see an attachment; if one was not readable as text, say that plainly.",
].join("\n");

export type RealReplyOptions = {
  system: string;
  /** Which Ollama model answers; defaults to the code model. */
  model?: string;
  prompt: string;
  history: ChatMessage[];
  attachments?: Attachment[];
  isCancelled: () => boolean;
};

type Chunk = {
  choices?: { delta?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number };
};

const approxTokens = (text: string) => Math.max(1, Math.round(text.trim().length / 4));

/**
 * Qwen3 is a hybrid-reasoning model: left alone it spends the reply budget
 * thinking. "/no_think" switches that off, which is what a chat answer wants.
 * Set VITE_AI_NO_THINK=1 when the model is served under another name (a
 * `models/Modelfile` wrapper, for example).
 */
function wantsNoThink(name: string): boolean {
  return /^qwen3/i.test(name) || String(import.meta.env.VITE_AI_NO_THINK ?? "") === "1";
}

/** A CPU-bound laptop spends most of its time reading the prompt, so only the last few turns go over. */
const HISTORY_LIMIT = 6;

/**
 * num_ctx is 4096 tokens, which is roughly 12k characters for this tokenizer.
 * A thread that once carried a long reply or a pasted file would otherwise push
 * the prompt past the window, and Ollama answers that with a 400 instead of a
 * reply — from then on every message in that thread fails.
 */
const HISTORY_CHAR_BUDGET = 5000;

type WireMessage = { role: "system" | "user" | "assistant"; content: string };

/** Newest turns first, stopping as soon as the character budget is spent. */
function recentHistory(history: ChatMessage[]): WireMessage[] {
  const kept: WireMessage[] = [];
  let used = 0;

  for (let index = history.length - 1; index >= 0 && kept.length < HISTORY_LIMIT; index--) {
    const message = history[index];
    const content = message.content.trim();
    if (!content) continue;

    const note = historyNote(message.attachments);
    if (used + content.length + note.length > HISTORY_CHAR_BUDGET) break;

    used += content.length + note.length;
    kept.unshift({ role: message.role, content: content + note });
  }

  return kept;
}

export async function* streamRealReply(opts: RealReplyOptions): AsyncGenerator<StreamEvent> {
  const started = Date.now();
  const controller = new AbortController();
  const name = opts.model ?? codeModel;

  // The file text rides along with the prompt rather than the stored message,
  // so a long attachment never gets re-sent with every later turn.
  const attachmentBlock = buildAttachmentBlock(opts.attachments ?? []);
  const promptWithFiles = attachmentBlock ? `${attachmentBlock}\n\n${opts.prompt}` : opts.prompt;

  const messages: WireMessage[] = [
    { role: "system", content: wantsNoThink(name) ? `${opts.system}\n\n/no_think` : opts.system },
    ...recentHistory(opts.history),
    { role: "user", content: promptWithFiles },
  ];

  // A thread that still overflows the context is retried with the current
  // message alone, so the person always gets an answer.
  const attempts: WireMessage[][] = [messages, [messages[0], messages[messages.length - 1]]];

  let response: Response | undefined;
  for (let attempt = 0; attempt < attempts.length; attempt++) {
    try {
      response = await fetch(chatUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: name,
          messages: attempts[attempt],
          stream: true,
          temperature: 0.4,
          // Small models on a CPU answer slowly; cap the reply so a demo stays watchable.
          max_tokens: 700,
        }),
        signal: controller.signal,
      });
    } catch (error) {
      const reason = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
      throw new Error(`could not reach ${chatUrl} (${reason})`);
    }

    if (response.ok) break;
    // Only an over-long prompt is worth retrying; anything else is a real error.
    const retryable = (response.status === 400 || response.status === 413) && attempt === 0;
    if (!retryable) break;
    response = undefined;
  }

  if (!response) throw new Error("no response from the model");

  if (!response.ok || !response.body) {
    const detail = (await response.text().catch(() => "")).slice(0, 300);
    throw new Error(`the model returned ${response.status}${detail ? `: ${detail}` : ""}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let ttft = 0;
  let usage: { in: number; out: number } | null = null;

  while (true) {
    if (opts.isCancelled()) {
      controller.abort();
      return;
    }

    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;

      let chunk: Chunk;
      try {
        chunk = JSON.parse(payload) as Chunk;
      } catch {
        continue;
      }

      if (chunk.usage) {
        usage = {
          in: chunk.usage.prompt_tokens ?? 0,
          out: chunk.usage.completion_tokens ?? 0,
        };
      }

      const delta = chunk.choices?.[0]?.delta?.content;
      if (!delta) continue;
      if (ttft === 0) ttft = Date.now() - started;
      text += delta;
      yield { type: "token", text: delta };
    }
  }

  if (opts.isCancelled()) return;

  yield {
    type: "done",
    usage: {
      in: usage?.in || approxTokens(opts.history.map((message) => message.content).join(" ") + opts.prompt),
      out: usage?.out || approxTokens(text),
    },
    latencyMs: Date.now() - started,
    ttftMs: ttft || Date.now() - started,
  };
}
