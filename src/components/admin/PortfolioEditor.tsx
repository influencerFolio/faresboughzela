"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import {
  Field,
  ImageField,
  LocalizedInput,
  SaveBar,
  SectionCard,
  TextInput,
  Toggle,
  emptyLocalized,
  inputClassName,
} from "@/components/admin/fields";
import type { PortfolioCategory, PortfolioItem } from "@/types/cms";
import { useMemo, useState } from "react";

const CATEGORIES: PortfolioCategory[] = [
  "spearfishing",
  "gear",
  "exploration",
  "collaborations",
];

function blankItem(order: number): PortfolioItem {
  return {
    id: `item-${Date.now()}`,
    slug: "new-item",
    title: emptyLocalized(),
    description: emptyLocalized(),
    category: "spearfishing",
    cover: { publicId: "", url: "" },
    featured: false,
    order,
    published: false,
  };
}

export function PortfolioEditor({ items: initialItems }: { items: PortfolioItem[] }) {
  const { getToken } = useAdminAuth();
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(initialItems[0]?.id ?? "");
  const [draft, setDraft] = useState<PortfolioItem>(
    initialItems[0] ?? blankItem(initialItems.length),
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const selectedLabel = useMemo(
    () => draft.title?.en || draft.slug || draft.id,
    [draft],
  );

  function select(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setSelectedId(id);
    setDraft(item);
    setStatus(null);
  }

  function createNew() {
    const item = blankItem(items.length);
    setItems((prev) => [...prev, item]);
    setSelectedId(item.id);
    setDraft(item);
    setStatus("New item — fill fields and save");
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const id = draft.id || selectedId || `item-${Date.now()}`;
      const slug =
        draft.slug?.trim() ||
        (draft.title.en || "item")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      const payload: PortfolioItem = { ...draft, id, slug };
      const token = await getToken();
      const res = await fetch("/api/admin/collection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "upsert",
          collection: "portfolio",
          id,
          data: payload,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setItems((prev) => {
        const exists = prev.some((i) => i.id === id);
        return exists
          ? prev.map((i) => (i.id === id ? payload : i))
          : [...prev, payload];
      });
      setDraft(payload);
      setSelectedId(id);
      setStatus("Saved");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selectedId) return;
    if (!confirm(`Delete “${selectedLabel}”?`)) return;
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
          action: "delete",
          collection: "portfolio",
          id: selectedId,
        }),
      });
      if (!res.ok) throw new Error("Delete failed");
      const next = items.filter((i) => i.id !== selectedId);
      setItems(next);
      if (next[0]) {
        setSelectedId(next[0].id);
        setDraft(next[0]);
      } else {
        const blank = blankItem(0);
        setSelectedId(blank.id);
        setDraft(blank);
      }
      setStatus("Deleted");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-space-lg pb-24">
      <header>
        <h1 className="text-2xl font-semibold uppercase tracking-wide">Portfolio</h1>
        <p className="mt-2 text-sm text-tertiary">
          Add photos and projects. Upload a cover, fill EN/FR text, then save.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => select(item.id)}
            className={`rounded-lg px-3 py-2 text-xs uppercase ${
              selectedId === item.id
                ? "bg-primary-container text-on-primary-container"
                : "bg-surface-container-high text-tertiary"
            }`}
          >
            {item.title?.en || item.slug || item.id}
            {!item.published ? " · draft" : ""}
          </button>
        ))}
        <button
          type="button"
          onClick={createNew}
          className="rounded-lg bg-secondary-container px-3 py-2 text-xs uppercase text-on-secondary-container"
        >
          + New project
        </button>
      </div>

      <SectionCard title="Project details" description={`Editing: ${selectedLabel}`}>
        <div className="grid gap-space-md md:grid-cols-2">
          <Field label="URL slug" hint="Used in links, e.g. red-sea-dive">
            <TextInput
              value={draft.slug}
              onChange={(slug) => setDraft({ ...draft, slug })}
            />
          </Field>
          <Field label="Category">
            <select
              value={draft.category}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  category: e.target.value as PortfolioCategory,
                })
              }
              className={inputClassName}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Order">
            <TextInput
              type="number"
              value={String(draft.order ?? 0)}
              onChange={(order) => setDraft({ ...draft, order: Number(order) || 0 })}
            />
          </Field>
        </div>
        <LocalizedInput
          label="Title"
          value={draft.title}
          onChange={(title) => setDraft({ ...draft, title })}
        />
        <LocalizedInput
          label="Description"
          value={draft.description}
          onChange={(description) => setDraft({ ...draft, description })}
          multiline
        />
        <LocalizedInput
          label="Badge (optional)"
          value={draft.badge ?? emptyLocalized()}
          onChange={(badge) => setDraft({ ...draft, badge })}
        />
        <LocalizedInput
          label="Metrics (optional)"
          value={draft.metrics ?? emptyLocalized()}
          onChange={(metrics) => setDraft({ ...draft, metrics })}
        />
        <ImageField
          label="Cover image"
          value={draft.cover}
          onChange={(cover) =>
            setDraft({
              ...draft,
              cover: cover ?? { publicId: "", url: "" },
            })
          }
        />
        <div className="grid gap-space-md md:grid-cols-2">
          <Toggle
            label="Published"
            hint="Show this project on the public site"
            checked={draft.published}
            onChange={(published) => setDraft({ ...draft, published })}
          />
          <Toggle
            label="Featured"
            hint="Highlight on the homepage portfolio section"
            checked={draft.featured}
            onChange={(featured) => setDraft({ ...draft, featured })}
          />
        </div>
      </SectionCard>

      <SaveBar
        onSave={() => void save()}
        saving={saving}
        status={status}
        extra={
          <button
            type="button"
            disabled={saving}
            onClick={() => void remove()}
            className="rounded-lg border border-outline-variant/40 px-4 py-2 text-sm uppercase"
          >
            Delete
          </button>
        }
      />
    </div>
  );
}
