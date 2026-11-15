import { Check, MessageSquare, Send, Sparkles } from "lucide-react";
import { LogoMark } from "../Logo";

const changes = [
  ["Overview", "Grouped the key numbers into one clear row"],
  ["Actions", "Kept one primary action instead of three"],
  ["Mobile", "Checked spacing and line length"],
];

const bars = [38, 62, 48, 78, 58, 88, 70];

export function HeroDemo() {
  return (
    <div
      className="relative min-w-0"
      aria-label="Harness Copilot preview showing a request and the resulting change summary"
    >
      <div className="overflow-hidden rounded-[18px] border border-[#1E293B] bg-[#080A11] shadow-[0_32px_70px_-40px_rgba(23,21,15,0.55)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <LogoMark className="h-4 w-4 shrink-0" />
          <span className="text-[12px] font-semibold text-[#F8FAFC]">Harness Copilot</span>
          <span className="hidden text-[11px] text-[#A1A1AA] sm:inline">/</span>
          <span className="hidden truncate text-[11px] text-[#A1A1AA] sm:inline">
            Storefront · Dashboard
          </span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#34D399]/25 bg-[#34D399]/10 px-2 py-1 text-[10px] font-medium text-[#a7f3d0]">
            <span className="h-1 w-1 rounded-full bg-[#34D399]" />
            Preview
          </span>
        </div>

        <div className="grid sm:grid-cols-[1.08fr_0.92fr]">
          <div className="min-h-[420px] space-y-5 border-b border-white/10 p-5 sm:border-b-0 sm:border-r">
            <div className="flex items-start justify-end gap-2.5">
              <div className="max-w-[88%] rounded-xl rounded-tr-sm bg-[#F8F8F6] px-3.5 py-2.5 text-[12.5px] leading-[1.65] text-[#0F172A]">
                The dashboard feels crowded. Can you make it easier to scan?
              </div>
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#27272A] text-[10px] font-semibold text-[#F8FAFC]">
                You
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]">
                <LogoMark className="h-[18px] w-[18px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-[#F8FAFC]">Copilot</span>
                  <span className="text-[10.5px] text-[#A1A1AA]">just now</span>
                </div>

                <p className="text-[12.5px] leading-[1.75] text-[#D4D4D8]">
                  Done. I grouped the key numbers, shortened the labels, and gave the layout more
                  room. The updated view is ready for you to review.
                </p>

                <div className="mt-3.5 rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#E2E8F0]">
                      <Sparkles className="h-3 w-3 text-[#c4b5fd]" />
                      What changed
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#a7f3d0]">
                      <Check className="h-2.5 w-2.5" />
                      Ready
                    </span>
                  </div>
                  <div className="mt-2.5 divide-y divide-white/[0.07]">
                    {changes.map(([label, detail]) => (
                      <div key={label} className="flex gap-2.5 py-2 text-[10.5px] leading-snug">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#34D399]/25 bg-[#34D399]/10">
                          <Check className="h-2 w-2 text-[#a7f3d0]" />
                        </span>
                        <span className="min-w-0 text-[#D4D4D8]">
                          <span className="font-medium text-[#F8FAFC]">{label}</span>
                          <span className="text-[#A1A1AA]"> — {detail}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#F8F8F6] px-3 text-[10.5px] font-semibold text-[#0F172A]">
                    Review changes
                  </span>
                  <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/15 px-2.5 text-[10.5px] text-[#D4D4D8]">
                    Ask for a tweak
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden bg-[#F8F8F6] p-4 sm:block">
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-[#0F172A]">
                <LogoMark className="h-3 w-3" />
              </div>
              <span className="text-[10.5px] font-semibold text-[#0F172A]">Storefront</span>
              <span className="ml-auto rounded border border-[#CBD5E1] bg-[#FFFFFF] px-1.5 py-0.5 text-[9.5px] text-[#475569]">
                Dashboard
              </span>
            </div>

            <div className="mt-3.5 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] font-semibold text-[#0F172A]">Overview</div>
                  <div className="mt-0.5 text-[10px] text-[#475569]">A clearer look at your week</div>
                </div>
                <span className="rounded border border-[#E2E8F0] px-1.5 py-0.5 text-[9.5px] text-[#475569]">
                  This week
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  ["Visitors", "2,418"],
                  ["Sign-ups", "184"],
                  ["Revenue", "$8.2k"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-2">
                    <div className="text-[9.5px] text-[#475569]">{label}</div>
                    <div className="mt-1 text-[13px] font-semibold tracking-[-0.02em] text-[#0F172A]">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-md border border-[#E2E8F0] p-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-medium text-[#334155]">Weekly activity</span>
                  <span className="text-[9.5px] font-medium text-[#047857]">+18%</span>
                </div>
                <div className="mt-2.5 flex h-14 items-end gap-1.5">
                  {bars.map((height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-sm bg-[#7C3AED]"
                      style={{ height: `${height}%`, opacity: 0.45 + index * 0.075 }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#FFFFFF] px-2.5 py-2 text-[10px] text-[#475569]">
              <MessageSquare className="h-3 w-3 text-[#6D28D9]" />
              Copilot updated this view
              <Check className="ml-auto h-3 w-3 text-[#047857]" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-3.5">
          <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-black/20 px-3.5 py-2.5">
            <span className="flex-1 text-[11.5px] text-[#A1A1AA]">
              Ask for another change, or say what you think…
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F8F8F6]">
              <Send className="h-3.5 w-3.5 text-[#0F172A]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
