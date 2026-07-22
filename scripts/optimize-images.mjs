import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";

const SOURCE = "/Users/michaelbernard/workspace/RFC-Hero-Character-Images";
const ROOT = path.resolve(import.meta.dirname, "..");
const IMAGES = path.join(ROOT, "public/images");
const DOWNLOADS = path.join(ROOT, "public/downloads");
const MAX_DISPLAY = 1200;
const THUMB = 480;

const slugify = (name) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

async function listImages(dir) {
  const entries = await fs.readdir(dir);
  return entries
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b));
}

async function toWebp(srcPath, destPath, maxDim) {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  const img = sharp(srcPath).rotate();
  const meta = await img.metadata();
  const resized =
    Math.max(meta.width, meta.height) > maxDim
      ? img.resize(maxDim, maxDim, { fit: "inside" })
      : img;
  const info = await resized.webp({ quality: 80 }).toFile(destPath);
  return { width: info.width, height: info.height };
}

async function processDir({ srcDir, outDir, downloadDir, maxDim = MAX_DISPLAY }) {
  const files = await listImages(srcDir);
  const items = [];
  for (const file of files) {
    const slug = slugify(file);
    const srcPath = path.join(srcDir, file);
    const { width, height } = await toWebp(
      srcPath,
      path.join(IMAGES, outDir, `${slug}.webp`),
      maxDim
    );
    const item = {
      slug,
      file,
      src: `/images/${outDir}/${slug}.webp`,
      width,
      height,
    };
    if (downloadDir) {
      const ext = path.extname(file).toLowerCase();
      const dest = path.join(DOWNLOADS, downloadDir, `${slug}${ext}`);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.copyFile(srcPath, dest);
      item.download = `/downloads/${downloadDir}/${slug}${ext}`;
    }
    items.push(item);
  }
  return items;
}

async function main() {
  await fs.rm(IMAGES, { recursive: true, force: true });
  await fs.rm(DOWNLOADS, { recursive: true, force: true });

  const manifest = {};

  manifest.baseTemplates = await processDir({
    srcDir: path.join(SOURCE, "image-templates/base-templates"),
    outDir: "templates",
    downloadDir: "templates",
  });

  manifest.heroRefs = await processDir({
    srcDir: path.join(SOURCE, "image-templates/heros"),
    outDir: "heroes",
    downloadDir: "heroes",
    maxDim: THUMB * 2,
  });

  manifest.gallery = await processDir({
    srcDir: path.join(SOURCE, "generated-hero-image-examples"),
    outDir: "gallery",
  });

  manifest.chats = {};
  for (const chat of ["chat1", "chat2", "chat3"]) {
    manifest.chats[chat] = {};
    const chatDir = path.join(SOURCE, chat);
    const subdirs = (await fs.readdir(chatDir, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const sub of subdirs) {
      manifest.chats[chat][sub] = await processDir({
        srcDir: path.join(chatDir, sub),
        outDir: `chats/${chat}/${sub}`,
        maxDim: 900,
      });
    }
  }

  await fs.writeFile(
    path.join(ROOT, "lib/manifest.json"),
    JSON.stringify(manifest, null, 2)
  );

  const count = (items) => items.length;
  console.log(
    `templates: ${count(manifest.baseTemplates)}, heroes: ${count(manifest.heroRefs)}, gallery: ${count(manifest.gallery)}`
  );
}

await main();
