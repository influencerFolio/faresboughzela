"use client";

import { JsonEditorForm } from "@/components/admin/JsonEditorForm";

const template = {
  pageKey: "home",
  seo: {
    title: { en: "Fares Boughzala", fr: "Fares Boughzala" },
    description: {
      en: "Spearfishing athlete portfolio",
      fr: "Portfolio athlète pêche sous-marine",
    },
    robots: "index,follow",
  },
};

export function SeoAdmin() {
  return (
    <JsonEditorForm
      title="SEO Pages"
      initialValue={template}
      onSave={async (data, token) => {
        const parsed = data as { pageKey: string; seo: object };
        const res = await fetch("/api/admin/collection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action: "upsert",
            collection: "seoPages",
            id: parsed.pageKey,
            data: parsed,
          }),
        });
        if (!res.ok) throw new Error("Save failed");
      }}
    />
  );
}
