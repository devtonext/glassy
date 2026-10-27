import type { Site } from "@/lib/types";

export function About({ site }: { site: Site }) {
  const stats = [
    [site.stat_1_value, site.stat_1_label],
    [site.stat_2_value, site.stat_2_label],
    [site.stat_3_value, site.stat_3_label],
  ].filter(([value]) => value);

  if (!site.about_title && !site.about_text && stats.length === 0) return null;

  return (
    <section id="about" className="grid scroll-mt-24 gap-8 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-6">
        <p className="text-xs font-medium tracking-[0.2em] text-faint uppercase">About</p>
        {site.about_title && (
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-ink sm:text-4xl">{site.about_title}</h2>
        )}
        {site.about_text && <p className="mt-4 text-sm leading-relaxed text-muted">{site.about_text}</p>}
      </div>
      {stats.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:col-span-6">
          {stats.map(([value, label]) => (
            <div key={label ?? value} className="glass rounded-3xl px-4 py-6 text-center">
              <p className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">{value}</p>
              {label && <p className="mt-1 text-xs text-muted">{label}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
