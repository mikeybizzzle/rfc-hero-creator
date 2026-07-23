"use client";

import Image from "next/image";
import { useState } from "react";
import { heroCardPrompt, type Rank } from "@/lib/prompts";
import {
  CopyTile,
  ExampleChatModal,
  PromptActions,
  RankPicker,
  StepSection,
  Toast,
  TopActions,
  useCopyToast,
  WizardModal,
  inputClass,
  labelClass,
  type ChatImage,
} from "./shared";

export type WizardImage = {
  src: string;
  copyUrl: string;
  name: string;
  label: string;
};

const CTAS = [
  "I PASTED THE BASE CARD →",
  "I PASTED THE STYLE →",
  "I ATTACHED MY PHOTO →",
  "DONE (RESET)",
];

export function HeroWizard({
  templates,
  styles,
  photoExample,
  exampleInputs,
  exampleOutput,
}: {
  templates: WizardImage[];
  styles: WizardImage[];
  photoExample: ChatImage;
  exampleInputs: ChatImage[];
  exampleOutput: ChatImage;
}) {
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState<"how" | "ex" | null>(null);
  const [rank, setRank] = useState<Rank>("S");
  const [custom, setCustom] = useState(false);
  const [customLetter, setCustomLetter] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [heroName, setHeroName] = useState("");
  const [details, setDetails] = useState("");
  const { toast, copied, flash, copyImage } = useCopyToast();

  const prompt = heroCardPrompt(
    custom ? { letter: customLetter, color: customColor } : rank,
    heroName,
    details
  );

  function next() {
    if (step >= 4) {
      setStep(1);
      setModal(null);
      flash("All set — ChatGPT is forging your hero (1–2 min)");
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="wizard-panel mx-auto max-w-[560px] sm:max-w-[680px]">
      <TopActions onHow={() => setModal("how")} onExample={() => setModal("ex")} />

      <div className="grid gap-2.5">
        <StepSection
          index={1}
          title="Copy a base card"
          step={step}
          onOpen={setStep}
          cta={CTAS[0]}
          onNext={next}
        >
          <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
            Copy + paste a base card into ChatGPT.{" "}
            <strong className="text-cream">(Tap a card to copy it.)</strong>{" "}
            Rank &amp; colors come in step 4 — any card works.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {templates.map((t) => (
              <CopyTile
                key={t.src}
                src={t.src}
                alt={t.name}
                label={t.label}
                sizes="(max-width: 640px) 30vw, 176px"
                copied={copied === t.copyUrl}
                onCopy={() => copyImage(t.copyUrl, t.name)}
              />
            ))}
          </div>
        </StepSection>

        <StepSection
          index={2}
          title="Copy a style example"
          step={step}
          onOpen={setStep}
          cta={CTAS[1]}
          onNext={next}
        >
          <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
            Copy + paste a style example into ChatGPT.{" "}
            <strong className="text-cream">(Tap an image to copy it.)</strong>{" "}
            It only shows the art style — anyone works.
          </p>
          <div className="scrollbar-none -mx-3.5 flex gap-2 overflow-x-auto px-3.5 pb-2">
            {styles.map((s) => (
              <CopyTile
                key={s.src}
                src={s.src}
                alt={s.name}
                label={s.label}
                sizes="112px"
                className="w-28 shrink-0"
                copied={copied === s.copyUrl}
                onCopy={() => copyImage(s.copyUrl, s.name)}
              />
            ))}
          </div>
          <p className="text-[11.5px] text-muted">
            Scroll for more &rarr; · Copy blocked? Press &amp; hold the image.
          </p>
        </StepSection>

        <StepSection
          index={3}
          title="Attach your photo"
          step={step}
          onOpen={setStep}
          cta={CTAS[2]}
          onNext={next}
        >
          <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
            In ChatGPT, <strong className="text-cream">attach 1–3 photos</strong>{" "}
            of the person or character you&rsquo;re transforming. Clear,
            well-lit shots work best.
          </p>
          <div className="flex items-center gap-3 rounded-xl border border-line bg-raised p-3">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[10px] border border-line">
              <Image
                src={photoExample.src}
                alt={photoExample.alt}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <p className="text-[12.5px] leading-normal text-cream/90">
              One clear photo is enough — add up to 3 angles for a better
              likeness. Pets, avatars, and characters work too.
            </p>
          </div>
        </StepSection>

        <StepSection
          index={4}
          title="Build your prompt"
          step={step}
          onOpen={setStep}
          cta={CTAS[3]}
          onNext={next}
        >
          <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
            Fill in the details, then{" "}
            <strong className="text-cream">
              copy + paste the prompt into ChatGPT
            </strong>{" "}
            and hit send.
          </p>
          <RankPicker
            rank={rank}
            custom={custom}
            onPickRank={(r) => {
              setRank(r);
              setCustom(false);
            }}
            onPickCustom={() => setCustom(true)}
            customLetter={customLetter}
            customColor={customColor}
            onLetter={setCustomLetter}
            onColor={setCustomColor}
          />
          <label className={`${labelClass} mb-2.5`}>
            Hero name
            <input
              type="text"
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
              placeholder="e.g. Aušrytė"
              className={inputClass}
            />
          </label>
          <label className={`${labelClass} mb-2.5`}>
            <span>
              Extra details{" "}
              <span className="font-medium text-muted">(optional)</span>
            </span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={2}
              placeholder="e.g. mystical, lava glow eyes"
              className={`${inputClass} resize-y`}
            />
          </label>
          <PromptActions prompt={prompt} onFail={flash} />
        </StepSection>
      </div>

      {modal === "how" && (
        <WizardModal onClose={() => setModal(null)} labelledBy="how-title">
          <div id="how-title" className="display mr-8 text-lg text-gold">
            HOW IT WORKS
          </div>
          <p className="text-[13px] leading-normal text-cream/90">
            We give ChatGPT clear instructions + reference images to turn your
            person/character into a hero character.
          </p>
          <ol className="grid list-decimal gap-1.5 pl-[18px] text-[13px] leading-normal text-cream/90">
            <li>Provide a base card (template).</li>
            <li>Provide a hero image (for style accuracy).</li>
            <li>Provide an image of YOUR person/character (1–3 images).</li>
            <li>Fill out the prompt details and paste into ChatGPT.</li>
            <li>Hit SEND to generate.</li>
          </ol>
          <p className="text-[13px] font-bold leading-normal text-gold">
            Result = a hero card in the same style &amp; format as the
            game&rsquo;s heroes.
          </p>
        </WizardModal>
      )}

      {modal === "ex" && (
        <ExampleChatModal
          onClose={() => setModal(null)}
          inputs={exampleInputs}
          message={
            <>
              Use the 3 attached images as references: Image 1 = the base card,
              Image 2 = the style, Image 3 = the person to transform…{" "}
              <span className="text-[#9b9b9b]">(your prompt)</span>
            </>
          }
          output={exampleOutput}
          outputCaption="ChatGPT — your finished hero card (1–2 min)"
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
