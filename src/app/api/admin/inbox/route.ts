import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";
import {
  getMessagesAdmin,
  getRegistrationsAdmin,
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
    const [messages, registrations] = await Promise.all([
      getMessagesAdmin(),
      getRegistrationsAdmin(),
    ]);
    return NextResponse.json({ messages, registrations });
  } catch (e) {
    console.error("[api/admin/inbox GET]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Load failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Not configured" }, { status: 503 });
    }
    const { collection, id, status } = await request.json();
    if (!["messages", "registrations"].includes(collection) || !id || !status) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await db.collection(collection).doc(id).update({ status });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/inbox PATCH]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Update failed" },
      { status: 503 },
    );
  }
}
