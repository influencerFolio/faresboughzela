import { getAdminDb } from "@/lib/firebase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { contactFormSchema } from "@/lib/validation/forms";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(`contact:${ip}`)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json(
      { error: "Server storage is not configured" },
      { status: 503 },
    );
  }

  const { website: _honeypot, ...data } = parsed.data;
  await db.collection("messages").add({
    type: "contact",
    status: "New",
    ...data,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
