import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, BookOpen, Boxes, Check, Copy, KeyRound, Terminal } from "lucide-react";
import { Logo } from "../components/Logo";
import { Footer } from "../components/marketing/Footer";
import { CodeBlock } from "../components/CodeBlock";
import { DocsSidebar, useActiveHeading } from "../components/docs-ui";
import { models } from "../data/site";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "quickstart", label: "Quickstart" },
  { id: "authentication", label: "Authentication" },
  { id: "models", label: "Models" },
  { id: "chat-completions", label: "Chat completions" },
  { id: "parameters", label: "Parameters" },
  { id: "streaming", label: "Streaming" },
  { id: "tool-calling", label: "Tool calling" },
  { id: "structured-outputs", label: "Structured outputs" },
  { id: "embeddings", label: "Embeddings" },
  { id: "errors", label: "Errors" },
  { id: "rate-limits", label: "Rate limits" },
  { id: "sdks", label: "SDKs" },
  { id: "changelog", label: "Changelog" },
  { id: "status", label: "Status" },
];

const parameters = [
  ["model", "string", "required", "Model id, e.g. harness-code-1."],
  ["messages", "array", "required", "Conversation turns with role and content parts."],
  ["temperature", "number", "0.4", "0–2. Lower is more deterministic for code."],
  ["top_p", "number", "0.95", "Nucleus sampling. Tune this or temperature, not both."],
  ["top_k", "integer", "40", "Truncate the token distribution to the top k."],
  ["max_tokens", "integer", "2048", "Upper bound on generated tokens, including tool calls."],
  ["stream", "boolean", "false", "Return server-sent events instead of one JSON body."],
  ["tools", "array", "—", "Built-in tool types or function definitions with JSON Schema."],
  ["tool_choice", "string", "auto", "auto, required or none."],
  ["parallel_tool_calls", "boolean", "true", "Allow multiple tool calls in one assistant turn."],
  ["max_tool_rounds", "integer", "8", "Safety bound on the tool loop (1–20)."],
  ["response_format", "object", "text", "{ type: \"json_object\" } or a JSON Schema."],
  ["seed", "integer", null, "Best-effort deterministic sampling."],
  ["stop", "string[]", null, "Up to four stop sequences."],
  ["cache", "object", null, "{ type: \"ephemeral\" } marks a cacheable prefix."],
  ["metadata", "object", null, "Up to 16 key/value tags returned in logs and webhooks."],
];

const sdkSnippets = {
  install: `# TypeScript / JavaScript
npm install @harness-studio/sdk

# Python
pip install harness-sdk

# Any OpenAI SDK works too — just change the base URL.`,
  auth: `# .env
HARNESS_API_KEY=hns_live_xxxxxxxxxxxxxxxxxxxxxxxx

# Requests use a bearer token
Authorization: Bearer $HARNESS_API_KEY`,
  first: `import { Harness } from "@harness-studio/sdk";

const client = new Harness({ apiKey: process.env.HARNESS_API_KEY });

const res = await client.chat.completions.create({
  model: "harness-code-1",
  messages: [{ role: "user", content: "Why is my build slow?" }],
});

console.log(res.choices[0].message.content);`,
  stream: `const stream = await client.chat.completions.create({
  model: "harness-code-1",
  messages: [{ role: "user", content: "Draft a migration plan." }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}`,
  tools: `{
  "model": "harness-code-1",
  "messages": [{ "role": "user", "content": "Add tests for the auth module and run them." }],
  "tools": [
    { "type": "code_execution" },
    {
      "type": "function",
      "function": {
        "name": "read_file",
        "description": "Read a UTF-8 file in the repository",
        "parameters": {
          "type": "object",
          "properties": { "path": { "type": "string" } },
          "required": ["path"]
        }
      }
    }
  ],
  "tool_choice": "auto",
  "max_tool_rounds": 8
}`,
  toolResponse: `{
  "role": "tool",
  "tool_call_id": "call_01HZX…",
  "content": "{\\"path\\":\\"src/auth/session.ts\\",\\"lines\\":184}"
}`,
  structured: `{
  "model": "harness-code-1",
  "messages": [{ "role": "user", "content": "Extract the TODO items from this diff." }],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "todo_list",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "file": { "type": "string" },
                "line": { "type": "integer" },
                "summary": { "type": "string" }
              },
              "required": ["file", "line", "summary"],
              "additionalProperties": false
            }
          }
        },
        "required": ["items"],
        "additionalProperties": false
      }
    }
  }
}`,
  embed: `const res = await client.embeddings.create({
  model: "harness-embed-1",
  input: ["export function refreshSession() {}", "\\"use client\\""],
  dimensions: 1536,
});

console.log(res.data[0].embedding.length); // 1536`,
  errors: `HTTP/1.1 429 Too Many Requests
Retry-After: 12
X-Harness-Retry-After-Ms: 12000

{
  "error": {
    "type": "rate_limit_error",
    "code": "tokens_per_minute_exceeded",
    "message": "Token limit reached for harness-code-1. Retry after 12s.",
    "request_id": "req_01HZX8K2"
  }
}`,
};

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-slate-200 py-9 first:border-0 first:pt-2">
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">{title}</h2>
      <div className="mt-4 space-y-4 text-[13px] leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded border border-slate-200 bg-slate-100 px-1 py-0.5 font-mono text-[11.5px] text-violet-700">
      {children}
    </code>
  );
}

export default function Docs() {
  const active = useActiveHeading(sections.map((s) => s.id));

  useEffect(() => {
    document.title = "Docs — Harness Studio";
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#f7f8fb]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-5">
            <Link to="/" aria-label="Harness Studio home">
              <Logo />
            </Link>
            <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            <div className="hidden items-center gap-1.5 text-[12px] text-slate-600 sm:flex">
              <BookOpen className="h-3.5 w-3.5" />
              Docs
              <span className="text-slate-400">/</span>
              <span className="text-slate-500">Harness Code API</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] text-slate-600 hover:text-slate-900 sm:flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </Link>
            <Link to="/console" className="btn-primary h-8 px-3 text-[12px]">
              Open console
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              On this page
            </div>
            <DocsSidebar sections={sections} active={active} />
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                <Terminal className="h-3 w-3 text-violet-600" />
                Need a key?
              </div>
              <p className="mt-1 text-[10.5px] leading-relaxed text-slate-400">
                Create a scoped key in the console, then try the request playground.
              </p>
              <Link to="/console" className="mt-2 inline-flex text-[10.5px] text-violet-700">
                Open API keys →
              </Link>
            </div>
          </div>
        </aside>

        <article className="min-w-0 max-w-3xl">
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              API v1 · stable
            </div>
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
              Harness Code API
            </h1>
            <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-slate-600">
              An OpenAI-compatible API for the agentic coding model from Harness Studio. Streaming,
              tool calling, structured outputs and prompt caching — on one base URL.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/console" className="btn-primary h-9 px-3.5 text-[12px]">
                <KeyRound className="h-3.5 w-3.5" />
                Get an API key
              </Link>
              <a href="#quickstart" className="btn-ghost h-9 px-3.5 text-[12px]">
                Quickstart
              </a>
            </div>
          </div>

          <Section id="introduction" title="Introduction">
            <p>
              Harness Code is optimized for software engineering: it plans before editing, keeps
              changes minimal and verifies with tools. The API mirrors OpenAI&apos;s Chat Completions
              schema, so the OpenAI SDK, Vercel AI SDK or LangChain client you already use works after
              a base URL change.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { title: "Base URL", body: "https://api.harness.studio/v1" },
                { title: "Format", body: "JSON + server-sent events" },
                { title: "Auth", body: "Bearer API key" },
              ].map((item) => (
                <div key={item.title} className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">{item.title}</div>
                  <div className="mt-1 break-all font-mono text-[11px] text-slate-700">{item.body}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-[12px] text-slate-600">
              Sandbox requests go to <InlineCode>https://api.harness.studio/v1/sandbox</InlineCode> and
              never touch production data or billing.
            </div>
          </Section>

          <Section id="quickstart" title="Quickstart">
            <p>Three steps, no CLI required.</p>
            <ol className="list-decimal space-y-2 pl-5 text-[12.5px] text-slate-600">
              <li>Create an API key in the console (Settings → API keys).</li>
              <li>Install the SDK or point an OpenAI client at the Harness base URL.</li>
              <li>Send a chat completion. Add tools only when you want the agent loop.</li>
            </ol>
            <CodeBlock code={sdkSnippets.install} lang="bash" filename="install.sh" />
            <CodeBlock code={sdkSnippets.first} lang="ts" filename="first-request.ts" />
            <p className="text-[12px] text-slate-500">
              Every response includes <InlineCode>x-request-id</InlineCode>,{" "}
              <InlineCode>x-harness-version</InlineCode> and token usage. Use the request id when
              contacting support.
            </p>
          </Section>

          <Section id="authentication" title="Authentication">
            <p>
              Pass a workspace key as a bearer token. Keys are scoped to an environment and a set of
              scopes; a sandbox key cannot call production.
            </p>
            <CodeBlock code={sdkSnippets.auth} lang="bash" filename="auth.sh" />
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Scope</th>
                    <th className="px-3 py-2">Allows</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  {[
                    ["chat:write", "Create completions and streams"],
                    ["models:read", "List models and read metadata"],
                    ["files:write", "Upload files for file_search"],
                    ["logs:read", "Read request logs and usage"],
                  ].map(([scope, allows]) => (
                    <tr key={scope}>
                      <td className="px-3 py-2 font-mono text-[11px] text-violet-700">{scope}</td>
                      <td className="px-3 py-2">{allows}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Rotate keys regularly. Revocation is immediate across all regions; in-flight requests
              finish but new ones fail with <InlineCode>401</InlineCode>.
            </p>
          </Section>

          <Section id="models" title="Models">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[520px] text-left text-[12px]">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Model</th>
                    <th className="px-3 py-2">Context</th>
                    <th className="px-3 py-2">Max output</th>
                    <th className="px-3 py-2">Input / M</th>
                    <th className="px-3 py-2">Output / M</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {models.map((model) => (
                    <tr key={model.id} className="text-slate-600">
                      <td className="px-3 py-2.5">
                        <div className="font-mono text-[11px] text-slate-800">{model.id}</div>
                        <div className="text-[10px] text-slate-400">{model.tagline}</div>
                      </td>
                      <td className="px-3 py-2.5">{model.context}</td>
                      <td className="px-3 py-2.5">{model.maxOutput || "—"}</td>
                      <td className="px-3 py-2.5">${model.inputPrice}</td>
                      <td className="px-3 py-2.5">${model.outputPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              <InlineCode>harness-embed-1</InlineCode> is embeddings-only and does not accept chat
              messages. Deprecated ids keep working for 90 days after the successor ships.
            </p>
          </Section>

          <Section id="chat-completions" title="Chat completions">
            <div className="rounded-lg border border-slate-200 bg-white p-3 font-mono text-[11.5px]">
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                POST
              </span>{" "}
              <span className="text-slate-700">/v1/chat/completions</span>
            </div>
            <p>
              The request body follows the OpenAI schema. Responses contain{" "}
              <InlineCode>choices[0].message</InlineCode>, optional{" "}
              <InlineCode>tool_calls</InlineCode>, and a <InlineCode>usage</InlineCode> object with
              cached-token details.
            </p>
            <CodeBlock
              code={`{
  "id": "chatcmpl_9f2c…",
  "object": "chat.completion",
  "model": "harness-code-1",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The cookie is scoped to /auth — set Path=/."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 4820,
    "completion_tokens": 612,
    "total_tokens": 5432,
    "cache_read_input_tokens": 4096
  }
}`}
              lang="json"
              filename="response.json"
            />
          </Section>

          <Section id="parameters" title="Parameters">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[600px] text-left text-[12px]">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Field</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Default</th>
                    <th className="px-3 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {parameters.map(([field, type, def, notes]) => (
                    <tr key={String(field)} className="text-slate-600">
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-violet-700">
                        {field}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-500">{type}</td>
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-slate-500">
                        {def ?? "—"}
                      </td>
                      <td className="px-3 py-2">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[12px] text-slate-500">
              Unknown fields are rejected with <InlineCode>400 invalid_request_error</InlineCode> so
              typos never silently change behaviour.
            </p>
          </Section>

          <Section id="streaming" title="Streaming">
            <p>
              Set <InlineCode>stream: true</InlineCode> to receive server-sent events. Deltas contain
              choices with partial content; the final data frame carries usage before{" "}
              <InlineCode>[DONE]</InlineCode>.
            </p>
            <CodeBlock
              code={`event: response.output_text.delta
data: {"id":"chatcmpl_9f2c","choices":[{"index":0,"delta":{"content":"The cookie "}}]}

event: response.output_text.delta
data: {"id":"chatcmpl_9f2c","choices":[{"index":0,"delta":{"content":"is scoped "}}]}

event: response.completed
data: {"usage":{"prompt_tokens":4820,"completion_tokens":612}}

data: [DONE]`}
              lang="text"
              filename="stream.txt"
            />
            <CodeBlock code={sdkSnippets.stream} lang="ts" filename="stream.ts" />
            <p className="text-[12px] text-slate-500">
              Disconnect by closing the response body; the server stops generation within one token.
              Keep-alive comments are sent every 15 seconds during long tool calls.
            </p>
          </Section>

          <Section id="tool-calling" title="Tool calling">
            <p>
              Tools come in two flavours: built-in types (<InlineCode>code_execution</InlineCode>,{" "}
              <InlineCode>web_search</InlineCode>, <InlineCode>file_search</InlineCode>,{" "}
              <InlineCode>browser</InlineCode>) and functions you declare with JSON Schema. The loop is
              yours to run — execute tool calls, append results as <InlineCode>role: &quot;tool&quot;</InlineCode>{" "}
              messages, and call again until <InlineCode>finish_reason</InlineCode> is{" "}
              <InlineCode>stop</InlineCode>.
            </p>
            <CodeBlock code={sdkSnippets.tools} lang="json" filename="tools-request.json" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-800">
                  <Boxes className="h-3 w-3 text-violet-600" />
                  Assistant emits a call
                </div>
                <pre className="overflow-x-auto font-mono text-[10.5px] leading-relaxed text-slate-500">{`{
  "tool_calls": [{
    "id": "call_01HZX…",
    "type": "function",
    "function": {
      "name": "read_file",
      "arguments": "{\\"path\\":\\"src/auth/session.ts\\"}"
    }
  }],
  "finish_reason": "tool_calls"
}`}</pre>
              </div>
              <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
                <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-800">
                  <Check className="h-3 w-3 text-emerald-600" />
                  Your runtime replies
                </div>
                <pre className="overflow-x-auto font-mono text-[10.5px] leading-relaxed text-slate-500">
                  {sdkSnippets.toolResponse}
                </pre>
              </div>
            </div>
            <p>
              Built-in tools execute inside our sandbox and return their results inline, so no
              round-trip is needed. Set <InlineCode>max_tool_rounds</InlineCode> to bound loops; when
              hit, the response ends with <InlineCode>finish_reason: &quot;tool_limit&quot;</InlineCode>.
            </p>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[12px] text-slate-600">
              Function arguments are untrusted model output. Validate them against your schema and
              enforce authorization server-side before running anything.
            </div>
          </Section>

          <Section id="structured-outputs" title="Structured outputs">
            <p>
              Pass a JSON Schema with <InlineCode>strict: true</InlineCode> and the model is constrained
              to produce matching JSON. Invalid schemas are rejected at request time, not mid-stream.
            </p>
            <CodeBlock code={sdkSnippets.structured} lang="json" filename="json-schema-request.json" />
            <p className="text-[12px] text-slate-500">
              Supported keywords: type, properties, required, additionalProperties, items, enum,
              anyOf, minimum, maximum, pattern. Refs are inlined automatically.
            </p>
          </Section>

          <Section id="embeddings" title="Embeddings">
            <p>
              Harness Embed 1 maps code, docs and tickets into one 1536-dimensional space. Batch up to
              256 inputs per request.
            </p>
            <CodeBlock code={sdkSnippets.embed} lang="ts" filename="embeddings.ts" />
          </Section>

          <Section id="errors" title="Errors">
            <p>
              Errors use a stable shape and always include a request id. Retry{" "}
              <InlineCode>429</InlineCode> and <InlineCode>5xx</InlineCode> with exponential backoff
              and jitter; do not retry other 4xx.
            </p>
            <CodeBlock code={sdkSnippets.errors} lang="http" filename="error.txt" />
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Code</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  {[
                    ["400", "invalid_request_error", "Malformed body, unknown field or bad tool schema"],
                    ["401", "authentication_error", "Missing, revoked or environment-mismatched key"],
                    ["403", "permission_error", "Key lacks the required scope"],
                    ["404", "not_found_error", "Unknown model id"],
                    ["413", "context_length_exceeded", "Prompt is larger than the model window"],
                    ["429", "rate_limit_error", "RPM, TPM or concurrency cap reached"],
                    ["500", "server_error", "Unexpected inference failure — retry"],
                  ].map(([code, type, meaning]) => (
                    <tr key={code}>
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-700">{code}</td>
                      <td className="whitespace-nowrap px-3 py-2 font-mono text-[10.5px] text-violet-700">
                        {type}
                      </td>
                      <td className="px-3 py-2">{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="rate-limits" title="Rate limits">
            <p>
              Limits apply per workspace and reset on a rolling window. Headers{" "}
              <InlineCode>x-ratelimit-remaining-requests</InlineCode> and{" "}
              <InlineCode>x-ratelimit-remaining-tokens</InlineCode> are returned on every response.
            </p>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Plan</th>
                    <th className="px-3 py-2">Requests / min</th>
                    <th className="px-3 py-2">Tokens / min</th>
                    <th className="px-3 py-2">Concurrency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  {[
                    ["Starter", "60", "60,000", "8"],
                    ["Pro", "600", "1,000,000", "64"],
                    ["Enterprise", "Custom", "Reserved", "Custom"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td key={i} className={`px-3 py-2 ${i === 0 ? "text-slate-800" : ""}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[12px] text-slate-500">
              Batch requests are metered separately and do not count against interactive limits.
            </p>
          </Section>

          <Section id="sdks" title="SDKs">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["TypeScript", "@harness-studio/sdk", "Node 18+, Bun, Deno, Workers"],
                ["Python", "harness-sdk", "Python 3.9+"],
                ["OpenAI SDK", "openai", "Any language — change base_url"],
              ].map(([title, pkg, note]) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="text-[12px] font-medium text-slate-800">{title}</div>
                  <div className="mt-1 font-mono text-[10.5px] text-violet-700">{pkg}</div>
                  <div className="mt-1 text-[10.5px] text-slate-400">{note}</div>
                </div>
              ))}
            </div>
            <CodeBlock code={sdkSnippets.install} lang="bash" filename="install.sh" />
          </Section>

          <Section id="changelog" title="Changelog">
            <div className="space-y-4">
              {[
                {
                  date: "2026-11-02",
                  title: "Harness Code 1.2",
                  items: [
                    "Parallel tool calls enabled by default.",
                    "Code execution sandbox now supports Node 24 and Python 3.13.",
                    "Cached input is billed at 10% across Code and Reason models.",
                  ],
                },
                {
                  date: "2026-09-18",
                  title: "JSON Schema structured outputs",
                  items: [
                    "Strict schema mode for chat completions.",
                    "Tool argument validation with typed error paths.",
                  ],
                },
                {
                  date: "2026-08-04",
                  title: "Prompt caching GA",
                  items: ["Ephemeral cache blocks with usage reporting.", "90% discount on cache reads."],
                },
              ].map((entry) => (
                <div key={entry.date} className="rounded-lg border border-slate-200 bg-white p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12.5px] font-medium text-slate-800">{entry.title}</span>
                    <span className="font-mono text-[10px] text-slate-400">{entry.date}</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {entry.items.map((item) => (
                      <li key={item} className="flex gap-2 text-[11.5px] text-slate-500">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400/70" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section id="status" title="Status">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <div>
                  <div className="text-[12.5px] font-medium text-slate-900">All systems operational</div>
                  <div className="text-[10.5px] text-slate-500">API, console and batch processing · checked just now</div>
                </div>
              </div>
              <div className="flex items-end gap-0.5" aria-hidden>
                {[70, 85, 76, 92, 88, 95, 90, 100, 84, 96, 92, 99].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-sm bg-emerald-400/60"
                    style={{ height: `${h * 0.18}px` }}
                  />
                ))}
              </div>
            </div>
            <p className="text-[11.5px] text-slate-400">
              Subscribe to incidents at status.harness.studio, or receive delivery events through
              webhooks from the console.
            </p>
          </Section>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-[12px] text-slate-500">
              <Copy className="h-3.5 w-3.5" />
              Found something unclear? Tell us in the console feedback bar.
            </div>
            <Link to="/console" className="btn-primary h-9 px-4 text-[12px]">
              Try it in the console
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
