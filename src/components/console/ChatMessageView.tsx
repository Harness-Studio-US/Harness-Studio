import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Compass,
  FileText,
  Globe,
  Loader2,
  Sparkles,
  Terminal,
} from "lucide-react";
import type { ChatMessage, ToolCall, ToolName } from "../../lib/chat";
import { Markdown } from "../Markdown";
import { LogoMark } from "../Logo";
import { CopyButton } from "../CodeBlock";
import { cn } from "../../lib/cn";

const toolIcons: Record<ToolName, typeof Globe> = {
  web_search: Globe,
  code_execution: Terminal,
  file_search: FileText,
  browser: Compass,
};

function ToolCallCard({ call, streaming }: { call: ToolCall; streaming: boolean }) {
  const Icon = toolIcons[call.name] ?? Terminal;
  const running = call.status === "running" && streaming;

  return (
    <div className="overflow-hidden rounded-lg border border-violet-200 bg-violet-50">
      <div className="flex items-center gap-2 px-2.5 py-2">
        <span className="flex h-5 w-5 items-center justify-center rounded border border-violet-200 bg-violet-50">
          <Icon className="h-2.5 w-2.5 text-violet-700" />
        </span>
        <span className="text-[11px] font-medium text-slate-800">{call.label}</span>
        <span className="rounded bg-slate-50 px-1 py-0.5 font-mono text-[8.5px] text-slate-500">
          {call.name}
        </span>
        <span className="ml-auto flex items-center gap-1 text-[9px]">
          {running ? (
            <>
              <Loader2 className="h-2.5 w-2.5 animate-spin text-violet-700" />
              <span className="text-violet-700">running</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
              <span className="text-slate-500">
                {call.durationMs ? `${(call.durationMs / 1000).toFixed(1)}s` : "done"}
              </span>
            </>
          )}
        </span>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-2.5 py-1.5">
        <details>
          <summary className="cursor-pointer list-none text-[9.5px] text-slate-500 hover:text-slate-700 [&::-webkit-details-marker]:hidden">
            Arguments
          </summary>
          <pre className="mt-1 overflow-x-auto font-mono text-[9px] leading-relaxed text-slate-500">
            {JSON.stringify(call.args, null, 2)}
          </pre>
        </details>
        {call.result && (
          <p className="mt-1 line-clamp-2 text-[9.5px] text-slate-500">
            <span className="text-emerald-600/80">result </span>
            {call.result}
          </p>
        )}
      </div>
    </div>
  );
}

export function ChatMessageView({ message, streaming }: { message: ChatMessage; streaming: boolean }) {
  const [thinkingOpen, setThinkingOpen] = useState(false);

  if (message.role === "user") {
    return (
      <div className="flex items-start justify-end gap-2.5">
        <div className="max-w-[85%] rounded-2xl rounded-tr-md border border-slate-200 bg-slate-100 px-3.5 py-2.5">
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-800">{message.content}</p>
        </div>
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[9px] font-semibold text-slate-600">
          You
        </div>
      </div>
    );
  }

  const hasTrace = (message.thinking?.length ?? 0) > 0;
  const hasTools = (message.toolCalls?.length ?? 0) > 0;
  const showPlaceholder = streaming && !message.content && !hasTrace && !hasTools;

  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
        <LogoMark className="h-[18px] w-[18px]" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold text-slate-900">Harness Code</span>
          {message.model && (
            <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[8.5px] text-slate-500">
              {message.model}
            </span>
          )}
          {message.error && (
            <span className="inline-flex items-center gap-1 rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[8.5px] text-rose-600">
              <AlertTriangle className="h-2.5 w-2.5" />
              error
            </span>
          )}
          {message.stopped && <span className="text-[9px] text-slate-400">stopped</span>}
        </div>

        {hasTrace && (
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setThinkingOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500 transition hover:text-slate-700"
            >
              <Sparkles className="h-2.5 w-2.5 text-violet-600" />
              {streaming ? "Reasoning" : "Thought"} · {message.thinking?.length} steps
              <ChevronDown
                className={cn("h-2.5 w-2.5 transition", (thinkingOpen || streaming) && "rotate-180")}
              />
            </button>
            {(thinkingOpen || streaming) && (
              <ol className="mt-1.5 space-y-1 border-l border-violet-200 pl-3">
                {message.thinking?.map((step, index) => (
                  <li key={index} className="stream-in flex gap-2 text-[10.5px] leading-relaxed text-slate-500">
                    <span className="shrink-0 font-mono text-[8.5px] text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
          <div className="flex items-center gap-2 py-1 text-[11.5px] text-slate-500">
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
            Thinking
          </div>
        ) : (
          <div className={cn(message.error && "rounded-lg border border-rose-200 bg-rose-50 p-3")}>
            <Markdown content={message.content} />
            {streaming && message.content && <span className="caret" />}
          </div>
        )}

        {!streaming && (message.content || message.usage) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9.5px] text-slate-400">
            {message.usage && (
              <>
                <span className="font-mono">
                  {message.usage.in.toLocaleString()} in · {message.usage.out.toLocaleString()} out
                </span>
                {message.latencyMs ? (
                  <span className="font-mono">{(message.latencyMs / 1000).toFixed(1)}s</span>
                ) : null}
                {message.latencyMs ? (
                  <span className="font-mono">
                    {Math.round(message.usage.out / Math.max(message.latencyMs / 1000, 0.1))} tok/s
                  </span>
                ) : null}
                <span className="h-1 w-1 rounded-full bg-slate-200" />
              </>
            )}
            <CopyButton text={message.content} className="h-6 px-1.5 text-[9px]" />
          </div>
        )}
      </div>
    </div>
  );
}
