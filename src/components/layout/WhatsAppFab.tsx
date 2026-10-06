"use client";

import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Locale } from "@/types/cms";
import { useTranslations } from "next-intl";

export function WhatsAppFab({
  number,
  locale,
  templateKey = "general",
  vars,
}: {
  number: string;
  locale: Locale;
  templateKey?: Parameters<typeof buildWhatsAppUrl>[1];
  vars?: Record<string, string>;
}) {
  const t = useTranslations("common");
  const href = buildWhatsAppUrl(number, templateKey, vars ?? {}, locale);

  return (
    <div className="group fixed bottom-6 right-6 z-40 flex items-center gap-space-sm">
      <div className="pointer-events-none hidden items-center rounded-full bg-surface-container-lowest/95 px-space-md py-1.5 font-bold text-[11px] uppercase tracking-[0.14em] text-on-surface opacity-0 shadow-2xl backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 sm:flex">
        <span className="mr-2 h-2 w-2 animate-ping rounded-full bg-secondary" />
        {t("chatNow")}
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("chatWhatsApp")}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-[0_0_24px_rgba(6,200,93,0.45)] transition-all duration-300 hover:scale-110 hover:bg-secondary hover:text-on-secondary"
      >
        <span className="material-symbols-outlined text-[28px]">chat</span>
        <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full bg-primary-container" />
      </a>
    </div>
  );
}
