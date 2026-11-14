import type { Settings, ToolFlags } from "./settings";

export const API_BASE = {
  production: "https://api.harness.studio/v1",
  sandbox: "https://api.harness.studio/v1/sandbox",
} as const;

const toolNames: Record<keyof ToolFlags, string> = {
  web: "web_search",
  code: "code_execution",
  files: "file_search",
  browser: "browser",
};

export function enabledTools(tools: ToolFlags): string[] {
  return (Object.keys(toolNames) as Array<keyof ToolFlags>)
    .filter((key) => tools[key])
    .map((key) => toolNames[key]);
}

export const DEFAULT_TEST_PROMPT =
  "Explain why a Node.js test can pass locally but time out in CI. Keep it under 120 words.";

export function buildRequestBody(
  settings: Settings,
  prompt: string = DEFAULT_TEST_PROMPT,
  modelOverride?: string
): Record<string, unknown> {
  const tools = enabledTools(settings.tools);
  const body: Record<string, unknown> = {
    model: modelOverride ?? settings.model,
    messages: [
      ...(settings.systemPrompt.trim()
        ? [{ role: "system", content: settings.systemPrompt.trim() }]
        : []),
      { role: "user", content: prompt },
    ],
    temperature: Number(settings.temperature.toFixed(2)),
    top_p: Number(settings.topP.toFixed(2)),
    top_k: settings.topK,
    max_tokens: settings.maxTokens,
    presence_penalty: Number(settings.presencePenalty.toFixed(1)),
    frequency_penalty: Number(settings.frequencyPenalty.toFixed(1)),
    stream: settings.stream,
    response_format: { type: settings.responseFormat },
  };

  if (settings.seed !== null) body.seed = settings.seed;
  const stop = settings.stop
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (stop.length) body.stop = stop;
  if (tools.length) body.tools = tools.map((type) => ({ type }));
  if (settings.toolChoice !== "auto") body.tool_choice = settings.toolChoice;
  body.max_tool_rounds = settings.maxToolRounds;
  body.parallel_tool_calls = settings.parallelTools;
  if (settings.cacheEnabled) body.cache = { type: "ephemeral" };
  body.metadata = { surface: "console.playground" };

  return body;
}

export function buildCurl(settings: Settings, prompt?: string): string {
  const base = API_BASE[settings.environment];
  return `curl ${base}/chat/completions \\
  -H "Authorization: Bearer $HARNESS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(buildRequestBody(settings, prompt), null, 2)}'`;
}

export function buildTypeScript(settings: Settings, prompt?: string): string {
  const base = API_BASE[settings.environment];
  const body = buildRequestBody(settings, prompt);
  return `import OpenAI from "openai";

const harness = new OpenAI({
  apiKey: process.env.HARNESS_API_KEY,
  baseURL: "${base}",
});

const response = await harness.chat.completions.create(${JSON.stringify(body, null, 2)});

${settings.stream ? `for await (const chunk of response) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}` : `console.log(response.choices[0]?.message?.content);`}`;
}

export function buildPython(settings: Settings, prompt?: string): string {
  const base = API_BASE[settings.environment];
  const tools = enabledTools(settings.tools);
  const messages = [
    ...(settings.systemPrompt.trim()
      ? [`        {"role": "system", "content": ${JSON.stringify(settings.systemPrompt.trim())}},`]
      : []),
    `        {"role": "user", "content": ${JSON.stringify(prompt ?? DEFAULT_TEST_PROMPT)}},`,
  ].join("\n");

  return `import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["HARNESS_API_KEY"],
    base_url="${base}",
)

response = client.chat.completions.create(
    model="${settings.model}",
    messages=[
${messages}
    ],
    temperature=${Number(settings.temperature.toFixed(2))},
    top_p=${Number(settings.topP.toFixed(2))},
    max_tokens=${settings.maxTokens},${tools.length ? `\n    tools=${JSON.stringify(tools.map((type) => ({ type }))).replace(/"/g, '"')},` : ""}
    stream=${settings.stream ? "True" : "False"},
)

${settings.stream ? `for chunk in response:
    print(chunk.choices[0].delta.content or "", end="")` : `print(response.choices[0].message.content)`}`;
}
