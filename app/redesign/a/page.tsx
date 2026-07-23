import Image from "next/image";
import Link from "next/link";
import { findGallery } from "@/lib/data";
import { WallMarquee } from "@/components/wall-marquee";
import { navLinks, paths, wallItems } from "../content";

export default function ProtoA() {
  return (
    <div className="proto-a min-h-screen pb-10">
      <header className="sticky top-0 z-40 bg-black">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-5 px-4">
          <Link
            href="/redesign/a"
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
            className="scrollbar-none flex items-center gap-2 overflow-x-auto"
          >
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 rounded-lg bg-[#4760d4] px-3 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-[#5a74e6]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="border-b border-[#e8dcc0] bg-[radial-gradient(900px_360px_at_75%_-20%,rgba(245,166,35,0.18),transparent_60%)]">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-9 sm:pb-12 sm:pt-14">
          <h1 className="lz-display max-w-[860px] text-[clamp(38px,6.8vw,68px)] leading-[0.98] tracking-[-0.01em] text-balance text-[#132e6d]">
            Make your own <span className="text-[#e5691e]">Last&nbsp;Z</span>{" "}
            hero card
          </h1>
          <p className="mt-4 max-w-[620px] text-pretty text-[clamp(16px,2.5vw,19px)] leading-relaxed text-[#515151]">
            Copy a few reference images, fill in a prompt, paste it all into
            ChatGPT. Two minutes, no skills needed.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <section className="pt-9 sm:pt-12">
          <div className="mb-4">
            <h2 className="lz-display text-[clamp(25px,4vw,34px)] text-[#132e6d]">
              Pick your path
            </h2>
            <p className="mt-1 text-[15px] text-[#515151]">
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
                    className="lz-card lz-card-hover group flex h-full snap-start flex-col overflow-hidden"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#eee]">
                      <Image
                        src={img.src}
                        alt={o.title}
                        fill
                        sizes="(max-width: 767px) 82vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        priority={i === 0}
                      />
                    </div>
                    <div className="flex flex-1 flex-col items-start px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5 sm:pt-4">
                      <h3 className="lz-display text-balance text-[22px] leading-tight text-[#132e6d]">
                        {o.title}
                      </h3>
                      <p className="mb-4 mt-1.5 max-w-[46ch] text-sm leading-relaxed text-[#515151]">
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
            <h2 className="lz-display text-[clamp(25px,4vw,34px)]">
              <span className="lz-goldtext">
                <span aria-hidden="true" className="lz-goldtext-outline">
                  The wall
                </span>
                <span className="lz-goldtext-fill">The wall</span>
              </span>
            </h2>
            <p className="mb-4 mt-1 text-[15px] text-[#ffe37e]">
              Heroes forged by RfC so far. Tap any image to copy it — great as
              style references.
            </p>
            <WallMarquee items={wallItems()} tone="light" />
          </div>
        </section>
      </div>

      <footer className="mt-14 bg-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-7 text-[13px] text-[#e5e5e5]">
          <span className="lz-display text-base text-white">RfC alliance</span>
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
