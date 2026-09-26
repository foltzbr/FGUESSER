// ==UserScript==
// @name         FGUESSER
// @namespace    fz-fguesser
// @version      1.0
// @description  FGUESSER - GeoGuessr hack with real location reveal and fast map pin
// @match        https://www.geoguessr.com/*
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
#fg-msg{font-size:11px;color:#7d8aa0;margin-top:7px;min-height:14px}`;
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
let pinEl = null;
function mapCanvas() { return document.querySelector('[class^="guess-map_canvas__"]') || document.querySelector('div[class*="guess-map"] canvas'); }
function findMap(c) {
try {
let k = Object.keys(c).find(k => k.startsWith("__reactFiber$"));
let root = c[k]; let q = [root]; let seen = new Set(); let n = 0;
while (q.length && n < 80) { n++; let cur = q.shift(); if (!cur || seen.has(cur)) continue; seen.add(cur);
if (cur.memoizedProps && cur.memoizedProps.map && cur.memoizedProps.map.getProjection) return cur.memoizedProps.map;
if (cur.stateNode && cur.stateNode.getProjection) return cur.stateNode;
if (cur.return) q.push(cur.return); if (cur.child) q.push(cur.child); if (cur.sibling) q.push(cur.sibling); }
} catch (e) {}
return null;
}
function calcPos(lat, lng, c) {
let map = findMap(c); if (!map) return null;
try {
let z = map.getZoom(), sc = Math.pow(2, z);
let px = (lng + 180) / 360 * 256 * sc;
let py = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * 256 * sc;
let ct = map.getCenter(), r = c.getBoundingClientRect();
let cx = (ct.lng() + 180) / 360 * 256 * sc;
let cy = (1 - Math.log(Math.tan(ct.lat() * Math.PI / 180) + 1 / Math.cos(ct.lat() * Math.PI / 180)) / Math.PI) / 2 * 256 * sc;
return { x: (px - cx) + r.width / 2, y: (py - cy) + r.height / 2 };
} catch (e) { return null; }
}
function clearPin() { if (pinEl) { pinEl.remove(); pinEl = null; } S.pinLat = 0; S.pinLng = 0; }
function drawPin() {
if (!S.pinLat) return;
let c = mapCanvas(); if (!c) return;
let p = calcPos(S.pinLat, S.pinLng, c); if (!p) return;
if (!pinEl) {
pinEl = document.createElement("div");
pinEl.style.cssText = `position:absolute;width:18px;height:18px;background:#ff3b30;border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);z-index:9999;pointer-events:none;box-shadow:0 2px 6px rgba(0,0,0,.5);will-change:left,top`;
c.parentElement.style.position = "relative";
c.parentElement.appendChild(pinEl);
}
pinEl.style.left = (p.x - 9) + "px"; pinEl.style.top = (p.y - 17) + "px";
}
(function loop() { if (S.pinLat) drawPin(); requestAnimationFrame(loop); })();
function markPin() { if (!S.lat) return; S.pinLat = S.lat; S.pinLng = S.lng; drawPin(); document.getElementById("fg-msg").textContent = t("pinned"); }
let oOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (m, u) { this._u = u; return oOpen.apply(this, arguments); };
let oSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function () {
this.addEventListener("load", function () {
try {
let u = String(this._u || "");
if (u.includes("GetMetadata") || u.includes("SingleImageSearch")) {
let mt = this.responseText.match(/-?\d+\.\d+,-?\d+\.\d+/g);
if (mt) { let sp = mt[0].split(","); found(parseFloat(sp[0]), parseFloat(sp[1])); }
}
} catch (e) {}
});
return oSend.apply(this, arguments);
};
setInterval(mk, 2000); mk();
document.addEventListener("keydown", e => {
if (e.key === "1") { let d = document.getElementById("fguesser"); if (d) d.style.display = d.style.display === "none" ? "block" : "none"; }
if (e.key === "6") markPin();
});
})();
