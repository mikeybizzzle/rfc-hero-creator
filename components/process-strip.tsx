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
    <div className="card-frame rounded-[18px] px-[18px] py-4 flex flex-col items-center sm:flex-row gap-3">
      <div className="flex gap-2.5 flex-wrap justify-center sm:justify-start sm:flex-1 sm:min-w-0">
        {inputs.map((img, i) => (
          <figure key={img.slug} className="m-0 grid gap-[5px] justify-items-center">
            <div
              className={`relative w-[min(20vw,84px)] aspect-square rounded-[10px] overflow-hidden ${thumbBorder}`}
            >
              <Image
                src={img.src}
                alt={inputLabels?.[i] ?? `Image ${i + 1}`}
                fill
                sizes="84px"
                className="object-cover"
              />
            </div>
            <figcaption className="text-[11.5px] font-bold text-muted whitespace-nowrap">
              {i + 1}
              {inputLabels?.[i] ? ` · ${inputLabels[i]}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
      <span className="display text-[26px] text-gold shrink-0 rotate-90 sm:rotate-0">&rarr;</span>
      <figure className="m-0 grid gap-[5px] justify-items-center shrink-0">
        <div
          className={`relative w-[min(34vw,140px)] aspect-square rounded-[10px] overflow-hidden ${thumbBorder}`}
        >
          <Image src={output.src} alt={outputLabel} fill sizes="140px" className="object-cover" />
        </div>
        <figcaption className="text-[11.5px] font-bold text-muted whitespace-nowrap">
          {outputLabel}
        </figcaption>
      </figure>
    </div>
  );
}
