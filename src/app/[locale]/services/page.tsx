import { CmsImage } from "@/components/ui/CmsImage";
import { pickLocalized } from "@/lib/data/defaults";
import { buildMetadata } from "@/lib/seo";
import { getPageSeo, getPublishedServices } from "@/lib/repositories/content";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getPageSeo("services");
  return buildMetadata(locale as "en" | "fr", seo?.seo, {
    title: "Services & Training | Fares Boughzala",
    description: "Spearfishing training programs and professional athlete services.",
    path: "/services",
  });
}

export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("servicesPage");
  const services = await getPublishedServices();
  const loc = locale as "en" | "fr";

  return (
    <section className="py-space-2xl">
      <div className="mx-auto max-w-7xl px-gutter lg:px-gutter-lg">
        <h1 className="font-[family-name:var(--font-headline)] text-4xl uppercase text-on-surface md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-space-sm max-w-2xl text-tertiary">{t("subtitle")}</p>
        <div className="mt-space-xl grid gap-gutter md:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low transition hover:border-primary-container/50 hover:shadow-[0_0_28px_rgba(225,29,72,0.12)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-highest">
                {service.cover ? (
                  <CmsImage
                    asset={service.cover}
                    locale={loc}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary-container/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">
                    {pickLocalized(service.level, loc)}
                  </span>
                  <span className="rounded-full bg-surface-container-highest/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface">
                    {pickLocalized(service.duration, loc)}
                  </span>
                </div>
              </div>
              <div className="p-space-lg">
                <h2 className="font-[family-name:var(--font-headline)] text-xl uppercase text-on-surface">
                  {pickLocalized(service.name, loc)}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-tertiary">
                  {pickLocalized(service.shortDescription, loc)}
                </p>
                <span className="mt-space-md inline-flex items-center gap-1 text-sm uppercase tracking-wider text-secondary">
                  {loc === "fr" ? "Voir le programme" : "View Program"}
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
