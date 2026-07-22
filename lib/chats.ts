// Transcripts are verbatim from the source chat .md files in
// RFC-Hero-Character-Images/chat{1,2,3}. Image references point at the
// optimized copies in the manifest.

import { chatImages, type ManifestImage } from "./data";

export type ChatMessage = {
  role: "user" | "assistant";
  text?: string;
  // Rendered as an attachment strip (user) or output image (assistant)
  images?: ManifestImage[];
  // When true, the text is a generated image prompt: render in a copyable block
  isPrompt?: boolean;
};

export type Walkthrough = {
  slug: string;
  title: string;
  summary: string;
  messages: ChatMessage[];
};

const c1 = chatImages.chat1;
const c2 = chatImages.chat2;
const c3 = chatImages.chat3;

const chat1: Walkthrough = {
  slug: "hero-card-from-photo",
  title: "Hero card from a photo",
  summary:
    "The core workflow: one message with the prompt and 3 reference images — the base template, a style example, and the photo to transform.",
  messages: [
    {
      role: "user",
      images: c1["message-1-provided-images"],
      isPrompt: true,
      text: `Use the 3 attached images as references:

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

Hero character name: “Aušrytė”

Additional details: dark, powerful, mystical with a lava glow from her eyes and around her that adds to her dark/powerful look, elegant outfit that matches her vibe`,
    },
    {
      role: "assistant",
      images: c1["image-outputs"],
    },
  ],
};

const chat2GeneratedPrompt = `Use all attached images as references:

**Image 1** = the base SuperT “Diamond Party” image. Use this as the exact foundation, composition, environment, visual style, lighting, color grading, UI layout, and quality benchmark.

**Images 2 onward** = the additional hero characters to incorporate into SuperT’s Diamond Party. Each image represents a separate hero who must remain recognizable and retain their defining appearance, equipment, personality, and character theme.

Generate a new square hero-card image showing **SuperT hosting a massive diamond party with all of the additional heroes from Images 2 onward**.

### Preserve Image 1 as the Base

Maintain Image 1 as closely as possible:

* Keep SuperT as the dominant central hero and primary focus of the composition.
* Preserve SuperT’s enormous muscular build, dark hair, thick beard, glowing molten-orange eyes, black graphic shirt, tactical clothing, gloves, belt, and overall appearance.
* Keep SuperT’s pose and diamond-throwing action recognizable, with diamonds pouring from his hands and flying through the scene.
* Preserve the fiery orange industrial environment, refinery structures, smoke, sparks, floating embers, dramatic light beams, and cinematic atmosphere.
* Keep the open gold treasure chest overflowing with sharply faceted silver-white diamonds.
* Maintain the large piles of diamonds across the foreground.
* Preserve the same bright blue-white reflections, crisp facets, intense sparkle, and premium treasure-reward aesthetic.
* Keep the large gold **“S”** emblem in the upper-left corner.
* Keep the name **“SuperT”**, the red faction badge, white attack icon, and gold **“S2”** badge in their original positions.
* Preserve the bottom-left text:

  * “Default”
  * “Diamond Party”
* Match the original bold cream-and-white text, dark outlines, spacing, placement, and polished mobile-game UI style.
* Maintain the square 1:1 format and the same cinematic survival-shooter hero-card presentation.

### Add the Additional Heroes

Recreate each hero from Images 2 onward as accurately as possible and place them naturally within the Diamond Party scene.

For every additional hero:

* Preserve their recognizable face, species, physique, hairstyle, tattoos, skin or fur patterns, clothing, armor, weapons, accessories, colors, and personality.
* Preserve the character’s original visual theme rather than redesigning them into copies of SuperT.
* Remove the original background, name, rank emblem, icons, UI, and text from each additional hero reference image.
* Use only the hero character and their defining equipment from each reference.
* Adapt their pose so they appear to be actively participating in SuperT’s Diamond Party.
* Show them celebrating, catching diamonds, throwing diamonds into the air, holding handfuls of diamonds, standing beside overflowing treasure, or reacting confidently to the enormous reward.
* Weapons and equipment may remain visible as recognizable character elements, but they should not be firing or distracting from the celebratory scene.
* Preserve realistic anatomy and accurate hands, fingers, faces, armor, weapons, and accessories.

### Character Placement and Composition

Create a balanced group composition without overcrowding the image:

* Keep SuperT centered and visually dominant in the foreground.
* Position the additional heroes around SuperT as a supporting party ensemble.
* Place some heroes in the left and right midground and others slightly behind SuperT to create depth.
* Keep every hero’s face clearly visible and recognizable.
* Avoid placing characters over the large gold “S,” SuperT’s name, icons, or bottom-left ability text.
* Do not cover SuperT’s face, chest, extended hands, or the main treasure chest.
* Do not crop off important facial features, heads, weapons, wings, tails, armor, or other defining character elements.
* Adjust the scale of the supporting heroes so they fit naturally into the scene while SuperT remains the unmistakable host.
* Use overlapping silhouettes, foreground diamonds, atmospheric haze, sparks, and lighting to make the group feel dimensional rather than arranged in a flat row.
* Expand or intelligently recompose the surrounding industrial environment when necessary to create enough room for all heroes without making the image feel cramped.

### Integration and Visual Consistency

Make every added hero look as though they were originally rendered inside Image 1:

* Match the warm orange-and-gold directional lighting.
* Add realistic orange rim light along faces, hair, fur, armor, clothing, weapons, wings, and accessories.
* Match Image 1’s shadows, reflections, atmospheric haze, contrast, depth of field, and cinematic color grading.
* Add accurate diamond reflections and blue-white highlights onto the characters and nearby surfaces.
* Let foreground diamonds partially overlap the lower bodies of some heroes to integrate them into the treasure-filled environment.
* Preserve realistic material rendering for skin, fur, fabric, leather, metal, weapons, armor, gems, and industrial structures.
* Use sharp facial detail, highly refined textures, cinematic volumetric lighting, dramatic contrast, and premium AAA mobile-game artwork quality.
* Maintain the same realism, polish, dimensional depth, and level of detail across every character.

### Overall Scene Direction

The final image should feel like an enormous, chaotic, high-value victory celebration hosted by SuperT:

* Diamonds raining through the air.
* Heroes surrounded by overflowing treasure.
* Bright gemstone flashes and reflections throughout the scene.
* Sparks, smoke, embers, and glowing industrial light in the background.
* Powerful, confident, celebratory character poses.
* A visually dense but clearly organized composition.
* Premium cinematic game-key-art quality.

### Important

* Do not replace, redesign, or significantly alter SuperT.
* Do not remove or reposition Image 1’s essential UI elements.
* Do not copy the backgrounds or UI layouts from the additional hero images.
* Do not add the supporting heroes’ names, rank letters, badges, ability labels, or separate character-card interfaces.
* Do not add duplicate heroes, random characters, extra limbs, distorted faces, malformed hands, or unrelated objects.
* Do not turn the image into a collage of separate character cards.
* Do not reduce the detail or realism of Image 1.
* Keep the final image cohesive, cinematic, polished, highly detailed, and ready to use as a premium square game-event hero card.`;

const chat2: Walkthrough = {
  slug: "group-scene",
  title: "Group scene with the meta-prompt",
  summary:
    "The advanced two-step workflow: ask ChatGPT to write the image prompt for you, then send that prompt with all the hero images. Ends with a follow-up edit.",
  messages: [
    {
      role: "user",
      images: c2["message-1-provided-images"],
      isPrompt: true,
      text: `Generate a prompt for adding additional hero characters to the image of Super T throwing a diamond party, using image 1 (the image of Super T throwing a diamond party) as the base image we want to work from and each additional image will contain the hero characters that we want to incorporate into the Super T Diamond Party image. Maintain the same quality and level of detail of the images. This prompt will be provided along with the images. Format the prompt similar to the reference prompt below.

## REFERENCE PROMPT

Use the 3 attached images as references:

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

Hero character name: “IronBastion”`,
    },
    {
      role: "assistant",
      isPrompt: true,
      text: chat2GeneratedPrompt,
    },
    {
      role: "user",
      images: c2["message-2-provided-images"],
      isPrompt: true,
      text: chat2GeneratedPrompt,
    },
    {
      role: "assistant",
      images: c2["image-outputs"].filter((i) => i.slug.startsWith("message-2")),
    },
    {
      role: "user",
      text: "Love it! Now remove the UI elements (the S, Super T, badges, and default diamond party) and reposition the hero’s slightly to take up the space of the image evenly. Preserve the same level of quality and detail.",
    },
    {
      role: "assistant",
      images: c2["image-outputs"].filter((i) => i.slug.startsWith("message-3")),
    },
  ],
};

const chat3: Walkthrough = {
  slug: "hero-card-no-photo",
  title: "Hero card without a photo",
  summary:
    "No photo needed: describe the character in text and give ChatGPT extra example cards for inspiration. Also shows customizing the template — changing the rank letter and colors for a themed alliance.",
  messages: [
    {
      role: "user",
      images: c3["message-1-provided-images"],
      isPrompt: true,
      text: `Use the attached images as references:

Image 1 = the base hero-card background with UI elements and no character.
Image 2 = the example hero character image showing the target style, realism, lighting, character placement, scale, and game-card format.
Image 3-6 = additional example hero character images for inspiration

Generate a new hero character image using Image 1 as the exact base composition.

Preserve Image 1’s background and UI layout as closely as possible:
- Keep the blue gradient game background.
- Keep the large gold “B” rank emblem on the left.
- Keep the blue badge icon and silver shield icon in the same positions.
- Keep the same overall portrait/square hero-card layout and cinematic game UI aesthetic.
- Replace the name with: “[HERO CHARACTER NAME]”
- Match the name text style: bold cream/white letters, thick black outline, game UI font, same placement.

Create a hero character in the same style as Image 2:
- Use the image 3-6 references along with the additional hero characters below to imagine your hero character.
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

Hero character name: “CoquetaFarm”

Additional hero character details:
cute and elegant, blonde hair, beautiful, tight mythical dress, with a flirtatious vibe. Since this hero character is part of a "farm" alliance, make these changes:
- Change the "B" to "F"
- Change all blue elements to an earthy green
- Make her dress "earthy" like made of leaves/branches/etc.`,
    },
    {
      role: "assistant",
      images: c3["image-outputs"],
    },
  ],
};

export const walkthroughs: Walkthrough[] = [chat1, chat2, chat3];

export function findWalkthrough(slug: string): Walkthrough | undefined {
  return walkthroughs.find((w) => w.slug === slug);
}
