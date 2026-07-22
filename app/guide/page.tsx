import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { baseTemplates, findGallery, galleryName, heroRefsSorted, heroRefName } from "@/lib/data";

export const metadata: Metadata = {
  title: "Guide — RFC Hero Creator",
  description: "Step-by-step: create your Last Z hero card with ChatGPT.",
};

const templateOrder = ["s-orange-template", "a-purple-template", "b-blue-template"];
const templateLabels: Record<string, string> = {
  "s-orange-template": "S Rank",
  "a-purple-template": "A Rank",
  "b-blue-template": "B Rank",
};

export default function GuidePage() {
  const orderedTemplates = templateOrder
    .map((slug) => baseTemplates.find((t) => t.slug === slug))
    .filter((t): t is (typeof baseTemplates)[number] => Boolean(t));
  const exampleRefs = heroRefsSorted.slice(0, 4);
  const result = findGallery("ausryte");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <p className="hud text-xs text-gold mb-3">Guide</p>
      <h1 className="display text-3xl md:text-5xl mb-4">Create your hero card</h1>
      <p className="text-muted leading-relaxed max-w-2xl mb-14">
        You need a ChatGPT account with image generation and about five minutes. The
        workflow is one message: a prompt plus three reference images.
      </p>

      <ol className="space-y-14">
        <li>
          <StepHeading n="1" title="Download a base template" />
          <p className="text-sm text-muted leading-relaxed mb-5 max-w-2xl">
            This is Image 1 — the empty card background ChatGPT builds on. Pick the rank
            you want your card to be.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-xl">
            {orderedTemplates.map((t) => (
              <a key={t.slug} href={t.download} download className="card-frame overflow-hidden group">
                <div className="relative aspect-square">
                  <Image
                    src={t.src}
                    alt={`${templateLabels[t.slug]} base template`}
                    fill
                    sizes="(max-width: 640px) 33vw, 200px"
                    className="object-cover"
                    priority
                  />
                </div>
                <p className="hud text-xs text-muted group-hover:text-gold px-2.5 py-2 transition-colors">
                  {templateLabels[t.slug]} — Download
                </p>
              </a>
            ))}
          </div>
        </li>

        <li>
          <StepHeading n="2" title="Download a style reference" />
          <p className="text-sm text-muted leading-relaxed mb-5 max-w-2xl">
            This is Image 2 — an example hero card that shows ChatGPT the target style,
            realism, lighting, character placement, and scale. Any of the{" "}
            <Link href="/templates#heroes" className="text-cream underline decoration-line underline-offset-4 hover:decoration-gold">
              hero references
            </Link>{" "}
            works; the prompt tells ChatGPT not to copy its theme.
          </p>
          <div className="grid grid-cols-4 gap-3 max-w-xl">
            {exampleRefs.map((h) => (
              <div key={h.slug} className="card-frame overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={h.src}
                    alt={heroRefName(h)}
                    fill
                    sizes="(max-width: 640px) 25vw, 150px"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </li>

        <li>
          <StepHeading n="3" title="Pick your photo" />
          <p className="text-sm text-muted leading-relaxed max-w-2xl">
            Image 3 is the person or character to transform. A clear, well-lit photo of
            the face works best — the prompt preserves identity, facial features, and
            personality while turning the subject into a game hero. No photo? Use the
            builder&apos;s no-photo mode and describe your character in text instead.
          </p>
        </li>

        <li>
          <StepHeading n="4" title="Build your prompt" />
          <p className="text-sm text-muted leading-relaxed mb-5 max-w-2xl">
            The prompt builder fills the proven template with your hero name, rank, and
            any extra design details — like &ldquo;dark, powerful, mystical with a lava
            glow from her eyes.&rdquo;
          </p>
          <Link
            href="/builder"
            className="hud text-xs px-5 py-3 inline-block bg-gold text-bg hover:bg-gold-bright transition-colors"
          >
            Open the builder
          </Link>
        </li>

        <li>
          <StepHeading n="5" title="Send it to ChatGPT" />
          <p className="text-sm text-muted leading-relaxed max-w-2xl">
            In a new ChatGPT conversation, attach the three images in order — base
            template, style reference, your photo — paste the prompt, and send. Image
            order matters: the prompt refers to them as Image 1, 2, and 3.
          </p>
        </li>

        <li>
          <StepHeading n="6" title="Refine with follow-ups" />
          <p className="text-sm text-muted leading-relaxed max-w-2xl mb-5">
            Not perfect on the first try? Reply in the same conversation with plain
            requests. A real example from the group-scene walkthrough:
          </p>
          <blockquote className="card-frame border-l-2 border-l-gold p-4 text-sm text-cream/90 leading-relaxed max-w-2xl">
            Love it! Now remove the UI elements (the S, Super T, badges, and default
            diamond party) and reposition the hero&rsquo;s slightly to take up the space of
            the image evenly. Preserve the same level of quality and detail.
          </blockquote>
        </li>
      </ol>

      <div className="mt-16 card-frame p-6 md:p-8 grid md:grid-cols-[200px_1fr] gap-6 items-center">
        <div className="relative aspect-square card-frame overflow-hidden">
          <Image
            src={result.src}
            alt={galleryName(result)}
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="hud text-xs text-gold mb-2">The result</p>
          <p className="text-sm text-muted leading-relaxed">
            Aušrytė — made with exactly this workflow: the S template, one style
            reference, a photo, and the details &ldquo;dark, powerful, mystical with a
            lava glow from her eyes and around her.&rdquo; See the full conversation in
            the{" "}
            <Link
              href="/walkthroughs/hero-card-from-photo"
              className="text-cream underline decoration-line underline-offset-4 hover:decoration-gold"
            >
              walkthrough
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function StepHeading({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-4">
      <span className="display text-2xl text-gold/50">{n}</span>
      <h2 className="display text-xl md:text-2xl">{title}</h2>
    </div>
  );
}
