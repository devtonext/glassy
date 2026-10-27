import "server-only";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

/** Returns the signed-in admin, or redirects to the login / setup page. */
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect("/admin/setup");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=not-admin");

  return { supabase, user };
}
