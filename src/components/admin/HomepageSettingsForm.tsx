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
} from "@/components/admin/fields";
import type {
  CollaborationCard,
  HomepageSettings,
  LocalizedString,
  StatItem,
  WhyWorkPillar,
} from "@/types/cms";
import { useState } from "react";

export function HomepageSettingsForm({ initial }: { initial: HomepageSettings }) {
  const { getToken } = useAdminAuth();
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const token = await getToken();
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ doc: "settings/homepage", data }),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatus("Saved");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function updatePill(index: number, value: LocalizedString) {
    const heroPills = [...data.heroPills];
    heroPills[index] = value;
    setData({ ...data, heroPills });
  }

  function updateStat(index: number, patch: Partial<StatItem>) {
    const stats = data.stats.map((s, i) => (i === index ? { ...s, ...patch } : s));
    setData({ ...data, stats });
  }

  function updateCard(index: number, patch: Partial<CollaborationCard>) {
    const collaborationCards = data.collaborationCards.map((c, i) =>
      i === index ? { ...c, ...patch } : c,
    );
    setData({ ...data, collaborationCards });
  }

  function updatePillar(index: number, patch: Partial<WhyWorkPillar>) {
    const whyWorkPillars = data.whyWorkPillars.map((p, i) =>
      i === index ? { ...p, ...patch } : p,
    );
    setData({ ...data, whyWorkPillars });
  }

  return (
    <div className="space-y-space-lg pb-24">
      <header>
        <h1 className="text-2xl font-semibold uppercase tracking-wide">Homepage</h1>
        <p className="mt-2 text-sm text-tertiary">
          Edit the hero, stats, collaboration cards, and why-work section.
        </p>
      </header>

      <SectionCard title="Hero" description="First thing visitors see on the homepage.">
        <LocalizedInput
          label="Badge"
          value={data.heroBadge}
          onChange={(heroBadge) => setData({ ...data, heroBadge })}
        />
        <LocalizedInput
          label="Title"
          value={data.heroTitle}
          onChange={(heroTitle) => setData({ ...data, heroTitle })}
        />
        <LocalizedInput
          label="Highlight (accent name)"
          value={data.heroHighlight}
          onChange={(heroHighlight) => setData({ ...data, heroHighlight })}
        />
        <LocalizedInput
          label="Description"
          value={data.heroDescription}
          onChange={(heroDescription) => setData({ ...data, heroDescription })}
          multiline
        />
        <LocalizedInput
          label="Primary button"
          value={data.ctaPrimary}
          onChange={(ctaPrimary) => setData({ ...data, ctaPrimary })}
        />
        <LocalizedInput
          label="Secondary button"
          value={data.ctaSecondary}
          onChange={(ctaSecondary) => setData({ ...data, ctaSecondary })}
        />
        <ImageField
          label="Hero image"
          value={data.heroImage}
          onChange={(heroImage) => setData({ ...data, heroImage })}
        />
        <Field label="Hero video URL (optional)">
          <TextInput
            value={data.heroVideoUrl ?? ""}
            onChange={(heroVideoUrl) => setData({ ...data, heroVideoUrl })}
            placeholder="https://..."
          />
        </Field>
        <Field label="Social handle shown on homepage">
          <TextInput
            value={data.socialHandle}
            onChange={(socialHandle) => setData({ ...data, socialHandle })}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Hero pills" description="Short labels under the hero description.">
        {data.heroPills.map((pill, index) => (
          <div key={index} className="space-y-2">
            <LocalizedInput
              label={`Pill ${index + 1}`}
              value={pill}
              onChange={(value) => updatePill(index, value)}
            />
            <button
              type="button"
              onClick={() =>
                setData({
                  ...data,
                  heroPills: data.heroPills.filter((_, i) => i !== index),
                })
              }
              className="text-xs text-primary-container"
            >
              Remove pill
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setData({ ...data, heroPills: [...data.heroPills, emptyLocalized()] })
          }
          className="rounded-lg border border-outline-variant/40 px-3 py-2 text-sm"
        >
          Add pill
        </button>
      </SectionCard>

      <SectionCard title="Stats bar">
        {data.stats.map((stat, index) => (
          <div
            key={stat.id}
            className="space-y-space-md rounded-xl border border-outline-variant/15 bg-surface-container-low p-space-md"
          >
            <div className="grid gap-space-md md:grid-cols-3">
              <Field label="Value">
                <TextInput
                  value={stat.value}
                  onChange={(value) => updateStat(index, { value })}
                />
              </Field>
              <Field label="Suffix">
                <TextInput
                  value={stat.suffix ?? ""}
                  onChange={(suffix) => updateStat(index, { suffix })}
                />
              </Field>
              <Field label="Accent">
                <select
                  value={stat.accent}
                  onChange={(e) =>
                    updateStat(index, {
                      accent: e.target.value as StatItem["accent"],
                    })
                  }
                  className="w-full rounded-lg bg-surface-container-highest px-3 py-2 text-sm"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="tertiary">Tertiary</option>
                </select>
              </Field>
            </div>
            <LocalizedInput
              label="Label"
              value={stat.label}
              onChange={(label) => updateStat(index, { label })}
            />
            <LocalizedInput
              label="Sublabel"
              value={stat.sublabel}
              onChange={(sublabel) => updateStat(index, { sublabel })}
            />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Collaboration cards">
        {data.collaborationCards.map((card, index) => (
          <div
            key={card.id}
            className="space-y-space-md rounded-xl border border-outline-variant/15 bg-surface-container-low p-space-md"
          >
            <Field label="Icon name (Material Symbol)">
              <TextInput
                value={card.icon}
                onChange={(icon) => updateCard(index, { icon })}
                placeholder="videocam"
              />
            </Field>
            <LocalizedInput
              label="Title"
              value={card.title}
              onChange={(title) => updateCard(index, { title })}
            />
            <LocalizedInput
              label="Description"
              value={card.description}
              onChange={(description) => updateCard(index, { description })}
              multiline
            />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Why work with me">
        {data.whyWorkPillars.map((pillar, index) => (
          <div
            key={pillar.id}
            className="space-y-space-md rounded-xl border border-outline-variant/15 bg-surface-container-low p-space-md"
          >
            <Field label="Number">
              <TextInput
                value={pillar.number}
                onChange={(number) => updatePillar(index, { number })}
              />
            </Field>
            <LocalizedInput
              label="Title"
              value={pillar.title}
              onChange={(title) => updatePillar(index, { title })}
            />
            <LocalizedInput
              label="Description"
              value={pillar.description}
              onChange={(description) => updatePillar(index, { description })}
              multiline
            />
          </div>
        ))}
      </SectionCard>

      <SaveBar onSave={() => void save()} saving={saving} status={status} />
    </div>
  );
}
