"use client";

import { pickLocalized } from "@/lib/data/defaults";
import type { Locale, ServiceItem } from "@/types/cms";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function RegistrationForm({
  locale,
  services,
  preselectedSlug,
}: {
  locale: Locale;
  services: ServiceItem[];
  preselectedSlug?: string;
}) {
  const t = useTranslations("form");
  const tContact = useTranslations("contact");
  const tCommon = useTranslations("common");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const trainingSlug = String(form.get("trainingSlug") || "");
    const training = services.find((s) => s.slug === trainingSlug);
    const payload = {
      ...Object.fromEntries(form.entries()),
      locale,
      trainingId: training?.id ?? "",
      trainingName: training?.name ?? { en: trainingSlug, fr: trainingSlug },
    };
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="space-y-space-md" onSubmit={onSubmit}>
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <Field label={`${t("fullName")} *`} name="fullName" required />
        <Field label={`${t("email")} *`} name="email" type="email" required />
      </div>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <Field label={`${t("phone")} *`} name="phone" required />
        <Field label={`${t("country")} *`} name="country" required />
      </div>
      <div>
        <label className="label-caps mb-1 block text-tertiary">{t("training")} *</label>
        <select
          name="trainingSlug"
          defaultValue={preselectedSlug ?? services[0]?.slug ?? ""}
          required
          className="w-full rounded-lg bg-surface-container-highest px-space-md py-space-sm text-sm text-on-surface"
        >
          {services.map((s) => (
            <option key={s.id} value={s.slug}>
              {pickLocalized(s.name, locale)}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <Field label={t("preferredDate")} name="preferredDate" />
        <Field label={`${t("participants")} *`} name="participants" type="number" required />
      </div>
      <Field label={`${t("experience")} *`} name="experienceLevel" required />
      <div>
        <label className="label-caps mb-1 block text-tertiary">{t("message")}</label>
        <textarea
          name="message"
          rows={3}
          className="w-full rounded-lg bg-surface-container-highest px-space-md py-space-sm text-sm text-on-surface"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-primary-container py-space-sm font-medium uppercase tracking-wider text-on-primary-container hover:bg-inverse-primary disabled:opacity-60"
      >
        {tCommon("sendRegistration")}
      </button>
      {status === "success" ? (
        <p className="rounded-lg bg-secondary-container p-space-md text-center text-sm text-on-secondary-container">
          {tContact("registrationSuccess")}
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-center text-sm text-primary-container">{tCommon("error")}</p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label-caps mb-1 block text-tertiary">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg bg-surface-container-highest px-space-md py-space-sm text-sm text-on-surface"
      />
    </div>
  );
}
