import { verifyAdminRequest } from "@/lib/admin-auth";
import { saveSettingsDoc } from "@/lib/repositories/content";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { doc, data } = body as { doc: string; data: object };
  if (!doc?.startsWith("settings/")) {
    return NextResponse.json({ error: "Invalid doc path" }, { status: 400 });
  }
  try {
    await saveSettingsDoc(doc, data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Save failed" },
      { status: 503 },
    );
  }
}
