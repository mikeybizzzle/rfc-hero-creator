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
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-8 md:pt-12">
          <p className="hud text-xs text-gold mb-2">Gallery</p>
          <h1 className="display text-[clamp(30px,6vw,46px)] leading-tight mb-2">
            Alliance heroes
          </h1>
          <p className="text-[clamp(15px,2.5vw,18px)] leading-normal text-muted max-w-[640px] text-pretty">
            Cards created for RFC members with this workflow. Tap any card to view it full
            size.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <LightboxGallery items={items} />
      </div>
    </div>
  );
}
