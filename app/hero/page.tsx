import type { Metadata } from "next";
import { baseTemplates, chatImages, heroRefsSorted } from "@/lib/data";
import { HeroWizard } from "@/components/hero-wizard";

export const metadata: Metadata = {
  title: "Hero Character (From Image) — RfC Hero Forge",
  description: "Turn a photo into a Last Z hero card with ChatGPT in four steps.",
};

const templateMeta: Record<string, { name: string; short: string }> = {
  "s-orange-template": { name: "S rank · gold base card", short: "S · gold" },
  "a-purple-template": { name: "A rank · purple base card", short: "A · purple" },
  "b-blue-template": { name: "B rank · blue base card", short: "B · blue" },
};

export default function HeroPage() {
  const order = ["s-orange-template", "a-purple-template", "b-blue-template"];
  const templates = order.map((slug) => {
    const image = baseTemplates.find((t) => t.slug === slug)!;
    return { image, ...templateMeta[slug] };
  });

  const provided = chatImages.chat1["message-1-provided-images"];
  const output = chatImages.chat1["image-outputs"][0];

  return (
    <HeroWizard
      images={{
        templates,
        styles: heroRefsSorted,
        provided,
        output,
      }}
    />
  );
}
