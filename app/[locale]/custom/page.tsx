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
          <CustomWizard
            refs={refs}
            exampleInputs={provided.map((img, i) => ({
              src: img.src,
              alt: i === 0 ? t("altBaseImage") : t("altHero"),
            }))}
            exampleOutput={{ src: output.src, alt: t("altResult") }}
          />
        </div>
      </section>
    </div>
  );
}
