import Image from "next/image";
import type { ChatMessage, Walkthrough } from "@/lib/chats";

function Message({ m }: { m: ChatMessage }) {
  const isUser = m.role === "user";
  return (
    <div className={`max-w-[88%] ${isUser ? "ml-auto" : "mr-auto"}`}>
      <p className={`hud text-[10px] text-muted mb-1.5 ${isUser ? "text-right" : ""}`}>
        {isUser ? "You" : "ChatGPT"}
      </p>
      {isUser && m.images && (
        <div className="flex flex-wrap gap-1.5 justify-end mb-1.5">
          {m.images.map((img) => (
            <div key={img.slug} className="relative w-14 h-14 card-frame overflow-hidden">
              <Image src={img.src} alt="" fill sizes="56px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
      {m.text && (
        <div
          className={`border border-line p-3 text-cream/90 ${
            isUser ? "bg-raised" : "bg-surface"
          } ${m.isPrompt ? "prompt-block max-h-56 overflow-y-auto" : "text-sm leading-relaxed whitespace-pre-wrap"}`}
        >
          {m.text}
        </div>
      )}
      {!isUser && m.images && (
        <div className="flex flex-wrap gap-2 mt-1.5">
          {m.images.map((img) => (
            <div key={img.slug} className="relative w-36 sm:w-44 aspect-square card-frame overflow-hidden">
              <Image src={img.src} alt="" fill sizes="176px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ExampleDropdown({ walkthrough }: { walkthrough: Walkthrough }) {
  return (
    <details className="card-frame">
      <summary className="hud text-xs text-gold px-4 py-3 cursor-pointer list-none flex items-center justify-between gap-3">
        See an example
        <span className="text-muted">+</span>
      </summary>
      <div className="border-t border-line p-4 space-y-6">
        {walkthrough.messages.map((m, i) => (
          <Message key={i} m={m} />
        ))}
      </div>
    </details>
  );
}
