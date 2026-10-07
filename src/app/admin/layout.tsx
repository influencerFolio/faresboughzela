import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";
import { AdminShell } from "@/components/admin/AdminShell";
import { Inter, Oswald } from "next/font/google";
import "../globals.css";

/** Admin routes hit Firestore at request time — never pre-render at build. */
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
});

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${oswald.variable} bg-surface`}>
        <AdminAuthProvider>
          <AdminShell>{children}</AdminShell>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
