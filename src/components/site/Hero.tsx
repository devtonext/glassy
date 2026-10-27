"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import type { Highlight, Site } from "@/lib/types";

const PER_PAGE = 2;

export function Hero({ site, highlights }: { site: Site; highlights: Highlight[] }) {
  const pages = Math.max(1, Math.ceil(highlights.length / PER_PAGE));
  const [page, setPage] = useState(0);
  const visible = highlights.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const [first, ...rest] = site.name.split(" ");

  return (
    <section id="home" className="grid scroll-mt-24 items-center gap-10 pt-10 lg:grid-cols-12 lg:gap-8 lg:pt-14">
      {/* Intro */}
      <div className="animate-rise lg:col-span-4">
        <h1 className="text-5xl leading-[1.02] font-medium tracking-tight text-ink sm:text-6xl">
          {first}
          {rest.length > 0 && (
            <>
              <br />
              {rest.join(" ")}
            </>
          )}
        </h1>
        {site.role && (
          <p className="mt-5 text-3xl leading-tight font-medium tracking-tight text-ink-soft sm:text-4xl">
            {site.role}
          </p>
        )}
        {site.bio && <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{site.bio}</p>}
        {site.hero_cta_label && (
          <a
            href={site.hero_cta_url || "#contact"}
            className="mt-9 inline-flex rounded-full bg-ink px-8 py-3 text-sm font-medium text-white shadow-xl shadow-ink/25 transition hover:-translate-y-0.5 hover:bg-ink-soft"
          >
            {site.hero_cta_label}
          </a>
        )}
      </div>

      {/* Portrait */}
      <div className="animate-rise flex flex-col items-center [animation-delay:120ms] lg:col-span-4">
        <div className="glass w-full max-w-[19rem] rounded-[3rem] p-2.5">
          <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-steel/40">
            {site.photo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={site.photo_url} alt={site.name} className="size-full object-cover" />
            )}
          </div>
        </div>
        {pages > 1 && (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => (p - 1 + pages) % pages)}
              className="glass grid size-9 place-items-center rounded-full text-ink transition hover:bg-white/80"
              aria-label="Previous highlights"
            >
              <ArrowLeft width={15} height={15} />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => (p + 1) % pages)}
              className="glass grid size-9 place-items-center rounded-full text-ink transition hover:bg-white/80"
              aria-label="Next highlights"
            >
              <ArrowRight width={15} height={15} />
            </button>
          </div>
        )}
      </div>

      {/* Highlights */}
      <div className="animate-rise flex flex-col gap-5 [animation-delay:240ms] lg:col-span-4">
        {visible.map((h) => (
          <a
            key={h.id}
            href={h.link_url || "#work"}
            className="glass group relative flex gap-4 rounded-3xl p-4 transition hover:-translate-y-0.5"
          >
            <span className="glass-dot absolute top-3.5 right-3.5" />
            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-steel/40">
              {h.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={h.image_url} alt="" className="size-full object-cover" />
              )}
            </div>
            <div className="min-w-0 pr-5">
              <p className="text-[15px] leading-snug font-medium text-ink">{h.title}</p>
              {h.subtitle && <p className="text-[15px] leading-snug text-ink-soft">{h.subtitle}</p>}
              {h.description && (
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{h.description}</p>
              )}
            </div>
          </a>
        ))}
        {site.hero_secondary_label && (
          <a
            href={site.hero_secondary_url || "#work"}
            className="self-end rounded-full border border-ink/25 px-10 py-3 text-xs font-medium text-ink transition hover:bg-white/50"
          >
            {site.hero_secondary_label}
          </a>
        )}
      </div>
    </section>
  );
}
