// Renders brand illustrations to SVG (brand/illustrations) and JPG (public/images).
//   node scripts/illustrations/build.mjs            → all
//   node scripts/illustrations/build.mjs odoo apps  → only these
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import * as svc from "./scenes-services.mjs";

const fromFile = (f) => () => fs.readFileSync(path.join(process.cwd(), "brand/illustrations", f), "utf8");

const SCENES = {
  van: { fn: fromFile("van-sale-module.svg"), out: ["services/van-sale-module.jpg", "products/van-sale-module.jpg"] },
  odoo: { fn: svc.odoo, out: ["services/odoo-erp-implementation.jpg"] },
  barcoding: { fn: svc.barcoding, out: ["services/barcoding-systems.jpg", "products/barcoding-systems.jpg"] },
  software: { fn: svc.software, out: ["services/software-development.jpg"] },
  website: { fn: svc.website, out: ["services/website-development.jpg"] },
  accounting: { fn: svc.accounting, out: ["services/custom-accounting-software.jpg"] },
  apps: { fn: svc.apps, out: ["services/application-development.jpg"] },
};

try {
  const extra = await import("./scenes-more.mjs");
  Object.assign(SCENES, extra.SCENES);
} catch (e) {
  if (e.code !== "ERR_MODULE_NOT_FOUND") throw e;
}

const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const previewDir = process.argv.find((a) => a.startsWith("--preview="))?.split("=")[1];
const root = process.cwd();
fs.mkdirSync(path.join(root, "brand/illustrations"), { recursive: true });

for (const [name, { fn, out }] of Object.entries(SCENES)) {
  if (only.length && !only.includes(name)) continue;
  const svg = fn();
  if (name !== "van") fs.writeFileSync(path.join(root, "brand/illustrations", `${name}.svg`), svg);
  const jpg = await sharp(Buffer.from(svg), { density: 144 }).resize(1600, 900).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  for (const o of out) {
    const p = path.join(root, "public/images", o);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, jpg);
  }
  if (previewDir) await sharp(jpg).resize(1100).toFile(path.join(previewDir, `il-${name}.jpg`));
  console.log(`✔ ${name.padEnd(12)} ${(jpg.length / 1024) | 0} KB → ${out.join(", ")}`);
}
