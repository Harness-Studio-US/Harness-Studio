import { FirebaseError } from "firebase/app";
import { sendEmailVerification, sendPasswordResetEmail, type User } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Continue URL Firebase returns to after an email action. The Pages build uses hash
 * routing under /Harness-Studio/, and Firebase adds `mode` and `oobCode` to this URL, so
 * the app handles verification and password resets itself instead of the default widget.
 */
export function actionContinueUrl(): string {
  const url = new URL(window.location.href);
  url.pathname = url.pathname.replace(/[^/]*$/, "");
  url.search = "";
  url.hash = "";
  return url.toString();
}

function rejectsContinueUrl(error: unknown): boolean {
  return error instanceof FirebaseError && error.code === "auth/unauthorized-continue-uri";
}

/** Sends the "verify your email" message, falling back to a linkless-default email. */
export async function sendVerificationEmail(user: User): Promise<void> {
  try {
    await sendEmailVerification(user, { url: actionContinueUrl(), handleCodeInApp: true });
  } catch (error) {
    if (!rejectsContinueUrl(error)) throw error;
    await sendEmailVerification(user);
  }
}

/** Sends the password reset message pointing at this site's own reset screen. */
export async function sendPasswordReset(email: string): Promise<void> {
  if (!auth) throw new Error("Firebase Authentication is not configured.");
  try {
    await sendPasswordResetEmail(auth, email, {
      url: actionContinueUrl(),
      handleCodeInApp: true,
    });
  } catch (error) {
    if (!rejectsContinueUrl(error)) throw error;
    await sendPasswordResetEmail(auth, email);
  }
}
