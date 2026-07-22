import Image from "next/image";
import Link from "next/link";
import { findGallery, galleryName } from "@/lib/data";

const showcaseSlugs = [
  "ausryte",
  "supert",
  "ironbastion",
  "kriss-de-valnor",
  "deathhawk",
  "coqueta-farm",
];

const slots = [
  {
    n: "1",
    title: "Base template",
    text: "The empty hero-card background for your rank (S, A, or B). Download it from the Templates page.",
  },
  {
    n: "2",
    title: "Style reference",
    text: "An example hero card that shows ChatGPT the target style, lighting, placement, and scale.",
  },
  {
    n: "3",
    title: "Your photo",
    text: "The person or character to transform into the hero. Skippable — you can describe a character in text instead.",
  },
];

export default function Home() {
  const showcase = showcaseSlugs.map(findGallery);

  return (
    <div>
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 md:pt-24 md:pb-16">
          <p className="hud text-xs text-gold mb-4">RFC Alliance — Last Z: Survival Shooter</p>
          <h1 className="display text-4xl md:text-6xl leading-[0.95] max-w-3xl">
            Make your own hero character card
          </h1>
          <p className="text-muted text-base md:text-lg leading-relaxed max-w-2xl mt-6">
            One ChatGPT message turns your photo into a cinematic Last Z hero card. This
            guide gives you the exact prompt, the base card templates, and the reference
            images — the same setup used for every card in the gallery below.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/guide"
              className="hud text-xs px-5 py-3 bg-gold text-bg hover:bg-gold-bright transition-colors"
            >
              Start the guide
            </Link>
            <Link
              href="/builder"
              className="hud text-xs px-5 py-3 border border-gold text-gold hover:bg-gold hover:text-bg transition-colors"
            >
              Build your prompt
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-14">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {showcase.map((img, i) => (
              <Link
                key={img.slug}
                href="/gallery"
                className={`card-frame overflow-hidden group ${i > 2 ? "hidden md:block" : ""}`}
              >
                <div className="relative aspect-square">
                  <Image
                    src={img.src}
                    alt={galleryName(img)}
                    fill
                    sizes="(max-width: 768px) 33vw, 16vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    priority={i < 3}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="hud text-xs text-gold mb-3">How it works</p>
        <h2 className="display text-2xl md:text-3xl mb-10">One prompt, three images</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {slots.map((s) => (
            <div key={s.n} className="card-frame p-6">
              <div className="display text-3xl text-gold/40 mb-4">Image {s.n}</div>
              <h3 className="hud text-sm text-cream mb-2">{s.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted leading-relaxed mt-8 max-w-2xl">
          Attach all three to a single ChatGPT message along with the prompt from the
          builder, filled with your hero name and any extra design details. Want a group
          scene or a character without a photo? The{" "}
          <Link href="/walkthroughs" className="text-cream underline decoration-line underline-offset-4 hover:decoration-gold">
            walkthroughs
          </Link>{" "}
          cover both.
        </p>
      </section>
    </div>
  );
}
