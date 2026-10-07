import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";
import { AdminShell } from "@/components/admin/AdminShell";
import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "../globals.css";

/** Admin routes are request-time only. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fares CMS",
  robots: { index: false, follow: false },
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
});

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${oswald.variable} bg-surface`}>
        {/* Material icons loaded in body to avoid App Router <head> hydration mismatches */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <AdminAuthProvider>
          <AdminShell>{children}</AdminShell>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
