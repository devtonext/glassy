import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireAdmin();
  const [{ data: site }, { count: unread }] = await Promise.all([
    supabase.from("site").select("brand").eq("id", 1).maybeSingle<{ brand: string }>(),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
  ]);

  return (
    <div className="lg:flex">
      <Sidebar brand={site?.brand ?? "Portfolio"} email={user.email ?? ""} unread={unread ?? 0} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
