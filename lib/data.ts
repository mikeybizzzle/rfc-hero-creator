import manifest from "./manifest.json";

export type ManifestImage = {
  slug: string;
  file: string;
  src: string;
  width: number;
  height: number;
  download?: string;
};

type ChatImages = Record<string, Record<string, ManifestImage[]>>;

export const baseTemplates = manifest.baseTemplates as ManifestImage[];
export const heroRefs = manifest.heroRefs as ManifestImage[];
export const gallery = manifest.gallery as ManifestImage[];
export const chatImages = manifest.chats as ChatImages;

const rankOrder = { s: 0, a: 1, b: 2 } as const;

export function heroRefName(img: ManifestImage): string {
  // "S - Katrina 01.png" -> "Katrina 01"
  return img.file.replace(/\.[^.]+$/, "").replace(/^[SAB]\s*-\s*/, "");
}

export function heroRefRank(img: ManifestImage): "S" | "A" | "B" {
  return img.file[0] as "S" | "A" | "B";
}

export const heroRefsSorted = [...heroRefs].sort((a, b) => {
  const ra = rankOrder[a.slug[0] as keyof typeof rankOrder];
  const rb = rankOrder[b.slug[0] as keyof typeof rankOrder];
  return ra === rb ? a.slug.localeCompare(b.slug) : ra - rb;
});

export function galleryName(img: ManifestImage): string {
  return img.file.replace(/\.[^.]+$/, "");
}

export function findGallery(slug: string): ManifestImage {
  const img = gallery.find((g) => g.slug === slug);
  if (!img) throw new Error(`gallery image not found: ${slug}`);
  return img;
}

export function findTemplate(slug: string): ManifestImage {
  const img = baseTemplates.find((t) => t.slug === slug);
  if (!img) throw new Error(`template not found: ${slug}`);
  return img;
}
