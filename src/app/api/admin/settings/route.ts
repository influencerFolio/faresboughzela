import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  getAboutSettings,
  getGeneralSettings,
  getHomepageSettings,
  saveSettingsDoc,
} from "@/lib/repositories/content";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const doc = request.nextUrl.searchParams.get("doc");
  try {
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
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Load failed" },
      { status: 503 },
    );
  }
}

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
