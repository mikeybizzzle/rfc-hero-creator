import type { Metadata } from "next";
import { findWalkthrough } from "@/lib/chats";
import {
  baseTemplates,
  heroRefName,
  heroRefsSorted,
  chatImages,
} from "@/lib/data";
import { ProcessStrip } from "@/components/process-strip";
import { UniqueWizard } from "@/components/wizard/unique-wizard";

export const metadata: Metadata = {
  title: "Hero Character (Without Image) — RfC Hero Forge",
  description:
    "No photo needed: describe your hero character in text and build the card with ChatGPT.",
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

export default function UniquePage() {
  const walkthrough = findWalkthrough("hero-card-no-photo")!;
  const chat = chatImages.chat3;
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
      <section className="atmosphere border-b border-line/60">
        <div className="mx-auto max-w-6xl px-4 pb-7 pt-8 sm:pb-9 sm:pt-12">
          <h1 className="display max-w-[860px] text-balance text-[clamp(34px,6vw,56px)] leading-[1.02] tracking-[-0.01em]">
            <span className="lz-goldtext">
              <span aria-hidden="true" className="lz-goldtext-outline">
                Hero&nbsp;Character
              </span>
              <span className="lz-goldtext-fill">Hero&nbsp;Character</span>
            </span>{" "}
            (Without Image)
          </h1>
          <p className="mt-3 max-w-[620px] text-pretty text-[clamp(16px,2.5vw,19px)] leading-relaxed text-muted">
            No photo needed — describe a hero and ChatGPT invents them.
            You&rsquo;ll paste{" "}
            <strong className="text-cream">3 images + 1 prompt</strong> into
            ChatGPT.
          </p>
          <div className="mt-5">
            <ProcessStrip
              walkthrough={walkthrough}
              inputLabels={["Base card", "Hero style", "Hero style"]}
              outputLabel="Your hero card"
            />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8">
        <UniqueWizard
          templates={templates}
          styles={styles}
          exampleInputs={[
            { src: provided[0].src, alt: "Base card" },
            { src: provided[1].src, alt: "Hero style" },
            { src: provided[2].src, alt: "Hero style" },
          ]}
          exampleOutput={{ src: output.src, alt: "Invented hero card" }}
        />
      </div>
    </div>
  );
}
