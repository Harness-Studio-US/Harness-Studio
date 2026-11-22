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
const model = String(import.meta.env.VITE_AI_MODEL ?? "").trim();

/**
 * Where the model answers. Locally that is Vite's /api/ollama proxy. A hosted
 * build (GitHub Pages) has no dev server, so it calls an absolute endpoint
 * instead — an HTTPS tunnel in front of Ollama on the machine running it.
 *   VITE_AI_ENDPOINT=https://model.example.com/v1
 */
const endpoint = String(import.meta.env.VITE_AI_ENDPOINT ?? "").trim().replace(/\/+$/, "");

const chatUrl = endpoint ? `${endpoint}/chat/completions` : "/api/ollama/chat/completions";

export const realModelName = model;

export function isRealEngineEnabled(): boolean {
  return model.length > 0;
}

export const CODE_SYSTEM_PROMPT = [
  "You are Harness Code, the coding chat inside Harness Studio.",
  "Answer with working code first, then at most three short sentences of notes.",
  "Rules:",
  "- Put every file in its own fenced block and tag the fence with the language (tsx, ts, sql, css, js, py, json) so it lands in the right project file.",
  "- One block per file, complete and paste-ready. No placeholders like '// rest of the code'.",
  "- If the question needs no code, answer in two or three sentences.",
  "- Never announce what you are about to do. Do it.",
  "- Keep comments rare and useful.",
  "Files:",
  "- To hand the user a file, put its complete contents in a fence that starts with the file name, like ```file:notes.md, with nothing else on that line.",
  "  The page turns that block into a file the user can download. One block per file, no commentary inside it.",
  "- Files the user attached arrive above their message between --- file: NAME --- markers. Read them and answer from them; never say you cannot see an attached file.",
].join("\n");

export const COPILOT_SYSTEM_PROMPT = [
  "You are Harness, the AI teammate inside Harness Studio.",
  "You help someone change how their project looks, fix what is not working, add a screen, or understand part of it.",
  "Be brief and concrete: two to five short sentences in plain language, no filler.",
  "Ask one question at the end only when you genuinely need it.",
  "Use Markdown when a list helps. Never invent details about their project.",
  "To hand the user a file, put its complete contents in a fence that starts with the file name, like ```file:notes.md, and the page turns it into a download.",
  "If the user attached a file, its text arrives above their message between --- file: NAME --- markers. Read it and answer from it.",
].join("\n");

export type RealReplyOptions = {
  system: string;
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
const noThink =
  /^qwen3/i.test(model) || String(import.meta.env.VITE_AI_NO_THINK ?? "") === "1";

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

  // The file text rides along with the prompt rather than the stored message,
  // so a long attachment never gets re-sent with every later turn.
  const attachmentBlock = buildAttachmentBlock(opts.attachments ?? []);
  const promptWithFiles = attachmentBlock ? `${attachmentBlock}\n\n${opts.prompt}` : opts.prompt;

  const messages: WireMessage[] = [
    { role: "system", content: noThink ? `${opts.system}\n\n/no_think` : opts.system },
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
          model,
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
