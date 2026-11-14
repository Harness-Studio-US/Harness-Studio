import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, Cpu, Paperclip, Send, Sparkles, Wrench } from "lucide-react";
import { LogoMark } from "../Logo";

const reply =
  "The refresh cookie is scoped to /auth, so the browser never sends it on the actual refresh call. Set Path=/ and add a regression test before shipping.";

export function HeroDemo() {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    let index = 0;
    let intervalId: number | undefined;
    let resetId: number | undefined;

    const start = () => {
      index = 0;
      setChars(0);
      intervalId = window.setInterval(() => {
        index = Math.min(index + 3, reply.length);
        setChars(index);
        if (index >= reply.length) {
          if (intervalId) window.clearInterval(intervalId);
          resetId = window.setTimeout(start, 6000);
        }
      }, 34);
    };

    const initial = window.setTimeout(start, 700);
    return () => {
      window.clearTimeout(initial);
      if (intervalId) window.clearInterval(intervalId);
      if (resetId) window.clearTimeout(resetId);
    };
  }, []);

  return (
    <div className="relative">
      <div className="glow-orb left-1/4 top-0 h-64 w-64 bg-violet-300/30" />
      <div className="glow-orb bottom-0 right-0 h-56 w-56 bg-sky-200/40" />

      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#080a11]/95 shadow-[0_32px_80px_-36px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5">
        {/* window bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
          <div className="ml-3 flex items-center gap-1.5 rounded-md border border-white/[0.07] bg-black/40 px-2 py-1">
            <LogoMark className="h-3 w-3" />
            <span className="font-mono text-[10px] text-zinc-500">console.harness.studio</span>
          </div>
          <div className="ml-auto flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-300">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            streaming
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_190px]">
          {/* chat */}
          <div className="min-h-[330px] space-y-4 p-4">
            <div className="flex items-start justify-end gap-2">
              <div className="max-w-[85%] rounded-xl rounded-tr-sm border border-white/10 bg-white/[0.055] px-3 py-2 text-[12px] leading-relaxed text-zinc-300">
                Why isn&apos;t my session refreshing?
              </div>
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-[9px] font-semibold text-zinc-400">
                You
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/50">
                <LogoMark className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-zinc-200">Harness Code</span>
                  <span className="rounded border border-white/10 px-1 font-mono text-[8px] text-zinc-500">
                    code-1
                  </span>
                </div>

                <div className="mb-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <Wrench className="h-3 w-3 text-violet-400" />
                    <span className="font-medium">Read 6 files</span>
                    <span className="text-zinc-600">src/server/auth</span>
                    <CheckCircle2 className="ml-auto h-3 w-3 text-emerald-400" />
                  </div>
                  <div className="mt-1.5 flex gap-1.5">
                    <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[8px] text-zinc-500">
                      session.ts
                    </span>
                    <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[8px] text-zinc-500">
                      tokens.ts
                    </span>
                    <span className="rounded bg-white/[0.05] px-1.5 py-0.5 font-mono text-[8px] text-zinc-500">
                      +4
                    </span>
                  </div>
                </div>

                <p className="text-[11.5px] leading-relaxed text-zinc-400">
                  {reply.slice(0, chars)}
                  {chars < reply.length && <span className="caret" />}
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-[8.5px] text-zinc-600">
                  <Sparkles className="h-2.5 w-2.5 text-violet-500" />
                  1,284 in · 96 out · 1.4s
                </div>
              </div>
            </div>
          </div>

          {/* settings rail */}
          <aside className="hidden border-l border-white/[0.07] bg-black/30 p-3 md:block">
            <div className="mb-3 flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
              <Cpu className="h-3 w-3 text-sky-400" />
              Parameters
            </div>
            <div className="space-y-3">
              {[
                { label: "temperature", value: "0.40", width: "40%" },
                { label: "top_p", value: "0.95", width: "95%" },
                { label: "max_tokens", value: "2048", width: "62%" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex justify-between font-mono text-[8.5px] text-zinc-500">
                    <span>{row.label}</span>
                    <span className="text-zinc-300">{row.value}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.08]">
                    <div
                      className="h-1 rounded-full bg-gradient-to-r from-sky-400 to-violet-500"
                      style={{ width: row.width }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-white/[0.07] pt-3">
              <div className="mb-2 text-[9px] font-medium text-zinc-500">Tools enabled</div>
              <div className="space-y-1.5">
                {["web_search", "code_execution"].map((tool) => (
                  <div key={tool} className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[8.5px] text-zinc-400">{tool}</span>
                    <span className="flex h-3 w-6 items-center rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-0.5">
                      <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-2 opacity-50">
                  <span className="font-mono text-[8.5px] text-zinc-400">file_search</span>
                  <span className="flex h-3 w-6 items-center rounded-full bg-white/10 px-0.5">
                    <span className="h-2 w-2 rounded-full bg-zinc-400" />
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="mt-4 flex w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[9px] text-zinc-400"
            >
              harness-code-1
              <ChevronDown className="h-2.5 w-2.5" />
            </button>
          </aside>
        </div>

        {/* composer */}
        <div className="border-t border-white/[0.07] p-3">
          <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
            <Paperclip className="mb-1 h-3.5 w-3.5 text-zinc-600" />
            <span className="mb-0.5 flex-1 text-[11px] text-zinc-600">Ask Harness to build, debug or explain…</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-600">
              <Send className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="animate-float-slow absolute -right-3 -top-5 hidden rounded-xl border border-white/10 bg-[#0c0f18]/95 p-3 shadow-2xl backdrop-blur lg:block">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          </span>
          <div>
            <div className="text-[10px] font-semibold text-zinc-100">Patch verified</div>
            <div className="font-mono text-[8px] text-zinc-500">34 tests · 0 failures</div>
          </div>
        </div>
      </div>
    </div>
  );
}
