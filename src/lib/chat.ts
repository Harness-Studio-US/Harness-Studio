import type { Settings, ToolFlags } from "./settings";

export type ToolName =
  | "web_search"
  | "code_execution"
  | "file_search"
  | "browser";

export type ToolCall = {
  id: string;
  name: ToolName;
  label: string;
  args: Record<string, unknown>;
  status: "running" | "done";
  result?: string;
  durationMs?: number;
};

export type ChatUsage = { in: number; out: number };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  thinking?: string[];
  toolCalls?: ToolCall[];
  usage?: ChatUsage;
  latencyMs?: number;
  error?: boolean;
  stopped?: boolean;
};

export type StreamEvent =
  | { type: "thinking"; text: string }
  | { type: "tool"; call: ToolCall }
  | { type: "tool_result"; id: string; result: string; durationMs: number }
  | { type: "token"; text: string }
  | {
      type: "done";
      usage: ChatUsage;
      latencyMs: number;
      ttftMs: number;
    };

type StreamOptions = {
  prompt: string;
  settings: Settings;
  history: ChatMessage[];
  isCancelled: () => boolean;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.trim().length / 4));
}

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

function activeTools(tools: ToolFlags): ToolName[] {
  const out: ToolName[] = [];
  if (tools.web) out.push("web_search");
  if (tools.code) out.push("code_execution");
  if (tools.files) out.push("file_search");
  if (tools.browser) out.push("browser");
  return out;
}

type Intent =
  | "greeting"
  | "debug"
  | "api"
  | "database"
  | "component"
  | "default";

function detectIntent(prompt: string): Intent {
  const p = prompt.toLowerCase();
  if (/^(hi|hey|hello|yo|good (morning|evening))\b/.test(p.trim()) || p.trim().length < 12)
    return "greeting";
  if (/(bug|error|fail|broken|crash|stack trace|debug|why does|not working)/.test(p))
    return "debug";
  if (/(api|sdk|endpoint|integrat|openai|webhook|curl|fetch)/.test(p)) return "api";
  if (/(sql|database|schema|postgres|migration|index|query)/.test(p)) return "database";
  if (/(react|component|hook|ui|tailwind|frontend|state)/.test(p)) return "component";
  return "default";
}

function thinkingFor(intent: Intent, tools: ToolName[]): string[] {
  const base = [
    "Parsing the request and identifying the affected surface area.",
    "Checking the repository conventions and existing dependencies.",
  ];
  if (tools.includes("web_search")) base.push("Looking up current upstream documentation before proposing an API.");
  if (tools.includes("code_execution")) base.push("Planning a small verification run before recommending the change.");
  if (intent === "debug") base.push("Reproducing the failure path and isolating the first incorrect state.");
  if (intent === "database") base.push("Reviewing the schema for locking and rollback behaviour.");
  if (intent === "api") base.push("Validating the request/response shape against the published spec.");
  base.push("Drafting a minimal, reversible patch with tests.");
  return base.slice(0, intent === "greeting" ? 2 : 6);
}

function toolPlan(intent: Intent, tools: ToolName[]): ToolName[] {
  const plan: ToolName[] = [];
  if (intent === "greeting") return plan;
  if (tools.includes("code_execution") && (intent === "debug" || intent === "database" || intent === "default")) {
    plan.push("code_execution");
  }
  if (tools.includes("file_search") && (intent === "debug" || intent === "component")) {
    plan.push("file_search");
  }
  if (tools.includes("web_search") && intent === "api") {
    plan.push("web_search");
  }
  if (tools.includes("browser") && intent === "api") {
    plan.push("browser");
  }
  return plan.slice(0, 2);
}

const toolMeta: Record<ToolName, { label: string; args: (prompt: string) => Record<string, unknown>; result: string }> = {
  web_search: {
    label: "Web search",
    args: (prompt) => ({ query: prompt.slice(0, 90), freshness: "2026", top_k: 5 }),
    result: "5 results · docs.harness.studio, openai.com, nodejs.org · citations attached",
  },
  code_execution: {
    label: "Code execution",
    args: () => ({ language: "node", command: "npm test -- --runInBand", timeout_ms: 120000 }),
    result: "Sandbox exited 0 · 34 tests passed · no regressions in auth or session modules",
  },
  file_search: {
    label: "File search",
    args: () => ({ query: "auth session refresh token rotation", repo: "acme/platform", path: "src/server/auth" }),
    result: "Matched 6 files · src/server/auth/session.ts, tokens.ts, middleware.ts",
  },
  browser: {
    label: "Browser",
    args: (prompt) => ({ url: "https://docs.harness.studio/api/tool-calling", action: "extract", query: prompt.slice(0, 60) }),
    result: "Fetched page (42KB) · extracted the tool-calling contract and limits table",
  },
};

const greetingResponse = [
  "Hey — Harness Code here.",
  "",
  "I'm the agentic coding model from **Harness Studio**. I can plan multi-file changes, run code, search your repo and browse docs before I answer. Right now you're talking to the in-console demo engine, so responses are local and deterministic.",
  "",
  "Things worth trying:",
  "- `Debug why my session cookie isn't refreshing`",
  "- `Add rate limiting to the /api/chat route`",
  "- `Write a Postgres migration for soft-deleted users`",
  "",
  "Open **Settings** to change the model, sampling parameters, built-in tools and API keys. Dev tools there will generate a live request body and SDK snippet for whatever you configure.",
].join("\n");

const debugResponse = [
  "Short answer: the refresh cookie is being set on the response but dropped by the browser because its `Path` is scoped to `/auth`, while the refresh call happens at `/`. The session never refreshes, so the access token expires and the next request 401s.",
  "",
  "### What I'd check, in order",
  "1. The `Set-Cookie` attributes on `POST /auth/login` — is `Path=/` present?",
  "2. Whether `SameSite=Lax` blocks the cross-site refresh during a top-level navigation.",
  "3. Clock skew between the signing service and the API (JWT `nbf`).",
  "",
  "### Minimal fix",
  "```ts",
  "// src/server/auth/session.ts",
  "export function setRefreshCookie(res: Response, token: string) {",
  "  res.headers.append(",
  "    \"Set-Cookie\",",
  "    serialize(\"refresh_token\", token, {",
  "      httpOnly: true,",
  "      secure: process.env.NODE_ENV === \"production\",",
  "      sameSite: \"lax\",",
  "      path: \"/\",              // was \"/auth\" — the refresh call was never sent",
  "      maxAge: 60 * 60 * 24 * 30,",
  "    }),",
  "  );",
  "}",
  "```",
  "",
  "Then add a regression test so this does not come back:",
  "",
  "```ts",
  "it(\"sends the refresh cookie for every API path\", async () => {",
  "  const res = await request(app).post(\"/auth/login\").send(creds);",
  "  const cookie = res.headers[\"set-cookie\"][0];",
  "  expect(cookie).toContain(\"Path=/\");",
  "  expect(cookie).toContain(\"HttpOnly\");",
  "});",
  "```",
  "",
  "Two things worth verifying before you deploy: rotate the refresh token on every use (one-time tokens stop replay), and keep a short overlap window so concurrent tabs don't invalidate each other.",
].join("\n");

const apiResponse = [
  "Use the OpenAI SDK — Harness is wire-compatible, so the change is the base URL and the model name.",
  "",
  "```ts",
  "import OpenAI from \"openai\";",
  "",
  "const harness = new OpenAI({",
  "  apiKey: process.env.HARNESS_API_KEY,",
  "  baseURL: \"https://api.harness.studio/v1\",",
  "});",
  "",
  "const res = await harness.chat.completions.create({",
  "  model: \"harness-code-1\",",
  "  messages: [{ role: \"user\", content: \"Summarise this diff\" }],",
  "  stream: true,",
  "  tools: [",
  "    {",
  "      type: \"function\",",
  "      function: {",
  "        name: \"run_tests\",",
  "        description: \"Run the test suite for a package\",",
  "        parameters: {",
  "          type: \"object\",",
  "          properties: { pkg: { type: \"string\" } },",
  "          required: [\"pkg\"],",
  "        },",
  "      },",
  "    },",
  "  ],",
  "});",
  "```",
  "",
  "Notes that save time:",
  "- Send `X-Harness-Tools: web_search,code_execution` to enable built-in tools without declaring schemas.",
  "- Cached prefixes are 90% cheaper; keep your system prompt at the start and stable.",
  "- Use `max_tool_rounds` (1–20) to bound agent loops; the API returns `finish_reason: \"tool_limit\"` when it stops.",
  "- Errors are OpenAI-shaped: `429` includes `retry_after_ms`, `413` means the context window was exceeded.",
  "",
  "In the panel, open **Dev tools → Playground** and the request body will mirror this message's settings exactly.",
].join("\n");

const databaseResponse = [
  "Here's a migration that is safe to run while the table is online.",
  "",
  "```sql",
  "-- 1. add the column without a default (no table rewrite on PG 11+)",
  "ALTER TABLE users ADD COLUMN deleted_at timestamptz;",
  "",
  "-- 2. index the common query shape",
  "CREATE INDEX CONCURRENTLY users_active_idx",
  "  ON users (id) WHERE deleted_at IS NULL;",
  "",
  "-- 3. backfill in batches from your job runner, then enforce",
  "ALTER TABLE users",
  "  ADD CONSTRAINT users_deleted_at_check",
  "  CHECK (deleted_at IS NULL OR deleted_at <= now());",
  "```",
  "",
  "If your ORM hides soft-deleted rows, make the scope explicit rather than global — global scopes make admin tooling surprising. In Drizzle:",
  "",
  "```ts",
  "export const activeUsers = db",
  "  .select()",
  "  .from(users)",
  "  .where(isNull(users.deletedAt));",
  "```",
  "",
  "Two gotchas: `CREATE INDEX CONCURRENTLY` cannot run inside a transaction (use `migration_mode = \"single\"`), and a partial index only helps if every hot query includes `deleted_at IS NULL`. If you also filter by `team_id`, make it a composite partial index instead.",
].join("\n");

const componentResponse = [
  "I'd keep the state local and derive the expensive part instead of syncing it. Here's a pattern that scales well for a filterable, paginated list:",
  "",
  "```tsx",
  "export function ResultList({ rows }: { rows: Row[] }) {",
  "  const [query, setQuery] = useState(\"\");",
  "  const deferred = useDeferredValue(query);",
  "",
  "  const visible = useMemo(() => {",
  "    const q = deferred.trim().toLowerCase();",
  "    if (!q) return rows;",
  "    return rows.filter((r) => r.name.toLowerCase().includes(q));",
  "  }, [rows, deferred]);",
  "",
  "  return (",
  "    <div className=\"flex flex-col gap-2\">",
  "      <input",
  "        value={query}",
  "        onChange={(e) => setQuery(e.target.value)}",
  "        placeholder=\"Filter results\"",
  "        className=\"rounded-md border px-3 py-2\"",
  "      />",
  "      <ul>",
  "        {visible.map((row) => (",
  "          <li key={row.id}>{row.name}</li>",
  "        ))}",
  "      </ul>",
  "    </div>",
  "  );",
  "}",
  "```",
  "",
  "Why this shape: `useDeferredValue` keeps typing responsive when the list is large, and computing `visible` during render avoids a stale copy in state. If the list grows past a few thousand rows, move filtering to the server and debounce the request instead — remember to cancel in-flight requests.",
  "",
  "One accessibility fix while you're here: give the input a label and an `aria-describedby` count, otherwise screen readers won't announce how many results the filter produced.",
].join("\n");

const defaultResponse = [
  "Here's how I'd approach it, with the smallest change that is easy to review.",
  "",
  "### Plan",
  "1. Add the capability behind a feature flag so it can be reverted without a deploy.",
  "2. Keep the new path pure and unit-test the edge cases before wiring it to the UI.",
  "3. Ship it dark, verify with real traffic, then flip the flag.",
  "",
  "```ts",
  "type RateLimitOptions = { limit: number; windowMs: number };",
  "",
  "export function createRateLimiter({ limit, windowMs }: RateLimitOptions) {",
  "  const hits = new Map<string, number[]>();",
  "",
  "  return function allow(key: string): boolean {",
  "    const now = Date.now();",
  "    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);",
  "    recent.push(now);",
  "    hits.set(key, recent);",
  "    return recent.length <= limit;",
  "  };",
  "}",
  "```",
  "",
  "That in-memory version is fine for a single process. In production, use Redis with a sliding window or a token bucket, and return `RateLimit-*` headers so clients can back off politely:",
  "",
  "```ts",
  "if (!allow(userId)) {",
  "  return new Response(\"slow down\", {",
  "    status: 429,",
  "    headers: { \"Retry-After\": \"30\" },",
  "  });",
  "}",
  "```",
  "",
  "If you share the route handler and the target environment, I can turn this into a concrete diff instead of a sketch. Toggle the built-in tools in **Settings → Tools** and I'll run the tests against your sandbox.",
].join("\n");

const responses: Record<Intent, string> = {
  greeting: greetingResponse,
  debug: debugResponse,
  api: apiResponse,
  database: databaseResponse,
  component: componentResponse,
  default: defaultResponse,
};

async function* streamSimulated(opts: StreamOptions): AsyncGenerator<StreamEvent> {
  const { prompt, settings, isCancelled } = opts;
  const started = Date.now();
  const intent = detectIntent(prompt);
  const plan = toolPlan(intent, activeTools(settings.tools));
  const thinking = thinkingFor(intent, activeTools(settings.tools));

  await sleep(260);

  for (const step of thinking) {
    if (isCancelled()) return;
    yield { type: "thinking", text: step };
    await sleep(180 + Math.random() * 160);
  }

  const tools: ToolCall[] = [];
  if (settings.toolChoice !== "none") {
    for (const name of plan) {
      if (isCancelled()) return;
      const meta = toolMeta[name];
      const call: ToolCall = {
        id: newId(),
        name,
        label: meta.label,
        args: meta.args(prompt),
        status: "running",
      };
      tools.push(call);
      yield { type: "tool", call };
      await sleep(520 + Math.random() * 500);
      if (isCancelled()) return;
      const durationMs = Math.round(520 + Math.random() * 700);
      yield { type: "tool_result", id: call.id, result: meta.result, durationMs };
      call.status = "done";
    }
  }

  const body =
    settings.responseFormat === "json_object" && intent !== "greeting"
      ? [
          "{",
          '  "summary": "Minimal, reversible implementation with tests",',
          '  "steps": [',
          '    "Add the feature behind a flag",',
          '    "Unit test the edge cases",',
          '    "Graduate the flag after verification"',
          "  ],",
          '  "confidence": 0.86',
          "}",
          "",
          "Response format is set to `json_object`, so the demo engine is returning JSON. Switch it back to text under Settings → Model for prose.",
        ].join("\n")
      : responses[intent];

  await sleep(180);
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
      await sleep(14 + Math.random() * 22);
    }
  }

  yield {
    type: "done",
    usage: { in: estimateTokens(opts.history.map((m) => m.content).join(" ") + prompt), out: estimateTokens(body) },
    latencyMs: Date.now() - started,
    ttftMs: ttft || 320,
  };
}

async function* streamProvider(opts: StreamOptions): AsyncGenerator<StreamEvent> {
  const { prompt, settings, history, isCancelled } = opts;
  const provider = settings.provider;
  if (!provider) {
    yield* streamSimulated(opts);
    return;
  }

  const started = Date.now();
  const tools = activeTools(settings.tools);
  const url = `${provider.baseUrl.replace(/\/+$/, "")}/chat/completions`;
  const body = {
    model: provider.model || settings.model,
    messages: [
      ...(settings.systemPrompt.trim() ? [{ role: "system", content: settings.systemPrompt }] : []),
      ...history
        .filter((m) => m.role === "user" || m.content)
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: prompt },
    ],
    temperature: settings.temperature,
    top_p: settings.topP,
    max_tokens: settings.maxTokens,
    presence_penalty: settings.presencePenalty,
    frequency_penalty: settings.frequencyPenalty,
    ...(settings.seed !== null ? { seed: settings.seed } : {}),
    ...(settings.stop.trim() ? { stop: settings.stop.split("\n").map((s) => s.trim()).filter(Boolean) } : {}),
    stream: settings.stream,
    ...(settings.responseFormat === "json_object" ? { response_format: { type: "json_object" } } : {}),
    ...(tools.length ? { tools: tools.map((t) => ({ type: t })) } : {}),
    ...(settings.toolChoice !== "auto" ? { tool_choice: settings.toolChoice } : {}),
  };

  yield { type: "thinking", text: `Sending request to ${provider.baseUrl} …` };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Provider responded ${res.status}${text ? `: ${text.slice(0, 240)}` : ""}`);
  }

  let full = "";
  let ttft = 0;

  if (!settings.stream || !res.body) {
    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    full = json.choices?.[0]?.message?.content ?? "";
    if (isCancelled()) return;
    ttft = Date.now() - started;
    yield { type: "token", text: full };
    yield {
      type: "done",
      usage: {
        in: json.usage?.prompt_tokens ?? estimateTokens(prompt),
        out: json.usage?.completion_tokens ?? estimateTokens(full),
      },
      latencyMs: Date.now() - started,
      ttftMs: ttft,
    };
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (isCancelled()) {
      await reader.cancel().catch(() => undefined);
      return;
    }
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const token = json.choices?.[0]?.delta?.content;
        if (token) {
          if (!ttft) ttft = Date.now() - started;
          full += token;
          yield { type: "token", text: token };
        }
      } catch {
        /* partial frame — ignored */
      }
    }
  }

  yield {
    type: "done",
    usage: { in: estimateTokens(prompt), out: estimateTokens(full) },
    latencyMs: Date.now() - started,
    ttftMs: ttft || Date.now() - started,
  };
}

export async function* streamAssistant(opts: StreamOptions): AsyncGenerator<StreamEvent> {
  const provider = opts.settings.provider;
  if (provider?.baseUrl && provider?.apiKey) {
    try {
      yield* streamProvider(opts);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown provider error";
      yield {
        type: "token",
        text: [
          "**Provider request failed.**",
          "",
          `\`${message}\``,
          "",
          "Check the base URL, model name and key under **Settings → API keys → Provider**, then retry. Falling back would hide a real configuration problem, so the demo engine is not answering this one.",
        ].join("\n"),
      };
      yield {
        type: "done",
        usage: { in: estimateTokens(opts.prompt), out: 40 },
        latencyMs: 0,
        ttftMs: 0,
      };
      return;
    }
  }
  yield* streamSimulated(opts);
}

export function titleForConversation(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "New conversation";
  return clean.length > 46 ? `${clean.slice(0, 46).trimEnd()}…` : clean;
}
