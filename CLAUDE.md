# RFC Hero Creator

Guide site for the RFC alliance (Last Z: Survival Shooter). Teaches members to create hero character card images with ChatGPT using prompt templates and downloadable card templates. Static Next.js site, no backend.

## Commands

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build; must pass clean before deploy
- `node scripts/optimize-images.mjs` — regenerate `public/images/` (WebP display copies) and `public/downloads/` (original PNGs) from the source folder

## Source material

Source of truth lives in `/Users/michaelbernard/workspace/RFC-Hero-Character-Images/` (NOT in this repo):

- `chat1/`, `chat2/`, `chat3/` — real ChatGPT conversations the site's walkthroughs reproduce
- `chat1/image-gen-prompt-template.md` — the hero card prompt template
- `chat2/meta-prompt-template.md` — the group scene meta-prompt template
- `image-templates/base-templates/` — S/A/B base card PNGs (Image 1 in the workflow)
- `image-templates/heros/` — official hero style references (Image 2)
- `generated-hero-image-examples/` — gallery examples

See `context/` for workflow summaries and where each piece of site content comes from.

## Content rules (strict)

- Prompt template text is rendered and filled **verbatim** from the source templates. Never reword, "improve", or extend the prompts. The builder only substitutes bracketed placeholders.
- Instructional copy must describe only what the source chats demonstrate. No invented marketing copy, taglines, badges, CTAs, or filler.
- No emojis in site content.
- Walkthrough transcripts are verbatim from the chat .md files.

## Structure

- `app/[locale]/` — routes: `/` (home), `/hero`, `/unique`, `/custom`, `/gallery`, localized via next-intl
- `i18n/` — next-intl routing/request/navigation config; `proxy.ts` handles locale detection
- `messages/` — UI copy per locale (`en`, `it`, `es`, `de`, `fr`); keep files key-identical to `en.json`
- `lib/prompts.ts` — verbatim prompt templates + fill functions
- `lib/data.ts` — image manifests (gallery, hero refs, base templates)
- `lib/chats.ts` — walkthrough transcript data
- `public/images/` — optimized WebP display copies (generated, committed)
- `public/downloads/` — original-quality PNGs members download (base templates + hero refs)

## Localization rules

- English URLs stay unprefixed (`/hero`); other locales get a prefix (`/it/hero`).
- Never translate: the prompt templates in `lib/prompts.ts` (they stay English in every locale), hero/member proper names, "Last Z", "ChatGPT", "RfC", "Hero Forge", rank letters.
- New UI copy goes into `messages/en.json` first, then mirrored into the other four files.

## The workflow the site teaches

Members send ChatGPT one prompt plus 3 images: Image 1 = base card template (download from site), Image 2 = example hero card (style reference, download from site), Image 3 = their own photo. Variants: description-only (no photo, chat3) and group scenes via a meta-prompt (chat2).

## Deployment

GitHub: `mikeybizzzle/rfc-hero-creator` (public). Vercel project connected to the repo; pushes to `main` auto-deploy production.
