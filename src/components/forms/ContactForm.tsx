"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export function ContactForm({ locale }: { locale: "en" | "fr" }) {
  const t = useTranslations("form");
  const tContact = useTranslations("contact");
  const tCommon = useTranslations("common");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });
      if (res.status === 503) {
        setStatus("error");
        return;
      }
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
        <Field label={`${t("name")} *`} name="name" required />
        <Field label={`${t("company")} *`} name="company" required />
      </div>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <Field label={`${t("email")} *`} name="email" type="email" required />
        <Field label={t("phone")} name="phone" type="tel" />
      </div>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <div>
          <label className="label-caps mb-1 block text-tertiary">{t("collaborationType")} *</label>
          <select
            name="collaborationType"
            required
            className="w-full rounded-lg bg-surface-container-highest px-space-md py-space-sm text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option>Brand Sponsorship</option>
            <option>Product Review & Field Test</option>
            <option>Custom Underwater Content Production</option>
            <option>Social Media Campaign</option>
            <option>Expedition Partner</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="label-caps mb-1 block text-tertiary">{t("budget")}</label>
          <select
            name="budget"
            className="w-full rounded-lg bg-surface-container-highest px-space-md py-space-sm text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">&mdash;</option>
            <option>Under $5K</option>
            <option>$5K - $15K</option>
            <option>$15K - $35K</option>
            <option>$35K+</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label-caps mb-1 block text-tertiary">{t("message")} *</label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full rounded-lg bg-surface-container-highest px-space-md py-space-sm text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-space-xl py-space-sm font-medium uppercase tracking-wider text-on-primary-container shadow-[0_0_20px_rgba(225,29,72,0.4)] transition hover:bg-inverse-primary disabled:opacity-60"
      >
        {tCommon("submitProposal")}
        <span className="material-symbols-outlined text-[18px]">send</span>
      </button>
      {status === "success" ? (
        <p className="rounded-lg bg-secondary-container p-space-md text-center text-sm text-on-secondary-container">
          {tContact("success")}
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
        className="w-full rounded-lg bg-surface-container-highest px-space-md py-space-sm text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
