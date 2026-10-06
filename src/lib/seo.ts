import { pickLocalized } from "@/lib/data/defaults";
import type { Locale, SeoFields } from "@/types/cms";
import type { Metadata } from "next";

const siteName = "Fares Boughzala";

export function buildMetadata(
  locale: Locale,
  seo: SeoFields | undefined,
  defaults: { title: string; description: string; path: string },
): Metadata {
  const title = seo?.title
    ? pickLocalized(seo.title, locale)
    : defaults.title;
  const description = seo?.description
    ? pickLocalized(seo.description, locale)
    : defaults.description;
  const ogTitle = seo?.ogTitle
    ? pickLocalized(seo.ogTitle, locale)
    : title;
  const ogDescription = seo?.ogDescription
    ? pickLocalized(seo.ogDescription, locale)
    : description;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const canonical = `${baseUrl}/${locale}${defaults.path}`;
  const ogImage = seo?.ogImage?.url;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en${defaults.path}`,
        fr: `${baseUrl}/fr${defaults.path}`,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: seo?.robots ?? "index,follow",
  };
}

export function personJsonLd(locale: Locale) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Fares Boughzala",
    url: `${baseUrl}/${locale}`,
    jobTitle: locale === "fr" ? "Athlète & créateur de contenu" : "Athlete & Content Creator",
    knowsAbout: ["Spearfishing", "Apnea", "Underwater Photography"],
  };
}

export function courseJsonLd(
  locale: Locale,
  service: {
    name: { en: string; fr: string };
    description: { en: string; fr: string };
    slug: string;
  },
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: pickLocalized(service.name, locale),
    description: pickLocalized(service.description, locale),
    provider: {
      "@type": "Person",
      name: "Fares Boughzala",
    },
    url: `${baseUrl}/${locale}/services/${service.slug}`,
  };
}
