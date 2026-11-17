import { FirebaseError } from "firebase/app";

/** User-facing copy for the Firebase Authentication errors this site can hit. */
export function authErrorMessage(error: unknown): string {
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
      case "auth/unauthorized-continue-uri":
        return "This domain is not authorized for email links in Firebase Authentication.";
      case "auth/invalid-api-key":
      case "auth/api-key-not-valid":
        return "The Firebase API key is invalid. Check the Firebase web app configuration.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/expired-action-code":
        return "This link has expired. Request a new email from the sign-in screen.";
      case "auth/invalid-action-code":
        return "This link has already been used or is no longer valid. Request a new email.";
      case "auth/user-token-expired":
        return "Your session expired. Sign in again to continue.";
      case "auth/admin-restricted-operation":
      case "auth/unsupported-first-factor":
        return "Two-step verification is not enabled for this Firebase project yet.";
      case "auth/requires-recent-login":
        return "For your security, sign out and sign in again, then retry this change.";
      case "auth/second-factor-already-in-use":
        return "That second factor is already set up on this account.";
      case "auth/maximum-second-factor-count-exceeded":
        return "This account already has the maximum number of second factors. Remove one first.";
      case "auth/invalid-verification-code":
        return "That code is not correct. Check the code and try again.";
      case "auth/missing-verification-code":
        return "Enter the 6-digit code.";
      case "auth/code-expired":
      case "auth/session-expired":
        return "That code expired. Send a new one and try again.";
      case "auth/invalid-phone-number":
        return "Enter a phone number in international format, for example +14155550123.";
      case "auth/credential-already-in-use":
      case "auth/provider-already-linked":
        return "That phone number is already attached to a Harness Copilot account.";
      case "auth/quota-exceeded":
        return "The SMS limit for this project was reached. Try again later.";
      case "auth/captcha-check-failed":
        return "The reCAPTCHA check did not pass. Reload the page and try again.";
      case "auth/multi-factor-auth-required":
        return "Enter your second factor to finish signing in.";
      default:
        return "Something went wrong. Try again.";
    }
  }
  return "Something went wrong. Try again.";
}
