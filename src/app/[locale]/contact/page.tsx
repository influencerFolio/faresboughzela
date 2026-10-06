import { ContactForm } from "@/components/forms/ContactForm";
import { RegistrationForm } from "@/components/forms/RegistrationForm";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import {
  getGeneralSettings,
  getPageSeo,
  getPublishedServices,
} from "@/lib/repositories/content";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getPageSeo("contact");
  return buildMetadata(locale as "en" | "fr", seo?.seo, {
    title: "Contact | Fares Boughzala",
    description: "Contact Fares for collaborations, sponsorships, and training registration.",
    path: "/contact",
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const loc = locale as "en" | "fr";
  const [settings, services] = await Promise.all([
    getGeneralSettings(),
    getPublishedServices(),
  ]);
  const waUrl = buildWhatsAppUrl(settings.whatsappNumber, "general", {}, loc);

  return (
    <section className="py-space-2xl">
      <div className="mx-auto max-w-7xl px-gutter lg:px-gutter-lg">
        <h1 className="font-[family-name:var(--font-headline)] text-4xl uppercase text-on-surface">
          {t("title")} <span className="text-primary-container">{t("titleHighlight")}</span>
        </h1>
        <p className="mt-space-sm max-w-2xl text-tertiary">{t("subtitle")}</p>

        <div className="mt-space-xl grid gap-gutter-lg lg:grid-cols-2">
          <div className="rounded-2xl bg-surface-container-low p-space-xl">
            <h2 className="text-lg uppercase">{t("whatsappTitle")}</h2>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-space-md inline-flex w-full justify-center rounded-xl bg-secondary-container py-3 font-medium uppercase text-on-secondary-container"
            >
              WhatsApp
            </a>
            <h2 className="mt-space-xl text-lg uppercase">{t("formTitle")}</h2>
            <div className="mt-space-md">
              <ContactForm locale={loc} />
            </div>
          </div>
          <div className="rounded-2xl bg-surface-container-low p-space-xl">
            <h2 className="text-lg uppercase text-primary-container">
              {loc === "fr" ? "Inscription formation" : "Training Registration"}
            </h2>
            <div className="mt-space-md">
              <RegistrationForm locale={loc} services={services} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
