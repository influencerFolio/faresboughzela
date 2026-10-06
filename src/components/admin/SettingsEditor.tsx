"use client";

import { JsonEditorForm } from "@/components/admin/JsonEditorForm";

export function SettingsEditor({
  doc,
  title,
  initial,
}: {
  doc: string;
  title: string;
  initial: object;
}) {
  return (
    <JsonEditorForm
      title={title}
      initialValue={initial}
      onSave={async (data, token) => {
        const res = await fetch("/api/admin/settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ doc, data }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Save failed");
        }
      }}
    />
  );
}
