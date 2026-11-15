import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  SquarePen,
  X,
} from "lucide-react";
import { Logo, LogoMark } from "../Logo";
import { cn } from "../../lib/cn";
import { legalEffectiveLabel } from "../../data/legal";

export function LegalConsent({ onAccept }: { onAccept: () => void }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="ai-screen-in relative flex min-h-screen flex-col overflow-hidden bg-[#f8f8f6] text-slate-900">
      <div className="grid-bg absolute inset-0" />
      <div className="glow-orb -left-12 top-24 h-80 w-80 bg-violet-300/20" />
      <div className="glow-orb bottom-0 right-[6%] h-72 w-72 bg-sky-200/25" />

      <header className="relative z-10 mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link to="/" aria-label="Harness Studio home">
          <Logo markClassName="h-8 w-8" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/60 px-3 py-1.5 text-[10.5px] font-medium text-slate-600 backdrop-blur transition hover:bg-white hover:text-slate-900"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to site
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-8">
        <section className="animate-rise hidden max-w-xl lg:block">
          <span className="inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span className="ai-live-dot h-1.5 w-1.5 rounded-full bg-violet-500 text-violet-500" />
            Harness Copilot
          </span>
          <h1 className="mt-6 text-[54px] font-bold leading-[1.01] tracking-[-0.055em] text-slate-950">
            Your workspace,
            <br />
            without the setup.
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-slate-600">
            Ask for changes, explore an idea, or work through a problem in your own words. Harness
            Copilot meets you in the conversation and helps you decide what comes next.
          </p>

          <div className="mt-8 max-w-md rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white">
                <LogoMark className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[11px] font-semibold text-slate-900">Harness Copilot</div>
                <div className="text-[9px] text-slate-400">Demo workspace</div>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-1 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-violet-700">
                <span className="h-1 w-1 rounded-full bg-violet-500" />
                Demo
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-slate-900 px-3 py-2 text-[11px] leading-relaxed text-white">
                Make the dashboard easier to scan.
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
                  <Sparkles className="h-3 w-3 text-violet-600" />
                </span>
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3 py-2.5">
                  <div className="text-[10.5px] leading-relaxed text-slate-600">
                    I’d group the key numbers first, then make the secondary detail quieter. Want me
                    to show you a cleaner layout?
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[8.5px] font-medium text-emerald-700">
                    <Check className="h-2.5 w-2.5" />
                    Ready to review
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid max-w-md gap-2 text-[11px] text-slate-500 sm:grid-cols-3">
            {[
              { icon: MessageSquare, label: "Talk it through" },
              { icon: SquarePen, label: "Shape the result" },
              { icon: ShieldCheck, label: "Stays in your browser" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <item.icon className="h-3 w-3 text-violet-600" />
                {item.label}
              </div>
            ))}
          </div>
        </section>

        <section className="ai-card-in mx-auto w-full max-w-[460px] rounded-[28px] border border-slate-200/90 bg-white/95 p-6 shadow-[0_36px_100px_-55px_rgba(15,23,42,0.5)] backdrop-blur sm:p-7">
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <Logo markClassName="h-7 w-7" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2 py-1 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-violet-700">
              <span className="h-1 w-1 rounded-full bg-violet-500" />
              Demo
            </span>
          </div>

          <div className="mt-5 lg:mt-0">
            <span className="inline-flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-violet-600">
              <FileText className="h-3 w-3" />
              Before you start
            </span>
            <h2 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.04em] text-slate-950">
              Your Copilot workspace is ready.
            </h2>
            <p className="mt-2.5 text-[12px] leading-[1.75] text-slate-500">
              No account, no setup. Review and accept the terms and privacy policy to open the
              demo.
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <div className="text-[10px] leading-relaxed text-slate-500">
                <span className="font-medium text-slate-700">A browser demo.</span> Replies are
                simulated, and everything you type stays in this browser. Nothing is sent to a
                server.
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2.5">
            <input
              id="copilot-legal-agree"
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-violet-600"
            />
            <label
              htmlFor="copilot-legal-agree"
              className="cursor-pointer text-[11px] leading-relaxed text-slate-600"
            >
              I am 16 or older and agree to the Terms &amp; Conditions and Privacy Policy.
            </label>
          </div>

          <p className="mt-2 pl-[26px] text-[9.5px] leading-relaxed text-slate-400">
            Read the{" "}
            <Link
              to="/terms"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-800"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-800"
            >
              Privacy Policy
            </Link>
            . They open in a new tab.
          </p>

          <button
            type="button"
            onClick={onAccept}
            disabled={!agreed}
            className="btn-primary mt-5 h-11 w-full px-4 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Agree &amp; open Copilot
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-3 text-center text-[9px] leading-relaxed text-slate-400">
            Effective {legalEffectiveLabel}. You can read both documents again from the workspace
            sidebar.
          </p>
        </section>
      </main>
    </div>
  );
}

export function FirstRunGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Sparkles,
      eyebrow: "Quick guide · 1 of 3",
      title: "Meet Harness Copilot.",
      body: "Your AI workspace for shaping, fixing and understanding the Harness Studio project. Start with a sentence — no commands or setup required.",
    },
    {
      icon: MessageSquare,
      eyebrow: "Quick guide · 2 of 3",
      title: "Ask like you'd ask a teammate.",
      body: "Describe the outcome you want, the problem you're seeing, or the part you'd like explained. Copilot works through it with you.",
    },
    {
      icon: CheckCircle2,
      eyebrow: "Quick guide · 3 of 3",
      title: "Review, then iterate.",
      body: "Pick an example or write your own prompt. Stop a response whenever you like, start a new chat, or return to an earlier conversation.",
    },
  ];

  const current = steps[step];
  const Icon = current.icon;
  const last = step === steps.length - 1;

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/25 p-4 backdrop-blur-[2px] sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="copilot-guide-title"
        onClick={(event) => event.stopPropagation()}
        className="ai-guide-in w-full max-w-[430px] rounded-[22px] border border-slate-200 bg-white p-5 text-left shadow-[0_30px_100px_-30px_rgba(15,23,42,0.5)]"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-200 bg-violet-50">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
          </span>
          <div>
            <div className="text-[11px] font-semibold text-slate-900">Quick guide</div>
            <div className="text-[9px] text-slate-400">Three things to know</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close quick guide"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div key={step} className="ai-step-in mt-5">
          <div className="flex items-center justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-sky-50">
              <Icon className="h-5 w-5 text-violet-600" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2 py-1 text-[9px] font-medium text-violet-700">
              <Sparkles className="h-2.5 w-2.5" />
              Demo workspace
            </span>
          </div>

          <div className="mt-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {current.eyebrow}
          </div>
          <h2
            id="copilot-guide-title"
            className="mt-1.5 text-[22px] font-semibold leading-tight tracking-[-0.035em] text-slate-950"
          >
            {current.title}
          </h2>
          <p className="mt-2 text-[11.5px] leading-[1.7] text-slate-500">{current.body}</p>

          {step === 1 && (
            <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/70 p-3">
              <div className="text-[8.5px] font-semibold uppercase tracking-[0.14em] text-violet-500">
                Try something like
              </div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-slate-700">
                “Make the dashboard easier to scan.”
              </p>
            </div>
          )}

          {step === 2 && (
            <ul className="mt-3 space-y-1.5 text-[10.5px] leading-relaxed text-slate-500">
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-emerald-600" />
                Start from an example or type your own message.
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-emerald-600" />
                Stop a response whenever you want.
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3 w-3 text-emerald-600" />
                Everything stays in this browser.
              </li>
            </ul>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1" aria-label={`Step ${step + 1} of ${steps.length}`}>
            {steps.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  index === step ? "w-5 bg-violet-500" : "w-1.5 bg-slate-200"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step === 0 ? (
              <button
                type="button"
                onClick={onClose}
                className="h-8 px-1.5 text-[10.5px] text-slate-400 transition hover:text-slate-700"
              >
                Skip
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((value) => Math.max(0, value - 1))}
                className="inline-flex h-8 items-center gap-1 rounded-md px-1.5 text-[10.5px] text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <ArrowLeft className="h-3 w-3" />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (last) onClose();
                else setStep((value) => value + 1);
              }}
              className="btn-primary h-8 px-3 text-[10.5px]"
            >
              {last ? "Start chatting" : "Next"}
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
