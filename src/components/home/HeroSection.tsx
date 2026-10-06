"use client";

import { CmsImage } from "@/components/ui/CmsImage";
import { pickLocalized } from "@/lib/data/defaults";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { motionDurations, motionEase, reducedMotionTransition } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { GeneralSettings, HomepageSettings, Locale } from "@/types/cms";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function HeroSection({
  homepage,
  settings,
  locale,
}: {
  homepage: HomepageSettings;
  settings: GeneralSettings;
  locale: Locale;
}) {
  const t = useTranslations("common");
  const reduced = useReducedMotion();
  const waUrl = buildWhatsAppUrl(settings.whatsappNumber, "general", {}, locale);

  return (
    <section className="relative -mt-20 flex min-h-[92vh] w-full items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        {homepage.heroImage ? (
          <CmsImage
            asset={homepage.heroImage}
            locale={locale}
            fill
            priority
            className="scale-105 object-center transition-transform duration-1000 ease-out"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-surface/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(17,20,23,0.85)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-gutter py-space-2xl text-center lg:px-gutter-lg">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced
              ? reducedMotionTransition
              : { duration: motionDurations.base, ease: motionEase }
          }
          className="mb-space-lg inline-flex items-center gap-space-sm rounded-full bg-surface-container-lowest/80 px-space-md py-1.5 shadow-lg shadow-black/40 backdrop-blur-md"
        >
          <span className="inline-block h-2 w-2 animate-ping rounded-full bg-primary-container" />
          <span className="label-caps tracking-[0.2em] text-primary">
            {pickLocalized(homepage.heroBadge, locale)}
          </span>
        </motion.div>

        <h1 className="max-w-4xl font-[family-name:var(--font-display-hero)] text-4xl uppercase tracking-tight text-on-surface drop-shadow-2xl md:text-7xl lg:text-[80px] lg:leading-[84px]">
          {pickLocalized(homepage.heroTitle, locale)}{" "}
          <span className="text-primary-container">
            {pickLocalized(homepage.heroHighlight, locale)}
          </span>
        </h1>

        <p className="mt-space-md max-w-2xl text-lg font-light leading-relaxed text-tertiary">
          {pickLocalized(homepage.heroDescription, locale)}
        </p>

        <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-md">
          {homepage.heroPills.map((pill) => (
            <div
              key={pill.en}
              className="flex items-center gap-2 rounded-full bg-surface-container-low/70 px-space-md py-1 shadow-sm backdrop-blur-sm"
            >
              <span className="label-caps text-on-surface">
                {pickLocalized(pill, locale)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-space-xl flex w-full max-w-md flex-col items-center justify-center gap-space-md sm:flex-row">
          <Link
            href="/portfolio"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-space-xl py-space-sm text-center font-medium uppercase tracking-wider text-on-primary-container shadow-[0_0_24px_rgba(225,29,72,0.45)] transition-all hover:bg-inverse-primary sm:w-auto"
          >
            {pickLocalized(homepage.ctaPrimary, locale)}
            <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-high/90 px-space-xl py-space-sm text-center font-medium uppercase tracking-wider text-secondary shadow-lg transition-all hover:bg-secondary-container hover:text-on-secondary-container sm:w-auto"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            {pickLocalized(homepage.ctaSecondary, locale)}
          </a>
        </div>

        <div className="mt-space-2xl flex animate-bounce flex-col items-center gap-1 opacity-70 motion-reduce:animate-none">
          <span className="label-caps uppercase tracking-widest text-tertiary">
            {t("scrollExplore")}
          </span>
          <span className="material-symbols-outlined text-[20px] text-primary">
            keyboard_double_arrow_down
          </span>
        </div>
      </div>
    </section>
  );
}
