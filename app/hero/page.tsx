import type { Metadata } from "next";
import { findWalkthrough } from "@/lib/chats";
import {
  baseTemplates,
  heroRefName,
  heroRefsSorted,
  chatImages,
} from "@/lib/data";
import { ProcessStrip } from "@/components/process-strip";
import { HeroWizard } from "@/components/wizard/hero-wizard";

export const metadata: Metadata = {
  title: "Hero Character (From Image) — RfC Hero Forge",
  description:
    "Turn a photo into a Last Z hero card with ChatGPT in four steps.",
};

const templateMeta: Record<string, { name: string; label: string }> = {
  "s-orange-template": { name: "S rank · gold base card", label: "S · gold" },
  "a-purple-template": {
    name: "A rank · purple base card",
    label: "A · purple",
  },
  "b-blue-template": { name: "B rank · blue base card", label: "B · blue" },
};
const templateOrder = [
  "s-orange-template",
  "a-purple-template",
  "b-blue-template",
];

export default function HeroPage() {
  const walkthrough = findWalkthrough("hero-card-from-photo")!;
  const chat = chatImages.chat1;
  const provided = chat["message-1-provided-images"];
  const output = chat["image-outputs"][0];

  const templates = templateOrder.map((slug) => {
    const t = baseTemplates.find((b) => b.slug === slug)!;
    return {
      src: t.src,
      copyUrl: t.download ?? t.src,
      name: templateMeta[slug].name,
      label: templateMeta[slug].label,
    };
  });

  const styles = heroRefsSorted.map((img) => {
    const name = heroRefName(img);
    return {
      src: img.src,
      copyUrl: img.download ?? img.src,
      name,
      label: name,
    };
  });

  return (
    <div className="pb-6">
      <section className="atmosphere">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-8 pt-7 sm:pt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
          <div>
            <h1 className="display max-w-[820px] text-balance text-[clamp(30px,5.5vw,46px)] leading-[1.02] tracking-[-0.01em]">
              Hero Character (From Image)
            </h1>
            <p className="mt-3 max-w-[640px] text-pretty text-[clamp(14px,2.5vw,17px)] leading-relaxed text-muted">
              Turn a photo into a Last Z hero card with your name on it.
              You&rsquo;ll paste{" "}
              <strong className="text-cream">3 images + 1 prompt</strong> into
              ChatGPT — everything you need is on this page.
            </p>
            <div className="mt-4">
              <ProcessStrip
                walkthrough={walkthrough}
                inputLabels={["Base card", "Style", "Photo"]}
                outputLabel="Your hero card"
              />
            </div>
          </div>
          <HeroWizard
            templates={templates}
            styles={styles}
            photoExample={{ src: provided[2].src, alt: "Example photo" }}
            exampleInputs={[
              { src: provided[0].src, alt: "Base card" },
              { src: provided[1].src, alt: "Style example" },
              { src: provided[2].src, alt: "Your photo" },
            ]}
            exampleOutput={{ src: output.src, alt: "Finished hero card" }}
          />
        </div>
      </section>
    </div>
  );
}
