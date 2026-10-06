import type { Locale } from "@/types/cms";

type TemplateKey =
  | "general"
  | "training"
  | "collab_content"
  | "collab_ambassador"
  | "collab_athlete"
  | "collab_consulting";

const templates: Record<
  TemplateKey,
  { en: (vars: Record<string, string>) => string; fr: (vars: Record<string, string>) => string }
> = {
  general: {
    en: () =>
      "Hello Fares, I'd like to discuss a collaboration with you.",
    fr: () =>
      "Bonjour Fares, j'aimerais discuter d'une collaboration avec vous.",
  },
  training: {
    en: (v) =>
      `Hello Fares, I am interested in the ${v.trainingName ?? "training"} training. I would like more information about availability and registration.`,
    fr: (v) =>
      `Bonjour Fares, je suis intéressé(e) par la formation ${v.trainingName ?? "formation"}. J'aimerais plus d'informations sur les disponibilités et l'inscription.`,
  },
  collab_content: {
    en: () => "Hello Fares, I'm interested in content creation services for my brand.",
    fr: () =>
      "Bonjour Fares, je suis intéressé(e) par vos services de création de contenu.",
  },
  collab_ambassador: {
    en: () => "Hello Fares, I'd like to discuss a brand ambassadorship partnership.",
    fr: () =>
      "Bonjour Fares, j'aimerais discuter d'un partenariat d'ambassadeur de marque.",
  },
  collab_athlete: {
    en: () => "Hello Fares, I'm interested in an athlete partnership opportunity.",
    fr: () =>
      "Bonjour Fares, je suis intéressé(e) par un partenariat athlète.",
  },
  collab_consulting: {
    en: () => "Hello Fares, I need technical consulting for spearfishing products.",
    fr: () =>
      "Bonjour Fares, j'ai besoin de conseil technique pour des produits de pêche sous-marine.",
  },
};

export function normalizeWhatsAppNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function buildWhatsAppUrl(
  number: string,
  templateKey: TemplateKey = "general",
  vars: Record<string, string> = {},
  locale: Locale = "en",
): string {
  const digits = normalizeWhatsAppNumber(number);
  const template = templates[templateKey] ?? templates.general;
  const text = template[locale](vars);
  if (!digits) {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
