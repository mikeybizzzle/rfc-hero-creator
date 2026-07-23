// Prompt templates are verbatim from the source material:
// - heroCardPrompt: chat1/image-gen-prompt-template.md
// - heroCardNoPhotoPrompt: chat3/chat3.md message 1
// - metaPrompt: chat2/meta-prompt-template.md
// Only the bracketed placeholders and the rank-specific background lines
// (which differ between the S template in chat1 and the B template in chat3)
// are substituted.

export type Rank = "S" | "A" | "B";
export type RankChoice = Rank | "custom";
// Custom rank: the member picks their own emblem letter and theme color
export type RankSelection = Rank | { letter: string; color: string };

export const rankInfo: Record<
  Rank,
  { color: string; label: string; templateSlug: string }
> = {
  S: { color: "#e3a83b", label: "S Rank (orange)", templateSlug: "s-orange-template" },
  A: { color: "#c06ae0", label: "A Rank (purple)", templateSlug: "a-purple-template" },
  B: { color: "#4da3e8", label: "B Rank (blue)", templateSlug: "b-blue-template" },
};

// Rank-specific "preserve the background" lines. S is verbatim from chat1,
// B is verbatim from chat3. A follows the same pattern for the purple template.
const rankLines: Record<Rank, string> = {
  S: `- Keep the warm golden/orange dusty game background.
- Keep the large gold “S” rank emblem on the left.
- Keep the red badge icon, silver shield icon, and gold “S2” icon in the same positions.`,
  A: `- Keep the purple gradient game background.
- Keep the large purple “A” rank emblem on the left.
- Keep the red badge icon, silver shield icon, and gold “S2” icon in the same positions.`,
  B: `- Keep the blue gradient game background.
- Keep the large gold “B” rank emblem on the left.
- Keep the blue badge icon and silver shield icon in the same positions.`,
};

function rankLinesFor(sel: RankSelection): string {
  if (typeof sel === "string") return rankLines[sel];
  const letter = sel.letter.trim() || "[RANK LETTER]";
  const color = sel.color.trim() || "[THEME COLOR]";
  return `- Change the game background to ${color}, keeping the same dusty game style.
- Replace the rank emblem on the left with a large ${color} “${letter}” rank emblem in the same style and position.
- Keep the badge icons in the same positions.`;
}

export function heroCardPrompt(rank: RankSelection, name: string, details: string): string {
  const heroName = name.trim() || "[HERO CHARACTER NAME]";
  const extra = details.trim();
  return `Use the 3 attached images as references:

Image 1 = the base hero-card background with UI elements and no character.
Image 2 = the example hero character image showing the target style, realism, lighting, character placement, scale, and game-card format.
Image 3 = the person/character to transform into the hero character.

Generate a new hero character image using Image 1 as the exact base composition.

Preserve Image 1’s background and UI layout as closely as possible:
${rankLinesFor(rank)}
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

Hero character name: “${heroName}”${
    extra
      ? `

Additional details: ${extra}`
      : ""
  }`;
}

export function heroCardNoPhotoPrompt(rank: RankSelection, name: string, details: string): string {
  const heroName = name.trim() || "[HERO CHARACTER NAME]";
  const characterDetails = details.trim() || "[Describe your hero character here]";
  return `Use the attached images as references:

Image 1 = the base hero-card background with UI elements and no character.
Image 2 = the example hero character image showing the target style, realism, lighting, character placement, scale, and game-card format.
Image 3 = an additional example hero character image for inspiration

Generate a new hero character image using Image 1 as the exact base composition.

Preserve Image 1’s background and UI layout as closely as possible:
${rankLinesFor(rank)}
- Keep the same overall portrait/square hero-card layout and cinematic game UI aesthetic.
- Replace the name with: “${heroName}”
- Match the name text style: bold cream/white letters, thick black outline, game UI font, same placement.

Create a hero character in the same style as Image 2:
- Use the image 3 reference along with the additional hero characters below to imagine your hero character.
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

export const metaPromptExample =
  "Generate a prompt for adding additional hero characters to the image of Super T throwing a diamond party, using image 1 (the image of Super T throwing a diamond party) as the base image we want to work from and each additional image will contain the hero characters that we want to incorporate into the Super T Diamond Party image. Maintain the same quality and level of detail of the images. This prompt will be provided along with the images. Format the prompt similar to the reference prompt below.";

export function metaPrompt(description: string): string {
  const details = description.trim() || "[description here]";
  return `Generate a prompt for: ${details}

Maintain the same quality and level of detail of the images. This prompt will be provided along with the images. Format the prompt similar to the reference prompt below.

## REFERENCE PROMPT

${referencePrompt}`;
}
