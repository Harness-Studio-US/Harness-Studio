import {
  COPILOT_SYSTEM_PROMPT,
  isRealEngineEnabled,
  modelNameFor,
  streamRealReply,
} from "./realChat";
import type { Attachment, OutgoingFile } from "./files";
import { streamReply } from "./streaming";

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

/**
 * A failed request almost always means the machine serving the model is off or
 * restarting. The chat waits a moment, then says this instead of showing a
 * raw network error.
 */
export const SERVER_BUSY_MESSAGE =
  "We are working on updates or maintaining our server. Please wait for a moment.";

/** How long the thinking dots stay up before the message above replaces them. */
export const SERVER_BUSY_DELAY_MS = 3000;

/**
 * A request that never reached the model is a different problem: the tunnel is
 * down, the machine is asleep, or the page points at an address that has gone.
 */
export const UNREACHABLE_MESSAGE =
  "I could not reach the model on your machine. Check that the tunnel is running, then send that again.";

/** Picks the notice that matches what actually went wrong. */
export function failureMessage(reason?: string): string {
  return /could not reach|no response|load failed|failed to fetch|networkerror|returned 530/i.test(reason ?? "")
    ? UNREACHABLE_MESSAGE
    : SERVER_BUSY_MESSAGE;
}

/** A file Harness Code wrote into the project for one reply. */
export type ProjectEdit = {
  name: string;
  action: "created" | "updated";
  lines: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Files the user attached to this message. */
  attachments?: Attachment[];
  /** Files the assistant handed back, ready to download. */
  files?: OutgoingFile[];
  thinking?: string[];
  toolCalls?: ToolCall[];
  usage?: ChatUsage;
  latencyMs?: number;
  error?: boolean;
  /** The raw reason a request failed, shown in small type under the message. */
  errorDetail?: string;
  stopped?: boolean;
  edits?: ProjectEdit[];
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
  history: ChatMessage[];
  attachments?: Attachment[];
  isCancelled: () => boolean;
};

const activeTools: ToolName[] = ["web_search", "code_execution"];

type Intent =
  | "greeting"
  | "design"
  | "create"
  | "explain"
  | "debug"
  | "api"
  | "database"
  | "component"
  | "default";

function detectIntent(prompt: string): Intent {
  const p = prompt.toLowerCase();
  if (/^(hi|hey|hello|yo|good (morning|evening))\b/.test(p.trim()) || p.trim().length < 12)
    return "greeting";
  if (/(bug|error|fail|broken|crash|debug|not working|doesn.t work|isn.t working|won.t work)/.test(p))
    return "debug";
  if (/(explain|walk me through|what does this project do|what is this project|how does .* work|understand)/.test(p))
    return "explain";
  if (/(design|look|feel|colou?r|spacing|layout|crowded|plain|clean|style|warmer|friendlier|easier to scan|dashboard)/.test(p))
    return "design";
  if (/(add|create|build|new page|settings page|feature|section)/.test(p)) return "create";
  if (/(api|sdk|endpoint|integrat|openai|webhook|curl|fetch)/.test(p)) return "api";
  if (/(sql|database|schema|postgres|migration|index|query)/.test(p)) return "database";
  if (/(react|component|hook|frontend|state)/.test(p)) return "component";
  return "default";
}

function thinkingFor(intent: Intent, tools: ToolName[]): string[] {
  const base = [
    "Reading your request.",
    "Looking at the part of your project that needs to change.",
  ];
  if (tools.includes("web_search")) base.push("Checking the latest details before I suggest anything.");
  if (tools.includes("code_execution")) base.push("Making sure the change holds together.");
  if (intent === "debug") base.push("Finding where things start to go wrong.");
  if (intent === "design") base.push("Thinking about the smallest change that makes the biggest difference.");
  if (intent === "create") base.push("Planning the new piece so it fits with everything else.");
  if (intent === "explain") base.push("Finding a clear way to explain it without jargon.");
  base.push("Putting together a first version for you to review.");
  return base.slice(0, intent === "greeting" ? 2 : 5);
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
    label: "Looking things up",
    args: (prompt) => ({ query: prompt.slice(0, 90), freshness: "2026", top_k: 5 }),
    result: "5 results · docs.harness.studio, openai.com, nodejs.org · citations attached",
  },
  code_execution: {
    label: "Trying it out",
    args: () => ({ language: "node", command: "npm test -- --runInBand", timeout_ms: 120000 }),
    result: "Sandbox exited 0 · 34 tests passed · no regressions in auth or session modules",
  },
  file_search: {
    label: "Looking through your project",
    args: () => ({ query: "auth session refresh token rotation", repo: "acme/platform", path: "src/server/auth" }),
    result: "Matched 6 files · src/server/auth/session.ts, tokens.ts, middleware.ts",
  },
  browser: {
    label: "Checking the result",
    args: (prompt) => ({ url: "https://docs.harness.studio/api/tool-calling", action: "extract", query: prompt.slice(0, 60) }),
    result: "Fetched page (42KB) · extracted the tool-calling contract and limits table",
  },
};

const greetingResponse = [
  "Hey — I'm Harness Copilot, your AI teammate at **Harness Studio**.",
  "",
  "I can help you change how something looks, fix what isn't working, add a new screen, or explain part of your project. Just tell me what you want in your own words.",
  "",
  "Things worth trying:",
  "- `Make the dashboard easier to scan`",
  "- `The sign-up page feels a little plain`",
  "- `Explain what this project does`",
  "",
  "The real work happens in Harness Studio.",
].join("\n");

const debugResponse = [
  "Let's track it down together. I'd start by reproducing the issue on the screen where it happens, then compare what you expected with what actually occurred.",
  "",
  "The most useful clues are: which screen you're on, what you tapped or typed, and what happened next. If it only happens on mobile, for example, I'd check whether the layout or the tap target is getting in the way.",
  "",
  "Tell me the screen and what you expected — I can narrow it down from there.",
].join("\n");

const apiResponse = [
  "You don't need an API or any developer setup to use Harness Copilot.",
  "",
  "Open the chat in your browser, describe what you want, and Copilot works through it with you. If you're curious about connecting your own tools later, that's an optional path — not something you need to get started.",
  "",
  "Want to try a change instead?",
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
  "Got it. I'd start with the simplest version of that change, make it in your app, and show you the result before going further.",
  "",
  "If you tell me which screen you're looking at or how you want it to feel, I can make the first pass more precise. Want me to take a look?",
].join("\n");

const designResponse = [
  "I'd make a few small changes to give it a clearer rhythm:",
  "",
  "- Group related things so the page reads in sections.",
  "- Let the most important action stand out.",
  "- Add a little breathing room and soften the background.",
  "",
  "I can try that in your workspace and show you the result. Want it subtle or a bigger refresh?",
].join("\n");

const createResponse = [
  "Absolutely. I'd add the new page with a simple profile section at the top — photo, name and email — then keep the rest of the settings in calm, clearly labelled groups.",
  "",
  "I'll match the spacing, type and colours already in your app so it feels like it belongs. Want me to build the first version and let you review it?",
].join("\n");

const explainResponse = [
  "Happy to. At a high level, this project is the app you're working in: it has screens for the main tasks, a shared design system and a place where the data lives.",
  "",
  "I can walk through one part at a time — the home screen, the sign-up flow, or how the pages fit together. Where would you like to start?",
].join("\n");

const responses: Record<Intent, string> = {
  greeting: greetingResponse,
  design: designResponse,
  create: createResponse,
  explain: explainResponse,
  debug: debugResponse,
  api: apiResponse,
  database: databaseResponse,
  component: componentResponse,
  default: defaultResponse,
};

export async function* streamAssistant(opts: StreamOptions): AsyncGenerator<StreamEvent> {
  if (isRealEngineEnabled()) {
    yield* streamRealReply({
      system: COPILOT_SYSTEM_PROMPT,
      model: modelNameFor("copilot"),
      prompt: opts.prompt,
      history: opts.history,
      attachments: opts.attachments,
      isCancelled: opts.isCancelled,
    });
    return;
  }

  const intent = detectIntent(opts.prompt);
  const plan = toolPlan(intent, activeTools);

  yield* streamReply({
    prompt: opts.prompt,
    history: opts.history,
    thinking: thinkingFor(intent, activeTools),
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

export function titleForConversation(prompt: string): string {
  const clean = prompt.replace(/\s+/g, " ").trim();
  if (!clean) return "New chat";
  return clean.length > 48 ? `${clean.slice(0, 48).trimEnd()}…` : clean;
}
