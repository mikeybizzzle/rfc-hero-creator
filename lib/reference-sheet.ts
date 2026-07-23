"use client";

// Panel labels are painted in English on purpose: they are read by the image
// model, not the visitor, and the prompt references them verbatim.
export type SheetPanel = { url: string; label: string };

const PANEL_HEIGHT = 1024;
const LABEL_HEIGHT = 72;
const GAP = 24;
const PAD = 24;

export async function buildReferenceSheet(panels: SheetPanel[]): Promise<Blob> {
  const bitmaps = await Promise.all(
    panels.map(async (panel) => {
      const response = await fetch(panel.url);
      if (!response.ok) throw new Error(String(response.status));
      return createImageBitmap(await response.blob());
    })
  );

  const widths = bitmaps.map((b) =>
    Math.round((b.width / b.height) * PANEL_HEIGHT)
  );
  const width =
    PAD * 2 + GAP * (bitmaps.length - 1) + widths.reduce((a, b) => a + b, 0);
  const height = PAD * 2 + LABEL_HEIGHT + PANEL_HEIGHT;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#101010";
  ctx.fillRect(0, 0, width, height);
  ctx.textBaseline = "middle";

  let x = PAD;
  bitmaps.forEach((bitmap, i) => {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px system-ui, sans-serif";
    ctx.fillText(panels[i].label, x, PAD + LABEL_HEIGHT / 2);
    ctx.drawImage(bitmap, x, PAD + LABEL_HEIGHT, widths[i], PANEL_HEIGHT);
    bitmap.close();
    x += widths[i] + GAP;
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Sheet render failed")),
      "image/png"
    );
  });
}
