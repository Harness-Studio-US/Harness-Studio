import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Code,
  Copy,
  Download,
  FileCode,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  Square,
  Trash2,
  Undo2,
} from "lucide-react";
import type { ChatMessage } from "../../lib/chat";
import { diffLines, type ProjectFile } from "../../lib/codeFiles";
import { readAttachments, type Attachment } from "../../lib/files";
import { findSyntaxIssue } from "../../lib/syntax";
import { downloadText } from "../../lib/transcript";
import { downloadZip } from "../../lib/zip";
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
  onExport,
  onRegenerate,
  onRenameFile,
  onDeleteFile,
  onUpdateFile,
  onCreateFile,
  onDuplicateFile,
  onSendToCopilot,
  onCheckFile,
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
  onExport: () => void;
  onRegenerate: () => void;
  onRenameFile: (from: string, to: string) => void;
  onDeleteFile: (name: string) => void;
  onUpdateFile: (name: string, code: string) => void;
  onCreateFile: (name: string) => void;
  onDuplicateFile: (from: string, to: string) => void;
  onSendToCopilot: (file: ProjectFile) => void;
  onCheckFile: (file: ProjectFile) => void;
  canUndo: boolean;
  onUndo: () => void;
  onBackToCopilot: () => void;
}) {
  const [selectedName, setSelectedName] = useState(project[0]?.name ?? "");
  const [pane, setPane] = useState<"chat" | "code">("chat");
  /** Files that replaced an earlier version can be read as a diff. */
  const [showDiff, setShowDiff] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /** The name being typed, or null when the header shows the name as text. */
  const [renaming, setRenaming] = useState<string | null>(null);
  /** The file open in the plain-text editor, and the text being typed there. */
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!project.some((file) => file.name === selectedName)) {
      setSelectedName(project[0]?.name ?? "");
    }
  }, [project, selectedName]);

  useEffect(() => {
    setShowDiff(false);
    setMenuOpen(false);
    setRenaming(null);
    setEditing(false);
    setDraft("");
  }, [selectedName]);

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
  // A 4B model can ship a mistyped closing tag; the panel says so instead of
  // letting the file arrive in the project looking fine.
  const issue = active ? findSyntaxIssue(active.lang, active.code) : null;
  const lines = active ? active.code.split("\n") : [];
  const streaming = streamingId !== null;
  const empty = messages.length === 0;
  const canSend = (input.trim().length > 0 || attachments.length > 0) && !streaming;

  function submit() {
    if (!canSend) return;
    onSend(input);
  }

  function startEdit() {
    if (!active) return;
    setShowDiff(false);
    setDraft(active.code);
    setEditing(true);
  }

  function saveEdit() {
    if (!active) return;
    if (draft !== active.code) onUpdateFile(active.name, draft);
    setEditing(false);
  }

  function duplicateFile() {
    if (!active) return;
    setMenuOpen(false);
    const dot = active.name.lastIndexOf(".");
    const base = dot > 0 ? active.name.slice(0, dot) : active.name;
    const ext = dot > 0 ? active.name.slice(dot) : "";
    let name = `${base}-copy${ext}`;
    let count = 2;
    while (project.some((file) => file.name === name)) {
      name = `${base}-copy-${count}${ext}`;
      count++;
    }
    onDuplicateFile(active.name, name);
    setSelectedName(name);
  }

  function newFile() {
    let name = "untitled.ts";
    let count = 2;
    while (project.some((file) => file.name === name)) {
      name = `untitled-${count}.ts`;
      count++;
    }
    onCreateFile(name);
    setSelectedName(name);
    setEditing(false);
    setShowDiff(false);
  }

  function commitRename() {
    const next = (renaming ?? "").trim();
    setRenaming(null);
    if (!active || !next || next === active.name) return;
    // A name already taken would silently overwrite the other file.
    if (project.some((file) => file.name === next)) return;
    onRenameFile(active.name, next);
    setSelectedName(next);
  }

  return (
    <div
      className={cn(
        "anim-fade-in relative flex min-h-0 flex-1 flex-col lg:flex-row",
        dragActive && "ring-2 ring-inset ring-violet-300"
      )}
      onDragOver={(event) => {
        if (!Array.from(event.dataTransfer.types).includes("Files")) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        setDragActive(true);
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) return;
        setDragActive(false);
      }}
      onDrop={(event) => {
        const dropped = event.dataTransfer.files;
        if (!dropped || dropped.length === 0) return;
        event.preventDefault();
        setDragActive(false);
        void readAttachments(dropped).then(onAttach);
      }}
    >
      {dragActive && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-violet-50/60">
          <span className="rounded-lg border border-violet-300 bg-white px-3 py-2 text-[12px] font-medium text-violet-800 shadow-sm">
            Drop files to attach
          </span>
        </div>
      )}
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
              onClick={onExport}
              disabled={empty && messages.length === 0}
              title="Download this chat and its files as Markdown"
              className="press flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
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

                {messages[messages.length - 1]?.role === "assistant" && !streaming && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onRegenerate}
                      title="Ask again and replace this reply"
                      className="press flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11.5px] font-medium text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Regenerate
                    </button>
                  </div>
                )}
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
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {project.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  downloadZip(project.map((file) => ({ name: file.name, text: file.code })))
                }
                title={`Download all ${project.length} files as a .zip`}
                className="press flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download all</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setPane("chat")}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 lg:hidden"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Chat
            </button>
          </div>
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
              <button
                type="button"
                onClick={newFile}
                title="Start a new file in this project"
                className="press ml-auto flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-[11.5px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <Plus className="h-3.5 w-3.5" />
                New file
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
                <div className="min-w-0 flex-1">
                  {renaming !== null ? (
                    <input
                      autoFocus
                      value={renaming}
                      onChange={(event) => setRenaming(event.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          commitRename();
                        } else if (event.key === "Escape") {
                          event.preventDefault();
                          setRenaming(null);
                        }
                      }}
                      spellCheck={false}
                      aria-label="File name"
                      className="w-full rounded-md border border-violet-300 bg-white px-1.5 py-0.5 font-mono text-[12px] text-slate-900 outline-none ring-2 ring-violet-100"
                    />
                  ) : (
                    <div className="truncate font-mono text-[12px] font-medium text-slate-800">
                      {active.name}
                    </div>
                  )}
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="uppercase tracking-[0.06em]">{active.lang || "text"}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                    <span>
                      {lines.length} line{lines.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-1.5">
                  {active.previous !== undefined && (
                    <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-medium">
                      <button
                        type="button"
                        onClick={() => setShowDiff(false)}
                        aria-pressed={!showDiff}
                        className={cn(
                          "rounded-md px-2 py-1 transition",
                          !showDiff
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        Code
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDiff(true)}
                        aria-pressed={showDiff}
                        className={cn(
                          "rounded-md px-2 py-1 transition",
                          showDiff
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        Changes
                      </button>
                    </div>
                  )}
                  {editing ? (
                    <>
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="press flex h-7 items-center rounded-md bg-slate-900 px-2.5 text-[11px] font-semibold text-white transition hover:bg-slate-800"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="press flex h-7 items-center rounded-md px-2 text-[11px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={startEdit}
                        title="Edit this file"
                        className="press flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                      >
                        <Pencil className="h-3 w-3" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <CopyButton text={active.code} className="h-7 shrink-0 px-2 text-[11px]" />
                    </>
                  )}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setMenuOpen((open) => !open)}
                      aria-expanded={menuOpen}
                      aria-haspopup="menu"
                      title="File actions"
                      className="press flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {menuOpen && (
                      <>
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-hidden
                          onClick={() => setMenuOpen(false)}
                          className="fixed inset-0 z-10 cursor-default"
                        />
                        <div
                          role="menu"
                          className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-[12px] shadow-[0_12px_30px_-12px_rgba(15,23,42,0.35)]"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setMenuOpen(false);
                              setRenaming(active.name);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50"
                          >
                            <Pencil className="h-3.5 w-3.5 text-slate-400" />
                            Rename
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={duplicateFile}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50"
                          >
                            <Copy className="h-3.5 w-3.5 text-slate-400" />
                            Duplicate
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setMenuOpen(false);
                              onSendToCopilot(active);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                            Ask Copilot
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setMenuOpen(false);
                              downloadText(active.name, active.code);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50"
                          >
                            <Download className="h-3.5 w-3.5 text-slate-400" />
                            Download
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setMenuOpen(false);
                              onCheckFile(active);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 transition hover:bg-slate-50"
                          >
                            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                            Check for errors
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setMenuOpen(false);
                              onDeleteFile(active.name);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-rose-600 transition hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {issue && !editing && (
                <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-3 py-2 text-[11.5px] leading-[1.5] text-amber-900">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="min-w-0 flex-1">Possible syntax error: {issue}</span>
                  <button
                    type="button"
                    onClick={() => onCheckFile(active)}
                    className="press shrink-0 rounded-md bg-amber-900/10 px-2 py-1 text-[11px] font-medium transition hover:bg-amber-900/20"
                  >
                    Ask Harness Code to fix
                  </button>
                </div>
              )}

              <div className="min-h-0 flex-1 overflow-auto bg-white">
                {editing ? (
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    spellCheck={false}
                    aria-label={`Edit ${active.name}`}
                    className="block h-full min-h-full w-full resize-none bg-white px-4 py-4 font-mono text-[12.5px] leading-[22px] text-slate-800 outline-none"
                  />
                ) : showDiff && active.previous !== undefined ? (
                  <div className="min-w-max py-3 font-mono text-[12px] leading-[20px]">
                    {diffLines(active.previous, active.code).map((line, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex gap-2 px-3",
                          line.kind === "add" && "bg-emerald-50",
                          line.kind === "remove" && "bg-rose-50"
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "w-2.5 shrink-0 select-none text-right",
                            line.kind === "add"
                              ? "text-emerald-600"
                              : line.kind === "remove"
                                ? "text-rose-500"
                                : "text-transparent"
                          )}
                        >
                          {line.kind === "add" ? "+" : line.kind === "remove" ? "−" : "·"}
                        </span>
                        <span
                          className={cn(
                            "whitespace-pre",
                            line.kind === "add"
                              ? "text-emerald-900"
                              : line.kind === "remove"
                                ? "text-rose-900"
                                : "text-slate-600"
                          )}
                        >
                          {line.text || " "}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
