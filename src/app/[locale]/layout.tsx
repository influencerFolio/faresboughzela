import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { routing } from "@/i18n/routing";
import { getGeneralSettings } from "@/lib/repositories/content";
import { Inter, Oswald } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "fr")) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const settings = await getGeneralSettings();

  return (
    <html lang={locale} className="dark h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${oswald.variable} min-h-full bg-surface text-on-surface antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <SiteHeader settings={settings} locale={locale as "en" | "fr"} />
          <main className="w-full pt-20">{children}</main>
          <SiteFooter settings={settings} locale={locale as "en" | "fr"} />
          <WhatsAppFab
            number={settings.whatsappNumber}
            locale={locale as "en" | "fr"}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
