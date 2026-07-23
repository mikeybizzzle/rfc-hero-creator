"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducer, useState } from "react";
import type { Walkthrough } from "@/lib/chats";
import {
  heroRefName,
  heroRefRank,
  type ManifestImage,
} from "@/lib/data";
import {
  heroCardPrompt,
  type Rank,
  type RankChoice,
  type RankSelection,
} from "@/lib/prompts";
import { copyImageAsset, copyText } from "@/lib/image-clipboard";
import { WorkflowHelpDropdowns } from "./compact-example-dropdown";
import { SelectableImageCard } from "./selectable-image-card";

export type HeroConcept = "focus" | "workbench" | "missions";
type WizardStep = 1 | 2 | 3 | 4 | 5;
type ContentStep = 1 | 2 | 3 | 4;
type PreparedTransfer = {
  step: 1 | 2 | 4;
  key: string;
  method: "copied" | "downloaded";
};

type WizardState = {
  activeStep: WizardStep;
  expandedStep: ContentStep | null;
  revision: number;
  selectedBase: string;
  confirmedBase: string | null;
  selectedStyle: string;
  confirmedStyle: string | null;
  confirmedPhoto: boolean;
  rank: RankChoice;
  customLetter: string;
  customColor: string;
  name: string;
  details: string;
  promptOpen: boolean;
};

type WizardAction =
  | { type: "select-base"; slug: string }
  | { type: "confirm-base"; rank: Rank }
  | { type: "select-style"; slug: string }
  | { type: "confirm-style" }
  | { type: "confirm-photo" }
  | { type: "go-to"; step: ContentStep }
  | { type: "toggle-step"; step: ContentStep }
  | { type: "set-rank"; rank: RankChoice }
  | { type: "set-custom-letter"; value: string }
  | { type: "set-custom-color"; value: string }
  | { type: "set-name"; value: string }
  | { type: "set-details"; value: string }
  | { type: "toggle-prompt" }
  | { type: "complete" };

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "select-base": {
      const changedConfirmedBase =
        state.confirmedBase !== null && action.slug !== state.confirmedBase;
      return {
        ...state,
        revision: state.revision + 1,
        selectedBase: action.slug,
        confirmedBase: changedConfirmedBase ? null : state.confirmedBase,
        confirmedStyle: changedConfirmedBase ? null : state.confirmedStyle,
        confirmedPhoto: changedConfirmedBase ? false : state.confirmedPhoto,
        activeStep: changedConfirmedBase ? 1 : state.activeStep,
        expandedStep: changedConfirmedBase ? 1 : state.expandedStep,
      };
    }
    case "confirm-base":
      return {
        ...state,
        confirmedBase: state.selectedBase,
        confirmedStyle: null,
        confirmedPhoto: false,
        rank: action.rank,
        activeStep: 2,
        expandedStep: 2,
      };
    case "select-style": {
      const changedConfirmedStyle =
        state.confirmedStyle !== null && action.slug !== state.confirmedStyle;
      return {
        ...state,
        revision: state.revision + 1,
        selectedStyle: action.slug,
        confirmedStyle: changedConfirmedStyle ? null : state.confirmedStyle,
        confirmedPhoto: changedConfirmedStyle ? false : state.confirmedPhoto,
        activeStep: changedConfirmedStyle ? 2 : state.activeStep,
        expandedStep: changedConfirmedStyle ? 2 : state.expandedStep,
      };
    }
    case "confirm-style":
      return {
        ...state,
        confirmedStyle: state.selectedStyle,
        confirmedPhoto: false,
        activeStep: 3,
        expandedStep: 3,
      };
    case "confirm-photo":
      return {
        ...state,
        confirmedPhoto: true,
        activeStep: 4,
        expandedStep: 4,
      };
    case "go-to":
      if (action.step === 2 && !state.confirmedBase) return state;
      if (action.step === 3 && !state.confirmedStyle) return state;
      if (action.step === 4 && !state.confirmedPhoto) return state;
      return { ...state, activeStep: action.step, expandedStep: action.step };
    case "toggle-step":
      return {
        ...state,
        expandedStep: state.expandedStep === action.step ? null : action.step,
      };
    case "set-rank":
      return { ...state, rank: action.rank, revision: state.revision + 1 };
    case "set-custom-letter":
      return {
        ...state,
        customLetter: action.value,
        revision: state.revision + 1,
      };
    case "set-custom-color":
      return {
        ...state,
        customColor: action.value,
        revision: state.revision + 1,
      };
    case "set-name":
      return { ...state, name: action.value, revision: state.revision + 1 };
    case "set-details":
      return { ...state, details: action.value, revision: state.revision + 1 };
    case "toggle-prompt":
      return { ...state, promptOpen: !state.promptOpen };
    case "complete":
      return { ...state, activeStep: 5, expandedStep: null };
  }
}

const conceptMeta: Record<
  HeroConcept,
  { title: string; shell: string }
> = {
  focus: {
    title: "Focus Card",
    shell: "hero-concept-focus",
  },
  workbench: {
    title: "Visual Workbench",
    shell: "hero-concept-workbench",
  },
  missions: {
    title: "Mission Stack",
    shell: "hero-concept-missions",
  },
};

const stepLabels = [
  "Base Card",
  "Style Example",
  "Your Photo",
  "Prompt",
] as const;
const ranks: RankChoice[] = ["S", "A", "B", "custom"];

const inputClass =
  "min-h-11 w-full rounded-lg border border-[rgba(255,214,122,.28)] bg-raised px-3 py-2 text-sm text-cream placeholder:text-muted/65 outline-none transition-[border-color,box-shadow] focus:border-gold focus:shadow-[0_0_0_3px_rgba(255,208,90,.1)]";

function rankFromBase(image: ManifestImage): Rank {
  const rank = image.slug[0]?.toUpperCase();
  return rank === "A" || rank === "B" ? rank : "S";
}

function selectedRank(state: WizardState): RankSelection {
  return state.rank === "custom"
    ? { letter: state.customLetter, color: state.customColor }
    : state.rank;
}

function BaseOptions({
  concept,
  state,
  dispatch,
  templates,
}: {
  concept: HeroConcept;
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  templates: ManifestImage[];
}) {
  const selected =
    templates.find((image) => image.slug === state.selectedBase) ?? templates[0];

  if (concept === "workbench") {
    return (
      <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[minmax(240px,.9fr)_minmax(300px,1.1fr)]">
        <div className="relative mx-auto aspect-square h-full max-h-[min(38dvh,330px)] w-auto max-w-full overflow-hidden rounded-2xl border border-gold/40 bg-raised shadow-[0_28px_70px_rgba(0,0,0,.45)] md:mx-0 md:max-h-none md:w-full">
          <Image
            src={selected.src}
            alt={`Selected ${rankFromBase(selected)} rank base card`}
            fill
            loading="eager"
            sizes="(max-width: 767px) 60vw, 38vw"
            className="object-cover"
          />
          <span className="absolute bottom-2 left-2 rounded-lg border border-gold/30 bg-bg/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.08em] text-gold-bright backdrop-blur">
            {rankFromBase(selected)} rank selected
          </span>
        </div>
        <div className="flex min-h-0 flex-col justify-center">
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-muted">
            Choose a base
          </p>
          <div className="scrollbar-none flex snap-x gap-2 overflow-x-auto pb-1">
            {templates.map((image) => (
              <SelectableImageCard
                key={image.slug}
                image={image}
                label={`${rankFromBase(image)} rank`}
                selected={image.slug === state.selectedBase}
                onSelect={() =>
                  dispatch({ type: "select-base", slug: image.slug })
                }
                sizes="92px"
                compact
                className="w-[88px] snap-start"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {templates.map((image, index) => (
        <SelectableImageCard
          key={image.slug}
          image={image}
          label={`${rankFromBase(image)} rank`}
          selected={image.slug === state.selectedBase}
          onSelect={() =>
            dispatch({ type: "select-base", slug: image.slug })
          }
          sizes="(max-width: 640px) 29vw, 190px"
          priority={index === 0}
        />
      ))}
    </div>
  );
}

function StyleOptions({
  concept,
  state,
  dispatch,
  styles,
}: {
  concept: HeroConcept;
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  styles: ManifestImage[];
}) {
  const selected =
    styles.find((image) => image.slug === state.selectedStyle) ?? styles[0];

  if (concept === "workbench") {
    return (
      <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[minmax(240px,.9fr)_minmax(300px,1.1fr)]">
        <div className="relative mx-auto aspect-square h-full max-h-[min(38dvh,330px)] w-auto max-w-full overflow-hidden rounded-2xl border border-gold/40 bg-raised shadow-[0_28px_70px_rgba(0,0,0,.45)] md:mx-0 md:max-h-none md:w-full">
          <Image
            src={selected.src}
            alt={`Selected style, ${heroRefName(selected)}`}
            fill
            loading="eager"
            sizes="(max-width: 767px) 60vw, 38vw"
            className="object-cover"
          />
          <span className="absolute bottom-2 left-2 max-w-[80%] truncate rounded-lg border border-gold/30 bg-bg/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.08em] text-gold-bright backdrop-blur">
            {heroRefName(selected)}
          </span>
        </div>
        <div className="flex min-h-0 flex-col justify-center">
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[.1em] text-muted">
            Browse styles
          </p>
          <div className="scrollbar-none flex snap-x gap-2 overflow-x-auto pb-1">
            {styles.map((image) => (
              <SelectableImageCard
                key={image.slug}
                image={image}
                label={`${heroRefRank(image)} ${heroRefName(image)}`}
                selected={image.slug === state.selectedStyle}
                onSelect={() =>
                  dispatch({ type: "select-style", slug: image.slug })
                }
                sizes="84px"
                compact
                className="w-[80px] snap-start"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scrollbar-none grid min-h-0 auto-cols-[88px] grid-flow-col grid-rows-2 gap-2 overflow-x-auto overscroll-x-contain pb-1 sm:auto-cols-[110px]">
      {styles.map((image) => (
        <SelectableImageCard
          key={image.slug}
          image={image}
          label={`${heroRefRank(image)} ${heroRefName(image)}`}
          selected={image.slug === state.selectedStyle}
          onSelect={() =>
            dispatch({ type: "select-style", slug: image.slug })
          }
          sizes="(max-width: 640px) 88px, 110px"
        />
      ))}
    </div>
  );
}

function PromptFields({
  state,
  dispatch,
  prompt,
}: {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  prompt: string;
}) {
  return (
    <div className="grid min-h-0 gap-2.5 md:grid-cols-2 md:gap-4">
      <div className="space-y-2.5">
        <fieldset>
          <legend className="mb-1.5 text-[11px] font-extrabold text-cream/90">
            Rank template
          </legend>
          <div className="grid grid-cols-4 gap-1.5">
            {ranks.map((rank) => (
              <button
                key={rank}
                type="button"
                aria-pressed={state.rank === rank}
                onClick={() => dispatch({ type: "set-rank", rank })}
                className={`min-h-11 rounded-lg border px-2 text-xs font-extrabold transition-colors ${
                  state.rank === rank
                    ? "border-gold bg-gold text-ink"
                    : "border-line bg-raised text-cream hover:border-gold/60"
                }`}
              >
                {rank === "custom" ? "Custom" : rank}
              </button>
            ))}
          </div>
        </fieldset>

        {state.rank === "custom" && (
          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className="mb-1 block text-[10px] font-bold text-muted">
                Rank letter
              </span>
              <input
                value={state.customLetter}
                onChange={(event) =>
                  dispatch({
                    type: "set-custom-letter",
                    value: event.target.value,
                  })
                }
                maxLength={3}
                placeholder="Z"
                className={inputClass}
              />
            </label>
            <label>
              <span className="mb-1 block text-[10px] font-bold text-muted">
                Theme color
              </span>
              <input
                value={state.customColor}
                onChange={(event) =>
                  dispatch({
                    type: "set-custom-color",
                    value: event.target.value,
                  })
                }
                placeholder="Emerald"
                className={inputClass}
              />
            </label>
          </div>
        )}

        <label>
          <span className="mb-1 block text-[11px] font-extrabold text-cream/90">
            Hero name <span className="text-gold">*</span>
          </span>
          <input
            value={state.name}
            onChange={(event) =>
              dispatch({ type: "set-name", value: event.target.value })
            }
            autoComplete="off"
            placeholder="e.g. Aušrytė"
            className={inputClass}
          />
        </label>

        <label>
          <span className="mb-1 block text-[11px] font-extrabold text-cream/90">
            Additional details <span className="font-normal text-muted">(optional)</span>
          </span>
          <textarea
            value={state.details}
            onChange={(event) =>
              dispatch({ type: "set-details", value: event.target.value })
            }
            rows={2}
            placeholder="e.g. dark, mystical, lava glow"
            className={`${inputClass} resize-none`}
          />
        </label>
      </div>

      <div className="min-h-0">
        <button
          type="button"
          aria-expanded={state.promptOpen}
          onClick={() => dispatch({ type: "toggle-prompt" })}
          className="flex min-h-11 w-full items-center justify-between rounded-lg border border-line bg-raised px-3 text-left text-xs font-extrabold text-cream transition-colors hover:border-gold/60"
        >
          Preview prompt
          <span
            aria-hidden="true"
            className={`text-gold transition-transform ${
              state.promptOpen ? "rotate-180" : ""
            }`}
          >
            ↓
          </span>
        </button>
        {state.promptOpen && (
          <pre
            tabIndex={0}
            aria-label="Generated hero prompt"
            className="prompt-block mt-2 max-h-[min(26dvh,260px)] overflow-auto rounded-lg border border-line bg-raised p-3 text-cream/85"
          >
            {prompt}
          </pre>
        )}
        <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
          Your confirmed base card set the starting rank. You can still change it
          here.
        </p>
      </div>
    </div>
  );
}

function Completion({
  base,
  style,
  name,
  dispatch,
}: {
  base: ManifestImage;
  style: ManifestImage;
  name: string;
  dispatch: React.Dispatch<WizardAction>;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center text-center">
      <div className="relative mb-3 flex h-20 w-32 items-center justify-center">
        <div className="absolute left-1 top-1 size-16 rotate-[-6deg] overflow-hidden rounded-xl border border-line">
          <Image src={base.src} alt="" fill sizes="64px" className="object-cover" />
        </div>
        <div className="absolute right-1 top-1 size-16 rotate-[6deg] overflow-hidden rounded-xl border border-gold/60">
          <Image src={style.src} alt="" fill sizes="64px" className="object-cover" />
        </div>
      </div>
      <p className="hud text-[10px] text-gold">Ready in ChatGPT</p>
      <h2 className="display mt-1 text-3xl text-cream">
        {name.trim()} is ready to forge
      </h2>
      <p className="mt-2 max-w-md text-xs leading-relaxed text-muted">
        In ChatGPT, confirm the base card, style example, and 1-3 photos are
        attached. Paste the prompt, then hit Send.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <a
          href="https://chatgpt.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center rounded-xl bg-gold px-4 text-sm font-extrabold text-ink transition-transform hover:-translate-y-0.5"
        >
          Open ChatGPT ↗
        </a>
        <button
          type="button"
          onClick={() => dispatch({ type: "go-to", step: 4 })}
          className="min-h-11 rounded-xl border border-line bg-raised px-4 text-sm font-extrabold text-cream transition-colors hover:border-gold/60"
        >
          Edit prompt
        </button>
      </div>
    </div>
  );
}

function ActionDock({
  busy,
  disabled,
  label,
  microcopy,
  onAction,
}: {
  busy: boolean;
  disabled: boolean;
  label: string;
  microcopy?: string;
  onAction: () => void;
}) {
  return (
    <div className="shrink-0 border-t border-line bg-bg/92 px-3 pb-[max(.55rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:px-4">
      <button
        type="button"
        disabled={disabled || busy}
        onClick={onAction}
        className="mx-auto flex min-h-12 w-full max-w-xl items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-orange px-4 text-sm font-black text-ink shadow-[0_12px_28px_rgba(242,106,32,.2)] transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
      >
        {busy ? "Working..." : label}
      </button>
      {microcopy && (
        <p className="mx-auto mt-1.5 max-w-xl text-center text-[10px] leading-snug text-muted">
          {microcopy}
        </p>
      )}
    </div>
  );
}

function PhotoStep() {
  return (
    <div className="rounded-xl border border-line bg-raised/70 p-3 sm:p-4">
      <p className="text-xs leading-relaxed text-muted">
        One image works. Multiple angles or expressions can help ChatGPT preserve
        the subject more accurately.
      </p>
      <a
        href="https://chatgpt.com/"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex min-h-11 items-center rounded-lg border border-gold/35 bg-gold/8 px-3 text-xs font-extrabold text-gold-bright transition-colors hover:bg-gold hover:text-ink"
      >
        Open ChatGPT to attach photos ↗
      </a>
    </div>
  );
}

function AccordionStep({
  step,
  title,
  description,
  expanded,
  complete,
  locked,
  children,
  onToggle,
}: {
  step: ContentStep;
  title: string;
  description: string;
  expanded: boolean;
  complete: boolean;
  locked: boolean;
  children?: React.ReactNode;
  onToggle: () => void;
}) {
  return (
    <section
      className={`min-h-0 shrink-0 overflow-hidden rounded-xl border transition-colors ${
        expanded ? "flex flex-1 flex-col border-gold/45 bg-surface/80" : ""
      } ${
        locked
          ? "border-line bg-raised/35 text-muted opacity-55"
          : expanded
            ? "text-cream"
            : "border-line bg-raised text-cream"
      }`}
    >
      <button
        type="button"
        disabled={locked}
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex min-h-12 w-full items-center gap-2.5 px-3 text-left"
      >
        <span
          className={`display grid size-7 shrink-0 place-items-center rounded-lg text-sm ${
            expanded || complete
              ? "bg-gold text-ink"
              : "border border-line text-muted"
          }`}
        >
          {step}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-extrabold">
          {title}
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-[.05em] text-muted">
          {locked ? "Locked" : complete ? "Done" : ""}
        </span>
        <span
          aria-hidden="true"
          className={`text-sm text-gold transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        >
          ↓
        </span>
      </button>
      {expanded && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-t border-line px-3 pb-3 pt-2.5">
          <p className="mb-2.5 shrink-0 text-[11px] leading-relaxed text-muted sm:text-xs">
            {description}
          </p>
          <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
            {children}
          </div>
        </div>
      )}
    </section>
  );
}

function ActivePanel({
  concept,
  state,
  dispatch,
  templates,
  styles,
  prompt,
}: {
  concept: HeroConcept;
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  templates: ManifestImage[];
  styles: ManifestImage[];
  prompt: string;
}) {
  const base =
    templates.find((image) => image.slug === state.selectedBase) ?? templates[0];
  const style =
    styles.find((image) => image.slug === state.selectedStyle) ?? styles[0];

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col gap-2">
      {state.activeStep === 5 ? (
        <Completion
          base={base}
          style={style}
          name={state.name}
          dispatch={dispatch}
        />
      ) : (
        <>
          <AccordionStep
            step={1}
            title={stepLabels[0]}
            description="Choose the rank template that sets your card background and game UI."
            expanded={state.expandedStep === 1}
            complete={Boolean(state.confirmedBase)}
            locked={false}
            onToggle={() =>
              state.activeStep === 1
                ? dispatch({ type: "toggle-step", step: 1 })
                : dispatch({ type: "go-to", step: 1 })
            }
          >
            <BaseOptions
              concept={concept}
              state={state}
              dispatch={dispatch}
              templates={templates}
            />
          </AccordionStep>
          <AccordionStep
            step={2}
            title={stepLabels[1]}
            description="Choose a hero image that shows ChatGPT the game's visual style, lighting, and character placement."
            expanded={state.expandedStep === 2}
            complete={Boolean(state.confirmedStyle)}
            locked={!state.confirmedBase}
            onToggle={() =>
              state.activeStep === 2
                ? dispatch({ type: "toggle-step", step: 2 })
                : dispatch({ type: "go-to", step: 2 })
            }
          >
            <StyleOptions
              concept={concept}
              state={state}
              dispatch={dispatch}
              styles={styles}
            />
          </AccordionStep>
          <AccordionStep
            step={3}
            title={stepLabels[2]}
            description="Attach 1-3 images of the person or character you want to transform."
            expanded={state.expandedStep === 3}
            complete={state.confirmedPhoto}
            locked={!state.confirmedStyle}
            onToggle={() =>
              state.activeStep === 3
                ? dispatch({ type: "toggle-step", step: 3 })
                : dispatch({ type: "go-to", step: 3 })
            }
          >
            <PhotoStep />
          </AccordionStep>
          <AccordionStep
            step={4}
            title={stepLabels[3]}
            description="Name your hero, add optional creative details, and copy the final prompt into ChatGPT."
            expanded={state.expandedStep === 4}
            complete={false}
            locked={!state.confirmedPhoto}
            onToggle={() =>
              state.activeStep === 4
                ? dispatch({ type: "toggle-step", step: 4 })
                : dispatch({ type: "go-to", step: 4 })
            }
          >
            <PromptFields state={state} dispatch={dispatch} prompt={prompt} />
          </AccordionStep>
        </>
      )}
    </div>
  );
}

export function HeroWizard({
  concept,
  templates,
  styles,
  walkthrough,
}: {
  concept: HeroConcept;
  templates: ManifestImage[];
  styles: ManifestImage[];
  walkthrough: Walkthrough;
}) {
  const meta = conceptMeta[concept];
  const [state, dispatch] = useReducer(reducer, {
    activeStep: 1,
    expandedStep: 1,
    revision: 0,
    selectedBase: templates[0].slug,
    confirmedBase: null,
    selectedStyle: styles[0].slug,
    confirmedStyle: null,
    confirmedPhoto: false,
    rank: rankFromBase(templates[0]),
    customLetter: "",
    customColor: "",
    name: "",
    details: "",
    promptOpen: false,
  });
  const [busy, setBusy] = useState(false);
  const [prepared, setPrepared] = useState<PreparedTransfer | null>(null);
  const [feedback, setFeedback] = useState<{
    kind: "status" | "error";
    text: string;
  } | null>(null);

  const prompt = heroCardPrompt(
    selectedRank(state),
    state.name,
    state.details,
    { multiplePhotos: true }
  );
  const currentTransferKey =
    state.activeStep === 1
      ? `${state.revision}:${state.selectedBase}`
      : state.activeStep === 2
        ? `${state.revision}:${state.selectedStyle}`
        : state.activeStep === 4
          ? `${state.revision}:${prompt}`
          : "";
  const isPrepared =
    prepared?.step === state.activeStep && prepared.key === currentTransferKey;

  async function performAction() {
    setFeedback(null);

    if (state.activeStep === 3) {
      dispatch({ type: "confirm-photo" });
      setPrepared(null);
      return;
    }

    if (isPrepared) {
      if (state.activeStep === 1) {
        const image = templates.find(
          (item) => item.slug === state.selectedBase
        );
        if (!image) return;
        dispatch({ type: "confirm-base", rank: rankFromBase(image) });
      } else if (state.activeStep === 2) {
        dispatch({ type: "confirm-style" });
      } else if (state.activeStep === 4) {
        dispatch({ type: "complete" });
      }
      setPrepared(null);
      return;
    }

    if (state.activeStep === 4) {
      if (!state.name.trim()) {
        setFeedback({
          kind: "error",
          text: "Add your hero character name before copying the prompt.",
        });
        return;
      }

      setBusy(true);
      const copied = await copyText(prompt);
      setBusy(false);
      if (!copied) {
        setFeedback({
          kind: "error",
          text: "The prompt could not be copied. Open Preview prompt and copy it manually.",
        });
        return;
      }
      setPrepared({
        step: 4,
        key: currentTransferKey,
        method: "copied",
      });
      return;
    }

    const image =
      state.activeStep === 1
        ? templates.find((item) => item.slug === state.selectedBase)
        : styles.find((item) => item.slug === state.selectedStyle);
    if (!image) return;

    setBusy(true);
    const result = await copyImageAsset(
      image.download ?? image.src,
      image.file
    );
    setBusy(false);

    if (result === "failed") {
      setFeedback({
        kind: "error",
        text: "The image could not be copied or downloaded. Try again before continuing.",
      });
      return;
    }

    setPrepared({
      step: state.activeStep === 1 ? 1 : 2,
      key: currentTransferKey,
      method: result,
    });
  }

  const actionDisabled =
    (state.activeStep === 1 && !state.selectedBase) ||
    (state.activeStep === 2 && !state.selectedStyle);
  const actionLabel =
    state.activeStep === 3
      ? "Ready for next step →"
      : isPrepared
        ? state.activeStep === 4
          ? "Ready to finish →"
          : "Ready for next step →"
        : state.activeStep === 4
          ? "Copy prompt"
          : "Copy & continue";
  const actionMicrocopy =
    state.activeStep === 3
      ? "Attach 1-3 photos directly in ChatGPT before moving to the prompt."
      : isPrepared
        ? state.activeStep === 4
          ? "Make sure you pasted the prompt into ChatGPT before finishing."
          : prepared?.method === "downloaded"
            ? "Make sure you attached the downloaded image in ChatGPT before moving on."
            : "Make sure you pasted the image into ChatGPT before moving on."
        : undefined;
  const showActionDock =
    state.activeStep <= 4 && state.expandedStep === state.activeStep;

  return (
    <div
      className={`${meta.shell} h-[100dvh] min-h-[620px] overflow-hidden bg-bg text-cream`}
    >
      <header className="h-12 border-b border-line bg-bg/92 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-3 sm:px-4">
          <Link
            href="/"
            aria-label="RfC Hero Forge home"
            className="group flex min-h-11 items-center gap-2"
          >
            <span className="display rounded-md bg-gold px-2 py-1 text-sm leading-none text-ink transition-transform group-hover:-rotate-2">
              RfC
            </span>
            <span className="text-xs font-extrabold text-cream">
              Hero from photo
            </span>
          </Link>
          <div className="min-w-0 text-right">
            <p className="truncate text-xs font-extrabold text-gold-bright">
              {meta.title}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex h-[calc(100dvh-3rem)] min-h-0 max-w-6xl flex-col">
        <div className="shrink-0 space-y-2 px-3 pb-2 pt-2 sm:px-4">
          <WorkflowHelpDropdowns walkthrough={walkthrough} />
          {feedback && (
            <p
              role={feedback.kind === "error" ? "alert" : "status"}
              className={`rounded-lg border px-2.5 py-1.5 text-[10.5px] font-bold ${
                feedback.kind === "error"
                  ? "border-orange/60 bg-orange/10 text-gold-bright"
                  : "border-gold/25 bg-gold/8 text-gold-bright"
              }`}
            >
              {feedback.text}
            </p>
          )}
        </div>

        <div className="hero-concept-stage min-h-0 flex-1 overflow-hidden px-3 pb-2 sm:px-4">
          <ActivePanel
            concept={concept}
            state={state}
            dispatch={dispatch}
            templates={templates}
            styles={styles}
            prompt={prompt}
          />
        </div>

        {showActionDock && (
          <ActionDock
            busy={busy}
            disabled={actionDisabled}
            label={actionLabel}
            microcopy={actionMicrocopy}
            onAction={performAction}
          />
        )}
      </div>
    </div>
  );
}
