import type { ChatMessage, StreamEvent, ToolCall, ToolName } from "./chat";

/** A reply an engine has already decided on; this module only streams it. */
export type ReplyPlan = {
  prompt: string;
  history: ChatMessage[];
  thinking: string[];
  tools: { name: ToolName; label: string; args: Record<string, unknown>; result: string }[];
  body: string;
  isCancelled: () => boolean;
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

export function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.trim().length / 4));
}

/**
 * Streams a prepared reply: thinking steps, tool calls, then the answer in
 * small token groups. Harness Copilot and Harness Code both go through here so
 * the two chats behave identically on screen.
 */
export async function* streamReply(plan: ReplyPlan): AsyncGenerator<StreamEvent> {
  const { prompt, body, isCancelled } = plan;
  const started = Date.now();

  await sleep(240);

  for (const step of plan.thinking) {
    if (isCancelled()) return;
    yield { type: "thinking", text: step };
    await sleep(160 + Math.random() * 150);
  }

  for (const tool of plan.tools) {
    if (isCancelled()) return;
    const call: ToolCall = {
      id: newId(),
      name: tool.name,
      label: tool.label,
      args: tool.args,
      status: "running",
    };
    yield { type: "tool", call };
    await sleep(480 + Math.random() * 460);
    if (isCancelled()) return;
    const durationMs = Math.round(480 + Math.random() * 640);
    yield { type: "tool_result", id: call.id, result: tool.result, durationMs };
    call.status = "done";
  }

  await sleep(160);
  let ttft = 0;
  const tokens = body.match(/\S+\s*/g) ?? [];
  let buffer = "";
  for (let i = 0; i < tokens.length; i += 1) {
    if (isCancelled()) return;
    if (i === 0) ttft = Date.now() - started;
    // Emit small groups of words so streaming feels natural.
    buffer += tokens[i];
    if (buffer.length > 8 || i === tokens.length - 1) {
      yield { type: "token", text: buffer };
      buffer = "";
      await sleep(12 + Math.random() * 18);
    }
  }

  yield {
    type: "done",
    usage: {
      in: estimateTokens(plan.history.map((message) => message.content).join(" ") + prompt),
      out: estimateTokens(body),
    },
    latencyMs: Date.now() - started,
    ttftMs: ttft || 320,
  };
}
