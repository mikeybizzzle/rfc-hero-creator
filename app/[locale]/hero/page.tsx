import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { findWalkthrough } from "@/lib/chats";
import {
  baseTemplates,
  heroRefName,
  heroRefsSorted,
  chatImages,
} from "@/lib/data";
import { ProcessStrip } from "@/components/process-strip";
import { HeroWizard } from "@/components/wizard/hero-wizard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("heroTitle"), description: t("heroDescription") };
}

const templateOrder = [
  "s-orange-template",
  "a-purple-template",
  "b-blue-template",
];

export default async function HeroPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("HeroPage");
  const tTemplates = await getTranslations("Templates");

  const templateMeta: Record<string, { name: string; label: string }> = {
    "s-orange-template": { name: tTemplates("sName"), label: tTemplates("sLabel") },
    "a-purple-template": { name: tTemplates("aName"), label: tTemplates("aLabel") },
    "b-blue-template": { name: tTemplates("bName"), label: tTemplates("bLabel") },
  };

  const walkthrough = findWalkthrough("hero-card-from-photo")!;
  const chat = chatImages.chat1;
  const provided = chat["message-1-provided-images"];
  const output = chat["image-outputs"][0];

  const templates = templateOrder.map((slug) => {
    const tpl = baseTemplates.find((b) => b.slug === slug)!;
    return {
      src: tpl.src,
      copyUrl: tpl.download ?? tpl.src,
      name: templateMeta[slug].name,
      label: templateMeta[slug].label,
    };
  });

  const styles = heroRefsSorted.map((img) => {
    const name = heroRefName(img);
    return {
      src: img.src,
      copyUrl: img.download ?? img.src,
      name,
      label: name,
    };
  });

  return (
    <div className="pb-6">
      <section className="atmosphere border-b border-line/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 pb-7 pt-8 sm:pb-9 sm:pt-12 md:flex-row md:items-center md:gap-6 lg:gap-8">
          <div className="min-w-0 flex-1">
          <h1 className="display max-w-[860px] text-balance text-[clamp(34px,6vw,56px)] leading-[1.02] tracking-[-0.01em]">
            {t.rich("title", {
              gold: (chunks) => (
                <span className="lz-goldtext">
                  <span aria-hidden="true" className="lz-goldtext-outline">
                    {chunks}
                  </span>
                  <span className="lz-goldtext-fill">{chunks}</span>
                </span>
              ),
            })}
          </h1>
          <p className="mt-3 max-w-[620px] text-pretty text-[clamp(16px,2.5vw,19px)] leading-relaxed text-muted">
            {t.rich("intro", {
              strong: (chunks) => (
                <strong className="text-cream">{chunks}</strong>
              ),
            })}
          </p>
          </div>
          <div className="md:shrink-0">
            <ProcessStrip
              walkthrough={walkthrough}
              inputLabels={[t("inputBase"), t("inputStyle"), t("inputPhoto")]}
              outputLabel={t("outputLabel")}
            />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8">
        <HeroWizard
          templates={templates}
          styles={styles}
          photoExample={{ src: provided[2].src, alt: t("altExamplePhoto") }}
          exampleInputs={[
            { src: provided[0].src, alt: t("altBaseCard") },
            { src: provided[1].src, alt: t("altStyleExample") },
            { src: provided[2].src, alt: t("altYourPhoto") },
          ]}
          exampleOutput={{ src: output.src, alt: t("altFinished") }}
        />
      </div>
    </div>
  );
}
