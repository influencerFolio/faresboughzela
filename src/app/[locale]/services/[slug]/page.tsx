import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { CmsImage } from "@/components/ui/CmsImage";
import { pickLocalized } from "@/lib/data/defaults";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { buildMetadata, courseJsonLd } from "@/lib/seo";
import {
  getGeneralSettings,
  getPublishedServices,
  getServiceBySlug,
} from "@/lib/repositories/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateStaticParams() {
  const services = await getPublishedServices();
  return services.flatMap((s) =>
    ["en", "fr"].map((locale) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata(locale as "en" | "fr", service.seo, {
    title: `${pickLocalized(service.name, locale as "en" | "fr")} | Fares Boughzala`,
    description: pickLocalized(service.shortDescription, locale as "en" | "fr"),
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/[locale]/services/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("training");
  const tCommon = await getTranslations("common");

  const [service, settings, services] = await Promise.all([
    getServiceBySlug(slug),
    getGeneralSettings(),
    getPublishedServices(),
  ]);
  if (!service) notFound();

  const loc = locale as "en" | "fr";
  const waUrl = buildWhatsAppUrl(
    settings.whatsappNumber,
    "training",
    { trainingName: pickLocalized(service.name, loc) },
    loc,
  );
  const jsonLd = courseJsonLd(loc, {
    name: service.name,
    description: service.shortDescription,
    slug: service.slug,
  });
  const steps = [...service.programSteps].sort((a, b) => a.order - b.order);

  return (
    <article className="py-space-2xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-gutter lg:px-gutter-lg">
        <div className="grid gap-gutter-lg lg:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface-container-low">
            {service.cover ? (
              <CmsImage asset={service.cover} locale={loc} fill priority />
            ) : null}
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-headline)] text-3xl uppercase text-on-surface md:text-5xl">
              {pickLocalized(service.name, loc)}
            </h1>
            <p className="mt-space-md text-lg text-tertiary">
              {pickLocalized(service.shortDescription, loc)}
            </p>
            <div className="mt-space-md flex flex-wrap gap-space-sm">
              <Badge>{pickLocalized(service.duration, loc)}</Badge>
              <Badge>{pickLocalized(service.location, loc)}</Badge>
              <Badge>{pickLocalized(service.level, loc)}</Badge>
              <Badge>{pickLocalized(service.priceDisplay, loc)}</Badge>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-space-lg inline-flex rounded-lg bg-secondary-container px-space-xl py-space-sm font-medium uppercase tracking-wider text-on-secondary-container hover:bg-secondary"
            >
              {loc === "fr" ? "Demander des infos" : "Ask About This Training"}
            </a>
          </div>
        </div>

        <section className="mt-space-2xl">
          <h2 className="font-[family-name:var(--font-headline)] text-2xl uppercase">{t("overview")}</h2>
          <p className="mt-space-md max-w-3xl text-tertiary">
            {pickLocalized(service.fullDescription, loc)}
          </p>
        </section>

        <section className="mt-space-2xl">
          <h2 className="font-[family-name:var(--font-headline)] text-2xl uppercase">{t("program")}</h2>
          <ol className="mt-space-md space-y-space-md border-l border-outline-variant/40 pl-space-md">
            {steps.map((step) => (
              <li key={step.id}>
                <h3 className="font-medium uppercase text-on-surface">
                  {pickLocalized(step.title, loc)}
                </h3>
                <p className="text-sm text-tertiary">
                  {pickLocalized(step.description, loc)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-space-2xl grid gap-gutter md:grid-cols-3">
          <InfoList title={t("included")} items={service.included} locale={loc} />
          <InfoList title={t("notIncluded")} items={service.notIncluded} locale={loc} />
          <InfoList title={t("requirements")} items={service.requirements} locale={loc} />
        </section>

        <section className="mt-space-2xl rounded-2xl bg-surface-container-low p-space-xl">
          <h2 className="font-[family-name:var(--font-headline)] text-2xl uppercase text-primary-container">
            {tCommon("joinTraining")}
          </h2>
          <div className="mt-space-md">
            <RegistrationForm locale={loc} services={services} preselectedSlug={slug} />
          </div>
        </section>
      </div>
    </article>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs uppercase tracking-wider text-on-surface">
      {children}
    </span>
  );
}

function InfoList({
  title,
  items,
  locale,
}: {
  title: string;
  items: { en: string; fr: string }[];
  locale: "en" | "fr";
}) {
  return (
    <div>
      <h3 className="label-caps text-secondary">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-tertiary">
        {items.map((item) => (
          <li key={item.en}>{pickLocalized(item, locale)}</li>
        ))}
      </ul>
    </div>
  );
}
