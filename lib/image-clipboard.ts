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

export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      const copied = await Promise.race([
        navigator.clipboard.writeText(text).then(() => true),
        new Promise<boolean>((resolve) =>
          window.setTimeout(() => resolve(false), 2500)
        ),
      ]);
      if (copied) return true;
    } catch {
      // Continue to the legacy selection fallback.
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.readOnly = true;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}
