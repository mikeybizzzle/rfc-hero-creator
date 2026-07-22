import Image from "next/image";
import { Fragment } from "react";
import type { Walkthrough } from "@/lib/chats";

export function ProcessStrip({ walkthrough }: { walkthrough: Walkthrough }) {
  const inputs = walkthrough.messages[0].images ?? [];
  const outputs =
    walkthrough.messages.find((m) => m.role === "assistant" && m.images?.length)?.images ?? [];
  const output = outputs[outputs.length - 1];

  return (
    <div className="card-frame p-3 flex flex-wrap items-center gap-x-2 gap-y-3">
      {inputs.map((img, i) => (
        <Fragment key={img.slug}>
          {i > 0 && <span className="hud text-xs text-muted">+</span>}
          <div>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 card-frame overflow-hidden">
              <Image
                src={img.src}
                alt={`Image ${i + 1}`}
                fill
                sizes="(max-width: 640px) 48px, 64px"
                className="object-cover"
              />
            </div>
            <p className="hud text-[11px] text-muted text-center mt-1">{i + 1}</p>
          </div>
        </Fragment>
      ))}
      <div className="flex items-center gap-x-3">
        <span className="display text-lg text-gold ml-1.5">&rarr;</span>
        <div>
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 card-frame overflow-hidden">
            <Image
              src={output.src}
              alt="Output"
              fill
              sizes="(max-width: 640px) 80px, 96px"
              className="object-cover"
            />
          </div>
          <p className="hud text-[11px] text-gold text-center mt-1">Output</p>
        </div>
      </div>
    </div>
  );
}
