// ==UserScript==
// @name         FGUESSER
// @namespace    fz-fguesser
// @version      1.1.0
// @description  FGUESSER - map cheat for GeoGuessr and OpenGuessr with real location reveal and fast map pin
// @homepage     https://github.com/foltzbr/FGUESSER
// @supportURL   https://github.com/foltzbr/FGUESSER/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/foltzbr/FGUESSER/main/FGUESSER.user.js
// @updateURL    https://raw.githubusercontent.com/foltzbr/FGUESSER/main/FGUESSER.user.js
// @match        https://www.geoguessr.com/*
// @match        https://openguessr.com/*
// @match        https://www.openguessr.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
let S = { lat: 0, lng: 0, pinLat: 0, pinLng: 0, lang: localStorage.getItem("fg_lang") || "en" };
const L = {
en: { country: "COUNTRY", region: "REGION", city: "CITY", waiting: "waiting for game…", locating: "locating…", sv: "Street View", maps: "Maps", copy: "Copy", pin: "PIN ON MAP", copied: "copied", pinned: "pin placed" },
pt: { country: "PAÍS", regiao: "REGIÃO", cidade: "CIDADE", waiting: "aguardando partida…", locating: "localizando…", sv: "Street View", maps: "Maps", copy: "Copiar", pin: "PIN NO MAPA", copied: "copiado", pinned: "pin marcado" },
es: { country: "PAÍS", region: "REGIÓN", city: "CIUDAD", waiting: "esperando partida…", locating: "localizando…", sv: "Street View", maps: "Maps", copy: "Copiar", pin: "PIN EN MAPA", copied: "copiado", pinned: "pin marcado" }
};
function t(k) { return (L[S.lang] && L[S.lang][k]) || L.en[k] || k; }
function flag(cc) { if (!cc) return ""; return cc.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0))); }
async function getPlace(lat, lng) {
try {
let j = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2&accept-language=${S.lang}`).then(r => r.json());
if (j && j.address) { let a = j.address; return { pais: a.country || "—", cc: (a.country_code || "").toUpperCase(), regiao: a.state || a.region || a.county || "—", cidade: a.city || a.town || a.village || a.municipality || a.county || "—" }; }
} catch (e) {}
try {
let r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${S.lang}`).then(r => r.json());
return { pais: r.countryName || "—", cc: r.countryCode || "", regiao: r.principalSubdivision || "—", cidade: r.city || r.locality || "—" };
} catch (e) {}
return { pais: "—", cc: "", regiao: "—", cidade: "—" };
}
function ensureCss() {
if (document.getElementById("fg-css")) return;
let s = document.createElement("style"); s.id = "fg-css";
s.textContent = `#fguesser{position:fixed;top:64px;left:10px;z-index:999999;width:304px;background:#0d1117;border:1px solid #212c3a;border-radius:12px;color:#dbe4ee;font-family:Inter,Segoe UI,Arial,sans-serif;font-size:13px;box-shadow:0 8px 30px rgba(0,0,0,.5);overflow:hidden}
#fg-h{padding:9px 11px;display:flex;justify-content:space-between;align-items:center;background:#131a24;border-bottom:1px solid #212c3a;cursor:move}
#fg-h b{font-size:12px;letter-spacing:2px}#fg-dot{width:8px;height:8px;border-radius:50%;background:#555;display:inline-block;margin-right:6px}
#fg-lang{background:#0d1117;color:#dbe4ee;border:1px solid #2a3a4f;border-radius:6px;font-size:11px;padding:2px 4px}
#fg-b{padding:11px}#fg-l{line-height:1.7}#fg-l span{color:#7d8aa0;font-size:11px;display:inline-block;width:68px}
#fg-c{font-family:ui-monospace,monospace;font-size:11px;color:#9fb2c8;margin-top:4px}
#fg-row{display:flex;gap:6px;margin-top:10px}#fg-row button{flex:1;background:#1b2534;color:#dbe4ee;border:1px solid #2a3a4f;border-radius:8px;padding:7px 0;font-size:11px;cursor:pointer}
#fg-pin{width:100%;margin-top:6px;background:#e6edf3;color:#000;border:none;border-radius:8px;padding:9px;font-weight:700;font-size:12px;cursor:pointer}
#fg-map{width:100%;height:150px;border:0;border-radius:8px;margin-top:10px;background:#000}
#fg-msg{font-size:11px;color:#7d8aa0;margin-top:7px;min-height:14px}.fg-pin-icon{background:none!important;border:none!important}`;
document.head.appendChild(s);
}
function mk() {
ensureCss(); if (document.getElementById("fguesser")) return;
let d = document.createElement("div"); d.id = "fguesser";
d.innerHTML = `<div id="fg-h"><div><span id="fg-dot"></span><b>FGUESSER</b></div><div><select id="fg-lang"><option value="en">EN</option><option value="pt">PT</option><option value="es">ES</option></select> <button id="fg-hide" style="background:none;border:none;color:#7d8aa0;cursor:pointer">—</button></div></div><div id="fg-b"><div id="fg-l"><div><span id="lb-c">COUNTRY</span><b id="fg-pais">waiting for game…</b></div><div><span id="lb-r">REGION</span><b id="fg-reg">—</b></div><div><span id="lb-ci">CITY</span><b id="fg-cid">—</b></div></div><div id="fg-c">—</div><div id="fg-row"><button id="fg-b1">Street View</button><button id="fg-b2">Maps</button><button id="fg-b3">Copy</button></div><button id="fg-pin" disabled>PIN ON MAP</button><iframe id="fg-map" src="about:blank"></iframe><div id="fg-msg"></div></div>`;
(document.body || document.documentElement).appendChild(d);
document.getElementById("fg-lang").value = S.lang;
document.getElementById("fg-lang").onchange = e => { S.lang = e.target.value; localStorage.setItem("fg_lang", S.lang); applyLang(); };
document.getElementById("fg-hide").onclick = () => { let b = document.getElementById("fg-b"); b.style.display = b.style.display === "none" ? "block" : "none"; };
document.getElementById("fg-b1").onclick = () => { if (S.lat) window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${S.lat},${S.lng}`, "_blank"); };
document.getElementById("fg-b2").onclick = () => { if (S.lat) window.open(`https://www.google.com/maps/search/?api=1&query=${S.lat},${S.lng}`, "_blank"); };
document.getElementById("fg-b3").onclick = () => { if (S.lat) { navigator.clipboard.writeText(`${S.lat}, ${S.lng}`); document.getElementById("fg-msg").textContent = t("copied"); } };
document.getElementById("fg-pin").onclick = markPin;
let h = document.getElementById("fg-h"), dr = false, ox = 0, oy = 0;
h.onmousedown = e => { dr = true; ox = e.clientX - d.offsetLeft; oy = e.clientY - d.offsetTop; };
document.onmouseup = () => dr = false;
document.onmousemove = e => { if (dr) { d.style.left = (e.clientX - ox) + "px"; d.style.top = (e.clientY - oy) + "px"; } };
applyLang();
}
function applyLang() {
let lbc = document.getElementById("lb-c"); if (lbc) lbc.textContent = t("country") || "COUNTRY";
let lbr = document.getElementById("lb-r"); if (lbr) lbr.textContent = L[S.lang].region || L[S.lang].regiao || "REGION";
let lbci = document.getElementById("lb-ci"); if (lbci) lbci.textContent = L[S.lang].city || L[S.lang].cidade || "CITY";
let b1 = document.getElementById("fg-b1"); if (b1) b1.textContent = t("sv");
let b2 = document.getElementById("fg-b2"); if (b2) b2.textContent = t("maps");
let b3 = document.getElementById("fg-b3"); if (b3) b3.textContent = t("copy");
let p = document.getElementById("fg-pin"); if (p) p.textContent = t("pin");
}
async function found(lat, lng) {
S.lat = lat; S.lng = lng; mk(); clearPin();
document.getElementById("fg-dot").style.background = "#00d26a";
document.getElementById("fg-c").textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
document.getElementById("fg-pais").textContent = t("locating");
document.getElementById("fg-pin").disabled = false;
document.getElementById("fg-map").src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}&layer=mapnik&marker=${lat},${lng}`;
let p = await getPlace(lat, lng);
if (lat !== S.lat) return;
document.getElementById("fg-pais").textContent = `${flag(p.cc)} ${p.pais}`;
document.getElementById("fg-reg").textContent = p.regiao;
document.getElementById("fg-cid").textContent = p.cidade;
}
function tilePos(lat, lng) {
let imgs = document.querySelectorAll(".leaflet-tile-pane img");
for (let i = 0; i < imgs.length; i++) {
let src = imgs[i].currentSrc || imgs[i].src || "";
let tx = null, ty = null, tz = null;
try {
let u = new URL(src, location.origin);
tx = u.searchParams.get("x"); ty = u.searchParams.get("y"); tz = u.searchParams.get("z");
if (tx === null || ty === null || tz === null) {
let q = src.match(/[?&]x=(\d+)[^]*?[?&]y=(\d+)[^]*?[?&]z=(\d+)/);
if (q) { tx = q[1]; ty = q[2]; tz = q[3]; }
}
if (tx === null || ty === null || tz === null) {
let m = u.pathname.match(/\/(\d+)\/(\d+)\/(\d+)\.[a-z]+$/i);
if (m) { tz = m[1]; tx = m[2]; ty = m[3]; }
}
} catch (e) { continue; }
if (tx === null || ty === null || tz === null) continue;
tx = +tx; ty = +ty; tz = +tz;
if (!isFinite(tx) || !isFinite(ty) || !isFinite(tz) || tz < 0 || tz > 22) continue;
let r = imgs[i].getBoundingClientRect();
if (!r.width || !r.height) continue;
let n = Math.pow(2, tz);
let lr = lat * Math.PI / 180;
let wx = (lng + 180) / 360 * n * 256;
let wy = (1 - Math.log(Math.tan(lr) + 1 / Math.cos(lr)) / Math.PI) / 2 * n * 256;
let sx = r.left + (wx - tx * 256) / 256 * r.width;
let sy = r.top + (wy - ty * 256) / 256 * r.height;
if (!isFinite(sx) || !isFinite(sy)) continue;
return { x: sx, y: sy };
}
return null;
}
function mapCanvas() { return document.querySelector('[class^="guess-map_canvas__"]') || document.querySelector('div[class*="guess-map"] canvas') || document.querySelector('.leaflet-container') || document.querySelector('#map canvas') || document.querySelector('canvas'); }
function hasProj(o) { return o && (o.getProjection || o.latLngToContainerPoint); }
function pickMap(o) {
if (!o || typeof o !== 'object') return null;
if (o.getProjection || o.latLngToContainerPoint) return o;
if (hasProj(o.map)) return o.map;
if (hasProj(o.leafletMap)) return o.leafletMap;
if (hasProj(o._map)) return o._map;
return null;
}
function findMap(c) {
try {
let k = Object.keys(c).find(k => k.startsWith("__reactFiber$") || k.startsWith("__reactProps$"));
let root = c[k]; let q = [root]; let seen = new Set(); let n = 0;
while (q.length && n < 140) { n++; let cur = q.shift(); if (!cur || seen.has(cur)) continue; seen.add(cur);
let m = pickMap(cur.memoizedProps) || pickMap(cur.stateNode) || pickMap(cur.memoizedState);
if (m) return m;
if (cur.return) q.push(cur.return); if (cur.child) q.push(cur.child); if (cur.sibling) q.push(cur.sibling); }
} catch (e) {}
return null;
}
function calcPos(lat, lng, c) {
let map = findMap(c); if (!map) return null;
try {
if (map.latLngToContainerPoint) {
let p = map.latLngToContainerPoint([lat, lng]);
let ox = c.offsetLeft || 0, oy = c.offsetTop || 0;
return { x: ox + p.x, y: oy + p.y };
}
let z = map.getZoom(), sc = Math.pow(2, z);
let px = (lng + 180) / 360 * 256 * sc;
let py = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * 256 * sc;
let ct = map.getCenter(), r = c.getBoundingClientRect();
let cx = (ct.lng() + 180) / 360 * 256 * sc;
let cy = (1 - Math.log(Math.tan(ct.lat() * Math.PI / 180) + 1 / Math.cos(ct.lat() * Math.PI / 180)) / Math.PI) / 2 * 256 * sc;
return { x: (px - cx) + r.width / 2, y: (py - cy) + r.height / 2 };
} catch (e) { return null; }
}
let fgLeafletMaps = [], fgMarker = null, fgMarkerFor = "";
function captureLeaflet() {
try {
if (window.L && window.L.Map && window.L.Map.prototype && !window.L.Map.prototype.__fgPatched) {
window.L.Map.prototype.__fgPatched = true;
let origInit = window.L.Map.prototype.initialize;
window.L.Map.prototype.initialize = function () {
try { fgLeafletMaps.push(this); if (fgLeafletMaps.length > 20) fgLeafletMaps = fgLeafletMaps.slice(-20); } catch (e) {}
return origInit.apply(this, arguments);
};
}
} catch (e) {}
}
setInterval(captureLeaflet, 500); captureLeaflet();
function leafletMap() {
try {
if (!window.L) return null;
fgLeafletMaps = fgLeafletMaps.filter(m => { try { let el = m.getContainer(); return el && el.isConnected; } catch (e) { return false; } });
let best = null, area = 0;
for (let m of fgLeafletMaps) {
try {
let r = m.getContainer().getBoundingClientRect();
if (r.width > 10 && r.height > 10 && r.width * r.height > area) { area = r.width * r.height; best = m; }
} catch (e) {}
}
return best;
} catch (e) { return null; }
}
function placeLeafletPin() {
if (!S.pinLat) return false;
let key = S.pinLat + "," + S.pinLng;
if (fgMarker && fgMarkerFor === key) return true;
let m = leafletMap(); if (!m) return false;
try {
if (fgMarker) { try { fgMarker.remove(); } catch (e) {} fgMarker = null; }
let html = '<div style="width:18px;height:18px;background:#ff3b30;border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.5)"></div>';
fgMarker = window.L.marker([S.pinLat, S.pinLng], { icon: window.L.divIcon({ className: "fg-pin-icon", html: html, iconSize: [18, 18], iconAnchor: [9, 17] }), interactive: false, keyboard: false }).addTo(m);
fgMarkerFor = key;
return true;
} catch (e) { return false; }
}
let pinEl = null, pinMode = "";
function clearPin() { if (pinEl) { pinEl.remove(); pinEl = null; } if (fgMarker) { try { fgMarker.remove(); } catch (e) {} fgMarker = null; } fgMarkerFor = ""; S.pinLat = 0; S.pinLng = 0; pinMode = ""; }
function pinCss(mode) { return `position:` + mode + `;width:18px;height:18px;background:#ff3b30;border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);z-index:99999;pointer-events:none;box-shadow:0 2px 6px rgba(0,0,0,.5);will-change:left,top`; }
function drawPin() {
if (!S.pinLat) return;
let p = null, mode = "";
let c = mapCanvas();
if (c) { let g = calcPos(S.pinLat, S.pinLng, c); if (g) { p = g; mode = "absolute"; } }
if (!p && placeLeafletPin()) { if (pinEl) { pinEl.remove(); pinEl = null; } pinMode = "leaflet"; return; }
if (!p) { let tp = tilePos(S.pinLat, S.pinLng); if (tp) { p = tp; mode = "fixed"; } }
if (!p) return;
if (!pinEl || pinMode !== mode) {
if (pinEl) pinEl.remove();
if (fgMarker) { try { fgMarker.remove(); } catch (e) {} fgMarker = null; fgMarkerFor = ""; }
pinEl = document.createElement("div");
pinEl.style.cssText = pinCss(mode);
if (mode === "fixed") { if (!document.body) return; document.body.appendChild(pinEl); }
else { c.parentElement.style.position = "relative"; c.parentElement.appendChild(pinEl); }
pinMode = mode;
}
pinEl.style.left = (p.x - 9) + "px"; pinEl.style.top = (p.y - 17) + "px";
}
(function loop() { if (S.pinLat) drawPin(); requestAnimationFrame(loop); })();
function markPin() { if (!S.lat) return; S.pinLat = S.lat; S.pinLng = S.lng; drawPin(); document.getElementById("fg-msg").textContent = t("pinned"); }
function numPair(a, b) {
let la = parseFloat(a), ln = parseFloat(b);
if (!isFinite(la) || !isFinite(ln)) return null;
if (la < -90 || la > 90 || ln < -180 || ln > 180) return null;
return [la, ln];
}
function fromParams(sp) {
let v = sp.get("cbll") || sp.get("location") || sp.get("viewpoint");
if (v) { let s = String(v).split(","); let p = numPair(s[0], s[1]); if (p) return p; }
let q = sp.get("q");
if (q && /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(q.trim())) { let s = q.trim().split(","); return numPair(s[0], s[1]); }
return null;
}
function scanEmbeds() {
let frames = document.getElementsByTagName("iframe");
for (let i = 0; i < frames.length; i++) {
let src = frames[i].getAttribute("src") || frames[i].src || "";
if (src.indexOf("google") < 0 && src.indexOf("maps") < 0) continue;
if (src.indexOf("embed/v1/streetview") < 0 && src.indexOf("layer=c") < 0 && src.indexOf("map_action=pano") < 0 && src.indexOf("cbll") < 0) continue;
try {
let u = new URL(src, location.origin);
let p = fromParams(u.searchParams);
if (p && (p[0] !== S.lat || p[1] !== S.lng)) { found(p[0], p[1]); return; }
} catch (e) {}
}
}
let oOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (m, u) { this._u = u; return oOpen.apply(this, arguments); };
let oSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function () {
this.addEventListener("load", function () {
try {
let u = String(this._u || "");
if (u.includes("GetMetadata") || u.includes("SingleImageSearch") || u.includes("streetview") || u.includes("photometa") || u.includes("panorama")) {
let mt = this.responseText.match(/-?\d+\.\d+,-?\d+\.\d+/g);
if (mt) { let sp = mt[0].split(","); found(parseFloat(sp[0]), parseFloat(sp[1])); }
}
} catch (e) {}
});
return oSend.apply(this, arguments);
};
setInterval(() => { mk(); scanEmbeds(); }, 2000); mk(); scanEmbeds();
try { new MutationObserver(() => scanEmbeds()).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] }); } catch (e) {}
document.addEventListener("keydown", e => {
if (e.key === "1") { let d = document.getElementById("fguesser"); if (d) d.style.display = d.style.display === "none" ? "block" : "none"; }
if (e.key === "6") markPin();
});
})();
