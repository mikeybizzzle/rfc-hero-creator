"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { metaPrompt } from "@/lib/prompts";
import {
  CopyTile,
  ExampleChatModal,
  PromptActions,
  StepSection,
  Toast,
  TopActions,
  useCopyToast,
  WizardModal,
  inputClass,
  labelClass,
  type ChatImage,
} from "./shared";
import type { WizardImage } from "./hero-wizard";

export function CustomWizard({
  refs,
  exampleInputs,
  exampleOutput,
}: {
  refs: WizardImage[];
  exampleInputs: ChatImage[];
  exampleOutput: ChatImage;
}) {
  const t = useTranslations("Wizard.custom");
  const tShared = useTranslations("Wizard.shared");
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState<"how" | "ex" | null>(null);
  const [idea, setIdea] = useState("");
  const { toast, copied, flash, copyImage } = useCopyToast();

  const ctas = [t("cta1"), t("cta2"), t("cta3")];
  const strong = (chunks: React.ReactNode) => (
    <strong className="text-cream">{chunks}</strong>
  );

  const message = metaPrompt(idea);

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
          <label className={`${labelClass} mb-2.5`}>
            {t("yourDescription")}
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={4}
              placeholder={t("ideaPlaceholder")}
              className={`${inputClass} resize-y`}
            />
          </label>
          <PromptActions
            prompt={message}
            copyLabel={t("copyMessage")}
            viewLabel={t("fullMessage")}
            onFail={flash}
          />
        </StepSection>

        <StepSection
          index={2}
          title={t("step2Title")}
          step={step}
          onOpen={setStep}
          cta={ctas[1]}
          onNext={next}
        >
          <p className="mb-2 text-[13.5px] leading-normal text-muted">
            {t.rich("step2Body", { strong })}
          </p>
          <p className="mb-2 text-xs font-bold text-cream/90">
            {t("needImages")}
          </p>
          <div className="scrollbar-none -mx-3.5 flex gap-2 overflow-x-auto px-3.5 pb-2">
            {refs.map((r) => (
              <CopyTile
                key={r.src}
                src={r.src}
                alt={r.name}
                label={r.label}
                sizes="112px"
                className="w-28 shrink-0"
                copied={copied === r.copyUrl}
                onCopy={() => copyImage(r.copyUrl, r.name)}
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
          <div className="flex items-start gap-2.5 rounded-xl border border-line bg-raised px-3.5 py-3">
            <span className="display text-[15px] text-gold">{t("tip")}</span>
            <p className="text-[12.5px] leading-normal text-cream/90">
              {t.rich("tipBody", {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </p>
          </div>
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
