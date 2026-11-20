import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Code,
  FileCode,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Square,
  Undo2,
} from "lucide-react";
import type { ChatMessage } from "../../lib/chat";
import type { ProjectFile } from "../../lib/codeFiles";
import { ChatMessageView } from "./ChatMessageView";
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
}: {
  messages: ChatMessage[];
  project: ProjectFile[];
  streamingId: string | null;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (text: string) => void;
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
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const active = project.find((file) => file.name === selectedName) ?? project[0] ?? null;
  const lines = active ? active.code.split("\n") : [];
  const streaming = streamingId !== null;

  function submit() {
    if (!input.trim() || streaming) return;
    onSend(input);
  }

  return (
    <div className="anim-fade-in flex min-h-0 flex-1 flex-col lg:flex-row">
      {/* chat */}
      <div
        className={cn(
          "min-h-0 min-w-0 flex-1 flex-col",
          pane === "chat" ? "flex" : "hidden",
          "lg:flex"
        )}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
          <span className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
            <Code className="h-3 w-3" />
            Harness Code
          </span>
          <span className="hidden truncate text-[11.5px] text-slate-500 sm:block">
            A coding chat. Ask for a function, a fix or a query.
          </span>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPane("chat");
                onNewChat();
              }}
              disabled={messages.length === 0 && !input}
              title="Start a fresh code chat"
              className="press flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <Plus className="h-3 w-3" />
              New
            </button>
            <button
              type="button"
              onClick={() => setPane("code")}
              className="flex shrink-0 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50 lg:hidden"
            >
              <FileCode className="h-3 w-3" />
              Code
              <span className="rounded-full bg-slate-100 px-1.5 text-[10px] text-slate-600">
                {project.length}
              </span>
            </button>
          </div>
        </div>

        {canUndo && (
          <div
            role="status"
            className="anim-fade-in flex shrink-0 items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-[11.5px] text-amber-900"
          >
            <Undo2 className="h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 flex-1 truncate">Started a fresh code chat.</span>
            <button
              type="button"
              onClick={onUndo}
              className="press shrink-0 rounded-md border border-amber-300 bg-white px-2 py-1 text-[11px] font-semibold text-amber-900 transition hover:bg-amber-100"
            >
              Undo
            </button>
          </div>
        )}

        <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 py-5">
            {messages.length === 0 ? (
              <div className="animate-rise py-6">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                  Code chat
                </div>
                <h2 className="mt-3 text-[26px] font-semibold leading-[1.12] tracking-[-0.04em] text-slate-900">
                  What are you coding?
                </h2>
                <p className="mt-2 max-w-lg text-[13px] leading-[1.7] text-slate-600">
                  Describe the function, the bug or the query. Harness Code answers with code you can
                  read and copy, and keeps every block it writes in the panel beside this chat.
                </p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {codeSuggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => onSend(suggestion)}
                      style={{ animationDelay: `${90 + index * 55}ms` }}
                      className="stream-in rounded-lg border border-slate-200 bg-white p-3 text-left text-[12.5px] leading-[1.6] text-slate-700 transition hover:border-violet-300 hover:bg-violet-50/40 hover:text-slate-900"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
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

        <div className="shrink-0 border-t border-slate-200 bg-[#fbfcfe]">
          <div className="mx-auto w-full max-w-3xl px-4 py-3">
            <div className="rounded-xl border border-slate-300 bg-white px-3.5 py-3 transition focus-within:border-violet-400 focus-within:shadow-[0_8px_30px_-22px_rgba(15,23,42,0.28)]">
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
                className="composer-input max-h-[160px] w-full resize-none overflow-hidden bg-transparent px-0.5 py-0.5 text-[13.5px] leading-[1.7] text-slate-800 outline-none placeholder:text-slate-500"
                aria-label="Message Harness Code"
              />

              <div className="mt-2 flex items-center justify-end gap-2">
                <span className="mr-auto hidden text-[10.5px] text-slate-500 sm:block">
                  Code first. Paste it straight into your project.
                </span>
                {streaming ? (
                  <button
                    type="button"
                    onClick={onStop}
                    className="flex h-8 items-center gap-1.5 rounded-md border border-slate-300 bg-slate-100 px-2.5 text-[11px] font-medium text-slate-700 hover:bg-slate-200"
                  >
                    <Square className="h-2.5 w-2.5 fill-current" />
                    Stop
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={!input.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-sky-600 to-violet-700 text-white transition hover:brightness-110 disabled:opacity-30"
                    aria-label="Send message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 px-1 text-[10.5px] text-slate-500">
              <span>Enter to send · Shift+Enter for a new line</span>
              <button
                type="button"
                onClick={onBackToCopilot}
                className="flex items-center gap-1 rounded px-1 py-0.5 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <MessageSquare className="h-3 w-3" />
                Back to Copilot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* code panel */}
      <div
        className={cn(
          "min-h-0 min-w-0 flex-1 flex-col border-slate-200 bg-white lg:w-[44%] lg:flex-none lg:border-l",
          pane === "code" ? "flex" : "hidden",
          "lg:flex"
        )}
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-[#fbfcfe] px-3.5 py-2.5">
          <FileCode className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Your project
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
            {project.length}
          </span>
          <button
            type="button"
            onClick={() => setPane("chat")}
            className="ml-auto flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50 lg:hidden"
          >
            <ArrowLeft className="h-3 w-3" />
            Chat
          </button>
        </div>

        {!active ? (
          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <div className="max-w-[250px] text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-[#fbfcfe]">
                <Code className="h-4 w-4 text-slate-500" />
              </div>
              <p className="mt-3 text-[12px] font-medium text-slate-800">No files yet</p>
              <p className="mt-1.5 text-[11.5px] leading-[1.65] text-slate-500">
                Ask for a change and Harness Code writes the file here. Writing the same file again
                updates it.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="anim-stagger flex shrink-0 gap-1.5 overflow-x-auto px-2.5 py-2">
              {project.map((file) => (
                <button
                  key={file.name}
                  type="button"
                  onClick={() => setSelectedName(file.name)}
                  aria-current={file.name === active.name}
                  title={file.name}
                  className={cn(
                    "press flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left transition",
                    file.name === active.name
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                  )}
                >
                  <FileCode className="h-3 w-3 shrink-0 text-slate-400" />
                  <span className="truncate font-mono text-[11px]">{file.name}</span>
                </button>
              ))}
            </div>

            <div className="flex min-h-0 flex-1 flex-col border-t border-slate-200">
              <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-3.5 py-2">
                <span className="truncate font-mono text-[11px] text-slate-700">{active.name}</span>
                <span className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-slate-500 sm:inline">
                  {active.lang}
                </span>
                <CopyButton text={active.code} className="ml-auto h-7 shrink-0 px-2 text-[10.5px]" />
              </div>

              <div className="min-h-0 flex-1 overflow-auto bg-[#fcfcfe]">
                <div className="flex min-h-full min-w-max font-mono">
                  <div
                    aria-hidden
                    className="select-none border-r border-slate-200 bg-white/70 px-2.5 py-3 text-right text-[11px] leading-[21px] text-slate-400"
                  >
                    {lines.map((_, index) => (
                      <div key={index}>{index + 1}</div>
                    ))}
                  </div>
                  <pre className="px-3.5 py-3 text-[12px] leading-[21px] text-slate-800">
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
