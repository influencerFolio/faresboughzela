export type Locale = "en" | "fr";

export type LocalizedString = {
  en: string;
  fr: string;
};

export type CloudinaryAsset = {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  alt?: LocalizedString;
};

export type SeoFields = {
  title?: LocalizedString;
  description?: LocalizedString;
  keywords?: LocalizedString;
  ogTitle?: LocalizedString;
  ogDescription?: LocalizedString;
  ogImage?: CloudinaryAsset | null;
  canonicalPath?: string;
  robots?: "index,follow" | "noindex,nofollow";
};

export type SocialPlatformId = "instagram" | "youtube" | "tiktok" | "facebook";

export type SocialPlatform = {
  url: string;
  handle?: string;
  followers: string;
  views: string;
};

export type GeneralSettings = {
  siteName: LocalizedString;
  tagline: LocalizedString;
  logo?: CloudinaryAsset | null;
  favicon?: CloudinaryAsset | null;
  whatsappNumber: string;
  email: string;
  phone: string;
  address: LocalizedString;
  defaultLocale: Locale;
  social: Partial<Record<SocialPlatformId, SocialPlatform>>;
};

export type StatItem = {
  id: string;
  label: LocalizedString;
  value: string;
  suffix?: string;
  sublabel: LocalizedString;
  accent: "primary" | "secondary" | "tertiary";
};

export type HomepageSettings = {
  heroBadge: LocalizedString;
  heroTitle: LocalizedString;
  heroHighlight: LocalizedString;
  heroDescription: LocalizedString;
  heroImage?: CloudinaryAsset | null;
  heroVideoUrl?: string;
  heroPills: LocalizedString[];
  ctaPrimary: LocalizedString;
  ctaSecondary: LocalizedString;
  stats: StatItem[];
  featuredPortfolioIds: string[];
  collaborationCards: CollaborationCard[];
  whyWorkPillars: WhyWorkPillar[];
  socialHandle: string;
  seo?: SeoFields;
};

export type CollaborationCard = {
  id: string;
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
  whatsappTemplateKey: string;
};

export type WhyWorkPillar = {
  id: string;
  number: string;
  title: LocalizedString;
  description: LocalizedString;
};

export type AboutSettings = {
  headline: LocalizedString;
  body: LocalizedString;
  portrait?: CloudinaryAsset | null;
  highlights: {
    id: string;
    icon: string;
    title: LocalizedString;
    description: LocalizedString;
  }[];
  signature?: CloudinaryAsset | null;
  seo?: SeoFields;
};

export type PortfolioCategory =
  | "all"
  | "spearfishing"
  | "gear"
  | "exploration"
  | "collaborations";

export type PortfolioItem = {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  category: PortfolioCategory;
  cover: CloudinaryAsset;
  gallery?: CloudinaryAsset[];
  metrics?: LocalizedString;
  badge?: LocalizedString;
  featured: boolean;
  order: number;
  published: boolean;
  seo?: SeoFields;
};

export type ProgramStep = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  order: number;
};

export type ServiceItem = {
  id: string;
  slug: string;
  name: LocalizedString;
  shortDescription: LocalizedString;
  fullDescription: LocalizedString;
  cover?: CloudinaryAsset | null;
  gallery?: CloudinaryAsset[];
  duration: LocalizedString;
  location: LocalizedString;
  priceDisplay: LocalizedString;
  priceContactOnly: boolean;
  level: LocalizedString;
  programSteps: ProgramStep[];
  included: LocalizedString[];
  notIncluded: LocalizedString[];
  requirements: LocalizedString[];
  availableDates: string[];
  maxParticipants?: number;
  published: boolean;
  order: number;
  isTraining: boolean;
  seo?: SeoFields;
};

export type MessageStatus = "New" | "Read" | "Contacted" | "Completed";

export type ContactMessage = {
  id: string;
  type: "contact";
  status: MessageStatus;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  collaborationType?: string;
  budget?: string;
  message: string;
  locale: Locale;
  createdAt: string;
};

export type RegistrationStatus =
  | "New"
  | "Contacted"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export type TrainingRegistration = {
  id: string;
  status: RegistrationStatus;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  trainingId: string;
  trainingSlug: string;
  trainingName: LocalizedString;
  preferredDate?: string;
  participants: number;
  experienceLevel: string;
  message?: string;
  locale: Locale;
  createdAt: string;
};

export type PageSeo = {
  pageKey: string;
  seo: SeoFields;
};
