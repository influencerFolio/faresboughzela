"use client";

import { CmsImage } from "@/components/ui/CmsImage";
import { pickLocalized } from "@/lib/data/defaults";
import type { Locale, PortfolioCategory, PortfolioItem } from "@/types/cms";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const filters: { key: PortfolioCategory; labelEn: string; labelFr: string }[] = [
  { key: "all", labelEn: "All Works", labelFr: "Tous les projets" },
  { key: "spearfishing", labelEn: "Spearfishing Action", labelFr: "Action" },
  { key: "gear", labelEn: "Products & Gear", labelFr: "Équipement" },
  { key: "exploration", labelEn: "Ocean Exploration", labelFr: "Exploration" },
  { key: "collaborations", labelEn: "Brand Collaborations", labelFr: "Collaborations" },
];

export function PortfolioGrid({
  items,
  locale,
  compact,
}: {
  items: PortfolioItem[];
  locale: Locale;
  compact?: boolean;
}) {
  const t = useTranslations("common");
  const [filter, setFilter] = useState<PortfolioCategory>("all");
  const [modal, setModal] = useState<PortfolioItem | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.category === filter);
  }, [filter, items]);

  if (!items.length) {
    return (
      <p className="text-center text-tertiary">{t("emptyPortfolio")}</p>
    );
  }

  return (
    <>
      <div className="mb-space-xl flex flex-wrap gap-space-xs">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-lg px-space-md py-1.5 text-[13px] uppercase tracking-wider transition ${
              filter === f.key
                ? "bg-primary-container text-on-primary-container"
                : "bg-surface-container-high text-tertiary hover:text-on-surface"
            }`}
          >
            {locale === "fr" ? f.labelFr : f.labelEn}
          </button>
        ))}
      </div>

      <div
        className={`grid gap-gutter ${compact ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-12"}`}
      >
        {filtered.map((item, index) => (
          <article
            key={item.id}
            className={`group relative overflow-hidden rounded-xl bg-surface-container-low ${
              compact
                ? ""
                : index % 3 === 0
                  ? "md:col-span-8"
                  : index % 3 === 1
                    ? "md:col-span-4 md:row-span-2"
                    : "md:col-span-8"
            }`}
          >
            <button
              type="button"
              className="relative block aspect-[16/10] w-full text-left md:aspect-auto md:min-h-[280px]"
              onClick={() => setModal(item)}
            >
              <CmsImage asset={item.cover} locale={locale} fill sizes="(max-width:768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 p-space-md">
                {item.badge ? (
                  <span className="label-caps mb-2 inline-block rounded bg-primary-container/90 px-2 py-0.5 text-on-primary-container">
                    {pickLocalized(item.badge, locale)}
                  </span>
                ) : null}
                <h3 className="font-[family-name:var(--font-headline)] text-lg uppercase text-on-surface md:text-xl">
                  {pickLocalized(item.title, locale)}
                </h3>
              </div>
            </button>
          </article>
        ))}
      </div>

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-container-lowest/90 p-gutter backdrop-blur-xl">
          <div className="relative w-full max-w-3xl rounded-2xl bg-surface-container-low p-space-lg shadow-2xl">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-surface-container-highest p-1 text-tertiary hover:text-on-surface"
              onClick={() => setModal(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="relative h-72 overflow-hidden rounded-xl bg-surface-container-lowest">
              <CmsImage asset={modal.cover} locale={locale} fill />
            </div>
            <h3 className="mt-space-md font-[family-name:var(--font-headline)] text-xl uppercase text-on-surface">
              {pickLocalized(modal.title, locale)}
            </h3>
            <p className="mt-space-sm text-tertiary">
              {pickLocalized(modal.description, locale)}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
