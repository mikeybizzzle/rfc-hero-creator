import Link from "next/link";

const protos = [
  {
    href: "/redesign/a",
    label: "A — Game Store",
    text: "Faithful to the Last Z store: cream page, black chrome, orange CTAs, red event panel.",
  },
  {
    href: "/redesign/b",
    label: "B — Dark Ops",
    text: "Same Last Z language on dark ground: gold-outlined display text, red and navy panels.",
  },
  {
    href: "/redesign/c",
    label: "C — Hybrid",
    text: "Current forge structure with the Last Z accent system swapped in.",
  },
];

export default function RedesignIndex() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="display text-3xl">Landing page prototypes</h1>
      <p className="mt-2 text-[15px] text-muted">
        Three directions inspired by the Last Z store UI. Pick one to apply
        sitewide.
      </p>
      <ul className="mt-8 flex flex-col gap-3">
        {protos.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="card-frame interactive-card block px-5 py-4"
            >
              <span className="display text-xl text-gold">{p.label}</span>
              <p className="mt-1 text-sm text-muted">{p.text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
