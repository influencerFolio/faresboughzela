import { SocialIconLinks } from "@/components/ui/SocialIcons";
import { pickLocalized } from "@/lib/data/defaults";
import { getActiveSocialPlatforms, SOCIAL_PLATFORM_LABELS } from "@/lib/social";
import { Link } from "@/i18n/navigation";
import type { GeneralSettings, Locale } from "@/types/cms";

export function SiteFooter({
  settings,
  locale,
}: {
  settings: GeneralSettings;
  locale: Locale;
}) {
  const year = new Date().getFullYear();
  const platforms = getActiveSocialPlatforms(settings);
  const followersLabel = locale === "fr" ? "Abonnés" : "Followers";
  const viewsLabel = locale === "fr" ? "Vues" : "Views";

  return (
    <footer className="border-t border-outline-variant/20 bg-surface-container-lowest py-space-2xl">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-gutter-lg px-gutter md:grid-cols-2 lg:grid-cols-4 lg:px-gutter-lg">
        <div>
          <p className="font-[family-name:var(--font-headline)] text-lg uppercase tracking-wider">
            {pickLocalized(settings.siteName, locale)}
          </p>
          <p className="mt-2 text-sm text-tertiary">
            {pickLocalized(settings.tagline, locale)}
          </p>
          <p className="mt-4 text-xs text-outline">
            {pickLocalized(settings.address, locale)}
          </p>
          <SocialIconLinks platforms={platforms} className="mt-space-md" />
        </div>
        <div>
          <p className="label-caps text-on-surface-variant">Quick Navigation</p>
          <ul className="mt-3 space-y-2 text-sm text-tertiary">
            <li>
              <Link href="/portfolio" className="hover:text-on-surface">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-on-surface">
                Services
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-on-surface">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="label-caps text-on-surface-variant">Get in Touch</p>
          <ul className="mt-3 space-y-2 text-sm text-tertiary">
            <li>{settings.email}</li>
            {settings.phone ? <li>{settings.phone}</li> : null}
          </ul>
        </div>
        <div>
          <p className="label-caps text-on-surface-variant">Social</p>
          <ul className="mt-3 space-y-3 text-sm text-tertiary">
            {platforms.map((platform) => (
              <li key={platform.id}>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:text-on-surface"
                >
                  <span className="text-on-surface">
                    {SOCIAL_PLATFORM_LABELS[platform.id]}
                  </span>
                  <span className="mt-0.5 block text-xs">
                    {followersLabel}: {platform.followers} · {viewsLabel}:{" "}
                    {platform.views}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-space-xl flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-outline-variant/20 px-gutter pt-space-md text-xs text-outline md:flex-row lg:px-gutter-lg">
        <span>© {year} {pickLocalized(settings.siteName, locale)}</span>
        <span className="label-caps">Available for Expeditions</span>
      </div>
    </footer>
  );
}
