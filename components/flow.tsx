export function FlowHeader({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: string;
  steps: string[];
}) {
  return (
    <header className="mb-6">
      <p className="hud text-xs text-gold mb-2">{eyebrow}</p>
      <h1 className="display text-2xl md:text-4xl mb-4">{title}</h1>
      <ol className="space-y-1.5">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm text-muted leading-relaxed">
            <span className="display text-gold shrink-0">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </header>
  );
}

export function StepHeading({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      <span className="display text-xl text-gold">{n}</span>
      <h2 className="display text-lg md:text-xl">{title}</h2>
    </div>
  );
}
