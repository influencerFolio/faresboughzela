import { SectionReveal } from "@/components/ui/SectionReveal";
import { pickLocalized } from "@/lib/data/defaults";
import type { HomepageSettings, Locale } from "@/types/cms";

export function WhyWorkSection({
  homepage,
  locale,
}: {
  homepage: HomepageSettings;
  locale: Locale;
}) {
  return (
    <SectionReveal
      id="why-work-with-me"
      className="relative w-full bg-surface-container-lowest py-space-2xl"
    >
      <div className="mx-auto max-w-7xl px-gutter lg:px-gutter-lg">
        <div className="mb-space-xl text-center">
          <h2 className="font-[family-name:var(--font-headline)] text-3xl uppercase text-on-surface md:text-5xl">
            {locale === "fr" ? "Pourquoi les marques choisissent Fares" : "Why Brands Choose Fares"}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
          {homepage.whyWorkPillars.map((pillar) => (
            <div
              key={pillar.id}
              className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-space-lg"
            >
              <span className="font-[family-name:var(--font-headline)] text-3xl text-primary-container">
                {pillar.number}
              </span>
              <h3 className="mt-space-sm font-medium uppercase tracking-wider text-on-surface">
                {pickLocalized(pillar.title, locale)}
              </h3>
              <p className="mt-2 text-sm text-tertiary">
                {pickLocalized(pillar.description, locale)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-space-xl rounded-xl border border-outline-variant/20 bg-surface-container-low p-space-lg">
          <div className="flex flex-col items-center justify-between gap-space-md md:flex-row">
            <div>
              <p className="label-caps text-secondary">
                {locale === "fr" ? "Croissance cumulative" : "Cumulative Data Growth"}
              </p>
              <p className="font-[family-name:var(--font-headline)] text-4xl text-on-surface">
                80%{" "}
                <span className="text-lg text-secondary">
                  {locale === "fr" ? "CROISSANCE" : "GROWTH"}
                </span>
              </p>
            </div>
            <svg viewBox="0 0 240 80" className="h-20 w-full max-w-xs text-primary-container" aria-hidden>
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                points="0,70 40,55 80,58 120,40 160,35 200,20 240,10"
              />
            </svg>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
