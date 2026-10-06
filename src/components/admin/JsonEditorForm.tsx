"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useState } from "react";

export function JsonEditorForm({
  title,
  initialValue,
  onSave,
}: {
  title: string;
  initialValue: object;
  onSave: (data: object, token: string) => Promise<void>;
}) {
  const { getToken } = useAdminAuth();
  const [value, setValue] = useState(JSON.stringify(initialValue, null, 2));
  const [status, setStatus] = useState<string | null>(null);

  async function handleSave() {
    setStatus(null);
    try {
      const parsed = JSON.parse(value) as object;
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      await onSave(parsed, token);
      setStatus("Saved");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold uppercase tracking-wide">{title}</h1>
      <p className="mt-2 text-sm text-tertiary">
        Edit structured content (EN/FR fields). Invalid JSON will be rejected.
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-space-md h-[60vh] w-full rounded-lg bg-surface-container-low p-space-md font-mono text-sm text-on-surface"
      />
      <button
        type="button"
        onClick={handleSave}
        className="mt-space-md rounded-lg bg-primary-container px-space-lg py-2 text-sm uppercase text-on-primary-container"
      >
        Save
      </button>
      {status ? <p className="mt-2 text-sm text-secondary">{status}</p> : null}
    </div>
  );
}
