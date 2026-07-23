"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { ChatMessage, Walkthrough } from "@/lib/chats";

function TranscriptMessage({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const text = message.text?.replace(/[—–]/g, "-");

  return (
    <div className={isUser ? "ml-6" : "mr-6"}>
      <p
        className={`mb-1 text-[10px] font-extrabold uppercase tracking-[.08em] text-muted ${
          isUser ? "text-right" : ""
        }`}
      >
        {isUser ? "You" : "ChatGPT"}
      </p>
      {message.images && (
        <div
          className={`mb-1.5 flex flex-wrap gap-1.5 ${
            isUser ? "justify-end" : ""
          }`}
        >
          {message.images.map((image, index) => (
            <div
              key={image.slug}
              className="relative size-12 overflow-hidden rounded-lg border border-line bg-raised"
            >
              <Image
                src={image.src}
                alt={
                  isUser
                    ? `Attached reference ${index + 1}`
                    : "Generated hero card"
                }
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
      {text && (
        <div
          className={`rounded-xl border border-line p-2.5 text-[11px] leading-relaxed text-cream/85 ${
            isUser ? "bg-raised" : "bg-surface"
          } ${message.isPrompt ? "max-h-40 overflow-y-auto font-mono" : "whitespace-pre-wrap"}`}
        >
          {text}
        </div>
      )}
    </div>
  );
}

type OpenPanel = "example" | "how" | null;

export function WorkflowHelpDropdowns({
  walkthrough,
}: {
  walkthrough: Walkthrough;
}) {
  const [open, setOpen] = useState<OpenPanel>(null);
  const panelId = useId();
  const exampleRef = useRef<HTMLButtonElement>(null);
  const howRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const trigger = open === "example" ? exampleRef.current : howRef.current;
      setOpen(false);
      trigger?.focus();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function toggle(panel: Exclude<OpenPanel, null>) {
    setOpen((current) => (current === panel ? null : panel));
  }

  return (
    <div className="relative z-30">
      <div className="grid grid-cols-2 gap-2">
        <button
          ref={exampleRef}
          type="button"
          aria-expanded={open === "example"}
          aria-controls={panelId}
          onClick={() => toggle("example")}
          className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 text-left text-[10px] font-extrabold uppercase tracking-[.06em] transition-colors sm:text-xs ${
            open === "example"
              ? "border-gold bg-gold/10 text-gold-bright"
              : "border-line bg-raised/90 text-cream hover:border-gold/60"
          }`}
        >
          See example
          <span
            aria-hidden="true"
            className={`text-base text-muted transition-transform ${
              open === "example" ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
        <button
          ref={howRef}
          type="button"
          aria-expanded={open === "how"}
          aria-controls={panelId}
          onClick={() => toggle("how")}
          className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 text-left text-[10px] font-extrabold uppercase tracking-[.06em] transition-colors sm:text-xs ${
            open === "how"
              ? "border-gold bg-gold/10 text-gold-bright"
              : "border-line bg-raised/90 text-cream hover:border-gold/60"
          }`}
        >
          How it works
          <span
            aria-hidden="true"
            className={`text-base text-muted transition-transform ${
              open === "how" ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
      </div>

      {open !== null && (
        <div
          id={panelId}
          role="region"
          aria-label={
            open === "example"
              ? "Example ChatGPT conversation"
              : "How the hero workflow works"
          }
          className="absolute inset-x-0 top-[calc(100%+.4rem)] max-h-[min(58dvh,480px)] overflow-y-auto rounded-xl border border-gold/35 bg-bg/98 p-3 shadow-[0_26px_70px_rgba(0,0,0,.62)]"
        >
          {open === "example" ? (
            <>
              <div className="mb-3 border-b border-line pb-2">
                <p className="display text-base text-cream">
                  {walkthrough.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                  {walkthrough.summary.replace(/[—–]/g, "-")}
                </p>
              </div>
              <div className="space-y-4">
                {walkthrough.messages.map((message, index) => (
                  <TranscriptMessage key={index} message={message} />
                ))}
              </div>
            </>
          ) : (
            <div>
              <p className="text-xs font-bold leading-relaxed text-cream">
                We give ChatGPT clear instructions and reference images to turn
                your person or character into a hero character.
              </p>
              <ol className="mt-3 space-y-2">
                {[
                  "Provide a base card template.",
                  "Provide a hero image for style accuracy.",
                  "Provide 1-3 images of your person or character.",
                  "Fill out the prompt details and paste the prompt into ChatGPT.",
                  "Hit Send to generate your hero.",
                ].map((item, index) => (
                  <li
                    key={item}
                    className="grid grid-cols-[24px_1fr] gap-2 text-[11px] leading-relaxed text-muted"
                  >
                    <span className="display grid size-6 place-items-center rounded-md bg-gold text-xs text-ink">
                      {index + 1}
                    </span>
                    <span className="pt-1">{item}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-3 rounded-lg border border-gold/25 bg-gold/8 p-3">
                <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-gold">
                  Result
                </p>
                <p className="mt-1 text-xs leading-relaxed text-cream">
                  A hero character image in the same style and format as the
                  game&apos;s hero characters.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
