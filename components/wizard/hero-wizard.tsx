"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Wizard.hero");
  const tShared = useTranslations("Wizard.shared");
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState<"how" | "ex" | null>(null);
  const [rank, setRank] = useState<Rank>("S");
  const [custom, setCustom] = useState(false);
  const [customLetter, setCustomLetter] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [heroName, setHeroName] = useState("");
  const [details, setDetails] = useState("");
  const { toast, copied, flash, copyImage } = useCopyToast();

  const ctas = [t("cta1"), t("cta2"), t("cta3"), t("cta4")];
  const strong = (chunks: React.ReactNode) => (
    <strong className="text-cream">{chunks}</strong>
  );

  const prompt = heroCardPrompt(
    custom ? { letter: customLetter, color: customColor } : rank,
    heroName,
    details
  );

  function next() {
    if (step >= 4) {
      setStep(1);
      setModal(null);
      flash(t("doneToast"));
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
          title={t("step1Title")}
          step={step}
          onOpen={setStep}
          cta={ctas[0]}
          onNext={next}
        >
          <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
            {t.rich("step1Body", { strong })}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {templates.map((tpl) => (
              <CopyTile
                key={tpl.src}
                src={tpl.src}
                alt={tpl.name}
                label={tpl.label}
                sizes="(max-width: 640px) 30vw, 176px"
                copied={copied === tpl.copyUrl}
                onCopy={() => copyImage(tpl.copyUrl, tpl.name)}
              />
            ))}
          </div>
        </StepSection>

        <StepSection
          index={2}
          title={t("step2Title")}
          step={step}
          onOpen={setStep}
          cta={ctas[1]}
          onNext={next}
        >
          <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
            {t.rich("step2Body", { strong })}
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
          <p className="text-[11.5px] text-muted">{tShared("scrollHint")}</p>
        </StepSection>

        <StepSection
          index={3}
          title={t("step3Title")}
          step={step}
          onOpen={setStep}
          cta={ctas[2]}
          onNext={next}
        >
          <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
            {t.rich("step3Body", { strong })}
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
              {t("photoTip")}
            </p>
          </div>
        </StepSection>

        <StepSection
          index={4}
          title={t("step4Title")}
          step={step}
          onOpen={setStep}
          cta={ctas[3]}
          onNext={next}
        >
          <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
            {t.rich("step4Body", { strong })}
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
            {t("heroName")}
            <input
              type="text"
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
              placeholder={t("heroNamePlaceholder")}
              className={inputClass}
            />
          </label>
          <label className={`${labelClass} mb-2.5`}>
            <span>
              {t("extraDetails")}{" "}
              <span className="font-medium text-muted">{t("optional")}</span>
            </span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={2}
              placeholder={t("detailsPlaceholder")}
              className={`${inputClass} resize-y`}
            />
          </label>
          <PromptActions prompt={prompt} onFail={flash} />
        </StepSection>
      </div>

      {modal === "how" && (
        <WizardModal onClose={() => setModal(null)} labelledBy="how-title">
          <div id="how-title" className="display mr-8 text-lg text-gold">
            {tShared("how")}
          </div>
          <p className="text-[13px] leading-normal text-cream/90">
            {t("howIntro")}
          </p>
          <ol className="grid list-decimal gap-1.5 pl-[18px] text-[13px] leading-normal text-cream/90">
            <li>{t("howStep1")}</li>
            <li>{t("howStep2")}</li>
            <li>{t("howStep3")}</li>
            <li>{t("howStep4")}</li>
            <li>{t("howStep5")}</li>
          </ol>
          <p className="text-[13px] font-bold leading-normal text-gold">
            {t("howResult")}
          </p>
        </WizardModal>
      )}

      {modal === "ex" && (
        <ExampleChatModal
          onClose={() => setModal(null)}
          inputs={exampleInputs}
          message={t.rich("exampleMessage", {
            note: (chunks) => <span className="text-[#9b9b9b]">{chunks}</span>,
          })}
          output={exampleOutput}
          outputCaption={t("exampleCaption")}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
