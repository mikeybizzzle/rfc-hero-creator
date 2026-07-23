import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hero Flow Concepts | RfC Hero Forge",
  description: "Private comparison page for three sequential Hero Character flows.",
};

const concepts = [
  {
    number: "01",
    title: "Focus Card",
    href: "/hero/concepts/focus",
    summary:
      "A centered active step with compact progress and a persistent confirmation dock.",
    accent: "from-gold/22 to-orange/5",
  },
  {
    number: "02",
    title: "Visual Workbench",
    href: "/hero/concepts/workbench",
    summary:
      "The selected card dominates the canvas while options stay close in a thumbnail tray.",
    accent: "from-orange/18 to-gold/4",
  },
  {
    number: "03",
    title: "Mission Stack",
    href: "/hero/concepts/missions",
    summary:
      "Completed steps collapse into editable mission summaries while the current task expands.",
    accent: "from-rank-a/16 to-gold/4",
  },
] as const;

export default function HeroConceptsPage() {
  return (
    <div className="min-h-dvh bg-bg pb-12">
      <header className="border-b border-line bg-bg/92">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="display rounded-md bg-gold px-2 py-1 text-sm leading-none text-ink">
              RfC
            </span>
            <span className="text-sm font-extrabold">Hero Forge</span>
          </Link>
          <span className="hud text-[9px] text-muted">Private concepts</span>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-10">
        <p className="hud text-[10px] text-gold">Hero Character workflow study</p>
        <h1 className="display mt-2 max-w-3xl text-4xl leading-[.98] text-cream sm:text-6xl">
          Three ways to keep one decision in focus
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          Each live prototype uses the same sequential rules and content. Compare
          the rhythm, visual hierarchy, and mobile ergonomics before choosing a
          direction.
        </p>

        <div className="mt-8 space-y-3">
          {concepts.map((concept) => (
            <Link
              key={concept.href}
              href={concept.href}
              className={`group grid gap-4 overflow-hidden rounded-2xl border border-line bg-gradient-to-r ${concept.accent} p-4 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-gold/55 sm:grid-cols-[64px_1fr_auto] sm:items-center sm:p-5`}
            >
              <span className="display text-3xl text-gold/75">
                {concept.number}
              </span>
              <span>
                <span className="display block text-2xl text-cream">
                  {concept.title}
                </span>
                <span className="mt-1 block max-w-xl text-sm leading-relaxed text-muted">
                  {concept.summary}
                </span>
              </span>
              <span className="justify-self-start rounded-xl border border-gold/30 bg-bg/55 px-3 py-2 text-xs font-extrabold text-gold transition-colors group-hover:bg-gold group-hover:text-ink sm:justify-self-end">
                Open concept →
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted">
          These routes are unlinked from the production navigation and marked
          noindex.
        </p>
      </div>
    </div>
  );
}
