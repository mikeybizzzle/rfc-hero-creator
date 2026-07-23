"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PRELOAD_ASSETS, SCENES, STAGE_H, STAGE_W, TOTAL_DUR, sceneAt } from "./engine";
import { SCENE_COMPONENTS } from "./scenes";

// Static frame for prefers-reduced-motion: Reveal scene at 85% (card visible, tray full).
const REDUCED_TIME =
  SCENES.slice(0, -1).reduce((sum, s) => sum + s.dur, 0) + SCENES[SCENES.length - 1].dur * 0.85;

export function HowItWorks() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const accRef = useRef(0);
  const [time, setTime] = useState(0);
  const [scale, setScale] = useState(0);
  const [inView, setInView] = useState(false);
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
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    for (const src of PRELOAD_ASSETS) {
      const img = new Image();
      img.src = src;
      img.decode().catch(() => {});
    }
  }, []);

  const playing = inView && !reduced;
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last: number | null = null;
    const tick = (ts: number) => {
      if (last != null) {
        accRef.current = (accRef.current + (ts - last) / 1000) % TOTAL_DUR;
        setTime(accRef.current);
      }
      last = ts;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const ctx = sceneAt(reduced ? REDUCED_TIME : time);
  const Scene = SCENE_COMPONENTS[ctx.index];

  return (
    <div ref={wrapRef} className="card-frame relative overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
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
        <Scene {...ctx} />
      </div>
    </div>
  );
}
