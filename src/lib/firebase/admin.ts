import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let initFailed = false;

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  );
}

/** Normalize private keys pasted into Netlify/UI env vars. */
function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  // Netlify often stores literal \n sequences
  key = key.replace(/\\n/g, "\n");
  return key;
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
    const privateKey = normalizePrivateKey(
      process.env.FIREBASE_ADMIN_PRIVATE_KEY || "",
    );
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
    console.error("[firebase-admin] Auth unavailable:", error);
    return null;
  }
}
