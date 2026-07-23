import type { Metadata } from "next";
import Link from "next/link";
import { findWalkthrough } from "@/lib/chats";
import { gallery, galleryName } from "@/lib/data";
import { CardSlider } from "@/components/card-slider";
import { CopyImageCard } from "@/components/copy-image-card";
import { ExampleDropdown } from "@/components/chat-example";
import { FlowHeader, StepHeading } from "@/components/flow";
import { ProcessStrip } from "@/components/process-strip";
import { PromptForm } from "@/components/prompt-form";

export const metadata: Metadata = {
  title: "Custom Image — RfC Hero Forge",
  description:
    "Make any kind of hero image — like a group scene — with ChatGPT's help writing the prompt.",
};

export default function CustomPage() {
  const walkthrough = findWalkthrough("group-scene")!;

  return (
    <div className="pb-8">
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-4 md:pt-10">
          <FlowHeader
            eyebrow="Custom image"
            title="Make any kind of hero image"
            steps={[
              "Copy the base image you want to build on into ChatGPT.",
              "Copy each hero you want in the scene into ChatGPT.",
              "Describe your image, copy the prompt below, paste it into ChatGPT, and send it — ChatGPT writes the full prompt; send that back with the same images.",
            ]}
          />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-8">
      <div className="mb-4">
        <ProcessStrip
          walkthrough={walkthrough}
          inputLabels={["Base image", "Hero", "Hero", "Hero"]}
          outputLabel="Your custom image"
        />
      </div>

      <div className="mb-4">
        <ExampleDropdown walkthrough={walkthrough} />
      </div>

      <div className="space-y-4">
        <section className="card-frame rounded-[18px] p-[18px]">
          <StepHeading n="1" title="Copy the base image" />
          <p className="text-[14.5px] text-muted leading-normal">
            Image 1 is the image you want to work from — pick one from the cards in step
            2, or use your own.
          </p>
        </section>

        <section className="card-frame rounded-[18px] p-[18px]">
          <StepHeading n="2" title="Copy your heroes" />
          <CardSlider>
            {gallery.map((g) => (
              <CopyImageCard
                key={g.slug}
                image={g}
                label={galleryName(g)}
                sizes="(max-width: 640px) 31vw, 175px"
              />
            ))}
          </CardSlider>
        </section>

        <section className="card-frame rounded-[18px] p-[18px]">
          <StepHeading n="3" title="Ask ChatGPT to write your prompt" />
          <p className="text-[14.5px] text-muted leading-normal mb-3.5">
            Describe your image, copy the prompt, and paste it into ChatGPT. ChatGPT
            replies with a full image prompt — copy that reply and send it back in the
            same conversation with the same images.
          </p>
          <PromptForm mode="group" />
        </section>
      </div>

      <nav className="flex flex-wrap gap-x-[18px] gap-y-2 pt-6 font-bold text-sm">
        <Link href="/" className="text-gold hover:text-gold-bright transition-colors">
          &larr; Home
        </Link>
        <Link href="/hero" className="text-gold hover:text-gold-bright transition-colors">
          Hero (From Image) &rarr;
        </Link>
        <Link href="/unique" className="text-gold hover:text-gold-bright transition-colors">
          Hero (Without Image) &rarr;
        </Link>
      </nav>
      </div>
    </div>
  );
}
