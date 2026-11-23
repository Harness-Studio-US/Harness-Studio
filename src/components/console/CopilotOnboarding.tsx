import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  LockKeyhole,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Logo, LogoMark } from "../Logo";
import { cn } from "../../lib/cn";
import { legalEffectiveLabel } from "../../data/legal";

export function LegalConsent({
  onAccept,
  email,
  onSignOut,
}: {
  onAccept: () => void;
  email?: string | null;
  onSignOut?: () => void;
}) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="ai-screen-in min-h-screen bg-paper text-ink">
      <header className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-5 lg:px-10">
        <Link to="/" aria-label="Harness Console home">
          <Logo markClassName="h-8 w-8" product="Console" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-[11.5px] font-medium text-muted transition hover:border-[#a9a193] hover:text-ink"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to site
        </Link>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 pb-14 pt-4 lg:grid-cols-[minmax(0,1fr)_470px] lg:px-8 lg:pt-10">
        <section className="hidden max-w-[550px] lg:block">
          <span className="eyebrow">Harness Copilot / Before you begin</span>
          <h1 className="mt-7 text-[62px] font-semibold leading-[0.98] tracking-[-0.06em] text-ink">
            One last step before you{" "}
            <span className="display-serif text-accent">build.</span>
          </h1>
          <p className="mt-6 max-w-[480px] text-[16px] leading-[1.8] text-muted">
            Your account is ready. Review the terms, then open the Copilot workspace and start with
            a sentence.
          </p>

          <div className="mt-10 space-y-4 border-t border-line pt-7">
            {[
              "Your conversations stay in this browser.",
              "Copilot explains each change before you keep it.",
              "You can ask for a change, or undo it, at any time.",
            ].map((item) => (
              <div key={item} className="flex gap-3 text-[13.5px] leading-[1.65] text-ink-soft">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#a7d7c5] bg-[#effaf4]">
                  <Check className="h-2.5 w-2.5 text-[#047857]" />
                </span>
                {item}
              </div>
            ))}
          </div>

          <p className="mt-8 text-[11.5px] leading-relaxed text-muted">
            No payment details required.
          </p>
        </section>

        <section className="ai-card-in mx-auto w-full max-w-[470px] rounded-[28px] border border-line bg-surface p-6 shadow-[0_24px_60px_-45px_rgba(23,21,15,0.45)] sm:p-8">
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <Logo markClassName="h-7 w-7" product="Console" />
          </div>

          <div className="mt-6 lg:mt-0">
            <span className="eyebrow eyebrow--plain">
              <FileText className="h-3.5 w-3.5" />
              Before you start
            </span>
            <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.045em] text-ink">
              Open your workspace.
            </h2>
            <p className="mt-2.5 text-[13px] leading-[1.7] text-muted">
              You are signed in. Review and accept the terms to continue.
            </p>
          </div>

          {email && (
            <div className="mt-5 flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-[10px] font-semibold text-ink">
                {email.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate text-[11.5px] text-ink-soft">{email}</span>
              <LockKeyhole className="h-3 w-3 shrink-0 text-muted" />
            </div>
          )}

          <div className="mt-5 rounded-lg border border-line bg-paper p-3.5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" />
              <div className="text-[11.5px] leading-[1.7] text-muted">
                <span className="font-semibold text-ink">Private by default.</span> Everything you
                type stays in this browser, and nothing is sent to a Harness Studio server.
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2.5">
            <input
              id="copilot-legal-agree"
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#5b35e8]"
            />
            <label
              htmlFor="copilot-legal-agree"
              className="cursor-pointer text-[12.5px] leading-[1.65] text-ink-soft"
            >
              I am 16 or older and agree to the Terms &amp; Conditions and Privacy Policy.
            </label>
          </div>

          <p className="mt-2 pl-[26px] text-[11px] leading-[1.65] text-muted">
            Read the{" "}
            <Link
              to="/terms"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent-strong underline decoration-[#c4b5fd] underline-offset-2 hover:text-ink"
            >
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent-strong underline decoration-[#c4b5fd] underline-offset-2 hover:text-ink"
            >
              Privacy Policy
            </Link>
            . They open in a new tab.
          </p>

          <button
            type="button"
            onClick={onAccept}
            disabled={!agreed}
            className="btn-primary mt-5 h-12 w-full px-4 text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Agree &amp; open Copilot
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-3 text-center text-[10.5px] leading-[1.6] text-muted">
            Effective {legalEffectiveLabel}. You can read both documents again from the workspace
            sidebar.
          </p>

          {email && onSignOut && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10.5px] text-muted">
              <span className="max-w-[240px] truncate">Signed in as {email}</span>
              <span aria-hidden>·</span>
              <button
                type="button"
                onClick={onSignOut}
                className="font-medium text-ink underline decoration-[#b8b1a3] underline-offset-2 hover:decoration-ink"
              >
                Sign out
              </button>
            </div>
          )}
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
      body: "Your AI workspace for shaping, fixing and understanding the project. Start with a sentence — no commands or setup required.",
    },
    {
      icon: MessageSquare,
      eyebrow: "Quick guide · 2 of 3",
      title: "Ask like you would ask a teammate.",
      body: "Describe the outcome you want, the problem you are seeing, or the part you would like explained. Copilot works through it with you.",
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
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0f172a]/40 p-4 backdrop-blur-[2px] sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="copilot-guide-title"
        onClick={(event) => event.stopPropagation()}
        className="ai-guide-in w-full max-w-[450px] rounded-[22px] border border-line bg-surface p-5 text-left shadow-[0_30px_90px_-30px_rgba(23,21,15,0.55)] sm:p-6"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-paper">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </span>
          <div>
            <div className="text-[12.5px] font-semibold text-ink">Quick guide</div>
            <div className="text-[10.5px] text-muted">Three things to know</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 text-muted transition hover:bg-paper hover:text-ink"
            aria-label="Close quick guide"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div key={step} className="ai-step-in mt-6">
          <div className="flex items-center justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-paper">
              <Icon className="h-5 w-5 text-accent" />
            </span>
          </div>

          <div className="mt-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">
            {current.eyebrow}
          </div>
          <h2
            id="copilot-guide-title"
            className="mt-2 text-[24px] font-semibold leading-[1.15] tracking-[-0.035em] text-ink"
          >
            {current.title}
          </h2>
          <p className="mt-2.5 text-[13px] leading-[1.7] text-muted">{current.body}</p>

          {step === 1 && (
            <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 p-3.5">
              <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
                Try something like
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink">
                “Make the dashboard easier to scan.”
              </p>
            </div>
          )}

          {step === 2 && (
            <ul className="mt-4 space-y-2 text-[12px] leading-relaxed text-muted">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#047857]" />
                Start from an example or type your own message.
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#047857]" />
                Stop a response whenever you want.
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-[#047857]" />
                Everything stays in this browser.
              </li>
            </ul>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
          <div className="flex items-center gap-1" aria-label={`Step ${step + 1} of ${steps.length}`}>
            {steps.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  index === step ? "w-5 bg-accent" : "w-1.5 bg-slate-200"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step === 0 ? (
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-2 text-[11.5px] text-muted transition hover:text-ink"
              >
                Skip
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((value) => Math.max(0, value - 1))}
                className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-[11.5px] text-muted transition hover:bg-paper hover:text-ink"
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
              className="btn-primary h-9 px-3.5 text-[11.5px]"
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
