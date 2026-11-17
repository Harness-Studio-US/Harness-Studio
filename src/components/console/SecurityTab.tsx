import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  TotpMultiFactorGenerator,
  linkWithPhoneNumber,
  multiFactor,
  type ConfirmationResult,
  type MultiFactorInfo,
  type TotpSecret,
  type User,
} from "firebase/auth";
import {
  Check,
  ExternalLink,
  Loader2,
  MailCheck,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";
import { Badge, SettingCard } from "../controls";
import { CopyButton } from "../CodeBlock";
import { auth } from "../../lib/firebase";
import { authErrorMessage } from "../../lib/authMessages";
import { sendPasswordReset } from "../../lib/authActions";

const PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;
const TOTP_RECAPTCHA_ID = "harness-totp-recaptcha";
const PHONE_FACTOR_RECAPTCHA_ID = "harness-phone-factor-recaptcha";
const PHONE_LINK_RECAPTCHA_ID = "harness-phone-link-recaptcha";

function isPhoneFactor(factor: MultiFactorInfo): boolean {
  return factor.factorId === "phone";
}

/** Firebase answers these codes when the project has not enabled MFA yet. */
function isMfaUnavailable(error: unknown): boolean {
  if (!(error instanceof FirebaseError)) return false;
  return (
    error.code === "auth/admin-restricted-operation" ||
    error.code === "auth/operation-not-allowed" ||
    error.code === "auth/unsupported-first-factor" ||
    error.code === "auth/unsupported-tenant-operation"
  );
}

function factorTitle(factor: MultiFactorInfo): string {
  return factor.displayName || (isPhoneFactor(factor) ? "Phone number" : "Authenticator app");
}

function factorType(factor: MultiFactorInfo): string {
  return isPhoneFactor(factor) ? "SMS code" : "Authenticator app";
}

export function SecurityTab({
  user,
  onUserChanged,
}: {
  user: User | null;
  onUserChanged: () => void;
}) {
  const [factors, setFactors] = useState<MultiFactorInfo[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [mfaSetup, setMfaSetup] = useState<"checking" | "ready" | "blocked">("checking");

  const [totpSecret, setTotpSecret] = useState<TotpSecret | null>(null);
  const [totpUri, setTotpUri] = useState("");
  const [totpCode, setTotpCode] = useState("");

  const [factorPhone, setFactorPhone] = useState("");
  const [factorVerificationId, setFactorVerificationId] = useState("");
  const [factorCode, setFactorCode] = useState("");

  const [linkPhone, setLinkPhone] = useState("");
  const [linkConfirmation, setLinkConfirmation] = useState<ConfirmationResult | null>(null);
  const [linkCode, setLinkCode] = useState("");

  useEffect(() => {
    setFactors(user ? multiFactor(user).enrolledFactors : []);
  }, [user]);

  useEffect(() => {
    const current = auth?.currentUser;
    if (!current) return;
    let active = true;
    setMfaSetup("checking");
    void (async () => {
      try {
        await multiFactor(current).getSession();
        if (active) setMfaSetup("ready");
      } catch {
        if (active) setMfaSetup("blocked");
      }
    })();
    return () => {
      active = false;
    };
  }, [user?.uid]);

  function clearMessages() {
    setError("");
    setNotice("");
  }

  async function refreshAccount() {
    const current = auth?.currentUser;
    if (!current) return;
    await current.reload();
    setFactors(multiFactor(current).enrolledFactors);
    onUserChanged();
  }

  async function startTotp() {
    const instance = auth;
    if (!instance || !user) return;
    clearMessages();
    setBusy("totp-start");
    try {
      const session = await multiFactor(user).getSession();
      const secret = await TotpMultiFactorGenerator.generateSecret(session);
      setTotpSecret(secret);
      setTotpUri(secret.generateQrCodeUrl(user.email ?? "account", "Harness Studio"));
      setTotpCode("");
    } catch (caught) {
      if (isMfaUnavailable(caught)) setMfaSetup("blocked");
      setError(authErrorMessage(caught));
    } finally {
      setBusy("");
    }
  }

  async function confirmTotp() {
    if (!user || !totpSecret) return;
    if (!totpCode.trim()) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }
    clearMessages();
    setBusy("totp-confirm");
    try {
      const assertion = TotpMultiFactorGenerator.assertionForEnrollment(
        totpSecret,
        totpCode.trim()
      );
      await multiFactor(user).enroll(assertion, "Authenticator app");
      setTotpSecret(null);
      setTotpUri("");
      setTotpCode("");
      setNotice("Authenticator app added. You will be asked for a code at sign-in.");
      await refreshAccount();
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setBusy("");
    }
  }

  async function sendFactorPhoneCode() {
    const instance = auth;
    if (!instance || !user) return;
    const number = factorPhone.trim();
    if (!PHONE_PATTERN.test(number)) {
      setError("Enter a phone number in international format, for example +14155550123.");
      return;
    }
    clearMessages();
    setBusy("factor-send");
    const verifier = new RecaptchaVerifier(instance, PHONE_FACTOR_RECAPTCHA_ID, {
      size: "invisible",
    });
    try {
      const session = await multiFactor(user).getSession();
      const provider = new PhoneAuthProvider(instance);
      const verificationId = await provider.verifyPhoneNumber({ phoneNumber: number, session }, verifier);
      setFactorVerificationId(verificationId);
      setNotice(`We sent a 6-digit code to ${number}.`);
    } catch (caught) {
      if (isMfaUnavailable(caught)) setMfaSetup("blocked");
      setError(authErrorMessage(caught));
    } finally {
      verifier.clear();
      setBusy("");
    }
  }

  async function confirmFactorPhone() {
    if (!user || !factorVerificationId) return;
    if (!factorCode.trim()) {
      setError("Enter the 6-digit code we texted you.");
      return;
    }
    clearMessages();
    setBusy("factor-confirm");
    try {
      const credential = PhoneAuthProvider.credential(factorVerificationId, factorCode.trim());
      await multiFactor(user).enroll(
        PhoneMultiFactorGenerator.assertion(credential),
        factorPhone.trim()
      );
      setFactorPhone("");
      setFactorVerificationId("");
      setFactorCode("");
      setNotice("Phone number added as a second factor.");
      await refreshAccount();
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setBusy("");
    }
  }

  async function removeFactor(factor: MultiFactorInfo) {
    if (!user) return;
    clearMessages();
    setBusy(`remove-${factor.uid}`);
    try {
      await multiFactor(user).unenroll(factor);
      setNotice("Second factor removed.");
      await refreshAccount();
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setBusy("");
    }
  }

  async function sendLinkPhoneCode() {
    const instance = auth;
    if (!instance || !user) return;
    const number = linkPhone.trim();
    if (!PHONE_PATTERN.test(number)) {
      setError("Enter a phone number in international format, for example +14155550123.");
      return;
    }
    clearMessages();
    setBusy("link-send");
    const verifier = new RecaptchaVerifier(instance, PHONE_LINK_RECAPTCHA_ID, { size: "invisible" });
    try {
      const confirmation = await linkWithPhoneNumber(user, number, verifier);
      setLinkConfirmation(confirmation);
      setNotice(`We sent a 6-digit code to ${number}.`);
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      verifier.clear();
      setBusy("");
    }
  }

  async function confirmLinkPhone() {
    if (!linkConfirmation) return;
    if (!linkCode.trim()) {
      setError("Enter the 6-digit code we texted you.");
      return;
    }
    clearMessages();
    setBusy("link-confirm");
    try {
      await linkConfirmation.confirm(linkCode.trim());
      setLinkPhone("");
      setLinkCode("");
      setLinkConfirmation(null);
      setNotice("Phone number verified and added to your account.");
      await refreshAccount();
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setBusy("");
    }
  }

  async function emailResetLink() {
    if (!user?.email) return;
    clearMessages();
    setBusy("reset-email");
    try {
      await sendPasswordReset(user.email);
      setNotice(`Password reset link sent to ${user.email}.`);
    } catch (caught) {
      setError(authErrorMessage(caught));
    } finally {
      setBusy("");
    }
  }

  if (!user) {
    return (
      <SettingCard title="Security" description="Sign in to manage two-step verification.">
        <p className="text-[11.5px] leading-relaxed text-slate-500">
          Account security settings are available once you are signed in to Harness Copilot.
        </p>
      </SettingCard>
    );
  }

  const twoStepOn = factors.length > 0;
  const projectId = auth?.app.options.projectId ?? "";
  const authSettingsUrl = projectId
    ? `https://console.firebase.google.com/project/${projectId}/authentication/settings`
    : "https://console.firebase.google.com/";
  const totpCommand = `curl -X PATCH "https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId || "YOUR_PROJECT_ID"}/config?updateMask=mfa" \\\n  -H "Authorization: Bearer $(gcloud auth print-access-token)" \\\n  -H "Content-Type: application/json" \\\n  -H "X-Goog-User-Project: ${projectId || "YOUR_PROJECT_ID"}" \\\n  -d '{"mfa":{"providerConfigs":[{"state":"ENABLED","totpProviderConfig":{"adjacentIntervals":5}}]}}'`;

  async function recheckMfa() {
    const current = auth?.currentUser;
    if (!current) return;
    setMfaSetup("checking");
    try {
      await multiFactor(current).getSession();
      setMfaSetup("ready");
      setNotice("Firebase now allows second factors on this project.");
    } catch {
      setMfaSetup("blocked");
      setError("Firebase still refuses second factors on this project. Finish the steps below, then check again.");
    }
  }

  return (
    <div className="space-y-4">
      <SettingCard title="Account" description="The identity this workspace signs in with.">
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2">
            <span className="min-w-0 flex-1 truncate font-mono text-[10.5px] text-slate-700">
              {user.email ?? "No email on this account"}
            </span>
            <Badge tone={user.emailVerified ? "green" : "amber"}>
              {user.emailVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
            <Smartphone className="h-3.5 w-3.5 text-slate-400" />
            <span className="min-w-0 flex-1 truncate font-mono text-[10.5px] text-slate-700">
              {user.phoneNumber ?? "No phone number yet"}
            </span>
            {user.phoneNumber && <Badge tone="green">Verified</Badge>}
          </div>
        </div>
      </SettingCard>

      {mfaSetup === "blocked" && (
        <SettingCard
          title="Turn on two-step verification in Firebase"
          description="Firebase has not enabled multi-factor authentication for this project yet. These are the only steps needed, and they are all in the Firebase console."
          right={<Badge tone="amber">Setup needed</Badge>}
        >
          <ol className="space-y-2.5 text-[10.5px] leading-relaxed text-slate-600">
            <li>
              <span className="font-semibold text-slate-800">1. Upgrade to Identity Platform.</span>{" "}
              Firebase console → Authentication → Settings → Upgrade. Sign-in keeps working, and the
              no-cost tier covers up to 3,000 daily active users.
            </li>
            <li>
              <span className="font-semibold text-slate-800">2. Enable authenticator codes.</span>{" "}
              The console has no switch for TOTP yet, so run this once with gcloud signed in:
              <div className="mt-1.5 flex items-start gap-1.5">
                <pre className="min-w-0 flex-1 overflow-x-auto rounded border border-slate-200 bg-slate-50 p-2 font-mono text-[9px] leading-relaxed text-slate-700">
                  {totpCommand}
                </pre>
                <CopyButton text={totpCommand} className="shrink-0" />
              </div>
            </li>
            <li>
              <span className="font-semibold text-slate-800">3. Optional: SMS codes.</span>{" "}
              Authentication → Sign-in method → Advanced → enable SMS multi-factor, add a test
              number, and keep the project on the Blaze plan.
            </li>
            <li>
              <span className="font-semibold text-slate-800">4. Keep email verification on.</span>{" "}
              Accounts must confirm their address before enrolling a factor, which this site already
              requires.
            </li>
            <li>
              <span className="font-semibold text-slate-800">5. Keep the domain authorized.</span>{" "}
              Authentication → Settings → Authorized domains needs harness-studio-us.github.io and
              localhost.
            </li>
          </ol>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <a
              href={authSettingsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[10.5px] font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ExternalLink className="h-3 w-3" />
              Open Authentication settings
            </a>
            <button
              type="button"
              onClick={() => void recheckMfa()}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[10.5px] font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-3 w-3" />
              Check again
            </button>
          </div>

          <p className="mt-2 text-[9px] leading-relaxed text-slate-400">
            The TOTP request replaces the whole MFA configuration, so if SMS is already enabled,
            include its provider config in the same call. Already finished these steps? Use “Check
            again”.
          </p>
        </SettingCard>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-rose-700"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[10.5px] leading-relaxed text-emerald-700"
        >
          {notice}
        </p>
      )}

      <SettingCard
        title="Two-step verification"
        description="Ask for a second factor whenever this account signs in."
        right={
          <Badge tone={twoStepOn ? "green" : mfaSetup === "blocked" ? "amber" : "default"}>
            {twoStepOn ? "On" : mfaSetup === "blocked" ? "Setup" : "Off"}
          </Badge>
        }
      >
        {factors.length > 0 && (
          <div className="space-y-1.5">
            {factors.map((factor) => (
              <div
                key={factor.uid}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2"
              >
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-medium text-slate-800">
                    {factorTitle(factor)}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    {factorType(factor)} · added{" "}
                    {new Date(factor.enrollmentTime).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void removeFactor(factor)}
                  disabled={busy === `remove-${factor.uid}`}
                  className="rounded-md border border-slate-200 p-1 text-slate-500 transition hover:text-rose-600 disabled:opacity-40"
                  aria-label={`Remove ${factorTitle(factor)}`}
                >
                  {busy === `remove-${factor.uid}` ? (
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-2.5 w-2.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {!totpSecret && (
          <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => void startTotp()}
              disabled={busy === "totp-start"}
              className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-[10.5px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
            >
              {busy === "totp-start" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <ShieldCheck className="h-3 w-3 text-violet-700" />
              )}
              Authenticator app
            </button>
            <button
              type="button"
              onClick={() => {
                clearMessages();
                setFactorVerificationId("");
                setFactorCode("");
                document.getElementById(PHONE_FACTOR_RECAPTCHA_ID)?.scrollIntoView({
                  block: "nearest",
                });
                const field = document.getElementById("factor-phone");
                field?.focus();
              }}
              className="flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-[10.5px] font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Smartphone className="h-3 w-3 text-violet-700" />
              Phone number
            </button>
          </div>
        )}

        {totpSecret && (
          <div className="mt-3 rounded-lg border border-violet-200 bg-violet-50 p-3">
            <div className="text-[10.5px] font-semibold text-slate-800">
              Add Harness Studio to your authenticator app
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
              Open the app, add an account with the setup key below, then enter the 6-digit code it
              shows.
            </p>

            <div className="mt-2 flex items-center gap-1.5">
              <code className="min-w-0 flex-1 break-all rounded border border-slate-200 bg-white px-2 py-1.5 font-mono text-[10px] tracking-[0.12em] text-slate-800">
                {totpSecret.secretKey}
              </code>
              <CopyButton text={totpSecret.secretKey} className="shrink-0" />
            </div>

            <details className="mt-2">
              <summary className="cursor-pointer list-none text-[9.5px] text-slate-500 hover:text-slate-700 [&::-webkit-details-marker]:hidden">
                Setup link for this device
              </summary>
              <div className="mt-1.5 flex items-start gap-1.5">
                <code className="min-w-0 flex-1 break-all rounded border border-slate-200 bg-white px-2 py-1.5 font-mono text-[9px] text-slate-600">
                  {totpUri}
                </code>
                <CopyButton text={totpUri} className="shrink-0" />
              </div>
              <a
                href={totpUri}
                className="mt-1.5 inline-block text-[9.5px] font-medium text-violet-700 hover:underline"
              >
                Open in an authenticator app on this device
              </a>
            </details>

            <div className="mt-2.5 flex gap-1.5">
              <input
                value={totpCode}
                onChange={(event) => setTotpCode(event.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                aria-label="Authenticator code"
                className="field h-8 flex-1 font-mono text-[11px] tracking-[0.2em]"
              />
              <button
                type="button"
                onClick={() => void confirmTotp()}
                disabled={busy === "totp-confirm"}
                className="btn-primary h-8 shrink-0 px-3 text-[10.5px] disabled:opacity-40"
              >
                {busy === "totp-confirm" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
                Turn on
              </button>
              <button
                type="button"
                onClick={() => {
                  setTotpSecret(null);
                  setTotpUri("");
                  setTotpCode("");
                  clearMessages();
                }}
                className="shrink-0 rounded-lg border border-slate-200 px-2 text-[10px] text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 border-t border-slate-100 pt-2.5">
          <div className="text-[10px] font-medium text-slate-600">Add a phone as a second factor</div>
          <div className="mt-1.5 flex gap-1.5">
            <input
              id="factor-phone"
              value={factorPhone}
              onChange={(event) => setFactorPhone(event.target.value)}
              placeholder="+14155550123"
              aria-label="Phone number for two-step verification"
              className="field h-8 flex-1 font-mono text-[10.5px]"
            />
            <button
              type="button"
              onClick={() => void sendFactorPhoneCode()}
              disabled={busy === "factor-send"}
              className="btn-primary h-8 shrink-0 px-2.5 text-[10.5px] disabled:opacity-40"
            >
              {busy === "factor-send" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : factorVerificationId ? (
                "Resend"
              ) : (
                "Send code"
              )}
            </button>
          </div>
          {factorVerificationId && (
            <div className="mt-1.5 flex gap-1.5">
              <input
                value={factorCode}
                onChange={(event) => setFactorCode(event.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
                aria-label="SMS code for two-step verification"
                className="field h-8 flex-1 font-mono text-[11px] tracking-[0.2em]"
              />
              <button
                type="button"
                onClick={() => void confirmFactorPhone()}
                disabled={busy === "factor-confirm"}
                className="btn-primary h-8 shrink-0 px-2.5 text-[10.5px] disabled:opacity-40"
              >
                {busy === "factor-confirm" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          )}
        </div>

        <div id={PHONE_FACTOR_RECAPTCHA_ID} />
      </SettingCard>

      <SettingCard
        title="Phone number"
        description="Verify a number so the account has a recovery contact."
      >
        {user.phoneNumber ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span className="min-w-0 flex-1 truncate font-mono text-[10.5px] text-emerald-800">
              {user.phoneNumber}
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.1em] text-emerald-700">
              Verified
            </span>
          </div>
        ) : (
          <>
            <div className="flex gap-1.5">
              <input
                value={linkPhone}
                onChange={(event) => setLinkPhone(event.target.value)}
                placeholder="+14155550123"
                aria-label="Phone number"
                className="field h-8 flex-1 font-mono text-[10.5px]"
              />
              <button
                type="button"
                onClick={() => void sendLinkPhoneCode()}
                disabled={busy === "link-send"}
                className="btn-primary h-8 shrink-0 px-2.5 text-[10.5px] disabled:opacity-40"
              >
                {busy === "link-send" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : linkConfirmation ? (
                  "Resend"
                ) : (
                  "Send code"
                )}
              </button>
            </div>
            {linkConfirmation && (
              <div className="mt-1.5 flex gap-1.5">
                <input
                  value={linkCode}
                  onChange={(event) => setLinkCode(event.target.value)}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  aria-label="SMS verification code"
                  className="field h-8 flex-1 font-mono text-[11px] tracking-[0.2em]"
                />
                <button
                  type="button"
                  onClick={() => void confirmLinkPhone()}
                  disabled={busy === "link-confirm"}
                  className="btn-primary h-8 shrink-0 px-2.5 text-[10.5px] disabled:opacity-40"
                >
                  {busy === "link-confirm" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            )}
            <p className="mt-1.5 text-[9px] leading-relaxed text-slate-400">
              Use international format. Standard message rates apply.
            </p>
          </>
        )}
        <div id={PHONE_LINK_RECAPTCHA_ID} />
      </SettingCard>

      <SettingCard title="Password" description="Change it from a link we email you.">
        <button
          type="button"
          onClick={() => void emailResetLink()}
          disabled={!user.email || busy === "reset-email"}
          className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-[10.5px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
        >
          {busy === "reset-email" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <MailCheck className="h-3 w-3 text-violet-700" />
          )}
          Email me a reset link
        </button>
        <p className="mt-1.5 text-[9px] leading-relaxed text-slate-400">
          The link opens this site&apos;s own reset screen. You can also start from the{" "}
          <Link to="/reset-password" className="font-medium text-violet-700 hover:underline">
            password reset page
          </Link>
          .
        </p>
      </SettingCard>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-1.5 text-[10.5px] font-medium text-slate-700">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          How this is protected
        </div>
        <ul className="mt-1.5 space-y-1 text-[9.5px] leading-relaxed text-slate-500">
          <li>
            • Two-step verification is enforced by Firebase Authentication. Changing factors needs a
            recent sign-in.
          </li>
          <li>• Your password is never stored by this site.</li>
          <li>• SMS codes require Firebase Authentication with Identity Platform and a Blaze plan.</li>
        </ul>
      </div>

      <div id={TOTP_RECAPTCHA_ID} />
    </div>
  );
}
