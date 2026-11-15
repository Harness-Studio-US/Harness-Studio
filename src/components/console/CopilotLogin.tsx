import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Logo, LogoMark } from "../Logo";
import { LegalLinks } from "../LegalLinks";
import { auth, isFirebaseConfigured, missingFirebaseVars } from "../../lib/firebase";

type Mode = "signin" | "signup";

function authErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/missing-password":
        return "Enter your password.";
      case "auth/weak-password":
        return "Use a password with at least 6 characters.";
      case "auth/email-already-in-use":
        return "An account with this email already exists. Sign in instead.";
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email or password is incorrect.";
      case "auth/too-many-requests":
        return "Too many attempts. Wait a moment, then try again.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      case "auth/operation-not-allowed":
      case "auth/configuration-not-found":
        return "Email/password sign-in is not enabled in Firebase Authentication.";
      case "auth/unauthorized-domain":
        return "This domain is not authorized in Firebase Authentication.";
      case "auth/invalid-api-key":
      case "auth/api-key-not-valid":
        return "The Firebase API key is invalid. Check the Firebase web app configuration.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      default:
        return "Could not sign in. Try again.";
    }
  }
  return "Could not sign in. Try again.";
}

function LoginShell({ children }: { children: ReactNode }) {
  return (
    <div className="ai-screen-in relative min-h-screen overflow-x-hidden bg-[#f8f8f6] text-slate-900">
      <div className="grid-bg absolute inset-0" />
      <div className="glow-orb -left-12 top-16 h-80 w-80 bg-violet-300/20" />
      <div className="glow-orb bottom-0 right-[5%] h-72 w-72 bg-sky-200/25" />

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

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-12 px-5 pb-14 lg:grid-cols-[minmax(0,1fr)_450px] lg:px-8">
        <section className="animate-rise hidden max-w-xl lg:block">
          <span className="inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span className="ai-live-dot h-1.5 w-1.5 rounded-full bg-violet-500 text-violet-500" />
            Harness Copilot
          </span>
          <h1 className="mt-6 text-[54px] font-bold leading-[1.01] tracking-[-0.055em] text-slate-950">
            Sign in.
            <br />
            Pick up the thread.
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-slate-600">
            Your workspace and next idea in one place. Sign in with your Harness Copilot account
            and keep building.
          </p>

          <div className="mt-8 max-w-md rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white">
                <LogoMark className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[11px] font-semibold text-slate-900">Harness Copilot</div>
                <div className="text-[9px] text-slate-400">Workspace</div>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                Secure
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
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3 py-2.5 text-[10.5px] leading-relaxed text-slate-600">
                  I’d start with the key numbers, then make the secondary detail quieter. Want me to
                  show you a cleaner layout?
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[10.5px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Firebase-secured sign-in
            </span>
            <span className="inline-flex items-center gap-1.5">
              <KeyRound className="h-3 w-3 text-violet-600" />
              Password reset by email
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3 w-3 text-violet-600" />
              Stay signed in
            </span>
          </div>
        </section>

        <section className="ai-card-in mx-auto w-full max-w-[450px] rounded-[28px] border border-slate-200/90 bg-white/95 p-6 shadow-[0_36px_100px_-55px_rgba(15,23,42,0.5)] backdrop-blur sm:p-7">
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
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setError("");
    setNotice("");
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
    setNotice("");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, nextEmail, password);
      } else {
        await signInWithEmailAndPassword(auth, nextEmail, password);
      }
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  async function resetPassword() {
    if (!auth) return;
    const nextEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      setError("Enter your email address first, then request a reset link.");
      return;
    }

    setError("");
    setNotice("");
    setSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, nextEmail);
      setNotice("Password reset email sent. Check your inbox.");
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <LoginShell>
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <Logo markClassName="h-7 w-7" />
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[9px] font-medium text-amber-700">
            Setup needed
          </span>
        </div>

        <div className="mt-5 lg:mt-0">
          <span className="inline-flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-amber-600">
            <LockKeyhole className="h-3 w-3" />
            Firebase sign-in
          </span>
          <h2 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.04em] text-slate-950">
            Sign-in needs a Firebase project.
          </h2>
          <p className="mt-2.5 text-[12px] leading-[1.75] text-slate-500">
            This build has no Firebase web configuration yet. Add the values from your Firebase web
            app, then restart the dev server or rebuild the site.
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
          <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-700">
            Missing environment variables
          </div>
          <div className="mt-2 space-y-1 font-mono text-[9.5px] text-slate-600">
            {missingFirebaseVars.map((name) => (
              <div key={name}>{name}</div>
            ))}
          </div>
        </div>

        <p className="mt-3 text-[9.5px] leading-relaxed text-slate-400">
          Put them in <code className="rounded bg-slate-100 px-1 py-0.5">.env.local</code> for local
          development, or in your deployment environment. Never commit the values to the repository.
        </p>

        <a
          href="https://console.firebase.google.com/"
          target="_blank"
          rel="noreferrer"
          className="btn-primary mt-5 h-11 w-full px-4 text-[12.5px]"
        >
          Open Firebase Console
          <ArrowRight className="h-4 w-4" />
        </a>

        <LegalLinks className="mt-5 justify-center" showContact={false} />
      </LoginShell>
    );
  }

  const creating = mode === "signup";

  return (
    <LoginShell>
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <Logo markClassName="h-7 w-7" />
        <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-1 text-[8.5px] font-semibold uppercase tracking-[0.12em] text-violet-700">
          Secure sign-in
        </span>
      </div>

      <div className="mt-5 lg:mt-0">
        <span className="inline-flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-violet-600">
          <Sparkles className="h-3 w-3" />
          Harness Copilot account
        </span>
        <h2 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.04em] text-slate-950">
          {creating ? "Create your account." : "Welcome back."}
        </h2>
        <p className="mt-2 text-[12px] leading-relaxed text-slate-500">
          {creating
            ? "One account for your Copilot workspace. Chats stay in this browser."
            : "Sign in to continue to your Copilot workspace."}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
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
            className={`rounded-lg px-3 py-2 text-[10.5px] font-medium transition ${
              mode === value
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
            aria-pressed={mode === value}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} noValidate className="mt-5 space-y-3.5">
        <div>
          <label htmlFor="copilot-email" className="mb-1.5 block text-[10.5px] font-medium text-slate-600">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
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
              className="field h-11 pl-9 text-[12.5px]"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label htmlFor="copilot-password" className="block text-[10.5px] font-medium text-slate-600">
              Password
            </label>
            {!creating && (
              <button
                type="button"
                onClick={() => void resetPassword()}
                disabled={submitting}
                className="text-[9.5px] font-medium text-violet-700 hover:text-violet-800 disabled:opacity-50"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
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
          <p
            role="alert"
            className="ai-step-in rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-rose-700"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="ai-step-in rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-emerald-700"
          >
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-1 h-11 w-full px-4 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-60"
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

      <p className="mt-4 text-center text-[10px] leading-relaxed text-slate-400">
        {creating ? "Already have an account?" : "New to Harness Copilot?"}{" "}
        <button
          type="button"
          onClick={() => switchMode(creating ? "signin" : "signup")}
          className="font-medium text-violet-700 hover:text-violet-800"
        >
          {creating ? "Sign in" : "Create one"}
        </button>
      </p>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-[9.5px] leading-relaxed text-slate-500">
        <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
        <span>Secured by Firebase Authentication. Your password is never stored by this site.</span>
      </div>

      <LegalLinks className="mt-5 justify-center" showContact={false} />
    </LoginShell>
  );
}

export function CopilotAuthLoading() {
  return (
    <div className="ai-screen-in flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8f8f6] text-slate-900">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
        <LogoMark className="h-7 w-7" />
      </span>
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-600" />
        Opening your workspace…
      </div>
    </div>
  );
}
