"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import {
  Field,
  ImageField,
  LocalizedInput,
  SaveBar,
  SectionCard,
  TextInput,
  emptyLocalized,
  inputClassName,
} from "@/components/admin/fields";
import type { PageSeo, SeoFields } from "@/types/cms";
import { useState } from "react";

const PAGE_OPTIONS = [
  { key: "home", label: "Home" },
  { key: "portfolio", label: "Portfolio" },
  { key: "services", label: "Services" },
  { key: "contact", label: "Contact" },
];

const emptySeo = (): SeoFields => ({
  title: emptyLocalized(),
  description: emptyLocalized(),
  keywords: emptyLocalized(),
  ogTitle: emptyLocalized(),
  ogDescription: emptyLocalized(),
  ogImage: null,
  canonicalPath: "",
  robots: "index,follow",
});

export function SeoForm({ initialPages = [] }: { initialPages?: PageSeo[] }) {
  const { getToken } = useAdminAuth();
  const [pageKey, setPageKey] = useState(initialPages[0]?.pageKey || "home");
  const [seo, setSeo] = useState<SeoFields>(
    initialPages.find((p) => p.pageKey === pageKey)?.seo ?? emptySeo(),
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  function switchPage(key: string) {
    setPageKey(key);
    const existing = initialPages.find((p) => p.pageKey === key);
    setSeo(existing?.seo ?? emptySeo());
    setStatus(null);
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/collection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "upsert",
          collection: "seoPages",
          id: pageKey,
          data: { pageKey, seo },
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatus("Saved");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-space-lg pb-24">
      <header>
        <h1 className="text-2xl font-semibold uppercase tracking-wide">SEO</h1>
        <p className="mt-2 text-sm text-tertiary">
          Titles and descriptions for search engines and social sharing.
        </p>
      </header>

      <Field label="Page">
        <select
          value={pageKey}
          onChange={(e) => switchPage(e.target.value)}
          className={inputClassName}
        >
          {PAGE_OPTIONS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>

      <SectionCard title="Search listing">
        <LocalizedInput
          label="Title"
          value={seo.title ?? emptyLocalized()}
          onChange={(title) => setSeo({ ...seo, title })}
        />
        <LocalizedInput
          label="Description"
          value={seo.description ?? emptyLocalized()}
          onChange={(description) => setSeo({ ...seo, description })}
          multiline
        />
        <LocalizedInput
          label="Keywords"
          value={seo.keywords ?? emptyLocalized()}
          onChange={(keywords) => setSeo({ ...seo, keywords })}
          hint="Comma-separated"
        />
        <Field label="Canonical path" hint="Optional, e.g. /en/portfolio">
          <TextInput
            value={seo.canonicalPath ?? ""}
            onChange={(canonicalPath) => setSeo({ ...seo, canonicalPath })}
          />
        </Field>
        <Field label="Robots">
          <select
            value={seo.robots ?? "index,follow"}
            onChange={(e) =>
              setSeo({
                ...seo,
                robots: e.target.value as SeoFields["robots"],
              })
            }
            className={inputClassName}
          >
            <option value="index,follow">Index & follow</option>
            <option value="noindex,nofollow">No index</option>
          </select>
        </Field>
      </SectionCard>

      <SectionCard title="Social share (Open Graph)">
        <LocalizedInput
          label="OG title"
          value={seo.ogTitle ?? emptyLocalized()}
          onChange={(ogTitle) => setSeo({ ...seo, ogTitle })}
        />
        <LocalizedInput
          label="OG description"
          value={seo.ogDescription ?? emptyLocalized()}
          onChange={(ogDescription) => setSeo({ ...seo, ogDescription })}
          multiline
        />
        <ImageField
          label="OG image"
          value={seo.ogImage}
          onChange={(ogImage) => setSeo({ ...seo, ogImage })}
        />
      </SectionCard>

      <SaveBar onSave={() => void save()} saving={saving} status={status} />
    </div>
  );
}
