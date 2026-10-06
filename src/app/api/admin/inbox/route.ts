import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

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
  await db.collection(collection).doc(id).update({ status });
  return NextResponse.json({ ok: true });
}
