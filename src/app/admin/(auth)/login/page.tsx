import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/AuthForms";
import { cardClass } from "@/components/admin/ui";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  if (!isSupabaseConfigured) redirect("/admin/setup");
  const { error } = await searchParams;

  return (
    <div className={`${cardClass} p-7 sm:p-8`}>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Sign in to edit your portfolio.</p>
      <div className="mt-6">
        <LoginForm initialError={error === "not-admin" ? "This account does not have admin access." : undefined} />
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        First time here? <Link href="/admin/setup" className="font-medium text-ink underline">Run the setup</Link>
      </p>
    </div>
  );
}
