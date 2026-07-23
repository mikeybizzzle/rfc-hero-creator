import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="display text-[clamp(30px,5.5vw,46px)]">{t("title")}</h1>
    </div>
  );
}
