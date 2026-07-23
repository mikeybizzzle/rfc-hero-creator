import type { Metadata } from "next";
import Link from "next/link";
import { findWalkthrough } from "@/lib/chats";
import { baseTemplates, heroRefsSorted, heroRefName, heroRefRank } from "@/lib/data";
import { CardSlider } from "@/components/card-slider";
import { CopyImageCard } from "@/components/copy-image-card";
import { ExampleDropdown } from "@/components/chat-example";
import { FlowHeader, StepHeading } from "@/components/flow";
import { ProcessStrip } from "@/components/process-strip";
import { PromptForm } from "@/components/prompt-form";

export const metadata: Metadata = {
  title: "Hero Character (Without Image) — RfC Hero Forge",
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
    <div className="pb-10">
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-4 pt-6 sm:pt-9">
          <FlowHeader
            eyebrow="Hero character image"
            title="Hero Character (Without Image)"
            steps={[
              "Copy the base card into ChatGPT.",
              "Copy two hero styles into ChatGPT — one style reference plus one extra for inspiration.",
              "Fill out your hero's name and details, copy the prompt, paste it into ChatGPT, and send it.",
            ]}
          />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8">
        <div className="mb-4 sm:mb-5">
          <ProcessStrip
            walkthrough={walkthrough}
            inputLabels={["Base card", "Hero style", "Hero style"]}
            outputLabel="Your hero card"
          />
        </div>

        <div className="mb-4 sm:mb-5">
          <ExampleDropdown walkthrough={walkthrough} />
        </div>

        <div className="space-y-4 sm:space-y-5">
          <section className="step-panel card-frame rounded-[18px] p-4 sm:p-6">
            <StepHeading n="1" title="Copy the base card" />
            <div className="grid max-w-2xl grid-cols-3 gap-2.5 sm:gap-3">
              {orderedTemplates.map((t, i) => (
                <CopyImageCard
                  key={t.slug}
                  image={t}
                  label={templateLabels[t.slug].slice(1)}
                  prefix={templateLabels[t.slug][0]}
                  prefixClass={rankTextClass[templateLabels[t.slug][0]]}
                  sizes="(max-width: 640px) 30vw, 200px"
                  priority={i === 0}
                />
              ))}
            </div>
          </section>

          <section className="step-panel card-frame rounded-[18px] p-4 sm:p-6">
            <StepHeading n="2" title="Copy two hero styles" />
            <p className="mb-3.5 text-[14.5px] leading-relaxed text-muted">
              Image 2 is the style reference; Image 3 is the extra example for inspiration.
            </p>
            <CardSlider>
              {heroRefsSorted.map((h) => (
                <CopyImageCard
                  key={h.slug}
                  image={h}
                  label={heroRefName(h)}
                  prefix={`${heroRefRank(h)} `}
                  prefixClass={rankTextClass[heroRefRank(h)]}
                  sizes="(max-width: 640px) 31vw, 175px"
                />
              ))}
            </CardSlider>
          </section>

          <section className="step-panel card-frame rounded-[18px] p-4 sm:p-6">
            <StepHeading n="3" title="Copy the prompt" />
            <PromptForm mode="no-photo" />
          </section>
        </div>

        <nav className="mt-7 flex flex-wrap gap-2 border-t border-line pt-5 text-sm font-bold">
          <Link href="/" className="min-h-10 rounded-lg px-3 py-2 text-muted transition-colors hover:bg-surface hover:text-cream">
            &larr; Home
          </Link>
          <Link href="/hero" className="min-h-10 rounded-lg px-3 py-2 text-gold transition-colors hover:bg-surface hover:text-gold-bright">
            Hero (From Image) &rarr;
          </Link>
          <Link href="/custom" className="min-h-10 rounded-lg px-3 py-2 text-gold transition-colors hover:bg-surface hover:text-gold-bright">
            Custom Image &rarr;
          </Link>
        </nav>
      </div>
    </div>
  );
}
