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
    <div className="pb-8">
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-8 md:pt-12">
          <h1 className="display text-[clamp(30px,6vw,46px)] leading-tight mb-2">
            Hero Character (From Image)
          </h1>
          <p className="text-[clamp(15px,2.5vw,18px)] leading-normal text-muted max-w-[640px] text-pretty">
            Turn a photo into a Last Z hero card with your name on it. You&rsquo;ll paste{" "}
            <strong className="text-cream">3 images + 1 prompt</strong> into ChatGPT — everything
            you need is on this page.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-8">
      <div className="mb-4">
        <ProcessStrip
          walkthrough={walkthrough}
          inputLabels={["Base card", "Style", "Photo"]}
          outputLabel="Your hero card"
        />
      </div>

      <HeroFlow />

      <section className="pt-6">
        <h2 className="display text-[22px] mb-1">Made with this flow</h2>
        <p className="text-[14.5px] text-muted leading-normal mb-3">
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

      <nav className="flex flex-wrap gap-x-[18px] gap-y-2 pt-6 font-bold text-sm">
        <Link href="/" className="text-gold hover:text-gold-bright transition-colors">
          &larr; Home
        </Link>
        <Link href="/custom" className="text-gold hover:text-gold-bright transition-colors">
          Next: Custom Image &rarr;
        </Link>
        <Link href="/unique" className="text-gold hover:text-gold-bright transition-colors">
          Hero (Without Image) &rarr;
        </Link>
      </nav>
      </div>
    </div>
  );
}
