import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidatePath("/en");
  revalidatePath("/fr");
  revalidatePath("/en/portfolio");
  revalidatePath("/fr/portfolio");
  revalidatePath("/en/services");
  revalidatePath("/fr/services");
  return NextResponse.json({ revalidated: true });
}
