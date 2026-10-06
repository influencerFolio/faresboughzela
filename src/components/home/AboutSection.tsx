import { CmsImage } from "@/components/ui/CmsImage";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { pickLocalized } from "@/lib/data/defaults";
import type { AboutSettings, Locale } from "@/types/cms";
import { Link } from "@/i18n/navigation";

export function AboutSection({
  about,
  locale,
}: {
  about: AboutSettings;
  locale: Locale;
}) {
  return (
    <SectionReveal className="relative w-full bg-surface py-space-2xl" id="about">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-gutter-lg px-gutter lg:grid-cols-12 lg:px-gutter-lg">
        <div className="relative lg:col-span-5">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low">
            {about.portrait ? (
              <CmsImage asset={about.portrait} locale={locale} fill sizes="(max-width:1024px) 100vw, 40vw" />
            ) : null}
          </div>
        </div>
        <div className="lg:col-span-7">
          <h2 className="font-[family-name:var(--font-headline)] text-2xl uppercase tracking-wide text-on-surface md:text-4xl">
            {pickLocalized(about.headline, locale)}
          </h2>
          <p className="mt-space-md text-base leading-relaxed text-tertiary md:text-lg">
            {pickLocalized(about.body, locale)}
          </p>
          <div className="mt-space-xl grid grid-cols-1 gap-space-md sm:grid-cols-2">
            {about.highlights.map((h) => (
              <div
                key={h.id}
                className="rounded-lg border border-outline-variant/30 bg-surface-container-low p-space-md"
              >
                <span className="material-symbols-outlined text-primary">{h.icon}</span>
                <h3 className="mt-2 font-medium uppercase tracking-wider text-on-surface">
                  {pickLocalized(h.title, locale)}
                </h3>
                <p className="mt-1 text-sm text-tertiary">
                  {pickLocalized(h.description, locale)}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/contact"
            className="mt-space-xl inline-flex rounded-lg bg-primary-container px-space-xl py-space-sm font-medium uppercase tracking-wider text-on-primary-container transition hover:bg-inverse-primary"
          >
            {locale === "fr" ? "Travailler avec Fares" : "Work With Fares"}
          </Link>
        </div>
      </div>
    </SectionReveal>
  );
}
