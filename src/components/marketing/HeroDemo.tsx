import { useEffect, useState } from "react";
import { Check, MessageSquare, Send, Sparkles, Undo2 } from "lucide-react";
import { LogoMark } from "../Logo";

const reply =
  "Done. I grouped the key numbers, shortened the labels and gave everything a little more room. Take a look in your app.";

const changes = [
  "Reorganized the dashboard",
  "Simplified the labels",
  "Checked the mobile view",
];

const bars = [42, 68, 54, 82, 64, 90, 74];

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
        index = Math.min(index + 4, reply.length);
        setChars(index);
        if (index >= reply.length) {
          if (intervalId) window.clearInterval(intervalId);
          resetId = window.setTimeout(start, 7000);
        }
      }, 38);
    };

    const initial = window.setTimeout(start, 800);
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
            <span className="font-mono text-[10px] text-zinc-500">harness.studio</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-300">
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            In your app
          </div>
        </div>

        <div className="grid sm:grid-cols-[1.08fr_0.92fr]">
          {/* chat */}
          <div className="min-h-[350px] space-y-4 border-b border-white/[0.07] p-4 sm:border-b-0 sm:border-r">
            <div className="flex items-start justify-end gap-2">
              <div className="max-w-[88%] rounded-2xl rounded-tr-sm border border-white/10 bg-white/[0.055] px-3 py-2 text-[11.5px] leading-relaxed text-zinc-300">
                The dashboard feels messy. Can you make it easier to scan?
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
                <div className="mb-1.5 flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-zinc-200">Harness</span>
                  <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-1.5 py-0.5 text-[8px] text-violet-300">
                    AI teammate
                  </span>
                </div>

                <p className="text-[11.5px] leading-relaxed text-zinc-400">
                  {reply.slice(0, chars)}
                  {chars < reply.length && <span className="caret" />}
                </p>

                <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-300">
                      <Sparkles className="h-3 w-3 text-violet-400" />
                      What I changed
                    </span>
                    <span className="flex items-center gap-1 text-[8.5px] text-emerald-300">
                      <Check className="h-2.5 w-2.5" />
                      Ready to review
                    </span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {changes.map((change) => (
                      <div key={change} className="flex items-center gap-2 text-[9.5px] text-zinc-400">
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10">
                          <Check className="h-2 w-2 text-emerald-400" />
                        </span>
                        {change}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="inline-flex h-7 items-center gap-1 rounded-md bg-white px-2.5 text-[9.5px] font-medium text-slate-900">
                    <Check className="h-2.5 w-2.5" />
                    Review changes
                  </span>
                  <span className="inline-flex h-7 items-center gap-1 rounded-md border border-white/10 px-2 text-[9.5px] text-zinc-400">
                    <Undo2 className="h-2.5 w-2.5" />
                    Undo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* app preview */}
          <div className="hidden min-h-[350px] bg-[#f7f8fb] p-3 sm:block">
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <div className="flex h-4 w-4 items-center justify-center rounded bg-slate-900">
                <LogoMark className="h-2.5 w-2.5" />
              </div>
              <span className="text-[8px] font-medium text-slate-600">Harness Studio</span>
              <span className="ml-auto flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[7px] text-slate-500">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                Live preview
              </span>
            </div>

            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[9px] font-semibold text-slate-900">Overview</div>
                  <div className="mt-0.5 text-[7px] text-slate-400">A clearer look at your week</div>
                </div>
                <span className="rounded border border-slate-200 px-1 py-0.5 text-[6.5px] text-slate-500">
                  This week
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                {[
                  ["Visitors", "2,418"],
                  ["Sign-ups", "184"],
                  ["Revenue", "$8.2k"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-slate-100 bg-slate-50 p-1.5">
                    <div className="text-[6.5px] text-slate-400">{label}</div>
                    <div className="mt-0.5 text-[10px] font-semibold text-slate-800">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 rounded-md border border-slate-100 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-[7px] font-medium text-slate-600">Weekly activity</span>
                  <span className="text-[6px] text-emerald-600">+18%</span>
                </div>
                <div className="mt-2 flex h-12 items-end gap-1">
                  {bars.map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-sm bg-gradient-to-t from-sky-200 to-violet-400"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-lg border border-slate-200 bg-white p-2">
              <div className="flex items-center gap-1.5 text-[7px] text-slate-500">
                <MessageSquare className="h-2.5 w-2.5 text-violet-500" />
                Harness updated this view
                <Check className="ml-auto h-2.5 w-2.5 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* composer */}
        <div className="border-t border-white/[0.07] p-3">
          <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
            <span className="mb-0.5 flex-1 text-[11px] text-zinc-600">
              Ask for another change, or just say what you think…
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-violet-600">
              <Send className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
