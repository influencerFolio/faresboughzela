import type {
  GeneralSettings,
  SocialPlatform,
  SocialPlatformId,
} from "@/types/cms";

export const SOCIAL_PLATFORM_ORDER: SocialPlatformId[] = [
  "instagram",
  "youtube",
  "tiktok",
  "facebook",
];

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatformId, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
};

/** Normalize legacy string URLs from older CMS data. */
export function normalizeSocialPlatform(
  value: SocialPlatform | string | undefined | null,
): SocialPlatform | null {
  if (!value) return null;
  if (typeof value === "string") {
    if (!value.trim()) return null;
    return { url: value, followers: "—", views: "—" };
  }
  if (!value.url?.trim()) return null;
  return {
    url: value.url,
    handle: value.handle,
    followers: value.followers || "—",
    views: value.views || "—",
  };
}

export function getActiveSocialPlatforms(settings: GeneralSettings) {
  return SOCIAL_PLATFORM_ORDER.flatMap((id) => {
    const platform = normalizeSocialPlatform(settings.social?.[id]);
    if (!platform) return [];
    return [{ id, ...platform }];
  });
}
