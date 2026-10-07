import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  getAboutSettings,
  getGeneralSettings,
  getHomepageSettings,
  saveSettingsDoc,
} from "@/lib/repositories/content";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const doc = request.nextUrl.searchParams.get("doc");
    if (doc === "settings/general") {
      return NextResponse.json(await getGeneralSettings());
    }
    if (doc === "settings/homepage") {
      return NextResponse.json(await getHomepageSettings());
    }
    if (doc === "settings/about") {
      return NextResponse.json(await getAboutSettings());
    }
    return NextResponse.json({ error: "Invalid doc path" }, { status: 400 });
  } catch (e) {
    console.error("[api/admin/settings GET]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Load failed" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const body = await request.json();
    const { doc, data } = body as { doc: string; data: object };
    if (!doc?.startsWith("settings/")) {
      return NextResponse.json({ error: "Invalid doc path" }, { status: 400 });
    }
    await saveSettingsDoc(doc, data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/settings POST]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Save failed" },
      { status: 503 },
    );
  }
}
