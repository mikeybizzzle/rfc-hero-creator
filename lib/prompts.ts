// Prompt templates are verbatim from the v2 Claude Design pages
// (Hero Character From Image v2 / Without Image v2 / Custom Image v2).
// Only the bracketed placeholders and rank-specific lines are substituted.

export type Rank = "S" | "A" | "B";
export type RankChoice = Rank | "custom";
export type CustomCard = { letter: string; color: string };

type RankLines = { bg: string; emblem: string; badges: string };

const photoRanks: Record<Rank, RankLines> = {
  S: {
    bg: "warm golden/orange dusty game background",
    emblem: "large gold “S” rank emblem on the left",
    badges: "red badge icon, silver shield icon, and gold “S2” icon in the same positions",
  },
  A: {
    bg: "purple misty game background",
    emblem: "large purple “A” rank emblem on the left",
    badges: "red badge icon, silver shield icon, and gold “S2” icon in the same positions",
  },
  B: {
    bg: "blue gradient game background",
    emblem: "large blue “B” rank emblem on the left",
    badges: "red badge icon, silver shield icon, and gold “S2” icon in the same positions",
  },
};

const noPhotoRanks: Record<Rank, RankLines> = {
  S: {
    bg: "warm golden/orange dusty game background",
    emblem: "large gold “S” rank emblem on the left",
    badges: "red badge icon and silver shield icon in the same positions",
  },
  A: {
    bg: "purple misty game background",
    emblem: "large purple “A” rank emblem on the left",
    badges: "red badge icon and silver shield icon in the same positions",
  },
  B: {
    bg: "blue gradient game background",
    emblem: "large blue “B” rank emblem on the left",
    badges: "blue badge icon and silver shield icon in the same positions",
  },
};

const rankThemeWord: Record<Rank, string> = {
  S: "golden/orange",
  A: "purple",
  B: "blue",
};

function customBlock(rank: Rank, custom: CustomCard): string {
  const letter = custom.letter.trim() || "[LETTER]";
  const color = custom.color.trim() || "[THEME COLOR]";
  return `

Custom card changes — apply these to the base card from Image 1:
- Change the “${rank}” rank letter to “${letter}”
- Change the card’s ${rankThemeWord[rank]} theme (background tint, rank emblem, and UI accents) to ${color}`;
}

export function heroCardPrompt(
  rank: Rank,
  name: string,
  details: string,
  custom: CustomCard | null
): string {
  const r = photoRanks[rank];
  const heroName = name.trim() || "[YOUR HERO NAME]";
  let p = `Use the 3 attached images as references:

Image 1 = the base hero-card background with UI elements and no character.
Image 2 = the example hero character image showing the target style, realism, lighting, character placement, scale, and game-card format.
Image 3 = the person/character to transform into the hero character.

Generate a new hero character image using Image 1 as the exact base composition.

Preserve Image 1’s background and UI layout as closely as possible:
- Keep the ${r.bg}.
- Keep the ${r.emblem}.
- Keep the ${r.badges}.
- Keep the same overall portrait/square hero-card layout and cinematic game UI aesthetic.
- Replace the name with: “${heroName}”
- Match the name text style: bold cream/white letters, thick black outline, game UI font, same placement.

Create the hero character from Image 3 in the same style as Image 2:
- Turn the subject into a high-quality realistic game hero character.
- Preserve the subject’s key identity, facial features, body/character traits, colors, accessories, and personality.
- Adapt the subject into a cinematic survival-shooter/mobile-game hero design.
- The character should be positioned in the center/right foreground like Image 2.
- The character should feel integrated into the same lighting, shadows, color grading, and depth as the background.
- Use sharp, high-detail rendering with realistic textures, dramatic lighting, and polished game-character artwork quality.
- Make the character look powerful, memorable, and slightly exaggerated in a fun hero-card style, while still recognizable from Image 3.

Important:
- Do not copy the theme of the hero from reference image #2, but rather imagine an entirely new character theme for the new hero character from your analysis of reference image #3.
- Do not add extra text, buttons, menus, watermarks, logos, or unrelated UI.
- Do not crop off important parts of the character.
- Keep the final image clean, polished, and ready to use as a hero character card.

Hero character name: “${heroName}”`;
  if (details.trim()) {
    p += `

Additional details: ${details.trim()}`;
  }
  if (custom) p += customBlock(rank, custom);
  return p;
}

export function heroCardNoPhotoPrompt(
  rank: Rank,
  name: string,
  details: string,
  custom: CustomCard | null
): string {
  const r = noPhotoRanks[rank];
  const heroName = name.trim() || "[YOUR HERO NAME]";
  const characterDetails =
    details.trim() ||
    "[Describe your hero: look, vibe, outfit — plus any card changes like swapping the rank letter or recoloring the UI]";
  let p = `Use the attached images as references:

Image 1 = the base hero-card background with UI elements and no character.
Image 2 = the example hero character image showing the target style, realism, lighting, character placement, scale, and game-card format.
Image 3 = an additional example hero character image for inspiration

Generate a new hero character image using Image 1 as the exact base composition.

Preserve Image 1’s background and UI layout as closely as possible:
- Keep the ${r.bg}.
- Keep the ${r.emblem}.
- Keep the ${r.badges}.
- Keep the same overall portrait/square hero-card layout and cinematic game UI aesthetic.
- Replace the name with: “${heroName}”
- Match the name text style: bold cream/white letters, thick black outline, game UI font, same placement.

Create a hero character in the same style as Image 2:
- Use the image 3 reference along with the hero character details below to imagine your hero character.
- Turn the hero character details into a high-quality realistic game hero character.
- Adapt the subject into a cinematic survival-shooter/mobile-game hero design.
- The character should be positioned in the center/right foreground like Image 2.
- The character should feel integrated into the same lighting, shadows, color grading, and depth as the background.
- Use sharp, high-detail rendering with realistic textures, dramatic lighting, and polished game-character artwork quality.
- Make the character look powerful, memorable, and slightly exaggerated in a fun hero-card style

Important:
- Do not copy the theme of the hero from reference image #2, but rather imagine an entirely new character theme for the new hero character
- Do not add extra text, buttons, menus, watermarks, logos, or unrelated UI.
- Do not crop off important parts of the character.
- Keep the final image clean, polished, and ready to use as a hero character card.

Hero character name: “${heroName}”

Additional hero character details:
${characterDetails}`;
  if (custom) p += customBlock(rank, custom);
  return p;
}

const referencePrompt = `Use the 3 attached images as references:

Image 1 = the base hero-card background with UI elements and no character.
Image 2 = the example hero character image showing the target style, realism, lighting, character placement, scale, and game-card format.
Image 3 = the person/character to transform into the hero character.

Generate a new hero character image using Image 1 as the exact base composition.

Preserve Image 1’s background and UI layout as closely as possible:
- Keep the warm golden/orange dusty game background.
- Keep the large gold “S” rank emblem on the left.
- Keep the red badge icon, silver shield icon, and gold “S2” icon in the same positions.
- Keep the same overall portrait/square hero-card layout and cinematic game UI aesthetic.
- Replace the name with: “[HERO CHARACTER NAME]”
- Match the name text style: bold cream/white letters, thick black outline, game UI font, same placement.

Create the hero character from Image 3 in the same style as Image 2:
- Turn the subject into a high-quality realistic game hero character.
- Preserve the subject’s key identity, facial features, body/character traits, colors, accessories, and personality.
- Adapt the subject into a cinematic survival-shooter/mobile-game hero design.
- The character should be positioned in the center/right foreground like Image 2.
- The character should feel integrated into the same lighting, shadows, color grading, and depth as the background.
- Use sharp, high-detail rendering with realistic textures, dramatic lighting, and polished game-character artwork quality.
- Make the character look powerful, memorable, and slightly exaggerated in a fun hero-card style, while still recognizable from Image 3.

Important:
- Do not copy the theme of the hero from reference image #2, but rather imagine an entirely new character theme for the new hero character from your analysis of reference image #3.
- Do not add extra text, buttons, menus, watermarks, logos, or unrelated UI.
- Do not crop off important parts of the character.
- Keep the final image clean, polished, and ready to use as a hero character card.

Hero character name: “IronBastion”`;

export function metaPrompt(description: string): string {
  const details =
    description.trim() ||
    "[Describe the image you want: what it shows, which attached image is the base, what each other image contains, and that quality/detail should match. This prompt will be provided along with the images. Format the prompt similar to the reference prompt below.]";
  return `${details}

## REFERENCE PROMPT

${referencePrompt}`;
}
