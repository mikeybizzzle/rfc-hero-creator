import type { Metadata } from "next";
import { findWalkthrough } from "@/lib/chats";
import { baseTemplates, heroRefsSorted, heroRefName, heroRefRank } from "@/lib/data";
import { CardSlider } from "@/components/card-slider";
import { CopyImageCard } from "@/components/copy-image-card";
import { ExampleDropdown } from "@/components/chat-example";
import { FlowHeader, StepHeading } from "@/components/flow";
import { PromptForm } from "@/components/prompt-form";

export const metadata: Metadata = {
  title: "Hero Character Image — RFC Hero Creator",
  description: "Turn a photo into a Last Z hero card with ChatGPT in three steps.",
};

const templateOrder = ["s-orange-template", "a-purple-template", "b-blue-template"];
const templateLabels: Record<string, string> = {
  "s-orange-template": "S Rank",
  "a-purple-template": "A Rank",
  "b-blue-template": "B Rank",
};

export default function HeroPage() {
  const walkthrough = findWalkthrough("hero-card-from-photo")!;
  const orderedTemplates = templateOrder
    .map((slug) => baseTemplates.find((t) => t.slug === slug))
    .filter((t): t is (typeof baseTemplates)[number] => Boolean(t));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <FlowHeader
        eyebrow="Hero character image"
        title="Make your hero card"
        steps={[
          "Copy the base card into ChatGPT.",
          "Copy a hero style into ChatGPT — it doesn't matter too much who you pick.",
          "Copy the prompt, fill out your info, add your photo, paste it into ChatGPT, and hit Go.",
        ]}
      />

      <div className="mb-10">
        <ExampleDropdown walkthrough={walkthrough} />
      </div>

      <section className="mb-10">
        <StepHeading n="1" title="Copy the base card" />
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl">
          {orderedTemplates.map((t, i) => (
            <CopyImageCard
              key={t.slug}
              image={t}
              label={templateLabels[t.slug]}
              sizes="(max-width: 640px) 33vw, 200px"
              priority={i === 0}
            />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <StepHeading n="2" title="Copy a hero style" />
        <CardSlider>
          {heroRefsSorted.map((h) => (
            <CopyImageCard
              key={h.slug}
              image={h}
              label={`${heroRefRank(h)} ${heroRefName(h)}`}
              sizes="(max-width: 640px) 30vw, 168px"
            />
          ))}
        </CardSlider>
      </section>

      <section>
        <StepHeading n="3" title="Copy the prompt" />
        <p className="text-sm text-muted leading-relaxed mb-5 max-w-2xl">
          Paste both images into a new ChatGPT conversation in order, attach the photo of
          the person to transform as Image 3, then paste this prompt and send.
        </p>
        <PromptForm mode="photo" />
      </section>
    </div>
  );
}
