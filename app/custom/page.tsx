import type { Metadata } from "next";
import { findWalkthrough } from "@/lib/chats";
import { findGallery, chatImages } from "@/lib/data";
import { ProcessStrip } from "@/components/process-strip";
import { CustomWizard } from "@/components/wizard/custom-wizard";

export const metadata: Metadata = {
  title: "Custom Image — RfC Hero Forge",
  description:
    "Make any kind of hero image — like a group scene — with ChatGPT's help writing the prompt.",
};

const refList: [slug: string, name: string][] = [
  ["supert-diamond-party", "SuperT · Diamond Party"],
  ["supert", "SuperT"],
  ["ausryte", "Aušrytė"],
  ["ironbastion", "IronBastion"],
  ["deathhawk", "DeathHawk"],
  ["babyyaga", "BabyYaga"],
  ["coqueta-farm", "CoquetaFarm"],
  ["kriss-de-valnor", "Kriss de Valnor"],
  ["remon-pharaoh", "Remon Pharaoh"],
  ["yousef-rocket-man", "Yousef Rocket Man"],
  ["nyabinghi-x", "Nyabinghi X"],
  ["castor-troy", "Castor Troy"],
  ["mr-bean", "Mr Bean"],
  ["oldhippie", "OldHippie"],
  ["pope-bear", "Pope Bear"],
  ["lolybear", "LolyBear"],
];

export default function CustomPage() {
  const walkthrough = findWalkthrough("group-scene")!;
  const chat = chatImages.chat2;
  const provided = chat["message-1-provided-images"];
  const output = chat["image-outputs"][0];

  const refs = refList.map(([slug, name]) => {
    const img = findGallery(slug);
    return { src: img.src, copyUrl: img.download ?? img.src, name, label: name };
  });

  return (
    <div className="pb-6">
      <section className="atmosphere border-b border-line/60">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-7 sm:pb-8 sm:pt-10">
          <h1 className="display max-w-[820px] text-balance text-[clamp(30px,5.5vw,46px)] leading-[1.02] tracking-[-0.01em]">
            Custom Image
          </h1>
          <p className="mt-3 max-w-[640px] text-pretty text-[clamp(14px,2.5vw,17px)] leading-relaxed text-muted">
            Group shots, parties, events — anything. The trick:{" "}
            <strong className="text-cream">
              ChatGPT writes the image prompt for you first
            </strong>
            , then you run that prompt. Two messages total.
          </p>
          <div className="mt-4">
            <ProcessStrip
              walkthrough={walkthrough}
              inputLabels={["Base image", "Hero", "Hero", "Hero"]}
              outputLabel="Your custom image"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-5">
        <CustomWizard
          refs={refs}
          exampleInputs={provided.map((img, i) => ({
            src: img.src,
            alt: i === 0 ? "Base image" : "Hero",
          }))}
          exampleOutput={{ src: output.src, alt: "Custom image result" }}
        />
      </div>
    </div>
  );
}
