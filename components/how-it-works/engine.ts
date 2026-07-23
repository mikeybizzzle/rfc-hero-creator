export const STAGE_W = 1920;
export const STAGE_H = 1080;

export const SCENES = [
  { name: "Opening", dur: 4 },
  { name: "Step 1 - Base card", dur: 5 },
  { name: "Step 2 - Style example", dur: 5 },
  { name: "Step 3 - Your photo", dur: 4.5 },
  { name: "Step 4 - Copy the prompt", dur: 5 },
  { name: "Send to AI", dur: 4.5 },
  { name: "Reveal", dur: 5 },
];

export const TOTAL_DUR = SCENES.reduce((sum, s) => sum + s.dur, 0);

export type SceneCtx = {
  progress: number;
  localTime: number;
  index: number;
};

export function sceneAt(time: number): SceneCtx {
  let t = time;
  let index = 0;
  while (index < SCENES.length - 1 && t >= SCENES[index].dur) {
    t -= SCENES[index].dur;
    index++;
  }
  return { index, localTime: t, progress: clamp(t / SCENES[index].dur, 0, 1) };
}

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const Easing = {
  linear: (t: number) => t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutBack: (t: number) => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

export function interpolate(
  input: number[],
  output: number[],
  ease: (t: number) => number = Easing.linear
) {
  return (t: number) => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        return output[i] + (output[i + 1] - output[i]) * ease(local);
      }
    }
    return output[output.length - 1];
  };
}

export const AST = {
  tplS: "/images/templates/s-orange-template.webp",
  tplA: "/images/templates/a-purple-template.webp",
  tplB: "/images/templates/b-blue-template.webp",
  styles: [
    "/images/heroes/s-nyx.webp",
    "/images/heroes/s-scarlett.webp",
    "/images/chats/chat1/message-1-provided-images/provided-image-2.webp",
    "/images/heroes/s-sakura.webp",
    "/images/heroes/s-evelyn.webp",
  ],
  stylePick: "/images/chats/chat1/message-1-provided-images/provided-image-2.webp",
  photo: "/images/chats/chat1/message-1-provided-images/provided-image-3.webp",
  out: "/images/chats/chat1/image-outputs/message-1-image-output.webp",
};

export const PRELOAD_ASSETS = [
  ...new Set([AST.tplS, AST.tplA, AST.tplB, ...AST.styles, AST.photo, AST.out]),
];
