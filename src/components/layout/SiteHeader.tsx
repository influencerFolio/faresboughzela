"use client";

import { pickLocalized } from "@/lib/data/defaults";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import type { GeneralSettings, Locale } from "@/types/cms";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

const navItems = [
  { key: "home", href: "/" as const, hash: "" },
  { key: "about", href: "/" as const, hash: "#about" },
  { key: "portfolio", href: "/portfolio" as const, hash: "" },
  { key: "services", href: "/services" as const, hash: "" },
  { key: "whyWork", href: "/" as const, hash: "#why-work-with-me" },
  { key: "contact", href: "/contact" as const, hash: "" },
] as const;

export function SiteHeader({
  settings,
  locale,
}: {
  settings: GeneralSettings;
  locale: Locale;
}) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const waUrl = buildWhatsAppUrl(settings.whatsappNumber, "general", {}, locale);

  return (
    <header className="fixed top-0 z-50 w-full bg-surface-container-lowest/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-space-md px-gutter lg:px-gutter-lg">
        <Link href="/" className="flex items-center gap-space-sm">
          {settings.logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo.url}
              alt=""
              className="h-8 w-auto object-contain"
            />
          ) : null}
          <div className="flex flex-col">
            <span className="font-[family-name:var(--font-headline)] text-sm uppercase tracking-wider text-on-surface">
              {pickLocalized(settings.siteName, locale)}
            </span>
            <span className="label-caps mt-space-xs text-primary">
              {pickLocalized(settings.tagline, locale)}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-space-lg xl:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/" && !item.hash
                : pathname.startsWith(item.href);
            const href = item.hash ? `${item.href}${item.hash}` : item.href;
            return (
              <Link
                key={item.key}
                href={href}
                className={cn(
                  "font-medium text-[13px] uppercase tracking-wider transition-colors",
                  active && !item.hash
                    ? "font-bold text-on-surface"
                    : "text-on-surface-variant hover:text-on-surface",
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-space-md">
          <LocaleSwitcher locale={locale} />
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-space-xs rounded-lg bg-secondary-container px-space-md py-space-sm text-[13px] font-medium uppercase tracking-wider text-on-secondary-container shadow-[0_0_16px_rgba(6,200,93,0.25)] transition-all hover:bg-secondary hover:text-on-secondary sm:inline-flex"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            {tCommon("chatWhatsApp")}
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high xl:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-outline-variant/30 bg-surface-container-lowest px-gutter py-space-md xl:hidden">
          <nav className="flex flex-col gap-space-sm">
            {navItems.map((item) => {
              const href = item.hash ? `${item.href}${item.hash}` : item.href;
              return (
                <Link
                  key={item.key}
                  href={href}
                  className="py-2 text-sm uppercase tracking-wider text-on-surface"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <a
              href={waUrl}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-secondary-container py-3 text-sm uppercase text-on-secondary-container"
            >
              {t("collaborate")}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider">
      <Link
        href={pathname}
        locale="fr"
        className={cn(locale === "fr" ? "text-on-surface" : "text-on-surface-variant")}
      >
        FR
      </Link>
      <span className="text-outline-variant">|</span>
      <Link
        href={pathname}
        locale="en"
        className={cn(locale === "en" ? "text-on-surface" : "text-on-surface-variant")}
      >
        EN
      </Link>
    </div>
  );
}
