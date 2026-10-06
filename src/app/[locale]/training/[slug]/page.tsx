import { redirect } from "@/i18n/navigation";

export default async function TrainingAliasPage({
  params,
}: PageProps<"/[locale]/training/[slug]">) {
  const { locale, slug } = await params;
  redirect({ href: `/services/${slug}`, locale: locale as "en" | "fr" });
}
