"use client";

import { useRef, useState } from "react";
import {
  heroCardPrompt,
  heroCardNoPhotoPrompt,
  metaPrompt,
  type RankChoice,
  type RankSelection,
} from "@/lib/prompts";
import { CopyButton } from "./copy-button";

const rankChoices: RankChoice[] = ["S", "A", "B", "custom"];

const inputClass =
  "w-full bg-raised border border-[rgba(255,214,122,.28)] rounded-[10px] px-3.5 py-3 text-base text-cream placeholder:text-muted/70 outline-none focus:border-gold";

const PLACEHOLDER_TOKENS = [
  "[HERO CHARACTER NAME]",
  "[Describe your hero character here]",
  "[Details about the image you want generated]",
  "[RANK LETTER]",
  "[THEME COLOR]",
];

function renderPromptWithPlaceholders(text: string) {
  const pattern = new RegExp(
    `(${PLACEHOLDER_TOKENS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "g"
  );
  return text.split(pattern).map((part, i) =>
    PLACEHOLDER_TOKENS.includes(part) ? (
      <span key={i} className="text-gold-bright">
        {part}
      </span>
    ) : (
      part
    )
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-bold text-[13.5px] text-cream/90 block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export function PromptForm({ mode }: { mode: "photo" | "no-photo" | "group" }) {
  const [rank, setRank] = useState<RankChoice>("S");
  const [customLetter, setCustomLetter] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const radioRefs = useRef<Record<RankChoice, HTMLButtonElement | null>>(
    {} as Record<RankChoice, HTMLButtonElement | null>
  );

  function handleRadioKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const currentIndex = rankChoices.indexOf(rank);
    let nextIndex = currentIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % rankChoices.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + rankChoices.length) % rankChoices.length;
    } else {
      return;
    }
    e.preventDefault();
    const nextRank = rankChoices[nextIndex];
    setRank(nextRank);
    radioRefs.current[nextRank]?.focus();
  }

  const selection: RankSelection =
    rank === "custom" ? { letter: customLetter, color: customColor } : rank;
  const rankLabel = rank === "custom" ? customLetter.trim() || "Custom" : rank;

  const prompt =
    mode === "photo"
      ? heroCardPrompt(selection, name, details)
      : mode === "no-photo"
        ? heroCardNoPhotoPrompt(selection, name, details)
        : metaPrompt(groupDescription);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-5">
        {mode === "group" ? (
          <Field label="Describe the image you want generated">
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              rows={6}
              placeholder="e.g. Generate a prompt for adding additional hero characters to the image of Super T throwing a diamond party"
              className={inputClass}
            />
          </Field>
        ) : (
          <>
            <div>
              <span className="font-extrabold text-[13.5px] text-cream/90 block mb-2">
                Rank template
              </span>
              <div
                className="flex gap-2 flex-wrap"
                role="radiogroup"
                aria-label="Rank template"
                onKeyDown={handleRadioKeyDown}
              >
                {rankChoices.map((r) => (
                  <button
                    key={r}
                    ref={(el) => {
                      radioRefs.current[r] = el;
                    }}
                    role="radio"
                    aria-checked={rank === r}
                    tabIndex={rank === r ? 0 : -1}
                    onClick={() => setRank(r)}
                    className={`font-extrabold text-[13.5px] tracking-[.5px] px-4 py-2 rounded-full border border-[rgba(255,214,122,.28)] transition-colors ${
                      rank === r
                        ? "bg-gradient-to-br from-gold to-orange text-ink"
                        : "bg-raised text-cream/90 hover:text-cream hover:border-gold"
                    }`}
                  >
                    {r === "custom" ? "Custom" : r}
                  </button>
                ))}
              </div>
            </div>
            {rank === "custom" && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rank letter">
                  <input
                    type="text"
                    value={customLetter}
                    onChange={(e) => setCustomLetter(e.target.value)}
                    maxLength={3}
                    placeholder="e.g. Z"
                    className={inputClass}
                  />
                </Field>
                <Field label="Theme color">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="e.g. emerald green"
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
            <Field label="Hero character name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aušrytė"
                className={inputClass}
              />
            </Field>
            <Field
              label={mode === "photo" ? "Additional details (optional)" : "Hero character details"}
            >
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder={
                  mode === "photo"
                    ? "e.g. dark, powerful, mystical with a lava glow from her eyes"
                    : "e.g. cute and elegant, blonde hair, tight mythical dress, with a flirtatious vibe"
                }
                className={inputClass}
              />
            </Field>
          </>
        )}
      </div>

      <div className="bg-raised border border-[rgba(255,214,122,.2)] rounded-[14px] overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center justify-between gap-2.5 px-3.5 py-2.5 border-b border-line">
          <span className="font-extrabold text-[12.5px] tracking-[1px] uppercase text-muted">
            Your prompt{mode !== "group" && ` · ${rankLabel} rank card`}
          </span>
          <CopyButton text={prompt} />
        </div>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Prompt text"
          className="prompt-block text-cream/90 p-4 overflow-auto max-h-[50vh]"
        >
          {renderPromptWithPlaceholders(prompt)}
        </pre>
      </div>
    </div>
  );
}
