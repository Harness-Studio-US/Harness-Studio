import { useRef, useState } from "react";
import { FileText, Loader2, Paperclip, X } from "lucide-react";
import { formatBytes, readAttachments, type Attachment } from "../../lib/files";
import { cn } from "../../lib/cn";

/** The paperclip. Reads the picked files and hands them up already parsed. */
export function AttachButton({
  onFiles,
  disabled,
  className,
}: {
  onFiles: (files: Attachment[]) => void;
  disabled?: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={async (event) => {
          const picked = event.target.files;
          if (!picked || picked.length === 0) return;
          setReading(true);
          try {
            onFiles(await readAttachments(picked));
          } finally {
            setReading(false);
            event.target.value = "";
          }
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || reading}
        aria-label="Attach a file"
        title="Attach a file"
        className={cn(
          "press flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40",
          className
        )}
      >
        {reading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Paperclip className="h-3.5 w-3.5" />}
      </button>
    </>
  );
}

/** Chips for files picked but not sent yet. */
export function AttachmentChips({
  files,
  onRemove,
}: {
  files: Attachment[];
  onRemove: (id: string) => void;
}) {
  if (files.length === 0) return null;

  return (
    <div className="anim-fade-in mb-2 flex flex-wrap gap-1.5">
      {files.map((file) => (
        <span
          key={file.id}
          className="flex max-w-full items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1"
        >
          <FileText className="h-3 w-3 shrink-0 text-violet-600" />
          <span className="truncate font-mono text-[11px] text-slate-700">{file.name}</span>
          <span className="shrink-0 text-[10px] text-slate-500">{formatBytes(file.size)}</span>
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            aria-label={`Remove ${file.name}`}
            className="shrink-0 rounded p-0.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

/** Files already attached to a sent message. */
export function AttachmentList({ files }: { files: Attachment[] }) {
  if (files.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {files.map((file) => (
        <span
          key={file.id}
          className="flex max-w-full items-center gap-1.5 rounded-md border border-slate-300 bg-white/70 px-2 py-1"
        >
          <FileText className="h-3 w-3 shrink-0 text-violet-600" />
          <span className="truncate font-mono text-[11px] text-slate-700">{file.name}</span>
          <span className="shrink-0 text-[10px] text-slate-500">{formatBytes(file.size)}</span>
        </span>
      ))}
    </div>
  );
}
