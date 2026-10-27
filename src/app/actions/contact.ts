"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

export type ContactState = { ok: boolean; message: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("company")) return { ok: true, message: "Thanks! Your message has been sent." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) return { ok: false, message: "Please fill in your name, email and message." };
  if (!EMAIL_RE.test(email)) return { ok: false, message: "Please enter a valid email address." };
  if (name.length > 120 || email.length > 200 || subject.length > 200 || message.length > 5000)
    return { ok: false, message: "Your message is a little too long." };

  if (!isSupabaseConfigured)
    return { ok: false, message: "The contact form is disabled in demo mode. Connect Supabase to receive messages." };

  const { error } = await createPublicClient()
    .from("messages")
    .insert({ name, email, subject: subject || null, message });

  if (error) {
    console.error("[contact] insert failed:", error.message);
    return { ok: false, message: "Something went wrong. Please try again or email me directly." };
  }
  return { ok: true, message: "Thanks! Your message has been sent." };
}
