import Image from "next/image";
import Link from "next/link";
import { findGallery, gallery, galleryName } from "@/lib/data";
import { CardSlider } from "@/components/card-slider";

const options = [
  {
    href: "/hero",
    title: "Hero character image",
    text: "Your photo becomes a hero card with your hero name.",
    imageSlug: "ausryte",
  },
  {
    href: "/custom",
    title: "Custom image",
    text: "Make any kind of hero image you want — like a group hero image.",
    imageSlug: "supert",
  },
  {
    href: "/unique",
    title: "Unique hero image",
    text: "No photo — describe a character and ChatGPT creates it.",
    imageSlug: "coqueta-farm",
  },
];

export default function Home() {
  return (
    <div>
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-8 md:pt-16 md:pb-12">
          <p className="hud text-xs text-gold mb-3">RFC Alliance — Last Z: Survival Shooter</p>
          <h1 className="display text-3xl md:text-5xl leading-[0.95] max-w-3xl mb-4">
            Make your own hero card
          </h1>
          <p className="text-muted text-sm md:text-base leading-relaxed max-w-2xl mb-8">
            Real simple: pick one of the three image types below. Each page walks you
            through three copy-paste steps into ChatGPT.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {options.map((o) => {
              const img = findGallery(o.imageSlug);
              return (
                <Link key={o.href} href={o.href} className="card-frame overflow-hidden group">
                  <div className="relative aspect-[2/1] sm:aspect-square">
                    <Image
                      src={img.src}
                      alt={galleryName(img)}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                      priority
                    />
                  </div>
                  <div className="p-3">
                    <h2 className="hud text-sm text-cream mb-1 group-hover:text-gold transition-colors">
                      {o.title}
                    </h2>
                    <p className="text-xs text-muted leading-relaxed">{o.text}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <p className="hud text-xs text-gold mb-4">Made by the alliance</p>
        <CardSlider>
          {gallery.map((g) => (
            <Link key={g.slug} href="/gallery" className="card-frame overflow-hidden snap-start">
              <div className="relative aspect-square">
                <Image
                  src={g.src}
                  alt={galleryName(g)}
                  fill
                  sizes="(max-width: 640px) 30vw, 168px"
                  className="object-cover"
                />
              </div>
            </Link>
          ))}
        </CardSlider>
      </section>
    </div>
  );
}
