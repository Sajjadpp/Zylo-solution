import { C, F, bars, barcode, box, canvas, chip, circle, dash, donut, icon, kpi, laptop, lineChart, lines, phone, rect, scanner, t, tile, windowCard } from "./kit.mjs";

// ─── Odoo ERP Implementation: laptop dashboard with connected modules ──────
export function odoo() {
  const lx = 520, ly = 230, lw = 560;
  const screen = (s) => `
${rect(s.x, s.y, s.w, 56, { rx: 0, fill: C.blue })}
${t(s.x + 24, s.y + 36, "Zylo ERP · Dashboard", { size: 18, w: 700, fill: C.white })}
${circle(s.x + s.w - 34, s.y + 28, 12, C.yellow)}
${kpi(s.x + 20, s.y + 76, 154, "Sales", "BHD 48.2K", "+12%")}
${kpi(s.x + 186, s.y + 76, 154, "Stock value", "BHD 210K", "+4%")}
${kpi(s.x + 352, s.y + 76, 154, "Receivables", "BHD 31K", "−6 days")}
${rect(s.x + 20, s.y + 188, 300, 108, { rx: 14, fill: C.bg })}
${bars(s.x + 40, s.y + 206, 260, 74, [42, 58, 50, 72, 64, 86, 78], { hl: 5 })}
${rect(s.x + 336, s.y + 188, 170, 108, { rx: 14, fill: C.bg })}
${donut(s.x + 421, s.y + 242, 34, [{ v: 55, color: C.blue }, { v: 25, color: C.yellow }, { v: 20, color: C.black }], 14)}`;
  const mods = [
    [150, 150, "Sales", "cart"],
    [150, 330, "Inventory", "box"],
    [150, 510, "Purchase", "truck"],
    [1250, 150, "Accounting", "calc"],
    [1250, 330, "CRM", "users"],
    [1250, 510, "HR & Payroll", "file"],
  ];
  const conns = mods
    .map(([x, y]) => (x < 800 ? dash(`M${x + 190} ${y + 38} C ${x + 280} ${y + 38} ${lx - 90} ${ly + 160} ${lx - 6} ${ly + 160}`) : dash(`M${x} ${y + 38} C ${x - 90} ${y + 38} ${lx + lw + 90} ${ly + 160} ${lx + lw + 6} ${ly + 160}`)))
    .join("");
  return canvas(
    `${conns}
${laptop(lx, ly, lw, screen)}
${mods.map(([x, y, l, ic]) => tile(x, y, l, ic, { w: 200 })).join("")}
${tile(700, 700, "Odoo ERP", "layers", { w: 200, accent: true })}
${chip(1040, 700, { icon: "rocket", iconBg: C.yellowL, iconColor: C.black, title: "Live in 8 weeks", sub: "Setup · migration · training" })}
${chip(330, 700, { icon: "globe", iconBg: C.blueXL, iconColor: C.blue, title: "Arabic & English", sub: "Invoices and reports" })}`,
    { yellow: [1540, 860, 220], ring: [80, 70, 150] },
  );
}

// ─── Barcoding Systems: shelves, scanner reading a box label ───────────────
export function barcoding() {
  const shelf = (x, y, w) => `${rect(x, y, w, 14, { rx: 4, fill: C.black })}`;
  return canvas(
    `
${rect(110, 170, 16, 560, { rx: 4, fill: C.black })}${rect(624, 170, 16, 560, { rx: 4, fill: C.black })}
${shelf(110, 340, 530)}${shelf(110, 530, 530)}${shelf(110, 716, 530)}
${box(150, 240, 130, 100, { label: true })}${box(300, 260, 110, 80, { label: false })}${box(430, 228, 160, 112)}
${box(150, 410, 170, 120)}${box(340, 440, 120, 90, { label: false })}${box(480, 420, 120, 110)}
${box(150, 616, 120, 100, { label: false })}${box(290, 596, 170, 120)}${box(480, 636, 110, 80, { label: false })}
${rect(420, 410, 200, 140, { rx: 12, fill: "none", stroke: C.blue, sw: 5, dash: "26 14" })}
${box(780, 430, 300, 230)}
${scanner(1250, 430, 1.25, [880, 560])}
${windowCard(1130, 150, 360, 230, (s) => `
${t(s.x + 24, s.y + 40, "Stock · Item 4471", { size: 16, w: 700 })}
${t(s.x + 24, s.y + 92, "1,248", { size: 44, w: 800, fill: C.blue })}
${t(s.x + 160, s.y + 92, "units", { size: 18, fill: C.muted })}
${rect(s.x + 24, s.y + 118, 312, 12, { rx: 6, fill: C.greyL })}${rect(s.x + 24, s.y + 118, 250, 12, { rx: 6, fill: C.yellow })}
${t(s.x + 24, s.y + 158, "Warehouse A · Bin C-14", { size: 14, fill: C.muted })}`, { title: "Inventory" })}
${chip(740, 170, { icon: "check", title: "+24 units received", sub: "PO-2291 · just now" })}
${chip(780, 720, { icon: "scan", iconBg: C.blueXL, iconColor: C.blue, title: "99.4% accuracy", sub: "Daily cycle counts" })}
${chip(1180, 720, { icon: "file", iconBg: C.yellow, iconColor: C.black, title: "Arabic & English", sub: "Labels and reports", dark: true })}`,
    { yellow: [1560, 90, 200], ring: [60, 120, 120] },
  );
}

// ─── Software Development: code editor + connected systems ─────────────────
export function software() {
  const code = (s) => {
    const rows = [
      [0, 120, C.blue], [30, 220, C.black], [30, 160, C.muted], [60, 260, C.yellow], [60, 180, C.black],
      [30, 90, C.blue], [0, 60, C.black], [0, 200, C.blue], [30, 280, C.muted], [30, 150, C.yellow], [0, 70, C.black],
    ];
    return rows.map(([ind, w, c], i) => `${t(s.x + 22, s.y + 44 + i * 34, String(i + 1).padStart(2, "0"), { size: 13, fill: C.muted, op: 0.6 })}${rect(s.x + 64 + ind, s.y + 34 + i * 34, w, 12, { rx: 6, fill: c, op: c === C.muted ? 0.35 : 0.85 })}`).join("");
  };
  const nodes = [
    [1160, 160, "ERP", "layers"],
    [1300, 330, "Payments", "percent"],
    [1160, 500, "Customer portal", "users"],
    [1300, 670, "Mobile app", "smartphone"],
  ];
  return canvas(
    `${nodes.map(([x, y]) => dash(`M880 ${430} C 1000 430 ${x - 80} ${y + 38} ${x} ${y + 38}`)).join("")}
${windowCard(160, 170, 720, 520, code, { title: "src/api/orders.ts" })}
${rect(160 + 420, 170 + 380, 260, 110, { rx: 18, fill: C.black, shadow: "soft" })}
${t(600, 594, "$ deploy --prod", { size: 16, w: 700, fill: C.yellow })}
${t(600, 624, "✓ Build passed · 2.4.0", { size: 14, fill: C.white, op: 0.8 })}
${nodes.map(([x, y, l, ic]) => tile(x, y, l, ic, { w: 230 })).join("")}
${chip(200, 740, { icon: "check", title: "Release v2.4 live", sub: "Zero downtime" })}
${chip(520, 740, { icon: "shield", iconBg: C.blueXL, iconColor: C.blue, title: "Secure API", sub: "Tested and documented" })}`,
    { yellow: [1540, 860, 200], ring: [60, 90, 130] },
  );
}

// ─── Website Development: desktop + mobile website ─────────────────────────
export function website() {
  const site = (s, mobile = false) => {
    const pad = mobile ? 18 : 34;
    return `${rect(s.x, s.y, s.w, mobile ? 70 : 64, { rx: 0, fill: C.white })}
${t(s.x + pad, s.y + (mobile ? 50 : 42), "Gulf Co.", { size: mobile ? 18 : 22, w: 800 })}
${mobile ? rect(s.x + s.w - 54, s.y + 30, 32, 6, { rx: 3, fill: C.black }) + rect(s.x + s.w - 54, s.y + 42, 32, 6, { rx: 3, fill: C.black }) : lines(s.x + s.w - 380, s.y + 30, [60], { h: 8 }) + lines(s.x + s.w - 300, s.y + 30, [60], { h: 8 }) + lines(s.x + s.w - 220, s.y + 30, [60], { h: 8 }) + rect(s.x + s.w - 140, s.y + 18, 110, 32, { rx: 16, fill: C.blue })}
${rect(s.x, s.y + (mobile ? 70 : 64), s.w, mobile ? 300 : 300, { rx: 0, fill: C.blueXL })}
${rect(s.x + pad, s.y + (mobile ? 104 : 110), mobile ? 180 : 380, mobile ? 20 : 30, { rx: 8, fill: C.black })}
${rect(s.x + pad, s.y + (mobile ? 136 : 152), mobile ? 130 : 300, mobile ? 20 : 30, { rx: 8, fill: C.black })}
${lines(s.x + pad, s.y + (mobile ? 180 : 210), mobile ? [180, 140] : [340, 280], { h: 10, gap: 20 })}
${rect(s.x + pad, s.y + (mobile ? 236 : 270), mobile ? 140 : 160, mobile ? 40 : 46, { rx: 23, fill: C.yellow })}
${mobile ? "" : rect(s.x + s.w - 330, s.y + 100, 280, 220, { rx: 18, fill: C.blue }) + circle(s.x + s.w - 120, s.y + 170, 46, C.yellow) + rect(s.x + s.w - 300, s.y + 250, 160, 14, { rx: 7, fill: C.white, op: 0.6 })}
${[0, 1, 2].map((i) => rect(s.x + pad + i * (mobile ? 0 : 250), s.y + (mobile ? 400 + i * 0 : 400), mobile ? s.w - pad * 2 : 220, mobile ? 110 : 130, { rx: 14, fill: C.bg })).join("")}`;
  };
  return canvas(
    `
${rect(200, 140, 900, 560, { rx: 26, fill: C.black, shadow: true })}
<clipPath id="mon"><rect x="218" y="158" width="864" height="524" rx="12"/></clipPath>
${rect(218, 158, 864, 524, { rx: 12, fill: C.white })}
<g clip-path="url(#mon)">${site({ x: 218, y: 158, w: 864, h: 524 })}</g>
<path d="M600 700 h100 l20 70 h-140 z" fill="${C.grey}"/>${rect(520, 766, 260, 18, { rx: 9, fill: C.grey })}
${phone(1140, 250, 260, 520, (s) => site(s, true))}
${chip(1120, 120, { icon: "globeSearch", iconBg: C.blueXL, iconColor: C.blue, title: "Found on Google", sub: "SEO-ready pages", w: 270 })}
${chip(1250, 790, { icon: "zap", iconBg: C.yellow, iconColor: C.black, title: "Loads in 1.2s", sub: "Fast on every phone", dark: true, w: 270 })}
${chip(120, 760, { icon: "bell", title: "New enquiry", sub: "via WhatsApp button" })}`,
    { yellow: [1560, 120, 210], ring: [70, 80, 120] },
  );
}

// ─── Custom Accounting Software: invoice, VAT, reports ─────────────────────
export function accounting() {
  return canvas(
    `
${windowCard(150, 150, 560, 620, (s) => `
${t(s.x + 36, s.y + 58, "TAX INVOICE", { size: 26, w: 800 })}
${t(s.x + s.w - 36, s.y + 58, "فاتورة ضريبية", { size: 20, w: 700, fill: C.blue, a: "end" })}
${t(s.x + 36, s.y + 92, "INV-2026-0418 · VAT No. 2004 1234 5678", { size: 14, fill: C.muted })}
${[0, 1, 2, 3].map((i) => `${rect(s.x + 36, s.y + 128 + i * 52, 260, 10, { rx: 5, fill: C.grey })}${t(s.x + s.w - 36, s.y + 138 + i * 52, ["120.000", "86.500", "42.250", "18.000"][i], { size: 16, w: 700, a: "end" })}`).join("")}
${rect(s.x + 36, s.y + 340, s.w - 72, 2, { rx: 1, fill: C.greyL })}
${t(s.x + 36, s.y + 384, "Subtotal", { size: 16, fill: C.muted })}${t(s.x + s.w - 36, s.y + 384, "266.750", { size: 16, w: 700, a: "end" })}
${t(s.x + 36, s.y + 418, "VAT 10%", { size: 16, fill: C.muted })}${t(s.x + s.w - 36, s.y + 418, "26.675", { size: 16, w: 700, a: "end" })}
${rect(s.x + 24, s.y + 444, s.w - 48, 70, { rx: 16, fill: C.blue })}
${t(s.x + 48, s.y + 488, "Total", { size: 20, w: 700, fill: C.white })}${t(s.x + s.w - 48, s.y + 490, "BHD 293.425", { size: 26, w: 800, fill: C.white, a: "end" })}`, { title: "Invoices" })}
${windowCard(800, 130, 400, 300, (s) => `
${t(s.x + 26, s.y + 42, "Profit & loss", { size: 17, w: 700 })}
${lineChart(s.x + 26, s.y + 70, s.w - 52, 150, [30, 42, 38, 55, 52, 68, 74], { color: C.blue })}`, { title: "Reports" })}
${windowCard(1100, 470, 340, 300, (s) => `
${t(s.x + 26, s.y + 42, "Expenses", { size: 17, w: 700 })}
${donut(s.x + 110, s.y + 150, 62, [{ v: 45, color: C.blue }, { v: 30, color: C.yellow }, { v: 25, color: C.black }], 26)}
${[["Payroll", C.blue], ["Rent", C.yellow], ["Other", C.black]].map(([l, c], i) => circle(s.x + 210, s.y + 110 + i * 34, 7, c) + t(s.x + 226, s.y + 116 + i * 34, l, { size: 14, fill: C.muted })).join("")}`, { title: "Cost centres" })}
${chip(760, 520, { icon: "percent", iconBg: C.yellow, iconColor: C.black, title: "VAT return ready", sub: "Bahrain NBR format", w: 280 })}
${chip(760, 640, { icon: "check", title: "Bank reconciled", sub: "248 of 248 lines", w: 280 })}
${chip(1240, 120, { icon: "globe", iconBg: C.blueXL, iconColor: C.blue, title: "Arabic & English", sub: "Bilingual statements", w: 260 })}`,
    { yellow: [1560, 880, 230], ring: [60, 80, 120] },
  );
}

// ─── Application Development: two phones + store badges ────────────────────
export function apps() {
  const shopApp = (s) => `
${rect(s.x, s.y, s.w, 150, { rx: 0, fill: C.blue })}
${t(s.x + 22, s.y + 78, "Hello, Sara", { size: 15, fill: C.white, op: 0.8 })}
${t(s.x + 22, s.y + 108, "Order again?", { size: 24, w: 800, fill: C.white })}
${rect(s.x + 18, s.y + 170, s.w - 36, 44, { rx: 22, fill: C.bg })}${icon("globeSearch", s.x + 32, s.y + 180, 22, C.muted)}
${[0, 1, 2, 3].map((i) => {
    const x = s.x + 18 + (i % 2) * ((s.w - 46) / 2 + 10), y = s.y + 232 + Math.floor(i / 2) * 150;
    return rect(x, y, (s.w - 46) / 2, 136, { rx: 16, fill: C.bg }) + circle(x + (s.w - 46) / 4, y + 52, 30, [C.yellow, C.blueL, C.blueL, C.yellow][i]) + rect(x + 14, y + 98, 80, 9, { rx: 4, fill: C.black }) + rect(x + 14, y + 114, 50, 8, { rx: 4, fill: C.blue });
  }).join("")}
${rect(s.x + 18, s.y + s.h - 74, s.w - 36, 54, { rx: 27, fill: C.yellow })}
${t(s.x + s.w / 2, s.y + s.h - 40, "Checkout · BHD 12.500", { size: 15, w: 800, a: "middle" })}`;
  const fieldApp = (s) => `
${rect(s.x, s.y, s.w, s.h, { rx: 0, fill: C.black })}
${t(s.x + 22, s.y + 80, "Today", { size: 15, fill: C.white, op: 0.7 })}
${t(s.x + 22, s.y + 112, "6 jobs", { size: 28, w: 800, fill: C.white })}
${[0, 1, 2, 3].map((i) => `${rect(s.x + 18, s.y + 140 + i * 82, s.w - 36, 70, { rx: 16, fill: "#1B1B25" })}${circle(s.x + 48, s.y + 175 + i * 82, 14, i === 0 ? C.yellow : C.blue)}${rect(s.x + 74, s.y + 162 + i * 82, 120, 9, { rx: 4, fill: C.white, op: 0.85 })}${rect(s.x + 74, s.y + 180 + i * 82, 80, 8, { rx: 4, fill: C.white, op: 0.35 })}`).join("")}
${rect(s.x + 18, s.y + s.h - 74, s.w - 36, 54, { rx: 27, fill: C.blue })}
${t(s.x + s.w / 2, s.y + s.h - 40, "Start job", { size: 15, w: 800, fill: C.white, a: "middle" })}`;
  const badge = (x, y, top, name, ic) => `${rect(x, y, 230, 76, { rx: 18, fill: C.black, shadow: "soft" })}${icon(ic, x + 22, y + 22, 32, C.white, 2)}${t(x + 70, y + 32, top, { size: 12, fill: C.white, op: 0.7 })}${t(x + 70, y + 56, name, { size: 20, w: 800, fill: C.white })}`;
  return canvas(
    `
${phone(430, 120, 330, 660, shopApp)}
${phone(820, 190, 300, 600, fieldApp)}
${badge(150, 250, "Available on", "iOS", "smartphone")}
${badge(150, 350, "Available on", "Android", "smartphone")}
${chip(120, 520, { icon: "check", title: "Published", sub: "Both app stores", w: 250 })}
${chip(1180, 230, { icon: "star", iconBg: C.yellow, iconColor: C.black, title: "4.8 rating", sub: "From 1,200 users", w: 260 })}
${chip(1180, 350, { icon: "wifiOff", iconBg: C.blueXL, iconColor: C.blue, title: "Works offline", sub: "Syncs when online", w: 260 })}
${chip(1180, 470, { icon: "layers", iconBg: C.black, iconColor: C.yellow, title: "Connected to ERP", sub: "Live stock and prices", w: 260 })}`,
    { yellow: [1500, 840, 240], ring: [120, 90, 130] },
  );
}
