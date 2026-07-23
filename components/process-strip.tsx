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
  const gridInputs = inputs.length >= 3;

  return (
    <div
      className="flex items-center gap-3 sm:gap-4"
      aria-label="Image creation flow"
    >
      <div
        className={
          gridInputs
            ? "grid grid-cols-[auto_auto] gap-2 sm:flex sm:flex-wrap sm:gap-2.5"
            : "flex flex-wrap gap-2 sm:gap-2.5"
        }
      >
        {inputs.map((img, i) => (
          <figure key={img.slug} className="m-0 grid gap-[5px] justify-items-center">
            <div
              className={`relative aspect-square w-[min(16vw,76px)] overflow-hidden rounded-[10px] md:w-16 lg:w-[76px] ${thumbBorder}`}
            >
              <Image
                src={img.src}
                alt={inputLabels?.[i] ?? `Image ${i + 1}`}
                fill
                sizes="84px"
                className="object-cover"
              />
            </div>
            <figcaption className="whitespace-nowrap text-[10px] font-bold text-muted sm:text-[11px]">
              {i + 1}
              {inputLabels?.[i] ? ` · ${inputLabels[i]}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
      <span className="display shrink-0 text-xl text-gold" aria-hidden="true">
        &rarr;
      </span>
      <figure className="m-0 grid shrink-0 gap-[5px] justify-items-center">
        <div
          className={`relative aspect-square w-[min(28vw,116px)] overflow-hidden rounded-xl md:w-24 lg:w-[116px] ${thumbBorder}`}
        >
          <Image src={output.src} alt={outputLabel} fill sizes="116px" className="object-cover" />
        </div>
        <figcaption className="whitespace-nowrap text-[10px] font-bold text-muted sm:text-[11px]">
          {outputLabel}
        </figcaption>
      </figure>
    </div>
  );
}
