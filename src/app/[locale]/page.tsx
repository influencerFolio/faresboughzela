import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { HeroSection } from "@/components/home/HeroSection";
import { PortfolioSection } from "@/components/home/PortfolioSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { SocialSection } from "@/components/home/SocialSection";
import { StatsBar } from "@/components/home/StatsBar";
import { WhyWorkSection } from "@/components/home/WhyWorkSection";
import { buildMetadata, personJsonLd } from "@/lib/seo";
import {
  getAboutSettings,
  getGeneralSettings,
  getHomepageSettings,
  getPageSeo,
  getPublishedPortfolio,
  getPublishedServices,
} from "@/lib/repositories/content";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getPageSeo("home");
  return buildMetadata(locale as "en" | "fr", seo?.seo, {
    title: "Fares Boughzala | Spearfishing Athlete & Content Creator",
    description:
      "Official portfolio of Fares Boughzala — spearfishing, apnea, training, and brand collaborations.",
    path: "",
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [general, homepage, about, portfolio, services] = await Promise.all([
    getGeneralSettings(),
    getHomepageSettings(),
    getAboutSettings(),
    getPublishedPortfolio(),
    getPublishedServices(),
  ]);

  const jsonLd = personJsonLd(locale as "en" | "fr");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection homepage={homepage} settings={general} locale={locale as "en" | "fr"} />
      <SocialSection
        homepage={homepage}
        settings={general}
        locale={locale as "en" | "fr"}
      />
      <StatsBar homepage={homepage} locale={locale as "en" | "fr"} />
      <AboutSection about={about} locale={locale as "en" | "fr"} />
      <PortfolioSection items={portfolio} locale={locale as "en" | "fr"} />
      <ServicesSection
        homepage={homepage}
        settings={general}
        services={services}
        locale={locale as "en" | "fr"}
      />
      <WhyWorkSection homepage={homepage} locale={locale as "en" | "fr"} />
      <ContactSection settings={general} locale={locale as "en" | "fr"} />
    </>
  );
}
