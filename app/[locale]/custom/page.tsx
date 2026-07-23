import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { findWalkthrough } from "@/lib/chats";
import { findGallery, chatImages } from "@/lib/data";
import { ProcessStrip } from "@/components/process-strip";
import { CustomWizard } from "@/components/wizard/custom-wizard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("customTitle"), description: t("customDescription") };
}

const refList: [slug: string, name: string][] = [
  ["supert-diamond-party", "SuperT · Diamond Party"],
  ["supert", "SuperT"],
  ["ausryte", "Aušrytė"],
  ["ironbastion", "IronBastion"],
  ["deathhawk", "DeathHawk"],
  ["babyyaga", "BabyYaga"],
  ["coqueta-farm", "CoquetaFarm"],
  ["kriss-de-valnor", "Kriss de Valnor"],
  ["remon-pharaoh", "Remon Pharaoh"],
  ["yousef-rocket-man", "Yousef Rocket Man"],
  ["nyabinghi-x", "Nyabinghi X"],
  ["castor-troy", "Castor Troy"],
  ["mr-bean", "Mr Bean"],
  ["oldhippie", "OldHippie"],
  ["pope-bear", "Pope Bear"],
  ["lolybear", "LolyBear"],
];

export default async function CustomPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("CustomPage");

  const walkthrough = findWalkthrough("group-scene")!;
  const chat = chatImages.chat2;
  const provided = chat["message-1-provided-images"];
  const output = chat["image-outputs"][0];

  const refs = refList.map(([slug, name]) => {
    const img = findGallery(slug);
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
        <div className="mx-auto max-w-6xl px-4 pb-7 pt-8 sm:pb-9 sm:pt-12">
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
          <div className="mt-5">
            <ProcessStrip
              walkthrough={walkthrough}
              inputLabels={[
                t("inputBase"),
                t("inputHero"),
                t("inputHero"),
                t("inputHero"),
              ]}
              outputLabel={t("outputLabel")}
            />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:pt-8">
        <CustomWizard
          refs={refs}
          exampleInputs={provided.map((img, i) => ({
            src: img.src,
            alt: i === 0 ? t("altBaseImage") : t("altHero"),
          }))}
          exampleOutput={{ src: output.src, alt: t("altResult") }}
        />
      </div>
    </div>
  );
}
