import { getPublishedServices } from "@/lib/repositories/content";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const locales = ["en", "fr"] as const;
  const staticPaths = ["", "/portfolio", "/services", "/contact"];

  const services = await getPublishedServices();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
    for (const service of services) {
      entries.push({
        url: `${base}/${locale}/services/${service.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
