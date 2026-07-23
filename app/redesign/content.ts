import { findGallery } from "@/lib/data";

export const paths = [
  {
    href: "/hero",
    title: "Hero Character (From Image)",
    text: "Turn yourself — or anyone — into a hero card with your name on it.",
    imageSlug: "ausryte",
  },
  {
    href: "/unique",
    title: "Hero Character (Without Image)",
    text: "No photo needed — describe your hero and ChatGPT invents them.",
    imageSlug: "coqueta-farm",
  },
  {
    href: "/custom",
    title: "Custom Image",
    text: "Make any kind of hero image you want — group shots, events, themes.",
    imageSlug: "diamond-party-heros",
  },
];

const wall: [string, string][] = [
  ["ausryte", "Aušrytė"],
  ["supert-diamond-party", "SuperT · Diamond Party"],
  ["coqueta-farm", "CoquetaFarm"],
  ["ironbastion", "IronBastion"],
  ["deathhawk", "DeathHawk"],
  ["babyyaga", "BabyYaga"],
  ["kriss-de-valnor", "Kriss de Valnor"],
  ["remon-pharaoh", "Remon Pharaoh"],
  ["yousef-rocket-man", "Yousef Rocket Man"],
  ["nyabinghi-x", "Nyabinghi X"],
  ["azteca-mau", "Azteca Mau"],
  ["castor-troy", "Castor Troy"],
  ["coachardi", "CoachArdi"],
  ["gerardo-o", "Gerardo O"],
  ["jungle-boy", "Jungle Boy"],
  ["jungle-lindy", "Jungle Lindy"],
  ["lolybear", "LolyBear"],
  ["mbizzzle", "MBizzzle"],
  ["mr-bean", "Mr Bean"],
  ["nisse", "Nisse"],
  ["oldhippie", "OldHippie"],
  ["pope-bear", "Pope Bear"],
  ["pope-bear-hot-tub", "Pope Bear · Hot Tub"],
  ["supert", "SuperT"],
  ["diamond-party-heros", "Diamond Party Crew"],
  ["new-season-heros", "New Season Heroes"],
];

export function wallItems() {
  return wall.map(([slug, name]) => {
    const img = findGallery(slug);
    return { src: img.src, copyUrl: img.download ?? img.src, name };
  });
}

export const navLinks = [
  { label: "Hero (From Image)", href: "/hero" },
  { label: "Custom Image", href: "/custom" },
  { label: "Hero (Without Image)", href: "/unique" },
  { label: "Gallery", href: "/gallery" },
] as const;
