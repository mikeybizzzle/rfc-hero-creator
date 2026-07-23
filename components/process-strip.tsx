import Image from "next/image";
import type { Walkthrough } from "@/lib/chats";

const thumbBorder = "border border-line";

export function ProcessStrip({
  walkthrough,
  inputLabels,
  outputLabel = "Output",
}: {
  walkthrough: Walkthrough;
  inputLabels?: string[];
  outputLabel?: string;
}) {
  const inputs = (walkthrough.messages[0].images ?? []).slice(
    0,
    inputLabels?.length ?? Infinity
  );
  const outputs =
    walkthrough.messages.find((m) => m.role === "assistant" && m.images?.length)?.images ?? [];
  const output = outputs[outputs.length - 1];

  return (
    <div
      className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-4"
      aria-label="Image creation flow"
    >
      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {inputs.map((img, i) => (
          <figure key={img.slug} className="m-0 grid gap-[5px] justify-items-center">
            <div
              className={`relative aspect-square w-[min(18vw,76px)] overflow-hidden rounded-[10px] ${thumbBorder}`}
            >
              <Image
                src={img.src}
                alt={inputLabels?.[i] ?? `Image ${i + 1}`}
                fill
                sizes="84px"
                className="object-cover"
              />
            </div>
            <figcaption className="whitespace-nowrap text-[11px] font-bold text-muted">
              {i + 1}
              {inputLabels?.[i] ? ` · ${inputLabels[i]}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
      <span
        className="display shrink-0 rotate-90 pl-6 text-xl text-gold sm:rotate-0 sm:pl-0"
        aria-hidden="true"
      >
        &rarr;
      </span>
      <figure className="m-0 grid gap-[5px] justify-items-center shrink-0">
        <div
          className={`relative aspect-square w-[min(29vw,116px)] overflow-hidden rounded-xl ${thumbBorder}`}
        >
          <Image src={output.src} alt={outputLabel} fill sizes="116px" className="object-cover" />
        </div>
        <figcaption className="whitespace-nowrap text-[11px] font-bold text-muted">
          {outputLabel}
        </figcaption>
      </figure>
    </div>
  );
}
