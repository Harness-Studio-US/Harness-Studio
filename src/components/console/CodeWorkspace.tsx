import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Code,
  FileCode,
  MessageSquare,
  Plus,
  Send,
  Square,
  Undo2,
} from "lucide-react";
import type { ChatMessage } from "../../lib/chat";
import type { ProjectFile } from "../../lib/codeFiles";
import type { Attachment } from "../../lib/files";
import { ChatMessageView } from "./ChatMessageView";
import { AttachmentChips, AttachButton } from "./Attachments";
import { CopyButton } from "../CodeBlock";
import { cn } from "../../lib/cn";

const codeSuggestions = [
  "Build a pricing card component in React",
  "Write a safe SQL migration for a deleted_at column",
  "Why is my fetch returning undefined?",
  "Style a responsive card grid in CSS",
];

export function CodeWorkspace({
  messages,
  project,
  streamingId,
  input,
  onInputChange,
  onSend,
  onStop,
  onNewChat,
  canUndo,
  onUndo,
  onBackToCopilot,
  attachments,
  onAttach,
  onRemoveAttachment,
}: {
  messages: ChatMessage[];
  project: ProjectFile[];
  streamingId: string | null;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (text: string) => void;
  attachments: Attachment[];
  onAttach: (files: Attachment[]) => void;
  onRemoveAttachment: (id: string) => void;
  onStop: () => void;
  onNewChat: () => void;
  canUndo: boolean;
  onUndo: () => void;
  onBackToCopilot: () => void;
}) {
  const [selectedName, setSelectedName] = useState(project[0]?.name ?? "");
  const [pane, setPane] = useState<"chat" | "code">("chat");
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!project.some((file) => file.name === selectedName)) {
      setSelectedName(project[0]?.name ?? "");
    }
  }, [project, selectedName]);

  useEffect(() => {
    // Only follow the conversation once it has started; scrolling an empty
    // thread hides the top of the intro on short screens.
    if (messages.length === 0) return;
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, messages[messages.length - 1]?.content, streamingId]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 170)}px`;
  }, [input]);

  const active = project.find((file) => file.name === selectedName) ?? project[0] ?? null;
  const lines = active ? active.code.split("\n") : [];
  const streaming = streamingId !== null;
  const empty = messages.length === 0;
  const canSend = (input.trim().length > 0 || attachments.length > 0) && !streaming;

  function submit() {
    if (!canSend) return;
    onSend(input);
  }

  return (
    <div className="anim-fade-in flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* ------------------------------------------------ chat */}
      <div
        className={cn(
          "min-h-0 min-w-0 flex-1 flex-col bg-white",
          pane === "chat" ? "flex" : "hidden",
          "lg:flex"
        )}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 sm:px-5">
          <span className="flex shrink-0 items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            <Code className="h-3.5 w-3.5 text-violet-600" />
            Code chat
          </span>
          <span className="hidden truncate text-[11.5px] text-slate-400 sm:block">
            Every file it writes lands in your project
          </span>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPane("chat");
                onNewChat();
              }}
              disabled={empty && !input}
              title="Start a fresh code chat"
              className="press flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              New
            </button>
            <button
              type="button"
              onClick={() => setPane("code")}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-slate-50 lg:hidden"
            >
              <FileCode className="h-3.5 w-3.5" />
              Files
              <span className="rounded-full bg-slate-100 px-1.5 py-px text-[10.5px] font-semibold text-slate-600">
                {project.length}
              </span>
            </button>
          </div>
        </div>

        {canUndo && (
          <div
            role="status"
            className="anim-fade-in flex shrink-0 items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-[12.5px] text-amber-900 sm:px-5"
          >
            <Undo2 className="h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 flex-1 truncate">Started a fresh code chat.</span>
            <button
              type="button"
              onClick={onUndo}
              className="press shrink-0 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-amber-900 transition hover:bg-amber-100"
            >
              Undo
            </button>
          </div>
        )}

        <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex min-h-full w-full max-w-[48rem] flex-col px-4 py-6 sm:px-6 sm:py-8">
            {empty ? (
              <div className="animate-rise my-auto py-4">
                <h2 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] text-slate-900 sm:text-[32px]">
                  What are you building?
                </h2>
                <p className="mt-3 max-w-[34rem] text-[14px] leading-[1.7] text-slate-600">
                  Describe the function, the bug or the query. You get code you can read and copy,
                  and every file it writes appears in your project beside this chat.
                </p>

                <div className="mt-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                  {codeSuggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => onSend(suggestion)}
                      style={{ animationDelay: `${70 + index * 45}ms` }}
                      className={cn(
                        "stream-in group flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50",
                        index > 0 && "border-t border-slate-100"
                      )}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-[#fbfcfe] text-slate-500 transition group-hover:border-violet-200 group-hover:text-violet-600">
                        <FileCode className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[13.5px] leading-[1.5] text-slate-700 transition group-hover:text-slate-900">
                        {suggestion}
                      </span>
                      <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-7">
                {messages.map((message) => (
                  <div key={message.id} className="stream-in">
                    <ChatMessageView
                      message={message}
                      streaming={streamingId === message.id}
                      author="Harness Code"
                      edits={message.edits}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-[48rem] px-4 pb-3 pt-3.5 sm:px-6">
            <div className="rounded-2xl border border-slate-200 bg-white px-3.5 pb-2.5 pt-3 shadow-[0_2px_10px_-6px_rgba(15,23,42,0.18)] transition focus-within:border-violet-300 focus-within:shadow-[0_10px_30px_-18px_rgba(109,40,217,0.45)] focus-within:ring-4 focus-within:ring-violet-50">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => onInputChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                placeholder="Ask Harness Code for a function, a fix or a query…"
                className="composer-input max-h-[170px] w-full resize-none overflow-hidden bg-transparent px-0.5 text-[14.5px] leading-[1.65] text-slate-800 outline-none placeholder:text-slate-400"
                aria-label="Message Harness Code"
              />

              <AttachmentChips files={attachments} onRemove={onRemoveAttachment} />

              <div className="mt-2.5 flex items-center gap-2">
                <AttachButton onFiles={onAttach} disabled={streaming} />
                <span className="hidden text-[11.5px] text-slate-400 sm:block">
                  Enter to send · Shift+Enter for a new line
                </span>
                {streaming ? (
                  <button
                    type="button"
                    onClick={onStop}
                    className="ml-auto flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12px] font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    <Square className="h-2.5 w-2.5 fill-current" />
                    Stop
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={!canSend}
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_8px_18px_-10px_rgba(109,40,217,0.8)] transition hover:brightness-110 disabled:from-slate-200 disabled:to-slate-200 disabled:text-white disabled:shadow-none"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-2 px-1 text-[11.5px] text-slate-400">
              <span className="hidden sm:block">Harness Code runs on the web only.</span>
              <button
                type="button"
                onClick={onBackToCopilot}
                className="ml-auto flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <MessageSquare className="h-3 w-3" />
                Back to Copilot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ project */}
      <div
        className={cn(
          "min-h-0 min-w-0 flex-1 flex-col border-slate-200 bg-[#f7f8fb] lg:w-[24rem] lg:flex-none lg:border-l xl:w-[27rem]",
          pane === "code" ? "flex" : "hidden",
          "lg:flex"
        )}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
          <FileCode className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-slate-800">
            Your project
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-1.5 py-px text-[10.5px] font-semibold text-slate-600">
            {project.length}
          </span>
          <button
            type="button"
            onClick={() => setPane("chat")}
            className="ml-auto flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 lg:hidden"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Chat
          </button>
        </div>

        {!active ? (
          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <div className="max-w-[16rem] text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <FileCode className="h-5 w-5" />
              </div>
              <p className="mt-3 text-[13px] font-semibold text-slate-800">No files yet</p>
              <p className="mt-1.5 text-[12.5px] leading-[1.65] text-slate-500">
                Ask for a change and the file it writes shows up here. Asking for the same file
                again updates it.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="anim-stagger flex shrink-0 gap-1.5 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2">
              {project.map((file) => (
                <button
                  key={file.name}
                  type="button"
                  onClick={() => setSelectedName(file.name)}
                  aria-current={file.name === active.name}
                  title={file.name}
                  className={cn(
                    "press flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition",
                    file.name === active.name
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  )}
                >
                  <FileCode
                    className={cn(
                      "h-3 w-3 shrink-0",
                      file.name === active.name ? "text-violet-300" : "text-slate-400"
                    )}
                  />
                  <span className="truncate font-mono text-[11.5px]">{file.name}</span>
                </button>
              ))}
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
                <div className="min-w-0">
                  <div className="truncate font-mono text-[12px] font-medium text-slate-800">
                    {active.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="uppercase tracking-[0.06em]">{active.lang || "text"}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                    <span>
                      {lines.length} line{lines.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
                <CopyButton text={active.code} className="ml-auto h-7 shrink-0 px-2 text-[11px]" />
              </div>

              <div className="min-h-0 flex-1 overflow-auto bg-white">
                <div className="flex min-h-full min-w-max font-mono">
                  <div
                    aria-hidden
                    className="select-none border-r border-slate-100 bg-[#fcfcfe] px-3 py-4 text-right text-[11.5px] leading-[22px] text-slate-300"
                  >
                    {lines.map((_, index) => (
                      <div key={index}>{index + 1}</div>
                    ))}
                  </div>
                  <pre className="px-4 py-4 text-[12.5px] leading-[22px] text-slate-800">
                    <code>{active.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
