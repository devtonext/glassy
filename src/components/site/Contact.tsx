"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "@/app/actions/contact";
import { Mail, MapPin, Phone } from "@/components/icons";
import type { Site } from "@/lib/types";

const input =
  "w-full rounded-2xl border border-white/70 bg-white/45 px-4 py-3 text-sm text-ink placeholder:text-faint outline-none transition focus:border-ink/30 focus:bg-white/75";

export function Contact({ site }: { site: Site }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, null);

  const details = [
    site.email && { icon: Mail, label: site.email, href: `mailto:${site.email}` },
    site.phone && { icon: Phone, label: site.phone, href: `tel:${site.phone.replace(/[^+\d]/g, "")}` },
    site.location && { icon: MapPin, label: site.location },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href?: string }[];

  return (
    <section id="contact" className="glass scroll-mt-24 grid gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-5 lg:gap-12">
      <div className="lg:col-span-2">
        <p className="text-xs font-medium tracking-[0.2em] text-faint uppercase">Contact</p>
        {site.contact_title && (
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-ink">{site.contact_title}</h2>
        )}
        {site.contact_text && <p className="mt-3 text-sm leading-relaxed text-muted">{site.contact_text}</p>}
        <ul className="mt-6 space-y-3">
          {details.map(({ icon: Icon, label, href }) => (
            <li key={label} className="flex items-center gap-3 text-sm text-ink-soft">
              <span className="glass grid size-9 shrink-0 place-items-center rounded-full">
                <Icon width={15} height={15} />
              </span>
              {href ? (
                <a href={href} className="hover:text-ink">
                  {label}
                </a>
              ) : (
                label
              )}
            </li>
          ))}
        </ul>
      </div>

      <form action={action} className="grid gap-3 sm:grid-cols-2 lg:col-span-3">
        <label className="sr-only" htmlFor="c-name">Name</label>
        <input id="c-name" name="name" required maxLength={120} placeholder="Your name" className={input} />
        <label className="sr-only" htmlFor="c-email">Email</label>
        <input id="c-email" name="email" type="email" required maxLength={200} placeholder="Email address" className={input} />
        <label className="sr-only" htmlFor="c-subject">Subject</label>
        <input id="c-subject" name="subject" maxLength={200} placeholder="Subject (optional)" className={`${input} sm:col-span-2`} />
        <label className="sr-only" htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" required maxLength={5000} rows={5} placeholder="Tell me about your project…" className={`${input} resize-none sm:col-span-2`} />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-white shadow-lg shadow-ink/25 transition hover:bg-ink-soft disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send message"}
          </button>
          {state && (
            <p role="status" className={`text-sm ${state.ok ? "text-emerald-700" : "text-rose-700"}`}>
              {state.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
