import type { Metadata } from "next";
import { findWalkthrough } from "@/lib/chats";
import { gallery, galleryName } from "@/lib/data";
import { CardSlider } from "@/components/card-slider";
import { CopyImageCard } from "@/components/copy-image-card";
import { ExampleDropdown } from "@/components/chat-example";
import { FlowHeader, StepHeading } from "@/components/flow";
import { ProcessStrip } from "@/components/process-strip";
import { PromptForm } from "@/components/prompt-form";

export const metadata: Metadata = {
  title: "Custom Image — RFC Hero Creator",
  description:
    "Make any kind of hero image — like a group scene — with ChatGPT's help writing the prompt.",
};

export default function CustomPage() {
  const walkthrough = findWalkthrough("group-scene")!;

  return (
    <div>
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-4xl px-4 pt-8 md:pt-12 pb-6">
          <FlowHeader
            eyebrow="Custom image"
            title="Make any kind of hero image"
            steps={[
              "Copy the base image you want to build on into ChatGPT.",
              "Copy each hero you want in the scene into ChatGPT.",
              "Describe your image, copy the prompt below, paste it into ChatGPT, and send it — ChatGPT writes the full prompt; send that back with the same images.",
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
          <StepHeading n="1" title="Copy the base image" />
          <p className="text-sm text-muted leading-relaxed mb-4 max-w-2xl">
            Image 1 is the image you want to work from — pick one from the cards in step
            2, or use your own.
          </p>
        </section>

        <section className="mb-10">
          <StepHeading n="2" title="Copy your heroes" />
          <CardSlider>
            {gallery.map((g) => (
              <CopyImageCard
                key={g.slug}
                image={g}
                label={galleryName(g)}
                sizes="(max-width: 640px) 30vw, 168px"
              />
            ))}
          </CardSlider>
        </section>

        <section>
          <StepHeading n="3" title="Ask ChatGPT to write your prompt" />
          <p className="text-sm text-muted leading-relaxed mb-5 max-w-2xl">
            Describe your image, copy the prompt, and paste it into ChatGPT. ChatGPT
            replies with a full image prompt — copy that reply and send it back in the
            same conversation with the same images.
          </p>
          <PromptForm mode="group" />
        </section>
      </div>
    </div>
  );
}
