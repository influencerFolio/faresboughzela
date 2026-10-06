import { ContactForm } from "@/components/forms/ContactForm";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { GeneralSettings, Locale } from "@/types/cms";
import { getTranslations } from "next-intl/server";

export async function ContactSection({
  settings,
  locale,
}: {
  settings: GeneralSettings;
  locale: Locale;
}) {
  const t = await getTranslations("contact");
  const waUrl = buildWhatsAppUrl(settings.whatsappNumber, "general", {}, locale);

  return (
    <SectionReveal id="contact" className="w-full bg-surface-container-lowest py-space-2xl">
      <div className="mx-auto max-w-7xl px-gutter lg:px-gutter-lg">
        <div className="mx-auto mb-space-2xl max-w-3xl text-center">
          <div className="mb-space-sm inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="label-caps text-secondary">{t("badge")}</span>
          </div>
          <h2 className="font-[family-name:var(--font-headline)] text-3xl uppercase text-on-surface md:text-5xl">
            {t("title")}{" "}
            <span className="text-primary-container">{t("titleHighlight")}</span>
          </h2>
          <p className="mt-space-sm text-lg text-tertiary">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-gutter-lg lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between rounded-2xl bg-surface-container-low p-space-xl shadow-2xl">
              <div>
                <h3 className="font-[family-name:var(--font-headline)] text-xl uppercase text-on-surface">
                  {t("whatsappTitle")}
                </h3>
                <p className="mt-2 text-sm text-tertiary">
                  {locale === "fr"
                    ? "Canal prioritaire pour demandes rapides et coordination d'expédition."
                    : "Priority channel for fast inquiries and expedition coordination."}
                </p>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-space-lg inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-container py-space-md font-medium uppercase tracking-wider text-on-secondary-container shadow-[0_0_24px_rgba(6,200,93,0.35)] hover:bg-secondary hover:text-on-secondary"
              >
                <span className="material-symbols-outlined">forum</span>
                {locale === "fr" ? "Ouvrir WhatsApp" : "Open WhatsApp Chat"}
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-surface-container-low p-space-xl shadow-2xl">
              <h3 className="mb-space-md font-medium uppercase tracking-wider text-on-surface">
                {t("formTitle")}
              </h3>
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
