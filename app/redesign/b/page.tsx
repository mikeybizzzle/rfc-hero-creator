import Image from "next/image";
import Link from "next/link";
import { findGallery } from "@/lib/data";
import { WallMarquee } from "@/components/wall-marquee";
import { navLinks, paths, wallItems } from "../content";

export default function ProtoB() {
  return (
    <div className="proto-b min-h-screen pb-10">
      <header className="sticky top-0 z-40 border-b border-[#ffe37e]/15 bg-black/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-5 px-4">
          <Link
            href="/redesign/b"
            className="flex shrink-0 items-center gap-2.5 text-white"
            aria-label="RfC Hero Forge home"
          >
            <span className="lz-display rounded-[9px] bg-gradient-to-b from-[#f5a623] to-[#e8850a] px-2.5 py-1 text-lg leading-none text-white">
              RfC
            </span>
            <span className="lz-display text-xl leading-none">Hero Forge</span>
          </Link>
          <nav
            aria-label="Main navigation"
            className="scrollbar-none flex items-center gap-1 overflow-x-auto"
          >
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 rounded-lg px-3 py-2 text-[13px] font-extrabold text-[#c9bba4] transition-colors hover:bg-white/5 hover:text-[#ffe37e]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="border-b border-[#ffe37e]/10">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-9 sm:pb-12 sm:pt-14">
          <h1 className="lz-display max-w-[860px] text-[clamp(38px,6.8vw,68px)] leading-[1.02] tracking-[-0.01em] text-balance">
            Make your own{" "}
            <span className="lz-goldtext">
              <span aria-hidden="true" className="lz-goldtext-outline">
                Last&nbsp;Z
              </span>
              <span className="lz-goldtext-fill">Last&nbsp;Z</span>
            </span>{" "}
            hero card
          </h1>
          <p className="mt-4 max-w-[620px] text-pretty text-[clamp(16px,2.5vw,19px)] leading-relaxed text-[#c9bba4]">
            Copy a few reference images, fill in a prompt, paste it all into
            ChatGPT. Two minutes, no skills needed.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <section className="pt-9 sm:pt-12">
          <div className="lz-red-panel px-4 pb-5 pt-5 sm:px-6 sm:pt-6">
            <h2 className="lz-display text-[clamp(25px,4vw,34px)] text-white">
              Pick your path
            </h2>
            <p className="mt-1 text-[15px] text-[#ffe37e]">
              Three ways to forge an image — each page walks you through it.
            </p>
            <div className="scrollbar-none -mx-4 mt-4 overflow-x-auto overscroll-x-contain px-4 pb-1 snap-x snap-mandatory md:mx-0 md:overflow-visible md:px-0 md:pb-0">
              <div className="grid auto-cols-[min(78vw,320px)] grid-flow-col gap-3.5 md:auto-cols-auto md:grid-flow-row md:grid-cols-3">
                {paths.map((o, i) => {
                  const img = findGallery(o.imageSlug);
                  return (
                    <Link
                      key={o.href}
                      href={o.href}
                      className="lz-dark-card lz-card-hover group flex h-full snap-start flex-col overflow-hidden"
                    >
                      <div className="relative aspect-square overflow-hidden bg-black/40">
                        <Image
                          src={img.src}
                          alt={o.title}
                          fill
                          sizes="(max-width: 767px) 78vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                          priority={i === 0}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      <div className="flex flex-1 flex-col items-start px-4 pb-4 pt-3.5">
                        <h3 className="lz-display text-balance text-[21px] leading-tight text-[#ffe37e]">
                          {o.title}
                        </h3>
                        <p className="mb-4 mt-1.5 max-w-[46ch] text-sm leading-relaxed text-[#c9bba4]">
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
          </div>
        </section>

        <section className="pt-8 sm:pt-10">
          <div className="lz-navy-panel overflow-hidden px-4 pb-5 pt-5 sm:px-6 sm:pt-6">
            <h2 className="lz-display text-[clamp(25px,4vw,34px)] text-white">
              The wall
            </h2>
            <p className="mb-4 mt-1 text-[15px] text-white/75">
              Heroes forged by RfC so far. Tap any image to copy it — great as
              style references.
            </p>
            <WallMarquee items={wallItems()} />
          </div>
        </section>
      </div>

      <footer className="mt-14 border-t border-[#ffe37e]/10 bg-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-7 text-[13px] text-[#e5e5e5]">
          <span className="lz-display text-base text-[#ffe37e]">
            RfC alliance
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>Last Z: Survival Shooter</span>
            <span aria-hidden="true">·</span>
            <span>Works with the ChatGPT app or chatgpt.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
