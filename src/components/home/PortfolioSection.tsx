import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { SectionReveal } from "@/components/ui/SectionReveal";
import type { Locale, PortfolioItem } from "@/types/cms";
import { Link } from "@/i18n/navigation";

export function PortfolioSection({
  items,
  locale,
}: {
  items: PortfolioItem[];
  locale: Locale;
}) {
  return (
    <SectionReveal
      id="portfolio"
      className="relative w-full bg-surface-container-lowest py-space-2xl"
    >
      <div className="mx-auto max-w-7xl px-gutter lg:px-gutter-lg">
        <div className="mb-space-xl flex flex-col items-start justify-between gap-space-md md:flex-row md:items-end">
          <div>
            <span className="label-caps text-primary">Portfolio</span>
            <h2 className="font-[family-name:var(--font-headline)] text-3xl uppercase text-on-surface md:text-5xl">
              {locale === "fr" ? "Travaux sélectionnés" : "Featured Works"}
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="text-sm uppercase tracking-wider text-secondary hover:text-on-surface"
          >
            {locale === "fr" ? "Voir tout" : "View All"}
          </Link>
        </div>
        <PortfolioGrid items={items.slice(0, 4)} locale={locale} compact />
      </div>
    </SectionReveal>
  );
}
