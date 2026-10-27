import { ArrowUpRight } from "@/components/icons";
import type { Testimonial } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";

export function People({
  title,
  subtitle,
  testimonials,
}: {
  title: string | null;
  subtitle: string | null;
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className="scroll-mt-24">
      <SectionHeading eyebrow="Testimonials" title={title} subtitle={subtitle} />
      <div className="glass mt-8 grid overflow-hidden rounded-3xl md:grid-cols-2">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="relative flex gap-4 border-white/60 p-6 not-last:border-b md:p-7 md:not-last:border-b-0 md:[&:nth-child(odd)]:border-r md:[&:nth-child(n+3)]:border-t md:[&:last-child:nth-child(odd)]:col-span-2 md:[&:last-child:nth-child(odd)]:border-r-0"
          >
            <ArrowUpRight className="absolute top-5 right-5 text-ink/50" width={16} height={16} />
            <div className="size-14 shrink-0 overflow-hidden rounded-full bg-steel/40 ring-4 ring-white/50 sm:size-24">
              {t.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.avatar_url} alt={t.name} className="size-full object-cover" />
              )}
            </div>
            <div className="min-w-0 pr-4">
              <figcaption>
                <p className="text-lg font-medium tracking-tight text-ink">{t.name}</p>
                {t.role && <p className="text-xs text-faint">{t.role}</p>}
              </figcaption>
              <blockquote className="mt-2 text-sm leading-relaxed text-muted">“{t.quote}”</blockquote>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
