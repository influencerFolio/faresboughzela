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
  inputClassName,
} from "@/components/admin/fields";
import { readApiError } from "@/lib/admin-api";
import { defaultGeneralSettings } from "@/lib/data/defaults";
import type { GeneralSettings, SocialPlatformId } from "@/types/cms";
import { useState } from "react";

const SOCIALS: { id: SocialPlatformId; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
  { id: "facebook", label: "Facebook" },
];

export function GeneralSettingsForm({
  initial = defaultGeneralSettings,
}: {
  initial?: GeneralSettings;
}) {
  const { getToken } = useAdminAuth();
  const { data, setData, loading, error } = useAdminLoader(
    "/api/admin/settings?doc=settings/general",
    initial,
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
        body: JSON.stringify({ doc: "settings/general", data }),
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
    return <p className="text-sm text-tertiary">Loading settings…</p>;
  }

  return (
    <div className="space-y-space-lg pb-24">
      <header>
        <h1 className="text-2xl font-semibold uppercase tracking-wide">
          General Settings
        </h1>
        <p className="mt-2 text-sm text-tertiary">
          Site identity, contact details, and social profiles shown across the site.
        </p>
        {error ? <p className="mt-2 text-sm text-primary-container">{error}</p> : null}
      </header>

      <SectionCard title="Brand" description="Name and tagline visitors see in the header and footer.">
        <LocalizedInput
          label="Site name"
          value={data.siteName}
          onChange={(siteName) => setData({ ...data, siteName })}
        />
        <LocalizedInput
          label="Tagline"
          value={data.tagline}
          onChange={(tagline) => setData({ ...data, tagline })}
        />
        <ImageField
          label="Logo"
          value={data.logo}
          onChange={(logo) => setData({ ...data, logo })}
        />
      </SectionCard>

      <SectionCard title="Contact" description="Used by forms, WhatsApp button, and footer.">
        <div className="grid gap-space-md md:grid-cols-2">
          <Field label="WhatsApp number" hint="Digits only, with country code (e.g. 216XXXXXXXX)">
            <TextInput
              value={data.whatsappNumber}
              onChange={(whatsappNumber) => setData({ ...data, whatsappNumber })}
              placeholder="216XXXXXXXX"
            />
          </Field>
          <Field label="Email">
            <TextInput
              type="email"
              value={data.email}
              onChange={(email) => setData({ ...data, email })}
            />
          </Field>
          <Field label="Phone">
            <TextInput
              value={data.phone}
              onChange={(phone) => setData({ ...data, phone })}
            />
          </Field>
          <Field label="Default language">
            <select
              value={data.defaultLocale}
              onChange={(e) =>
                setData({
                  ...data,
                  defaultLocale: e.target.value as "en" | "fr",
                })
              }
              className={inputClassName}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </Field>
        </div>
        <LocalizedInput
          label="Address / region"
          value={data.address}
          onChange={(address) => setData({ ...data, address })}
        />
      </SectionCard>

      <SectionCard title="Social media" description="Links and follower stats on the homepage.">
        {SOCIALS.map(({ id, label }) => {
          const platform = data.social?.[id] ?? {
            url: "",
            handle: "",
            followers: "",
            views: "",
          };
          return (
            <div
              key={id}
              className="grid gap-space-md rounded-xl border border-outline-variant/15 bg-surface-container-low p-space-md md:grid-cols-2"
            >
              <p className="label-caps text-on-surface md:col-span-2">{label}</p>
              <Field label="Profile URL">
                <TextInput
                  value={platform.url}
                  onChange={(url) =>
                    setData({
                      ...data,
                      social: { ...data.social, [id]: { ...platform, url } },
                    })
                  }
                />
              </Field>
              <Field label="Handle">
                <TextInput
                  value={platform.handle ?? ""}
                  onChange={(handle) =>
                    setData({
                      ...data,
                      social: { ...data.social, [id]: { ...platform, handle } },
                    })
                  }
                />
              </Field>
              <Field label="Followers">
                <TextInput
                  value={platform.followers}
                  onChange={(followers) =>
                    setData({
                      ...data,
                      social: {
                        ...data.social,
                        [id]: { ...platform, followers },
                      },
                    })
                  }
                  placeholder="185K"
                />
              </Field>
              <Field label="Views">
                <TextInput
                  value={platform.views}
                  onChange={(views) =>
                    setData({
                      ...data,
                      social: { ...data.social, [id]: { ...platform, views } },
                    })
                  }
                  placeholder="4.2M"
                />
              </Field>
            </div>
          );
        })}
      </SectionCard>

      <SaveBar onSave={() => void save()} saving={saving} status={status} />
    </div>
  );
}
