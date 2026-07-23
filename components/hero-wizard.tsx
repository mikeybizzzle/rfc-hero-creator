"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ManifestImage } from "@/lib/data";
import { heroRefName } from "@/lib/data";
import { copyImageAsset } from "@/lib/image-clipboard";
import { heroCardPrompt, type RankChoice, type RankSelection } from "@/lib/prompts";

const STEP_NAMES = ["Base", "Style", "Photo", "Prompt"] as const;
const STEP_CTAS = [
  "I PASTED THE BASE CARD →",
  "I PASTED THE STYLE →",
  "I ATTACHED MY PHOTO →",
  "DONE (RESET)",
] as const;

const inputClass =
  "w-full min-h-11 bg-raised border border-line rounded-[10px] px-3 py-2.5 text-base text-cream placeholder:text-muted/70 outline-none transition-[border-color] focus:border-gold";

type WizardImages = {
  templates: { image: ManifestImage; name: string; short: string }[];
  styles: ManifestImage[];
  provided: ManifestImage[];
  output: ManifestImage;
};

export function HeroWizard({ images }: { images: WizardImages }) {
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState<"how" | "ex" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [promptCopied, setPromptCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [rank, setRank] = useState<RankChoice>("S");
  const [customLetter, setCustomLetter] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [heroName, setHeroName] = useState("");
  const [details, setDetails] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const promptTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setModal(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function flash(msg: string, src?: string) {
    setToast(msg);
    setCopied(src ?? null);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast(null);
      setCopied(null);
    }, 2600);
  }

  async function copyImage(img: ManifestImage, name: string) {
    const url = img.download ?? img.src;
    const result = await copyImageAsset(url, img.file);
    if (result === "copied") {
      flash(`${name} copied — paste it into ChatGPT`, img.src);
    } else if (result === "downloaded") {
      flash(`${name} downloaded — attach it in ChatGPT`, img.src);
    } else {
      flash("Copy blocked here — press & hold (or right-click) the image to copy/save it");
    }
  }

  const selection: RankSelection =
    rank === "custom" ? { letter: customLetter, color: customColor } : rank;
  const prompt = heroCardPrompt(selection, heroName, details);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setPromptCopied(true);
      clearTimeout(promptTimer.current);
      promptTimer.current = setTimeout(() => setPromptCopied(false), 2200);
    } catch {
      flash("Copy failed — select the text and copy manually");
    }
  }

  function next() {
    if (step >= 4) {
      setStep(1);
      setModal(null);
      setShowPrompt(false);
      flash("All set — ChatGPT is forging your hero (1–2 min)");
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-56px)] w-full max-w-[560px] flex-col">
      <section className="px-4 pb-1 pt-5">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <h1 className="display text-balance text-[clamp(28px,6vw,40px)] leading-[1.04]">
            Hero Character (From Image)
          </h1>
          <span className="shrink-0 text-xs font-extrabold text-muted">
            Step {step} of 4
          </span>
        </div>
        <p className="mb-3.5 text-pretty text-[clamp(14px,2.5vw,16.5px)] leading-normal text-muted">
          Turn a photo into a Last Z hero card with your name on it. You&rsquo;ll
          paste <strong className="text-cream">3 images + 1 prompt</strong> into
          ChatGPT — everything you need is on this page.
        </p>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {images.provided.map((img, i) => (
              <figure key={img.slug} className="m-0 grid justify-items-center gap-1">
                <Image
                  src={img.src}
                  alt={["Base card", "Style example", "Your photo"][i]}
                  width={52}
                  height={52}
                  className="block aspect-square w-[min(13vw,52px)] rounded-lg border border-line object-cover"
                />
                <figcaption className="whitespace-nowrap text-[10px] font-bold text-muted">
                  {i + 1} · {["Base card", "Style", "Photo"][i]}
                </figcaption>
              </figure>
            ))}
          </div>
          <div aria-hidden="true" className="display text-xl text-gold">
            &rarr;
          </div>
          <figure className="m-0 grid justify-items-center gap-1">
            <Image
              src={images.output.src}
              alt="Finished hero card"
              width={76}
              height={76}
              className="block aspect-square w-[min(19vw,76px)] rounded-lg border border-line object-cover"
            />
            <figcaption className="whitespace-nowrap text-[10px] font-bold text-muted">
              Your hero card
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="flex gap-1.5 px-3.5 py-2" role="list" aria-label="Steps">
        {STEP_NAMES.map((name, idx) => {
          const i = idx + 1;
          const done = step > i;
          const current = step === i;
          return (
            <button
              key={name}
              type="button"
              role="listitem"
              aria-current={current ? "step" : undefined}
              disabled={i >= step}
              onClick={() => i < step && setStep(i)}
              className={`min-h-10 flex-1 whitespace-nowrap rounded-[10px] border px-0.5 text-[11px] font-extrabold tracking-[.3px] ${
                current
                  ? "border-transparent bg-gradient-to-b from-amber to-orange text-white"
                  : done
                    ? "cursor-pointer border-line bg-surface text-gold"
                    : "border-line/50 bg-raised text-muted/60"
              }`}
            >
              {done ? `✓ ${name}` : `${i}·${name}`}
            </button>
          );
        })}
      </div>

      <div className="flex-1 px-4 pb-3 pt-2">
        {step === 1 && (
          <div>
            <h2 className="display mb-1.5 text-[21px]">Copy a base card</h2>
            <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
              Copy + paste a base card into ChatGPT.{" "}
              <strong className="text-cream">(Tap a card to copy it.)</strong>{" "}
              Rank &amp; colors come in step 4 — any card works.
            </p>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {images.templates.map(({ image, name, short }) => (
                <button
                  key={image.slug}
                  type="button"
                  title="Copy image"
                  onClick={() => copyImage(image, name)}
                  className="relative cursor-pointer overflow-hidden rounded-xl border border-line bg-raised text-left transition-[border-color] hover:border-gold"
                >
                  <Image
                    src={image.src}
                    alt={name}
                    width={200}
                    height={200}
                    className="block aspect-square w-full object-cover"
                  />
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap px-1 py-1 text-center text-[11px] font-bold text-cream/90">
                    {short}
                  </span>
                  {copied === image.src && (
                    <span className="display absolute inset-0 grid place-items-center bg-bg/80 text-[13px] text-gold-bright">
                      COPIED &#10003;
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="display mb-1.5 text-[21px]">Copy a style example</h2>
            <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
              Copy + paste a style example into ChatGPT.{" "}
              <strong className="text-cream">(Tap an image to copy it.)</strong>{" "}
              It only shows the art style — anyone works.
            </p>
            <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2 pl-0.5 pr-0.5 pt-0.5">
              {images.styles.map((img) => {
                const name = heroRefName(img);
                return (
                  <button
                    key={img.slug}
                    type="button"
                    title="Copy image"
                    onClick={() => copyImage(img, name)}
                    className="relative w-[112px] flex-none cursor-pointer overflow-hidden rounded-xl border border-line bg-raised text-left transition-[border-color] hover:border-gold"
                  >
                    <Image
                      src={img.src}
                      alt={name}
                      width={112}
                      height={112}
                      className="block aspect-square w-full object-cover"
                    />
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap px-1.5 py-1 text-[11px] font-bold text-cream/90">
                      {name}
                    </span>
                    {copied === img.src && (
                      <span className="display absolute inset-0 grid place-items-center bg-bg/80 text-xs text-gold-bright">
                        COPIED &#10003;
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[11.5px] text-muted">
              Scroll for more &rarr; · Copy blocked? Press &amp; hold the image.
            </p>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="display mb-1.5 text-[21px]">Attach your photo</h2>
            <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
              In ChatGPT, <strong className="text-cream">attach 1–3 photos</strong>{" "}
              of the person or character you&rsquo;re transforming. Clear,
              well-lit shots work best.
            </p>
            <div className="card-frame flex items-center gap-3 p-3">
              <Image
                src={images.provided[2].src}
                alt="Example photo"
                width={96}
                height={96}
                className="block aspect-square w-24 flex-none rounded-[10px] border border-line object-cover"
              />
              <p className="text-[12.5px] leading-relaxed text-cream/90">
                One clear photo is enough — add up to 3 angles for a better
                likeness. Pets, avatars, and characters work too.
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="display mb-1.5 text-[21px]">Build your prompt</h2>
            <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
              Fill in the details, then{" "}
              <strong className="text-cream">
                copy + paste the prompt into ChatGPT
              </strong>{" "}
              and hit send.
            </p>
            <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[12.5px] font-extrabold text-cream/90">Rank:</span>
              {(["S", "A", "B", "custom"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRank(r)}
                  aria-pressed={rank === r}
                  className={`min-h-11 rounded-xl border-2 px-3.5 text-[12.5px] font-extrabold ${
                    rank === r
                      ? "border-gold bg-surface text-gold"
                      : "border-line/60 bg-raised text-cream/60 hover:text-cream"
                  }`}
                >
                  {r === "custom" ? "CUSTOM" : r}
                </button>
              ))}
            </div>
            {rank === "custom" && (
              <div className="mb-2.5 grid grid-cols-2 gap-2">
                <label className="grid min-w-0 gap-1 text-xs font-bold text-cream/90">
                  Rank letter
                  <input
                    type="text"
                    value={customLetter}
                    onChange={(e) => setCustomLetter(e.target.value)}
                    maxLength={3}
                    placeholder="e.g. F"
                    className={inputClass}
                  />
                </label>
                <label className="grid min-w-0 gap-1 text-xs font-bold text-cream/90">
                  Theme color
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="e.g. earthy green"
                    className={inputClass}
                  />
                </label>
              </div>
            )}
            <label className="mb-2.5 grid gap-1 text-xs font-bold text-cream/90">
              Hero name
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="e.g. Aušrytė"
                className={inputClass}
              />
            </label>
            <label className="mb-2.5 grid gap-1 text-xs font-bold text-cream/90">
              <span>
                Extra details{" "}
                <span className="font-medium text-muted">(optional)</span>
              </span>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                placeholder="e.g. mystical, lava glow eyes"
                className={`${inputClass} resize-y`}
              />
            </label>
            <button
              type="button"
              onClick={copyPrompt}
              aria-live="polite"
              className="lz-cta mb-2 w-full px-4 py-3 text-sm font-extrabold tracking-[.5px]"
            >
              {promptCopied ? "COPIED ✓" : "+ COPY PROMPT"}
            </button>
            <button
              type="button"
              onClick={() => setShowPrompt(!showPrompt)}
              aria-expanded={showPrompt}
              className="mb-2 w-full rounded-xl border border-line bg-raised px-3 py-2.5 text-xs font-extrabold tracking-[.5px] text-gold transition-[border-color] hover:border-gold"
            >
              {showPrompt ? "▲ HIDE FULL PROMPT" : "▼ VIEW FULL PROMPT"}
            </button>
            {showPrompt && (
              <pre className="prompt-block mb-2 max-h-[180px] overflow-auto rounded-xl border border-line bg-raised p-3 text-cream/90">
                {prompt}
              </pre>
            )}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-10 border-t border-line/60 bg-bg px-4 pb-[max(18px,env(safe-area-inset-bottom))] pt-3">
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={() => setModal("how")}
            className="min-h-10 flex-1 rounded-xl border border-line bg-raised px-3 text-[11.5px] font-extrabold tracking-[.4px] text-gold transition-[border-color] hover:border-gold"
          >
            HOW IT WORKS
          </button>
          <button
            type="button"
            onClick={() => setModal("ex")}
            className="min-h-10 flex-1 rounded-xl border border-line bg-raised px-3 text-[11.5px] font-extrabold tracking-[.4px] text-gold transition-[border-color] hover:border-gold"
          >
            SEE EXAMPLE
          </button>
        </div>
        <button
          type="button"
          onClick={next}
          className="lz-cta w-full px-4 py-3.5 text-[15px] font-extrabold tracking-[.5px]"
        >
          {STEP_CTAS[step - 1]}
        </button>
      </div>

      {modal === "how" && (
        <div
          onClick={() => setModal(null)}
          className="fixed inset-0 z-40 grid place-items-center bg-black/75 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="How it works"
            onClick={(e) => e.stopPropagation()}
            className="card-frame relative grid max-h-full w-full max-w-[460px] gap-2 overflow-y-auto p-4"
          >
            <button
              type="button"
              onClick={() => setModal(null)}
              title="Close"
              className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-lg border border-line bg-raised text-sm text-gold"
            >
              &#10005;
            </button>
            <div className="display mr-8 text-lg text-gold">HOW IT WORKS</div>
            <p className="text-[13px] leading-normal text-cream/90">
              We give ChatGPT clear instructions + reference images to turn your
              person/character into a hero character.
            </p>
            <ol className="grid list-decimal gap-1.5 pl-[18px] text-[13px] leading-normal text-cream/90">
              <li>Provide a base card (template).</li>
              <li>Provide a hero image (for style accuracy).</li>
              <li>Provide an image of YOUR person/character (1–3 images).</li>
              <li>Fill out the prompt details and paste into ChatGPT.</li>
              <li>Hit SEND to generate.</li>
            </ol>
            <p className="text-[13px] font-bold leading-normal text-gold">
              Result = a hero card in the same style &amp; format as the
              game&rsquo;s heroes.
            </p>
          </div>
        </div>
      )}

      {modal === "ex" && (
        <div
          onClick={() => setModal(null)}
          className="fixed inset-0 z-40 grid place-items-center bg-black/75 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Example in ChatGPT"
            onClick={(e) => e.stopPropagation()}
            className="relative grid max-h-full w-full max-w-[460px] gap-2.5 overflow-y-auto rounded-2xl border border-white/15 bg-[#1b1b1b] p-4"
          >
            <button
              type="button"
              onClick={() => setModal(null)}
              title="Close"
              className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-lg border border-white/20 bg-[#303030] text-sm text-[#ececec]"
            >
              &#10005;
            </button>
            <div className="mr-8 text-[11px] font-extrabold tracking-[1px] text-[#8f8f8f]">
              EXAMPLE — IN CHATGPT
            </div>
            <div className="grid max-w-[88%] justify-items-end gap-1.5 justify-self-end">
              <div className="flex gap-1.5">
                {images.provided.map((img, i) => (
                  <Image
                    key={img.slug}
                    src={img.src}
                    alt={["Base card", "Style example", "Your photo"][i]}
                    width={60}
                    height={60}
                    className="aspect-square w-[60px] rounded-lg border border-white/15 object-cover"
                  />
                ))}
              </div>
              <div className="max-w-[260px] rounded-[14px] rounded-br-[4px] bg-[#303030] px-3 py-2 text-xs leading-normal text-[#ececec]">
                Use the 3 attached images as references: Image 1 = the base
                card, Image 2 = the style, Image 3 = the person to transform…{" "}
                <span className="text-[#9b9b9b]">(your prompt)</span>
              </div>
            </div>
            <div className="grid max-w-[88%] gap-1.5">
              <Image
                src={images.output.src}
                alt="Finished hero card"
                width={180}
                height={180}
                className="aspect-square w-[180px] rounded-xl border border-white/15 object-cover"
              />
              <div className="text-[11px] font-bold text-[#8f8f8f]">
                ChatGPT — your finished hero card (1–2 min)
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-[140px] left-1/2 z-50 max-w-[90vw] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber to-orange px-[18px] py-[11px] text-center text-sm font-extrabold text-white shadow-[0_6px_24px_rgba(0,0,0,.5)]"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
