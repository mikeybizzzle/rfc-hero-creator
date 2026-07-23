"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("Wizard.unique");
  const tShared = useTranslations("Wizard.shared");
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState<"how" | "ex" | null>(null);
  const [rank, setRank] = useState<Rank>("B");
  const [custom, setCustom] = useState(false);
  const [customLetter, setCustomLetter] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [heroName, setHeroName] = useState("");
  const [details, setDetails] = useState("");
  const { toast, copied, flash, copyImage } = useCopyToast();

  const stepNames = [t("step1Name"), t("step2Name"), t("step3Name")];
  const ctas = [t("cta1"), t("cta2"), t("cta3")];
  const strong = (chunks: React.ReactNode) => (
    <strong className="text-cream">{chunks}</strong>
  );

  const prompt = heroCardNoPhotoPrompt(
    custom ? { letter: customLetter, color: customColor } : rank,
    heroName,
    details
  );

  function next() {
    if (step >= 3) {
      setStep(1);
      setModal(null);
      flash(t("doneToast"));
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="wizard-panel mx-auto max-w-[560px] sm:max-w-[680px]">
      <div className="mb-2 text-right text-xs font-extrabold text-muted">
        {tShared("stepOf", { step, total: 3 })}
      </div>
      <Stepper names={stepNames} step={step} onGo={setStep} />

      <div className="min-h-[340px] pb-4 pt-4">
        {step === 1 && (
          <section aria-label={t("step1Aria")}>
            <h2 className="display mb-1.5 text-[21px]">{t("step1Title")}</h2>
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
          </section>
        )}

        {step === 2 && (
          <section aria-label={t("step2Aria")}>
            <h2 className="display mb-1.5 text-[21px]">{t("step2Title")}</h2>
            <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
              {t.rich("step2Body", { strong })}
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
            <p className="text-[11.5px] text-muted">{tShared("scrollHint")}</p>
          </section>
        )}

        {step === 3 && (
          <section aria-label={t("step3Aria")}>
            <h2 className="display mb-1.5 text-[21px]">{t("step3Title")}</h2>
            <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
              {t.rich("step3Body", { strong })}
            </p>
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
              {t("detailsLabel")}
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder={t("detailsPlaceholder")}
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
        cta={ctas[step - 1]}
        onNext={next}
      />

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
