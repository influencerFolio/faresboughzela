import { verifyAdminRequest } from "@/lib/admin-auth";
import {
  deleteCollectionDoc,
  getAllPortfolioAdmin,
  getAllServicesAdmin,
  saveCollectionDoc,
} from "@/lib/repositories/content";
import { NextRequest, NextResponse } from "next/server";

const allowed = new Set(["portfolio", "services", "seoPages"]);

export async function GET(request: NextRequest) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const collection = request.nextUrl.searchParams.get("collection");
  if (!collection || !allowed.has(collection)) {
    return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
  }
  try {
    if (collection === "portfolio") {
      return NextResponse.json(await getAllPortfolioAdmin());
    }
    if (collection === "services") {
      return NextResponse.json(await getAllServicesAdmin());
    }
    return NextResponse.json([]);
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
  const { action, collection, id, data } = body as {
    action: "upsert" | "delete";
    collection: string;
    id: string;
    data?: object;
  };

  if (!allowed.has(collection) || !id) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    if (action === "delete") {
      await deleteCollectionDoc(collection, id);
    } else {
      await saveCollectionDoc(collection, id, data ?? {});
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Operation failed" },
      { status: 503 },
    );
  }
}
