import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { LegalLinks } from "../components/LegalLinks";
import { initialsFor, providerLabel, useAuth, type OAuthProvider } from "../lib/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.58v3h3.88c2.27-2.09 3.54-5.17 3.54-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.15-4.05 1.15-3.13 0-5.78-2.11-6.73-5.02H1.26v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.22A7.19 7.19 0 0 1 4.89 12c0-.78.14-1.53.37-2.22V6.69H1.26A11.99 11.99 0 0 0 0 12c0 1.94.47 3.77 1.26 5.31l4.01-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.69l4.01 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path
        fill="currentColor"
        d="M16.365 1.43c0 1.14-.46 2.2-1.2 3.01-.8.88-2.1 1.56-3.18 1.48-.14-1.1.43-2.25 1.15-3.03.8-.87 2.18-1.53 3.23-1.46zM20.95 17.1c-.58 1.34-.86 1.94-1.61 3.13-1.05 1.65-2.54 3.7-4.39 3.72-1.64.02-2.06-1.07-4.28-1.05-2.22.02-2.68 1.07-4.32 1.05-1.85-.02-3.26-1.87-4.31-3.52C-.6 16.68-1 11.47 1.27 8.62c1.2-1.52 3.1-2.41 4.88-2.41 1.81 0 2.95 1.08 4.45 1.08 1.45 0 2.33-1.08 4.43-1.08 1.59 0 3.27.87 4.47 2.37-3.93 2.15-3.29 7.62.45 8.52z"
      />
    </svg>
  );
}

export default function Login() {
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<OAuthProvider | null>(null);

  const destination =
    (location.state as { from?: string } | null)?.from && location.state
      ? (location.state as { from: string }).from
      : "/console";

  useEffect(() => {
    document.title = "Sign in — Harness Studio";
  }, []);

  async function handleSignIn(provider: OAuthProvider) {
    if (loading) return;
    setLoading(provider);
    try {
      await signIn(provider);
      navigate(destination, { replace: true });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fb] text-slate-800">
      <div className="grid-bg absolute inset-0" />
      <div className="glow-orb -left-20 top-10 h-80 w-80 bg-violet-300/30" />
      <div className="glow-orb right-0 top-1/3 h-96 w-96 bg-sky-200/35" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-14 px-5 py-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8">
        <div className="mx-auto w-full max-w-[430px]">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link to="/" aria-label="Harness Studio home">
              <Logo />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11.5px] text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to site
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.3)] backdrop-blur-xl sm:p-8">
            {user ? (
              <div className="py-1">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                  <Check className="h-3 w-3" />
                  Signed in
                </span>
                <h1 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-900">
                  You&apos;re already in.
                </h1>
                <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/30 to-violet-500/30 font-mono text-[12px] font-semibold text-slate-800">
                    {initialsFor(user.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-medium text-slate-800">{user.name}</div>
                    <div className="truncate text-[11px] text-slate-500">{user.email}</div>
                  </div>
                  <span className="ml-auto rounded-full border border-slate-200 px-2 py-0.5 text-[9px] text-slate-500">
                    {providerLabel(user.provider)} preview
                  </span>
                </div>
                <Link to={destination} className="btn-primary mt-5 h-11 w-full text-sm">
                  Open the AI preview
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="mt-2 flex h-10 w-full items-center justify-center rounded-lg text-[12px] text-slate-500 transition hover:text-slate-800"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-medium text-violet-700">
                  <Sparkles className="h-3 w-3" />
                  Preview sign-in
                </span>
                <h1 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-900 sm:text-[28px]">
                  Welcome to Harness Studio.
                </h1>
                <p className="mt-2 text-[12.5px] leading-relaxed text-slate-500">
                  Sign in to keep your conversations together. This preview keeps everything on this
                  device — no account setup required.
                </p>

                <div className="mt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => void handleSignIn("google")}
                    disabled={loading !== null}
                    className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-slate-200 bg-white text-[12.5px] font-semibold text-[#17181c] shadow-sm transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
                  >
                    {loading === "google" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )}
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSignIn("apple")}
                    disabled={loading !== null}
                    className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-slate-900 bg-slate-900 text-[12.5px] font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
                  >
                    {loading === "apple" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <AppleIcon />
                    )}
                    Continue with Apple
                  </button>
                </div>

                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="text-[9px] uppercase tracking-[0.14em] text-slate-400">
                    Local preview
                  </span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10.5px] leading-relaxed text-slate-500">
                  <span className="font-medium text-amber-700/90">This is a preview.</span>{" "}
                  It doesn&apos;t contact Google or Apple yet — it creates a local session so you can
                  try the AI without an account.
                </div>

                <p className="mt-5 text-center text-[10.5px] leading-relaxed text-slate-400">
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="text-slate-600 underline underline-offset-2 hover:text-slate-900">
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-slate-600 underline underline-offset-2 hover:text-slate-900">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </>
            )}
          </div>

          <p className="mt-5 text-center text-[9.5px] text-slate-400">
            Preview · your session stays on this device
          </p>
          <LegalLinks className="mt-3 justify-center" />
        </div>

        <div className="hidden lg:block">
          <div className="ml-auto max-w-lg rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm xl:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              A calmer way to build
            </span>
            <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] text-slate-900 xl:text-5xl">
              Pick up where <span className="gradient-text">you left off.</span>
            </h2>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-slate-600">
              Your conversations stay close, so you can come back to an idea and keep going — without
              remembering the right words or the right settings.
            </p>

            <div className="mt-8 grid gap-2.5">
              {[
                {
                  icon: MessageSquare,
                  title: "Your chats, together",
                  body: "Come back to the conversation where you left off.",
                },
                {
                  icon: Sparkles,
                  title: "Ask in plain English",
                  body: "Describe the change. Harness figures out the details.",
                },
                {
                  icon: ShieldCheck,
                  title: "Nothing to configure",
                  body: "No keys, no setup, no developer settings to learn.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3.5"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
                    <item.icon className="h-3.5 w-3.5 text-violet-700" />
                  </span>
                  <div>
                    <div className="text-[12px] font-medium text-slate-800">{item.title}</div>
                    <div className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white/80 p-4">
              <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-900">
                  <Sparkles className="h-3 w-3 text-white" />
                </span>
                <span className="text-[10px] font-medium text-slate-600">Harness Studio AI</span>
                <span className="ml-auto flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[7.5px] text-emerald-700">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  Preview
                </span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm border border-slate-200 bg-slate-100 px-3 py-2 text-[10.5px] leading-relaxed text-slate-600">
                  The settings page feels a little crowded.
                </div>
                <div className="max-w-[88%] rounded-xl rounded-tl-sm border border-slate-200 bg-[#fbfcfe] px-3 py-2 text-[10.5px] leading-relaxed text-slate-600">
                  I can give the sections more room and make the labels easier to scan. Want me to
                  try that in your app?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
