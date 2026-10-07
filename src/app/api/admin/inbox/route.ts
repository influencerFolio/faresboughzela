import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";
import {
  getMessagesAdmin,
  getRegistrationsAdmin,
} from "@/lib/repositories/content";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [messages, registrations] = await Promise.all([
      getMessagesAdmin(),
      getRegistrationsAdmin(),
    ]);
    return NextResponse.json({ messages, registrations });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Load failed" },
      { status: 503 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  const { collection, id, status } = await request.json();
  if (!["messages", "registrations"].includes(collection) || !id || !status) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  try {
    await db.collection(collection).doc(id).update({ status });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Update failed" },
      { status: 503 },
    );
  }
}
