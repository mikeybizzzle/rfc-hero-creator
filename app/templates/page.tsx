import type { Metadata } from "next";
import Image from "next/image";
import { baseTemplates, heroRefsSorted, heroRefName, heroRefRank } from "@/lib/data";

export const metadata: Metadata = {
  title: "Templates — RFC Hero Creator",
  description:
    "Download the S, A, and B base card templates and hero style references.",
};

const rankText: Record<string, string> = {
  S: "text-rank-s",
  A: "text-rank-a",
  B: "text-rank-b",
};

const templateNames: Record<string, string> = {
  "s-orange-template": "S Rank",
  "a-purple-template": "A Rank",
  "b-blue-template": "B Rank",
};

export default function TemplatesPage() {
  const ordered = ["s-orange-template", "a-purple-template", "b-blue-template"]
    .map((slug) => baseTemplates.find((t) => t.slug === slug)!)
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="hud text-xs text-gold mb-3">Templates</p>
      <h1 className="display text-3xl md:text-5xl mb-4">Downloads</h1>
      <p className="text-muted leading-relaxed max-w-2xl mb-12">
        Everything you attach to your ChatGPT message. Base templates are Image 1; hero
        references are Image 2. All downloads are the full-quality originals.
      </p>

      <section className="mb-16">
        <h2 className="display text-xl md:text-2xl mb-6">Base card templates</h2>
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
          {ordered.map((t) => {
            const rank = templateNames[t.slug]?.[0] ?? "S";
            return (
              <div key={t.slug} className="card-frame overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={t.src}
                    alt={`${templateNames[t.slug]} base template`}
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-3 border-t border-line">
                  <span className={`display text-lg ${rankText[rank]}`}>
                    {templateNames[t.slug]}
                  </span>
                  <a
                    href={t.download}
                    download
                    className="hud text-xs px-3 py-2 border border-gold text-gold hover:bg-gold hover:text-bg transition-colors"
                  >
                    Download PNG
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="heroes" className="scroll-mt-20">
        <h2 className="display text-xl md:text-2xl mb-2">Hero style references</h2>
        <p className="text-sm text-muted leading-relaxed max-w-2xl mb-6">
          Official hero cards from the game. Download any of them to use as Image 2 —
          the style, lighting, and placement reference. In no-photo mode, attach a few
          extra as Images 3-6 for inspiration.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {heroRefsSorted.map((h) => {
            const rank = heroRefRank(h);
            return (
              <a
                key={h.slug}
                href={h.download}
                download
                className="card-frame overflow-hidden group"
              >
                <div className="relative aspect-square">
                  <Image
                    src={h.src}
                    alt={`${rank} rank hero ${heroRefName(h)}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center justify-between px-2.5 py-2">
                  <span className="hud text-xs text-cream truncate">
                    <span className={rankText[rank]}>{rank}</span> {heroRefName(h)}
                  </span>
                  <span className="hud text-xs text-muted group-hover:text-gold transition-colors shrink-0 ml-2">
                    Get
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
