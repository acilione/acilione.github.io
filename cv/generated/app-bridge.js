
const root = document.documentElement;
const embedded = window.parent !== window && new URLSearchParams(location.search).get("embed") === "1";
root.dataset.embed = String(embedded);
let theme = new URLSearchParams(location.search).get("theme");
if (theme !== "light" && theme !== "dark") {
  try { theme = localStorage.getItem("theme"); } catch {}
}
root.dataset.theme = theme === "light" ? "light" : "dark";
const button = document.querySelector(".theme-toggle");
function setTheme(value) {
  if (value !== "light" && value !== "dark") return;
  root.dataset.theme = value;
  button.textContent = value === "dark" ? "Light mode" : "Dark mode";
}
setTheme(root.dataset.theme);
button.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
});
let parentOrigin;
try {
  const referrer = new URL(document.referrer);
  if (referrer.origin === location.origin || referrer.hostname === "acilione.github.io" ||
      ["localhost", "127.0.0.1", "[::1]"].includes(referrer.hostname)) parentOrigin = referrer.origin;
} catch {}
const channel = "acilione-physics-v1", simulation = document.body.dataset.simulation;
let ready = false, pending = false, lastHeight = 0;
function post(type, extra = {}) {
  if (embedded && parentOrigin) window.parent.postMessage({channel, simulation, type, ...extra}, parentOrigin);
}
function reportSize() {
  if (pending || !ready) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    const height = Math.ceil(document.querySelector("main").getBoundingClientRect().bottom + window.scrollY);
    if (height !== lastHeight) { lastHeight = height; post("resize", {height}); }
  });
}
window.addEventListener("message", event => {
  if (!embedded || !parentOrigin || event.source !== window.parent || event.origin !== parentOrigin) return;
  const data = event.data;
  if (!data || data.channel !== channel || data.simulation !== simulation || data.type !== "theme") return;
  setTheme(data.theme);
  reportSize();
});
export function announceReady() {
  ready = true;
  post("ready");
  new ResizeObserver(reportSize).observe(document.querySelector("main"));
  reportSize();
}
export function announceFailure() { post("error"); }
