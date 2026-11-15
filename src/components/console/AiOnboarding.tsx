import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  MessageSquare,
  Monitor,
  ShieldCheck,
  Sparkles,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { Logo, LogoMark } from "../Logo";
import { LegalLinks } from "../LegalLinks";
import { cn } from "../../lib/cn";
import { nameFromEmail, type AiUser } from "../../lib/aiSession";

const flowSteps = ["Sign in", "Connect", "Chat"] as const;

function StepRail({ active }: { active: 0 | 1 }) {
  return (
    <div className="grid grid-cols-3 gap-1.5" aria-label="Setup progress">
      {flowSteps.map((label, index) => {
        const done = index < active;
        const current = index === active;
        return (
          <div key={label}>
            <div
              className={cn(
                "h-1 rounded-full transition-colors duration-500",
                done ? "bg-emerald-400" : current ? "bg-violet-500" : "bg-slate-200"
              )}
            />
            <div
              className={cn(
                "mt-1.5 text-[9px] font-medium",
                current ? "text-slate-700" : done ? "text-emerald-600" : "text-slate-400"
              )}
              aria-current={current ? "step" : undefined}
            >
              {index + 1}. {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ConnectionPreview() {
  return (
    <div className="mt-9 max-w-md rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.45)] backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <LogoMark className="h-6 w-6" />
        </span>
        <div className="ai-connect-track flex-1" />
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
          <Monitor className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[9.5px] font-medium text-slate-500">
        <span>Harness Studio</span>
        <span>This browser</span>
      </div>
    </div>
  );
}

export function AiLogin({ onLogin }: { onLogin: (user: AiUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      setError("Enter a valid email address to continue.");
      return;
    }
    if (password.length < 4) {
      setError("Use a password with at least 4 characters for this demo.");
      return;
    }

    setError("");
    onLogin({ email: nextEmail, name: nameFromEmail(nextEmail) });
  }

  return (
    <div className="ai-screen-in relative min-h-screen overflow-hidden bg-[#f8f8f6] text-slate-900">
      <div className="grid-bg absolute inset-0" />
      <div className="glow-orb -left-10 top-20 h-80 w-80 bg-violet-300/20" />
      <div className="glow-orb right-[8%] top-[30%] h-72 w-72 bg-sky-200/25" />

      <header className="relative z-10 mx-auto flex h-20 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link to="/" aria-label="Harness Studio home">
          <Logo markClassName="h-8 w-8" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/60 px-3 py-1.5 text-[11px] font-medium text-slate-600 backdrop-blur transition hover:bg-white hover:text-slate-900"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to site
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-12 px-5 pb-14 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-8">
        <section className="animate-rise hidden max-w-xl lg:block">
          <span className="inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span className="ai-live-dot h-1.5 w-1.5 rounded-full bg-violet-500 text-violet-500" />
            Harness Studio AI
          </span>
          <h1 className="mt-6 text-[54px] font-bold leading-[1.01] tracking-[-0.055em] text-slate-950">
            Sign in. Connect.
            <br />
            Keep building.
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-slate-600">
            Harness Studio links this browser to your workspace, then opens the conversation. One
            quick setup, and the rest is just talking.
          </p>
          <p className="mt-5 max-w-md text-[12px] leading-relaxed text-slate-500">
            This demo keeps your session on this device. No account is created and no credentials
            are sent anywhere.
          </p>
          <ConnectionPreview />
        </section>

        <section className="ai-card-in mx-auto w-full max-w-[430px] rounded-[28px] border border-slate-200/90 bg-white/95 p-6 shadow-[0_36px_100px_-55px_rgba(15,23,42,0.5)] backdrop-blur sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
            <Logo markClassName="h-7 w-7" />
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] text-slate-500">
              Browser demo
            </span>
          </div>

          <StepRail active={0} />

          <div className="mt-6">
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-violet-600">
              Step 1 of 3
            </span>
            <h2 className="mt-2 text-[27px] font-semibold leading-tight tracking-[-0.04em] text-slate-950">
              Sign in to Harness Studio
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
              Use any email and a password to try the workspace.
            </p>
          </div>

          <form onSubmit={submit} noValidate className="mt-6 space-y-3.5">
            <div>
              <label htmlFor="ai-email" className="mb-1.5 block text-[10.5px] font-medium text-slate-600">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  id="ai-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="you@example.com"
                  aria-invalid={!!error}
                  aria-describedby={error ? "ai-login-error" : undefined}
                  className="field h-11 pl-9 text-[12.5px]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ai-password" className="mb-1.5 block text-[10.5px] font-medium text-slate-600">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  id="ai-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="At least 4 characters"
                  aria-invalid={!!error}
                  aria-describedby={error ? "ai-login-error" : undefined}
                  className="field h-11 pl-9 pr-10 text-[12.5px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {error && (
              <p id="ai-login-error" className="ai-step-in rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-rose-700">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary mt-1 h-11 w-full px-4 text-[12.5px]">
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-[9.5px] leading-relaxed text-slate-500">
            <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
            <span>Demo sign-in. Your details and connection stay in this browser.</span>
          </div>

          <LegalLinks className="mt-5 justify-center" showContact={false} />
        </section>
      </main>
    </div>
  );
}

const connectionStates = [
  "Checking this browser",
  "Opening a secure link",
  "Browser connected",
] as const;

export function BrowserConnect({
  user,
  onDone,
  onChangeAccount,
}: {
  user: AiUser;
  onDone: (connected: boolean) => void;
  onChangeAccount: () => void;
}) {
  const [connecting, setConnecting] = useState(false);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    if (!connecting) return;
    const timers = [
      window.setTimeout(() => setStatus(1), 500),
      window.setTimeout(() => setStatus(2), 1000),
      window.setTimeout(() => onDone(true), 1500),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [connecting]);

  return (
    <div className="ai-screen-in relative min-h-screen overflow-hidden bg-[#f8f8f6] text-slate-900">
      <div className="grid-bg absolute inset-0" />
      <div className="glow-orb left-1/2 top-16 h-96 w-96 -translate-x-1/2 bg-violet-300/20" />
      <div className="glow-orb bottom-0 right-[8%] h-72 w-72 bg-sky-200/25" />

      <header className="relative z-10 mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-5 lg:px-8">
        <Link to="/" aria-label="Harness Studio home">
          <Logo markClassName="h-8 w-8" />
        </Link>
        <button
          type="button"
          onClick={onChangeAccount}
          disabled={connecting}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/60 px-3 py-1.5 text-[10.5px] font-medium text-slate-600 backdrop-blur transition hover:bg-white hover:text-slate-900 disabled:opacity-40"
        >
          <ArrowLeft className="h-3 w-3" />
          Use a different account
        </button>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col items-center justify-center px-5 pb-12">
        <div className="ai-card-in w-full overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_36px_100px_-55px_rgba(15,23,42,0.45)]">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-[#fbfbfd] px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]/70" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]/70" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]/70" />
            <div className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-[9.5px] text-slate-500">
              <LockKeyhole className="h-2.5 w-2.5 text-emerald-600" />
              <span className="truncate">harness.studio</span>
            </div>
            <span className="w-9" />
          </div>

          <div className="p-6 text-center sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-violet-700">
              <span className="ai-live-dot h-1 w-1 rounded-full bg-violet-500 text-violet-500" />
              Browser connection request
            </span>

            <div className="mt-7 flex items-center justify-center gap-4 sm:gap-6">
              <div className="relative">
                <span className="ai-connect-ring absolute inset-0 rounded-2xl border border-violet-300" />
                <span
                  className="ai-connect-ring absolute inset-0 rounded-2xl border border-violet-200"
                  style={{ animationDelay: "700ms" }}
                />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <LogoMark className="h-8 w-8" />
                </span>
              </div>
              <div className="ai-connect-track w-16 sm:w-28" />
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 shadow-sm">
                <Monitor className="h-5 w-5" />
              </span>
            </div>

            <h1
              className="mt-7 text-[26px] font-semibold leading-tight tracking-[-0.045em] text-slate-950 sm:text-[30px]"
              aria-live="polite"
            >
              {connecting ? "Connecting this browser…" : "Connect this browser to Harness Studio?"}
            </h1>
            <p className="mx-auto mt-2.5 max-w-md text-[12.5px] leading-[1.75] text-slate-500">
              {connecting
                ? "Hold on for a moment while we finish the browser link."
                : "Harness Studio would like to remember this browser so your chat can continue here next time."}
            </p>

            <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-left">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-2 text-[10px]">
                <span className="text-slate-400">Account</span>
                <span className="truncate font-medium text-slate-700">{user.email}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 py-2 text-[10px]">
                <span className="text-slate-400">Access</span>
                <span className="font-medium text-slate-700">Chat workspace</span>
              </div>
              <div className="flex items-center justify-between gap-3 pt-2 text-[10px]">
                <span className="text-slate-400">Stored</span>
                <span className="font-medium text-slate-700">This browser only</span>
              </div>
            </div>

            {connecting ? (
              <div className="mx-auto mt-6 max-w-sm text-left" aria-live="polite">
                <div className="space-y-2">
                  {connectionStates.map((label, index) => {
                    const done = index < status || (status === connectionStates.length - 1 && index === status);
                    const active = index === status && !done;
                    return (
                      <div
                        key={label}
                        className={cn(
                          "flex items-center gap-2 text-[11px] transition-colors",
                          done ? "text-emerald-700" : active ? "text-slate-700" : "text-slate-400"
                        )}
                      >
                        {done ? (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        ) : active ? (
                          <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                        ) : (
                          <span className="h-4 w-4 rounded-full border border-slate-200" />
                        )}
                        {label}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-600 transition-all duration-500"
                    style={{ width: `${((status + 1) / connectionStates.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setStatus(0);
                    setConnecting(true);
                  }}
                  className="btn-primary h-11 w-full px-4 text-[12.5px]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Connect this browser
                </button>
                <button
                  type="button"
                  onClick={() => onDone(false)}
                  className="h-10 w-full rounded-[0.7rem] border border-transparent text-[11px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  Not now — continue to the chat
                </button>
              </div>
            )}

            <p className="mt-4 text-[9.5px] leading-relaxed text-slate-400">
              You can use the chat either way. The connection only helps this browser remember you.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export function FirstRunGuide({
  open,
  onClose,
  user,
  connected,
}: {
  open: boolean;
  onClose: () => void;
  user: AiUser;
  connected: boolean;
}) {
  const [step, setStep] = useState(0);
  const firstName = user.name.split(" ")[0] || "there";

  const steps = [
    {
      icon: Sparkles,
      eyebrow: "Quick guide · 1 of 3",
      title: connected ? `You're connected, ${firstName}.` : `You're in, ${firstName}.`,
      body: connected
        ? "This browser is linked to Harness Studio, so your chat can pick up where you left off next time."
        : "This browser isn't connected, but you can still use the chat. Connect any time from the sidebar.",
    },
    {
      icon: MessageSquare,
      eyebrow: "Quick guide · 2 of 3",
      title: "Ask like you'd ask a teammate.",
      body: "Describe a change, a problem, or something you want to understand. There's no special syntax to learn.",
    },
    {
      icon: CheckCircle2,
      eyebrow: "Quick guide · 3 of 3",
      title: "Review what comes back.",
      body: "Harness shows the steps and a suggested change. You decide what to keep, change, or undo.",
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
        aria-labelledby="ai-guide-title"
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
            {step === 0 && (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-medium",
                  connected
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                )}
              >
                {connected ? <Wifi className="h-2.5 w-2.5" /> : <WifiOff className="h-2.5 w-2.5" />}
                {connected ? "Browser connected" : "Chat only"}
              </span>
            )}
          </div>

          <div className="mt-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {current.eyebrow}
          </div>
          <h2
            id="ai-guide-title"
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
