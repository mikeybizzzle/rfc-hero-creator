import type { Metadata } from "next";
import { LightboxGallery } from "@/components/lightbox-gallery";
import { gallery, galleryName } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery — RFC Hero Creator",
  description: "Hero character cards created for RFC alliance members.",
};

export default function GalleryPage() {
  const items = gallery.map((g) => ({ ...g, name: galleryName(g) }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="hud text-xs text-gold mb-3">Gallery</p>
      <h1 className="display text-3xl md:text-5xl mb-4">Alliance heroes</h1>
      <p className="text-muted leading-relaxed max-w-2xl mb-12">
        Cards created for RFC members with this workflow. Tap any card to view it full
        size.
      </p>
      <LightboxGallery items={items} />
    </div>
  );
}
