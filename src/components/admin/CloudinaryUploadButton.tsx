"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
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

  async function handlePick(file: File) {
    setBusy(true);
    try {
      const token = await getToken();
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!signRes.ok) throw new Error("Upload signing failed");
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
      if (!uploadRes.ok) throw new Error("Upload failed");
      const result = await uploadRes.json();
      onUploaded({
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
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
        }}
      />
    </label>
  );
}
