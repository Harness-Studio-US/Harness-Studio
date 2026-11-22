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

export async function* streamRealReply(opts: RealReplyOptions): AsyncGenerator<StreamEvent> {
  const started = Date.now();
  const controller = new AbortController();

  // The file text rides along with the prompt rather than the stored message,
  // so a long attachment never gets re-sent with every later turn.
  const attachmentBlock = buildAttachmentBlock(opts.attachments ?? []);
  const promptWithFiles = attachmentBlock ? `${attachmentBlock}\n\n${opts.prompt}` : opts.prompt;

  const messages = [
    { role: "system" as const, content: noThink ? `${opts.system}\n\n/no_think` : opts.system },
    ...opts.history
      .filter((message) => message.content.trim().length > 0)
      .slice(-HISTORY_LIMIT)
      .map((message) => ({
        role: message.role,
        content: message.content + historyNote(message.attachments),
      })),
    { role: "user" as const, content: promptWithFiles },
  ];

  let response: Response;
  try {
    response = await fetch(chatUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.4,
        // Small models on a CPU answer slowly; cap the reply so a demo stays watchable.
        max_tokens: 700,
      }),
      signal: controller.signal,
    });
  } catch {
    throw new Error(`No answer from the model. Is \`ollama serve\` running and \`${model}\` pulled?`);
  }

  if (!response.ok || !response.body) {
    const detail = (await response.text().catch(() => "")).slice(0, 200);
    throw new Error(`The model returned ${response.status}${detail ? `: ${detail}` : ""}`);
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
