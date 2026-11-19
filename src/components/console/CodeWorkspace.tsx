import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Code, FileCode, Sparkles } from "lucide-react";
import type { ChatMessage } from "../../lib/chat";
import { extractCodeFiles } from "../../lib/codeFiles";
import { CopyButton } from "../CodeBlock";
import { cn } from "../../lib/cn";

export function CodeWorkspace({
  messages,
  onAskCopilot,
}: {
  messages: ChatMessage[];
  onAskCopilot: () => void;
}) {
  const files = useMemo(() => extractCodeFiles(messages), [messages]);
  const [selectedId, setSelectedId] = useState(files[0]?.id ?? "");

  useEffect(() => {
    if (!files.some((file) => file.id === selectedId)) {
      setSelectedId(files[0]?.id ?? "");
    }
  }, [files, selectedId]);

  const active = files.find((file) => file.id === selectedId) ?? files[0] ?? null;
  const lines = active ? active.code.split("\n") : [];

  if (!active) {
    return (
      <div className="anim-fade-in flex flex-1 items-center justify-center px-6 py-16">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-[#fbfcfe]">
            <Code className="h-5 w-5 text-slate-500" />
          </div>
          <h2 className="mt-4 text-[17px] font-semibold tracking-[-0.01em] text-slate-900">
            No code in this chat yet
          </h2>
          <p className="mt-2 text-[12.5px] leading-[1.7] text-slate-600">
            Ask Copilot for a change and anything it writes shows up here as a file you can read,
            review and copy into your project.
          </p>
          <button
            type="button"
            onClick={onAskCopilot}
            className="press mx-auto mt-4 flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-[12px] font-medium text-white transition hover:bg-slate-800"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Back to Copilot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="anim-fade-in flex min-h-0 flex-1 flex-col md:flex-row">
      <div className="flex shrink-0 flex-col border-b border-slate-200 bg-[#fbfcfe] md:w-[238px] md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-2 px-3.5 pb-2 pt-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Code in this chat
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
            {files.length}
          </span>
        </div>
        <div className="anim-stagger flex gap-1.5 overflow-x-auto px-2.5 pb-2.5 md:flex-col md:gap-0.5 md:overflow-visible md:px-2">
          {files.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => setSelectedId(file.id)}
              aria-current={file.id === active.id}
              title={file.name}
              className={cn(
                "press flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-left transition md:w-full",
                file.id === active.id
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
              )}
            >
              <FileCode className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="truncate font-mono text-[11.5px]">{file.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-2.5">
          <FileCode className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="truncate font-mono text-[11.5px] text-slate-700">{active.name}</span>
          <span className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-slate-500 sm:inline">
            {active.lang}
          </span>
          <CopyButton text={active.code} className="ml-auto h-7 shrink-0 px-2 text-[10.5px]" />
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-[#fcfcfe]">
          <div className="flex min-h-full min-w-max font-mono">
            <div
              aria-hidden
              className="select-none border-r border-slate-200 bg-white/70 px-3 py-3 text-right text-[11px] leading-[21px] text-slate-400"
            >
              {lines.map((_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </div>
            <pre className="px-4 py-3 text-[12.5px] leading-[21px] text-slate-800">
              <code>{active.code}</code>
            </pre>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-x-2 gap-y-1 border-t border-slate-200 bg-[#fbfcfe] px-4 py-2 text-[10.5px] text-slate-600">
          <Sparkles className="h-3 w-3 shrink-0 text-violet-600" />
          <span>Written by Copilot in this conversation.</span>
          <button
            type="button"
            onClick={onAskCopilot}
            className="ml-auto flex items-center gap-1 rounded-md px-1.5 py-1 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Ask for a change
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
