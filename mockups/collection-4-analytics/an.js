// Collection 04 helpers: panel tabs, hover tooltips and two small SVG charts.

const PANELS = [
  ["01-overview.html", "Overview"],
  ["02-funnel.html", "Funnel"],
  ["03-channels.html", "Channels"],
  ["04-activation.html", "Activation"],
  ["05-share-loop.html", "Share loop"],
  ["06-workspaces.html", "Workspaces & limits"],
  ["07-quality.html", "Core quality"],
  ["08-costs.html", "Costs"],
];

// Tabs + prototype nav, built from PANELS so every screen stays in sync.
(function chrome() {
  const here = location.pathname.split("/").pop();
  const tabs = document.querySelector(".tabs");
  if (tabs) {
    tabs.innerHTML = PANELS.map(([href, name]) =>
      `<a href="${href}"${href === here ? ' aria-current="page"' : ""}>${name}</a>`).join("");
  }
  const i = PANELS.findIndex(([href]) => href === here);
  if (i >= 0) {
    const prev = PANELS[i - 1], next = PANELS[i + 1];
    const nav = document.createElement("nav");
    nav.className = "proto-nav";
    nav.setAttribute("aria-label", "Prototype");
    nav.innerHTML = (prev ? `<a href="${prev[0]}">← Back</a>` : "") +
      `<a href="index.html">Collection</a>` + (next ? `<a href="${next[0]}">Next →</a>` : "");
    document.body.appendChild(nav);
  }
  // Segmented filters are cosmetic in the mockup: just move the pressed state.
  document.querySelectorAll(".seg").forEach(seg => seg.addEventListener("click", e => {
    if (e.target.tagName !== "BUTTON") return;
    seg.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === e.target));
  }));
})();

// One tooltip for the page. Anything with data-tip gets it on hover.
const tip = document.createElement("div");
tip.className = "tip";
document.body.appendChild(tip);
function showTip(html, x, y) {
  tip.innerHTML = html;
  tip.classList.add("on");
  const w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = Math.min(x + 14, innerWidth - w - 8) + "px";
  tip.style.top = (y - h - 12 < 8 ? y + 16 : y - h - 12) + "px";
}
function hideTip() { tip.classList.remove("on"); }
document.addEventListener("mousemove", e => {
  const t = e.target.closest && e.target.closest("[data-tip]");
  if (t) showTip(t.dataset.tip, e.clientX, e.clientY);
  else if (!e.target.closest || !e.target.closest(".chart-hover")) hideTip();
});

const fmt = n => n.toLocaleString("en-US");
const svgNS = "http://www.w3.org/2000/svg";

function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= v) return m * p;
  return v;
}

function frame(el, W, H, pad, yMax, unit = "") {
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "chart");
  svg.setAttribute("role", "img");
  let g = "";
  for (let k = 0; k <= 4; k++) {
    const v = (yMax / 4) * k, y = H - pad.b - (v / yMax) * (H - pad.t - pad.b);
    g += `<line class="gl" x1="${pad.l}" x2="${W - pad.r}" y1="${y}" y2="${y}"/>` +
      `<text class="ax" x="${pad.l - 8}" y="${y + 4}" text-anchor="end">${unit}${fmt(v)}</text>`;
  }
  svg.innerHTML = g;
  el.appendChild(svg);
  return svg;
}

// Line chart with crosshair tooltip. opts: labels, series[{name,color,values}], target{value,label}
function lineChart(el, opts) {
  const W = Math.max(320, el.clientWidth), H = 240, pad = { t: 16, r: 56, b: 28, l: 40 };
  const all = opts.series.flatMap(s => s.values.filter(v => v != null));
  const yMax = niceMax(Math.max(...all, opts.target ? opts.target.value : 0) * 1.05);
  const svg = frame(el, W, H, pad, yMax, opts.unit);
  const n = opts.labels.length;
  const x = i => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
  const y = v => H - pad.b - (v / yMax) * (H - pad.t - pad.b);
  let s = "";
  opts.labels.forEach((l, i) => {
    const every = Math.ceil(n * 56 / (W - pad.l - pad.r));
    if ((n - 1 - i) % every === 0)
      s += `<text class="ax" x="${x(i)}" y="${H - 8}" text-anchor="middle">${l}</text>`;
  });
  if (opts.target) {
    s += `<line class="tg" x1="${pad.l}" x2="${W - pad.r}" y1="${y(opts.target.value)}" y2="${y(opts.target.value)}"/>` +
      `<text class="ax" x="${W - pad.r + 6}" y="${y(opts.target.value) + 4}">${opts.target.label}</text>`;
  }
  opts.series.forEach(se => {
    const pts = se.values.map((v, i) => v == null ? null : [x(i), y(v)]).filter(Boolean);
    s += `<path class="ln" stroke="${se.color}" ${se.dashed ? 'stroke-dasharray="5 5"' : ""} d="M${pts.map(p => p.join(",")).join("L")}"/>`;
    const last = pts[pts.length - 1];
    s += `<circle cx="${last[0]}" cy="${last[1]}" r="4" fill="${se.color}" stroke="var(--surface)" stroke-width="2"/>`;
    if (se.label !== false) s += `<text class="dl" x="${last[0] + 8}" y="${last[1] + 4}">${fmt(se.values.filter(v => v != null).pop())}</text>`;
  });
  s += `<line class="xh" x1="0" x2="0" y1="${pad.t}" y2="${H - pad.b}" stroke="var(--line-strong)" visibility="hidden"/>`;
  s += `<rect class="chart-hover" x="${pad.l}" y="0" width="${W - pad.l - pad.r}" height="${H}" fill="transparent"/>`;
  svg.insertAdjacentHTML("beforeend", s);
  const xh = svg.querySelector(".xh"), hit = svg.querySelector(".chart-hover");
  hit.addEventListener("mousemove", e => {
    const r = svg.getBoundingClientRect();
    const px = (e.clientX - r.left) * (W / r.width);
    const i = Math.max(0, Math.min(n - 1, Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (n - 1))));
    xh.setAttribute("x1", x(i)); xh.setAttribute("x2", x(i)); xh.setAttribute("visibility", "visible");
    const rows = opts.series.filter(se => se.values[i] != null)
      .map(se => `<span style="color:${se.color}">■</span> ${se.name}: <b>${opts.unit || ""}${fmt(se.values[i])}</b>`).join("<br>");
    showTip(`<b>${opts.labels[i]}</b><br>${rows}`, e.clientX, e.clientY);
  });
  hit.addEventListener("mouseleave", () => { xh.setAttribute("visibility", "hidden"); hideTip(); });
}

// Stacked columns, 2px surface gap between segments. opts: labels, series[{name,color,values}], unit
function stackedBars(el, opts) {
  const W = Math.max(320, el.clientWidth), H = 260, pad = { t: 16, r: 12, b: 28, l: 48 };
  const totals = opts.labels.map((_, i) => opts.series.reduce((a, s) => a + s.values[i], 0));
  const yMax = niceMax(Math.max(...totals) * 1.05);
  const svg = frame(el, W, H, pad, yMax, opts.unit);
  const n = opts.labels.length, slot = (W - pad.l - pad.r) / n, bw = Math.min(48, slot * 0.6);
  const every = Math.ceil(56 / slot);
  const h = v => (v / yMax) * (H - pad.t - pad.b);
  let s = "";
  opts.labels.forEach((l, i) => {
    const cx = pad.l + slot * i + slot / 2;
    let base = H - pad.b;
    opts.series.forEach((se, k) => {
      const hh = h(se.values[i]);
      const top = k === opts.series.length - 1;
      const tipText = `<b>${l}</b><br>${se.name}: <b>${opts.unit || ""}${fmt(se.values[i])}</b><br>Total: ${opts.unit || ""}${fmt(totals[i])}`;
      s += `<rect data-tip="${tipText.replace(/"/g, "&quot;")}" x="${cx - bw / 2}" y="${base - hh + (k ? 0 : 0)}" width="${bw}" height="${Math.max(0, hh - 2)}" rx="${top ? 4 : 0}" fill="${se.color}"/>`;
      base -= hh;
    });
    if ((n - 1 - i) % every === 0) s += `<text class="ax" x="${cx}" y="${H - 8}" text-anchor="middle">${l}</text>`;
  });
  svg.insertAdjacentHTML("beforeend", s);
}
