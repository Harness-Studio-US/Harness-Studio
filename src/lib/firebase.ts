import { getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

const requiredVars = [
  ["VITE_FIREBASE_API_KEY", config.apiKey],
  ["VITE_FIREBASE_AUTH_DOMAIN", config.authDomain],
  ["VITE_FIREBASE_PROJECT_ID", config.projectId],
  ["VITE_FIREBASE_APP_ID", config.appId],
] as const;

export const missingFirebaseVars = requiredVars
  .filter(([, value]) => !value?.trim())
  .map(([name]) => name);

export const isFirebaseConfigured = missingFirebaseVars.length === 0;

let auth: Auth | null = null;

if (isFirebaseConfigured) {
  const app = getApps()[0] ?? initializeApp({
    apiKey: config.apiKey!,
    authDomain: config.authDomain!,
    projectId: config.projectId!,
    appId: config.appId!,
    storageBucket: config.storageBucket || undefined,
    messagingSenderId: config.messagingSenderId || undefined,
  });

  auth = getAuth(app);
}

export { auth };
