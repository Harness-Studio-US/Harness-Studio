import type { ChatMessage, StreamEvent, ToolName } from "./chat";
import { streamReply } from "./streaming";

/**
 * Harness Code is the console's coding chat: the same streaming protocol as
 * Harness Copilot, but every reply is code first — a working snippet plus the
 * few notes that matter when you paste it into a project.
 */
type CodeIntent =
  | "greeting"
  | "component"
  | "api"
  | "database"
  | "debug"
  | "explain"
  | "style"
  | "test"
  | "default";

type StreamOptions = {
  prompt: string;
  history: ChatMessage[];
  isCancelled: () => boolean;
};

function detectIntent(prompt: string): CodeIntent {
  const p = prompt.toLowerCase().trim();
  if (/^(hi|hey|hello|yo|good (morning|evening))\b/.test(p) || p.length < 12) return "greeting";
  if (/(bug|error|fail|broken|crash|undefined|null|not working|doesn.t work|isn.t working|won.t)/.test(p))
    return "debug";
  if (/(explain|walk me through|what does|how does|read this|understand|why is)/.test(p)) return "explain";
  if (/(test|spec|vitest|jest|assert|coverage)/.test(p)) return "test";
  if (/(sql|database|schema|postgres|migration|index|query|table)/.test(p)) return "database";
  if (/(api|endpoint|fetch|request|http|json|webhook|server)/.test(p)) return "api";
  if (/(css|style|layout|grid|responsive|space|spacing|colour|color|dark mode)/.test(p)) return "style";
  if (/(component|react|hook|button|card|form|modal|list|page|ui)/.test(p)) return "component";
  return "default";
}

function thinkingFor(intent: CodeIntent): string[] {
  const base = ["Reading what you want the code to do."];
  if (intent !== "greeting") {
    base.push("Picking the smallest shape that does the job.");
    if (intent === "debug") base.push("Checking the order things run in.");
    if (intent === "database") base.push("Making sure the migration is safe to run on a live table.");
    if (intent === "explain") base.push("Reading the code the way the browser runs it, not line by line.");
    base.push("Writing it so you can paste it in without edits.");
  }
  return base;
}

function toolPlan(intent: CodeIntent): ToolName[] {
  if (intent === "greeting") return [];
  if (intent === "debug" || intent === "test") return ["code_execution"];
  if (intent === "component" || intent === "style" || intent === "api") return ["code_execution"];
  return [];
}

const toolMeta: Record<ToolName, { label: string; args: (prompt: string) => Record<string, unknown>; result: string }> = {
  web_search: {
    label: "Checking the current API",
    args: (prompt) => ({ query: prompt.slice(0, 90), freshness: "2026", top_k: 5 }),
    result: "5 results · developer.mozilla.org, react.dev, nodejs.org",
  },
  code_execution: {
    label: "Running it in the sandbox",
    args: () => ({ runtime: "node 22", command: "node --experimental-strip-types example.ts", timeout_ms: 60000 }),
    result: "Exited 0 · output matched the expected shape",
  },
  file_search: {
    label: "Reading the file",
    args: () => ({ path: "src/", glob: "**/*.{ts,tsx}" }),
    result: "Read 4 files",
  },
  browser: {
    label: "Checking the docs page",
    args: (prompt) => ({ url: "https://developer.mozilla.org/", action: "extract", query: prompt.slice(0, 60) }),
    result: "Fetched the reference page and the browser support table",
  },
};

const greetingResponse = [
  "Hey — this is **Harness Code**, the coding side of Harness Studio.",
  "",
  "It's the same chat as Harness Copilot, except it's built for writing code in the browser: you describe the thing, it answers with code you can read, copy or keep in the panel next to this chat.",
  "",
  "Things worth trying:",
  "- `Build a pricing card component in React`",
  "- `Write a safe SQL migration for a deleted_at column`",
  "- `Why is my fetch returning undefined?`",
  "- `Test this function with vitest`",
  "",
  "Every code block it writes shows up on the right, with line numbers and a copy button.",
].join("\n");

const componentResponse = [
  "Here's a self-contained version. State stays inside the component, so you can drop it anywhere.",
  "",
  "```tsx",
  'import { useState } from "react";',
  "",
  "type PricingCardProps = {",
  "  name: string;",
  "  price: number;",
  "  features: string[];",
  "  highlighted?: boolean;",
  "};",
  "",
  "export function PricingCard({ name, price, features, highlighted = false }: PricingCardProps) {",
  "  const [yearly, setYearly] = useState(false);",
  '  const amount = yearly ? price * 10 : price;',
  "",
  "  return (",
  "    <div",
  '      className={highlighted ? "rounded-2xl border-2 border-violet-500 p-6" : "rounded-2xl border border-slate-200 p-6"}',
  "    >",
  '      <h3 className="text-sm font-medium text-slate-600">{name}</h3>',
  '      <p className="mt-2 text-3xl font-semibold tracking-tight">',
  "        {amount}",
  '        <span className="text-sm font-normal text-slate-500">/{yearly ? "year" : "month"}</span>',
  "      </p>",
  "      <button",
  '        type="button"',
  "        onClick={() => setYearly((value) => !value)}",
  '        className="mt-3 text-xs text-violet-700 underline"',
  "      >",
  '        Show {yearly ? "monthly" : "yearly"} pricing',
  "      </button>",
  '      <ul className="mt-5 space-y-2 text-sm text-slate-700">',
  "        {features.map((feature) => (",
  "          <li key={feature}>{feature}</li>",
  "        ))}",
  "      </ul>",
  "    </div>",
  "  );",
  "}",
  "```",
  "",
  "Two things worth keeping: the toggle owns its own state so the card is reusable, and nothing here reaches into your data layer — pass `features` in and it renders.",
  "",
  "Want the hover and focus states added, or should I wire it to a plan list you already have?",
].join("\n");

const apiResponse = [
  "Wrap the request once and every call site gets the same error handling. The `AbortSignal` is the part people skip — it's what stops a stale response from landing after the user moves on.",
  "",
  "```ts",
  "type ApiError = { status: number; message: string };",
  "",
  "export async function request<T>(path: string, init?: RequestInit & { timeoutMs?: number }): Promise<T> {",
  '  const controller = new AbortController();',
  "  const timeout = setTimeout(() => controller.abort(), init?.timeoutMs ?? 10000);",
  "",
  "  try {",
  '    const response = await fetch(path, {',
  "      ...init,",
  '      headers: { "content-type": "application/json", ...init?.headers },',
  "      signal: init?.signal ?? controller.signal,",
  "    });",
  "",
  "    if (!response.ok) {",
  "      const body = await response.text();",
  "      throw { status: response.status, message: body || response.statusText } satisfies ApiError;",
  "    }",
  "",
  "    return (await response.json()) as T;",
  "  } finally {",
  "    clearTimeout(timeout);",
  "  }",
  "}",
  "```",
  "",
  "It returns parsed JSON, throws a typed error with the status code, and cleans up the timer in `finally`. If you're calling it from a component, pass the effect's own signal so unmounting cancels the request.",
  "",
  "Should I add a retry for 429s, or keep it as one attempt?",
].join("\n");

const databaseResponse = [
  "This adds the column without locking the table, then indexes the query shape you'll actually run.",
  "",
  "```sql",
  "-- add the column first; no default means no table rewrite",
  "ALTER TABLE orders ADD COLUMN cancelled_at timestamptz;",
  "",
  "-- index only the rows the app still reads",
  "CREATE INDEX CONCURRENTLY orders_active_idx",
  "  ON orders (customer_id, created_at DESC)",
  "  WHERE cancelled_at IS NULL;",
  "",
  "-- backfill and enforce afterwards",
  "ALTER TABLE orders",
  "  ADD CONSTRAINT orders_cancelled_after_created",
  "  CHECK (cancelled_at IS NULL OR cancelled_at >= created_at);",
  "```",
  "",
  "Two gotchas: `CREATE INDEX CONCURRENTLY` can't run inside a transaction, so mark that migration as non-transactional; and a partial index only helps if every hot query includes `cancelled_at IS NULL`.",
  "",
  "Want the down migration as well?",
].join("\n");

const debugResponse = [
  "Nine times out of ten this is one of three things: the request never ran, the response was read twice, or the component unmounted before it resolved. Here's the shape I'd check first.",
  "",
  "```ts",
  "useEffect(() => {",
  "  const controller = new AbortController();",
  "",
  "  async function load() {",
  "    try {",
  '      const data = await request<Row[]>("/api/rows", { signal: controller.signal });',
  "      setRows(data);",
  "    } catch (error) {",
  '      if ((error as Error).name === "AbortError") return;',
  "      setError(error);",
  "    }",
  "  }",
  "",
  "  void load();",
  "  return () => controller.abort();",
  "}, []);",
  "```",
  "",
  "If `rows` is still `undefined`, the bug is usually the response body: `await` it once, not twice, and don't mix `response.json()` with `response.text()`. Log the raw response before parsing to see what actually came back.",
  "",
  "Paste the error or the function that's failing and I'll narrow it down.",
].join("\n");

const explainResponse = [
  "The short version: this reads left to right, but it runs in the order the browser schedules it.",
  "",
  "```ts",
  "// 1. runs during render — must stay pure",
  "const visible = rows.filter((row) => row.name.includes(query));",
  "",
  "// 2. runs after paint — safe for requests and subscriptions",
  "useEffect(() => {",
  "  document.title = `${visible.length} results`;",
  "}, [visible.length]);",
  "",
  "// 3. runs before the browser paints — keeps layout stable",
  "useLayoutEffect(() => measure());",
  "```",
  "",
  "So filtering in the render body is fine (it's pure), touching `document` is not, and anything that reads layout needs the layout effect. `useMemo` only becomes worth it when the filter is genuinely expensive — otherwise it's noise.",
  "",
  "Point me at the function you're reading and I'll annotate that instead.",
].join("\n");

const styleResponse = [
  "Let the grid decide the breakpoints instead of writing one per screen size.",
  "",
  "```css",
  ".card-grid {",
  "  display: grid;",
  "  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));",
  "  gap: 1rem;",
  "}",
  "",
  "@media (max-width: 640px) {",
  "  .card-grid {",
  "    grid-template-columns: 1fr;",
  "  }",
  "}",
  "```",
  "",
  "`auto-fit` with `minmax` collapses columns on its own, so you only write the one mobile override where the padding needs to change too. If the cards live inside a sidebar, use `auto-fill` instead so a single card doesn't stretch to full width.",
  "",
  "Want the same thing in Tailwind classes?",
].join("\n");

const testResponse = [
  "One test per branch, no snapshots. The point is to pin the behaviour you'd otherwise break silently.",
  "",
  "```ts",
  "import { describe, expect, it } from \"vitest\";",
  "import { formatPrice } from \"./formatPrice\";",
  "",
  "describe(\"formatPrice\", () => {",
  "  it(\"rounds to two decimals\", () => {",
  "    expect(formatPrice(12.345)).toBe(\"$12.35\");",
  "  });",
  "",
  "  it(\"keeps whole numbers tidy\", () => {",
  "    expect(formatPrice(12)).toBe(\"$12.00\");",
  "  });",
  "",
  "  it(\"falls back for missing values\", () => {",
  "    expect(formatPrice(undefined)).toBe(\"—\");",
  "  });",
  "});",
  "```",
  "",
  "Those three cases catch the usual regressions: rounding, formatting and the `undefined` path. If the function is async, `await` the assertion and assert the rejection separately.",
  "",
  "Send me the function and I'll write the cases around its real branches.",
].join("\n");

const defaultResponse = [
  "Here's a starting point that's easy to extend.",
  "",
  "```ts",
  "export type Result<T> = { ok: true; value: T } | { ok: false; error: string };",
  "",
  "export function parseConfig(raw: string): Result<Record<string, string>> {",
  "  const entries = raw",
  "    .split(\"\\n\")",
  "    .map((line) => line.trim())",
  "    .filter((line) => line && !line.startsWith(\"#\"));",
  "",
  "  const config: Record<string, string> = {};",
  "  for (const entry of entries) {",
  "    const index = entry.indexOf(\"=\");",
  "    if (index === -1) return { ok: false, error: `Missing \"=\" in: ${entry}` };",
  "    config[entry.slice(0, index).trim()] = entry.slice(index + 1).trim();",
  "  }",
  "",
  "  return { ok: true, value: config };",
  "}",
  "```",
  "",
  "Returning a result instead of throwing keeps the caller honest, and skipping comments and blank lines makes it survive real config files.",
  "",
  "Tell me the exact input and output you need and I'll tighten it.",
].join("\n");

const responses: Record<CodeIntent, string> = {
  greeting: greetingResponse,
  component: componentResponse,
  api: apiResponse,
  database: databaseResponse,
  debug: debugResponse,
  explain: explainResponse,
  style: styleResponse,
  test: testResponse,
  default: defaultResponse,
};

export async function* streamCodeAssistant(opts: StreamOptions): AsyncGenerator<StreamEvent> {
  const intent = detectIntent(opts.prompt);
  const plan = toolPlan(intent);

  yield* streamReply({
    prompt: opts.prompt,
    history: opts.history,
    thinking: thinkingFor(intent),
    tools: plan.map((name) => ({
      name,
      label: toolMeta[name].label,
      args: toolMeta[name].args(opts.prompt),
      result: toolMeta[name].result,
    })),
    body: responses[intent],
    isCancelled: opts.isCancelled,
  });
}
