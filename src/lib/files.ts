/**
 * Files travelling both ways through a chat.
 *
 * User → model: a dropped or picked file is read as text and folded into the
 * prompt. The page is static and the model runs on a 4B-CPU budget, so the
 * text is capped: a whole file never gets shoved into a 4096-token context.
 *
 * Model → user: the model cannot write to disk, so it hands files over as a
 * fenced block tagged with the file name — ```file:notes.md. The reply becomes
 * a download card instead of a wall of text.
 */

export type Attachment = {
  id: string;
  name: string;
  size: number;
  mime: string;
  /** Text sent to the model. Empty when the file is binary or too large. */
  text: string;
  truncated?: boolean;
  unreadable?: boolean;
};

export type OutgoingFile = {
  name: string;
  text: string;
  bytes: number;
};

/** More than this and the composer gets crowded. */
export const MAX_ATTACHMENTS = 5;
/** Per file, before the whole-turn budget is applied. */
const MAX_FILE_CHARS = 12000;
/** Whole turn. Roughly 3k tokens, which leaves room for history on a 4096 window. */
const MAX_TURN_CHARS = 12000;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

/** Control characters (other than tabs/newlines) mean this is not text we can send. */
function looksBinary(sample: string): boolean {
  return /[\u0000-\u0008\u000e-\u001f]/.test(sample);
}

export async function readAttachments(input: FileList | File[]): Promise<Attachment[]> {
  const files = Array.from(input).slice(0, MAX_ATTACHMENTS);
  const out: Attachment[] = [];
  let budget = MAX_TURN_CHARS;

  for (const file of files) {
    let raw = "";
    try {
      raw = await file.text();
    } catch {
      raw = "";
    }

    const unreadable = raw.length === 0 || looksBinary(raw.slice(0, 2048));
    let text = unreadable ? "" : raw.replace(/\r\n/g, "\n");
    let truncated = false;

    if (text.length > MAX_FILE_CHARS) {
      text = text.slice(0, MAX_FILE_CHARS);
      truncated = true;
    }
    if (text.length > budget) {
      text = text.slice(0, budget);
      truncated = text.length > 0;
    }
    budget = Math.max(0, budget - text.length);

    out.push({
      id: newId(),
      name: file.name || "file.txt",
      size: file.size,
      mime: file.type || "text/plain",
      text,
      truncated: truncated || undefined,
      unreadable: unreadable || undefined,
    });
  }

  return out;
}

/** How attachments are handed to the model. Empty string when there are none. */
export function buildAttachmentBlock(attachments: Attachment[]): string {
  if (attachments.length === 0) return "";

  const parts = attachments.map((file) => {
    if (!file.text) {
      return `- ${file.name} (${formatBytes(file.size)}): not readable as text, so its contents are not included.`;
    }
    const note = file.truncated ? " — cut short to fit the answer budget" : "";
    return `--- file: ${file.name} (${formatBytes(file.size)}${note}) ---\n${file.text}\n--- end of ${file.name} ---`;
  });

  return ["The user attached these files:", ...parts].join("\n\n");
}

/** Keeps the model aware a file was there once the full text has left the window. */
export function historyNote(attachments: Attachment[] | undefined): string {
  if (!attachments || attachments.length === 0) return "";
  return `\n\n[attached: ${attachments.map((file) => file.name).join(", ")}]`;
}

/** ```file:notes.md … ``` — the contract the system prompt asks for. */
const fileFence = () => /```file:([^\s`]+)[ \t]*\r?\n([\s\S]*?)```/g;
/** A fence tagged with a real file name (`notes.md`, `report.csv`) counts too. */
const namedFence = () => /```([^\s`]*[./][^\s`]*)[ \t]*\r?\n([\s\S]*?)```/g;

function safeName(raw: string): string {
  const cleaned = raw.split(/[\\/]/).pop()?.replace(/[^\w.\- ]+/g, "").trim();
  return cleaned && cleaned.length > 0 ? cleaned : "file.txt";
}

function collect(pattern: () => RegExp, content: string): OutgoingFile[] {
  const re = pattern();
  const files: OutgoingFile[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(content)) !== null) {
    const name = safeName(match[1]);
    const body = `${match[2].replace(/\s+$/, "")}\n`;
    if (!body.trim()) continue;
    if (files.some((file) => file.name === name)) continue;
    files.push({ name, text: body, bytes: new TextEncoder().encode(body).length });
  }
  return files;
}

/** Every file the model handed over in one reply. */
export function extractOutgoingFiles(content: string): OutgoingFile[] {
  const explicit = collect(fileFence, content);
  if (explicit.length > 0) return explicit;
  return collect(namedFence, content);
}

/** The reply without the file bodies, so the card is the only place they appear. */
export function stripFileFences(content: string): string {
  const hasExplicit = fileFence().test(content);
  const stripped = content
    .replace(fileFence(), "")
    .replace(hasExplicit ? /$^/g : namedFence(), "")
    .replace(/\n{3,}/g, "\n\n");
  return stripped.trim();
}

export function downloadFile(file: OutgoingFile): void {
  const blob = new Blob([file.text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
