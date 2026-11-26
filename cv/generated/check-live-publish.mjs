
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {chromium} from "playwright";
const base = "https://acilione.github.io";
const version = "99fffd2";
await Promise.all(["md","pdf"].map(async ext => {
 const response = await fetch(base+"/downloads/Antonino_Cilione_CV."+ext+"?v="+version);
 assert.equal(response.status,200);
 assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile("docs/downloads/Antonino_Cilione_CV."+ext));
}));
const browser = await chromium.launch({args:["--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
try {
 const page = await browser.newPage();
 await page.goto(base+"/projects.html?v="+version);
 await page.locator('a[href="universe_visualizer.html"]').click();
 await page.locator('iframe[data-simulation="universe_visualizer"][data-ready="true"]').waitFor();
 await page.frameLocator("iframe").locator("#universe").waitFor();
 await page.goto(base+"/cv.html?v="+version);
 await page.locator('h3 a[href="https://github.com/acilione/universe_visualizer"]').waitFor();
 console.log("PASS: live Projects link, embedded atlas initialization, CV entry, and exact Markdown/PDF download bytes.");
} finally { await browser.close(); }
