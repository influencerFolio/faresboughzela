"use client";

import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: "dashboard",
    hint: "Overview",
  },
  {
    href: "/admin/settings",
    label: "General",
    icon: "settings",
    hint: "Contact & social",
  },
  {
    href: "/admin/homepage",
    label: "Homepage",
    icon: "home",
    hint: "Hero & sections",
  },
  {
    href: "/admin/about",
    label: "About",
    icon: "person",
    hint: "Bio & highlights",
  },
  {
    href: "/admin/portfolio",
    label: "Portfolio",
    icon: "photo_library",
    hint: "Projects & media",
  },
  {
    href: "/admin/services",
    label: "Services",
    icon: "scuba_diving",
    hint: "Training offers",
  },
  {
    href: "/admin/inbox",
    label: "Inbox",
    icon: "mail",
    hint: "Messages",
  },
  {
    href: "/admin/seo",
    label: "SEO",
    icon: "search",
    hint: "Search listings",
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [loading, user, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface">
        Loading…
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="flex min-h-screen">
        <aside className="flex w-64 shrink-0 flex-col border-r border-outline-variant/30 bg-surface-container-lowest p-space-md">
          <div>
            <p className="label-caps text-primary">Fares CMS</p>
            <p className="mt-1 truncate text-xs text-tertiary">{user.email}</p>
          </div>
          <nav className="mt-space-lg flex-1 space-y-1">
            {links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                    active
                      ? "bg-surface-container-high text-on-surface"
                      : "text-tertiary hover:bg-surface-container/60 hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined mt-0.5 text-[20px]">
                    {link.icon}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{link.label}</span>
                    <span className="block text-[11px] opacity-70">{link.hint}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => logout()}
            className="mt-space-md flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary-container hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Logout
          </button>
        </aside>
        <main className="min-w-0 flex-1 overflow-x-hidden p-space-xl">{children}</main>
      </div>
    </div>
  );
}
