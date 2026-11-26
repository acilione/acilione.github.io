
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {resolve, extname, sep} from "node:path";
import assert from "node:assert/strict";
import {chromium} from "playwright";
const root = resolve("dist");
const mime = {".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".map":"application/json"};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const path = resolve(root, "." + (url.pathname === "/" ? "/index.html" : url.pathname));
    if (!path.startsWith(root + sep)) throw new Error("Outside root");
    res.writeHead(200, {"Content-Type": mime[extname(path)] || "application/octet-stream"}).end(await readFile(path));
  } catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, "127.0.0.1", done));
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage(), errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("response", response => { if(response.status() >= 400) errors.push(response.url()); });
  for (const width of [1440, 390]) {
    await page.setViewportSize({width, height:900});
    await page.goto("http://127.0.0.1:" + server.address().port + "/?theme=dark", {waitUntil:"networkidle"});
    await page.locator("#scene-container canvas").waitFor();
    assert.equal(await page.locator("#simulation-controls .lil-gui").count(), 1);
    await page.getByRole("button", {name:"Play / Pause", exact:true}).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", {name:"Play / Pause", exact:true}).click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator(".theme-toggle").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
  }
  assert.deepEqual(errors, []);
  console.log("PASS: scene, controls, play/pause, theme, desktop and mobile layout.");
} finally {
  await browser?.close();
  await new Promise(done => server.close(done));
}
