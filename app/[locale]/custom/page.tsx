import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { findWalkthrough } from "@/lib/chats";
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

export default async function CustomPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("CustomPage");

  const walkthrough = findWalkthrough("group-scene")!;

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
        <CustomWizard />
      </div>
    </div>
  );
}
