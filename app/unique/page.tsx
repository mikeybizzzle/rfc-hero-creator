import type { Metadata } from "next";
import { findWalkthrough } from "@/lib/chats";
import { baseTemplates, heroRefsSorted, heroRefName, heroRefRank } from "@/lib/data";
import { CardSlider } from "@/components/card-slider";
import { CopyImageCard } from "@/components/copy-image-card";
import { ExampleDropdown } from "@/components/chat-example";
import { FlowHeader, StepHeading } from "@/components/flow";
import { ProcessStrip } from "@/components/process-strip";
import { PromptForm } from "@/components/prompt-form";

export const metadata: Metadata = {
  title: "Unique Hero Image — RFC Hero Creator",
  description:
    "No photo needed: describe your hero character in text and build the card with ChatGPT.",
};

const templateOrder = ["s-orange-template", "a-purple-template", "b-blue-template"];
const templateLabels: Record<string, string> = {
  "s-orange-template": "S Rank",
  "a-purple-template": "A Rank",
  "b-blue-template": "B Rank",
};
const rankTextClass: Record<string, string> = {
  S: "text-rank-s",
  A: "text-rank-a",
  B: "text-rank-b",
};

export default function UniquePage() {
  const walkthrough = findWalkthrough("hero-card-no-photo")!;
  const orderedTemplates = templateOrder
    .map((slug) => baseTemplates.find((t) => t.slug === slug))
    .filter((t): t is (typeof baseTemplates)[number] => Boolean(t));

  return (
    <div>
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-4xl px-4 pt-8 md:pt-12 pb-6">
          <FlowHeader
            eyebrow="Unique hero image"
            title="Make a hero from a description"
            steps={[
              "Copy the base card into ChatGPT.",
              "Copy five hero styles into ChatGPT — one style reference plus four extras for inspiration.",
              "Fill out your hero's name and details, copy the prompt, paste it into ChatGPT, and send it.",
            ]}
          />

          <div className="mb-3">
            <ProcessStrip walkthrough={walkthrough} />
          </div>

          <ExampleDropdown walkthrough={walkthrough} />
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8 md:py-10">
        <section className="mb-10">
          <StepHeading n="1" title="Copy the base card" />
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl">
            {orderedTemplates.map((t, i) => (
              <CopyImageCard
                key={t.slug}
                image={t}
                label={templateLabels[t.slug].slice(1)}
                prefix={templateLabels[t.slug][0]}
                prefixClass={rankTextClass[templateLabels[t.slug][0]]}
                sizes="(max-width: 640px) 33vw, 200px"
                priority={i === 0}
              />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <StepHeading n="2" title="Copy a few hero styles" />
          <p className="text-sm text-muted leading-relaxed mb-4 max-w-2xl">
            Image 2 is the style reference; Images 3-6 are the four extra examples for
            inspiration.
          </p>
          <CardSlider>
            {heroRefsSorted.map((h) => (
              <CopyImageCard
                key={h.slug}
                image={h}
                label={heroRefName(h)}
                prefix={`${heroRefRank(h)} `}
                prefixClass={rankTextClass[heroRefRank(h)]}
                sizes="(max-width: 640px) 30vw, 168px"
              />
            ))}
          </CardSlider>
        </section>

        <section>
          <StepHeading n="3" title="Copy the prompt" />
          <PromptForm mode="no-photo" />
        </section>
      </div>
    </div>
  );
}
