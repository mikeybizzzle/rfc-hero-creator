import type { Metadata } from "next";
import Link from "next/link";
import { findWalkthrough } from "@/lib/chats";
import { findGallery } from "@/lib/data";
import { CardSlider } from "@/components/card-slider";
import { CopyImageCard } from "@/components/copy-image-card";
import { HeroFlow } from "@/components/hero-flow";
import { ProcessStrip } from "@/components/process-strip";

export const metadata: Metadata = {
  title: "Hero Character (From Image) — RfC Hero Forge",
  description: "Turn a photo into a Last Z hero card with ChatGPT in three steps.",
};

const madeWithFlow: [slug: string, name: string][] = [
  ["ausryte", "Aušrytė"],
  ["ironbastion", "IronBastion"],
  ["deathhawk", "DeathHawk"],
  ["remon-pharaoh", "Remon Pharaoh"],
  ["supert", "SuperT"],
  ["babyyaga", "BabyYaga"],
  ["mr-bean", "Mr Bean"],
  ["castor-troy", "Castor Troy"],
  ["oldhippie", "OldHippie"],
  ["coachardi", "CoachArdi"],
  ["azteca-mau", "Azteca Mau"],
  ["gerardo-o", "Gerardo O"],
];

export default function HeroPage() {
  const walkthrough = findWalkthrough("hero-card-from-photo")!;

  return (
    <div className="pb-10">
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-7 sm:pb-10 sm:pt-11">
          <h1 className="display max-w-[820px] text-balance text-[clamp(34px,5.5vw,52px)] leading-[1.02] tracking-[-0.01em]">
            Hero Character (From Image)
          </h1>
          <p className="mt-3 max-w-[640px] text-pretty text-[clamp(15px,2.5vw,18px)] leading-relaxed text-muted">
            Turn a photo into a Last Z hero card with your name on it. You&rsquo;ll paste{" "}
            <strong className="text-cream">3 images + 1 prompt</strong> into ChatGPT — everything
            you need is on this page.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8">
        <div className="mb-4 sm:mb-5">
          <ProcessStrip
            walkthrough={walkthrough}
            inputLabels={["Base card", "Style", "Photo"]}
            outputLabel="Your hero card"
          />
        </div>

        <HeroFlow />

        <section className="pt-8 sm:pt-10">
          <h2 className="display mb-1 text-[24px] sm:text-[28px]">Made with this flow</h2>
          <p className="mb-3 text-[14.5px] leading-normal text-muted">
            RFC members forged from photos. Tap to copy any of them as extra style references.
          </p>
          <CardSlider>
            {madeWithFlow.map(([slug, name]) => (
              <CopyImageCard
                key={slug}
                image={findGallery(slug)}
                label={name}
                sizes="(max-width: 640px) 31vw, 175px"
              />
            ))}
          </CardSlider>
        </section>

        <nav className="mt-7 flex flex-wrap gap-2 border-t border-line pt-5 text-sm font-bold">
          <Link href="/" className="min-h-10 rounded-lg px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-cream">
            &larr; Home
          </Link>
          <Link href="/custom" className="min-h-10 rounded-lg px-3 py-2 text-gold transition-colors hover:bg-surface hover:text-gold-bright">
            Next: Custom Image &rarr;
          </Link>
          <Link href="/unique" className="min-h-10 rounded-lg px-3 py-2 text-gold transition-colors hover:bg-surface hover:text-gold-bright">
            Hero (Without Image) &rarr;
          </Link>
        </nav>
      </div>
    </div>
  );
}
