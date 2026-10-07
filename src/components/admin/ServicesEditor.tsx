"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useAdminLoader } from "@/components/admin/useAdminLoader";
import {
  Field,
  ImageField,
  LocalizedInput,
  SaveBar,
  SectionCard,
  TextArea,
  TextInput,
  Toggle,
  emptyLocalized,
} from "@/components/admin/fields";
import type { LocalizedString, ServiceItem } from "@/types/cms";
import { useEffect, useMemo, useState } from "react";

function blankService(order: number): ServiceItem {
  return {
    id: `service-${Date.now()}`,
    slug: "new-service",
    name: emptyLocalized(),
    shortDescription: emptyLocalized(),
    fullDescription: emptyLocalized(),
    duration: emptyLocalized(),
    location: emptyLocalized(),
    priceDisplay: emptyLocalized(),
    priceContactOnly: true,
    level: emptyLocalized(),
    programSteps: [],
    included: [],
    notIncluded: [],
    requirements: [],
    availableDates: [],
    published: false,
    order,
    isTraining: true,
  };
}

function linesToLocalized(text: string): LocalizedString[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [en, fr] = line.split("|").map((p) => p.trim());
      return { en: en || "", fr: fr || en || "" };
    });
}

function localizedToLines(items: LocalizedString[]): string {
  return items
    .map((item) =>
      item.fr && item.fr !== item.en ? `${item.en} | ${item.fr}` : item.en,
    )
    .join("\n");
}

export function ServicesEditor({
  items: initialItems = [],
}: {
  items?: ServiceItem[];
}) {
  const { getToken } = useAdminAuth();
  const {
    data: items,
    setData: setItems,
    loading,
    error,
  } = useAdminLoader<ServiceItem[]>(
    "/api/admin/collection?collection=services",
    initialItems,
  );
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState<ServiceItem>(blankService(0));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!items.length) return;
    if (selectedId && items.some((i) => i.id === selectedId)) return;
    setSelectedId(items[0].id);
    setDraft(items[0]);
  }, [items, selectedId]);

  const selectedLabel = useMemo(
    () => draft.name?.en || draft.slug || draft.id,
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
    const item = blankService(items.length);
    setItems((prev) => [...prev, item]);
    setSelectedId(item.id);
    setDraft(item);
    setStatus("New service — fill fields and save");
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const id = draft.id || selectedId || `service-${Date.now()}`;
      const slug =
        draft.slug?.trim() ||
        (draft.name.en || "service")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      const payload: ServiceItem = { ...draft, id, slug };
      const token = await getToken();
      const res = await fetch("/api/admin/collection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "upsert",
          collection: "services",
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
          collection: "services",
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
        const blank = blankService(0);
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

  if (loading) {
    return <p className="text-sm text-tertiary">Loading services…</p>;
  }

  return (
    <div className="space-y-space-lg pb-24">
      <header>
        <h1 className="text-2xl font-semibold uppercase tracking-wide">
          Services & Training
        </h1>
        <p className="mt-2 text-sm text-tertiary">
          Manage offerings and training programs with simple fields — no JSON.
        </p>
        {error ? <p className="mt-2 text-sm text-primary-container">{error}</p> : null}
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
            {item.name?.en || item.slug || item.id}
            {!item.published ? " · draft" : ""}
          </button>
        ))}
        <button
          type="button"
          onClick={createNew}
          className="rounded-lg bg-secondary-container px-3 py-2 text-xs uppercase text-on-secondary-container"
        >
          + New service
        </button>
      </div>

      <SectionCard title="Basics" description={`Editing: ${selectedLabel}`}>
        <div className="grid gap-space-md md:grid-cols-2">
          <Field label="URL slug">
            <TextInput
              value={draft.slug}
              onChange={(slug) => setDraft({ ...draft, slug })}
            />
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
          label="Name"
          value={draft.name}
          onChange={(name) => setDraft({ ...draft, name })}
        />
        <LocalizedInput
          label="Short description"
          value={draft.shortDescription}
          onChange={(shortDescription) => setDraft({ ...draft, shortDescription })}
          multiline
        />
        <LocalizedInput
          label="Full description"
          value={draft.fullDescription}
          onChange={(fullDescription) => setDraft({ ...draft, fullDescription })}
          multiline
        />
        <ImageField
          label="Cover image"
          value={draft.cover}
          onChange={(cover) => setDraft({ ...draft, cover })}
        />
      </SectionCard>

      <SectionCard title="Details">
        <LocalizedInput
          label="Duration"
          value={draft.duration}
          onChange={(duration) => setDraft({ ...draft, duration })}
        />
        <LocalizedInput
          label="Location"
          value={draft.location}
          onChange={(location) => setDraft({ ...draft, location })}
        />
        <LocalizedInput
          label="Level"
          value={draft.level}
          onChange={(level) => setDraft({ ...draft, level })}
        />
        <LocalizedInput
          label="Price display"
          value={draft.priceDisplay}
          onChange={(priceDisplay) => setDraft({ ...draft, priceDisplay })}
        />
        <Field label="Max participants">
          <TextInput
            type="number"
            value={String(draft.maxParticipants ?? "")}
            onChange={(v) =>
              setDraft({
                ...draft,
                maxParticipants: v ? Number(v) : undefined,
              })
            }
          />
        </Field>
        <Field
          label="Available dates"
          hint="One date per line (YYYY-MM-DD or free text)"
        >
          <TextArea
            value={(draft.availableDates ?? []).join("\n")}
            onChange={(text) =>
              setDraft({
                ...draft,
                availableDates: text
                  .split("\n")
                  .map((l) => l.trim())
                  .filter(Boolean),
              })
            }
          />
        </Field>
        <div className="grid gap-space-md md:grid-cols-2">
          <Toggle
            label="Published"
            checked={draft.published}
            onChange={(published) => setDraft({ ...draft, published })}
          />
          <Toggle
            label="Training program"
            hint="Shows registration form on the public page"
            checked={draft.isTraining}
            onChange={(isTraining) => setDraft({ ...draft, isTraining })}
          />
          <Toggle
            label="Price contact only"
            checked={draft.priceContactOnly}
            onChange={(priceContactOnly) => setDraft({ ...draft, priceContactOnly })}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Lists"
        description="One item per line. Optional FR: English | Français"
      >
        <Field label="Included">
          <TextArea
            value={localizedToLines(draft.included ?? [])}
            onChange={(text) => setDraft({ ...draft, included: linesToLocalized(text) })}
          />
        </Field>
        <Field label="Not included">
          <TextArea
            value={localizedToLines(draft.notIncluded ?? [])}
            onChange={(text) =>
              setDraft({ ...draft, notIncluded: linesToLocalized(text) })
            }
          />
        </Field>
        <Field label="Requirements">
          <TextArea
            value={localizedToLines(draft.requirements ?? [])}
            onChange={(text) =>
              setDraft({ ...draft, requirements: linesToLocalized(text) })
            }
          />
        </Field>
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
