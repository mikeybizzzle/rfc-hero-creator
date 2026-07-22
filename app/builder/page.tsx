import type { Metadata } from "next";
import { PromptBuilder } from "@/components/prompt-builder";

export const metadata: Metadata = {
  title: "Prompt Builder — RFC Hero Creator",
  description: "Fill in your hero name and details to generate your ChatGPT prompt.",
};

export default function BuilderPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <p className="hud text-xs text-gold mb-3">Prompt Builder</p>
      <h1 className="display text-3xl md:text-5xl mb-4">Build your prompt</h1>
      <p className="text-muted leading-relaxed max-w-2xl mb-12">
        Pick a mode, fill in the fields, and copy the finished prompt. Then paste it into
        ChatGPT together with the images listed under &ldquo;Attach with this prompt.&rdquo;
      </p>
      <PromptBuilder />
    </div>
  );
}
