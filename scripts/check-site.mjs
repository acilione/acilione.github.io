import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import assert from "node:assert/strict";
import { chromium } from "playwright";

const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".pdf": "application/pdf",
  ".md": "text/markdown",
};
const server = createServer(async (req, res) => {
  try {
    const path = resolve(
      "docs",
      "." + new URL(req.url, "http://localhost").pathname,
    );
    const bytes = await readFile(path);
    res
      .writeHead(200, {
        "Content-Type": mime[extname(path)] || "application/octet-stream",
      })
      .end(bytes);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith(base) && response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  for (const name of [
    "index",
    "projects",
    "heron_fountain_simulation",
    "bubble_simulation",
    "boyles_flask",
    "cv",
  ]) {
    await page.goto(`${base}/${name}.html`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("h1").count(), 1, name);
    if (
      [
        "heron_fountain_simulation",
        "bubble_simulation",
        "boyles_flask",
      ].includes(name)
    ) {
      assert.equal(
        await page.locator("#scene-container canvas").count(),
        1,
        `${name} rendered scene`,
      );
      assert.ok(
        await page.locator("#simulation-controls .lil-gui").count(),
        `${name} controls`,
      );
    }
  }
  await page.screenshot({ path: "cv/generated/website-desktop.png" });
  for (const ext of ["pdf", "md"]) {
    const downloadPromise = page.waitForEvent("download");
    await page.locator(`a[download="Antonino_Cilione_CV.${ext}"]`).click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), `Antonino_Cilione_CV.${ext}`);
    assert.equal(await download.failure(), null);
    assert.deepEqual(
      await readFile(await download.path()),
      await readFile(`src/downloads/Antonino_Cilione_CV.${ext}`),
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "cv/generated/website-mobile.png" });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "Mobile horizontal overflow",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: six built pages, PDF/Markdown downloads match source artifacts, no page errors or missing local assets, no mobile horizontal overflow.",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
