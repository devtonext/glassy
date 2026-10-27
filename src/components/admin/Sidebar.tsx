"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/site", label: "Site & profile" },
  { href: "/admin/highlights", label: "Highlights" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/account", label: "Account" },
];

export function Sidebar({ brand, email, unread }: { brand: string; email: string; unread: number }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <aside className="border-b border-white/70 bg-white/55 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between px-5 py-4 lg:block lg:px-6 lg:py-6">
        <Link href="/admin" className="block">
          <span className="block text-lg font-semibold tracking-tight text-ink">{brand}</span>
          <span className="block text-xs text-muted">Admin dashboard</span>
        </Link>
        <div className="flex items-center gap-4 lg:hidden">
          <a href="/" target="_blank" className="text-xs font-medium text-ink-soft underline">
            View site ↗
          </a>
          <form action={logout}>
            <button type="submit" className="text-xs font-medium text-rose-700">
              Log out
            </button>
          </form>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:px-3 lg:pb-0">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition ${
              isActive(item.href) ? "bg-ink text-white" : "text-ink-soft hover:bg-white/80"
            }`}
          >
            {item.label}
            {item.href === "/admin/messages" && unread > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  isActive(item.href) ? "bg-white text-ink" : "bg-ink text-white"
                }`}
              >
                {unread}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="hidden border-t border-white/70 p-4 lg:block">
        <a href="/" target="_blank" className="mb-3 block rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-white/80">
          View site ↗
        </a>
        <p className="truncate px-3 text-xs text-muted" title={email}>
          {email}
        </p>
        <form action={logout}>
          <button type="submit" className="mt-1 px-3 text-xs font-medium text-rose-700 hover:underline">
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
