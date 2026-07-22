"use client";

import { useState } from "react";
import {
  heroCardPrompt,
  heroCardNoPhotoPrompt,
  metaPrompt,
  metaPromptExample,
  rankInfo,
  type Rank,
} from "@/lib/prompts";
import { CopyButton } from "./copy-button";

const rankRing: Record<Rank, string> = {
  S: "border-rank-s text-rank-s",
  A: "border-rank-a text-rank-a",
  B: "border-rank-b text-rank-b",
};

const inputClass =
  "w-full bg-bg border border-line px-3 py-2.5 text-sm text-cream placeholder:text-muted/70 focus:border-gold";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="hud text-xs text-muted block mb-2">{label}</span>
      {children}
    </label>
  );
}

export function PromptForm({ mode }: { mode: "photo" | "no-photo" | "group" }) {
  const [rank, setRank] = useState<Rank>("S");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const prompt =
    mode === "photo"
      ? heroCardPrompt(rank, name, details)
      : mode === "no-photo"
        ? heroCardNoPhotoPrompt(rank, name, details)
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
              placeholder={metaPromptExample}
              className={inputClass}
            />
          </Field>
        ) : (
          <>
            <div>
              <span className="hud text-xs text-muted block mb-2">Rank template</span>
              <div className="flex gap-2" role="radiogroup" aria-label="Rank template">
                {(Object.keys(rankInfo) as Rank[]).map((r) => (
                  <button
                    key={r}
                    role="radio"
                    aria-checked={rank === r}
                    onClick={() => setRank(r)}
                    className={`display text-lg w-12 h-12 border transition-colors ${
                      rank === r
                        ? `${rankRing[r]} bg-raised`
                        : "border-line text-muted hover:text-cream"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
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

      <div className="card-frame flex flex-col min-h-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line">
          <span className="hud text-xs text-muted">Your prompt</span>
          <CopyButton text={prompt} />
        </div>
        <pre className="prompt-block text-cream/90 p-4 overflow-auto max-h-[50vh]">{prompt}</pre>
      </div>
    </div>
  );
}
