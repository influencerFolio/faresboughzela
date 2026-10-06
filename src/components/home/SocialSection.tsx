import { SocialPlatformIcon } from "@/components/ui/SocialIcons";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { getActiveSocialPlatforms, SOCIAL_PLATFORM_LABELS } from "@/lib/social";
import type { GeneralSettings, HomepageSettings, Locale } from "@/types/cms";

export function SocialSection({
  homepage,
  settings,
  locale,
}: {
  homepage: HomepageSettings;
  settings: GeneralSettings;
  locale: Locale;
}) {
  const platforms = getActiveSocialPlatforms(settings);
  const followersLabel = locale === "fr" ? "Abonnés" : "Followers";
  const viewsLabel = locale === "fr" ? "Vues" : "Views";
  const followLabel = locale === "fr" ? "Suivre" : "Follow";

  return (
    <SectionReveal className="relative w-full overflow-hidden bg-surface py-space-2xl">
      <div className="mx-auto max-w-7xl px-gutter lg:px-gutter-lg">
        <div className="mb-space-xl text-center md:text-left">
          <p className="label-caps text-primary">{homepage.socialHandle}</p>
          <h2 className="font-[family-name:var(--font-headline)] text-2xl uppercase text-on-surface md:text-4xl">
            {locale === "fr" ? "Réseaux sociaux" : "Social Media"}
          </h2>
          <p className="mt-space-sm max-w-2xl text-tertiary">
            {locale === "fr"
              ? "Suivez Fares sur chaque plateforme — logos cliquables, abonnés et vues à jour."
              : "Follow Fares on every platform — clickable logos with live follower and view counts."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {platforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-outline-variant/25 bg-surface-container-low p-space-lg transition-all hover:border-primary-container/50 hover:shadow-[0_0_24px_rgba(225,29,72,0.15)]"
            >
              <div className="flex items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-highest text-on-surface transition-colors group-hover:bg-primary-container group-hover:text-on-primary-container">
                    <SocialPlatformIcon platform={platform.id} className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-medium uppercase tracking-wider text-on-surface">
                      {SOCIAL_PLATFORM_LABELS[platform.id]}
                    </p>
                    {platform.handle ? (
                      <p className="text-sm text-tertiary">{platform.handle}</p>
                    ) : null}
                  </div>
                </div>
                <span className="label-caps text-secondary">{followLabel}</span>
              </div>

              <div className="mt-space-lg grid grid-cols-2 gap-space-md border-t border-outline-variant/20 pt-space-md">
                <div>
                  <p className="label-caps text-on-surface-variant">{followersLabel}</p>
                  <p className="mt-1 font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                    {platform.followers}
                  </p>
                </div>
                <div>
                  <p className="label-caps text-on-surface-variant">{viewsLabel}</p>
                  <p className="mt-1 font-[family-name:var(--font-headline)] text-2xl text-primary-container">
                    {platform.views}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
