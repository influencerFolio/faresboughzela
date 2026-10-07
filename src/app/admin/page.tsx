import { AdminHealthCheck } from "@/components/admin/AdminHealthCheck";
import Link from "next/link";

const cards = [
  {
    href: "/admin/settings",
    title: "General settings",
    description: "WhatsApp number, email, logo, and social links.",
    icon: "settings",
  },
  {
    href: "/admin/homepage",
    title: "Homepage",
    description: "Hero text, stats, collaboration cards, and CTAs.",
    icon: "home",
  },
  {
    href: "/admin/about",
    title: "About",
    description: "Bio, portrait photo, and highlight cards.",
    icon: "person",
  },
  {
    href: "/admin/portfolio",
    title: "Portfolio",
    description: "Upload project images and edit titles in EN/FR.",
    icon: "photo_library",
  },
  {
    href: "/admin/services",
    title: "Services & training",
    description: "Create training offers and publish them.",
    icon: "scuba_diving",
  },
  {
    href: "/admin/inbox",
    title: "Inbox",
    description: "Contact messages and training registrations.",
    icon: "mail",
  },
  {
    href: "/admin/seo",
    title: "SEO",
    description: "Page titles and descriptions for Google & social.",
    icon: "search",
  },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold uppercase">Dashboard</h1>
      <p className="mt-2 max-w-2xl text-tertiary">
        Edit your site with forms — no code or JSON required. Pick a section to
        update content, then save. Check server status below if save or upload fails.
      </p>
      <AdminHealthCheck />
      <div className="mt-space-xl grid gap-space-md sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-outline-variant/25 bg-surface-container-low p-space-lg transition-colors hover:border-primary-container/50 hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[28px] text-primary">
              {card.icon}
            </span>
            <h2 className="mt-space-md text-lg font-semibold uppercase tracking-wide group-hover:text-primary">
              {card.title}
            </h2>
            <p className="mt-2 text-sm text-tertiary">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
