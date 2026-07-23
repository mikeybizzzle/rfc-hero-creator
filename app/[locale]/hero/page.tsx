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
      <section className="atmosphere">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-8 pt-7 sm:pt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-12">
          <div>
            <h1 className="display max-w-[820px] text-balance text-[clamp(30px,5.5vw,46px)] leading-[1.02] tracking-[-0.01em]">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-[640px] text-pretty text-[clamp(14px,2.5vw,17px)] leading-relaxed text-muted">
              {t.rich("intro", {
                strong: (chunks) => (
                  <strong className="text-cream">{chunks}</strong>
                ),
              })}
            </p>
            <div className="mt-4">
              <ProcessStrip
                walkthrough={walkthrough}
                inputLabels={[t("inputBase"), t("inputStyle"), t("inputPhoto")]}
                outputLabel={t("outputLabel")}
              />
            </div>
          </div>
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
      </section>
    </div>
  );
}
