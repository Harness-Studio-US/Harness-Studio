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

/**
 * Pulls the fenced code blocks out of Copilot replies so the Code view can show
 * them as files. Everything here comes from the conversation itself — nothing
 * is invented.
 */
export function extractCodeFiles(messages: ChatMessage[]): CodeFile[] {
  const files: CodeFile[] = [];
  const used = new Map<string, number>();
  const fence = /```([a-zA-Z0-9+#._-]*)[ \t]*\r?\n([\s\S]*?)```/g;

  for (const message of messages) {
    if (message.role !== "assistant" || !message.content.includes("```")) continue;

    fence.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = fence.exec(message.content)) !== null) {
      const lang = (match[1] || "text").toLowerCase();
      const code = match[2].replace(/\s+$/, "");
      if (!code.trim()) continue;

      const base = baseNames[lang] ?? `snippet.${lang || "txt"}`;
      const count = (used.get(base) ?? 0) + 1;
      used.set(base, count);
      const name = count === 1 ? base : base.replace(/(\.[^.]+)$/, `-${count}$1`);

      files.push({ id: `${message.id}-${files.length}`, name, lang, code });
    }
  }

  return files;
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
    edits.push({
      name: block.name,
      action: index >= 0 ? "updated" : "created",
      lines: block.code.split("\n").length,
    });
    const file: ProjectFile = {
      name: block.name,
      lang: block.lang,
      code: block.code,
      updatedAt: now,
    };
    if (index >= 0) next[index] = file;
    else next.push(file);
  }

  return { project: next, edits };
}
