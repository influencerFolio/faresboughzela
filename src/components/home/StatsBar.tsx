import { pickLocalized } from "@/lib/data/defaults";
import type { HomepageSettings, Locale } from "@/types/cms";

const accentMap = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary-fixed",
} as const;

export function StatsBar({
  homepage,
  locale,
}: {
  homepage: HomepageSettings;
  locale: Locale;
}) {
  return (
    <section className="w-full bg-surface-container-lowest py-space-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-gutter px-gutter md:grid-cols-4 lg:px-gutter-lg">
        {homepage.stats.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col rounded-lg bg-surface-container-low p-space-md shadow-sm"
          >
            <span className={`label-caps ${accentMap[stat.accent]}`}>
              {pickLocalized(stat.label, locale)}
            </span>
            <span className="mt-1 font-[family-name:var(--font-headline)] text-3xl font-semibold text-on-surface md:text-4xl">
              {stat.value}
              {stat.suffix ? (
                <span className={`text-xl ${accentMap[stat.accent]}`}>
                  {stat.suffix}
                </span>
              ) : null}
            </span>
            <span className="text-sm text-tertiary">
              {pickLocalized(stat.sublabel, locale)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
