import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { buildMetadata } from "@/lib/seo";
import { getPageSeo, getPublishedPortfolio } from "@/lib/repositories/content";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/portfolio">): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getPageSeo("portfolio");
  return buildMetadata(locale as "en" | "fr", seo?.seo, {
    title: "Portfolio | Fares Boughzala",
    description: "Spearfishing media, gear, exploration, and collaborations.",
    path: "/portfolio",
  });
}

export default async function PortfolioPage({
  params,
}: PageProps<"/[locale]/portfolio">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("portfolioPage");
  const items = await getPublishedPortfolio();

  return (
    <section className="py-space-2xl">
      <div className="mx-auto max-w-7xl px-gutter lg:px-gutter-lg">
        <h1 className="font-[family-name:var(--font-headline)] text-4xl uppercase text-on-surface md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-space-sm max-w-2xl text-tertiary">{t("subtitle")}</p>
        <div className="mt-space-xl">
          <PortfolioGrid items={items} locale={locale as "en" | "fr"} />
        </div>
      </div>
    </section>
  );
}
