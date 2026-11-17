import { useState, type FormEvent } from "react";
import {
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  TotpMultiFactorGenerator,
  type MultiFactorInfo,
  type MultiFactorResolver,
} from "firebase/auth";
import { ArrowLeft, Loader2, Send, ShieldCheck } from "lucide-react";
import { auth } from "../../lib/firebase";
import { authErrorMessage } from "../../lib/authMessages";

const RECAPTCHA_ID = "harness-mfa-recaptcha";

function factorLabel(factor: MultiFactorInfo): string {
  if (factor.factorId === "phone") {
    return factor.displayName || "Phone number";
  }
  return factor.displayName || "Authenticator app";
}

export function MfaChallenge({
  resolver,
  onCancel,
}: {
  resolver: MultiFactorResolver;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState<MultiFactorInfo | null>(resolver.hints[0] ?? null);
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isPhone = selected?.factorId === "phone";

  async function sendCode() {
    const instance = auth;
    if (!instance || !selected) return;
    setError("");
    setNotice("");
    setSending(true);
    try {
      const verifier = new RecaptchaVerifier(instance, RECAPTCHA_ID, { size: "invisible" });
      const provider = new PhoneAuthProvider(instance);
      const id = await provider.verifyPhoneNumber(
        { multiFactorHint: selected, session: resolver.session },
        verifier
      );
      setVerificationId(id);
      setNotice(`We sent a 6-digit code to ${factorLabel(selected)}.`);
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSending(false);
    }
  }

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    if (!code.trim()) {
      setError("Enter the 6-digit code.");
      return;
    }
    if (isPhone && !verificationId) {
      setError("Send a code to your phone first.");
      return;
    }

    setError("");
    setNotice("");
    setSubmitting(true);
    try {
      if (isPhone) {
        const credential = PhoneAuthProvider.credential(verificationId, code.trim());
        await resolver.resolveSignIn(PhoneMultiFactorGenerator.assertion(credential));
      } else {
        await resolver.resolveSignIn(
          TotpMultiFactorGenerator.assertionForSignIn(selected.uid, code.trim())
        );
      }
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-2 lg:mt-0">
      <span className="eyebrow eyebrow--plain">
        <ShieldCheck className="h-3.5 w-3.5" />
        Two-step verification
      </span>
      <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.045em] text-ink">
        One more step.
      </h2>
      <p className="mt-2.5 text-[13px] leading-[1.7] text-muted">
        Enter the code from your second factor to finish signing in.
      </p>

      {resolver.hints.length > 1 && (
        <div className="mt-4 space-y-1.5">
          {resolver.hints.map((hint) => (
            <label
              key={hint.uid}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2.5 text-[12px] text-ink-soft"
            >
              <input
                type="radio"
                name="mfa-factor"
                checked={selected?.uid === hint.uid}
                onChange={() => {
                  setSelected(hint);
                  setCode("");
                  setVerificationId("");
                  setError("");
                  setNotice("");
                }}
                className="h-3.5 w-3.5 accent-[#5b35e8]"
              />
              {factorLabel(hint)}
            </label>
          ))}
        </div>
      )}

      {resolver.hints.length === 1 && selected && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2.5 text-[12px] text-ink-soft">
          <ShieldCheck className="h-3.5 w-3.5 text-[#047857]" />
          {factorLabel(selected)}
        </div>
      )}

      <form onSubmit={verify} noValidate className="mt-5 space-y-3">
        <div>
          <label htmlFor="mfa-code" className="mb-2 block text-[12px] font-medium text-ink">
            Verification code
          </label>
          <input
            id="mfa-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              if (error) setError("");
            }}
            placeholder="123456"
            aria-invalid={!!error}
            className="field h-12 font-mono text-[15px] tracking-[0.35em]"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-[#e7b4af] bg-[#fdf1f0] px-3 py-2.5 text-[11.5px] leading-[1.6] text-[#9f1239]"
          >
            {error}
          </p>
        )}
        {notice && (
          <p
            role="status"
            className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-2.5 text-[11.5px] leading-[1.6] text-[#065f46]"
          >
            {notice}
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
              Checking…
            </>
          ) : (
            <>Verify and sign in</>
          )}
        </button>

        {isPhone && (
          <button
            type="button"
            onClick={() => void sendCode()}
            disabled={sending || submitting}
            className="btn-ghost h-11 w-full px-4 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                {verificationId ? "Send a new code" : "Text me a code"}
              </>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onCancel}
          className="flex w-full items-center justify-center gap-1.5 py-1 text-[11.5px] text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-3 w-3" />
          Use a different account
        </button>
      </form>

      <div id={RECAPTCHA_ID} />
    </div>
  );
}
