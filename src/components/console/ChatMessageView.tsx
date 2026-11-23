import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  FileCode,
  FileDown,
  Loader2,
  RotateCcw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { ChatMessage, ProjectEdit, ToolCall } from "../../lib/chat";
import type { OutgoingFile } from "../../lib/files";
import { stripFileFences } from "../../lib/files";
import { FileCard, FileViewer } from "./FilePreview";
import { Markdown } from "../Markdown";
import { LogoMark } from "../Logo";
import { CopyButton } from "../CodeBlock";
import { AttachmentList } from "./Attachments";
import { cn } from "../../lib/cn";

const dislikeReasons = ["Not accurate", "Too long", "Wrong code", "Missed my question"];

function ToolCallCard({ call, streaming }: { call: ToolCall; streaming: boolean }) {
  const running = call.status === "running" && streaming;

  return (
    <div className="flex items-center gap-2 rounded-md border border-violet-200 bg-violet-50 px-3 py-2">
      <span className="flex h-5 w-5 items-center justify-center rounded border border-violet-200 bg-white">
        {running ? (
          <Loader2 className="h-2.5 w-2.5 animate-spin text-violet-700" />
        ) : (
          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-700" />
        )}
      </span>
      <span className="text-[12px] font-medium text-slate-700">{call.label}</span>
      <span className="ml-auto text-[10.5px] text-slate-600">
        {running ? "working…" : "done"}
      </span>
    </div>
  );
}

export function ChatMessageView({
  message,
  streaming,
  author = "Harness Copilot",
  edits,
  onEdit,
  onRegenerate,
}: {
  message: ChatMessage;
  streaming: boolean;
  author?: string;
  edits?: ProjectEdit[];
  /** Present when a sent message can be taken back and rewritten. */
  onEdit?: () => void;
  /** Present on the newest reply only: asking again replaces it. */
  onRegenerate?: () => void;
}) {
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const [openFile, setOpenFile] = useState<OutgoingFile | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherReason, setOtherReason] = useState("");

  function closeReason() {
    setReasonOpen(false);
    setOtherOpen(false);
  }

  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex w-full items-start justify-end gap-2.5">
          <div className="max-w-[85%] rounded-xl rounded-tr-sm border border-slate-200 bg-[#f1f5f9] px-4 py-3">
            <p className="whitespace-pre-wrap text-[14px] leading-[1.7] text-slate-800">
              {message.content}
            </p>
            {message.attachments?.length ? <AttachmentList files={message.attachments} /> : null}
          </div>
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[10px] font-semibold text-slate-600">
            You
          </div>
        </div>
        {onEdit && !streaming && (
          <button
            type="button"
            onClick={onEdit}
            title="Take this message back and change it"
            className="mr-10 rounded px-1.5 py-0.5 text-[10.5px] text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            Edit &amp; resend
          </button>
        )}
      </div>
    );
  }

  const hasTrace = (message.thinking?.length ?? 0) > 0;
  const hasTools = (message.toolCalls?.length ?? 0) > 0;
  const showPlaceholder = streaming && !message.content && !hasTrace && !hasTools;

  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-[#fbfcfe]">
        <LogoMark className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-semibold text-slate-900">{author}</span>
          {message.error && (
            <span className="inline-flex items-center gap-1 rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">
              <AlertTriangle className="h-2.5 w-2.5" />
              Something went wrong
            </span>
          )}
          {message.stopped && <span className="text-[11px] text-slate-600">stopped</span>}
        </div>

        {hasTrace && (
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setThinkingOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11.5px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
            >
              <Sparkles className="h-3 w-3 text-violet-700" />
              {streaming ? "Working through it" : "How I worked through it"}
              <ChevronDown
                className={cn("h-2.5 w-2.5 transition", (thinkingOpen || streaming) && "rotate-180")}
              />
            </button>
            {(thinkingOpen || streaming) && (
              <ol className="mt-2 space-y-1.5 border-l border-violet-200 pl-3">
                {message.thinking?.map((step, index) => (
                  <li key={index} className="stream-in flex gap-2 text-[12px] leading-[1.7] text-slate-600">
                    <span className="shrink-0 text-[10px] text-slate-500">•</span>
                    {step}
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {hasTools && (
          <div className="mb-2.5 space-y-1.5">
            {message.toolCalls?.map((call) => (
              <ToolCallCard key={call.id} call={call} streaming={streaming} />
            ))}
          </div>
        )}

        {showPlaceholder ? (
          <div className="flex items-center gap-2 py-1 text-[12.5px] text-slate-600">
            <span className="flex gap-1">
              <span className="h-1 w-1 animate-pulse-dot rounded-full bg-violet-400" />
              <span
                className="h-1 w-1 animate-pulse-dot rounded-full bg-violet-400"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-1 w-1 animate-pulse-dot rounded-full bg-violet-400"
                style={{ animationDelay: "300ms" }}
              />
            </span>
            Working on it
          </div>
        ) : (
          <div className={cn(message.error && "rounded-lg border border-rose-200 bg-rose-50 p-3")}>
            <Markdown
              content={message.files?.length ? stripFileFences(message.content) : message.content}
            />
            {streaming && message.content && <span className="caret" />}
          </div>
        )}

        {!streaming && (message.files?.length ?? 0) > 0 && (
          <div className="anim-fade-in mt-3 overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50/40">
            <div className="flex items-center gap-2 border-b border-emerald-200 px-3 py-2">
              <FileDown className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
              <span className="text-[11.5px] font-semibold text-slate-800">Files from {author}</span>
              <span className="ml-auto text-[10.5px] text-slate-600">
                {message.files!.length} file{message.files!.length === 1 ? "" : "s"}
              </span>
            </div>
            <ul className="divide-y divide-emerald-100">
              {message.files!.map((file) => (
                <li key={file.name}>
                  <FileCard file={file} onOpen={setOpenFile} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {openFile && <FileViewer file={openFile} onClose={() => setOpenFile(null)} />}

        {!streaming && (edits?.length ?? 0) > 0 && (
          <div className="anim-fade-in mt-3 overflow-hidden rounded-lg border border-violet-200 bg-violet-50/40">
            <div className="flex items-center gap-2 border-b border-violet-200 px-3 py-2">
              <FileCode className="h-3.5 w-3.5 shrink-0 text-violet-700" />
              <span className="text-[11.5px] font-semibold text-slate-800">
                {author} updated your project
              </span>
              <span className="ml-auto text-[10.5px] text-slate-600">
                {edits!.length} file{edits!.length === 1 ? "" : "s"}
              </span>
            </div>
            <ul className="divide-y divide-violet-100">
              {edits!.map((edit) => (
                <li key={edit.name} className="flex items-center gap-2 px-3 py-1.5">
                  <span className="truncate font-mono text-[11px] text-slate-800">{edit.name}</span>
                  <span className="shrink-0 rounded border border-slate-200 bg-white px-1 py-0.5 text-[9.5px] uppercase tracking-[0.06em] text-slate-600">
                    {edit.action}
                  </span>
                  <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[10.5px] text-slate-600">
                    {edit.action === "updated" && edit.added !== undefined ? (
                      <>
                        <span className="font-mono text-emerald-700">+{edit.added}</span>
                        <span className="font-mono text-rose-600">−{edit.removed ?? 0}</span>
                      </>
                    ) : (
                      <span>{edit.lines} lines</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {message.errorDetail && (
          <p className="mt-2 break-words rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[10.5px] leading-relaxed text-slate-500">
            {message.errorDetail}
          </p>
        )}

        {!streaming && message.content && (
          <div className="relative mt-2 flex items-center gap-1 text-slate-500">
            <CopyButton
              text={message.content}
              iconOnly
              className="h-7 w-7 justify-center border-0 bg-transparent px-0 shadow-none hover:bg-slate-100"
            />
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                aria-label="Regenerate this reply"
                title="Regenerate this reply"
                className="press flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-slate-100 hover:text-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setFeedback("up");
                closeReason();
              }}
              aria-label="Good reply"
              aria-pressed={feedback === "up"}
              title="Good reply"
              className={cn(
                "press flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-slate-100 hover:text-slate-800",
                feedback === "up" && "text-emerald-600"
              )}
            >
              <ThumbsUp className={cn("h-3.5 w-3.5", feedback === "up" && "fill-current")} />
            </button>
            <button
              type="button"
              onClick={() => {
                setFeedback("down");
                setReasonOpen(true);
              }}
              aria-label="Bad reply"
              aria-pressed={feedback === "down"}
              title="Bad reply"
              className={cn(
                "press flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-slate-100 hover:text-slate-800",
                feedback === "down" && "text-rose-600"
              )}
            >
              <ThumbsDown className={cn("h-3.5 w-3.5", feedback === "down" && "fill-current")} />
            </button>
            {feedback && !reasonOpen && (
              <span className="ml-1 text-[10.5px] text-slate-500">
                {feedback === "up" ? "Thanks!" : "Thanks — noted."}
              </span>
            )}

            {reasonOpen && (
              <>
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onClick={closeReason}
                  className="fixed inset-0 z-10 cursor-default"
                />
                <div
                  role="dialog"
                  aria-label="Why did you dislike this prompt?"
                  className="absolute left-0 top-full z-20 mt-1 w-[17rem] rounded-xl border border-slate-200 bg-white p-3 text-left shadow-[0_20px_45px_-24px_rgba(15,23,42,0.45)]"
                >
                  <p className="text-[12px] font-semibold text-slate-900">
                    Why did you dislike this prompt?
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {dislikeReasons.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={closeReason}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        {reason}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setOtherOpen(true)}
                      className={cn(
                        "rounded-md border px-2 py-1 text-[11px] transition",
                        otherOpen
                          ? "border-violet-300 bg-violet-50 text-violet-800"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      Other
                    </button>
                  </div>
                  {otherOpen && (
                    <div className="mt-2">
                      <textarea
                        autoFocus
                        value={otherReason}
                        onChange={(event) => setOtherReason(event.target.value)}
                        rows={2}
                        placeholder="What went wrong?"
                        aria-label="Your reason"
                        className="w-full resize-none rounded-md border border-slate-200 px-2 py-1.5 text-[11.5px] leading-[1.6] text-slate-800 outline-none transition focus:border-violet-300"
                      />
                      <button
                        type="button"
                        disabled={!otherReason.trim()}
                        onClick={() => {
                          setOtherReason("");
                          closeReason();
                        }}
                        className="mt-1.5 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
