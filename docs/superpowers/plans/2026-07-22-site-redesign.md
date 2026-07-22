# Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the site around three self-contained flow pages (Hero / Custom / Unique) with click-to-copy images, a 1-2-3 layout per page, a three-option home screen, ~9:1 body-text contrast, and tight mobile-game-style layouts.

**Architecture:** Static Next.js App Router site, no backend. Guide/Builder/Templates/Walkthroughs pages are removed and their content absorbed into three flow pages (`/hero`, `/custom`, `/unique`); old URLs redirect via `next.config.ts`. Walkthrough transcript data (`lib/chats.ts`) powers a chat-styled example dropdown on each flow page. Images copy to the clipboard on click (PNG via async Clipboard API, download fallback).

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind 4 (CSS-first `@theme` config), TypeScript. No test framework exists in the repo — verification is `npm run build` (must pass clean) plus browser checks at mobile (390px) and desktop widths.

## Global Constraints

- Prompt template text is rendered and filled **verbatim** from `lib/prompts.ts` / `lib/chats.ts`. Never reword or extend prompts.
- Instructional copy must describe only what the source chats demonstrate, or come verbatim/near-verbatim from the redesign issue. No invented marketing copy, taglines, badges, CTAs, or filler.
- No emojis in site content.
- Body/paragraph text contrast ≥ ~9:1 against its background (`--color-muted` becomes `#c9bba4`: 9.94:1 on `--color-bg`, 9.27:1 on `--color-surface`).
- On each page, the first user action must be visible on the first screen or within the first scroll on mobile (390×844).
- Mobile: tight mobile-game density — smaller elements, 3-4 column rows are fine; nothing squished; no horizontal body scroll (horizontal scrolling only inside the card slider).
- Every task ends with `npm run build` passing clean, then a commit.
- Working dir: `~/workspace/rfc-hero-creator`. Pushes to `main` auto-deploy production — do NOT push until the final task.

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `app/globals.css` | Modify | Contrast token fix |
| `components/copy-image-card.tsx` | Create | Click-to-copy image card (clipboard PNG + download fallback) |
| `components/card-slider.tsx` | Create | Two-row × three-visible horizontal snap slider |
| `components/chat-example.tsx` | Create | `ExampleDropdown`: chat-styled walkthrough transcript in a `<details>` |
| `components/prompt-form.tsx` | Create | Single-mode prompt form + live prompt + copy (extracted from prompt-builder) |
| `components/flow.tsx` | Create | Shared flow-page bits: `FlowHeader` (title + 1-2-3), `StepHeading` |
| `app/hero/page.tsx` | Create | Hero character image flow (photo mode, chat1) |
| `app/unique/page.tsx` | Create | Unique hero image flow (no-photo mode, chat3) |
| `app/custom/page.tsx` | Create | Custom image flow (group meta-prompt, chat2) |
| `app/page.tsx` | Rewrite | Home: three options + brief how-it-works + collage banner |
| `components/site-nav.tsx` | Modify | New nav links |
| `app/layout.tsx` | Modify | New footer links |
| `next.config.ts` | Modify | Redirects from removed routes |
| `app/guide/`, `app/builder/`, `app/templates/`, `app/walkthroughs/`, `components/prompt-builder.tsx` | Delete | Replaced by flow pages |
| `components/copy-all-button.tsx` | Create (Task 12, optional) | One-paste experiment — kept only if ChatGPT accepts the paste |

Route → source-chat mapping: `/hero` = chat1 `hero-card-from-photo` (photo mode), `/custom` = chat2 `group-scene` (meta-prompt), `/unique` = chat3 `hero-card-no-photo` (description mode).

---

### Task 1: Contrast fix

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: `--color-muted: #c9bba4` — every `text-muted` usage site-wide picks this up.

- [ ] **Step 1: Change the muted token**

In `app/globals.css`, change:

```css
  --color-muted: #a8957a;
```

to:

```css
  --color-muted: #c9bba4;
```

(Old value was 6.47:1 on `--color-bg`; new value is 9.94:1. Verified with WCAG relative-luminance math.)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exit 0, no errors.

- [ ] **Step 3: Visual check**

Run `npm run dev`, open `http://localhost:3000`, confirm body/paragraph text is clearly readable (no longer low-contrast orange-on-orange). Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "fix: raise muted body text contrast to ~10:1"
```

---

### Task 2: CopyImageCard component

**Files:**
- Create: `components/copy-image-card.tsx`

**Interfaces:**
- Consumes: `ManifestImage` from `@/lib/data` (`{ slug, file, src, width, height, download? }`).
- Produces: `<CopyImageCard image={ManifestImage} label={string} sizes={string} priority?={boolean} />` — a full-width `<button>` card; click copies the image's PNG (`image.download`, falling back to `image.src`) to the clipboard; if the Clipboard API can't take images (e.g. older Firefox), it triggers a file download instead. Has `snap-start` class so it works inside `CardSlider`.

- [ ] **Step 1: Write the component**

Create `components/copy-image-card.tsx`:

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import type { ManifestImage } from "@/lib/data";

type Status = "idle" | "copied" | "saved";

async function writeImageToClipboard(url: string): Promise<boolean> {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
  try {
    // Safari requires the ClipboardItem to be constructed synchronously in the
    // user gesture, with the blob supplied as a promise.
    const blobPromise = fetch(url).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.blob();
    });
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
    return true;
  } catch {
    try {
      const blob = await (await fetch(url)).blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      return true;
    } catch {
      return false;
    }
  }
}

export function CopyImageCard({
  image,
  label,
  sizes,
  priority,
}: {
  image: ManifestImage;
  label: string;
  sizes: string;
  priority?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onClick() {
    const url = image.download ?? image.src;
    if (await writeImageToClipboard(url)) {
      setStatus("copied");
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      a.click();
      setStatus("saved");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="card-frame overflow-hidden group text-left w-full snap-start"
      aria-label={`Copy ${label} to clipboard`}
    >
      <div className="relative aspect-square">
        <Image
          src={image.src}
          alt={label}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
        {status !== "idle" && (
          <span className="absolute inset-0 bg-bg/85 flex items-center justify-center hud text-xs text-gold">
            {status === "copied" ? "Copied" : "Saved"}
          </span>
        )}
      </div>
      <div className="px-2 py-1.5 flex items-baseline justify-between gap-2">
        <span className="hud text-[11px] text-cream truncate">{label}</span>
        <span className="hud text-[10px] text-muted group-hover:text-gold transition-colors shrink-0">
          Copy
        </span>
      </div>
    </button>
  );
}
```

Note: all files under `/downloads/` are PNGs, which is the only image MIME the Clipboard API accepts — never pass a `.webp` URL as `download`.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exit 0. (Component is not yet imported anywhere; build verifies it compiles.)

- [ ] **Step 3: Commit**

```bash
git add components/copy-image-card.tsx
git commit -m "feat: add click-to-copy image card"
```

---

### Task 3: CardSlider component

**Files:**
- Create: `components/card-slider.tsx`

**Interfaces:**
- Produces: `<CardSlider>{children}</CardSlider>` — lays children out in a 2-row, column-flow grid that scrolls horizontally with snap; roughly three columns visible per screen on mobile. Children should carry `snap-start` (CopyImageCard does).

- [ ] **Step 1: Write the component**

Create `components/card-slider.tsx`:

```tsx
export function CardSlider({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2">
      <div className="grid grid-rows-2 grid-flow-col auto-cols-[30vw] sm:auto-cols-[168px] gap-2 sm:gap-3">
        {children}
      </div>
    </div>
  );
}
```

(`-mx-4 px-4` lets the scroll area bleed to the page edges inside the `px-4` page container so edge cards aren't clipped. Server component — no `"use client"`.)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/card-slider.tsx
git commit -m "feat: add two-row horizontal card slider"
```

---

### Task 4: ExampleDropdown (chat-styled walkthrough)

**Files:**
- Create: `components/chat-example.tsx`

**Interfaces:**
- Consumes: `Walkthrough`, `ChatMessage` types from `@/lib/chats` (`messages: { role: "user" | "assistant"; text?: string; images?: ManifestImage[]; isPrompt?: boolean }[]`).
- Produces: `<ExampleDropdown walkthrough={Walkthrough} />` — a native `<details>` block titled "See an example" rendering the verbatim transcript styled like a ChatGPT conversation (attachment thumbnails + prompt on the user side, output images on the assistant side).

- [ ] **Step 1: Write the component**

Create `components/chat-example.tsx`:

```tsx
import Image from "next/image";
import type { ChatMessage, Walkthrough } from "@/lib/chats";

function Message({ m }: { m: ChatMessage }) {
  const isUser = m.role === "user";
  return (
    <div className={`max-w-[88%] ${isUser ? "ml-auto" : "mr-auto"}`}>
      <p className={`hud text-[10px] text-muted mb-1.5 ${isUser ? "text-right" : ""}`}>
        {isUser ? "You" : "ChatGPT"}
      </p>
      {isUser && m.images && (
        <div className="flex flex-wrap gap-1.5 justify-end mb-1.5">
          {m.images.map((img) => (
            <div key={img.slug} className="relative w-14 h-14 card-frame overflow-hidden">
              <Image src={img.src} alt="" fill sizes="56px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
      {m.text && (
        <div
          className={`border border-line p-3 text-cream/90 ${
            isUser ? "bg-raised" : "bg-surface"
          } ${m.isPrompt ? "prompt-block max-h-56 overflow-y-auto" : "text-sm leading-relaxed whitespace-pre-wrap"}`}
        >
          {m.text}
        </div>
      )}
      {!isUser && m.images && (
        <div className="flex flex-wrap gap-2 mt-1.5">
          {m.images.map((img) => (
            <div key={img.slug} className="relative w-36 sm:w-44 aspect-square card-frame overflow-hidden">
              <Image src={img.src} alt="" fill sizes="176px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ExampleDropdown({ walkthrough }: { walkthrough: Walkthrough }) {
  return (
    <details className="card-frame">
      <summary className="hud text-xs text-gold px-4 py-3 cursor-pointer list-none flex items-center justify-between gap-3">
        See an example
        <span className="text-muted">+</span>
      </summary>
      <div className="border-t border-line p-4 space-y-6">
        {walkthrough.messages.map((m, i) => (
          <Message key={i} m={m} />
        ))}
      </div>
    </details>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/chat-example.tsx
git commit -m "feat: add chat-styled example dropdown"
```

---

### Task 5: PromptForm component

**Files:**
- Create: `components/prompt-form.tsx`

**Interfaces:**
- Consumes: `heroCardPrompt(rank, name, details)`, `heroCardNoPhotoPrompt(rank, name, details)`, `metaPrompt(description)`, `metaPromptExample`, `rankInfo`, `Rank` from `@/lib/prompts`; `CopyButton` from `./copy-button`.
- Produces: `<PromptForm mode={"photo" | "no-photo" | "group"} />` — the fields for one mode plus the live verbatim prompt with a copy button. (This replaces `components/prompt-builder.tsx`, which is deleted in Task 10 — no mode tabs, no attachments list; attachments are steps 1-2 on the flow pages.)

- [ ] **Step 1: Write the component**

Create `components/prompt-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import {
  heroCardPrompt,
  heroCardNoPhotoPrompt,
  metaPrompt,
  metaPromptExample,
  rankInfo,
  type Rank,
} from "@/lib/prompts";
import { CopyButton } from "./copy-button";

const rankRing: Record<Rank, string> = {
  S: "border-rank-s text-rank-s",
  A: "border-rank-a text-rank-a",
  B: "border-rank-b text-rank-b",
};

const inputClass =
  "w-full bg-bg border border-line px-3 py-2.5 text-sm text-cream placeholder:text-muted/70 focus:border-gold";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="hud text-xs text-muted block mb-2">{label}</span>
      {children}
    </label>
  );
}

export function PromptForm({ mode }: { mode: "photo" | "no-photo" | "group" }) {
  const [rank, setRank] = useState<Rank>("S");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const prompt =
    mode === "photo"
      ? heroCardPrompt(rank, name, details)
      : mode === "no-photo"
        ? heroCardNoPhotoPrompt(rank, name, details)
        : metaPrompt(groupDescription);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-5">
        {mode === "group" ? (
          <Field label="Describe the image you want generated">
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              rows={6}
              placeholder={metaPromptExample}
              className={inputClass}
            />
          </Field>
        ) : (
          <>
            <div>
              <span className="hud text-xs text-muted block mb-2">Rank template</span>
              <div className="flex gap-2" role="radiogroup" aria-label="Rank template">
                {(Object.keys(rankInfo) as Rank[]).map((r) => (
                  <button
                    key={r}
                    role="radio"
                    aria-checked={rank === r}
                    onClick={() => setRank(r)}
                    className={`display text-lg w-12 h-12 border transition-colors ${
                      rank === r
                        ? `${rankRing[r]} bg-raised`
                        : "border-line text-muted hover:text-cream"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Hero character name">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aušrytė"
                className={inputClass}
              />
            </Field>
            <Field
              label={mode === "photo" ? "Additional details (optional)" : "Hero character details"}
            >
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                placeholder={
                  mode === "photo"
                    ? "e.g. dark, powerful, mystical with a lava glow from her eyes"
                    : "e.g. cute and elegant, blonde hair, tight mythical dress, with a flirtatious vibe"
                }
                className={inputClass}
              />
            </Field>
          </>
        )}
      </div>

      <div className="card-frame flex flex-col min-h-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line">
          <span className="hud text-xs text-muted">Your prompt</span>
          <CopyButton text={prompt} />
        </div>
        <pre className="prompt-block text-cream/90 p-4 overflow-auto max-h-[50vh]">{prompt}</pre>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add components/prompt-form.tsx
git commit -m "feat: add single-mode prompt form"
```

---

### Task 6: Flow-page shell + /hero page

**Files:**
- Create: `components/flow.tsx`
- Create: `app/hero/page.tsx`

**Interfaces:**
- Consumes: `CopyImageCard` (Task 2), `CardSlider` (Task 3), `ExampleDropdown` (Task 4), `PromptForm` (Task 5), `findWalkthrough` from `@/lib/chats`, `baseTemplates`, `heroRefsSorted`, `heroRefName`, `heroRefRank`, `findTemplate` from `@/lib/data`.
- Produces: `FlowHeader({ eyebrow, title, steps }: { eyebrow: string; title: string; steps: string[] })` and `StepHeading({ n, title }: { n: string; title: string })` from `components/flow.tsx`, reused verbatim by Tasks 7-8.

- [ ] **Step 1: Write the shared flow bits**

Create `components/flow.tsx`:

```tsx
export function FlowHeader({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: string;
  steps: string[];
}) {
  return (
    <header className="mb-6">
      <p className="hud text-xs text-gold mb-2">{eyebrow}</p>
      <h1 className="display text-2xl md:text-4xl mb-4">{title}</h1>
      <ol className="space-y-1.5">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm text-muted leading-relaxed">
            <span className="display text-gold shrink-0">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </header>
  );
}

export function StepHeading({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      <span className="display text-xl text-gold">{n}</span>
      <h2 className="display text-lg md:text-xl">{title}</h2>
    </div>
  );
}
```

- [ ] **Step 2: Write the /hero page**

Create `app/hero/page.tsx`:

```tsx
import type { Metadata } from "next";
import { findWalkthrough } from "@/lib/chats";
import { baseTemplates, heroRefsSorted, heroRefName, heroRefRank } from "@/lib/data";
import { CardSlider } from "@/components/card-slider";
import { CopyImageCard } from "@/components/copy-image-card";
import { ExampleDropdown } from "@/components/chat-example";
import { FlowHeader, StepHeading } from "@/components/flow";
import { PromptForm } from "@/components/prompt-form";

export const metadata: Metadata = {
  title: "Hero Character Image — RFC Hero Creator",
  description: "Turn a photo into a Last Z hero card with ChatGPT in three steps.",
};

const templateOrder = ["s-orange-template", "a-purple-template", "b-blue-template"];
const templateLabels: Record<string, string> = {
  "s-orange-template": "S Rank",
  "a-purple-template": "A Rank",
  "b-blue-template": "B Rank",
};

export default function HeroPage() {
  const walkthrough = findWalkthrough("hero-card-from-photo")!;
  const orderedTemplates = templateOrder
    .map((slug) => baseTemplates.find((t) => t.slug === slug))
    .filter((t): t is (typeof baseTemplates)[number] => Boolean(t));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <FlowHeader
        eyebrow="Hero character image"
        title="Make your hero card"
        steps={[
          "Copy the base card into ChatGPT.",
          "Copy a hero style into ChatGPT — it doesn't matter too much who you pick.",
          "Copy the prompt, fill out your info, add your photo, paste it into ChatGPT, and hit Go.",
        ]}
      />

      <div className="mb-10">
        <ExampleDropdown walkthrough={walkthrough} />
      </div>

      <section className="mb-10">
        <StepHeading n="1" title="Copy the base card" />
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl">
          {orderedTemplates.map((t, i) => (
            <CopyImageCard
              key={t.slug}
              image={t}
              label={templateLabels[t.slug]}
              sizes="(max-width: 640px) 33vw, 200px"
              priority={i === 0}
            />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <StepHeading n="2" title="Copy a hero style" />
        <CardSlider>
          {heroRefsSorted.map((h) => (
            <CopyImageCard
              key={h.slug}
              image={h}
              label={`${heroRefRank(h)} ${heroRefName(h)}`}
              sizes="(max-width: 640px) 30vw, 168px"
            />
          ))}
        </CardSlider>
      </section>

      <section>
        <StepHeading n="3" title="Copy the prompt" />
        <p className="text-sm text-muted leading-relaxed mb-5 max-w-2xl">
          Paste both images into a new ChatGPT conversation in order, attach the photo of
          the person to transform as Image 3, then paste this prompt and send.
        </p>
        <PromptForm mode="photo" />
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: exit 0, `/hero` listed in the route table.

- [ ] **Step 4: Visual check**

Run `npm run dev`, open `http://localhost:3000/hero` at 390px width and desktop:
- Step 1 cards visible within the first scroll on mobile.
- Clicking a base template or hero style shows "Copied", and pasting into any app that accepts images (e.g. TextEdit rich note, or chatgpt.com) yields the PNG.
- Hero style slider scrolls horizontally, two rows, ~3 columns visible; page body itself has no horizontal scroll.
- The example dropdown opens and renders the transcript with images.
Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add components/flow.tsx app/hero/page.tsx
git commit -m "feat: add hero character image flow page"
```

---

### Task 7: /unique page

**Files:**
- Create: `app/unique/page.tsx`

**Interfaces:**
- Consumes: same components as Task 6; walkthrough slug `hero-card-no-photo`; `PromptForm mode="no-photo"`.

- [ ] **Step 1: Write the page**

Create `app/unique/page.tsx`:

```tsx
import type { Metadata } from "next";
import { findWalkthrough } from "@/lib/chats";
import { baseTemplates, heroRefsSorted, heroRefName, heroRefRank } from "@/lib/data";
import { CardSlider } from "@/components/card-slider";
import { CopyImageCard } from "@/components/copy-image-card";
import { ExampleDropdown } from "@/components/chat-example";
import { FlowHeader, StepHeading } from "@/components/flow";
import { PromptForm } from "@/components/prompt-form";

export const metadata: Metadata = {
  title: "Unique Hero Image — RFC Hero Creator",
  description:
    "No photo needed: describe your hero character in text and build the card with ChatGPT.",
};

const templateOrder = ["s-orange-template", "a-purple-template", "b-blue-template"];
const templateLabels: Record<string, string> = {
  "s-orange-template": "S Rank",
  "a-purple-template": "A Rank",
  "b-blue-template": "B Rank",
};

export default function UniquePage() {
  const walkthrough = findWalkthrough("hero-card-no-photo")!;
  const orderedTemplates = templateOrder
    .map((slug) => baseTemplates.find((t) => t.slug === slug))
    .filter((t): t is (typeof baseTemplates)[number] => Boolean(t));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <FlowHeader
        eyebrow="Unique hero image"
        title="Make a hero from a description"
        steps={[
          "Copy the base card into ChatGPT.",
          "Copy a few hero styles into ChatGPT — one style reference plus extras for inspiration.",
          "Copy the prompt, fill out your hero's name and details, paste it into ChatGPT, and hit Go.",
        ]}
      />

      <div className="mb-10">
        <ExampleDropdown walkthrough={walkthrough} />
      </div>

      <section className="mb-10">
        <StepHeading n="1" title="Copy the base card" />
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl">
          {orderedTemplates.map((t, i) => (
            <CopyImageCard
              key={t.slug}
              image={t}
              label={templateLabels[t.slug]}
              sizes="(max-width: 640px) 33vw, 200px"
              priority={i === 0}
            />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <StepHeading n="2" title="Copy a few hero styles" />
        <p className="text-sm text-muted leading-relaxed mb-4 max-w-2xl">
          Image 2 is the style reference; Images 3-6 are extra examples for inspiration.
        </p>
        <CardSlider>
          {heroRefsSorted.map((h) => (
            <CopyImageCard
              key={h.slug}
              image={h}
              label={`${heroRefRank(h)} ${heroRefName(h)}`}
              sizes="(max-width: 640px) 30vw, 168px"
            />
          ))}
        </CardSlider>
      </section>

      <section>
        <StepHeading n="3" title="Copy the prompt" />
        <PromptForm mode="no-photo" />
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exit 0, `/unique` in the route table.

- [ ] **Step 3: Visual check**

`npm run dev`, open `http://localhost:3000/unique` at 390px and desktop: same checks as Task 6 step 4. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add app/unique/page.tsx
git commit -m "feat: add unique hero image flow page"
```

---

### Task 8: /custom page

**Files:**
- Create: `app/custom/page.tsx`

**Interfaces:**
- Consumes: same components; walkthrough slug `group-scene`; `PromptForm mode="group"`; `gallery`, `galleryName` from `@/lib/data`.

- [ ] **Step 1: Write the page**

The group flow is two ChatGPT messages (chat2): the meta-prompt + images produces a generated prompt, which is then sent back with the same images. The 1-2-3 header reflects that; the copyable image set is the gallery (members' own hero cards are what chat2 combines).

Create `app/custom/page.tsx`:

```tsx
import type { Metadata } from "next";
import { findWalkthrough } from "@/lib/chats";
import { gallery, galleryName } from "@/lib/data";
import { CardSlider } from "@/components/card-slider";
import { CopyImageCard } from "@/components/copy-image-card";
import { ExampleDropdown } from "@/components/chat-example";
import { FlowHeader, StepHeading } from "@/components/flow";
import { PromptForm } from "@/components/prompt-form";

export const metadata: Metadata = {
  title: "Custom Image — RFC Hero Creator",
  description:
    "Make any kind of hero image — like a group scene — with ChatGPT's help writing the prompt.",
};

export default function CustomPage() {
  const walkthrough = findWalkthrough("group-scene")!;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <FlowHeader
        eyebrow="Custom image"
        title="Make any kind of hero image"
        steps={[
          "Copy the base image you want to build on into ChatGPT.",
          "Copy each hero you want in the scene into ChatGPT.",
          "Describe your image, copy the meta-prompt, paste it into ChatGPT, and hit Go — ChatGPT writes the full prompt; send that back with the same images.",
        ]}
      />

      <div className="mb-10">
        <ExampleDropdown walkthrough={walkthrough} />
      </div>

      <section className="mb-10">
        <StepHeading n="1" title="Copy the base image" />
        <p className="text-sm text-muted leading-relaxed mb-4 max-w-2xl">
          Image 1 is the image you want to work from — one of the cards below, or your
          own.
        </p>
      </section>

      <section className="mb-10">
        <StepHeading n="2" title="Copy your heroes" />
        <CardSlider>
          {gallery.map((g) => (
            <CopyImageCard
              key={g.slug}
              image={g}
              label={galleryName(g)}
              sizes="(max-width: 640px) 30vw, 168px"
            />
          ))}
        </CardSlider>
      </section>

      <section>
        <StepHeading n="3" title="Copy the meta-prompt" />
        <PromptForm mode="group" />
      </section>
    </div>
  );
}
```

Note: gallery manifest entries have no `download` field — `CopyImageCard` falls back to `image.src` (WebP), which the Clipboard API rejects, so clicks would trigger the "Saved" fallback with a `.webp` file. Fix inside this task: in `CopyImageCard` (Task 2's file), when the fetched blob's type is not `image/png`, transcode via canvas before writing:

```tsx
async function toPngBlob(blob: Blob): Promise<Blob> {
  if (blob.type === "image/png") return blob;
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png")
  );
}
```

and in `writeImageToClipboard`, wrap both fetch paths: `.then((r) => r.blob()).then(toPngBlob)`.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exit 0, `/custom` in the route table.

- [ ] **Step 3: Visual check**

`npm run dev`, open `http://localhost:3000/custom` at 390px and desktop. Verify gallery cards copy as PNG (paste somewhere that accepts images). Verify the two-message flow is stated in step 3 and the example dropdown shows chat2's two rounds. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add app/custom/page.tsx components/copy-image-card.tsx
git commit -m "feat: add custom image flow page; transcode webp copies to png"
```

---

### Task 9: Home page

**Files:**
- Modify: `app/page.tsx` (full rewrite)

**Interfaces:**
- Consumes: `gallery`, `galleryName`, `findGallery` from `@/lib/data`; `CardSlider`; `CopyImageCard` is NOT used here (home cards navigate, not copy).

- [ ] **Step 1: Rewrite the home page**

Replace the entire contents of `app/page.tsx` with:

```tsx
import Image from "next/image";
import Link from "next/link";
import { findGallery, gallery, galleryName } from "@/lib/data";
import { CardSlider } from "@/components/card-slider";

const options = [
  {
    href: "/hero",
    title: "Hero character image",
    text: "Your photo becomes a hero card with your hero name.",
    imageSlug: "ausryte",
  },
  {
    href: "/custom",
    title: "Custom image",
    text: "Make any kind of hero image you want — like a group hero image.",
    imageSlug: "supert",
  },
  {
    href: "/unique",
    title: "Unique hero image",
    text: "No photo — describe a character and ChatGPT creates it.",
    imageSlug: "coqueta-farm",
  },
];

export default function Home() {
  return (
    <div>
      <section className="atmosphere border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-8 md:pt-16 md:pb-12">
          <p className="hud text-xs text-gold mb-3">RFC Alliance — Last Z: Survival Shooter</p>
          <h1 className="display text-3xl md:text-5xl leading-[0.95] max-w-3xl mb-4">
            Make your own hero card
          </h1>
          <p className="text-muted text-sm md:text-base leading-relaxed max-w-2xl mb-8">
            Real simple: pick one of the three image types below. Each page walks you
            through three copy-paste steps into ChatGPT.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {options.map((o) => {
              const img = findGallery(o.imageSlug);
              return (
                <Link key={o.href} href={o.href} className="card-frame overflow-hidden group">
                  <div className="relative aspect-[2/1] sm:aspect-square">
                    <Image
                      src={img.src}
                      alt={galleryName(img)}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                      priority
                    />
                  </div>
                  <div className="p-3">
                    <h2 className="hud text-sm text-cream mb-1 group-hover:text-gold transition-colors">
                      {o.title}
                    </h2>
                    <p className="text-xs text-muted leading-relaxed">{o.text}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <p className="hud text-xs text-gold mb-4">Made by the alliance</p>
        <CardSlider>
          {gallery.map((g) => (
            <Link key={g.slug} href="/gallery" className="card-frame overflow-hidden snap-start">
              <div className="relative aspect-square">
                <Image
                  src={g.src}
                  alt={galleryName(g)}
                  fill
                  sizes="(max-width: 640px) 30vw, 168px"
                  className="object-cover"
                />
              </div>
            </Link>
          ))}
        </CardSlider>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Visual check**

`npm run dev`, open `http://localhost:3000` at 390px: all three option cards (the first action) reachable within the first scroll; collage slider scrolls horizontally. Desktop: three cards side by side. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: three-option home screen with collage banner"
```

---

### Task 10: Nav, footer, redirects, delete old pages

**Files:**
- Modify: `components/site-nav.tsx:7-13` (links array)
- Modify: `app/layout.tsx:40-56` (footer links)
- Modify: `next.config.ts`
- Delete: `app/guide/page.tsx`, `app/builder/page.tsx`, `app/templates/page.tsx`, `app/walkthroughs/page.tsx`, `app/walkthroughs/[slug]/page.tsx`, `components/prompt-builder.tsx`

**Interfaces:**
- Consumes: routes `/hero`, `/custom`, `/unique` from Tasks 6-8.
- Produces: final nav; permanent redirect map for old URLs.

- [ ] **Step 1: Update nav links**

In `components/site-nav.tsx`, replace the `links` array with:

```tsx
const links = [
  ["Hero Card", "/hero"],
  ["Custom", "/custom"],
  ["Unique", "/unique"],
  ["Gallery", "/gallery"],
] as const;
```

- [ ] **Step 2: Update footer links**

In `app/layout.tsx`, replace the footer's link array with:

```tsx
              {[
                ["Hero Card", "/hero"],
                ["Custom", "/custom"],
                ["Unique", "/unique"],
                ["Gallery", "/gallery"],
              ].map(([label, href]) => (
```

- [ ] **Step 3: Add redirects**

Replace `next.config.ts` contents with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/guide", destination: "/hero", permanent: false },
      { source: "/builder", destination: "/hero", permanent: false },
      { source: "/templates", destination: "/hero", permanent: false },
      { source: "/walkthroughs", destination: "/", permanent: false },
      { source: "/walkthroughs/hero-card-from-photo", destination: "/hero", permanent: false },
      { source: "/walkthroughs/group-scene", destination: "/custom", permanent: false },
      { source: "/walkthroughs/hero-card-no-photo", destination: "/unique", permanent: false },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 4: Delete replaced pages and component**

```bash
git rm -r app/guide app/builder app/templates app/walkthroughs
git rm components/prompt-builder.tsx
```

- [ ] **Step 5: Sweep for dangling references**

Run: `grep -rn "prompt-builder\|/guide\|/builder\|/templates\|/walkthroughs\|walkthroughs\[" app components lib --include="*.tsx" --include="*.ts"`
Expected: no matches outside `next.config.ts` comments and `lib/chats.ts` internal data. Fix any found (e.g. links in remaining pages).

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: exit 0; route table shows only `/`, `/hero`, `/custom`, `/unique`, `/gallery`.

- [ ] **Step 7: Verify redirects**

`npm run dev`, then:

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3000/guide http://localhost:3000/walkthroughs/group-scene
```

Expected: `307 .../hero` and `307 .../custom`. Stop dev server.

- [ ] **Step 8: Commit**

```bash
git add components/site-nav.tsx app/layout.tsx next.config.ts
git commit -m "feat: new nav, redirects, remove replaced pages"
```

---

### Task 11: Mobile and contrast verification pass

**Files:**
- Modify: any of the above as needed by findings.

- [ ] **Step 1: Browser pass**

`npm run dev`. Using browser tools at 390×844 and 1280×800, screenshot every route (`/`, `/hero`, `/custom`, `/unique`, `/gallery`) and check against the Global Constraints:
- First action within the first scroll on every page at 390px.
- No horizontal body scroll anywhere (only the sliders scroll).
- Card grids feel tight, mobile-game density; 3-4 columns on mobile where grids appear.
- All body/paragraph text is `text-muted` (now 9.9:1) or `text-cream`; nothing readable is below ~9:1 (decorative step numerals exempt).
- Copy interactions show feedback on tap (no hover dependence).

- [ ] **Step 2: Fix anything found**

Apply minimal fixes for each finding. Re-screenshot to confirm.

- [ ] **Step 3: Build + commit**

Run: `npm run build` (expected: exit 0), then:

```bash
git add -A
git commit -m "fix: mobile density and contrast pass"
```

(Skip the commit if step 1 found nothing.)

---

### Task 12: One-paste copy investigation (optional — skip if paste fails)

**Files:**
- Create: `components/copy-all-button.tsx`
- Modify: `app/hero/page.tsx` (only if the experiment succeeds)

**Interfaces:**
- Consumes: `ManifestImage`, the live prompt string.
- Produces (only if kept): `<CopyAllButton images={ManifestImage[]} text={string} />`.

- [ ] **Step 1: Build the experiment component**

Create `components/copy-all-button.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { ManifestImage } from "@/lib/data";

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

// Approach A: single ClipboardItem with text/html (embedded data-URI imgs + prompt)
// and text/plain (prompt only).
async function copyHtmlPayload(images: ManifestImage[], text: string): Promise<boolean> {
  try {
    const dataUrls = await Promise.all(
      images.map(async (img) => blobToDataUrl(await (await fetch(img.download ?? img.src)).blob()))
    );
    const html =
      dataUrls.map((u) => `<img src="${u}">`).join("") +
      `<p>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>")}</p>`;
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" }),
      }),
    ]);
    return true;
  } catch {
    return false;
  }
}

// Approach B: stitch images side by side into one composite PNG + prompt text.
async function copyCompositePayload(images: ManifestImage[], text: string): Promise<boolean> {
  try {
    const bitmaps = await Promise.all(
      images.map(async (img) => createImageBitmap(await (await fetch(img.download ?? img.src)).blob()))
    );
    const h = Math.max(...bitmaps.map((b) => b.height));
    const w = bitmaps.reduce((sum, b) => sum + b.width, 0);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    let x = 0;
    for (const b of bitmaps) {
      ctx.drawImage(b, x, 0);
      x += b.width;
    }
    const png: Blob = await new Promise((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png")
    );
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": png,
        "text/plain": new Blob([text], { type: "text/plain" }),
      }),
    ]);
    return true;
  } catch {
    return false;
  }
}

export function CopyAllButton({
  images,
  text,
  approach,
}: {
  images: ManifestImage[];
  text: string;
  approach: "html" | "composite";
}) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    const ok =
      approach === "html"
        ? await copyHtmlPayload(images, text)
        : await copyCompositePayload(images, text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`hud text-xs px-4 py-2.5 border transition-colors ${
        copied ? "border-gold bg-gold text-bg" : "border-gold text-gold hover:bg-gold hover:text-bg"
      }`}
    >
      {copied ? "Copied" : "Copy everything"}
    </button>
  );
}
```

- [ ] **Step 2: Test both approaches against ChatGPT**

Temporarily render two `CopyAllButton`s (one per approach) at the bottom of `/hero` with the S template + one hero ref + the default prompt. `npm run dev`, then in Chrome: click each button and paste into a chatgpt.com message box.

Record for each approach: does the paste produce (a) usable image attachment(s) AND the prompt text in one paste?

Known constraints going in: the Clipboard API cannot hold multiple separate image items; ChatGPT's composer is expected to take either the image or the text from a mixed payload, not both. The test settles it.

- [ ] **Step 3: Decide**

- If neither approach gives a genuine one-paste result in ChatGPT: delete `components/copy-all-button.tsx`, remove the temporary buttons, and note the result in the final report. (This is the expected outcome; the issue says skip if not possible.)
- If one works: keep that approach only, place the button in `PromptForm`'s prompt panel header on all three pages wired to the page's selected images — this wiring needs selected-image state lifted to the page level; implement only in this case, as a `"use client"` wrapper page section holding "selected" state passed to both the card grids and the form.

- [ ] **Step 4: Build + commit (or cleanup)**

Run: `npm run build` (expected: exit 0), then either:

```bash
git add -A
git commit -m "feat: one-paste copy-everything button"
```

or, if skipped:

```bash
git checkout app/hero/page.tsx
rm -f components/copy-all-button.tsx
```

---

### Task 13: Final review and deploy

- [ ] **Step 1: Full build + route sweep**

Run: `npm run build`
Expected: exit 0, routes `/`, `/hero`, `/custom`, `/unique`, `/gallery` only.

- [ ] **Step 2: Push (deploys production)**

Confirm with Mike before pushing — pushes to `main` auto-deploy production on Vercel.

```bash
git push origin main
```

- [ ] **Step 3: Verify production**

Open https://rfc-hero-creator.vercel.app on desktop and a phone-sized viewport; spot-check `/hero` copy interactions and the redirects.

---

## Self-Review Notes

- **Spec coverage:** (1) contrast → Task 1; (2) mobile → Tasks 3, 6-9, 11; (3) click-to-copy templates + hero images → Tasks 2, 6-8; (4) two rows of three sliding cards → Task 3; (5) 1-2-3 per page, no click-around → Tasks 5-8, 10; (6) home screen three options + brief explainer + example dropdown + collage banner + first-action-first-scroll → Tasks 4, 6-9, 11; (7) one-paste investigation → Task 12.
- **Known deviation from TDD:** repo has no test framework; adding one for a static content site was judged out of scope. Verification is build + browser checks per task.
- **Type consistency check:** `CopyImageCard` props (`image`, `label`, `sizes`, `priority`) match all call sites; `FlowHeader`/`StepHeading` signatures match Tasks 6-8; `PromptForm` mode union matches `lib/prompts.ts` functions; walkthrough slugs (`hero-card-from-photo`, `group-scene`, `hero-card-no-photo`) match `lib/chats.ts`.
