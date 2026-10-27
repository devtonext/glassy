import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { cardClass, secondaryButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import type { Message } from "@/lib/types";

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();
  const count = (table: string) => supabase.from(table).select("*", { count: "exact", head: true });

  const [projects, highlights, testimonials, unread, recent] = await Promise.all([
    count("projects"),
    count("highlights"),
    count("testimonials"),
    count("messages").eq("is_read", false),
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(5).returns<Message[]>(),
  ]);

  const stats = [
    { label: "Projects", value: projects.count ?? 0, href: "/admin/projects" },
    { label: "Highlights", value: highlights.count ?? 0, href: "/admin/highlights" },
    { label: "Testimonials", value: testimonials.count ?? 0, href: "/admin/testimonials" },
    { label: "Unread messages", value: unread.count ?? 0, href: "/admin/messages" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Everything on your site is editable from here. Changes go live as soon as you save."
        actions={
          <a href="/" target="_blank" className={secondaryButton}>
            View site ↗
          </a>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`${cardClass} p-5 transition hover:bg-white`}>
            <p className="text-3xl font-semibold tracking-tight text-ink">{s.value}</p>
            <p className="mt-1 text-xs text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-5">
        <section className={`${cardClass} p-5 md:col-span-3`}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Recent messages</h2>
            <Link href="/admin/messages" className="text-xs font-medium text-ink-soft hover:underline">
              View all
            </Link>
          </div>
          {recent.data && recent.data.length > 0 ? (
            <ul className="mt-3 divide-y divide-slate-200/70">
              {recent.data.map((m) => (
                <li key={m.id} className="py-3">
                  <div className="flex items-center gap-2">
                    {!m.is_read && <span className="size-2 rounded-full bg-sky-600" aria-label="Unread" />}
                    <p className="truncate text-sm font-medium text-ink">{m.name}</p>
                    <p className="ml-auto shrink-0 text-xs text-slate-500">
                      {new Date(m.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted">{m.subject || m.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">No messages yet. They will appear here when visitors use your contact form.</p>
          )}
        </section>

        <section className={`${cardClass} p-5 md:col-span-2`}>
          <h2 className="font-semibold text-ink">Quick actions</h2>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/admin/site" className={secondaryButton}>Edit profile & hero</Link>
            <Link href="/admin/projects/new" className={secondaryButton}>Add a project</Link>
            <Link href="/admin/testimonials/new" className={secondaryButton}>Add a testimonial</Link>
          </div>
        </section>
      </div>
    </>
  );
}
