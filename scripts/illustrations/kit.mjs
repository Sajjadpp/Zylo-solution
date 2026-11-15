// Shared drawing kit for Zylo illustrations (flat vector style, brand colours).
export const F = "Arial, Helvetica, sans-serif";
export const C = {
  blue: "#2541F5",
  blueD: "#1B30C9",
  blueL: "#DCE3FF",
  blueXL: "#EEF1FF",
  yellow: "#FFC914",
  yellowL: "#FFF4C2",
  black: "#0B0B0F",
  bg: "#F5F7FB",
  grey: "#D7DCEA",
  greyL: "#E9EDF5",
  muted: "#5A6275",
  green: "#22C55E",
  greenD: "#16A34A",
  greenL: "#DCFCE7",
  white: "#FFFFFF",
};

let uid = 0;
const id = (p) => `${p}${++uid}`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Wraps scene content in the standard 1600×900 canvas with background shapes. */
export function canvas(content, { yellow = [1480, 110, 230], ring = [110, 860, 170], ring2 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<defs>
  <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="${C.blue}" fill-opacity="0.10"/></pattern>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="${C.black}" flood-opacity="0.14"/></filter>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="${C.black}" flood-opacity="0.12"/></filter>
</defs>
<rect width="1600" height="900" fill="${C.bg}"/>
<rect width="1600" height="900" fill="url(#dots)"/>
${yellow ? `<circle cx="${yellow[0]}" cy="${yellow[1]}" r="${yellow[2]}" fill="${C.yellow}"/>` : ""}
${ring ? `<circle cx="${ring[0]}" cy="${ring[1]}" r="${ring[2]}" fill="none" stroke="${C.blue}" stroke-opacity="0.12" stroke-width="40"/>` : ""}
${ring2 ? `<circle cx="${ring2[0]}" cy="${ring2[1]}" r="${ring2[2]}" fill="none" stroke="${C.yellow}" stroke-opacity="0.5" stroke-width="26"/>` : ""}
${content}
</svg>`;
}

export function t(x, y, s, o = {}) {
  return `<text x="${x}" y="${y}" font-family="${F}" font-size="${o.size ?? 16}" font-weight="${o.w ?? 400}" fill="${o.fill ?? C.black}"${o.a ? ` text-anchor="${o.a}"` : ""}${o.op != null ? ` fill-opacity="${o.op}"` : ""}${o.ls != null ? ` letter-spacing="${o.ls}"` : ""}${o.dir ? ` direction="${o.dir}"` : ""}>${esc(s)}</text>`;
}

export function rect(x, y, w, h, o = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 16}" fill="${o.fill ?? C.white}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw ?? 2}"` : ""}${o.shadow ? ` filter="url(#${o.shadow === true ? "shadow" : o.shadow})"` : ""}${o.op != null ? ` fill-opacity="${o.op}"` : ""}${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`;
}

export const circle = (cx, cy, r, fill, extra = "") => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;

const ICONS = {
  check: "M5 12.5l4.5 4.5L19 7.5",
  wifiOff: "M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M3 3l18 18M12 20h.01",
  sync: "M21 12a9 9 0 0 1-15.5 6.2M3 12a9 9 0 0 1 15.5-6.2M18.5 2v4h-4M5.5 22v-4h4",
  trend: "M3 17l6-6 4 4 8-8M15 7h6v6",
  globe: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
  code: "M8 6l-6 6 6 6M16 6l6 6-6 6",
  star: "M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4l-5.5 2.9 1-6.2L3 9.7l6.2-.9z",
  bell: "M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
  file: "M6 2h8l5 5v15H6zM14 2v5h5M9 13h7M9 17h7",
  cart: "M3 4h2l2.5 11h11l2-8H6.5M9 20h.01M18 20h.01",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a7 7 0 0 1 14 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a7 7 0 0 0-4-6.3",
  box: "M3 7.5l9-4.5 9 4.5v9l-9 4.5-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9",
  chart: "M4 20V11M10 20V5M16 20v-7M2 20h20",
  calc: "M5 2h14v20H5zM8 6h8v4H8zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  scan: "M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3M7 12h10",
  building: "M4 21V6l8-3 8 3v15M9 21v-5h6v5M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01",
  cloud: "M7 18a5 5 0 1 1 1.1-9.9A6 6 0 0 1 19.5 10 4 4 0 0 1 19 18z",
  rocket: "M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M9 13l-2-2c2-6 7-9 13-9 0 6-3 11-9 13zM15 7.01h.01",
  globeSearch: "M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM21 21l-5-5",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
  truck: "M2 6h12v10H2zM14 9h4l4 4v3h-8M6 19a2 2 0 1 0 0-.01M18 19a2 2 0 1 0 0-.01",
  pin: "M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11zM12 7.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5",
  receipt: "M5 2h14v20l-3-2-2 2-2-2-2 2-2-2-3 2zM9 7h6M9 11h6M9 15h4",
  percent: "M19 5L5 19M7 5a2 2 0 1 0 0 4a2 2 0 1 0 0-4zM17 15a2 2 0 1 0 0 4a2 2 0 1 0 0-4z",
  clock: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7v5l3 3",
  zap: "M13 2L4 14h7l-1 8 9-12h-7z",
  smartphone: "M7 2h10v20H7zM11 18h2",
  monitor: "M2 4h20v13H2zM8 21h8M12 17v4",
};

/** Lucide-style stroke icon drawn in a size×size box at (x,y). */
export function icon(name, x, y, size = 24, color = C.black, sw = 2.2) {
  const s = size / 24;
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[name]}"/></g>`;
}

/** Floating info chip: icon bubble + title + subtitle. */
export function chip(x, y, { w = 260, icon: ic = "check", iconColor = C.greenD, iconBg = C.greenL, title, sub, dark = false }) {
  return `${rect(x, y, w, 80, { rx: 22, fill: dark ? C.black : C.white, shadow: "soft" })}
${circle(x + 42, y + 40, 22, iconBg)}
${icon(ic, x + 30, y + 28, 24, iconColor, 2.4)}
${t(x + 76, y + 36, title, { size: 17, w: 700, fill: dark ? C.white : C.black })}
${sub ? t(x + 76, y + 60, sub, { size: 14, fill: dark ? C.white : C.muted, op: dark ? 0.7 : 1 }) : ""}`;
}

/** Phone frame. inner({x,y,w,h}) draws the screen contents (clipped). */
export function phone(x, y, w, h, inner, { frame = C.black } = {}) {
  const cid = id("ph");
  const s = { x: x + 14, y: y + 14, w: w - 28, h: h - 28 };
  const r = Math.round(w * 0.14);
  return `<g filter="url(#shadow)">${rect(x, y, w, h, { rx: r, fill: frame })}</g>
<clipPath id="${cid}"><rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${r - 12}"/></clipPath>
${rect(s.x, s.y, s.w, s.h, { rx: r - 12, fill: C.white })}
<g clip-path="url(#${cid})">${inner(s)}${rect(x + w / 2 - w * 0.13, s.y + 10, w * 0.26, 16, { rx: 8, fill: C.black })}</g>`;
}

/** Laptop. inner({x,y,w,h}) draws the screen contents (clipped). */
export function laptop(x, y, w, inner) {
  const cid = id("lp");
  const h = Math.round(w * 0.6);
  const s = { x: x + 16, y: y + 16, w: w - 32, h: h - 32 };
  return `<g filter="url(#shadow)">${rect(x, y, w, h, { rx: 22, fill: C.black })}
<path d="M${x - w * 0.09} ${y + h + 4} h${w * 1.18} l-${w * 0.04} 26 h-${w * 1.1} z" fill="${C.grey}"/></g>
<path d="M${x + w / 2 - 70} ${y + h + 4} h140 l-8 10 h-124 z" fill="#B9C0D3"/>
<clipPath id="${cid}"><rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="8"/></clipPath>
${rect(s.x, s.y, s.w, s.h, { rx: 8, fill: C.white })}
<g clip-path="url(#${cid})">${inner(s)}</g>`;
}

/** Browser / app window card with a title bar. */
export function windowCard(x, y, w, h, inner, { title = "", dark = false } = {}) {
  const cid = id("wc");
  return `${rect(x, y, w, h, { rx: 22, fill: dark ? C.black : C.white, shadow: true })}
<clipPath id="${cid}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22"/></clipPath>
<g clip-path="url(#${cid})">
${rect(x, y, w, 50, { rx: 0, fill: dark ? "#1B1B25" : C.greyL })}
${circle(x + 26, y + 25, 7, "#FF6B6B")}${circle(x + 48, y + 25, 7, C.yellow)}${circle(x + 70, y + 25, 7, C.green)}
${title ? rect(x + 100, y + 13, Math.min(320, w - 140), 24, { rx: 12, fill: dark ? "#2A2A36" : C.white }) + t(x + 116, y + 30, title, { size: 13, fill: dark ? C.white : C.muted, op: dark ? 0.7 : 1 }) : ""}
${inner({ x, y: y + 50, w, h: h - 50 })}
</g>`;
}

/** Skeleton text lines. */
export function lines(x, y, widths, { gap = 18, h = 8, fill = C.grey } = {}) {
  return widths.map((w, i) => rect(x, y + i * gap, w, h, { rx: h / 2, fill })).join("");
}

/** Vertical bar chart. */
export function bars(x, y, w, h, vals, { color = C.blue, hl = -1, hlColor = C.yellow, gap = 0.4 } = {}) {
  const bw = w / (vals.length + (vals.length - 1) * gap);
  const max = Math.max(...vals);
  return vals
    .map((v, i) => {
      const bh = (v / max) * h;
      return rect(x + i * bw * (1 + gap), y + h - bh, bw, bh, { rx: Math.min(8, bw / 2), fill: i === hl ? hlColor : color });
    })
    .join("");
}

/** Donut chart from segment values. */
export function donut(cx, cy, r, segs, sw = 22) {
  const total = segs.reduce((a, s) => a + s.v, 0);
  const circ = 2 * Math.PI * r;
  let off = 0;
  const parts = segs.map((s) => {
    const len = (s.v / total) * circ;
    const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${sw}" stroke-dasharray="${len} ${circ - len}" stroke-dashoffset="${-off}" transform="rotate(-90 ${cx} ${cy})"/>`;
    off += len;
    return el;
  });
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.greyL}" stroke-width="${sw}"/>${parts.join("")}`;
}

/** Smooth line path through points. */
export function lineChart(x, y, w, h, vals, { color = C.blue, fillArea = true, sw = 5 } = {}) {
  const max = Math.max(...vals), min = Math.min(...vals);
  const pts = vals.map((v, i) => [x + (i / (vals.length - 1)) * w, y + h - ((v - min) / (max - min || 1)) * h]);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1], [cx, cy] = pts[i];
    const mx = (px + cx) / 2;
    d += ` C${mx} ${py} ${mx} ${cy} ${cx} ${cy}`;
  }
  const area = fillArea ? `<path d="${d} L${x + w} ${y + h} L${x} ${y + h} Z" fill="${color}" fill-opacity="0.10"/>` : "";
  const last = pts[pts.length - 1];
  return `${area}<path d="${d}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>${circle(last[0], last[1], 8, C.white, `stroke="${color}" stroke-width="4"`)}`;
}

/** Deterministic barcode stripes. */
export function barcode(x, y, w, h, color = C.black) {
  const pattern = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 1, 2, 1, 1, 3, 1];
  const unit = w / pattern.reduce((a, b) => a + b + 1, 0);
  let cx = x;
  return pattern
    .map((p, i) => {
      const el = i % 2 === 0 ? `<rect x="${cx}" y="${y}" width="${p * unit}" height="${h}" fill="${color}"/>` : "";
      cx += (p + 1) * unit;
      return el;
    })
    .join("");
}

/** Storage box (white with blue tape and optional barcode label). */
export function box(x, y, w, h, { label = true, tape = C.blue } = {}) {
  return `${rect(x, y, w, h, { rx: 10, fill: C.white, shadow: "soft" })}
${rect(x, y, w, h * 0.16, { rx: 0, fill: C.greyL })}
${rect(x + w / 2 - w * 0.07, y, w * 0.14, h * 0.45, { rx: 0, fill: tape, op: 0.85 })}
${label ? rect(x + w * 0.14, y + h * 0.56, w * 0.46, h * 0.3, { rx: 4, fill: C.white, stroke: C.grey, sw: 2 }) + barcode(x + w * 0.18, y + h * 0.6, w * 0.38, h * 0.18) : ""}`;
}

/** Handheld barcode scanner pointing left; beam goes to (tx,ty). */
export function scanner(x, y, s = 1, beamTo) {
  const beam = beamTo
    ? `<path d="M${x + 10 * s} ${y + 30 * s} L${beamTo[0]} ${beamTo[1] - 46} L${beamTo[0]} ${beamTo[1] + 46} Z" fill="${C.blue}" fill-opacity="0.14"/>
<line x1="${beamTo[0]}" y1="${beamTo[1] - 46}" x2="${beamTo[0]}" y2="${beamTo[1] + 46}" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>`
    : "";
  return `${beam}<g transform="translate(${x} ${y}) scale(${s})" filter="url(#shadow)">
<path d="M0 10 q0 -10 10 -10 h150 q22 0 22 22 v24 q0 22 -22 22 h-60 l30 120 q4 18 -14 22 l-22 5 q-16 3 -20 -12 l-34 -135 h-30 q-10 0 -10 -10 z" fill="${C.black}"/>
<rect x="6" y="14" width="26" height="34" rx="6" fill="${C.blue}"/>
<path d="M108 74 l14 40 q2 8 -6 10 l-6 1 l-14 -48 z" fill="${C.yellow}"/>
<rect x="56" y="18" width="80" height="20" rx="6" fill="#2A2A36"/>
<circle cx="150" cy="28" r="6" fill="${C.green}"/>
</g>`;
}

/** Simple shop front with striped awning. */
export function shop(x, y, w = 200, h = 150, { awning = C.yellow } = {}) {
  const n = 6, seg = (w + 20) / n;
  let wave = `M${x - 10} ${y}`;
  for (let i = 0; i < n; i++) wave += ` q${seg / 2} 26 ${seg} 0`;
  return `<g filter="url(#soft)">${rect(x, y, w, h, { rx: 14, fill: C.white })}</g>
${rect(x + w * 0.18, y + h * 0.43, w * 0.28, h * 0.57, { rx: 6, fill: C.blueL })}
${rect(x + w * 0.56, y + h * 0.43, w * 0.31, h * 0.31, { rx: 6, fill: C.blueL })}
<path d="M${x - 10} ${y} h${w + 20} l-12 -44 h-${w - 4} z" fill="${C.black}"/>
<path d="${wave} z" fill="${awning}"/>`;
}

/** Map pin. */
export function pin(x, y, s = 1, color = C.blue) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 c-26 0 -46 20 -46 45 c0 34 46 75 46 75 s46 -41 46 -75 c0 -25 -20 -45 -46 -45 z" fill="${color}"/><circle cx="0" cy="45" r="16" fill="${C.white}"/></g>`;
}

/** Small delivery van (side view). */
export function van(x, y, s = 1, { body = C.blue, logo = true } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
<ellipse cx="350" cy="342" rx="380" ry="20" fill="${C.black}" fill-opacity="0.08"/>
<g filter="url(#shadow)"><rect x="0" y="0" width="490" height="290" rx="26" fill="${body}"/>
<path d="M482 80 h96 q22 0 36 18 l64 88 q10 14 10 30 v58 q0 16 -16 16 h-190 z" fill="${body}"/></g>
<path d="M506 104 h66 q12 0 19 10 l52 72 h-137 z" fill="${C.blueL}"/>
<rect x="0" y="208" width="690" height="26" fill="${C.yellow}"/>
<rect x="676" y="246" width="16" height="26" rx="6" fill="${C.yellow}"/>
${logo ? `<text x="44" y="116" font-family="${F}" font-weight="800" font-size="84" letter-spacing="-3" fill="#FFFFFF">Zylo</text><circle cx="218" cy="107" r="11" fill="${C.yellow}"/>` : ""}
<rect x="-10" y="276" width="710" height="22" rx="11" fill="${C.black}"/>
<circle cx="130" cy="292" r="56" fill="${C.black}"/><circle cx="130" cy="292" r="24" fill="${C.grey}"/><circle cx="130" cy="292" r="8" fill="${C.black}"/>
<circle cx="572" cy="292" r="56" fill="${C.black}"/><circle cx="572" cy="292" r="24" fill="${C.grey}"/><circle cx="572" cy="292" r="8" fill="${C.black}"/>
</g>`;
}

/** Dashed connector line. */
export const dash = (d, color = C.blue, w = 5) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="2 16"/>`;

/** Module tile: icon + label (used for ERP modules). */
export function tile(x, y, label, ic, { w = 190, accent = false } = {}) {
  return `${rect(x, y, w, 76, { rx: 20, fill: accent ? C.black : C.white, shadow: "soft" })}
${rect(x + 14, y + 16, 44, 44, { rx: 14, fill: accent ? C.yellow : C.blueXL })}
${icon(ic, x + 24, y + 26, 24, accent ? C.black : C.blue, 2.4)}
${t(x + 72, y + 45, label, { size: 18, w: 700, fill: accent ? C.white : C.black })}`;
}

/** KPI mini card. */
export function kpi(x, y, w, label, value, delta, { dark = false } = {}) {
  return `${rect(x, y, w, 96, { rx: 16, fill: dark ? "#1B1B25" : C.bg })}
${t(x + 16, y + 30, label, { size: 13, fill: dark ? C.white : C.muted, op: dark ? 0.7 : 1 })}
${t(x + 16, y + 62, value, { size: 24, w: 800, fill: dark ? C.white : C.black })}
${delta ? t(x + 16, y + 84, delta, { size: 12, w: 700, fill: C.greenD }) : ""}`;
}
