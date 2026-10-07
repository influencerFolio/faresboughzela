import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let initFailed = false;
let initError: string | null = null;

export function getFirebaseAdminInitError() {
  return initError;
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      (process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
        process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64),
  );
}

/** Normalize private keys from Netlify / CI env vars. */
function resolvePrivateKey(): string {
  const b64 = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64?.trim();
  if (b64) {
    return Buffer.from(b64, "base64").toString("utf8").trim();
  }

  let key = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  // Netlify may store either real newlines or literal \n
  key = key.replace(/\\n/g, "\n");
  return key.trim();
}

export function getAdminApp(): App | null {
  if (!isFirebaseAdminConfigured() || initFailed) return null;
  if (adminApp) return adminApp;
  const existing = getApps()[0];
  if (existing) {
    adminApp = existing;
    return adminApp;
  }
  try {
    const privateKey = resolvePrivateKey();
    if (!privateKey.includes("BEGIN PRIVATE KEY")) {
      throw new Error(
        "FIREBASE_ADMIN_PRIVATE_KEY is missing BEGIN PRIVATE KEY header. Prefer FIREBASE_ADMIN_PRIVATE_KEY_BASE64 on Netlify.",
      );
    }
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey,
      }),
    });
    return adminApp;
  } catch (error) {
    initFailed = true;
    initError = error instanceof Error ? error.message : String(error);
    console.error("[firebase-admin] Failed to initialize:", error);
    return null;
  }
}

export function getAdminDb() {
  const app = getAdminApp();
  if (!app) return null;
  try {
    return getFirestore(app);
  } catch (error) {
    initError = error instanceof Error ? error.message : String(error);
    console.error("[firebase-admin] Firestore unavailable:", error);
    return null;
  }
}

export function getAdminAuth() {
  const app = getAdminApp();
  if (!app) return null;
  try {
    return getAuth(app);
  } catch (error) {
    initError = error instanceof Error ? error.message : String(error);
    console.error("[firebase-admin] Auth unavailable:", error);
    return null;
  }
}
