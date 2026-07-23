import type { CSSProperties, ReactNode } from "react";
import { AST, Easing, clamp, interpolate, type SceneCtx } from "./engine";

const FT = "var(--font-display)";
const FB = "var(--font-sans)";
const FN = "var(--font-saira)";
const GRAD = "linear-gradient(135deg,#ffd05a,#f26a20)";
const GOLD = "#ffd05a";
const CREAM = "#f7f1e8";
const DIM = "#b9ad9f";
const INK = "#1a1108";
const PANEL = "#0f0d0b";
const LINE = "rgba(255,214,122,.22)";

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
            left: 8 - (14 + 34 * ring),
            top: 8 - (14 + 34 * ring),
            width: (14 + 34 * ring) * 2,
            height: (14 + 34 * ring) * 2,
            borderRadius: "50%",
            border: "3px solid " + GOLD,
            opacity: 1 - ring,
          }}
        />
      )}
      <svg
        width="38"
        height="44"
        viewBox="0 0 17 20"
        style={{ display: "block", transform: `scale(${press})`, transformOrigin: "15% 10%", filter: "drop-shadow(0 3px 8px rgba(0,0,0,.65))" }}
      >
        <path d="M1.5 1 L1.5 15.2 L5.2 11.9 L7.5 17.4 L10.1 16.2 L7.8 10.9 L12.6 10.5 Z" fill="#fff" stroke={INK} strokeWidth="1" />
      </svg>
    </div>
  );
}

function StepCaption({ p, n, text }: { p: number; n?: number; text: string }) {
  const t = M.in(p, 0.02, 0.16);
  return (
    <div
      style={{
        position: "absolute",
        top: 126,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        opacity: t,
        transform: `translateY(${(1 - t) * 26}px)`,
      }}
    >
      {n != null && (
        <span
          style={{
            width: 66,
            height: 66,
            borderRadius: "50%",
            background: GRAD,
            color: INK,
            display: "grid",
            placeItems: "center",
            fontFamily: FN,
            fontWeight: 900,
            fontSize: 34,
            flex: "0 0 auto",
          }}
        >
          {n}
        </span>
      )}
      <span style={{ fontFamily: FT, fontWeight: 800, fontSize: 56, letterSpacing: "1px", color: CREAM }}>{text}</span>
    </div>
  );
}

function PromptChip({ k }: { k: number }) {
  return (
    <div style={{ display: "grid", gap: 8, transform: `scale(${k})`, justifyItems: "start" }}>
      <div style={{ width: 54, height: 9, borderRadius: 5, background: GRAD }} />
      <div style={{ width: 64, height: 9, borderRadius: 5, background: "rgba(255,214,122,.55)" }} />
      <div style={{ width: 42, height: 9, borderRadius: 5, background: "rgba(255,214,122,.35)" }} />
    </div>
  );
}

// Slot i fills during scene FILL[i].sc at progress FILL[i].at; stays filled after.
const FILL = [
  { sc: 1, at: 0.72 },
  { sc: 2, at: 0.72 },
  { sc: 3, at: 0.72 },
  { sc: 4, at: 0.8 },
];
const TRAY_LABELS = ["Base card", "Style example", "Your photo", "Prompt"];
const TRAY_THUMBS: (string | null)[] = [AST.tplS, AST.stylePick, AST.photo, null];

function Tray({ index, p }: { index: number; p: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 148,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 44,
        background: "rgba(9,8,6,.78)",
        borderTop: "1px solid rgba(255,214,122,.14)",
      }}
    >
      {FILL.map((f, i) => {
        const k = index > f.sc ? 1 : index === f.sc ? Easing.easeOutBack(clamp((p - f.at) / 0.15, 0, 1)) : 0;
        const filled = k > 0.01;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 14,
                border: filled ? "2px solid " + GOLD : "2px dashed rgba(255,214,122,.32)",
                background: PANEL,
                display: "grid",
                placeItems: "center",
                overflow: "hidden",
                boxShadow: filled ? "0 0 22px rgba(255,208,90,.25)" : "none",
              }}
            >
              {filled ? (
                TRAY_THUMBS[i] ? (
                  <Img src={TRAY_THUMBS[i]} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${Math.max(k, 0.01)})` }} />
                ) : (
                  <PromptChip k={k} />
                )
              ) : (
                <span style={{ fontFamily: FN, fontWeight: 900, fontSize: 30, color: "rgba(255,214,122,.38)" }}>{i + 1}</span>
              )}
            </div>
            <div style={{ display: "grid", gap: 2 }}>
              <span style={{ fontFamily: FN, fontWeight: 900, fontSize: 15, letterSpacing: "2px", color: filled ? GOLD : "#8a7d6c" }}>0{i + 1}</span>
              <span style={{ fontFamily: FB, fontSize: 21, fontWeight: 700, color: filled ? CREAM : "#8a7d6c" }}>{TRAY_LABELS[i]}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Shell({ ctx, capN, caption, children }: { ctx: SceneCtx; capN?: number; caption?: string; children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        fontFamily: FB,
        color: CREAM,
        background:
          "radial-gradient(circle at 82% -5%, rgba(242,106,32,.20), transparent 640px), radial-gradient(circle at 12% 32%, rgba(255,208,90,.08), transparent 560px), #0b0907",
      }}
    >
      {caption && <StepCaption p={ctx.progress} n={capN} text={caption} />}
      {children}
      <Tray index={ctx.index} p={ctx.progress} />
    </div>
  );
}

// ── Scene 0: Opening ─────────────────────────────────────────────────────
function Opening(ctx: SceneCtx) {
  const p = ctx.progress;
  const t1 = M.in(p, 0.04, 0.2),
    t2 = M.in(p, 0.16, 0.32),
    t3 = M.pop(p, 0.3, 0.5),
    t4 = M.in(p, 0.5, 0.62),
    t5 = M.pop(p, 0.54, 0.76);
  const drift = 1 + 0.03 * M.mid(p, 0.6, 0.97);
  return (
    <Shell ctx={ctx}>
      <div style={{ position: "absolute", left: 130, top: 330 }}>
        <div style={{ opacity: t1, transform: `translateY(${(1 - t1) * 32}px)`, fontFamily: FT, fontWeight: 800, fontSize: 112, lineHeight: 1.04, letterSpacing: "1px" }}>
          FORGE YOUR
          <br />
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>HERO</span>
        </div>
        <div style={{ opacity: t2, transform: `translateY(${(1 - t2) * 24}px)`, marginTop: 28, fontSize: 33, color: DIM, lineHeight: 1.42 }}>
          Turn any photo into a game-ready
          <br />
          hero card — in four steps.
        </div>
      </div>
      <div style={{ position: "absolute", right: 130, top: 300, display: "flex", alignItems: "center", gap: 46 }}>
        <div style={{ display: "grid", gap: 12, justifyItems: "center", opacity: Math.min(1, t3 * 2), transform: `scale(${0.55 + 0.45 * t3})` }}>
          <div style={{ width: 250, height: 250, borderRadius: 20, overflow: "hidden", border: "2px solid rgba(255,214,122,.32)" }}>
            <Img src={AST.photo} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <span style={{ fontSize: 21, fontWeight: 800, letterSpacing: "2px", color: DIM }}>YOUR PHOTO</span>
        </div>
        <div style={{ opacity: t4, fontFamily: FT, fontWeight: 800, fontSize: 70, color: GOLD }}>→</div>
        <div style={{ display: "grid", gap: 12, justifyItems: "center", opacity: Math.min(1, t5 * 2), transform: `scale(${0.55 + 0.45 * t5})` }}>
          <div style={{ width: 400, height: 400, borderRadius: 24, overflow: "hidden", border: "2px solid " + GOLD, boxShadow: `0 0 ${70 * Math.min(1, t5)}px rgba(255,208,90,.4)` }}>
            <Img src={AST.out} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: `scale(${drift})` }} />
          </div>
          <span style={{ fontSize: 21, fontWeight: 800, letterSpacing: "2px", color: GOLD }}>YOUR HERO</span>
        </div>
      </div>
    </Shell>
  );
}

// ── Scene 1: Step 1 — Base card ──────────────────────────────────────────
function SceneBase(ctx: SceneCtx) {
  const p = ctx.progress;
  const cards = [
    { src: AST.tplS, name: "S · Gold" },
    { src: AST.tplA, name: "A · Purple" },
    { src: AST.tplB, name: "B · Blue" },
  ];
  const sel = M.in(p, 0.46, 0.52);
  const cop = M.pop(p, 0.5, 0.62);
  const copFade = 1 - M.in(p, 0.86, 0.94);
  return (
    <Shell ctx={ctx} capN={1} caption="Copy a base card">
      <div style={{ position: "absolute", top: 288, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 48 }}>
        {cards.map((c, i) => {
          const t = M.pop(p, 0.06 + i * 0.06, 0.24 + i * 0.06);
          const isS = i === 0;
          return (
            <div
              key={i}
              style={{
                opacity: Math.min(1, t * 2),
                transform: `scale(${0.72 + 0.28 * t})`,
                width: 320,
                borderRadius: 18,
                overflow: "hidden",
                background: PANEL,
                position: "relative",
                border: isS && sel > 0.5 ? "3px solid " + GOLD : "1px solid " + LINE,
                boxShadow: isS ? `0 0 ${64 * sel}px rgba(255,208,90,${0.45 * sel})` : "none",
              }}
            >
              <Img src={c.src} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "13px 0", textAlign: "center", fontWeight: 800, fontSize: 23, color: "#e8ded2" }}>{c.name}</div>
              {isS && cop > 0.01 && (
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: `rgba(9,8,6,${0.82 * Math.min(1, cop) * copFade})` }}>
                  <span style={{ fontFamily: FT, fontWeight: 800, fontSize: 46, color: "#ffe3a3", opacity: copFade, transform: `scale(${cop})` }}>Copied ✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center", fontSize: 24, color: DIM, opacity: M.in(p, 0.12, 0.26) }}>
        Pick a rank — this empty card becomes <strong style={{ color: CREAM }}>Image 1</strong>
      </div>
      <Cursor p={p} path={[{ p: 0.18, x: 1400, y: 850 }, { p: 0.44, x: 600, y: 470 }]} clickAt={0.47} visible={[0.16, 0.8]} />
    </Shell>
  );
}

// ── Scene 2: Step 2 — Style example ──────────────────────────────────────
function SceneStyle(ctx: SceneCtx) {
  const p = ctx.progress;
  const sel = M.in(p, 0.5, 0.56);
  const cop = M.pop(p, 0.54, 0.66);
  const copFade = 1 - M.in(p, 0.86, 0.94);
  return (
    <Shell ctx={ctx} capN={2} caption="Copy a style example">
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center", fontSize: 24, color: DIM, opacity: M.in(p, 0.12, 0.26) }}>
        Any finished hero works — it shows the target look as <strong style={{ color: CREAM }}>Image 2</strong>
      </div>
      <div style={{ position: "absolute", top: 316, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
        {AST.styles.map((src, i) => {
          const t = M.pop(p, 0.06 + i * 0.05, 0.22 + i * 0.05);
          const isPick = i === 2;
          return (
            <div
              key={i}
              style={{
                opacity: Math.min(1, t * 2),
                transform: `scale(${0.72 + 0.28 * t})`,
                width: 250,
                height: 250,
                borderRadius: 16,
                overflow: "hidden",
                background: PANEL,
                position: "relative",
                border: isPick && sel > 0.5 ? "3px solid " + GOLD : "1px solid " + LINE,
                boxShadow: isPick ? `0 0 ${56 * sel}px rgba(255,208,90,${0.45 * sel})` : "none",
              }}
            >
              <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {isPick && cop > 0.01 && (
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: `rgba(9,8,6,${0.82 * Math.min(1, cop) * copFade})` }}>
                  <span style={{ fontFamily: FT, fontWeight: 800, fontSize: 36, color: "#ffe3a3", opacity: copFade, transform: `scale(${cop})` }}>Copied ✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Cursor p={p} path={[{ p: 0.2, x: 1500, y: 820 }, { p: 0.48, x: 968, y: 450 }]} clickAt={0.51} visible={[0.18, 0.82]} />
    </Shell>
  );
}

// ── Scene 3: Step 3 — Your photo ─────────────────────────────────────────
function ScenePhoto(ctx: SceneCtx) {
  const p = ctx.progress;
  const t1 = M.pop(p, 0.06, 0.3);
  const kb = 1 + 0.06 * M.mid(p, 0.3, 0.95);
  const chips = ["Clear face", "Good lighting", "Any photo works"];
  return (
    <Shell ctx={ctx} capN={3} caption="Add your photo">
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center", fontSize: 24, color: DIM, opacity: M.in(p, 0.12, 0.26) }}>
        The person or character who becomes the hero — <strong style={{ color: CREAM }}>Image 3</strong>
      </div>
      <div style={{ position: "absolute", top: 320, left: 0, right: 0, display: "grid", justifyItems: "center", gap: 30 }}>
        <div style={{ opacity: Math.min(1, t1 * 2), transform: `scale(${0.7 + 0.3 * t1})`, width: 430, height: 430, borderRadius: 24, overflow: "hidden", border: "2px solid rgba(255,214,122,.35)", boxShadow: "0 24px 70px rgba(0,0,0,.5)" }}>
          <Img src={AST.photo} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: `scale(${kb})` }} />
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          {chips.map((c, i) => {
            const t = M.in(p, 0.36 + i * 0.08, 0.48 + i * 0.08);
            return (
              <span
                key={i}
                style={{ opacity: t, transform: `translateY(${(1 - t) * 20}px)`, background: PANEL, border: "1px solid " + LINE, borderRadius: 999, padding: "12px 26px", fontSize: 22, fontWeight: 700, color: "#e8ded2" }}
              >
                ✓ {c}
              </span>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

// ── Scene 4: Step 4 — Copy the prompt ────────────────────────────────────
const PROMPT_LINES = [
  "Use the 3 attached images as references:",
  "Image 1 = the base hero-card background, no character.",
  "Image 2 = the example hero showing the target style.",
  "Image 3 = the person to transform into the hero.",
  "Keep the golden S-rank card layout and UI…",
  "Hero character name: “Aušrytė”",
];
function ScenePrompt(ctx: SceneCtx) {
  const p = ctx.progress;
  const t1 = M.in(p, 0.04, 0.18);
  const copied = p >= 0.62;
  const flash = M.pop(p, 0.62, 0.72);
  return (
    <Shell ctx={ctx} capN={4} caption="Copy the ready-made prompt">
      <div
        style={{
          position: "absolute",
          top: 262,
          left: 490,
          width: 940,
          opacity: t1,
          transform: `translateY(${(1 - t1) * 30}px)`,
          background: "#18130e",
          border: "1px solid rgba(255,214,122,.3)",
          borderRadius: 20,
          padding: "30px 36px 28px",
          boxShadow: "0 24px 70px rgba(0,0,0,.5)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontFamily: FT, fontWeight: 800, fontSize: 26, color: GOLD, letterSpacing: ".5px" }}>Your prompt</span>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "2px", color: DIM, border: "1px solid " + LINE, borderRadius: 999, padding: "6px 14px" }}>BUILT FOR YOU</span>
        </div>
        <div style={{ display: "grid", gap: 13, marginBottom: 26 }}>
          {PROMPT_LINES.map((l, i) => {
            const t = M.in(p, 0.12 + i * 0.055, 0.2 + i * 0.055);
            return (
              <div key={i} style={{ opacity: t, transform: `translateX(${(1 - t) * -18}px)`, fontFamily: "ui-monospace,Menlo,Consolas,monospace", fontSize: 20, lineHeight: 1.4, color: i === 0 ? CREAM : "#c9bfb1" }}>
                {l}
              </div>
            );
          })}
        </div>
        <div style={{ display: "grid", placeItems: "center" }}>
          <div
            style={{
              width: 440,
              textAlign: "center",
              background: copied ? "#241b10" : GRAD,
              color: copied ? GOLD : INK,
              border: copied ? "2px solid " + GOLD : "2px solid transparent",
              borderRadius: 14,
              padding: "17px 0",
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: ".5px",
              transform: `scale(${copied ? 0.96 + 0.04 * flash : 1})`,
              boxShadow: copied ? `0 0 ${40 * flash}px rgba(255,208,90,.4)` : "none",
            }}
          >
            {copied ? "Copied ✓" : "Copy prompt"}
          </div>
        </div>
      </div>
      <Cursor p={p} path={[{ p: 0.26, x: 1460, y: 380 }, { p: 0.56, x: 985, y: 655 }]} clickAt={0.6} visible={[0.24, 0.88]} />
    </Shell>
  );
}

// ── Scene 5: Send to AI ──────────────────────────────────────────────────
function SceneSend(ctx: SceneCtx) {
  const p = ctx.progress;
  const t1 = M.in(p, 0.04, 0.18);
  const sent = p >= 0.58;
  const bub = M.in(p, 0.6, 0.74);
  const rep = M.pop(p, 0.78, 0.9);
  const thumbs = [AST.tplS, AST.stylePick, AST.photo];
  return (
    <Shell ctx={ctx} caption="Paste it all into your AI chat">
      <div
        style={{
          position: "absolute",
          top: 262,
          left: 440,
          width: 1040,
          height: 600,
          opacity: t1,
          transform: `translateY(${(1 - t1) * 30}px)`,
          background: "#1b1b1b",
          border: "1px solid rgba(255,255,255,.14)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 24px 70px rgba(0,0,0,.5)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <span key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
          ))}
          <span style={{ marginLeft: 12, fontSize: 19, fontWeight: 700, color: "#9b9b9b" }}>Your AI image chat</span>
        </div>
        <div style={{ flex: 1, padding: "22px 26px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 16 }}>
          {sent && (
            <div style={{ alignSelf: "flex-end", display: "grid", gap: 10, justifyItems: "end", opacity: bub, transform: `translateY(${(1 - bub) * 26}px)` }}>
              <div style={{ display: "flex", gap: 8 }}>
                {thumbs.map((s, i) => (
                  <Img key={i} src={s} style={{ width: 74, height: 74, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(255,255,255,.16)" }} />
                ))}
              </div>
              <div style={{ background: "#303030", borderRadius: "16px 16px 4px 16px", padding: "13px 18px", color: "#ececec", fontSize: 20, lineHeight: 1.45, maxWidth: 560 }}>
                Use the 3 attached images as references: Image 1 = the base card… <span style={{ color: "#9b9b9b" }}>(your copied prompt)</span>
              </div>
            </div>
          )}
          {rep > 0.01 && (
            <div
              style={{
                alignSelf: "flex-start",
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "#262626",
                borderRadius: "16px 16px 16px 4px",
                padding: "15px 20px",
                opacity: Math.min(1, rep),
                transform: `scale(${0.85 + 0.15 * rep})`,
                transformOrigin: "left bottom",
              }}
            >
              <span style={{ fontSize: 20, color: "#ececec" }}>Forging your hero</span>
              {[0.35, 0.6, 1].map((o, i) => (
                <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: GOLD, opacity: o }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 22px 22px", background: "#111", border: "1px solid rgba(255,255,255,.14)", borderRadius: 16, padding: "13px 16px" }}>
          {!sent &&
            thumbs.map((s, i) => {
              const t = M.pop(p, 0.16 + i * 0.06, 0.3 + i * 0.06);
              return (
                <Img key={i} src={s} style={{ width: 62, height: 62, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(255,255,255,.2)", opacity: Math.min(1, t * 2), transform: `scale(${0.6 + 0.4 * t})` }} />
              );
            })}
          <span style={{ flex: 1, fontSize: 20, color: sent ? "#5c5c5c" : "#9b9b9b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {sent ? "Message sent" : "Use the 3 attached images as references: Image 1 = …"}
          </span>
          <span style={{ width: 58, height: 58, borderRadius: "50%", background: GRAD, display: "grid", placeItems: "center", flex: "0 0 auto", transform: `scale(${p >= 0.53 && p <= 0.58 ? 0.85 : 1})` }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 20V5M12 5l-6 6M12 5l6 6" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
      <Cursor p={p} path={[{ p: 0.22, x: 700, y: 940 }, { p: 0.5, x: 1408, y: 792 }]} clickAt={0.54} visible={[0.2, 0.84]} />
    </Shell>
  );
}

// ── Scene 6: Reveal ──────────────────────────────────────────────────────
const SPARKS = [
  { x: 560, y: 330, s: 14, a: 0.26 },
  { x: 1360, y: 300, s: 18, a: 0.3 },
  { x: 1430, y: 640, s: 12, a: 0.34 },
  { x: 500, y: 620, s: 16, a: 0.38 },
  { x: 700, y: 210, s: 10, a: 0.42 },
  { x: 1240, y: 820, s: 14, a: 0.46 },
  { x: 640, y: 800, s: 10, a: 0.5 },
  { x: 1300, y: 180, s: 12, a: 0.54 },
];
function SceneReveal(ctx: SceneCtx) {
  const p = ctx.progress;
  const glow = M.in(p, 0.05, 0.3);
  const t1 = M.pop(p, 0.06, 0.34);
  const zoom = 1 + 0.05 * M.mid(p, 0.36, 0.95);
  const t2 = M.in(p, 0.4, 0.56);
  return (
    <Shell ctx={ctx}>
      <div
        style={{
          position: "absolute",
          left: 960 - 520,
          top: 520 - 470,
          width: 1040,
          height: 940,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,208,90,.32), rgba(242,106,32,.12) 45%, transparent 70%)",
          opacity: glow,
          filter: "blur(6px)",
        }}
      />
      {SPARKS.map((s, i) => {
        const t = M.pop(p, s.a, s.a + 0.18);
        const fade = 1 - M.in(p, 0.72, 0.9);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y - 40 * M.mid(p, s.a, 0.9),
              width: s.s,
              height: s.s,
              borderRadius: "50%",
              background: i % 2 ? GOLD : "#f26a20",
              opacity: Math.min(1, t) * fade,
              transform: `scale(${t})`,
            }}
          />
        );
      })}
      <div style={{ position: "absolute", left: 960 - 280, top: 190, width: 560, opacity: Math.min(1, t1 * 2), transform: `scale(${0.6 + 0.4 * t1})` }}>
        <div style={{ width: 560, height: 560, borderRadius: 28, overflow: "hidden", border: "3px solid " + GOLD, boxShadow: "0 0 90px rgba(255,208,90,.45), 0 30px 80px rgba(0,0,0,.6)" }}>
          <Img src={AST.out} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: `scale(${zoom})` }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 796, left: 0, right: 0, textAlign: "center", opacity: t2, transform: `translateY(${(1 - t2) * 24}px)` }}>
        <div style={{ fontFamily: FT, fontWeight: 800, fontSize: 64, letterSpacing: "1px" }}>
          Your hero. <span style={{ background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Forged.</span>
        </div>
      </div>
    </Shell>
  );
}

// Indexed to match SCENES in engine.ts.
export const SCENE_COMPONENTS = [Opening, SceneBase, SceneStyle, ScenePhoto, ScenePrompt, SceneSend, SceneReveal];
