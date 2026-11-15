/**
 * Creates branded placeholder images for every image path referenced by the seed content,
 * plus public/logo.png — ONLY for files that don't exist yet. Drop your real images in with the
 * same file names to replace them. Run: npm run placeholders
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { servicesSeed } from "../src/data/services";
import { productsSeed } from "../src/data/products";
import { projectsSeed } from "../src/data/projects";
import { postsSeed } from "../src/data/posts";

const PUBLIC = path.join(process.cwd(), "public");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text: string, max = 28) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) {
      lines.push(line.trim());
      line = w;
    } else line += " " + w;
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 3);
}

function coverSvg(title: string, label: string, w = 1600, h = 900) {
  const lines = wrap(title);
  const size = lines.length > 2 ? 64 : 76;
  const startY = h / 2 - ((lines.length - 1) * size * 1.15) / 2 + 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#2541F5" stroke-opacity="0.07"/></pattern>
  </defs>
  <rect width="100%" height="100%" fill="#F5F7FB"/><rect width="100%" height="100%" fill="url(#grid)"/>
  <circle cx="${w - 140}" cy="140" r="210" fill="#FFC914"/>
  <circle cx="120" cy="${h - 60}" r="160" fill="none" stroke="#2541F5" stroke-opacity="0.12" stroke-width="36"/>
  <text x="${w / 2}" y="150" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="22" letter-spacing="6" fill="#2541F5">${esc(label.toUpperCase())}</text>
  ${lines.map((l, i) => `<text x="${w / 2}" y="${startY + i * size * 1.15}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${size}" fill="#0B0B0F">${esc(l)}</text>`).join("")}
  <text x="${w / 2 - 14}" y="${h - 80}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="44" letter-spacing="-1" fill="#0B0B0F">Zylo</text>
  <circle cx="${w / 2 + 50}" cy="${h - 86}" r="7" fill="#FFC914"/>
</svg>`;
}

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#ffffff"/>
  <text x="256" y="270" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="150" letter-spacing="10" fill="#2B2BD9">ZYLO</text>
  <text x="262" y="340" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="44" letter-spacing="22" fill="#000000">SOLUTION</text>
</svg>`;

async function write(rel: string, svg: string) {
  const out = path.join(PUBLIC, rel);
  if (fs.existsSync(out)) return false;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const img = sharp(Buffer.from(svg));
  if (out.endsWith(".png")) await img.png().toFile(out);
  else await img.jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  return true;
}

async function main() {
  const jobs: [string, string, string][] = [];
  for (const s of servicesSeed) s.coverImage && jobs.push([s.coverImage, s.title, "Service"]);
  for (const p of productsSeed) p.coverImage && jobs.push([p.coverImage, p.title, "Product"]);
  for (const p of projectsSeed) p.coverImage && jobs.push([p.coverImage, p.title, `${p.industry} · ${p.country}`]);
  for (const p of postsSeed) p.coverImage && jobs.push([p.coverImage, p.title, "Zylo Blog"]);

  let made = 0;
  if (await write("logo.png", logoSvg)) {
    made++;
    console.log("  + logo.png (placeholder – replace with your real logo)");
  }
  for (const [src, title, label] of jobs) {
    if (!src.startsWith("/")) continue;
    if (await write(src.slice(1), coverSvg(title, label))) {
      made++;
      console.log(`  + ${src.slice(1)}`);
    }
  }
  console.log(made ? `✔ Created ${made} placeholder image(s).` : "✔ All images already exist – nothing to do.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
