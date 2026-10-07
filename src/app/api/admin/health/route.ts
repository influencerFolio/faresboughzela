import {
  getAdminApp,
  getFirebaseAdminInitError,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/admin";
import { isCloudinaryConfigured } from "@/lib/cloudinary-server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public diagnostic (no secrets). Use to verify Netlify env + Firebase Admin init.
 * GET /api/admin/health
 */
export async function GET() {
  try {
    const has = (name: string) => Boolean(process.env[name]?.trim());

    const adminConfigured = isFirebaseAdminConfigured();
    let adminReady = false;
    let adminError: string | null = null;

    if (adminConfigured) {
      const app = getAdminApp();
      adminReady = Boolean(app);
      adminError = getFirebaseAdminInitError();
    } else {
      adminError =
        "Missing FIREBASE_ADMIN_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY or PRIVATE_KEY_BASE64";
    }

    return NextResponse.json({
      ok: adminReady && isCloudinaryConfigured(),
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
      firebase: {
        clientProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null,
        adminProjectId: process.env.FIREBASE_ADMIN_PROJECT_ID || null,
        projectsMatch:
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ===
          process.env.FIREBASE_ADMIN_PROJECT_ID,
        hasClientApiKey: has("NEXT_PUBLIC_FIREBASE_API_KEY"),
        hasAdminClientEmail: has("FIREBASE_ADMIN_CLIENT_EMAIL"),
        hasAdminPrivateKey: has("FIREBASE_ADMIN_PRIVATE_KEY"),
        hasAdminPrivateKeyBase64: has("FIREBASE_ADMIN_PRIVATE_KEY_BASE64"),
        adminConfigured,
        adminReady,
        adminError,
      },
      cloudinary: {
        configured: isCloudinaryConfigured(),
        hasCloudName: has("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
        hasApiKey: has("CLOUDINARY_API_KEY"),
        hasApiSecret: has("CLOUDINARY_API_SECRET"),
        uploadFolder: process.env.CLOUDINARY_UPLOAD_FOLDER || "faresboughzela",
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        crash: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}
