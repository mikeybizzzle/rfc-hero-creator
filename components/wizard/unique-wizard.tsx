"use client";

import { useState } from "react";
import { heroCardNoPhotoPrompt, type Rank } from "@/lib/prompts";
import {
  CopyTile,
  ExampleChatModal,
  PromptActions,
  RankPicker,
  StickyBar,
  Stepper,
  Toast,
  useCopyToast,
  WizardModal,
  inputClass,
  labelClass,
  type ChatImage,
} from "./shared";
import type { WizardImage } from "./hero-wizard";

const STEP_NAMES = ["Base", "Styles", "Prompt"];
const CTAS = [
  "I PASTED THE BASE CARD →",
  "I PASTED MY HERO STYLES →",
  "DONE (RESET)",
];

export function UniqueWizard({
  templates,
  styles,
  exampleInputs,
  exampleOutput,
}: {
  templates: WizardImage[];
  styles: WizardImage[];
  exampleInputs: ChatImage[];
  exampleOutput: ChatImage;
}) {
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState<"how" | "ex" | null>(null);
  const [rank, setRank] = useState<Rank>("B");
  const [custom, setCustom] = useState(false);
  const [customLetter, setCustomLetter] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [heroName, setHeroName] = useState("");
  const [details, setDetails] = useState("");
  const { toast, copied, flash, copyImage } = useCopyToast();

  const prompt = heroCardNoPhotoPrompt(
    rank,
    heroName,
    details,
    custom ? { letter: customLetter, color: customColor } : null
  );

  function next() {
    if (step >= 3) {
      setStep(1);
      setModal(null);
      flash("All set — ChatGPT is forging your hero (1–2 min)");
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="wizard-panel mx-auto max-w-[560px] sm:max-w-[680px]">
      <div className="mb-2 text-right text-xs font-extrabold text-muted">
        Step {step} of 3
      </div>
      <Stepper names={STEP_NAMES} step={step} onGo={setStep} />

      <div className="min-h-[340px] pb-4 pt-4">
        {step === 1 && (
          <section aria-label="Step 1 · Base card">
            <h2 className="display mb-1.5 text-[21px]">Copy a base card</h2>
            <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
              Copy + paste a base card into ChatGPT.{" "}
              <strong className="text-cream">(Tap a card to copy it.)</strong>{" "}
              Rank &amp; colors come in step 3 — any card works.
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
          </section>
        )}

        {step === 2 && (
          <section aria-label="Step 2 · Hero styles">
            <h2 className="display mb-1.5 text-[21px]">Copy 1–2 hero styles</h2>
            <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
              Copy + paste <strong className="text-cream">1–2 heroes</strong>{" "}
              into ChatGPT, one at a time.{" "}
              <strong className="text-cream">(Tap an image to copy it.)</strong>{" "}
              The first sets the style, a second adds inspiration — exact picks
              don&rsquo;t matter much.
            </p>
            <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
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
          </section>
        )}

        {step === 3 && (
          <section aria-label="Step 3 · Describe & prompt">
            <h2 className="display mb-1.5 text-[21px]">
              Describe &amp; build your prompt
            </h2>
            <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
              Name &amp; describe your hero (plus any card changes), pick a
              rank, then{" "}
              <strong className="text-cream">
                copy + paste the prompt into ChatGPT
              </strong>{" "}
              and hit send.
            </p>
            <label className={`${labelClass} mb-2.5`}>
              Hero name
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="e.g. CoquetaFarm"
                className={inputClass}
              />
            </label>
            <label className={`${labelClass} mb-2.5`}>
              Hero details &amp; card changes
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder="e.g. cute and elegant, blonde hair, tight mythical dress. Change the “B” to “F”, change all blue elements to an earthy green, make her dress out of leaves and branches"
                className={`${inputClass} resize-y`}
              />
            </label>
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
            <PromptActions prompt={prompt} onFail={flash} />
          </section>
        )}
      </div>

      <StickyBar
        onHow={() => setModal("how")}
        onExample={() => setModal("ex")}
        cta={CTAS[step - 1]}
        onNext={next}
      />

      {modal === "how" && (
        <WizardModal onClose={() => setModal(null)} labelledBy="how-title">
          <div id="how-title" className="display mr-8 text-lg text-gold">
            HOW IT WORKS
          </div>
          <p className="text-[13px] leading-normal text-cream/90">
            We give ChatGPT clear instructions + reference images to invent a
            brand-new hero character — no photo needed.
          </p>
          <ol className="grid list-decimal gap-1.5 pl-[18px] text-[13px] leading-normal text-cream/90">
            <li>Provide a base card (template).</li>
            <li>Provide 1–2 hero images (style + inspiration).</li>
            <li>
              Describe your hero (name, look, card changes) + fill out the
              prompt, then paste it into ChatGPT.
            </li>
            <li>Hit SEND to generate.</li>
          </ol>
          <p className="text-[13px] font-bold leading-normal text-gold">
            Result = an invented hero card in the same style &amp; format as the
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
              Use the attached images as references: Image 1 = the base card,
              Images 2–3 = hero style examples. Invent a new hero from my
              description… <span className="text-[#9b9b9b]">(your prompt)</span>
            </>
          }
          output={exampleOutput}
          outputCaption="ChatGPT — your invented hero card (1–2 min)"
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
