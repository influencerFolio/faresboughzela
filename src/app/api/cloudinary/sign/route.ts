import { verifyAdminRequest } from "@/lib/admin-auth";
import { signUploadParams } from "@/lib/cloudinary-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const admin = await verifyAdminRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const signed = signUploadParams(Math.floor(Date.now() / 1000));
  if (!signed) {
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 503 },
    );
  }
  return NextResponse.json(signed);
}
