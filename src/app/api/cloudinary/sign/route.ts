import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  isCloudinaryConfigured,
  signUploadParams,
} from "@/lib/cloudinary-server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { error: "Cloudinary is not configured" },
        { status: 503 },
      );
    }
    const signed = signUploadParams(Math.floor(Date.now() / 1000));
    if (!signed) {
      return NextResponse.json({ error: "Sign failed" }, { status: 503 });
    }
    return NextResponse.json(signed);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Sign failed" },
      { status: 500 },
    );
  }
}
