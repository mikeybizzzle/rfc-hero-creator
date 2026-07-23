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
    <header className="pb-5 pt-2 sm:pb-7">
      <p className="hud mb-2 text-[11px] text-gold sm:text-xs">{eyebrow}</p>
      <h1 className="display max-w-[820px] text-balance text-[clamp(32px,5.5vw,50px)] leading-[1.02] tracking-[-0.01em]">
        {title}
      </h1>
      <ol className="mt-5 grid gap-3 md:grid-cols-3 md:gap-5">
        {steps.map((s, i) => (
          <li
            key={i}
            className="grid grid-cols-[28px_1fr] gap-2.5 text-[14.5px] leading-relaxed text-muted"
          >
            <span className="display grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-line bg-bg/40 text-sm text-gold">
              {i + 1}
            </span>
            <span className="text-pretty">{s}</span>
          </li>
        ))}
      </ol>
    </header>
  );
}

export function StepHeading({ n, title }: { n: string; title: string }) {
  return (
    <div className="relative z-10 mb-2.5 flex items-center gap-3">
      <span className="display grid h-9 min-w-9 place-items-center rounded-[10px] bg-gradient-to-b from-amber to-orange text-[19px] text-white shadow-[0_7px_18px_rgba(232,133,10,.22)]">
        {n}
      </span>
      <h2 className="display text-balance text-[22px] leading-tight sm:text-[24px]">{title}</h2>
    </div>
  );
}
