import { useState } from "react";
import type { User } from "firebase/auth";
import { ArrowRight, Loader2, MailCheck, RefreshCw } from "lucide-react";
import { LoginShell } from "./CopilotLogin";
import { LegalLinks } from "../LegalLinks";
import { auth } from "../../lib/firebase";
import { sendVerificationEmail } from "../../lib/authActions";
import { authErrorMessage } from "../../lib/authMessages";

export function VerifyEmail({
  user,
  onVerified,
  onSignOut,
}: {
  user: User;
  onVerified: () => void;
  onSignOut: () => void;
}) {
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function resend() {
    setError("");
    setNotice("");
    setSending(true);
    try {
      await sendVerificationEmail(user);
      setNotice("Verification email sent. Check your inbox and spam folder.");
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSending(false);
    }
  }

  async function checkVerified() {
    setError("");
    setNotice("");
    const current = auth?.currentUser;
    if (!current) {
      setError("Your session ended. Sign in again to continue.");
      return;
    }

    setChecking(true);
    try {
      await current.reload();
      if (current.emailVerified) {
        onVerified();
      } else {
        setError("This address is not verified yet. Open the link in your inbox, then check again.");
      }
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setChecking(false);
    }
  }

  return (
    <LoginShell>
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <span className="rounded-full border border-line bg-paper px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.1em] text-muted">
          One more step
        </span>
      </div>

      <div className="mt-6 lg:mt-0">
        <span className="eyebrow eyebrow--plain">
          <MailCheck className="h-3.5 w-3.5" />
          Verify your email
        </span>
        <h2 className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-[-0.045em] text-ink">
          Check your inbox.
        </h2>
        <p className="mt-2.5 text-[13px] leading-[1.7] text-muted">
          We sent a verification link to your email address. Open it to confirm the address and
          finish setting up your Harness Copilot workspace.
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-[10px] font-semibold text-ink">
          {(user.email ?? "?").charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 truncate text-[11.5px] text-ink-soft">{user.email}</span>
        <span className="shrink-0 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[#8a4b08]">
          Unverified
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-[#e7b4af] bg-[#fdf1f0] px-3 py-2.5 text-[11.5px] leading-[1.6] text-[#9f1239]"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mt-4 rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-2.5 text-[11.5px] leading-[1.6] text-[#065f46]"
        >
          {notice}
        </p>
      )}

      <div className="mt-5 space-y-2.5">
        <button
          type="button"
          onClick={() => void checkVerified()}
          disabled={checking || sending}
          className="btn-primary h-12 w-full px-4 text-[13px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking…
            </>
          ) : (
            <>
              I&apos;ve verified my email
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => void resend()}
          disabled={sending || checking}
          className="btn-ghost h-11 w-full px-4 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5" />
              Resend verification email
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
        Sent the wrong address?{" "}
        <button
          type="button"
          onClick={onSignOut}
          className="font-semibold text-accent-strong hover:underline"
        >
          Sign out
        </button>{" "}
        and create an account with the right one.
      </p>

      <div className="mt-5 flex items-start gap-2.5 border-t border-line pt-4 text-[11px] leading-[1.65] text-muted">
        <MailCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#047857]" />
        <span>Your password is never stored by this site.</span>
      </div>

      <LegalLinks className="mt-4 justify-center" showContact={false} />
    </LoginShell>
  );
}
