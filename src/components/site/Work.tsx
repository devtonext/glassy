"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";

const INITIAL = 3;

export function Work({
  title,
  subtitle,
  projects,
}: {
  title: string | null;
  subtitle: string | null;
  projects: Project[];
}) {
  const [showAll, setShowAll] = useState(false);
  if (projects.length === 0) return null;
  const visible = showAll ? projects : projects.slice(0, INITIAL);

  return (
    <section id="work" className="scroll-mt-24">
      <SectionHeading eyebrow="Portfolio" title={title} subtitle={subtitle} />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <article key={p.id} className="glass relative flex flex-col rounded-3xl p-5">
            <span className="glass-dot absolute top-4 right-4" />
            <div className="flex gap-4">
              <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-steel/40">
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt="" className="size-full object-cover" />
                )}
              </div>
              <h3 className="pr-5 text-lg leading-snug font-medium tracking-tight text-ink">{p.title}</h3>
            </div>
            {p.category && <p className="mt-5 text-sm font-semibold text-ink-soft">{p.category}</p>}
            {p.description && <p className="mt-2 text-xs leading-relaxed text-muted">{p.description}</p>}
            {(p.case_url || p.live_url) && (
              <div className="mt-auto flex gap-2 pt-5">
                {p.case_url && (
                  <a
                    href={p.case_url}
                    className="rounded-full border border-ink/20 px-4 py-2 text-[11px] font-medium text-ink transition hover:bg-white/60"
                  >
                    View case
                  </a>
                )}
                {p.live_url && (
                  <a
                    href={p.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/50 px-4 py-2 text-[11px] font-medium text-ink-soft transition hover:bg-white/80"
                  >
                    Live site
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {projects.length > INITIAL && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="rounded-full bg-ink px-7 py-2.5 text-xs font-medium text-white shadow-lg shadow-ink/25 transition hover:bg-ink-soft"
          >
            {showAll ? "Show less" : "Explore"}
          </button>
        </div>
      )}
    </section>
  );
}
