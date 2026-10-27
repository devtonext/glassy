import { Dribbble, GitHub, Instagram, LinkedIn, XLogo } from "@/components/icons";
import type { Project, Site } from "@/lib/types";

export function Footer({ site, projects }: { site: Site; projects: Project[] }) {
  const socials = [
    { href: site.social_x, label: "X", icon: XLogo },
    { href: site.social_linkedin, label: "LinkedIn", icon: LinkedIn },
    { href: site.social_dribbble, label: "Dribbble", icon: Dribbble },
    { href: site.social_instagram, label: "Instagram", icon: Instagram },
    { href: site.social_github, label: "GitHub", icon: GitHub },
  ].filter((s) => s.href);

  const columns = [
    {
      title: "Pages",
      links: [
        { label: "Home", href: "#home" },
        { label: "About", href: "#about" },
        { label: "Portfolio", href: "#work" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Work",
      links: projects.slice(0, 4).map((p) => ({ label: p.title, href: p.case_url || "#work" })),
    },
    {
      title: "Contact",
      links: [
        site.email && { label: site.email, href: `mailto:${site.email}` },
        site.phone && { label: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, "")}` },
        site.location && { label: site.location, href: undefined },
      ].filter(Boolean) as { label: string; href?: string }[],
    },
  ].filter((c) => c.links.length > 0);

  return (
    <footer className="pt-4">
      <div className="grid grid-cols-2 gap-8 border-t border-white/60 pt-10 lg:grid-cols-5">
        <div className="col-span-2">
          <p className="text-lg font-semibold tracking-tight text-ink">{site.brand}</p>
          {site.footer_text && <p className="mt-2 max-w-xs text-sm text-muted">{site.footer_text}</p>}
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="glass grid size-9 place-items-center rounded-full text-ink transition hover:bg-white/80"
                >
                  <Icon />
                </a>
              ))}
            </div>
          )}
        </div>
        {columns.map((col) => (
          <div key={col.title} className="min-w-0 break-words">
            <p className="text-xs font-semibold tracking-wide text-ink uppercase">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label} className="text-sm text-muted">
                  {l.href ? (
                    <a href={l.href} className="transition hover:text-ink">
                      {l.label}
                    </a>
                  ) : (
                    l.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/60 py-6 text-xs text-faint">
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <a href="#home" className="hover:text-ink">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
