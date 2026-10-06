"use client";

import { CloudinaryUploadButton } from "@/components/admin/CloudinaryUploadButton";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { useMemo, useState } from "react";

type Item = { id: string } & Record<string, unknown>;

export function CollectionAdminPage({
  title,
  collection,
  items,
  emptyTemplate,
}: {
  title: string;
  collection: string;
  items: Item[];
  emptyTemplate: Record<string, unknown>;
}) {
  const { getToken } = useAdminAuth();
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
  const [draft, setDraft] = useState(
    JSON.stringify(items[0] ?? { id: "new-item", ...emptyTemplate }, null, 2),
  );
  const [status, setStatus] = useState<string | null>(null);

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId),
    [items, selectedId],
  );

  function selectItem(id: string) {
    setSelectedId(id);
    const item = items.find((i) => i.id === id);
    setDraft(JSON.stringify(item ?? { id, ...emptyTemplate }, null, 2));
  }

  async function save() {
    setStatus(null);
    const parsed = JSON.parse(draft) as Item;
    const id = parsed.id || selectedId || `item-${Date.now()}`;
    const token = await getToken();
    const res = await fetch("/api/admin/collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        action: "upsert",
        collection,
        id,
        data: { ...parsed, id },
      }),
    });
    setStatus(res.ok ? "Saved" : "Save failed");
  }

  async function remove() {
    if (!selectedId) return;
    const token = await getToken();
    await fetch("/api/admin/collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        action: "delete",
        collection,
        id: selectedId,
      }),
    });
    setStatus("Deleted (refresh to reload list)");
  }

  function applyUploaded(asset: {
    publicId: string;
    url: string;
    width?: number;
    height?: number;
    format?: string;
  }) {
    try {
      const parsed = JSON.parse(draft) as Record<string, unknown>;
      parsed.cover = asset;
      setDraft(JSON.stringify(parsed, null, 2));
    } catch {
      setStatus("Could not merge upload into JSON");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold uppercase">{title}</h1>
      <div className="mt-space-md flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectItem(item.id)}
            className={`rounded px-3 py-1 text-xs uppercase ${
              selectedId === item.id
                ? "bg-primary-container text-on-primary-container"
                : "bg-surface-container-high text-tertiary"
            }`}
          >
            {item.id}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            const id = `item-${Date.now()}`;
            selectItem(id);
          }}
          className="rounded bg-secondary-container px-3 py-1 text-xs uppercase text-on-secondary-container"
        >
          New
        </button>
      </div>
      <div className="mt-space-md flex items-center gap-space-md">
        <CloudinaryUploadButton onUploaded={applyUploaded} />
        {selected ? (
          <span className="text-xs text-tertiary">Editing {selected.id}</span>
        ) : null}
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="mt-space-md h-[55vh] w-full rounded-lg bg-surface-container-low p-space-md font-mono text-sm"
      />
      <div className="mt-space-md flex gap-space-md">
        <button
          type="button"
          onClick={() => void save()}
          className="rounded-lg bg-primary-container px-4 py-2 text-sm uppercase text-on-primary-container"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => void remove()}
          className="rounded-lg border border-outline-variant/40 px-4 py-2 text-sm uppercase"
        >
          Delete
        </button>
      </div>
      {status ? <p className="mt-2 text-sm text-secondary">{status}</p> : null}
    </div>
  );
}
