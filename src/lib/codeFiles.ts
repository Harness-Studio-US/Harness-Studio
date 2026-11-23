import type { ChatMessage, ProjectEdit } from "./chat";

export type CodeFile = {
  id: string;
  name: string;
  lang: string;
  code: string;
};

/** A file in the Harness Code project. Writing the same name replaces it. */
export type ProjectFile = {
  name: string;
  lang: string;
  code: string;
  updatedAt: number;
  /** The version this file replaced, kept so the panel can show what changed. */
  previous?: string;
};

const baseNames: Record<string, string> = {
  sql: "migration.sql",
  tsx: "Component.tsx",
  jsx: "Component.jsx",
  ts: "module.ts",
  js: "script.js",
  mjs: "script.mjs",
  cjs: "script.cjs",
  css: "styles.css",
  scss: "styles.scss",
  html: "page.html",
  json: "data.json",
  bash: "commands.sh",
  sh: "commands.sh",
  shell: "commands.sh",
  zsh: "commands.sh",
  py: "script.py",
  prisma: "schema.prisma",
  yml: "config.yml",
  yaml: "config.yml",
  diff: "changes.diff",
  text: "snippet.txt",
};

/** `PriceCard.tsx` stays as written; anything path-like or unsafe is dropped. */
function safeFileName(raw: string): string {
  const cleaned = raw
    .split(/[\\/]/)
    .pop()
    ?.replace(/[^\w.\- ]+/g, "")
    .trim();
  return cleaned ?? "";
}

/**
 * Pulls the fenced code blocks out of Copilot replies so the Code view can show
 * them as files. Everything here comes from the conversation itself — nothing
 * is invented.
 *
 * A fence may name its file — ```tsx:PriceCard.tsx — which is the only way two
 * components in one project both get a real name. A bare language tag still
 * falls back to the default name for that language.
 */
export function extractCodeFiles(messages: ChatMessage[]): CodeFile[] {
  const files: CodeFile[] = [];
  const used = new Map<string, number>();
  const fence = /```([a-zA-Z0-9+#._-]+)(?::([^\s`]+))?[ \t]*\r?\n([\s\S]*?)```/g;

  for (const message of messages) {
    if (message.role !== "assistant" || !message.content.includes("```")) continue;

    fence.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = fence.exec(message.content)) !== null) {
      const lang = (match[1] || "text").toLowerCase();
      // ```file:notes.md is a download card, not project code.
      if (lang === "file") continue;

      const code = match[3].replace(/\s+$/, "");
      if (!code.trim()) continue;

      let name = match[2] ? safeFileName(match[2]) : "";
      if (!name) {
        const base = baseNames[lang] ?? `snippet.${lang || "txt"}`;
        const count = (used.get(base) ?? 0) + 1;
        used.set(base, count);
        name = count === 1 ? base : base.replace(/(\.[^.]+)$/, `-${count}$1`);
      }

      // The same name twice in one reply is one file in two parts.
      const duplicate = files.findIndex((file) => file.name === name);
      if (duplicate >= 0) files[duplicate] = { ...files[duplicate], lang, code };
      else files.push({ id: `${message.id}-${files.length}`, name, lang, code });
    }
  }

  return files;
}

/** One line of a before/after comparison. */
export type DiffLine = { kind: "same" | "add" | "remove"; text: string };

/**
 * Line diff for the project panel. Files here are small, so the quadratic table
 * is fine; anything huge falls back to "everything is new" rather than freezing.
 */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split("\n");
  const b = after.split("\n");

  if (a.length * b.length > 250_000) {
    return [
      ...a.map((text) => ({ kind: "remove" as const, text })),
      ...b.map((text) => ({ kind: "add" as const, text })),
    ];
  }

  const table: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0)
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] =
        a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  const out: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      out.push({ kind: "same", text: a[i] });
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      out.push({ kind: "remove", text: a[i] });
      i++;
    } else {
      out.push({ kind: "add", text: b[j] });
      j++;
    }
  }
  while (i < a.length) out.push({ kind: "remove", text: a[i++] });
  while (j < b.length) out.push({ kind: "add", text: b[j++] });
  return out;
}

/** How many lines an edit added and removed. */
export function diffStats(before: string, after: string): { added: number; removed: number } {
  let added = 0;
  let removed = 0;
  for (const line of diffLines(before, after)) {
    if (line.kind === "add") added++;
    else if (line.kind === "remove") removed++;
  }
  return { added, removed };
}

/**
 * Applies one reply's code blocks to the project. A block whose file name is
 * already in the project replaces that file, which is how a second pass over
 * the same component updates it instead of adding a second copy.
 */
export function applyReplyToProject(
  project: ProjectFile[],
  message: ChatMessage
): { project: ProjectFile[]; edits: ProjectEdit[] } {
  const blocks = extractCodeFiles([message]);
  if (blocks.length === 0) return { project, edits: [] };

  const next = [...project];
  const edits: ProjectEdit[] = [];
  const now = Date.now();

  for (const block of blocks) {
    const index = next.findIndex((file) => file.name === block.name);
    const existing = index >= 0 ? next[index] : undefined;
    const lines = block.code.split("\n").length;
    const stats = existing
      ? diffStats(existing.code, block.code)
      : { added: lines, removed: 0 };

    edits.push({
      name: block.name,
      action: existing ? "updated" : "created",
      lines,
      added: stats.added,
      removed: stats.removed,
    });

    const file: ProjectFile = {
      name: block.name,
      lang: block.lang,
      code: block.code,
      updatedAt: now,
    };
    // Keep the old version only when it actually differs, so the panel never
    // offers a "changes" view with nothing to compare.
    if (existing) {
      const before = existing.code !== block.code ? existing.code : existing.previous;
      if (before !== undefined) file.previous = before;
    }

    if (index >= 0) next[index] = file;
    else next.push(file);
  }

  return { project: next, edits };
}

/**
 * Rebuilds the project (and the per-reply edit lists) from a stored
 * conversation, so a chat written before this existed still shows its files.
 */
export function replayConversation(messages: ChatMessage[]): {
  project: ProjectFile[];
  messages: ChatMessage[];
} {
  let project: ProjectFile[] = [];
  const replayed = messages.map((message) => {
    if (message.role !== "assistant") return message;
    const applied = applyReplyToProject(project, message);
    project = applied.project;
    return applied.edits.length > 0 ? { ...message, edits: applied.edits } : message;
  });
  return { project, messages: replayed };
}

/** Per file, before the whole block is trimmed to fit the prompt. */
const MAX_CONTEXT_FILE_CHARS = 1800;
const MAX_CONTEXT_FILES = 2;

function escapeName(name: string): string {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * What the model is told about the project it has already written.
 *
 * Most coding requests are a follow-up — "now add a dark mode", "the toggle
 * should remember" — and the file they mean has usually fallen out of the six
 * turns of chat history. So every message carries the file list, plus the full
 * text of any file the message names, or else the file written last.
 */
export function buildProjectContext(project: ProjectFile[], prompt: string): string {
  if (project.length === 0) return "";

  const index = project.map(
    (file) => `- ${file.name} (${file.lang || "text"}, ${file.code.split("\n").length} lines)`
  );
  const named = project.filter((file) => new RegExp(escapeName(file.name), "i").test(prompt));
  const chosen = (named.length > 0 ? named : [project[project.length - 1]]).slice(
    0,
    MAX_CONTEXT_FILES
  );

  const blocks = chosen.map((file) => {
    const code =
      file.code.length > MAX_CONTEXT_FILE_CHARS
        ? `${file.code.slice(0, MAX_CONTEXT_FILE_CHARS)}\n… cut to fit`
        : file.code;
    return `--- project: ${file.name} ---\n${code}\n--- end of ${file.name} ---`;
  });

  return [
    "The project already contains these files:",
    ...index,
    "",
    "Current contents of the file(s) this message is about:",
    ...blocks,
  ].join("\n");
}
