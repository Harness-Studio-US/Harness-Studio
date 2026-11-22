import { useEffect } from "react";
import { Download, Eye, FileCode, FileDown, X } from "lucide-react";
import type { OutgoingFile } from "../../lib/files";
import { downloadFile, formatBytes } from "../../lib/files";

/**
 * A file the model handed over. The card shows what is inside it and a tag for
 * its type; clicking it opens the viewer, and the download button sits on the
 * right so a file is one click away.
 */

const HTML = /\.(html?|svg)$/i;

export function isHtmlFile(file: OutgoingFile): boolean {
  return HTML.test(file.name);
}

/** `notes.md` → `MD`; a file with no extension falls back to `TXT`. */
export function fileTag(name: string): string {
  const match = /\.([A-Za-z0-9]+)$/.exec(name);
  const raw = match?.[1]?.toLowerCase();
  if (!raw) return "TXT";
  if (raw === "htm") return "HTML";
  if (raw === "markdown") return "MD";
  return raw.toUpperCase().slice(0, 5);
}

/** The first few lines, which is enough to recognise a file in a card. */
function snippet(text: string): string {
  return text.trim().split("\n").slice(0, 6).join("\n").slice(0, 420);
}

export function FileCard({
  file,
  onOpen,
}: {
  file: OutgoingFile;
  onOpen: (file: OutgoingFile) => void;
}) {
  const tag = fileTag(file.name);
  const preview = snippet(file.text);

  return (
    <div className="flex items-start gap-2 px-3 py-2">
      <button
        type="button"
        onClick={() => onOpen(file)}
        className="group min-w-0 flex-1 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        aria-label={`Preview ${file.name}`}
      >
        <span className="flex flex-wrap items-center gap-2">
          <span className="truncate font-mono text-[11.5px] font-medium text-slate-900 group-hover:underline">
            {file.name}
          </span>
          <span className="shrink-0 rounded border border-slate-300 bg-white px-1 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.06em] text-slate-600">
            {tag}
          </span>
          <span className="shrink-0 text-[10.5px] text-slate-500">{formatBytes(file.bytes)}</span>
        </span>
        {preview && (
          <span className="mt-1.5 block max-h-[74px] overflow-hidden whitespace-pre rounded border border-slate-200 bg-white px-2 py-1.5 font-mono text-[10.5px] leading-[1.55] text-slate-600">
            {preview}
          </span>
        )}
      </button>

      <div className="flex shrink-0 flex-col items-stretch gap-1">
        <button
          type="button"
          onClick={() => downloadFile(file)}
          aria-label={`Download ${file.name}`}
          className="press flex items-center justify-center gap-1 rounded-md border border-emerald-300 bg-white px-2 py-1 text-[10.5px] font-medium text-emerald-800 transition hover:bg-emerald-50"
        >
          <Download className="h-3 w-3" />
          Download
        </button>
        <button
          type="button"
          onClick={() => onOpen(file)}
          className="press flex items-center justify-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[10.5px] font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Eye className="h-3 w-3" />
          Preview
        </button>
      </div>
    </div>
  );
}

export function FileViewer({ file, onClose }: { file: OutgoingFile; onClose: () => void }) {
  const html = isHtmlFile(file);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[#0f172a]/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Preview of ${file.name}`}
        onClick={(event) => event.stopPropagation()}
        className="anim-fade-in flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-xl border border-slate-200 bg-white shadow-2xl sm:h-[85vh] sm:rounded-xl"
      >
        <div className="flex items-center gap-2 border-b border-slate-200 bg-[#fbfcfe] px-3 py-2">
          {html ? (
            <FileCode className="h-3.5 w-3.5 shrink-0 text-violet-700" />
          ) : (
            <FileDown className="h-3.5 w-3.5 shrink-0 text-slate-600" />
          )}
          <span className="truncate font-mono text-[12px] font-medium text-slate-900">{file.name}</span>
          <span className="shrink-0 rounded border border-slate-300 bg-white px-1 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.06em] text-slate-600">
            {fileTag(file.name)}
          </span>
          <span className="shrink-0 text-[10.5px] text-slate-500">{formatBytes(file.bytes)}</span>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => downloadFile(file)}
              className="press flex items-center gap-1 rounded-md border border-emerald-300 bg-white px-2 py-1 text-[11px] font-medium text-emerald-800 transition hover:bg-emerald-50"
            >
              <Download className="h-3 w-3" />
              Download
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="press flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {html ? (
          <iframe
            title={`Preview of ${file.name}`}
            srcDoc={file.text}
            // No allow-same-origin: the page runs in its own origin and cannot
            // reach this app's storage or the signed-in account.
            sandbox="allow-scripts allow-forms allow-modals allow-popups"
            className="h-full w-full flex-1 border-0 bg-white"
          />
        ) : (
          <pre className="h-full flex-1 overflow-auto whitespace-pre-wrap bg-[#fbfcfe] p-4 font-mono text-[12px] leading-[1.65] text-slate-800">
            {file.text}
          </pre>
        )}
      </div>
    </div>
  );
}
