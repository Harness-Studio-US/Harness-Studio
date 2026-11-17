import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getMultiFactorResolver,
  signInWithEmailAndPassword,
  type MultiFactorError,
  type MultiFactorResolver,
} from "firebase/auth";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Logo, LogoMark } from "../Logo";
import { LegalLinks } from "../LegalLinks";
import { auth, isFirebaseConfigured, missingFirebaseVars } from "../../lib/firebase";
import { authErrorMessage } from "../../lib/authMessages";
import { sendVerificationEmail } from "../../lib/authActions";
import { MfaChallenge } from "./MfaChallenge";

type Mode = "signin" | "signup";

export function LoginShell({ children }: { children: ReactNode }) {
  return (
    <div className="ai-screen-in min-h-screen bg-paper text-ink">
      <header className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-5 lg:px-10">
        <Link to="/" aria-label="Harness Studio home">
          <Logo markClassName="h-8 w-8" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-[11.5px] font-medium text-muted transition hover:border-[#94A3B8] hover:text-ink"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to site
        </Link>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-12 px-5 pb-52 sm:pb-36 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-8 lg:pb-28">
        <section className="hidden max-w-[550px] lg:block">
          <span className="eyebrow">Harness Copilot account</span>
          <h1 className="mt-7 text-[64px] font-semibold leading-[0.98] tracking-[-0.06em] text-ink">
            A clearer way to{" "}
            <span className="display-serif text-accent">build.</span>
          </h1>
          <p className="mt-6 max-w-[470px] text-[16px] leading-[1.8] text-muted">
            Sign in to open your workspace, pick up a conversation, and keep the work moving.
          </p>

          <div className="mt-10 divide-y divide-line border-y border-line">
            {[
              ["01", "Describe it plainly", "No commands, syntax, or developer dictionary required."],
              ["02", "Review the change", "See what happened before you decide to keep it."],
              ["03", "Keep it private", "Conversations stay in this browser, scoped to your account."],
            ].map(([number, title, detail]) => (
              <div key={number} className="grid grid-cols-[34px_1fr] gap-4 py-4">
                <span className="font-mono text-[10.5px] text-[#475569]">{number}</span>
                <div>
                  <div className="text-[13.5px] font-semibold text-ink">{title}</div>
                  <p className="mt-1 text-[12.5px] leading-[1.65] text-muted">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11.5px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#047857]" />
              Firebase-secured sign-in
            </span>
            <span>Password reset by email</span>
          </div>
          <p className="mt-5 text-[11.5px] leading-relaxed text-muted">
            Early preview. Responses are simulated.
          </p>
        </section>

        <section className="ai-card-in mx-auto w-full max-w-[460px] rounded-[28px] border border-line bg-surface p-6 shadow-[0_24px_60px_-45px_rgba(23,21,15,0.45)] sm:p-8">
          {children}
        </section>
      </main>
    </div>
  );
}

export function CopilotLogin() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [resolver, setResolver] = useState<MultiFactorResolver | null>(null);

  useEffect(() => {
    setError("");
  }, [mode]);

  function switchMode(next: Mode) {
    setMode(next);
    setPassword("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth) {
      setError("Firebase sign-in is not configured for this build.");
      return;
    }

    const nextEmail = email.trim();
    if (!nextEmail) {
      setError("Enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    if (password.length < 6) {
      setError("Use a password with at least 6 characters.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const credential = await createUserWithEmailAndPassword(auth, nextEmail, password);
        try {
          await sendVerificationEmail(credential.user);
        } catch {
          // The verification screen can resend the link if this attempt fails.
        }
      } else {
        await signInWithEmailAndPassword(auth, nextEmail, password);
      }
    } catch (caught) {
      if (caught instanceof FirebaseError && caught.code === "auth/multi-factor-auth-required") {
        setResolver(getMultiFactorResolver(auth, caught as MultiFactorError));
        return;
      }
      setError(authErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  if (resolver) {
    return (
      <LoginShell>
        <MfaChallenge resolver={resolver} onCancel={() => setResolver(null)} />
      </LoginShell>
    );
  }

  if (!isFirebaseConfigured) {
    return (
      <LoginShell>
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <Logo markClassName="h-7 w-7" />
          <span className="rounded-full border border-[#e8c38f] bg-[#fff7e8] px-2 py-1 text-[10px] font-medium text-[#8a4b08]">
            Setup needed
          </span>
        </div>

        <div className="mt-5 lg:mt-0">
          <span className="eyebrow eyebrow--plain eyebrow--amber">
            <LockKeyhole className="h-3.5 w-3.5" />
            Firebase sign-in
          </span>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.045em] text-ink">
            Sign-in needs a Firebase project.
          </h2>
          <p className="mt-3 text-[13px] leading-[1.7] text-muted">
            This build has no Firebase web configuration yet. Add the values from your Firebase web
            app, then restart the dev server or rebuild the site.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-[#e8c38f] bg-[#fff7e8] p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a4b08]">
            Missing environment variables
          </div>
          <div className="mt-2 space-y-1 font-mono text-[10.5px] text-ink-soft">
            {missingFirebaseVars.map((name) => (
              <div key={name}>{name}</div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-[1.7] text-muted">
          Put them in <code className="rounded bg-paper px-1 py-0.5">.env.local</code> for local
          development, or in your deployment environment. Never commit the values to the repository.
        </p>

        <a
          href="https://console.firebase.google.com/"
          target="_blank"
          rel="noreferrer"
          className="btn-primary mt-6 h-12 w-full px-4 text-[13px]"
        >
          Open Firebase Console
          <ArrowRight className="h-4 w-4" />
        </a>

        <LegalLinks className="mt-6 justify-center" showContact={false} />
      </LoginShell>
    );
  }

  const creating = mode === "signup";

  return (
    <LoginShell>
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <Logo markClassName="h-7 w-7" />
        <span className="rounded-full border border-line bg-paper px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.1em] text-muted">
          Secure sign-in
        </span>
      </div>

      <div className="mt-6 lg:mt-0">
        <span className="eyebrow eyebrow--plain">Harness Copilot account</span>
        <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.045em] text-ink">
          {creating ? "Create your account." : "Welcome back."}
        </h2>
        <p className="mt-2.5 text-[13px] leading-[1.7] text-muted">
          {creating
            ? "One account for your Copilot workspace. Chats stay in this browser."
            : "Sign in to continue to your Copilot workspace."}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 border-b border-line">
        {(
          [
            ["signin", "Sign in"],
            ["signup", "Create account"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => switchMode(value)}
            className={`relative px-1 pb-3 pt-2 text-[12.5px] font-medium transition ${
              mode === value ? "text-ink" : "text-muted hover:text-ink"
            }`}
            aria-pressed={mode === value}
          >
            {label}
            {mode === value && (
              <span className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-accent" />
            )}
          </button>
        ))}
      </div>

      <form onSubmit={submit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="copilot-email" className="mb-2 block text-[12px] font-medium text-ink">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              id="copilot-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError("");
              }}
              placeholder="you@example.com"
              aria-invalid={!!error}
              className="field h-12 pl-10 text-[13px]"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <label htmlFor="copilot-password" className="block text-[12px] font-medium text-ink">
              Password
            </label>
            {!creating && (
              <Link
                to="/reset-password"
                className="text-[11px] font-medium text-accent-strong hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              id="copilot-password"
              type={showPassword ? "text" : "password"}
              autoComplete={creating ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError("");
              }}
              placeholder={creating ? "At least 6 characters" : "Your password"}
              aria-invalid={!!error}
              className="field h-12 pl-10 pr-11 text-[13px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted transition hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-[#e7b4af] bg-[#fdf1f0] px-3 py-2.5 text-[11.5px] leading-[1.6] text-[#9f1239]"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-1 h-12 w-full px-4 text-[13px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {creating ? "Creating account…" : "Signing in…"}
            </>
          ) : (
            <>
              {creating ? "Create account" : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-[11.5px] leading-relaxed text-muted">
        {creating ? "Already have an account?" : "New to Harness Copilot?"}{" "}
        <button
          type="button"
          onClick={() => switchMode(creating ? "signin" : "signup")}
          className="font-semibold text-accent-strong hover:underline"
        >
          {creating ? "Sign in" : "Create one"}
        </button>
      </p>

      <div className="mt-5 flex items-start gap-2.5 border-t border-line pt-4 text-[11px] leading-[1.65] text-muted">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#047857]" />
        <span>Secured by Firebase Authentication. Your password is never stored by this site.</span>
      </div>

      <LegalLinks className="mt-4 justify-center" showContact={false} />
    </LoginShell>
  );
}

export function CopilotAuthLoading() {
  return (
    <div className="ai-screen-in flex min-h-screen flex-col items-center justify-center gap-4 bg-paper text-ink">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-surface">
        <LogoMark className="h-7 w-7" />
      </span>
      <div className="flex items-center gap-2 text-[12px] text-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
        Opening your workspace…
      </div>
    </div>
  );
}
