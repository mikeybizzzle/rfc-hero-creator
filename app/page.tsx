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
    <div className="pb-8">
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-8 md:pt-12 md:pb-10">
          <h1 className="display text-[clamp(34px,7vw,58px)] leading-[1.05] mb-3">
            Make your own{" "}
            <span className="bg-gradient-to-br from-[#fff7de] from-[12%] via-gold via-[45%] to-orange bg-clip-text text-transparent">
              Last&nbsp;Z
            </span>{" "}
            hero card
          </h1>
          <p className="text-[clamp(16px,2.5vw,19px)] leading-normal text-muted max-w-[640px] text-pretty">
            Copy a few reference images, fill in a prompt, paste it all into
            ChatGPT. Two minutes, no skills needed.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
      <section className="pt-8">
        <h2 className="display text-[clamp(22px,4vw,30px)] mb-1">
          Pick your path
        </h2>
        <p className="mb-3.5 text-muted text-[15px]">
          Three ways to forge an image — each page walks you through it.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
          {paths.map((o) => {
            const img = findGallery(o.imageSlug);
            return (
              <Link
                key={o.href}
                href={o.href}
                className="block card-frame overflow-hidden text-cream hover:border-gold transition-colors"
              >
                <div className="relative aspect-square bg-raised">
                  <Image
                    src={img.src}
                    alt={o.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="px-4 pt-3.5 pb-4">
                  <h3 className="display text-xl text-gold">{o.title}</h3>
                  <p className="mt-1.5 mb-2.5 text-sm leading-snug text-muted">
                    {o.text}
                  </p>
                  <span className="font-extrabold text-sm text-gold-bright">
                    Start &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="pt-8">
        <h2 className="display text-[clamp(22px,4vw,30px)] mb-1">The wall</h2>
        <p className="mb-3 text-muted text-[15px]">
          Heroes forged by RfC so far. Tap any image to copy it — great as
          style references.
        </p>
        <WallMarquee items={wallItems} />
      </section>
      </div>
    </div>
  );
}
