import type {
  AboutSettings,
  GeneralSettings,
  HomepageSettings,
  PortfolioItem,
  ServiceItem,
} from "@/types/cms";

/** Stitch design placeholder images (replace via CMS + Cloudinary). */
export const DEFAULT_IMAGES = {
  emblem:
    "https://lh3.googleusercontent.com/aida/AEtjO1Xf1Gx0VqJhO60qUixiVmVXICJAlhk9pGygr0kAwtXkDGHMHdxLT3X_Ll-WmHR1brZnqw5PcS12pdGjXXEaXMVN2KghWBJ1XpWSv3UEVUWD-QVERkA_mYcwHRo6hZHNXJRZVQv7CASJkIzm0W8fcJpmFefvOralI5LVka_jtnlk3PWXNR7mPM5elNjtYTeN8eHFeajrttx4uqFDVH8e4pyw0qHGqi1_B_VJ44GT6mQm",
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFDeBztvNyGf1Oqu8m89d2bkCRRMyPvatf1a4JJKpxNMnvLH6lJE5-A2ktVlXjL4v2trBSCApJzspekGQQmdazQL6HI3901xjiNvraUAJ61dviYXGInFWEgS4fBnze9kt0WwAW16zmTdNVHjCe6Ky7Y7XU2TvZPM3d1-5RTUAxlAH7esjfo9yrlKW8TRtpYYFmNV4_zLcITjn-BxjLTeh0t7qkTaAXKT85wSAPY-8",
  portrait:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuARtjfGk9_6D0pepzFlNqzFOVyvg2hqNgznfEguwS8ykbVxeLLgnAqc9ux8vtpEO7FwaBLVW11EMoMtTKCPXDKTOc2hciNRlNH-o5GAlYSfOGyJG9uu2JsLmQtOijOK8H4JX5eFephHWChbZuszhViFp1cOdjDBtBzr1u_oAI-HaWLCIV40ssn7bLSHix64meVprdKMSZ7-hc-iEWiFMNAprJx1eC3u6N-38P9UANE",
};

function asset(url: string, altEn: string, altFr: string) {
  return {
    publicId: "",
    url,
    alt: { en: altEn, fr: altFr },
  };
}

export const defaultGeneralSettings: GeneralSettings = {
  siteName: { en: "Fares Boughzala", fr: "Fares Boughzala" },
  tagline: { en: "Apnea & Spearfishing", fr: "Apnée & Pêche sous-marine" },
  logo: asset(DEFAULT_IMAGES.emblem, "Fares Boughzala emblem", "Emblème Fares Boughzala"),
  favicon: null,
  whatsappNumber: "",
  email: "contact@faresboughzala.com",
  phone: "",
  address: {
    en: "Mediterranean & Red Sea",
    fr: "Méditerranée & Mer Rouge",
  },
  defaultLocale: "en",
  social: {
    instagram: {
      url: "https://instagram.com/fares_boughzala",
      handle: "@fares_boughzala",
      followers: "185K",
      views: "4.2M",
    },
    youtube: {
      url: "https://youtube.com/",
      handle: "@FaresBoughzala",
      followers: "92K",
      views: "12.8M",
    },
    tiktok: {
      url: "https://www.tiktok.com/",
      handle: "@fares_boughzala",
      followers: "64K",
      views: "8.5M",
    },
    facebook: {
      url: "https://www.facebook.com/",
      handle: "Fares Boughzala",
      followers: "48K",
      views: "3.1M",
    },
  },
};

export const defaultHomepageSettings: HomepageSettings = {
  heroBadge: {
    en: "Spearfishing • Adventure • Content Creator",
    fr: "Pêche sous-marine • Aventure • Créateur de contenu",
  },
  heroTitle: { en: "FARES", fr: "FARES" },
  heroHighlight: { en: "BOUGHZALA", fr: "BOUGHZALA" },
  heroDescription: {
    en: "Spearfishing content creator sharing authentic underwater experiences through photography, video, and brand collaborations.",
    fr: "Créateur de contenu en pêche sous-marine partageant des expériences authentiques à travers la photo, la vidéo et les collaborations de marque.",
  },
  heroImage: asset(
    DEFAULT_IMAGES.hero,
    "Fares Boughzala deep apnea spearfishing",
    "Fares Boughzala en pêche sous-marine profonde",
  ),
  heroPills: [
    { en: "Apnea Specialist", fr: "Spécialiste apnée" },
    { en: "4K Raw Cinematography", fr: "Cinématographie 4K RAW" },
    { en: "Mediterranean & Red Sea", fr: "Méditerranée & Mer Rouge" },
  ],
  ctaPrimary: { en: "View My Work", fr: "Voir mon travail" },
  ctaSecondary: { en: "WhatsApp Direct", fr: "WhatsApp direct" },
  stats: [
    {
      id: "depth",
      label: { en: "Max Dive Depth", fr: "Profondeur max" },
      value: "42",
      suffix: "M+",
      sublabel: { en: "Constant weight apnea", fr: "Apnée poids constant" },
      accent: "primary",
    },
    {
      id: "audience",
      label: { en: "Total Audience", fr: "Audience totale" },
      value: "350",
      suffix: "K+",
      sublabel: { en: "Across active channels", fr: "Sur les canaux actifs" },
      accent: "secondary",
    },
    {
      id: "engagement",
      label: { en: "Organic Engagement", fr: "Engagement organique" },
      value: "11.8",
      suffix: "%",
      sublabel: {
        en: "High-intent ocean demographic",
        fr: "Audience océan à forte intention",
      },
      accent: "tertiary",
    },
    {
      id: "expeditions",
      label: { en: "Sponsor Expeditions", fr: "Expéditions sponsorisées" },
      value: "28",
      suffix: "INTL",
      sublabel: { en: "Multi-day pelagic shoots", fr: "Tournages pélagiques multi-jours" },
      accent: "primary",
    },
  ],
  featuredPortfolioIds: [],
  collaborationCards: [
    {
      id: "content",
      icon: "videocam",
      title: { en: "Content Creation", fr: "Création de contenu" },
      description: {
        en: "Underwater cinematography, reels, and expedition storytelling tailored to your brand.",
        fr: "Cinématographie sous-marine, reels et récits d'expédition adaptés à votre marque.",
      },
      whatsappTemplateKey: "collab_content",
    },
    {
      id: "ambassador",
      icon: "verified",
      title: { en: "Ambassadorship", fr: "Ambassadeur" },
      description: {
        en: "Long-term athlete representation with authentic field use of your gear.",
        fr: "Représentation athlète long terme avec usage authentique de votre équipement.",
      },
      whatsappTemplateKey: "collab_ambassador",
    },
    {
      id: "athlete",
      icon: "sports",
      title: { en: "Athlete Partnership", fr: "Partenariat athlète" },
      description: {
        en: "Co-branded campaigns, events, and competitive spearfishing activations.",
        fr: "Campagnes co-brandées, événements et activations compétitives.",
      },
      whatsappTemplateKey: "collab_athlete",
    },
    {
      id: "consulting",
      icon: "engineering",
      title: { en: "Technical Consulting", fr: "Conseil technique" },
      description: {
        en: "Product testing, R&D feedback, and spearfishing program design.",
        fr: "Tests produits, retours R&D et conception de programmes.",
      },
      whatsappTemplateKey: "collab_consulting",
    },
  ],
  whyWorkPillars: [
    {
      id: "1",
      number: "01",
      title: { en: "Authentic & Unparalleled", fr: "Authentique & unique" },
      description: {
        en: "Real expeditions, real catches, real audience trust—no stock adventure.",
        fr: "Expéditions réelles, captures réelles, confiance réelle—pas d'aventure stock.",
      },
    },
    {
      id: "2",
      number: "02",
      title: { en: "High-Quality Content", fr: "Contenu haute qualité" },
      description: {
        en: "4K underwater production with cinematic color and narrative structure.",
        fr: "Production sous-marine 4K avec colorimétrie cinéma et narration.",
      },
    },
    {
      id: "3",
      number: "03",
      title: { en: "Strategic Collaboration", fr: "Collaboration stratégique" },
      description: {
        en: "Campaign planning aligned with product launches and seasonal peaks.",
        fr: "Planification alignée sur les lancements produits et saisons.",
      },
    },
    {
      id: "4",
      number: "04",
      title: { en: "Reach & Impact", fr: "Portée & impact" },
      description: {
        en: "Engaged ocean community across Instagram, YouTube, and WhatsApp.",
        fr: "Communauté océan engagée sur Instagram, YouTube et WhatsApp.",
      },
    },
  ],
  socialHandle: "@FARES_BOUGHZALA",
};

export const defaultAboutSettings: AboutSettings = {
  headline: {
    en: "Beneath the Surface: Raw Oceanic Mastery",
    fr: "Sous la surface : maîtrise océanique brute",
  },
  body: {
    en: "From Mediterranean reefs to open pelagic blue, I document the discipline of apnea spearfishing—where breath control, precision, and respect for the ocean define every dive. My work bridges elite athletic performance, cinematic media, and partnerships with brands that share the same standard.",
    fr: "Des récifs méditerranéens au bleu pélagique, je documente la discipline de la pêche sous-marine en apnée—où le contrôle du souffle, la précision et le respect de l'océan définissent chaque plongée.",
  },
  portrait: asset(
    DEFAULT_IMAGES.portrait,
    "Fares Boughzala portrait",
    "Portrait Fares Boughzala",
  ),
  highlights: [
    {
      id: "gear",
      icon: "scuba_diving",
      title: { en: "High-End Gear", fr: "Équipement haut de gamme" },
      description: {
        en: "Field-tested spearfishing systems in real conditions.",
        fr: "Systèmes testés en conditions réelles.",
      },
    },
    {
      id: "media",
      icon: "photo_camera",
      title: { en: "Stunning Media", fr: "Médias saisissants" },
      description: {
        en: "Photo and video built for sponsors and social impact.",
        fr: "Photo et vidéo pour sponsors et réseaux sociaux.",
      },
    },
    {
      id: "training",
      icon: "school",
      title: { en: "Professional Training", fr: "Formation professionnelle" },
      description: {
        en: "Structured programs for beginners to advanced hunters.",
        fr: "Programmes structurés du débutant à l'avancé.",
      },
    },
    {
      id: "brands",
      icon: "handshake",
      title: { en: "Brand Collaborations", fr: "Collaborations marques" },
      description: {
        en: "Long-term partnerships with global outdoor brands.",
        fr: "Partenariats long terme avec marques outdoor.",
      },
    },
  ],
  signature: null,
};

export const defaultPortfolioItems: PortfolioItem[] = [
  {
    id: "p1",
    slug: "pathos-carbon-gear",
    title: {
      en: "Pathos Carbon Gear & Deep Pelagic Pursuit",
      fr: "Équipement Pathos Carbon & poursuite pélagique",
    },
    description: {
      en: "Documentary-style capture of carbon spearfishing gear in open water.",
      fr: "Capture documentaire d'équipement carbone en eau libre.",
    },
    category: "gear",
    cover: asset(DEFAULT_IMAGES.hero, "Reef shoot", "Tournage récif"),
    featured: true,
    order: 0,
    published: true,
    badge: { en: "Gear", fr: "Équipement" },
  },
  {
    id: "p2",
    slug: "abyss-hunter-reel",
    title: { en: "Abyss Hunter Reel", fr: "Reel chasseur des abysses" },
    description: {
      en: "Vertical reel content for social campaigns.",
      fr: "Contenu vertical pour campagnes sociales.",
    },
    category: "spearfishing",
    cover: asset(DEFAULT_IMAGES.portrait, "Spearfishing action", "Action pêche"),
    featured: true,
    order: 1,
    published: true,
    badge: { en: "Spearfishing", fr: "Pêche sous-marine" },
  },
];

export const defaultServices: ServiceItem[] = [
  {
    id: "s1",
    slug: "spearfishing-foundation",
    name: {
      en: "Spearfishing Foundation",
      fr: "Fondations de la pêche sous-marine",
    },
    shortDescription: {
      en: "Introductory apnea spearfishing program with safety and technique focus.",
      fr: "Programme d'introduction avec focus sécurité et technique.",
    },
    fullDescription: {
      en: "Learn breath control, equipment setup, hunting ethics, and in-water technique across structured sessions and supervised dives.",
      fr: "Apprenez le contrôle du souffle, l'équipement, l'éthique de chasse et la technique en sessions structurées.",
    },
    cover: asset(DEFAULT_IMAGES.portrait, "Training cover", "Couverture formation"),
    duration: { en: "3 days", fr: "3 jours" },
    location: { en: "Mediterranean coast", fr: "Côte méditerranéenne" },
    priceDisplay: { en: "Contact us", fr: "Contactez-nous" },
    priceContactOnly: true,
    level: { en: "Beginner", fr: "Débutant" },
    programSteps: [
      {
        id: "step1",
        order: 0,
        title: { en: "Session 1 — Safety & Theory", fr: "Session 1 — Sécurité & théorie" },
        description: {
          en: "Equipment, rules, breath basics, and dive planning.",
          fr: "Équipement, règles, bases respiratoires et planification.",
        },
      },
      {
        id: "step2",
        order: 1,
        title: { en: "Session 2 — Pool & Shallow Water", fr: "Session 2 — Piscine & eau peu profonde" },
        description: {
          en: "Apnea drills, duck dives, and stalking fundamentals.",
          fr: "Exercices d'apnée, plongées et bases de chasse.",
        },
      },
      {
        id: "step3",
        order: 2,
        title: { en: "Practical Training & Evaluation", fr: "Entraînement pratique & évaluation" },
        description: {
          en: "Guided hunts with feedback and final skills check.",
          fr: "Chasses guidées avec retours et validation des compétences.",
        },
      },
    ],
    included: [
      { en: "Instructor supervision", fr: "Encadrement instructeur" },
      { en: "Safety briefing materials", fr: "Supports de briefing sécurité" },
    ],
    notIncluded: [
      { en: "Personal travel", fr: "Déplacements personnels" },
      { en: "Spearfishing license fees", fr: "Frais de licence" },
    ],
    requirements: [
      { en: "Swimming competency", fr: "Maîtrise de la nage" },
      { en: "Medical clearance for apnea", fr: "Certificat médical apnée" },
    ],
    availableDates: [],
    maxParticipants: 6,
    published: true,
    order: 0,
    isTraining: true,
  },
];

export function pickLocalized<T extends { en: string; fr: string }>(
  value: T,
  locale: "en" | "fr",
): string {
  return value[locale] || value.en;
}
