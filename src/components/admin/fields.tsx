"use client";

import { CloudinaryUploadButton } from "@/components/admin/CloudinaryUploadButton";
import type { CloudinaryAsset, LocalizedString } from "@/types/cms";
import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="label-caps text-tertiary">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-tertiary/80">{hint}</span> : null}
    </label>
  );
}

export const inputClassName =
  "w-full rounded-lg bg-surface-container-highest px-3 py-2 text-sm text-on-surface outline-none ring-primary-container/40 focus:ring-2";

export const textareaClassName =
  "w-full min-h-[96px] rounded-lg bg-surface-container-highest px-3 py-2 text-sm text-on-surface outline-none ring-primary-container/40 focus:ring-2";

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClassName}
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className={textareaClassName}
    />
  );
}

export function LocalizedInput({
  label,
  value,
  onChange,
  multiline = false,
  hint,
}: {
  label: string;
  value: LocalizedString;
  onChange: (value: LocalizedString) => void;
  multiline?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-outline-variant/20 bg-surface-container-low p-space-md">
      <p className="label-caps text-on-surface">{label}</p>
      {hint ? <p className="text-xs text-tertiary">{hint}</p> : null}
      <div className="grid gap-space-md md:grid-cols-2">
        <Field label="English">
          {multiline ? (
            <TextArea
              value={value?.en ?? ""}
              onChange={(en) => onChange({ ...value, en })}
            />
          ) : (
            <TextInput
              value={value?.en ?? ""}
              onChange={(en) => onChange({ ...value, en })}
            />
          )}
        </Field>
        <Field label="Français">
          {multiline ? (
            <TextArea
              value={value?.fr ?? ""}
              onChange={(fr) => onChange({ ...value, fr })}
            />
          ) : (
            <TextInput
              value={value?.fr ?? ""}
              onChange={(fr) => onChange({ ...value, fr })}
            />
          )}
        </Field>
      </div>
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-space-md">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-4 accent-primary-container"
      />
      <span>
        <span className="block text-sm font-medium text-on-surface">{label}</span>
        {hint ? <span className="mt-1 block text-xs text-tertiary">{hint}</span> : null}
      </span>
    </label>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value?: CloudinaryAsset | null;
  onChange: (value: CloudinaryAsset | null) => void;
  hint?: string;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-outline-variant/20 bg-surface-container-low p-space-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="label-caps text-on-surface">{label}</p>
          {hint ? <p className="mt-1 text-xs text-tertiary">{hint}</p> : null}
        </div>
        <div className="flex gap-2">
          <CloudinaryUploadButton
            onUploaded={(asset) =>
              onChange({
                ...(value ?? {}),
                ...asset,
                alt: value?.alt ?? { en: "", fr: "" },
              })
            }
          />
          {value?.url ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="rounded-lg border border-outline-variant/40 px-3 py-2 text-sm text-tertiary"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {value?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value.url}
          alt={value.alt?.en || label}
          className="mt-2 max-h-48 rounded-lg object-cover"
        />
      ) : (
        <p className="text-sm text-tertiary">No image yet — upload one.</p>
      )}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-space-md rounded-2xl border border-outline-variant/20 bg-surface-container p-space-lg">
      <div>
        <h2 className="text-lg font-semibold uppercase tracking-wide">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-tertiary">{description}</p>
        ) : null}
      </div>
      <div className="space-y-space-md">{children}</div>
    </section>
  );
}

export function SaveBar({
  onSave,
  saving,
  status,
  extra,
}: {
  onSave: () => void;
  saving?: boolean;
  status?: string | null;
  extra?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-space-xl border-t border-outline-variant/20 bg-surface/95 px-space-xl py-space-md backdrop-blur">
      <div className="flex flex-wrap items-center gap-space-md">
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="rounded-lg bg-primary-container px-space-lg py-2 text-sm uppercase text-on-primary-container disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {extra}
        {status ? <p className="text-sm text-secondary">{status}</p> : null}
      </div>
    </div>
  );
}

export function emptyLocalized(): LocalizedString {
  return { en: "", fr: "" };
}
