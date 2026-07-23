// Prompt templates are verbatim from the source material:
// - heroCardPrompt: chat1/image-gen-prompt-template.md
// - heroCardNoPhotoPrompt: chat3/chat3.md message 1
// - metaPrompt: single-shot custom-image prompt (ChatGPT internally generates
//   and executes an image prompt in the reference format below)
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

// Variant of heroCardPrompt for the reference sheet: the base card and style
// example (and optionally the subject photo) arrive as labeled panels of a
// single attached image, so the image references are reworded while the rest
// stays verbatim.
export function heroCardSheetPrompt(
  rank: RankSelection,
  name: string,
  details: string,
  withPhoto = false
): string {
  const heroName = name.trim() || "[HERO CHARACTER NAME]";
  const extra = details.trim();
  const subject = withPhoto ? "panel 3" : "Image 2";
  const intro = withPhoto
    ? `Use the attached image as reference:

The attached image is a reference sheet with three labeled panels. “PANEL 1 · BASE CARD” is the base hero-card background with UI elements and no character. “PANEL 2 · STYLE” is the example hero character image showing the target style, realism, lighting, character placement, scale, and game-card format. “PANEL 3 · PHOTO” is the person/character to transform into the hero character.`
    : `Use the 2 attached images as references:

Image 1 = a reference sheet with two labeled panels. “PANEL 1 · BASE CARD” is the base hero-card background with UI elements and no character. “PANEL 2 · STYLE” is the example hero character image showing the target style, realism, lighting, character placement, scale, and game-card format.
Image 2 = the person/character to transform into the hero character.`;
  return `${intro}

Generate a new hero character image using panel 1 as the exact base composition. Output a single hero card only — do not reproduce the sheet layout, the panel labels, or the content of the other panels.

Preserve panel 1’s background and UI layout as closely as possible:
${rankLinesFor(rank)}
- Keep the same overall portrait/square hero-card layout and cinematic game UI aesthetic.
- Replace the name with: “${heroName}”
- Match the name text style: bold cream/white letters, thick black outline, game UI font, same placement.

Create the hero character from ${subject} in the same style as panel 2:
- Turn the subject into a high-quality realistic game hero character.
- Preserve the subject’s key identity, facial features, body/character traits, colors, accessories, and personality.
- Adapt the subject into a cinematic survival-shooter/mobile-game hero design.
- The character should be positioned in the center foreground like panel 2.
- The character should feel integrated into the same lighting, shadows, color grading, and depth as the background.
- Use sharp, high-detail rendering with realistic textures, dramatic lighting, and polished game-character artwork quality.
- Make the character look powerful, memorable, and slightly exaggerated in a fun hero-card style, while still recognizable from ${subject}.

Important:
- Do not copy the theme of the hero from the STYLE panel, but rather imagine an entirely new character theme for the new hero character from your analysis of ${subject}.
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

// Variant of heroCardNoPhotoPrompt for the reference sheet: the base card and
// style example arrive as labeled panels of a single attached image.
export function heroCardNoPhotoSheetPrompt(
  rank: RankSelection,
  name: string,
  details: string
): string {
  const heroName = name.trim() || "[HERO CHARACTER NAME]";
  const characterDetails = details.trim() || "[Describe your hero character here]";
  return `Use the attached image as reference:

The attached image is a reference sheet with two labeled panels. “PANEL 1 · BASE CARD” is the base hero-card background with UI elements and no character. “PANEL 2 · STYLE” is the example hero character image showing the target style, realism, lighting, character placement, scale, and game-card format.

Generate a new hero character image using panel 1 as the exact base composition. Output a single hero card only — do not reproduce the sheet layout, the panel labels, or the content of the other panels.

Preserve panel 1’s background and UI layout as closely as possible:
${rankLinesFor(rank)}
- Keep the same overall portrait/square hero-card layout and cinematic game UI aesthetic.
- Replace the name with: “${heroName}”
- Match the name text style: bold cream/white letters, thick black outline, game UI font, same placement.

Create a hero character in the same style as panel 2:
- Use the hero character details below to imagine your hero character.
- Turn the hero character details into a high-quality realistic game hero character.
- Adapt the subject into a cinematic survival-shooter/mobile-game hero design.
- The character should be positioned in the center foreground like panel 2.
- The character should feel integrated into the same lighting, shadows, color grading, and depth as the background.
- Use sharp, high-detail rendering with realistic textures, dramatic lighting, and polished game-character artwork quality.
- Make the character look powerful, memorable, and slightly exaggerated in a fun hero-card style

Important:
- Do not copy the theme of the hero from the STYLE panel, but rather imagine an entirely new character theme for the new hero character
- Do not add extra text, buttons, menus, watermarks, logos, or unrelated UI.
- Do not crop off important parts of the character.
- Keep the final image clean, polished, and ready to use as a hero character card.

Hero character name: “${heroName}”

Additional hero character details:
${characterDetails}`;
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

// Reference prompt embedded in the custom-image prompt so ChatGPT knows the
// target format when it internally generates and executes the image prompt.
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
- The character should be positioned in the center foreground like Image 2.
- The character should feel integrated into the same lighting, shadows, color grading, and depth as the background.
- Use sharp, high-detail rendering with realistic textures, dramatic lighting, and polished game-character artwork quality.
- Make the character look powerful, memorable, and slightly exaggerated in a fun hero-card style, while still recognizable from Image 3.

Important:
- Do not copy the theme of the hero from reference image #2, but rather imagine an entirely new character theme for the new hero character from your analysis of reference image #3.
- Do not add extra text, buttons, menus, watermarks, logos, or unrelated UI.
- Do not crop off important parts of the character.
- Keep the final image clean, polished, and ready to use as a hero character card.`;

export function metaPrompt(topic: string): string {
  const details = topic.trim() || "[topic goes here]";
  return `Using the provided images and topic, internally generate a prompt in a similar format as the reference prompt below and then execute the generated prompt, making sure to maintain the same quality and level of detail of the images provided.

Topic: "${details}"

## REFERENCE PROMPT

${referencePrompt}`;
}
