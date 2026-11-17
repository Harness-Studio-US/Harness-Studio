import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  MailCheck,
} from "lucide-react";
import { LoginShell } from "../console/CopilotLogin";
import { LegalLinks } from "../LegalLinks";
import { auth } from "../../lib/firebase";
import { authErrorMessage } from "../../lib/authMessages";

type Phase = "checking" | "form" | "done" | "error";

function clearActionParams() {
  try {
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  } catch {
    /* history unavailable — the link still worked */
  }
}

/**
 * Handles the Firebase email action links this site sends: `resetPassword` (choose a new
 * password here) and `verifyEmail` (confirm the address, then continue to the console).
 */
export function AuthAction({
  mode,
  oobCode,
  onDone,
}: {
  mode: string;
  oobCode: string;
  onDone: () => void;
}) {
  const reset = mode === "resetPassword";
  const [phase, setPhase] = useState<Phase>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const continueToConsole = () => {
    clearActionParams();
    onDone();
  };

  useEffect(() => {
    const instance = auth;
    if (!instance) {
      setError("Firebase Authentication is not configured for this build.");
      setPhase("error");
      return;
    }

    let active = true;
    void (async () => {
      try {
        if (reset) {
          const address = await verifyPasswordResetCode(instance, oobCode);
          if (!active) return;
          setEmail(address);
          setPhase("form");
          return;
        }

        await applyActionCode(instance, oobCode);
        if (instance.currentUser) {
          try {
            await instance.currentUser.reload();
          } catch {
            /* the action code was still applied */
          }
        }
        if (active) setPhase("done");
      } catch (caught) {
        if (!active) return;
        setError(authErrorMessage(caught));
        setPhase("error");
      }
    })();

    return () => {
      active = false;
    };
  }, [oobCode, reset]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const instance = auth;
    if (!instance) return;

    if (password.length < 6) {
      setError("Use a password with at least 6 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("The two passwords do not match.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await confirmPasswordReset(instance, oobCode, password);
      clearActionParams();
      setPhase("done");
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === "checking") {
    return (
      <LoginShell>
        <div className="flex items-center gap-2.5 py-6 text-[12.5px] text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Checking your link…
        </div>
      </LoginShell>
    );
  }

  if (phase === "error") {
    return (
      <LoginShell>
        <div className="mt-2 lg:mt-0">
          <span className="eyebrow eyebrow--plain eyebrow--amber">
            <LockKeyhole className="h-3.5 w-3.5" />
            Email link
          </span>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.045em] text-ink">
            This link can’t be used.
          </h2>
          <p className="mt-3 text-[13px] leading-[1.7] text-muted">
            {error || "The link has expired or has already been used."} Request a new email from the
            sign-in screen.
          </p>
        </div>

        <Link
          to="/console"
          onClick={continueToConsole}
          className="btn-primary mt-6 h-12 w-full px-4 text-[13px]"
        >
          Back to sign in
          <ArrowRight className="h-4 w-4" />
        </Link>

        <LegalLinks className="mt-5 justify-center" showContact={false} />
      </LoginShell>
    );
  }

  if (phase === "form") {
    return (
      <LoginShell>
        <div className="mt-2 lg:mt-0">
          <span className="eyebrow eyebrow--plain">
            <LockKeyhole className="h-3.5 w-3.5" />
            Password reset
          </span>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.045em] text-ink">
            Choose a new password.
          </h2>
          <p className="mt-2.5 text-[13px] leading-[1.7] text-muted">
            Setting a new password for{" "}
            <span className="font-medium text-ink">{email || "your account"}</span>. Use at least 6
            characters.
          </p>
        </div>

        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="reset-password"
              className="mb-2 block text-[12px] font-medium text-ink"
            >
              New password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                id="reset-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) setError("");
                }}
                placeholder="At least 6 characters"
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

          <div>
            <label
              htmlFor="reset-password-confirm"
              className="mb-2 block text-[12px] font-medium text-ink"
            >
              Confirm new password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
              <input
                id="reset-password-confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => {
                  setConfirmation(event.target.value);
                  if (error) setError("");
                }}
                placeholder="Repeat your new password"
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
            disabled={submitting}
            className="btn-primary h-12 w-full px-4 text-[13px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating password…
              </>
            ) : (
              <>
                Update password
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-[11.5px] leading-relaxed text-muted">
          Remembered it?{" "}
          <Link
            to="/console"
            onClick={continueToConsole}
            className="font-semibold text-accent-strong hover:underline"
          >
            Back to sign in
          </Link>
        </p>

        <LegalLinks className="mt-4 justify-center" showContact={false} />
      </LoginShell>
    );
  }

  return (
    <LoginShell>
      <div className="mt-2 lg:mt-0">
        <span className="eyebrow eyebrow--plain">
          {reset ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <MailCheck className="h-3.5 w-3.5" />
          )}
          {reset ? "Password reset" : "Email verified"}
        </span>
        <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.045em] text-ink">
          {reset ? "Password updated." : "Email confirmed."}
        </h2>
        <p className="mt-3 text-[13px] leading-[1.7] text-muted">
          {reset
            ? "Your Harness Copilot password has been changed. Sign in with your new password to continue."
            : "Thanks for confirming your address. Open your Copilot workspace to continue."}
        </p>
      </div>

      <Link
        to="/console"
        onClick={continueToConsole}
        className="btn-primary mt-6 h-12 w-full px-4 text-[13px]"
      >
        {reset ? "Sign in" : "Open Copilot"}
        <ArrowRight className="h-4 w-4" />
      </Link>

      <LegalLinks className="mt-5 justify-center" showContact={false} />
    </LoginShell>
  );
}
