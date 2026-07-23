"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { heroCardNoPhotoSheetPrompt, type Rank } from "@/lib/prompts";
import { buildReferenceSheet } from "@/lib/reference-sheet";
import { copyImageBlobAsset } from "@/lib/image-clipboard";
import {
  CopyTile,
  RankPicker,
  StepSection,
  Toast,
  TopActions,
  useCopyToast,
  inputClass,
  labelClass,
} from "./shared";
import { HowItWorksModal } from "./example-animation";
import type { WizardImage } from "./hero-wizard";

export function UniqueWizard({
  templates,
  styles,
}: {
  templates: WizardImage[];
  styles: WizardImage[];
}) {
  const t = useTranslations("Wizard.unique");
  const tShared = useTranslations("Wizard.shared");
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState<"how" | null>(null);
  const [rank, setRank] = useState<Rank>("B");
  const [custom, setCustom] = useState(false);
  const [customLetter, setCustomLetter] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [heroName, setHeroName] = useState("");
  const [details, setDetails] = useState("");
  const [selTemplate, setSelTemplate] = useState<number | null>(null);
  const [selStyle, setSelStyle] = useState<number | null>(null);
  const [promptStage, setPromptStage] = useState<0 | 1>(0);
  const [promptDone, setPromptDone] = useState(false);
  const [imagesDone, setImagesDone] = useState(false);
  const [sheetBusy, setSheetBusy] = useState(false);
  const { toast, flash } = useCopyToast();

  function resetProgress() {
    setPromptStage(0);
    setPromptDone(false);
    setImagesDone(false);
  }

  const ctas = [t("cta1"), t("cta2"), t("cta3")];
  const strong = (chunks: React.ReactNode) => (
    <strong className="text-cream">{chunks}</strong>
  );

  const rankSel = custom ? { letter: customLetter, color: customColor } : rank;
  const ready =
    selTemplate !== null &&
    selStyle !== null &&
    heroName.trim() !== "" &&
    details.trim() !== "";

  const slots = [
    {
      label: t("slotBase"),
      src: selTemplate !== null ? templates[selTemplate].src : null,
    },
    {
      label: t("slotStyle"),
      src: selStyle !== null ? styles[selStyle].src : null,
    },
  ];

  async function handlePrompt() {
    const promptText = heroCardNoPhotoSheetPrompt(rankSel, heroName, details);
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

  async function copyImages() {
    setSheetBusy(true);
    try {
      const blob = await buildReferenceSheet([
        { url: templates[selTemplate!].copyUrl, label: "PANEL 1 · BASE CARD" },
        { url: styles[selStyle!].copyUrl, label: "PANEL 2 · STYLE" },
      ]);
      const result = await copyImageBlobAsset(blob, "reference-sheet.png");
      if (result === "copied") {
        setImagesDone(true);
        flash(t("imagesToast"));
      } else if (result === "downloaded") {
        setImagesDone(true);
        flash(t("imagesDownloadedToast"));
      } else {
        flash(tShared("copyBlockedToast"));
      }
    } catch {
      flash(tShared("copyBlockedToast"));
    } finally {
      setSheetBusy(false);
    }
  }

  function next() {
    if (step >= 3) {
      setStep(1);
      setModal(null);
      resetProgress();
      flash(t("doneToast"));
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="wizard-panel mx-auto max-w-[560px] sm:max-w-[680px]">
      <TopActions onHow={() => setModal("how")} />

      <div className="mb-3 grid grid-cols-2 gap-2">
        {slots.map((slot) => (
          <div key={slot.label} className="grid justify-items-center gap-1">
            <div
              className={`relative h-16 w-16 overflow-hidden rounded-lg border bg-raised ${
                slot.src ? "border-gold" : "border-dashed border-line"
              }`}
            >
              {slot.src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slot.src}
                  alt={slot.label}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <span className="text-[10.5px] font-bold text-muted">
              {slot.label}
            </span>
          </div>
        ))}
      </div>

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
            {templates.map((tpl, i) => (
              <CopyTile
                key={tpl.src}
                src={tpl.src}
                alt={tpl.name}
                label={tpl.label}
                sizes="(max-width: 640px) 30vw, 176px"
                copied={false}
                selected={selTemplate === i}
                title={t("selectImageTitle")}
                onCopy={() => {
                  setSelTemplate(i);
                  resetProgress();
                }}
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
            {styles.map((s, i) => (
              <CopyTile
                key={s.src}
                src={s.src}
                alt={s.name}
                label={s.label}
                sizes="112px"
                className="w-28 shrink-0"
                copied={false}
                selected={selStyle === i}
                title={t("selectImageTitle")}
                onCopy={() => {
                  setSelStyle(i);
                  resetProgress();
                }}
              />
            ))}
          </div>
          <p className="text-[11.5px] text-muted">{t("scrollHint")}</p>
        </StepSection>

        <StepSection
          index={3}
          title={t("step3Title")}
          step={step}
          onOpen={setStep}
          cta={ctas[2]}
          onNext={next}
          ctaVariant="outline"
        >
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
          <div className="mb-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePrompt}
              disabled={!ready}
              className={`lz-cta min-h-12 px-3 py-3 text-xs font-extrabold tracking-[.5px] transition-opacity disabled:opacity-50 ${
                ready && !promptDone ? "lz-glow" : ""
              } ${ready && promptDone && !imagesDone ? "opacity-40" : ""}`}
            >
              {promptDone
                ? `✓ ${t("copyPromptGo")}`
                : promptStage === 1
                  ? t("promptAgain")
                  : t("copyPromptGo")}
            </button>
            <button
              type="button"
              onClick={copyImages}
              disabled={!ready || sheetBusy}
              className={`lz-cta min-h-12 px-3 py-3 text-xs font-extrabold tracking-[.5px] transition-opacity disabled:opacity-50 ${
                ready && promptDone && !imagesDone ? "lz-glow" : ""
              } ${ready && !promptDone ? "opacity-40" : ""}`}
            >
              {imagesDone ? `✓ ${t("copyImages")}` : t("copyImages")}
            </button>
          </div>
        </StepSection>
      </div>

      {modal === "how" && (
        <HowItWorksModal
          variant="unique"
          labelledBy="how-title"
          onClose={() => setModal(null)}
        >
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
        </HowItWorksModal>
      )}

      <Toast message={toast} />
    </div>
  );
}
