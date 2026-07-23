import Image from "next/image";
import type { Walkthrough } from "@/lib/chats";

const thumbBorder = "border border-[rgba(255,214,122,.28)]";

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
      className="card-frame flex flex-col items-center gap-2.5 rounded-[18px] px-4 py-4 sm:flex-row sm:justify-center sm:gap-5 sm:p-5"
      aria-label="Image creation flow"
    >
      <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
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
        className="display grid h-7 w-7 shrink-0 rotate-90 place-items-center rounded-full border border-line bg-raised text-lg text-gold sm:rotate-0"
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
