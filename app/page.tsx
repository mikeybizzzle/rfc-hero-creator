import Image from "next/image";
import Link from "next/link";
import { findGallery } from "@/lib/data";
import { WallMarquee } from "@/components/wall-marquee";

const paths = [
  {
    href: "/hero",
    title: "Hero Character (From Image)",
    text: "Turn yourself — or anyone — into a hero card with your name on it.",
    imageSlug: "ausryte",
  },
  {
    href: "/unique",
    title: "Hero Character (Without Image)",
    text: "No photo needed — describe your hero and ChatGPT invents them.",
    imageSlug: "coqueta-farm",
  },
  {
    href: "/custom",
    title: "Custom Image",
    text: "Make any kind of hero image you want — group shots, events, themes.",
    imageSlug: "diamond-party-heros",
  },
];

const wall: [string, string][] = [
  ["ausryte", "Aušrytė"],
  ["supert-diamond-party", "SuperT · Diamond Party"],
  ["coqueta-farm", "CoquetaFarm"],
  ["ironbastion", "IronBastion"],
  ["deathhawk", "DeathHawk"],
  ["babyyaga", "BabyYaga"],
  ["kriss-de-valnor", "Kriss de Valnor"],
  ["remon-pharaoh", "Remon Pharaoh"],
  ["yousef-rocket-man", "Yousef Rocket Man"],
  ["nyabinghi-x", "Nyabinghi X"],
  ["azteca-mau", "Azteca Mau"],
  ["castor-troy", "Castor Troy"],
  ["coachardi", "CoachArdi"],
  ["gerardo-o", "Gerardo O"],
  ["jungle-boy", "Jungle Boy"],
  ["jungle-lindy", "Jungle Lindy"],
  ["lolybear", "LolyBear"],
  ["mbizzzle", "MBizzzle"],
  ["mr-bean", "Mr Bean"],
  ["nisse", "Nisse"],
  ["oldhippie", "OldHippie"],
  ["pope-bear", "Pope Bear"],
  ["pope-bear-hot-tub", "Pope Bear · Hot Tub"],
  ["supert", "SuperT"],
  ["diamond-party-heros", "Diamond Party Crew"],
  ["new-season-heros", "New Season Heroes"],
];

export default function Home() {
  const wallItems = wall.map(([slug, name]) => {
    const img = findGallery(slug);
    return { src: img.src, copyUrl: img.download ?? img.src, name };
  });

  return (
    <div className="pb-10">
      <section className="atmosphere border-b border-line/60">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-9 sm:pb-12 sm:pt-14">
          <h1 className="display max-w-[860px] text-[clamp(38px,6.8vw,68px)] leading-[1.02] tracking-[-0.01em] text-balance">
            Make your own{" "}
            <span className="lz-goldtext">
              <span aria-hidden="true" className="lz-goldtext-outline">
                Last&nbsp;Z
              </span>
              <span className="lz-goldtext-fill">Last&nbsp;Z</span>
            </span>{" "}
            hero card
          </h1>
          <p className="mt-4 max-w-[620px] text-pretty text-[clamp(16px,2.5vw,19px)] leading-relaxed text-muted">
            Copy a few reference images, fill in a prompt, paste it all into
            ChatGPT. Two minutes, no skills needed.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <section className="pt-9 sm:pt-12">
          <div className="mb-4">
            <h2 className="display text-[clamp(25px,4vw,34px)]">Pick your path</h2>
            <p className="mt-1 text-[15px] text-muted">
              Three ways to forge an image — each page walks you through it.
            </p>
          </div>
          <div className="scrollbar-none -mx-4 overflow-x-auto overscroll-x-contain px-4 pb-3 snap-x snap-mandatory md:mx-0 md:overflow-visible md:px-0 md:pb-0">
            <div className="grid auto-cols-[min(82vw,340px)] grid-flow-col gap-3.5 md:auto-cols-auto md:grid-flow-row md:grid-cols-3">
              {paths.map((o, i) => {
                const img = findGallery(o.imageSlug);
                return (
                  <Link
                    key={o.href}
                    href={o.href}
                    className="interactive-card card-frame group flex h-full snap-start flex-col overflow-hidden text-cream"
                  >
                    <div className="relative aspect-square overflow-hidden bg-black/40">
                      <Image
                        src={img.src}
                        alt={o.title}
                        fill
                        sizes="(max-width: 767px) 82vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        priority={i === 0}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col items-start px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5 sm:pt-4">
                      <h3 className="display text-balance text-[22px] leading-tight text-gold">
                        {o.title}
                      </h3>
                      <p className="mb-4 mt-1.5 max-w-[46ch] text-sm leading-relaxed text-muted">
                        {o.text}
                      </p>
                      <span className="lz-cta mt-auto inline-flex min-h-10 items-center gap-2 px-5 text-[15px]">
                        Start <span aria-hidden="true">&rarr;</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pt-10 sm:pt-14">
          <div className="lz-red-panel overflow-hidden px-4 pb-5 pt-5 sm:px-6 sm:pt-6">
            <h2 className="display text-[clamp(25px,4vw,34px)]">
              <span className="lz-goldtext">
                <span aria-hidden="true" className="lz-goldtext-outline">
                  The wall
                </span>
                <span className="lz-goldtext-fill">The wall</span>
              </span>
            </h2>
            <p className="mb-4 mt-1 text-[15px] text-gold">
              Heroes forged by RfC so far. Tap any image to copy it — great as
              style references.
            </p>
            <WallMarquee items={wallItems} />
          </div>
        </section>
      </div>
    </div>
  );
}
