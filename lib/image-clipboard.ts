"use client";

export type ImageTransferResult = "copied" | "downloaded" | "failed";

async function toPngBlob(blob: Blob): Promise<Blob> {
  if (blob.type === "image/png") return blob;

  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (png) => (png ? resolve(png) : reject(new Error("Image conversion failed"))),
      "image/png"
    );
  });
}

async function writeImage(url: string): Promise<boolean> {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
    return false;
  }

  try {
    const blobPromise = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.blob();
      })
      .then(toPngBlob);

    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blobPromise }),
    ]);
    return true;
  } catch {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(String(response.status));
      const png = await response.blob().then(toPngBlob);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": png }),
      ]);
      return true;
    } catch {
      return false;
    }
  }
}

function downloadImage(url: string, filename?: string): boolean {
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename ?? "";
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return true;
  } catch {
    return false;
  }
}

export async function copyImageBlobAsset(
  blob: Blob,
  filename: string
): Promise<ImageTransferResult> {
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      return "copied";
    } catch {}
  }
  const url = URL.createObjectURL(blob);
  const downloaded = downloadImage(url, filename);
  URL.revokeObjectURL(url);
  return downloaded ? "downloaded" : "failed";
}

export async function copyImageAsset(
  url: string,
  filename?: string
): Promise<ImageTransferResult> {
  const copied = await Promise.race([
    writeImage(url),
    new Promise<boolean>((resolve) =>
      window.setTimeout(() => resolve(false), 2500)
    ),
  ]);
  if (copied) return "copied";
  return downloadImage(url, filename) ? "downloaded" : "failed";
}
