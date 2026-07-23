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
    <header className="pt-2 pb-5">
      <p className="hud text-xs text-gold mb-2">{eyebrow}</p>
      <h1 className="display text-[clamp(30px,6vw,46px)] leading-tight mb-2">{title}</h1>
      <ol className="space-y-1.5 max-w-[680px]">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-[15px] text-muted leading-normal">
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
    <div className="flex items-center gap-3 mb-2">
      <span className="display text-[19px] bg-gradient-to-br from-gold to-orange text-ink rounded-[10px] min-w-[34px] h-[34px] grid place-items-center">
        {n}
      </span>
      <h2 className="display text-[22px]">{title}</h2>
    </div>
  );
}
