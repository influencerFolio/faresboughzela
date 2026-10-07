"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { readApiError } from "@/lib/admin-api";
import { useState } from "react";

export function CloudinaryUploadButton({
  onUploaded,
}: {
  onUploaded: (asset: {
    publicId: string;
    url: string;
    width?: number;
    height?: number;
    format?: string;
  }) => void;
}) {
  const { getToken } = useAdminAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePick(file: File) {
    setBusy(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not logged in — refresh and sign in again.");
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!signRes.ok) {
        throw new Error(await readApiError(signRes, "Upload signing failed"));
      }
      const sign = await signRes.json();
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sign.apiKey);
      form.append("timestamp", String(sign.timestamp));
      form.append("signature", sign.signature);
      form.append("folder", sign.folder);
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
        { method: "POST", body: form },
      );
      if (!uploadRes.ok) {
        const errBody = await uploadRes.json().catch(() => ({}));
        throw new Error(
          (errBody as { error?: { message?: string } })?.error?.message ||
            "Cloudinary upload failed",
        );
      }
      const result = await uploadRes.json();
      onUploaded({
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-1">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant/40 px-3 py-2 text-sm">
        <span className="material-symbols-outlined text-[18px]">upload</span>
        {busy ? "Uploading…" : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handlePick(file);
            e.target.value = "";
          }}
        />
      </label>
      {error ? <p className="text-xs text-primary-container">{error}</p> : null}
    </div>
  );
}
