"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCollection } from "@/lib/admin/collections";
import { readFields } from "@/lib/admin/fields";
import { siteFields } from "@/lib/admin/site-fields";
import { supabaseServiceKey } from "@/lib/supabase/config";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export type FormState = { ok: boolean; message: string } | null;

/** Rebuild the public site so changes show up immediately. */
function refreshSite() {
  revalidatePath("/", "layout");
}

// --- Auth --------------------------------------------------------------------

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: "Wrong email or password." };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { ok: false, message: "This account does not have admin access." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** One-time setup: creates the first admin account. Disabled once an admin exists. */
export async function createFirstAdmin(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!supabaseServiceKey) return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY is missing from your .env file." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (!email || !password) return { ok: false, message: "Enter an email and password." };
  if (password.length < 8) return { ok: false, message: "Use a password with at least 8 characters." };
  if (password !== confirm) return { ok: false, message: "The passwords do not match." };

  const service = createServiceClient();
  const { count, error: countError } = await service
    .from("admins")
    .select("*", { count: "exact", head: true });
  if (countError) return { ok: false, message: "Could not reach the database. Did you run supabase/schema.sql?" };
  if ((count ?? 0) > 0) return { ok: false, message: "An admin already exists. Please log in instead." };

  const { data: created, error: createError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError || !created.user) {
    return { ok: false, message: createError?.message ?? "Could not create the account." };
  }

  const { error: adminError } = await service.from("admins").insert({ user_id: created.user.id, email });
  if (adminError) return { ok: false, message: adminError.message };

  const supabase = await createClient();
  await supabase.auth.signInWithPassword({ email, password });
  redirect("/admin");
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { ok: false, message: "Use a password with at least 8 characters." };
  if (password !== confirm) return { ok: false, message: "The passwords do not match." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Password updated." };
}

// --- Site & profile ----------------------------------------------------------

export async function saveSite(_prev: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const { values, error } = readFields(siteFields, formData);
  if (error) return { ok: false, message: error };

  const { error: dbError } = await supabase
    .from("site")
    .upsert({ id: 1, ...values, updated_at: new Date().toISOString() });
  if (dbError) return { ok: false, message: dbError.message };

  refreshSite();
  return { ok: true, message: "Saved — your site is updated." };
}

// --- Collections (highlights, projects, testimonials) -------------------------

export async function saveItem(
  collectionKey: string,
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const collection = getCollection(collectionKey);
  if (!collection) return { ok: false, message: "Unknown section." };

  const { values, error } = readFields(collection.fields, formData);
  if (error) return { ok: false, message: error };

  if (id) {
    const { error: dbError } = await supabase.from(collection.table).update(values).eq("id", id);
    if (dbError) return { ok: false, message: dbError.message };
  } else {
    const { data: last } = await supabase
      .from(collection.table)
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle<{ position: number }>();
    const { error: dbError } = await supabase
      .from(collection.table)
      .insert({ ...values, position: (last?.position ?? 0) + 1 });
    if (dbError) return { ok: false, message: dbError.message };
  }

  refreshSite();
  redirect(`/admin/${collection.key}?saved=1`);
}

export async function deleteItem(collectionKey: string, id: string) {
  const { supabase } = await requireAdmin();
  const collection = getCollection(collectionKey);
  if (!collection) return;

  await supabase.from(collection.table).delete().eq("id", id);
  refreshSite();
  revalidatePath(`/admin/${collection.key}`);
}

/** Swap an item with its neighbour to move it up or down the list. */
export async function moveItem(collectionKey: string, id: string, direction: "up" | "down") {
  const { supabase } = await requireAdmin();
  const collection = getCollection(collectionKey);
  if (!collection) return;

  const { data: rows } = await supabase
    .from(collection.table)
    .select("id, position")
    .order("position")
    .returns<{ id: string; position: number }[]>();
  if (!rows) return;

  const index = rows.findIndex((r) => r.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= rows.length) return;

  [rows[index], rows[target]] = [rows[target], rows[index]];
  await Promise.all(
    rows.map((row, i) => supabase.from(collection.table).update({ position: i + 1 }).eq("id", row.id)),
  );

  refreshSite();
  revalidatePath(`/admin/${collection.key}`);
}

// --- Messages ----------------------------------------------------------------

export async function setMessageRead(id: string, isRead: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("messages").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}
