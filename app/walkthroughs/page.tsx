import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { walkthroughs } from "@/lib/chats";

export const metadata: Metadata = {
  title: "Walkthroughs — RFC Hero Creator",
  description: "Real ChatGPT conversations behind the hero cards, start to finish.",
};

export default function WalkthroughsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <p className="hud text-xs text-gold mb-3">Walkthroughs</p>
      <h1 className="display text-3xl md:text-5xl mb-4">Real conversations</h1>
      <p className="text-muted leading-relaxed max-w-2xl mb-12">
        The actual ChatGPT chats behind three cards — every prompt, image, and follow-up
        exactly as sent.
      </p>
      <div className="space-y-4">
        {walkthroughs.map((w, i) => {
          const output = w.messages.findLast((m) => m.role === "assistant" && m.images?.length)
            ?.images?.[0];
          return (
            <Link
              key={w.slug}
              href={`/walkthroughs/${w.slug}`}
              className="card-frame p-5 flex gap-5 items-center group hover:border-gold/50 transition-colors"
            >
              {output && (
                <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0 overflow-hidden card-frame">
                  <Image
                    src={output.src}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="hud text-xs text-gold/60 mb-1">Walkthrough {i + 1}</p>
                <h2 className="display text-lg md:text-xl group-hover:text-gold transition-colors">
                  {w.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed mt-1">{w.summary}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
