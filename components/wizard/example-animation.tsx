"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Easing, clamp, interpolate, type SceneCtx } from "@/components/how-it-works/engine";

const STAGE_W = 1920;
const STAGE_H = 1080;

const SCENES = [
  { name: "Attach images", dur: 4 },
  { name: "Paste the prompt", dur: 4 },
  { name: "Hit send", dur: 3.5 },
  { name: "Generating", dur: 3.5 },
  { name: "Reveal", dur: 5 },
];
const TOTAL_DUR = SCENES.reduce((sum, s) => sum + s.dur, 0);
const PLAY_COUNT = 2;

// Static frame for prefers-reduced-motion: Reveal scene at 85% (card revealed, tagline visible).
const REDUCED_TIME =
  SCENES.slice(0, -1).reduce((sum, s) => sum + s.dur, 0) + SCENES[SCENES.length - 1].dur * 0.85;

function sceneAt(time: number): SceneCtx {
  let t = time;
  let index = 0;
  while (index < SCENES.length - 1 && t >= SCENES[index].dur) {
    t -= SCENES[index].dur;
    index++;
  }
  return { index, localTime: t, progress: clamp(t / SCENES[index].dur, 0, 1) };
}

export type ChatAnimConfig = {
  thumbs: [string, string, string];
  out: string;
  labels: [string, string, string];
  prompt: ReactNode;
  attachLine: string;
  pasteCaption: string;
  doneLabel: string;
  taglineLead: string;
};

const NOTE = { color: "#9b9b9b" };

export const HERO_EXAMPLE: ChatAnimConfig = {
  thumbs: [
    "/images/chats/chat1/message-1-provided-images/provided-image-1.webp",
    "/images/chats/chat1/message-1-provided-images/provided-image-2.webp",
    "/images/chats/chat1/message-1-provided-images/provided-image-3.webp",
  ],
  out: "/images/chats/chat1/image-outputs/message-1-image-output.webp",
  labels: ["Base card", "Style", "Your photo"],
  prompt: (
    <>
      Use the 3 attached images as references: Image 1 = the base card, Image 2 = the style,
      Image 3 = the person to transform… <span style={NOTE}>(your prompt)</span>
    </>
  ),
  attachLine: "Base card · Style example · Your photo",
  pasteCaption: "Paste in the prompt",
  doneLabel: "Here's your hero card ✓",
  taglineLead: "Your hero card —",
};

export const UNIQUE_EXAMPLE: ChatAnimConfig = {
  thumbs: [
    "/images/chats/chat3/message-1-provided-images/provided-image-1.webp",
    "/images/chats/chat3/message-1-provided-images/provided-image-2.webp",
    "/images/chats/chat3/message-1-provided-images/provided-image-3.webp",
  ],
  out: "/images/chats/chat3/image-outputs/message-1-image-output.webp",
  labels: ["Base card", "Style 1", "Style 2"],
  prompt: (
    <>
      Use the attached images as references: Image 1 = the base card, Images 2–3 = hero style
      examples. Invent a new hero from my description… <span style={NOTE}>(your prompt)</span>
    </>
  ),
  attachLine: "Base card · Two hero style examples",
  pasteCaption: "Paste in your description",
  doneLabel: "Here's your invented hero ✓",
  taglineLead: "Your invented hero —",
};

const FT = "var(--font-display)";
const FB = "var(--font-sans)";
const FN = "var(--font-saira)";
const GRAD = "linear-gradient(135deg,#ffd05a,#f26a20)";
const GOLD = "#ffd05a";
const CREAM = "#f7f1e8";
const DIM = "#b9ad9f";
const INK = "#1a1108";

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
  path: { p: number; x: number; y: number }[];
  clickAt?: number;
  visible: [number, number];
}) {
  const ps = path.map((w) => w.p);
  const x = interpolate(ps, path.map((w) => w.x), Easing.easeInOutCubic)(p);
  const y = interpolate(ps, path.map((w) => w.y), Easing.easeInOutCubic)(p);
  const op = M.in(p, visible[0], visible[0] + 0.06) * (1 - M.in(p, visible[1] - 0.06, visible[1]));
  const ring = clickAt != null ? clamp((p - clickAt) / 0.1, 0, 1) : 0;
  const press = clickAt != null && p >= clickAt - 0.02 && p <= clickAt + 0.04 ? 0.8 : 1;
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
  thumbKs = [],
  showLabels,
  text,
  hl = 0,
  press = 1,
  ghost = "Message ChatGPT",
}: {
  cfg: ChatAnimConfig;
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
                {showLabels && <span style={{ fontSize: 20, fontWeight: 800, color: GOLD, whiteSpace: "nowrap" }}>{cfg.labels[i]}</span>}
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
            {text || ghost}
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

function UserBubble({ cfg, t = 1, compact }: { cfg: ChatAnimConfig; t?: number; compact?: boolean }) {
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
          {cfg.thumbs.map((s, i) => (
            <Img key={i} src={s} style={{ width: 112, height: 112, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,.16)" }} />
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        {compact &&
          cfg.thumbs.map((s, i) => (
            <Img key={i} src={s} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 9, border: "1px solid rgba(255,255,255,.16)", flex: "0 0 auto" }} />
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
          {cfg.prompt}
        </div>
      </div>
    </div>
  );
}

// ── Scene 0: Attach images ───────────────────────────────────────────────
function SceneAttach({ ctx, cfg }: { ctx: SceneCtx; cfg: ChatAnimConfig }) {
  const p = ctx.progress;
  const ks = [M.pop(p, 0.2, 0.36), M.pop(p, 0.36, 0.52), M.pop(p, 0.52, 0.68)];
  return (
    <Shell ctx={ctx} n={1} caption="Attach your 3 images">
      <ChatWindow composer={<Composer cfg={cfg} thumbKs={ks} showLabels />}>
        <div style={{ alignSelf: "center", marginBottom: 30, fontSize: 30, color: DIM, opacity: M.in(p, 0.08, 0.22), textAlign: "center", lineHeight: 1.5 }}>
          {cfg.attachLine}
          <br />
          <span style={{ fontSize: 25, color: "#8a7d6c" }}>— the three images you copied from this page</span>
        </div>
      </ChatWindow>
      <Cursor p={p} path={[{ p: 0.06, x: 1350, y: 420 }, { p: 0.17, x: 292, y: 952 }]} clickAt={0.19} visible={[0.04, 0.55]} />
    </Shell>
  );
}

// ── Scene 1: Paste the prompt ────────────────────────────────────────────
function ScenePaste({ ctx, cfg }: { ctx: SceneCtx; cfg: ChatAnimConfig }) {
  const p = ctx.progress;
  const pasted = p >= 0.38;
  const hl = pasted ? 1 - M.in(p, 0.55, 0.75) : 0;
  const key = M.pop(p, 0.3, 0.4);
  const keyOp = Math.min(1, key) * (1 - M.in(p, 0.52, 0.62));
  return (
    <Shell ctx={ctx} n={2} caption={cfg.pasteCaption}>
      <ChatWindow composer={<Composer cfg={cfg} thumbKs={[1, 1, 1]} text={pasted ? cfg.prompt : null} hl={hl} />} />
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

// ── Scene 2: Hit send ────────────────────────────────────────────────────
function SceneSend({ ctx, cfg }: { ctx: SceneCtx; cfg: ChatAnimConfig }) {
  const p = ctx.progress;
  const sent = p >= 0.48;
  const bub = M.in(p, 0.5, 0.68);
  const press = p >= 0.44 && p <= 0.5 ? 0.82 : 1;
  return (
    <Shell ctx={ctx} n={3} caption="Hit SEND">
      <ChatWindow
        composer={<Composer cfg={cfg} thumbKs={sent ? [] : [1, 1, 1]} text={sent ? null : cfg.prompt} press={press} ghost={sent ? "Message sent" : "Message ChatGPT"} />}
      >
        {sent && <UserBubble cfg={cfg} t={bub} />}
      </ChatWindow>
      <Cursor p={p} path={[{ p: 0.1, x: 900, y: 640 }, { p: 0.4, x: 1610, y: 900 }]} clickAt={0.46} visible={[0.08, 0.78]} />
    </Shell>
  );
}

// ── Scene 3: Generating ──────────────────────────────────────────────────
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

function SceneGen({ ctx, cfg }: { ctx: SceneCtx; cfg: ChatAnimConfig }) {
  const p = ctx.progress;
  const lt = ctx.localTime;
  const t1 = M.in(p, 0.08, 0.22);
  const t2 = M.pop(p, 0.24, 0.44);
  const shift = -(((lt * 0.55) % 1) * 300 - 100);
  return (
    <Shell ctx={ctx} caption="ChatGPT gets to work…">
      <ChatWindow composer={<Composer cfg={cfg} ghost="Message ChatGPT" />}>
        <UserBubble cfg={cfg} compact />
        <div style={{ opacity: t1 }}>
          <GenRow label="Generating image" lt={lt} />
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
        <div style={{ marginLeft: 74, fontSize: 24, color: "#8a8a8a", opacity: M.in(p, 0.5, 0.64), flex: "0 0 auto" }}>Takes 1–2 minutes</div>
      </ChatWindow>
    </Shell>
  );
}

// ── Scene 4: Reveal ──────────────────────────────────────────────────────
function SceneReveal({ ctx, cfg }: { ctx: SceneCtx; cfg: ChatAnimConfig }) {
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
      <ChatWindow dim={mv} composer={<Composer cfg={cfg} ghost="Message ChatGPT" />}>
        <UserBubble cfg={cfg} compact />
        <div style={{ opacity: 1 }}>
          <GenRow label={cfg.doneLabel} done />
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
        <div style={{ fontFamily: FT, fontWeight: 800, fontSize: 74, letterSpacing: "1px" }}>
          {cfg.taglineLead}{" "}
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>ready in 1–2 min</span>
        </div>
      </div>
    </Shell>
  );
}

const SCENE_COMPONENTS = [SceneAttach, ScenePaste, SceneSend, SceneGen, SceneReveal];

function Stage({ cfg }: { cfg: ChatAnimConfig }) {
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
    for (const src of [...cfg.thumbs, cfg.out]) {
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
        if (accRef.current >= PLAY_COUNT * TOTAL_DUR) {
          setTime(TOTAL_DUR);
          return;
        }
        setTime(accRef.current % TOTAL_DUR);
      }
      last = ts;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  const ctx = sceneAt(reduced ? REDUCED_TIME : time);
  const Scene = SCENE_COMPONENTS[ctx.index];

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
        <Scene ctx={ctx} cfg={cfg} />
      </div>
    </div>
  );
}

export function ExampleAnimationModal({ config, onClose }: { config: ChatAnimConfig; onClose: () => void }) {
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
        aria-label={t("exampleChatTitle")}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-[#0b0907] shadow-[0_24px_70px_rgba(0,0,0,.5)]"
        style={{ maxWidth: "min(920px, calc((100dvh - 96px) * 16 / 9))" }}
      >
        <Stage cfg={config} />
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-lg border border-white/20 bg-[#303030]/85 text-sm text-[#ececec]"
        >
          &#10005;
        </button>
      </div>
    </div>
  );
}
