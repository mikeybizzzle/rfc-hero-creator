"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Easing, clamp, interpolate, type SceneCtx } from "@/components/how-it-works/engine";

const STAGE_W = 1920;
const STAGE_H = 1080;
const PLAY_COUNT = 2;

export type AnimVariant = "hero" | "unique" | "custom";

const SITE_TPLS = [
  "/images/templates/s-orange-template.webp",
  "/images/templates/a-purple-template.webp",
  "/images/templates/b-blue-template.webp",
];
const SITE_STYLES = [
  { src: "/images/heroes/s-alma.webp", name: "Alma" },
  { src: "/images/heroes/s-amelia.webp", name: "Amelia" },
  { src: "/images/heroes/s-bella.webp", name: "Bella" },
  { src: "/images/heroes/s-chinatsu.webp", name: "Chinatsu" },
  { src: "/images/heroes/s-evelyn.webp", name: "Evelyn" },
];

type CursorPath = { p: number; x: number; y: number }[];

type Config = {
  scenes: number[];
  thumbs: string[];
  out: string;
  attachPops: [number, number][];
  ns: { describe?: number; attach?: number; paste?: number; send?: number };
  site?: {
    slotPad: number;
    tplSel: number;
    step1Cursor: CursorPath;
    rankSel: number;
    typedName: string;
    hasUpload: boolean;
    buildN: number;
  };
};

const CONFIGS: Record<AnimVariant, Config> = {
  hero: {
    scenes: [4.5, 4, 4, 6, 3.5, 3.5, 3, 3, 5],
    thumbs: [
      SITE_TPLS[0],
      SITE_STYLES[1].src,
      "/images/chats/chat1/message-1-provided-images/provided-image-3.webp",
    ],
    out: "/images/chats/chat1/image-outputs/message-1-image-output.webp",
    attachPops: [
      [0.2, 0.36],
      [0.36, 0.52],
      [0.52, 0.68],
    ],
    ns: {},
    site: {
      slotPad: 110,
      tplSel: 0,
      step1Cursor: [
        { p: 0.18, x: 1450, y: 380 },
        { p: 0.44, x: 620, y: 640 },
        { p: 0.78, x: 960, y: 930 },
      ],
      rankSel: 0,
      typedName: "Aušrytė",
      hasUpload: true,
      buildN: 4,
    },
  },
  unique: {
    scenes: [4.5, 4, 6, 3.5, 3.5, 3, 3, 5],
    thumbs: [SITE_TPLS[2], SITE_STYLES[1].src],
    out: "/images/chats/chat3/image-outputs/message-1-image-output.webp",
    attachPops: [
      [0.22, 0.38],
      [0.44, 0.6],
    ],
    ns: {},
    site: {
      slotPad: 260,
      tplSel: 2,
      step1Cursor: [
        { p: 0.18, x: 1450, y: 380 },
        { p: 0.44, x: 1320, y: 640 },
        { p: 0.78, x: 960, y: 930 },
      ],
      rankSel: 2,
      typedName: "CoquetaFarm",
      hasUpload: false,
      buildN: 3,
    },
  },
  custom: {
    scenes: [5.5, 4.5, 4, 3.5, 3.5, 5],
    thumbs: [
      "/images/chats/chat2/message-1-provided-images/provided-image-1.webp",
      "/images/chats/chat2/message-1-provided-images/provided-image-2.webp",
      "/images/chats/chat2/message-1-provided-images/provided-image-3.webp",
      "/images/chats/chat2/message-1-provided-images/provided-image-4.webp",
    ],
    out: "/images/chats/chat2/image-outputs/message-2-image-output.webp",
    attachPops: [
      [0.18, 0.32],
      [0.32, 0.46],
      [0.46, 0.6],
      [0.6, 0.74],
    ],
    ns: { describe: 1, attach: 2, paste: 3, send: 4 },
  },
};

function sceneAt(scenes: number[], time: number): SceneCtx {
  let t = time;
  let index = 0;
  while (index < scenes.length - 1 && t >= scenes[index]) {
    t -= scenes[index];
    index++;
  }
  return { index, localTime: t, progress: clamp(t / scenes[index], 0, 1) };
}

const FT = "var(--font-display)";
const FB = "var(--font-sans)";
const FN = "var(--font-saira)";
const GRAD = "linear-gradient(135deg,#ffd05a,#f26a20)";
const GOLD = "#ffd05a";
const CREAM = "#f7f1e8";
const DIM = "#b9ad9f";
const INK = "#1a1108";

const NOTE: CSSProperties = { color: "#9b9b9b" };
const GRAD_TEXT: CSSProperties = {
  background: GRAD,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

type StepStrings = {
  slotLabels: string[];
  tplNames: string[];
  next: string;
  step1Title: string;
  step1Sub: ReactNode;
  step2Title: string;
  step2Sub: ReactNode;
  upload?: { title: string; sub: ReactNode; tip: string; button: string };
  build: {
    title: string;
    sub: ReactNode;
    rankLabel: string;
    customRank: string;
    nameLabel: string;
    detailsLabel: ReactNode;
    typedDetails: string;
    copyPrompt: string;
    promptCopied: string;
    copyImages: string;
    imagesCopied: string;
  };
};

type AnimStrings = {
  hitSend: string;
  working: string;
  generating: string;
  takes: string;
  messageGhost: string;
  messageSent: string;
  attachCaption: string;
  attachLine1: string;
  attachLine2: string;
  labels: string[];
  pasteCaption: string;
  prompt: ReactNode;
  done: string;
  tagline: ReactNode;
  steps?: StepStrings;
  describe?: {
    caption: string;
    title: string;
    body: ReactNode;
    fieldLabel: string;
    topic: string;
    copyCta: string;
    copiedCta: string;
  };
};

function useAnimStrings(variant: AnimVariant): AnimStrings {
  const ta = useTranslations("Wizard.anim");
  const th = useTranslations("Wizard.anim.hero");
  const tu = useTranslations("Wizard.anim.unique");
  const tc = useTranslations("Wizard.anim.custom");
  const tHero = useTranslations("Wizard.hero");
  const tUnique = useTranslations("Wizard.unique");
  const tCustom = useTranslations("Wizard.custom");
  const tShared = useTranslations("Wizard.shared");
  const tTemplates = useTranslations("Templates");

  const note = (chunks: ReactNode) => <span style={NOTE}>{chunks}</span>;
  const grad = (chunks: ReactNode) => <span style={GRAD_TEXT}>{chunks}</span>;
  const strong = (chunks: ReactNode) => <strong style={{ color: CREAM }}>{chunks}</strong>;

  const shared = {
    hitSend: ta("hitSend"),
    working: ta("working"),
    generating: ta("generating"),
    takes: ta("takes"),
    messageGhost: ta("messageGhost"),
    messageSent: ta("messageSent"),
  };
  const tplNames = [tTemplates("sLabel"), tTemplates("aLabel"), tTemplates("bLabel")];

  if (variant === "hero") {
    return {
      ...shared,
      attachCaption: th("attachCaption"),
      attachLine1: th("attachLine1"),
      attachLine2: th("attachLine2"),
      labels: [th("label1"), th("label2"), th("label3")],
      pasteCaption: th("pasteCaption"),
      prompt: tHero.rich("exampleMessage", { note }),
      done: th("done"),
      tagline: th.rich("tagline", { grad }),
      steps: {
        slotLabels: [tHero("slotBase"), tHero("slotStyle"), tHero("slotPhoto")],
        tplNames,
        next: tHero("cta1"),
        step1Title: tHero("step1Title"),
        step1Sub: ta.rich("step1Sub", { strong }),
        step2Title: tHero("step2Title"),
        step2Sub: ta.rich("step2Sub", { strong }),
        upload: {
          title: tHero("step3Title"),
          sub: th.rich("step3Sub", { strong }),
          tip: tHero("photoTip"),
          button: tHero("uploadPhoto"),
        },
        build: {
          title: tHero("step4Title"),
          sub: th.rich("step4Sub", { strong }),
          rankLabel: tShared("rankLabel"),
          customRank: tShared("customRank"),
          nameLabel: tHero("heroName"),
          detailsLabel: (
            <>
              {tHero("extraDetails")}{" "}
              <span style={{ color: "#8a7d6c", fontWeight: 400 }}>{tHero("optional")}</span>
            </>
          ),
          typedDetails: th("typedDetails"),
          copyPrompt: tHero("copyPromptGo"),
          promptCopied: ta("promptCopied"),
          copyImages: tHero("copyImages"),
          imagesCopied: ta("imagesCopied"),
        },
      },
    };
  }
  if (variant === "unique") {
    return {
      ...shared,
      attachCaption: tu("attachCaption"),
      attachLine1: tu("attachLine1"),
      attachLine2: tu("attachLine2"),
      labels: [tu("label1"), tu("label2")],
      pasteCaption: tu("pasteCaption"),
      prompt: tu.rich("prompt", { note }),
      done: tu("done"),
      tagline: tu.rich("tagline", { grad }),
      steps: {
        slotLabels: [tUnique("slotBase"), tUnique("slotStyle")],
        tplNames,
        next: tUnique("cta1"),
        step1Title: tUnique("step1Title"),
        step1Sub: ta.rich("step1Sub", { strong }),
        step2Title: tUnique("step2Title"),
        step2Sub: ta.rich("step2Sub", { strong }),
        build: {
          title: tUnique("step3Title"),
          sub: tu.rich("step3Sub", { strong }),
          rankLabel: tShared("rankLabel"),
          customRank: tShared("customRank"),
          nameLabel: tUnique("heroName"),
          detailsLabel: tUnique("detailsLabel"),
          typedDetails: tu("typedDetails"),
          copyPrompt: tUnique("copyPromptGo"),
          promptCopied: ta("promptCopied"),
          copyImages: tUnique("copyImages"),
          imagesCopied: ta("imagesCopied"),
        },
      },
    };
  }
  return {
    ...shared,
    attachCaption: tc("attachCaption"),
    attachLine1: tc("attachLine1"),
    attachLine2: tc("attachLine2"),
    labels: [tc("label1"), tc("label2"), tc("label3"), tc("label4")],
    pasteCaption: tc("pasteCaption"),
    prompt: tCustom.rich("exampleMessage", { note }),
    done: tc("done"),
    tagline: tc.rich("tagline", { grad }),
    describe: {
      caption: tc("describeCaption"),
      title: tCustom("step1Title"),
      body: tc.rich("describeBody", { strong }),
      fieldLabel: tCustom("yourDescription"),
      topic: tc("topic"),
      copyCta: tCustom("copyPromptGo"),
      copiedCta: tShared("copied"),
    },
  };
}

const M = {
  in: (p: number, a: number, b: number) => Easing.easeOutCubic(clamp((p - a) / (b - a), 0, 1)),
  pop: (p: number, a: number, b: number) => Easing.easeOutBack(clamp((p - a) / (b - a), 0, 1)),
  mid: (p: number, a: number, b: number) => Easing.easeInOutCubic(clamp((p - a) / (b - a), 0, 1)),
};

function Img({ src, style }: { src: string; style: CSSProperties }) {
  return <img src={src} alt="" draggable={false} decoding="async" style={style} />;
}

function Cursor({
  p,
  path,
  clickAt,
  visible,
}: {
  p: number;
  path: CursorPath;
  clickAt?: number | number[];
  visible: [number, number];
}) {
  const ps = path.map((w) => w.p);
  const x = interpolate(ps, path.map((w) => w.x), Easing.easeInOutCubic)(p);
  const y = interpolate(ps, path.map((w) => w.y), Easing.easeInOutCubic)(p);
  const op = M.in(p, visible[0], visible[0] + 0.06) * (1 - M.in(p, visible[1] - 0.06, visible[1]));
  const clicks = clickAt == null ? [] : Array.isArray(clickAt) ? clickAt : [clickAt];
  const ring = clicks.map((c) => clamp((p - c) / 0.1, 0, 1)).find((r) => r > 0 && r < 1) || 0;
  const press = clicks.some((c) => p >= c - 0.02 && p <= c + 0.04) ? 0.8 : 1;
  if (op <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, zIndex: 40, pointerEvents: "none" }}>
      {ring > 0 && ring < 1 && (
        <div
          style={{
            position: "absolute",
            left: 10 - (18 + 44 * ring),
            top: 10 - (18 + 44 * ring),
            width: (18 + 44 * ring) * 2,
            height: (18 + 44 * ring) * 2,
            borderRadius: "50%",
            border: "4px solid " + GOLD,
            opacity: 1 - ring,
          }}
        />
      )}
      <svg
        width="52"
        height="61"
        viewBox="0 0 17 20"
        style={{ display: "block", transform: `scale(${press})`, transformOrigin: "15% 10%", filter: "drop-shadow(0 3px 8px rgba(0,0,0,.65))" }}
      >
        <path d="M1.5 1 L1.5 15.2 L5.2 11.9 L7.5 17.4 L10.1 16.2 L7.8 10.9 L12.6 10.5 Z" fill="#fff" stroke={INK} strokeWidth="1" />
      </svg>
    </div>
  );
}

function Caption({ p, n, text }: { p: number; n?: number; text: string }) {
  const t = M.in(p, 0.02, 0.16);
  return (
    <div
      style={{
        position: "absolute",
        top: 42,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        opacity: t,
        transform: `translateY(${(1 - t) * 24}px)`,
      }}
    >
      {n != null && (
        <span
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: GRAD,
            color: INK,
            display: "grid",
            placeItems: "center",
            fontFamily: FN,
            fontWeight: 900,
            fontSize: 40,
            flex: "0 0 auto",
          }}
        >
          {n}
        </span>
      )}
      <span style={{ fontFamily: FT, fontWeight: 800, fontSize: 62, letterSpacing: "1px", color: CREAM }}>{text}</span>
    </div>
  );
}

function Shell({ ctx, n, caption, children }: { ctx: SceneCtx; n?: number; caption?: string; children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        fontFamily: FB,
        color: CREAM,
        background:
          "radial-gradient(circle at 82% -5%, rgba(242,106,32,.16), transparent 640px), radial-gradient(circle at 12% 32%, rgba(255,208,90,.07), transparent 560px), #0b0907",
      }}
    >
      {caption && <Caption p={ctx.progress} n={n} text={caption} />}
      {children}
    </div>
  );
}

function ChatWindow({ children, composer, dim = 0 }: { children?: ReactNode; composer: ReactNode; dim?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 210,
        top: 168,
        width: 1500,
        height: 832,
        opacity: 1 - 0.78 * dim,
        background: "#1b1b1b",
        border: "1px solid rgba(255,255,255,.14)",
        borderRadius: 26,
        overflow: "hidden",
        boxShadow: "0 24px 70px rgba(0,0,0,.5)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 28px", borderBottom: "1px solid rgba(255,255,255,.1)", flex: "0 0 auto" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
          <span key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ marginLeft: 14, fontSize: 24, fontWeight: 700, color: "#9b9b9b" }}>ChatGPT</span>
      </div>
      <div style={{ flex: 1, padding: "24px 40px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 22, minHeight: 0, overflow: "hidden" }}>
        {children}
      </div>
      {composer}
    </div>
  );
}

function Composer({
  cfg,
  s,
  thumbKs = [],
  showLabels,
  text,
  hl = 0,
  press = 1,
  ghost,
}: {
  cfg: Config;
  s: AnimStrings;
  thumbKs?: number[];
  showLabels?: boolean;
  text?: ReactNode;
  hl?: number;
  press?: number;
  ghost?: string;
}) {
  return (
    <div style={{ margin: "0 36px 28px", flex: "0 0 auto", background: "#111", border: "1px solid rgba(255,255,255,.14)", borderRadius: 22, padding: "18px 22px", display: "grid", gap: 14 }}>
      {thumbKs.some((k) => k > 0.01) && (
        <div style={{ display: "flex", gap: 20 }}>
          {cfg.thumbs.map((src, i) => {
            const k = thumbKs[i] || 0;
            if (k <= 0.01) return <span key={i} />;
            return (
              <div key={i} style={{ display: "grid", gap: 6, justifyItems: "center", opacity: Math.min(1, k * 2), transform: `scale(${0.6 + 0.4 * k})` }}>
                <Img src={src} style={{ width: 104, height: 104, objectFit: "cover", borderRadius: 14, border: "1px solid rgba(255,255,255,.2)" }} />
                {showLabels && <span style={{ fontSize: 20, fontWeight: 800, color: GOLD, whiteSpace: "nowrap" }}>{s.labels[i]}</span>}
              </div>
            );
          })}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <span style={{ width: 60, height: 60, borderRadius: "50%", border: "2px solid rgba(255,255,255,.28)", display: "grid", placeItems: "center", fontSize: 34, color: "#c6c6c6", flex: "0 0 auto", lineHeight: 1 }}>
          +
        </span>
        <span style={{ flex: 1, fontSize: 28, lineHeight: 1.4, color: text ? "#ececec" : "#7a7a7a", position: "relative", minWidth: 0 }}>
          <span
            style={{
              background: hl > 0.01 ? `rgba(255,208,90,${0.28 * hl})` : "transparent",
              borderRadius: 6,
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
              padding: hl > 0.01 ? "2px 4px" : 0,
            }}
          >
            {text || ghost || s.messageGhost}
          </span>
        </span>
        <span style={{ width: 68, height: 68, borderRadius: "50%", background: GRAD, display: "grid", placeItems: "center", flex: "0 0 auto", transform: `scale(${press})` }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M12 20V5M12 5l-6 6M12 5l6 6" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function UserBubble({ cfg, s, t = 1, compact }: { cfg: Config; s: AnimStrings; t?: number; compact?: boolean }) {
  return (
    <div
      style={{
        alignSelf: "flex-end",
        display: "grid",
        gap: 12,
        justifyItems: "end",
        opacity: Math.min(1, t * 1.6),
        transform: `translateY(${(1 - t) * 60}px)`,
        flex: "0 0 auto",
        minWidth: 0,
        maxWidth: "100%",
      }}
    >
      {!compact && (
        <div style={{ display: "flex", gap: 10 }}>
          {cfg.thumbs.map((src, i) => (
            <Img key={i} src={src} style={{ width: 112, height: 112, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,.16)" }} />
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        {compact &&
          cfg.thumbs.map((src, i) => (
            <Img key={i} src={src} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 9, border: "1px solid rgba(255,255,255,.16)", flex: "0 0 auto" }} />
          ))}
        <div
          style={{
            background: "#303030",
            borderRadius: "20px 20px 6px 20px",
            padding: compact ? "13px 22px" : "16px 26px",
            color: "#ececec",
            fontSize: compact ? 23 : 27,
            lineHeight: 1.45,
            maxWidth: compact ? 620 : 900,
            whiteSpace: compact ? "nowrap" : "normal",
            overflow: compact ? "hidden" : "visible",
            textOverflow: "ellipsis",
          }}
        >
          {s.prompt}
        </div>
      </div>
    </div>
  );
}

type SceneProps = { ctx: SceneCtx; cfg: Config; s: AnimStrings };

// ── Site-step building blocks (hero & unique) ────────────────────────────
function SlotsRow({ cfg, s, fills }: { cfg: Config; s: AnimStrings; fills: number[] }) {
  const st = s.steps!;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: `0 ${cfg.site!.slotPad}px`, marginBottom: 22 }}>
      {fills.map((k, i) => (
        <div key={i} style={{ display: "grid", gap: 8, justifyItems: "center" }}>
          <div
            style={{
              width: 108,
              height: 108,
              borderRadius: 16,
              border: k > 0.01 ? "3px solid " + GOLD : "3px dashed rgba(255,214,122,.35)",
              overflow: "hidden",
              background: "#131007",
              boxShadow: k > 0.01 ? "0 0 22px rgba(255,208,90,.3)" : "none",
            }}
          >
            {k > 0.01 && <Img src={cfg.thumbs[i]} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${Math.max(k, 0.01)})` }} />}
          </div>
          <span style={{ fontSize: 21, fontWeight: 800, color: k > 0.01 ? GOLD : "#8a7d6c" }}>{st.slotLabels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function SitePanel({ ctx, cfg, s, fills, children }: SceneProps & { fills: number[]; children: ReactNode }) {
  const t = M.in(ctx.progress, 0.02, 0.14);
  return (
    <div
      style={{
        position: "absolute",
        left: 310,
        top: 168,
        width: 1300,
        opacity: t,
        transform: `translateY(${(1 - t) * 24}px)`,
        background: "#151007",
        border: "1px solid rgba(255,214,122,.3)",
        borderRadius: 24,
        padding: "28px 44px 36px",
        boxShadow: "0 24px 70px rgba(0,0,0,.5)",
      }}
    >
      <SlotsRow cfg={cfg} s={s} fills={fills} />
      {children}
    </div>
  );
}

function StepHead({ n, title, sub }: { n: number; title: string; sub?: ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: sub ? 10 : 0 }}>
        <span style={{ width: 54, height: 54, borderRadius: 13, background: GRAD, color: INK, display: "grid", placeItems: "center", fontFamily: FN, fontWeight: 900, fontSize: 28, flex: "0 0 auto" }}>
          {n}
        </span>
        <span style={{ fontFamily: FT, fontWeight: 800, fontSize: 44, color: CREAM }}>{title}</span>
      </div>
      {sub && <div style={{ fontSize: 25, color: DIM, lineHeight: 1.45 }}>{sub}</div>}
    </div>
  );
}

function NextBar({ label, active, press }: { label: string; active: boolean; press: boolean }) {
  return (
    <div
      style={{
        marginTop: 24,
        height: 72,
        borderRadius: 14,
        display: "grid",
        placeItems: "center",
        background: active ? GRAD : "#241d10",
        color: active ? INK : "#7a6c55",
        fontWeight: 800,
        fontSize: 26,
        letterSpacing: "3px",
        transform: `scale(${press ? 0.98 : 1})`,
      }}
    >
      {label}
    </div>
  );
}

// ── Site step: pick a base card ──────────────────────────────────────────
function SceneTemplates({ ctx, cfg, s }: SceneProps) {
  const p = ctx.progress;
  const st = s.steps!;
  const sel = M.in(p, 0.48, 0.54);
  const fill = M.pop(p, 0.56, 0.7);
  const fills = cfg.thumbs.map((_, i) => (i === 0 ? fill : 0));
  return (
    <Shell ctx={ctx}>
      <SitePanel ctx={ctx} cfg={cfg} s={s} fills={fills}>
        <StepHead n={1} title={st.step1Title} sub={st.step1Sub} />
        <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
          {SITE_TPLS.map((src, i) => {
            const t = M.pop(p, 0.08 + i * 0.07, 0.24 + i * 0.07);
            const isSel = i === cfg.site!.tplSel;
            return (
              <div
                key={i}
                style={{
                  opacity: Math.min(1, t * 2),
                  transform: `scale(${0.75 + 0.25 * t})`,
                  width: 320,
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "#131007",
                  border: isSel && sel > 0.5 ? "4px solid " + GOLD : "1px solid rgba(255,214,122,.25)",
                  boxShadow: isSel ? `0 0 ${60 * sel}px rgba(255,208,90,${0.4 * sel})` : "none",
                }}
              >
                <Img src={src} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                <div style={{ padding: "12px 0", textAlign: "center", fontWeight: 800, fontSize: 24, color: "#e8ded2" }}>{st.tplNames[i]}</div>
              </div>
            );
          })}
        </div>
        <NextBar label={st.next} active={fill > 0.5} press={p >= 0.84 && p <= 0.9} />
      </SitePanel>
      <Cursor p={p} path={cfg.site!.step1Cursor} clickAt={[0.48, 0.84]} visible={[0.16, 0.95]} />
    </Shell>
  );
}

// ── Site step: pick a style ──────────────────────────────────────────────
function SceneStyles({ ctx, cfg, s }: SceneProps) {
  const p = ctx.progress;
  const st = s.steps!;
  const sel = M.in(p, 0.48, 0.54);
  const fill = M.pop(p, 0.56, 0.7);
  const fills = cfg.thumbs.map((_, i) => (i === 0 ? 1 : i === 1 ? fill : 0));
  return (
    <Shell ctx={ctx}>
      <SitePanel ctx={ctx} cfg={cfg} s={s} fills={fills}>
        <StepHead n={2} title={st.step2Title} sub={st.step2Sub} />
        <div style={{ display: "flex", justifyContent: "center", gap: 22 }}>
          {SITE_STYLES.map((c, i) => {
            const t = M.pop(p, 0.08 + i * 0.05, 0.22 + i * 0.05);
            const isPick = i === 1;
            return (
              <div
                key={i}
                style={{
                  opacity: Math.min(1, t * 2),
                  transform: `scale(${0.75 + 0.25 * t})`,
                  width: 205,
                  borderRadius: 18,
                  overflow: "hidden",
                  background: "#131007",
                  border: isPick && sel > 0.5 ? "4px solid " + GOLD : "1px solid rgba(255,214,122,.25)",
                  boxShadow: isPick ? `0 0 ${50 * sel}px rgba(255,208,90,${0.4 * sel})` : "none",
                }}
              >
                <Img src={c.src} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
                <div style={{ padding: "10px 0", textAlign: "center", fontWeight: 800, fontSize: 22, color: "#e8ded2" }}>{c.name}</div>
              </div>
            );
          })}
        </div>
        <NextBar label={st.next} active={fill > 0.5} press={p >= 0.84 && p <= 0.9} />
      </SitePanel>
      <Cursor p={p} path={[{ p: 0.18, x: 1450, y: 380 }, { p: 0.44, x: 745, y: 580 }, { p: 0.78, x: 960, y: 800 }]} clickAt={[0.48, 0.84]} visible={[0.16, 0.95]} />
    </Shell>
  );
}

// ── Site step: upload your photo (hero only) ─────────────────────────────
function SceneUpload({ ctx, cfg, s }: SceneProps) {
  const p = ctx.progress;
  const st = s.steps!;
  const up = M.pop(p, 0.44, 0.58);
  const fill = M.pop(p, 0.58, 0.72);
  return (
    <Shell ctx={ctx}>
      <SitePanel ctx={ctx} cfg={cfg} s={s} fills={[1, 1, fill]}>
        <StepHead n={3} title={st.upload!.title} sub={st.upload!.sub} />
        <div style={{ display: "flex", alignItems: "center", gap: 34, border: "1px solid rgba(255,214,122,.22)", borderRadius: 18, padding: "26px 32px", marginBottom: 22 }}>
          <div
            style={{
              width: 170,
              height: 170,
              borderRadius: 16,
              flex: "0 0 auto",
              border: up > 0.01 ? "3px solid " + GOLD : "3px dashed rgba(255,214,122,.35)",
              overflow: "hidden",
              background: "#131007",
              display: "grid",
              placeItems: "center",
            }}
          >
            {up > 0.01 ? (
              <Img src={cfg.thumbs[2]} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${Math.max(up, 0.01)})` }} />
            ) : (
              <span style={{ fontSize: 46, color: "rgba(255,214,122,.4)" }}>+</span>
            )}
          </div>
          <span style={{ fontSize: 26, color: DIM, lineHeight: 1.5 }}>{st.upload!.tip}</span>
        </div>
        <div
          style={{
            height: 70,
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            border: "1px solid rgba(255,214,122,.4)",
            color: GOLD,
            fontWeight: 800,
            fontSize: 25,
            letterSpacing: "3px",
            transform: `scale(${p >= 0.36 && p <= 0.42 ? 0.98 : 1})`,
          }}
        >
          {st.upload!.button}
        </div>
        <NextBar label={st.next} active={fill > 0.5} press={p >= 0.84 && p <= 0.9} />
      </SitePanel>
      <Cursor p={p} path={[{ p: 0.14, x: 1450, y: 420 }, { p: 0.34, x: 960, y: 790 }, { p: 0.78, x: 960, y: 895 }]} clickAt={[0.38, 0.84]} visible={[0.12, 0.95]} />
    </Shell>
  );
}

// ── Site step: build your prompt ─────────────────────────────────────────
const RANKS = [
  { l: "S", c: GOLD },
  { l: "A", c: "#c084fc" },
  { l: "B", c: "#60a5fa" },
];

function SceneBuild({ ctx, cfg, s }: SceneProps) {
  const p = ctx.progress;
  const lt = ctx.localTime;
  const st = s.steps!;
  const site = cfg.site!;
  const nameTyped = site.typedName.slice(0, Math.floor(clamp((p - 0.1) / 0.16, 0, 1) * site.typedName.length));
  const detTyped = st.build.typedDetails.slice(0, Math.floor(clamp((p - 0.28) / 0.16, 0, 1) * st.build.typedDetails.length));
  const caret = Math.floor(lt * 2.5) % 2 === 0;
  const c1 = p >= 0.56;
  const c2 = p >= 0.82;
  const ranks = [...RANKS, { l: st.build.customRank, c: "#c9bfb1" }];
  const inp: CSSProperties = {
    background: "#0f0b05",
    border: "1px solid rgba(255,214,122,.35)",
    borderRadius: 12,
    padding: "14px 22px",
    fontSize: 26,
    color: "#e8ded2",
    fontWeight: 700,
  };
  const lab: CSSProperties = { fontSize: 22, fontWeight: 800, color: CREAM, margin: "14px 0 8px" };
  const btn = (done: boolean, label: string, doneLabel: string) => (
    <div
      style={{
        flex: 1,
        height: 72,
        borderRadius: 14,
        display: "grid",
        placeItems: "center",
        background: done ? "#241b10" : GRAD,
        border: done ? "3px solid " + GOLD : "3px solid transparent",
        color: done ? GOLD : INK,
        fontWeight: 800,
        fontSize: 23,
        letterSpacing: "2px",
      }}
    >
      {done ? doneLabel : label}
    </div>
  );
  return (
    <Shell ctx={ctx}>
      <SitePanel ctx={ctx} cfg={cfg} s={s} fills={cfg.thumbs.map(() => 1)}>
        <StepHead n={site.buildN} title={st.build.title} sub={st.build.sub} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
          <span style={{ fontSize: 24, fontWeight: 800, color: CREAM }}>{st.build.rankLabel}</span>
          {ranks.map((r, i) => (
            <span
              key={i}
              style={{
                minWidth: 62,
                padding: "0 18px",
                height: 58,
                borderRadius: 13,
                display: "grid",
                placeItems: "center",
                border: i === site.rankSel ? "3px solid " + GOLD : "1px solid rgba(255,214,122,.3)",
                background: "#131007",
                fontFamily: FN,
                fontWeight: 900,
                fontSize: 26,
                color: r.c,
              }}
            >
              {r.l}
            </span>
          ))}
        </div>
        <div style={lab}>{st.build.nameLabel}</div>
        <div style={inp}>
          {nameTyped || " "}
          {p >= 0.1 && p < 0.3 && caret && <span style={{ color: GOLD }}>|</span>}
        </div>
        <div style={lab}>{st.build.detailsLabel}</div>
        <div style={{ ...inp, height: 76 }}>
          {detTyped || " "}
          {p >= 0.28 && p < 0.48 && caret && <span style={{ color: GOLD }}>|</span>}
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 24 }}>
          {btn(c1, st.build.copyPrompt, st.build.promptCopied)}
          {btn(c2, st.build.copyImages, st.build.imagesCopied)}
        </div>
      </SitePanel>
      <Cursor p={p} path={[{ p: 0.42, x: 1200, y: 700 }, { p: 0.52, x: 652, y: 900 }, { p: 0.74, x: 1268, y: 900 }]} clickAt={[0.55, 0.8]} visible={[0.4, 0.95]} />
    </Shell>
  );
}

// ── Describe your idea (custom only) ─────────────────────────────────────
function SceneDescribe({ ctx, cfg, s }: SceneProps) {
  const p = ctx.progress;
  const lt = ctx.localTime;
  const d = s.describe!;
  const t1 = M.in(p, 0.03, 0.16);
  const typed = d.topic.slice(0, Math.floor(clamp((p - 0.12) / 0.4, 0, 1) * d.topic.length));
  const typing = p >= 0.12 && p < 0.54;
  const copied = p >= 0.72;
  const flash = M.pop(p, 0.72, 0.82);
  return (
    <Shell ctx={ctx} n={cfg.ns.describe} caption={d.caption}>
      <div
        style={{
          position: "absolute",
          left: 310,
          top: 200,
          width: 1300,
          opacity: t1,
          transform: `translateY(${(1 - t1) * 30}px)`,
          background: "#151007",
          border: "1px solid rgba(255,214,122,.35)",
          borderRadius: 24,
          padding: "38px 46px 40px",
          boxShadow: "0 24px 70px rgba(0,0,0,.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 18 }}>
          <span style={{ width: 62, height: 62, borderRadius: 14, background: GRAD, color: INK, display: "grid", placeItems: "center", fontFamily: FN, fontWeight: 900, fontSize: 32, flex: "0 0 auto" }}>
            1
          </span>
          <span style={{ fontFamily: FT, fontWeight: 800, fontSize: 50, color: CREAM }}>{d.title}</span>
        </div>
        <div style={{ fontSize: 26, lineHeight: 1.5, color: DIM, marginBottom: 26 }}>{d.body}</div>
        <div style={{ fontSize: 23, fontWeight: 800, color: CREAM, marginBottom: 12 }}>{d.fieldLabel}</div>
        <div
          style={{
            height: 210,
            background: "#0f0b05",
            border: "1px solid rgba(255,214,122,.4)",
            borderRadius: 16,
            padding: "24px 30px",
            fontSize: 30,
            lineHeight: 1.5,
            color: "#d9c9a8",
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          {typed}
          {typing && Math.floor(lt * 2.5) % 2 === 0 && <span style={{ color: GOLD }}>|</span>}
        </div>
        <div
          style={{
            height: 90,
            borderRadius: 14,
            display: "grid",
            placeItems: "center",
            background: copied ? "#241b10" : GRAD,
            border: copied ? "3px solid " + GOLD : "3px solid transparent",
            color: copied ? GOLD : INK,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: "3px",
            transform: `scale(${copied ? 0.98 + 0.02 * flash : 1})`,
            boxShadow: copied ? `0 0 ${44 * flash}px rgba(255,208,90,.4)` : "none",
          }}
        >
          {copied ? d.copiedCta : d.copyCta}
        </div>
      </div>
      <Cursor p={p} path={[{ p: 0.5, x: 1240, y: 560 }, { p: 0.66, x: 962, y: 862 }]} clickAt={0.7} visible={[0.48, 0.92]} />
    </Shell>
  );
}

// ── Attach images ────────────────────────────────────────────────────────
function SceneAttach({ ctx, cfg, s }: SceneProps) {
  const p = ctx.progress;
  const ks = cfg.attachPops.map(([a, b]) => M.pop(p, a, b));
  return (
    <Shell ctx={ctx} n={cfg.ns.attach} caption={s.attachCaption}>
      <ChatWindow composer={<Composer cfg={cfg} s={s} thumbKs={ks} showLabels />}>
        <div style={{ alignSelf: "center", marginBottom: 30, fontSize: 30, color: DIM, opacity: M.in(p, 0.08, 0.22), textAlign: "center", lineHeight: 1.5 }}>
          {s.attachLine1}
          <br />
          <span style={{ fontSize: 25, color: "#8a7d6c" }}>{s.attachLine2}</span>
        </div>
      </ChatWindow>
      <Cursor p={p} path={[{ p: 0.06, x: 1350, y: 420 }, { p: 0.17, x: 292, y: 952 }]} clickAt={0.19} visible={[0.04, 0.55]} />
    </Shell>
  );
}

// ── Paste the prompt ─────────────────────────────────────────────────────
function ScenePaste({ ctx, cfg, s }: SceneProps) {
  const p = ctx.progress;
  const pasted = p >= 0.38;
  const hl = pasted ? 1 - M.in(p, 0.55, 0.75) : 0;
  const key = M.pop(p, 0.3, 0.4);
  const keyOp = Math.min(1, key) * (1 - M.in(p, 0.52, 0.62));
  return (
    <Shell ctx={ctx} n={cfg.ns.paste} caption={s.pasteCaption}>
      <ChatWindow composer={<Composer cfg={cfg} s={s} thumbKs={cfg.thumbs.map(() => 1)} text={pasted ? s.prompt : null} hl={hl} />} />
      {keyOp > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: 760,
            top: 790,
            opacity: keyOp,
            transform: `scale(${key})`,
            background: "#2b2b2b",
            border: "1px solid rgba(255,255,255,.25)",
            borderBottom: "4px solid rgba(255,255,255,.35)",
            borderRadius: 12,
            padding: "12px 24px",
            fontSize: 27,
            fontWeight: 800,
            color: "#ececec",
            zIndex: 30,
          }}
        >
          ⌘ V
        </div>
      )}
      <Cursor p={p} path={[{ p: 0.08, x: 1300, y: 500 }, { p: 0.26, x: 720, y: 900 }]} clickAt={0.28} visible={[0.06, 0.5]} />
    </Shell>
  );
}

// ── Hit send ─────────────────────────────────────────────────────────────
function SceneSend({ ctx, cfg, s }: SceneProps) {
  const p = ctx.progress;
  const sent = p >= 0.48;
  const bub = M.in(p, 0.5, 0.68);
  const press = p >= 0.44 && p <= 0.5 ? 0.82 : 1;
  return (
    <Shell ctx={ctx} n={cfg.ns.send} caption={s.hitSend}>
      <ChatWindow
        composer={
          <Composer
            cfg={cfg}
            s={s}
            thumbKs={sent ? [] : cfg.thumbs.map(() => 1)}
            text={sent ? null : s.prompt}
            press={press}
            ghost={sent ? s.messageSent : s.messageGhost}
          />
        }
      >
        {sent && <UserBubble cfg={cfg} s={s} t={bub} />}
      </ChatWindow>
      <Cursor p={p} path={[{ p: 0.1, x: 900, y: 640 }, { p: 0.4, x: 1610, y: 900 }]} clickAt={0.46} visible={[0.08, 0.78]} />
    </Shell>
  );
}

// ── Generating ───────────────────────────────────────────────────────────
function GenRow({ label, lt, done }: { label: string; lt?: number; done?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, flex: "0 0 auto" }}>
      <span style={{ width: 56, height: 56, borderRadius: "50%", background: GRAD, display: "grid", placeItems: "center", fontFamily: FN, fontWeight: 900, fontSize: 28, color: INK, flex: "0 0 auto" }}>
        ✦
      </span>
      <span style={{ fontSize: 27, color: "#ececec" }}>{label}</span>
      {!done &&
        [0, 1, 2].map((i) => (
          <span key={i} style={{ width: 13, height: 13, borderRadius: "50%", background: GOLD, opacity: 0.25 + 0.75 * (0.5 + 0.5 * Math.sin((lt ?? 0) * 5 - i * 0.9)) }} />
        ))}
    </div>
  );
}

function SceneGen({ ctx, cfg, s }: SceneProps) {
  const p = ctx.progress;
  const lt = ctx.localTime;
  const t1 = M.in(p, 0.08, 0.22);
  const t2 = M.pop(p, 0.24, 0.44);
  const shift = -(((lt * 0.55) % 1) * 300 - 100);
  return (
    <Shell ctx={ctx} caption={s.working}>
      <ChatWindow composer={<Composer cfg={cfg} s={s} />}>
        <UserBubble cfg={cfg} s={s} compact />
        <div style={{ opacity: t1 }}>
          <GenRow label={s.generating} lt={lt} />
        </div>
        <div
          style={{
            width: 360,
            height: 360,
            flex: "0 0 auto",
            marginLeft: 74,
            borderRadius: 18,
            opacity: Math.min(1, t2 * 2),
            transform: `scale(${0.7 + 0.3 * t2})`,
            transformOrigin: "left bottom",
            border: "1px solid rgba(255,255,255,.12)",
            background: "linear-gradient(110deg,#232323 35%,#3a352b 50%,#232323 65%)",
            backgroundSize: "300% 100%",
            backgroundPosition: `${shift}% 0`,
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" opacity=".4">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="#c9bfb1" strokeWidth="1.6" />
            <circle cx="9" cy="9" r="2" stroke="#c9bfb1" strokeWidth="1.6" />
            <path d="M3 17l5-5 4 4 3-3 6 6" stroke="#c9bfb1" strokeWidth="1.6" />
          </svg>
        </div>
        <div style={{ marginLeft: 74, fontSize: 24, color: "#8a8a8a", opacity: M.in(p, 0.5, 0.64), flex: "0 0 auto" }}>{s.takes}</div>
      </ChatWindow>
    </Shell>
  );
}

// ── Reveal ───────────────────────────────────────────────────────────────
function SceneReveal({ ctx, cfg, s }: SceneProps) {
  const p = ctx.progress;
  const t1 = M.pop(p, 0.04, 0.26);
  const mv = M.mid(p, 0.42, 0.66);
  const x = 324 + (628 - 324) * mv;
  const y = 482 + (128 - 482) * mv;
  const w = 360 + (664 - 360) * mv;
  const t2 = M.in(p, 0.66, 0.8);
  const zoom = 1 + 0.04 * M.mid(p, 0.3, 0.95);
  return (
    <Shell ctx={ctx}>
      <ChatWindow dim={mv} composer={<Composer cfg={cfg} s={s} />}>
        <UserBubble cfg={cfg} s={s} compact />
        <div style={{ opacity: 1 }}>
          <GenRow label={s.done} done />
        </div>
        <div style={{ width: 360, height: 360, flex: "0 0 auto", marginLeft: 74 }} />
      </ChatWindow>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: w,
          height: w,
          borderRadius: 20 + 12 * mv,
          overflow: "hidden",
          opacity: Math.min(1, t1 * 2),
          transform: `scale(${0.7 + 0.3 * t1})`,
          transformOrigin: "left bottom",
          border: mv > 0.3 ? "4px solid " + GOLD : "1px solid rgba(255,255,255,.16)",
          boxShadow: `0 0 ${110 * mv}px rgba(255,208,90,${0.45 * mv}), 0 24px 70px rgba(0,0,0,.55)`,
        }}
      >
        <Img src={cfg.out} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: `scale(${zoom})` }} />
      </div>
      <div style={{ position: "absolute", top: 838, left: 0, right: 0, textAlign: "center", opacity: t2, transform: `translateY(${(1 - t2) * 24}px)` }}>
        <div style={{ fontFamily: FT, fontWeight: 800, fontSize: 74, letterSpacing: "1px" }}>{s.tagline}</div>
      </div>
    </Shell>
  );
}

const CHAT_SCENES = [SceneAttach, ScenePaste, SceneSend, SceneGen, SceneReveal];
const SCENE_COMPONENTS: Record<AnimVariant, ((props: SceneProps) => ReactNode)[]> = {
  hero: [SceneTemplates, SceneStyles, SceneUpload, SceneBuild, ...CHAT_SCENES],
  unique: [SceneTemplates, SceneStyles, SceneBuild, ...CHAT_SCENES],
  custom: [SceneDescribe, ...CHAT_SCENES],
};

function Stage({ variant }: { variant: AnimVariant }) {
  const cfg = CONFIGS[variant];
  const s = useAnimStrings(variant);
  const components = SCENE_COMPONENTS[variant];
  const total = cfg.scenes.reduce((sum, d) => sum + d, 0);
  // Static frame for prefers-reduced-motion: Reveal scene at 85% (card revealed, tagline visible).
  const reducedTime = total - cfg.scenes[cfg.scenes.length - 1] * 0.15;

  const wrapRef = useRef<HTMLDivElement>(null);
  const accRef = useRef(0);
  const [time, setTime] = useState(0);
  const [scale, setScale] = useState(0);
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / STAGE_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const assets = [...cfg.thumbs, cfg.out, ...(cfg.site ? [...SITE_TPLS, ...SITE_STYLES.map((c) => c.src)] : [])];
    for (const src of new Set(assets)) {
      const img = new Image();
      img.src = src;
      img.decode().catch(() => {});
    }
  }, [cfg]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last: number | null = null;
    const tick = (ts: number) => {
      if (last != null) {
        accRef.current += (ts - last) / 1000;
        // Plays PLAY_COUNT times, then holds on the final frame.
        if (accRef.current >= PLAY_COUNT * total) {
          setTime(total);
          return;
        }
        setTime(accRef.current % total);
      }
      last = ts;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, total]);

  const ctx = sceneAt(cfg.scenes, reduced ? reducedTime : time);
  const Scene = components[ctx.index];

  return (
    <div ref={wrapRef} className="relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
      <div
        aria-hidden="true"
        dir="ltr"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <Scene ctx={ctx} cfg={cfg} s={s} />
      </div>
    </div>
  );
}

export function HowItWorksModal({
  variant,
  labelledBy,
  onClose,
  children,
}: {
  variant: AnimVariant;
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const t = useTranslations("Wizard.shared");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} className="fixed inset-0 z-40 grid place-items-center bg-black/75 p-[18px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-full w-full max-w-[1060px] gap-4 overflow-y-auto rounded-2xl border border-line bg-surface p-4 sm:p-5 md:grid-cols-[280px_1fr] md:items-center"
      >
        <div className="order-2 grid content-start gap-2.5 md:order-1">{children}</div>
        <div className="order-1 self-start overflow-hidden rounded-xl border border-white/15 bg-[#0b0907] md:order-2 md:self-center">
          <Stage variant={variant} />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-lg border border-line bg-raised text-sm text-gold"
        >
          &#10005;
        </button>
      </div>
    </div>
  );
}
