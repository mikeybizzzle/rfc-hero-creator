"use client";

import { useState } from "react";
import { metaPrompt } from "@/lib/prompts";
import {
  CopyTile,
  ExampleChatModal,
  PromptActions,
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

const STEP_NAMES = ["Idea", "Images", "Run"];
const CTAS = [
  "I COPIED MY MESSAGE →",
  "I SENT IMAGES + MESSAGE →",
  "DONE (RESET)",
];

export function CustomWizard({
  refs,
  exampleInputs,
  exampleOutput,
}: {
  refs: WizardImage[];
  exampleInputs: ChatImage[];
  exampleOutput: ChatImage;
}) {
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState<"how" | "ex" | null>(null);
  const [idea, setIdea] = useState("");
  const { toast, copied, flash, copyImage } = useCopyToast();

  const message = metaPrompt(idea);

  function next() {
    if (step >= 3) {
      setStep(1);
      setModal(null);
      flash("All set — enjoy your custom image!");
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="wizard-panel mx-auto max-w-[560px] sm:max-w-[680px]">
      <div className="mb-2 text-right text-xs font-extrabold text-muted">
        Step {step} of 3
      </div>
      <Stepper names={STEP_NAMES} step={step} onGo={setStep} />

      <div className="min-h-[340px] pb-4 pt-4">
        {step === 1 && (
          <section aria-label="Step 1 · Idea">
            <h2 className="display mb-1.5 text-[21px]">Describe your idea</h2>
            <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
              Say what you want and which attached image is which, then{" "}
              <strong className="text-cream">copy your message</strong>. A
              reference prompt is included under your description automatically
              — it teaches ChatGPT the format.
            </p>
            <label className={`${labelClass} mb-2.5`}>
              Your description
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={4}
                placeholder="e.g. Generate a prompt for adding additional hero characters to the image of SuperT throwing a diamond party. Image 1 is the base image we want to work from; each additional image contains a hero to incorporate. Maintain the same quality and detail."
                className={`${inputClass} resize-y`}
              />
            </label>
            <PromptActions
              prompt={message}
              copyLabel="+ COPY MESSAGE"
              viewLabel="FULL MESSAGE"
              onFail={flash}
            />
          </section>
        )}

        {step === 2 && (
          <section aria-label="Step 2 · Images">
            <h2 className="display mb-1.5 text-[21px]">
              Attach your images &amp; send
            </h2>
            <p className="mb-2 text-[13.5px] leading-normal text-muted">
              In ChatGPT: attach the{" "}
              <strong className="text-cream">base image first</strong>, then
              each hero to include, paste your copied message, and send.{" "}
              <strong className="text-cream">
                ChatGPT replies with a ready-to-run image prompt.
              </strong>
            </p>
            <p className="mb-2 text-xs font-bold text-cream/90">
              Need images? Tap any to copy — members&rsquo; hero cards work
              great.
            </p>
            <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
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
            <p className="text-[11.5px] text-muted">
              Scroll for more &rarr; · Copy blocked? Press &amp; hold the image.
            </p>
          </section>
        )}

        {step === 3 && (
          <section aria-label="Step 3 · Run">
            <h2 className="display mb-1.5 text-[21px]">
              Run the prompt ChatGPT gives you
            </h2>
            <p className="mb-2.5 text-[13.5px] leading-normal text-muted">
              Copy ChatGPT&rsquo;s reply, start a{" "}
              <strong className="text-cream">new message</strong>, attach the{" "}
              <strong className="text-cream">same images again</strong>, paste
              the prompt, and hit send.
            </p>
            <div className="flex items-start gap-2.5 rounded-xl border border-line bg-raised px-3.5 py-3">
              <span className="display text-[15px] text-gold">TIP</span>
              <p className="text-[12.5px] leading-normal text-cream/90">
                Not perfect? Just reply with tweaks — e.g.{" "}
                <em>
                  &ldquo;remove the UI elements and spread the heroes out
                  evenly&rdquo;
                </em>
                .
              </p>
            </div>
          </section>
        )}
      </div>

      <StickyBar
        onHow={() => setModal("how")}
        onExample={() => setModal("ex")}
        cta={CTAS[step - 1]}
        onNext={next}
      />

      {modal === "how" && (
        <WizardModal onClose={() => setModal(null)} labelledBy="how-title">
          <div id="how-title" className="display mr-8 text-lg text-gold">
            HOW IT WORKS
          </div>
          <p className="text-[13px] leading-normal text-cream/90">
            ChatGPT writes the image prompt for you first, then you run that
            prompt — two messages total.
          </p>
          <ol className="grid list-decimal gap-1.5 pl-[18px] text-[13px] leading-normal text-cream/90">
            <li>Describe your idea (and which image is which).</li>
            <li>Attach your images + paste your message &rarr; send.</li>
            <li>ChatGPT replies with a ready-to-run image prompt.</li>
            <li>New message: same images + that prompt &rarr; send.</li>
            <li>Reply with tweaks until it&rsquo;s perfect.</li>
          </ol>
          <p className="text-[13px] font-bold leading-normal text-gold">
            Result = any custom hero image — group shots, parties, events.
          </p>
        </WizardModal>
      )}

      {modal === "ex" && (
        <ExampleChatModal
          onClose={() => setModal(null)}
          inputs={exampleInputs}
          message={
            <>
              Generate a prompt for adding these heroes to the diamond party.
              Image 1 is the base; each other image is a hero to include…{" "}
              <span className="text-[#9b9b9b]">
                (your description + reference prompt)
              </span>
            </>
          }
          output={exampleOutput}
          outputCaption="ChatGPT — your custom image (after running its prompt)"
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
