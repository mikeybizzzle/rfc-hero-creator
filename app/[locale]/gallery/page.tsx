import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LightboxGallery } from "@/components/lightbox-gallery";
import { gallery, galleryName } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("galleryTitle"), description: t("galleryDescription") };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("GalleryPage");

  const items = gallery.map((g) => ({ ...g, name: galleryName(g) }));

  return (
    <div>
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-7 sm:pb-10 sm:pt-11">
          <p className="hud mb-2 text-[11px] text-gold sm:text-xs">
            {t("kicker")}
          </p>
          <h1 className="display text-balance text-[clamp(34px,5.5vw,52px)] leading-[1.02] tracking-[-0.01em]">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-[640px] text-pretty text-[clamp(15px,2.5vw,18px)] leading-relaxed text-muted">
            {t("intro")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <LightboxGallery items={items} />
      </div>
    </div>
  );
}
