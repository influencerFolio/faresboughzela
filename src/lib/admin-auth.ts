import {
  getAdminAuth,
  getFirebaseAdminInitError,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/admin";
import { NextRequest } from "next/server";

export type AdminAuthResult =
  | { ok: true; uid: string; email?: string }
  | { ok: false; status: number; error: string };

export async function verifyAdminRequest(
  request: NextRequest,
): Promise<AdminAuthResult> {
  try {
    if (!isFirebaseAdminConfigured()) {
      return {
        ok: false,
        status: 503,
        error:
          "Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY_BASE64 on Netlify.",
      };
    }

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    if (!token) {
      return { ok: false, status: 401, error: "Missing bearer token" };
    }

    const auth = getAdminAuth();
    if (!auth) {
      return {
        ok: false,
        status: 503,
        error:
          getFirebaseAdminInitError() ||
          "Firebase Admin failed to initialize. Check the private key encoding.",
      };
    }

    const decoded = await auth.verifyIdToken(token);
    if (!decoded.admin) {
      return {
        ok: false,
        status: 403,
        error: "User is missing admin claim. Run npm run bootstrap-admin.",
      };
    }
    return { ok: true, uid: decoded.uid, email: decoded.email };
  } catch (error) {
    return {
      ok: false,
      status: 401,
      error: error instanceof Error ? error.message : "Invalid token",
    };
  }
}
