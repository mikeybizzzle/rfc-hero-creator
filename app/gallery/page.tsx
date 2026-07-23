import type { Metadata } from "next";
import { LightboxGallery } from "@/components/lightbox-gallery";
import { gallery, galleryName } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery — RfC Hero Forge",
  description: "Hero character cards created for RFC alliance members.",
};

export default function GalleryPage() {
  const items = gallery.map((g) => ({ ...g, name: galleryName(g) }));

  return (
    <div>
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-7 sm:pb-10 sm:pt-11">
          <p className="hud mb-2 text-[11px] text-gold sm:text-xs">Gallery</p>
          <h1 className="display text-balance text-[clamp(34px,5.5vw,52px)] leading-[1.02] tracking-[-0.01em]">
            Alliance heroes
          </h1>
          <p className="mt-3 max-w-[640px] text-pretty text-[clamp(15px,2.5vw,18px)] leading-relaxed text-muted">
            Cards created for RFC members with this workflow. Tap any card to view it full
            size.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <LightboxGallery items={items} />
      </div>
    </div>
  );
}
