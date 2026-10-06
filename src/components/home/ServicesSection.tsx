import { CmsImage } from "@/components/ui/CmsImage";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { pickLocalized } from "@/lib/data/defaults";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { GeneralSettings, HomepageSettings, Locale, ServiceItem } from "@/types/cms";
import { Link } from "@/i18n/navigation";

export function ServicesSection({
  homepage,
  settings,
  services,
  locale,
}: {
  homepage: HomepageSettings;
  settings: GeneralSettings;
  services: ServiceItem[];
  locale: Locale;
}) {
  return (
    <SectionReveal id="services" className="relative w-full bg-surface py-space-2xl">
      <div className="mx-auto max-w-7xl px-gutter lg:px-gutter-lg">
        <div className="mb-space-xl text-center">
          <span className="label-caps text-secondary">
            {locale === "fr" ? "Services & partenariats" : "Services & Brand Collaboration"}
          </span>
          <h2 className="font-[family-name:var(--font-headline)] text-3xl uppercase text-on-surface md:text-5xl">
            {locale === "fr" ? "Partenaires océan" : "Partner With an Ocean Athlete"}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
          {homepage.collaborationCards.map((card) => {
            const wa = buildWhatsAppUrl(
              settings.whatsappNumber,
              card.whatsappTemplateKey as Parameters<typeof buildWhatsAppUrl>[1],
              {},
              locale,
            );
            return (
              <div
                key={card.id}
                className="flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-low p-space-lg shadow-sm"
              >
                <span className="material-symbols-outlined text-primary">{card.icon}</span>
                <h3 className="mt-space-md font-medium uppercase tracking-wider text-on-surface">
                  {pickLocalized(card.title, locale)}
                </h3>
                <p className="mt-2 flex-1 text-sm text-tertiary">
                  {pickLocalized(card.description, locale)}
                </p>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-space-md inline-flex items-center gap-1 text-sm uppercase tracking-wider text-secondary hover:text-on-surface"
                >
                  {locale === "fr" ? "Demander un devis" : "Request Quote"}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            );
          })}
        </div>

        {services.length ? (
          <div className="mt-space-2xl">
            <div className="mb-space-lg flex flex-col items-start justify-between gap-space-md md:flex-row md:items-end">
              <div>
                <span className="label-caps text-primary">
                  {locale === "fr" ? "Formations" : "Training"}
                </span>
                <h3 className="font-[family-name:var(--font-headline)] text-2xl uppercase text-on-surface md:text-4xl">
                  {locale === "fr" ? "Programmes de formation" : "Training Programs"}
                </h3>
              </div>
              <Link
                href="/services"
                className="text-sm uppercase tracking-wider text-primary-container hover:text-on-surface"
              >
                {locale === "fr" ? "Tous les services" : "All Services"}
              </Link>
            </div>

            <div className="grid gap-gutter md:grid-cols-2">
              {services.slice(0, 2).map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low transition hover:border-primary-container/50 hover:shadow-[0_0_28px_rgba(225,29,72,0.12)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-highest">
                    {service.cover ? (
                      <CmsImage
                        asset={service.cover}
                        locale={locale}
                        fill
                        sizes="(max-width:768px) 100vw, 50vw"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary-container/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">
                        {pickLocalized(service.level, locale)}
                      </span>
                      <span className="rounded-full bg-surface-container-highest/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface">
                        {pickLocalized(service.duration, locale)}
                      </span>
                    </div>
                  </div>
                  <div className="p-space-lg">
                    <h4 className="font-[family-name:var(--font-headline)] text-xl uppercase text-on-surface">
                      {pickLocalized(service.name, locale)}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-tertiary">
                      {pickLocalized(service.shortDescription, locale)}
                    </p>
                    <span className="mt-space-md inline-flex items-center gap-1 text-sm uppercase tracking-wider text-secondary">
                      {locale === "fr" ? "Voir le programme" : "View Program"}
                      <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </SectionReveal>
  );
}
