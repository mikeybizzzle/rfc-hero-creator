"use client";

import Link from "next/link";
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

type Mode = "photo" | "no-photo" | "group";

const modes: { id: Mode; label: string }[] = [
  { id: "photo", label: "Hero card / photo" },
  { id: "no-photo", label: "Hero card / no photo" },
  { id: "group", label: "Group scene" },
];

const rankRing: Record<Rank, string> = {
  S: "border-rank-s text-rank-s",
  A: "border-rank-a text-rank-a",
  B: "border-rank-b text-rank-b",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="hud text-xs text-muted block mb-2">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-bg border border-line px-3 py-2.5 text-sm text-cream placeholder:text-muted/60 focus:border-gold";

export function PromptBuilder() {
  const [mode, setMode] = useState<Mode>("photo");
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

  const attachments =
    mode === "photo"
      ? [
          { n: "Image 1", text: "Your rank's base template", href: "/templates" },
          { n: "Image 2", text: "An example hero card (style reference)", href: "/templates#heroes" },
          { n: "Image 3", text: "The photo of the person to transform", href: null },
        ]
      : mode === "no-photo"
        ? [
            { n: "Image 1", text: "Your rank's base template", href: "/templates" },
            { n: "Image 2", text: "An example hero card (style reference)", href: "/templates#heroes" },
            { n: "Images 3-6", text: "More example hero cards for inspiration", href: "/templates#heroes" },
          ]
        : [
            { n: "Image 1", text: "The base image you want to build on", href: null },
            { n: "Images 2+", text: "Each hero to add to the scene", href: null },
          ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Prompt type">
          {modes.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`hud text-xs px-3.5 py-2.5 border transition-colors ${
                mode === m.id
                  ? "border-gold text-gold bg-gold/10"
                  : "border-line text-muted hover:text-cream"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === "group" ? (
          <div className="space-y-5">
            <p className="text-sm text-muted leading-relaxed">
              The group scene uses a two-step flow. First, send this meta-prompt with your
              images: ChatGPT replies with a full image-generation prompt. Then send that
              generated prompt in a new message together with all the images.
            </p>
            <Field label="Describe the image you want generated">
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                rows={7}
                placeholder={metaPromptExample}
                className={inputClass}
              />
            </Field>
          </div>
        ) : (
          <div className="space-y-5">
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
                      rank === r ? `${rankRing[r]} bg-raised` : "border-line text-muted hover:text-cream"
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
              label={
                mode === "photo"
                  ? "Additional details (optional)"
                  : "Hero character details"
              }
            >
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={5}
                placeholder={
                  mode === "photo"
                    ? "e.g. dark, powerful, mystical with a lava glow from her eyes"
                    : 'e.g. cute and elegant, blonde hair, tight mythical dress, with a flirtatious vibe'
                }
                className={inputClass}
              />
            </Field>
          </div>
        )}

        <div className="mt-8 card-frame p-4">
          <p className="hud text-xs text-gold mb-3">Attach with this prompt</p>
          <ul className="space-y-2">
            {attachments.map((a) => (
              <li key={a.n} className="flex gap-3 text-sm">
                <span className="hud text-xs text-muted shrink-0 pt-0.5 w-20">{a.n}</span>
                {a.href ? (
                  <Link href={a.href} className="text-cream underline decoration-line underline-offset-4 hover:decoration-gold">
                    {a.text}
                  </Link>
                ) : (
                  <span className="text-cream">{a.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-frame flex flex-col min-h-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line">
          <span className="hud text-xs text-muted">Your prompt</span>
          <CopyButton text={prompt} />
        </div>
        <pre className="prompt-block text-cream/90 p-4 overflow-auto max-h-[70vh]">{prompt}</pre>
      </div>
    </div>
  );
}
