import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { findWalkthrough, walkthroughs, type ChatMessage } from "@/lib/chats";

export function generateStaticParams() {
  return walkthroughs.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = findWalkthrough(slug);
  return { title: `${w?.title ?? "Walkthrough"} — RFC Hero Creator` };
}

export default async function WalkthroughPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const walkthrough = findWalkthrough(slug);
  if (!walkthrough) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <Link href="/walkthroughs" className="hud text-xs text-muted hover:text-gold transition-colors">
        &larr; All walkthroughs
      </Link>
      <h1 className="display text-3xl md:text-4xl mt-4 mb-3">{walkthrough.title}</h1>
      <p className="text-muted leading-relaxed mb-12">{walkthrough.summary}</p>

      <div className="space-y-8">
        {walkthrough.messages.map((message, i) => (
          <Message key={i} message={message} />
        ))}
      </div>
    </div>
  );
}

function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={isUser ? "md:pl-10" : "md:pr-10"}>
      <p className={`hud text-xs mb-2 ${isUser ? "text-gold" : "text-muted"}`}>
        {isUser ? "Member" : "ChatGPT"}
      </p>
      <div className={`card-frame ${isUser ? "border-l-2 border-l-gold" : ""}`}>
        {message.images && message.images.length > 0 && (
          <div className="p-3 border-b border-line">
            <p className="hud text-xs text-muted mb-2">
              {isUser
                ? `Attached ${message.images.length} image${message.images.length > 1 ? "s" : ""}`
                : "Generated image"}
            </p>
            <div
              className={
                isUser
                  ? "grid grid-cols-4 sm:grid-cols-5 gap-2"
                  : "grid grid-cols-1 gap-2"
              }
            >
              {message.images.map((img, i) => (
                <div
                  key={img.slug}
                  className={`relative overflow-hidden card-frame ${
                    isUser ? "aspect-square" : "aspect-square max-w-lg"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={isUser ? `Attached image ${i + 1}` : "Generated output"}
                    fill
                    sizes={isUser ? "120px" : "(max-width: 640px) 100vw, 512px"}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {message.text &&
          (message.isPrompt ? (
            <details className="group">
              <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="hud text-xs text-cream">
                  <span className="inline-block transition-transform group-open:rotate-90 mr-2">
                    &rsaquo;
                  </span>
                  {isUser ? "Full prompt" : "Generated prompt"}
                </span>
                <CopyButton text={message.text} />
              </summary>
              <pre className="prompt-block text-cream/90 px-4 pb-4 max-h-[60vh] overflow-auto border-t border-line pt-4">
                {message.text}
              </pre>
            </details>
          ) : (
            <p className="text-sm text-cream/90 leading-relaxed p-4">{message.text}</p>
          ))}
      </div>
    </div>
  );
}
