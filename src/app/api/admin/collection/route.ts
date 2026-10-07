import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  deleteCollectionDoc,
  getAllPortfolioAdmin,
  getAllServicesAdmin,
  saveCollectionDoc,
} from "@/lib/repositories/content";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowed = new Set(["portfolio", "services", "seoPages"]);

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const collection = request.nextUrl.searchParams.get("collection");
    if (!collection || !allowed.has(collection)) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
    }
    if (collection === "portfolio") {
      return NextResponse.json(await getAllPortfolioAdmin());
    }
    if (collection === "services") {
      return NextResponse.json(await getAllServicesAdmin());
    }
    return NextResponse.json([]);
  } catch (e) {
    console.error("[api/admin/collection GET]", e);
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
    const { action, collection, id, data } = body as {
      action: "upsert" | "delete";
      collection: string;
      id: string;
      data?: object;
    };

    if (!allowed.has(collection) || !id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (action === "delete") {
      await deleteCollectionDoc(collection, id);
    } else {
      await saveCollectionDoc(collection, id, data ?? {});
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/admin/collection POST]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Operation failed" },
      { status: 503 },
    );
  }
}
