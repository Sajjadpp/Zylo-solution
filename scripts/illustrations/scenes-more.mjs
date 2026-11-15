import { C, bars, barcode, box, canvas, chip, circle, dash, donut, icon, kpi, laptop, lineChart, lines, phone, pin, rect, scanner, shop, t, tile, van, windowCard } from "./kit.mjs";

const building = (x, y, label, { w = 170, h = 150, color = C.white } = {}) => `
<g filter="url(#soft)">${rect(x, y, w, h, { rx: 16, fill: color })}</g>
${rect(x, y, w, 30, { rx: 0, fill: C.black })}${rect(x, y, w, 16, { rx: 16, fill: C.black })}
${[0, 1, 2].map((c) => [0, 1].map((r) => rect(x + 22 + c * 46, y + 48 + r * 40, 34, 26, { rx: 6, fill: C.blueL })).join("")).join("")}
${rect(x + w / 2 - 22, y + h - 34, 44, 34, { rx: 6, fill: C.blue })}
${rect(x + w / 2 - 70, y + h + 14, 140, 34, { rx: 17, fill: C.white, shadow: "soft" })}
${t(x + w / 2, y + h + 37, label, { size: 15, w: 700, a: "middle" })}`;

// ─── Case study: Odoo rollout across 4 branches ────────────────────────────
function workOdoo() {
  const br = [
    [140, 120, "Manama"],
    [140, 560, "Riffa"],
    [1290, 120, "Muharraq"],
    [1290, 560, "Sitra"],
  ];
  return canvas(
    `${br.map(([x, y]) => dash(x < 800 ? `M${x + 170} ${y + 75} C 420 ${y + 75} 470 400 560 400` : `M${x} ${y + 75} C 1180 ${y + 75} 1130 400 1040 400`)).join("")}
${laptop(560, 230, 480, (s) => `
${rect(s.x, s.y, s.w, 50, { rx: 0, fill: C.blue })}${t(s.x + 20, s.y + 32, "Head office · All branches", { size: 16, w: 700, fill: C.white })}
${kpi(s.x + 18, s.y + 66, 200, "Stock (4 branches)", "6,120 items", "Live")}
${kpi(s.x + 230, s.y + 66, 200, "Month-end close", "4 days", "was 14 days")}
${rect(s.x + 18, s.y + 176, s.w - 36, 66, { rx: 14, fill: C.bg })}
${bars(s.x + 36, s.y + 188, s.w - 72, 42, [30, 44, 38, 52, 47, 60, 58, 70, 66, 78], { hl: 9 })}`)}
${br.map(([x, y, l]) => building(x, y, l)).join("")}
${chip(560, 650, { icon: "clock", iconBg: C.yellow, iconColor: C.black, title: "Month-end: 14 → 4 days", sub: "Odoo Accounting", w: 300 })}
${chip(880, 650, { icon: "layers", iconBg: C.blueXL, iconColor: C.blue, title: "One live system", sub: "Sales · stock · VAT", w: 240 })}`,
    { yellow: [800, 960, 190], ring: [1560, 470, 120] },
  );
}

// ─── Case study: warehouse + 12 stores with barcode scanning ───────────────
function workBarcode() {
  const stores = [
    [1100, 120],
    [1300, 330],
    [1100, 540],
  ];
  return canvas(
    `${stores.map(([x, y]) => dash(`M640 470 C 860 470 ${x - 160} ${y + 80} ${x - 10} ${y + 80}`)).join("")}
<g filter="url(#shadow)"><path d="M120 330 L380 190 L640 330 V720 H120 Z" fill="${C.white}"/></g>
<path d="M100 340 L380 180 L660 340" fill="none" stroke="${C.black}" stroke-width="22" stroke-linejoin="round" stroke-linecap="round"/>
${rect(240, 460, 280, 260, { rx: 10, fill: C.blueL })}
${[0, 1, 2, 3, 4].map((i) => rect(240, 480 + i * 46, 280, 8, { rx: 4, fill: C.blue, op: 0.35 })).join("")}
${box(150, 620, 90, 100, { label: false })}${box(540, 600, 90, 120)}
${rect(310, 360, 140, 40, { rx: 20, fill: C.black })}${t(380, 386, "WAREHOUSE", { size: 14, w: 800, fill: C.white, a: "middle", ls: 2 })}
${stores.map(([x, y]) => shop(x, y, 180, 135)).join("")}
${scanner(700, 160, 0.7)}
${chip(640, 700, { icon: "scan", iconBg: C.yellow, iconColor: C.black, title: "99%+ stock accuracy", sub: "Daily cycle counts", w: 270 })}
${chip(930, 760, { icon: "building", iconBg: C.blueXL, iconColor: C.blue, title: "12 stores connected", sub: "Saudi Arabia", w: 270 })}`,
    { yellow: [1560, 880, 200], ring: [80, 90, 120] },
  );
}

// ─── Case study: FMCG distributor, 25 vans on routes ───────────────────────
function workVan() {
  const road = "M-40 700 C 300 690 600 650 900 670 S 1300 720 1640 690";
  return canvas(
    `
<path d="${road}" fill="none" stroke="#3A3F52" stroke-width="96" stroke-linecap="round"/>
<path d="${road}" fill="none" stroke="${C.yellow}" stroke-width="6" stroke-dasharray="34 26"/>
${van(70, 548, 0.42)}${van(520, 526, 0.42, { body: C.black })}
${pin(470, 330, 0.75)}${pin(930, 300, 0.75, C.black)}
${dash("M470 440 C 600 460 800 430 930 410", C.blue, 4)}
${phone(1170, 120, 250, 500, (s) => `
${rect(s.x, s.y, s.w, 120, { rx: 0, fill: C.blue })}
${t(s.x + 18, s.y + 66, "Live sales · today", { size: 13, fill: C.white, op: 0.8 })}${t(s.x + 18, s.y + 98, "BHD 18,240", { size: 24, w: 800, fill: C.white })}
${[["Van 03", "41 invoices"], ["Van 07", "38 invoices"], ["Van 12", "35 invoices"], ["Van 19", "29 invoices"]].map(([a, b], i) => `${rect(s.x + 14, s.y + 138 + i * 66, s.w - 28, 56, { rx: 12, fill: C.bg })}${icon("truck", s.x + 26, s.y + 154 + i * 66, 22, C.blue)}${t(s.x + 58, s.y + 164 + i * 66, a, { size: 15, w: 700 })}${t(s.x + 58, s.y + 182 + i * 66, b, { size: 12, fill: C.muted })}`).join("")}`)}
${chip(110, 140, { icon: "trend", iconBg: C.yellow, iconColor: C.black, title: "~15% more visits", sub: "25 vans · UAE", w: 270 })}
${chip(110, 250, { icon: "check", title: "Same-day visibility", sub: "No next-day data entry", w: 270 })}`,
    { yellow: [1540, 120, 150], ring: null },
  );
}

// ─── Blog: Odoo implementation cost ────────────────────────────────────────
function blogOdooCost() {
  const segs = [
    { l: "Implementation", v: 45, c: C.blue },
    { l: "Licenses", v: 25, c: C.yellow },
    { l: "Training", v: 15, c: C.black },
    { l: "Support", v: 15, c: C.blueL },
  ];
  return canvas(
    `${windowCard(240, 160, 640, 560, (s) => `
${t(s.x + 40, s.y + 60, "Odoo project budget", { size: 26, w: 800 })}
${t(s.x + 40, s.y + 92, "Typical first-year split", { size: 16, fill: C.muted })}
${donut(s.x + 190, s.y + 290, 120, segs.map((x) => ({ v: x.v, color: x.c })), 48)}
${t(s.x + 190, s.y + 284, "100%", { size: 30, w: 800, a: "middle" })}${t(s.x + 190, s.y + 310, "budget", { size: 14, fill: C.muted, a: "middle" })}
${segs.map((x, i) => `${rect(s.x + 360, s.y + 200 + i * 52, 22, 22, { rx: 6, fill: x.c })}${t(s.x + 396, s.y + 218 + i * 52, x.l, { size: 17, w: 700 })}${t(s.x + s.w - 40, s.y + 218 + i * 52, x.v + "%", { size: 17, fill: C.muted, a: "end" })}`).join("")}`, { title: "Estimate" })}
${rect(960, 230, 300, 380, { rx: 30, fill: C.black, shadow: true })}
${rect(990, 262, 240, 90, { rx: 14, fill: "#1B1B25" })}${t(1210, 322, "BHD", { size: 34, w: 800, fill: C.yellow, a: "end" })}
${[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => rect(990 + c * 84, 376 + r * 56, 72, 44, { rx: 10, fill: r === 3 && c === 2 ? C.yellow : "#2A2A36" })).join("")).join("")}
${chip(1100, 660, { icon: "clock", iconBg: C.blueXL, iconColor: C.blue, title: "6–12 weeks", sub: "Typical go-live", w: 250 })}`,
    { yellow: [1500, 100, 220], ring: [90, 820, 150] },
  );
}

// ─── Blog: barcode inventory guide ─────────────────────────────────────────
function blogBarcodeGuide() {
  const steps = ["Clean product data", "Label locations", "Opening stock count", "Scan receiving", "Daily cycle counts"];
  return canvas(
    `
${rect(260, 120, 520, 660, { rx: 30, fill: C.white, shadow: true })}
${rect(420, 96, 200, 56, { rx: 18, fill: C.black })}
${t(310, 220, "Rollout checklist", { size: 28, w: 800 })}
${steps.map((st, i) => `${rect(310, 260 + i * 92, 420, 72, { rx: 18, fill: i < 4 ? C.bg : C.white, stroke: i < 4 ? null : C.blue, sw: 3 })}${circle(350, 296 + i * 92, 18, i < 4 ? C.blue : C.white, i < 4 ? "" : `stroke="${C.blue}" stroke-width="3"`)}${i < 4 ? icon("check", 340, 286 + i * 92, 20, C.white, 3) : ""}${t(386, 303 + i * 92, `${i + 1}. ${st}`, { size: 19, w: 700, fill: i < 4 ? C.black : C.blue })}`).join("")}
${box(930, 420, 260, 200)}
${scanner(1270, 300, 1, [1010, 560])}
${chip(900, 680, { icon: "check", title: "Count every day", sub: "No store closures", w: 260 })}`,
    { yellow: [1500, 120, 200], ring: [100, 820, 150] },
  );
}

// ─── Blog: van sales offline mode ──────────────────────────────────────────
function blogVanOffline() {
  return canvas(
    `
${van(110, 400, 0.55)}
${phone(640, 140, 300, 600, (s) => `
${rect(s.x, s.y, s.w, s.h, { rx: 0, fill: C.white })}
${circle(s.x + s.w / 2, s.y + 170, 80, C.yellowL)}${icon("wifiOff", s.x + s.w / 2 - 44, s.y + 126, 88, C.black, 2.2)}
${t(s.x + s.w / 2, s.y + 300, "No signal", { size: 24, w: 800, a: "middle" })}
${t(s.x + s.w / 2, s.y + 328, "Keep selling — all saved", { size: 15, fill: C.muted, a: "middle" })}
${[0, 1, 2].map((i) => `${rect(s.x + 18, s.y + 360 + i * 54, s.w - 36, 44, { rx: 12, fill: C.bg })}${t(s.x + 34, s.y + 388 + i * 54, `INV-10${44 + i}`, { size: 14, w: 700 })}${t(s.x + s.w - 34, s.y + 388 + i * 54, "Saved", { size: 13, w: 700, fill: C.blue, a: "end" })}`).join("")}`)}
${dash("M960 420 C 1060 420 1080 330 1150 320")}
<g filter="url(#shadow)"><path d="M1150 400 a90 90 0 1 1 20 -170 a120 120 0 0 1 230 40 a80 80 0 0 1 -10 160 z" fill="${C.white}"/></g>
${icon("sync", 1240, 250, 90, C.blue, 2.2)}
${chip(1090, 520, { icon: "check", title: "Synced automatically", sub: "When the signal returns", w: 300 })}`,
    { yellow: [1540, 860, 220], ring: [80, 90, 130] },
  );
}

// ─── Blog: Odoo vs custom ERP ──────────────────────────────────────────────
function blogOdooVsCustom() {
  return canvas(
    `
${windowCard(150, 190, 560, 520, (s) => `
${t(s.x + 36, s.y + 60, "Odoo ERP", { size: 28, w: 800 })}${t(s.x + 36, s.y + 92, "Ready modules, fast go-live", { size: 16, fill: C.muted })}
${[["Sales", "cart"], ["Inventory", "box"], ["Accounting", "calc"], ["CRM", "users"], ["HR", "file"], ["POS", "receipt"]].map(([l, ic], i) => `${rect(s.x + 36 + (i % 2) * 248, s.y + 124 + Math.floor(i / 2) * 104, 232, 88, { rx: 18, fill: C.bg })}${rect(s.x + 52 + (i % 2) * 248, s.y + 146 + Math.floor(i / 2) * 104, 44, 44, { rx: 12, fill: C.blue })}${icon(ic, s.x + 62 + (i % 2) * 248, s.y + 156 + Math.floor(i / 2) * 104, 24, C.white, 2.4)}${t(s.x + 112 + (i % 2) * 248, s.y + 175 + Math.floor(i / 2) * 104, l, { size: 18, w: 700 })}`).join("")}`, { title: "Platform" })}
${windowCard(890, 190, 560, 520, (s) => `
${t(s.x + 36, s.y + 60, "Custom ERP", { size: 28, w: 800, fill: C.white })}${t(s.x + 36, s.y + 92, "Built exactly for you", { size: 16, fill: C.white, op: 0.6 })}
${[[0, 200, C.yellow], [30, 300, C.white], [30, 240, C.blue], [60, 280, C.white], [30, 160, C.yellow], [0, 120, C.white], [0, 260, C.blue], [30, 220, C.white]].map(([ind, w, c], i) => rect(s.x + 40 + ind, s.y + 136 + i * 36, w, 12, { rx: 6, fill: c, op: c === C.white ? 0.35 : 0.9 })).join("")}`, { title: "Your code", dark: true })}
${circle(800, 450, 74, C.yellow, 'filter="url(#shadow)"')}${t(800, 468, "VS", { size: 46, w: 800, a: "middle" })}`,
    { yellow: null, ring: [800, 450, 150], ring2: [1540, 100, 110] },
  );
}

// ─── Blog: Arabic & English reporting ──────────────────────────────────────
function blogArabicEnglish() {
  const report = (x, y, rtl) =>
    windowCard(x, y, 560, 520, (s) => {
      const tx = rtl ? s.x + s.w - 36 : s.x + 36;
      const a = rtl ? "end" : "start";
      const v = [48, 62, 55, 74, 68, 86];
      return `
${rect(rtl ? s.x + 36 : s.x + s.w - 116, s.y + 30, 80, 44, { rx: 22, fill: rtl ? C.black : C.blue })}
${t(rtl ? s.x + 76 : s.x + s.w - 76, s.y + 60, rtl ? "ع" : "EN", { size: 20, w: 800, fill: rtl ? C.yellow : C.white, a: "middle" })}
${t(tx, s.y + 66, rtl ? "تقرير المبيعات" : "Sales report", { size: 28, w: 800, a })}
${t(tx, s.y + 98, rtl ? "الربع الثالث ٢٠٢٦" : "Q3 2026 · All branches", { size: 16, fill: C.muted, a })}
${bars(s.x + 50, s.y + 140, s.w - 100, 200, rtl ? [...v].reverse() : v, { hl: rtl ? 0 : 5 })}
${rect(s.x + 36, s.y + 370, s.w - 72, 70, { rx: 16, fill: C.bg })}
${t(rtl ? s.x + s.w - 60 : s.x + 60, s.y + 413, rtl ? "الإجمالي" : "Total", { size: 18, w: 700, a })}
${t(rtl ? s.x + 60 : s.x + s.w - 60, s.y + 415, "BHD 248,600", { size: 22, w: 800, fill: C.blue, a: rtl ? "start" : "end" })}`;
    }, { title: rtl ? "Report · Arabic" : "Report · English" });
  return canvas(`${report(140, 200, false)}${report(900, 200, true)}
${circle(800, 460, 58, C.white, 'filter="url(#soft)"')}${icon("sync", 772, 432, 56, C.blue, 2.4)}`, { yellow: [1500, 80, 160], ring: [90, 830, 150] });
}

export const SCENES = {
  "work-odoo": { fn: workOdoo, out: ["work/odoo-erp-multi-branch-trading.jpg"] },
  "work-barcode": { fn: workBarcode, out: ["work/warehouse-barcode-retail-chain.jpg"] },
  "work-van": { fn: workVan, out: ["work/offline-van-sales-fmcg-distributor.jpg"] },
  "blog-odoo-cost": { fn: blogOdooCost, out: ["blog/odoo-erp-implementation-cost-bahrain.jpg"] },
  "blog-barcode-guide": { fn: blogBarcodeGuide, out: ["blog/barcode-inventory-management-guide-gcc-retailers.jpg"] },
  "blog-van-offline": { fn: blogVanOffline, out: ["blog/van-sales-software-offline-mode.jpg"] },
  "blog-odoo-vs-custom": { fn: blogOdooVsCustom, out: ["blog/odoo-vs-custom-erp-gcc.jpg"] },
  "blog-arabic-english": { fn: blogArabicEnglish, out: ["blog/arabic-english-erp-reporting-gulf.jpg"] },
};
