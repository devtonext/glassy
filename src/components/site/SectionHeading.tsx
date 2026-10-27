export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string | null;
  subtitle: string | null;
}) {
  return (
    <div className="text-center">
      <p className="text-xs font-medium tracking-[0.2em] text-faint uppercase">{eyebrow}</p>
      {title && <h2 className="mt-3 text-3xl font-medium tracking-tight text-ink sm:text-4xl">{title}</h2>}
      {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
