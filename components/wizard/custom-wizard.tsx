"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { metaPrompt } from "@/lib/prompts";
import {
  ExampleChatModal,
  StepSection,
  Toast,
  TopActions,
  useCopyToast,
  WizardModal,
  inputClass,
  labelClass,
  type ChatImage,
} from "./shared";

export function CustomWizard({
  exampleInputs,
  exampleOutput,
}: {
  exampleInputs: ChatImage[];
  exampleOutput: ChatImage;
}) {
  const t = useTranslations("Wizard.custom");
  const tShared = useTranslations("Wizard.shared");
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState<"how" | "ex" | null>(null);
  const [idea, setIdea] = useState("");
  const [promptStage, setPromptStage] = useState<0 | 1>(0);
  const [promptDone, setPromptDone] = useState(false);
  const { toast, flash } = useCopyToast();

  const strong = (chunks: React.ReactNode) => (
    <strong className="text-cream">{chunks}</strong>
  );

  const ready = idea.trim() !== "";

  async function handlePrompt() {
    const promptText = metaPrompt(idea);
    if (promptStage === 0) {
      try {
        await navigator.clipboard.writeText(promptText);
        setPromptStage(1);
      } catch {
        flash(tShared("copyFailedToast"));
      }
      return;
    }
    window.open(
      `https://chatgpt.com/?q=${encodeURIComponent(promptText)}`,
      "_blank",
      "noopener"
    );
    setPromptDone(true);
  }

  function next() {
    setModal(null);
    setPromptStage(0);
    setPromptDone(false);
    flash(t("doneToast"));
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
          cta={t("cta1")}
          onNext={next}
          ctaVariant="outline"
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
          <button
            type="button"
            onClick={handlePrompt}
            disabled={!ready}
            className={`lz-cta mb-2 min-h-12 w-full px-3 py-3 text-xs font-extrabold tracking-[.5px] disabled:opacity-50 ${
              ready && !promptDone ? "lz-glow" : ""
            }`}
          >
            {promptDone
              ? `✓ ${t("copyPromptGo")}`
              : promptStage === 1
                ? t("promptAgain")
                : t("copyPromptGo")}
          </button>
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
