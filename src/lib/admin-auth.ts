import { getAdminAuth } from "@/lib/firebase/admin";
import { NextRequest } from "next/server";

export async function verifyAdminRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  if (!token) return null;
  const auth = getAdminAuth();
  if (!auth) return null;
  try {
    const decoded = await auth.verifyIdToken(token);
    if (!decoded.admin) return null;
    return decoded;
  } catch {
    return null;
  }
}
