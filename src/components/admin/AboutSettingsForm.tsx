"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useAdminLoader } from "@/components/admin/useAdminLoader";
import {
  Field,
  ImageField,
  LocalizedInput,
  SaveBar,
  SectionCard,
  TextInput,
  emptyLocalized,
} from "@/components/admin/fields";
import { readApiError } from "@/lib/admin-api";
import { defaultAboutSettings } from "@/lib/data/defaults";
import type { AboutSettings } from "@/types/cms";
import { useState } from "react";

export function AboutSettingsForm({
  initial = defaultAboutSettings,
}: {
  initial?: AboutSettings;
}) {
  const { getToken } = useAdminAuth();
  const { data, setData, loading, error } = useAdminLoader(
    "/api/admin/settings?doc=settings/about",
    {
      ...initial,
      highlights: initial.highlights ?? [],
    },
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not logged in — sign in again.");
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doc: "settings/about", data }),
      });
      if (!res.ok) throw new Error(await readApiError(res, "Save failed"));
      setStatus("Saved");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-tertiary">Loading about…</p>;
  }

  return (
    <div className="space-y-space-lg pb-24">
      <header>
        <h1 className="text-2xl font-semibold uppercase tracking-wide">About</h1>
        <p className="mt-2 text-sm text-tertiary">
          Bio, portrait, and highlight cards on the about section.
        </p>
        {error ? <p className="mt-2 text-sm text-primary-container">{error}</p> : null}
      </header>

      <SectionCard title="Story">
        <LocalizedInput
          label="Headline"
          value={data.headline}
          onChange={(headline) => setData({ ...data, headline })}
        />
        <LocalizedInput
          label="Body"
          value={data.body}
          onChange={(body) => setData({ ...data, body })}
          multiline
        />
        <ImageField
          label="Portrait"
          value={data.portrait}
          onChange={(portrait) => setData({ ...data, portrait })}
        />
        <ImageField
          label="Signature (optional)"
          value={data.signature}
          onChange={(signature) => setData({ ...data, signature })}
        />
      </SectionCard>

      <SectionCard title="Highlights">
        {data.highlights.map((item, index) => (
          <div
            key={item.id}
            className="space-y-space-md rounded-xl border border-outline-variant/15 bg-surface-container-low p-space-md"
          >
            <div className="flex items-center justify-between gap-2">
              <Field label="Icon (Material Symbol)">
                <TextInput
                  value={item.icon}
                  onChange={(icon) => {
                    const highlights = data.highlights.map((h, i) =>
                      i === index ? { ...h, icon } : h,
                    );
                    setData({ ...data, highlights });
                  }}
                />
              </Field>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    highlights: data.highlights.filter((_, i) => i !== index),
                  })
                }
                className="text-xs text-primary-container"
              >
                Remove
              </button>
            </div>
            <LocalizedInput
              label="Title"
              value={item.title}
              onChange={(title) => {
                const highlights = data.highlights.map((h, i) =>
                  i === index ? { ...h, title } : h,
                );
                setData({ ...data, highlights });
              }}
            />
            <LocalizedInput
              label="Description"
              value={item.description}
              onChange={(description) => {
                const highlights = data.highlights.map((h, i) =>
                  i === index ? { ...h, description } : h,
                );
                setData({ ...data, highlights });
              }}
              multiline
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setData({
              ...data,
              highlights: [
                ...data.highlights,
                {
                  id: `highlight-${Date.now()}`,
                  icon: "star",
                  title: emptyLocalized(),
                  description: emptyLocalized(),
                },
              ],
            })
          }
          className="rounded-lg border border-outline-variant/40 px-3 py-2 text-sm"
        >
          Add highlight
        </button>
      </SectionCard>

      <SaveBar onSave={() => void save()} saving={saving} status={status} />
    </div>
  );
}
