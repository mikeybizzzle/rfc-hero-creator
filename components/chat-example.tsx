import Image from "next/image";
import type { ChatMessage, Walkthrough } from "@/lib/chats";

function Message({ m }: { m: ChatMessage }) {
  const isUser = m.role === "user";
  return (
    <div className={`max-w-[88%] ${isUser ? "ml-auto" : "mr-auto"}`}>
      <p className={`font-bold text-[11.5px] text-muted mb-1.5 ${isUser ? "text-right" : ""}`}>
        {isUser ? "You" : "ChatGPT"}
      </p>
      {isUser && m.images && (
        <div className="flex flex-wrap gap-1.5 justify-end mb-1.5">
          {m.images.map((img, i) => (
            <div key={img.slug} className="relative w-14 h-14 card-frame rounded-lg overflow-hidden">
              <Image src={img.src} alt={`Reference image ${i + 1}`} fill sizes="56px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
      {m.text && (
        <div
          className={`border border-line rounded-xl p-3 text-cream/90 ${
            isUser ? "bg-raised" : "bg-surface"
          } ${m.isPrompt ? "prompt-block max-h-56 overflow-y-auto" : "text-sm leading-relaxed whitespace-pre-wrap"}`}
          {...(m.isPrompt ? { tabIndex: 0, role: "region", "aria-label": "Prompt text" } : {})}
        >
          {m.text}
        </div>
      )}
      {!isUser && m.images && (
        <div className="flex flex-wrap gap-2 mt-1.5">
          {m.images.map((img) => (
            <div key={img.slug} className="relative w-36 sm:w-44 aspect-square card-frame rounded-xl overflow-hidden">
              <Image
                src={img.src}
                alt="Generated result"
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ExampleDropdown({ walkthrough }: { walkthrough: Walkthrough }) {
  return (
    <details className="card-frame group overflow-hidden rounded-[18px]">
      <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-cream transition-colors hover:bg-raised hover:text-gold group-open:bg-raised sm:px-5">
        See an example
        <span
          aria-hidden="true"
          className="grid h-7 w-7 place-items-center rounded-lg border border-line text-lg text-muted transition-transform duration-150 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="space-y-6 border-t border-line p-4 sm:p-5">
        {walkthrough.messages.map((m, i) => (
          <Message key={i} m={m} />
        ))}
      </div>
    </details>
  );
}
