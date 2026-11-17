import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { LoginShell } from "../components/console/CopilotLogin";
import { LegalLinks } from "../components/LegalLinks";
import { sendPasswordReset } from "../lib/authActions";
import { authErrorMessage } from "../lib/authMessages";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError("Enter the email address on your account.");
      return;
    }

    setError("");
    setSending(true);
    try {
      await sendPasswordReset(address);
      setSentTo(address);
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSending(false);
    }
  }

  if (sentTo) {
    return (
      <LoginShell>
        <div className="mt-2 lg:mt-0">
          <span className="eyebrow eyebrow--plain">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Password reset
          </span>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.045em] text-ink">
            Check your email.
          </h2>
          <p className="mt-3 text-[13px] leading-[1.7] text-muted">
            We sent a password reset link to{" "}
            <span className="font-medium text-ink">{sentTo}</span>. Open it in this browser to
            choose a new password. The link expires after one use.
          </p>
        </div>

        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={() => {
              setSentTo("");
              setSending(false);
            }}
            className="btn-ghost h-11 w-full px-4 text-[12.5px]"
          >
            Use a different email
          </button>
          <Link to="/console" className="btn-primary h-12 w-full px-4 text-[13px]">
            Back to sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
          Nothing arrived? Check the spam folder, then request another link.
        </p>

        <LegalLinks className="mt-5 justify-center" showContact={false} />
      </LoginShell>
    );
  }

  return (
    <LoginShell>
      <div className="mt-2 lg:mt-0">
        <span className="eyebrow eyebrow--plain">
          <Mail className="h-3.5 w-3.5" />
          Password reset
        </span>
        <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.045em] text-ink">
          Reset your password.
        </h2>
        <p className="mt-2.5 text-[13px] leading-[1.7] text-muted">
          Enter the email address on your Harness Copilot account and we will send a link to choose a
          new password.
        </p>
      </div>

      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        <div>
          <label htmlFor="reset-email" className="mb-2 block text-[12px] font-medium text-ink">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              id="reset-email"
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
          disabled={sending}
          className="btn-primary h-12 w-full px-4 text-[13px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send reset link
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-[11.5px] leading-relaxed text-muted">
        Remembered it?{" "}
        <Link to="/console" className="font-semibold text-accent-strong hover:underline">
          Back to sign in
        </Link>
      </p>

      <LegalLinks className="mt-5 justify-center" showContact={false} />
    </LoginShell>
  );
}
