import type { ChatMessage } from "./chat";
import type { ProjectFile } from "./codeFiles";

/** Saves any text as a file the user can keep. */
export function downloadText(
  name: string,
  text: string,
  mime = "text/plain;charset=utf-8"
): void {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function stamp(when: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${when.getFullYear()}-${pad(when.getMonth() + 1)}-${pad(when.getDate())}`;
}

/** `Add a settings page` becomes `add-a-settings-page-2026-11-23.md`. */
export function exportFileName(title: string, when = new Date()): string {
  const stem =
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "harness-chat";
  return `${stem}-${stamp(when)}.md`;
}

/**
 * The conversation as Markdown: the same text the thread shows, with who said
 * what and the files that came with it, so it reads fine in any editor.
 */
export function chatMarkdown({
  title,
  messages,
  project,
  author = "Harness Copilot",
  when = new Date(),
}: {
  title: string;
  messages: ChatMessage[];
  project?: ProjectFile[];
  author?: string;
  when?: Date;
}): string {
  const lines: string[] = [
    `# ${title}`,
    "",
    `_Exported from ${author} on ${when.toLocaleDateString()}._`,
    "",
  ];

  for (const message of messages) {
    lines.push(message.role === "user" ? "## You" : `## ${author}`, "");
    if (message.content.trim()) {
      lines.push(message.content.trim(), "");
    }
    if (message.attachments?.length) {
      lines.push("Attached:", ...message.attachments.map((file) => `- ${file.name}`), "");
    }
    if (message.files?.length) {
      lines.push("Files:", ...message.files.map((file) => `- ${file.name}`), "");
    }
    if (message.stopped) lines.push("_Stopped before it finished._", "");
  }

  if (project && project.length > 0) {
    lines.push("## Project files", "", ...project.map((file) => `- ${file.name}`), "");
    for (const file of project) {
      lines.push(`### ${file.name}`, "");
      lines.push("```" + (file.lang || "text"), file.code, "```", "");
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}
