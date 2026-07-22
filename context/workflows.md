# Workflow reference

The three workflows the site documents, each backed by a real ChatGPT conversation in the source folder.

## 1. Hero card from a photo (chat1)

The core workflow. One message to ChatGPT containing:

- Image 1: base hero-card background (S/A/B template from `image-templates/base-templates/`)
- Image 2: an example hero card showing target style, realism, lighting, placement, scale (from `image-templates/heros/`)
- Image 3: the person/character photo to transform
- The prompt from `chat1/image-gen-prompt-template.md` with two placeholders filled:
  - Hero character name (e.g. "Aušrytė")
  - Additional details (optional design direction, e.g. "dark, powerful, mystical with a lava glow from her eyes")

Output: one hero card image (`chat1/image-outputs/message-1-image-output.png`).

## 2. Hero card from a description, no photo (chat3)

Variant of workflow 1 with no person photo. The prompt is restructured:

- Image 1: base template (chat3 used the B blue template)
- Image 2: example hero card
- Images 3-6: additional example hero cards "for inspiration"
- Prompt body says "Use the image 3-6 references along with the additional hero characters below to imagine your hero character" and drops the identity-preservation lines
- "Additional hero character details" carries the full character description, and can request template modifications — chat3 changed the rank letter "B" to "F" and recolored blue elements to earthy green for a farm-themed alliance

## 3. Group scene via meta-prompt (chat2, advanced)

Two-step:

1. Send ChatGPT the meta-prompt (`chat2/meta-prompt-template.md`): describe the image you want (base image + heroes to add), include the reference prompt so it matches the format, and attach the images. ChatGPT replies with a long structured image-generation prompt.
2. Send that generated prompt in a new message with all the images (base scene + each hero card). Output: the group scene.

Follow-up edits work as plain messages, e.g. chat2 message 3: "Love it! Now remove the UI elements (the S, Super T, badges, and default diamond party) and reposition the hero's slightly to take up the space of the image evenly. Preserve the same level of quality and detail."

## Base templates

- `S_Orange_Template.png` — gold "S" rank, warm orange dusty background
- `A_Purple_Template.png` — purple "A" rank
- `B_Blue_Template.png` — blue "B" rank

All share: rank letter top-left, "Hero Name" text, faction badge / shield / "S2" icons, square format, apocalyptic fence-and-tower backdrop.
