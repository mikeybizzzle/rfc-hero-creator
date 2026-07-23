import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  HeroWizard,
  type HeroConcept,
} from "@/components/hero-concepts/hero-wizard";
import { findWalkthrough } from "@/lib/chats";
import { baseTemplates, heroRefsSorted } from "@/lib/data";

const concepts: HeroConcept[] = ["focus", "workbench", "missions"];

export function generateStaticParams() {
  return concepts.map((concept) => ({ concept }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ concept: string }>;
}): Promise<Metadata> {
  const { concept } = await params;
  const title =
    concept === "focus"
      ? "Focus Card"
      : concept === "workbench"
        ? "Visual Workbench"
        : concept === "missions"
          ? "Mission Stack"
          : "Hero Flow Concept";

  return {
    title: `${title} | RfC Hero Forge`,
    description: `Private ${title} prototype for the Hero Character creation flow.`,
  };
}

export default async function HeroConceptPage({
  params,
}: {
  params: Promise<{ concept: string }>;
}) {
  const { concept } = await params;
  if (!concepts.includes(concept as HeroConcept)) notFound();

  const walkthrough = findWalkthrough("hero-card-from-photo");
  if (!walkthrough) notFound();

  return (
    <HeroWizard
      concept={concept as HeroConcept}
      templates={baseTemplates}
      styles={heroRefsSorted}
      walkthrough={walkthrough}
    />
  );
}
