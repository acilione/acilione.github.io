import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
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
  const simulations = ["heron-fountain", "bubble-deflation", "boyles-flask"];
  if (process.env.SIMULATION_CHECKOUTS) {
    await page.route("https://acilione.github.io/**", async (route) => {
      const url = new URL(route.request().url());
      const [slug, ...parts] = url.pathname.slice(1).split("/");
      if (!simulations.includes(slug)) return route.continue();
      const root = resolve(process.env.SIMULATION_CHECKOUTS, slug, "dist");
      const file = resolve(root, parts.join("/") || "index.html");
      assert.ok(file.startsWith(root + sep), "Simulation asset outside build");
      try {
        await route.fulfill({
          status: 200,
          contentType: mime[extname(file)] || "application/octet-stream",
          body: await readFile(file),
        });
      } catch {
        await route.fulfill({
          status: 404,
          body: "Missing standalone build asset",
        });
      }
    });
  }
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (
      (response.url().startsWith(base) ||
        simulations.some((slug) =>
          response.url().startsWith("https://acilione.github.io/" + slug + "/"),
        )) &&
      response.status() >= 400
    )
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
      const frameElement = page.locator("iframe[data-simulation]");
      await page.locator('iframe[data-ready="true"]').waitFor();
      const frame = page.frameLocator("iframe[data-simulation]");
      await frame.locator("#scene-container canvas").waitFor();
      assert.equal(
        await frame.locator("#simulation-controls > .lil-gui").count(),
        1,
      );
      await frame
        .getByRole("button", { name: "Play / Pause", exact: true })
        .click();
      await frame
        .getByRole("button", { name: "Play / Pause", exact: true })
        .click();
      await page.locator(".theme-toggle").click();
      const expectedTheme = await page
        .locator("html")
        .getAttribute("data-theme");
      await frame.locator('html[data-theme="' + expectedTheme + '"]').waitFor();
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(250);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        name + " parent overflow",
      );
      assert.equal(
        await frame
          .locator("html")
          .evaluate((el) => el.scrollWidth > innerWidth),
        false,
        name + " frame overflow",
      );
      const frameHeight = await frameElement.evaluate(
        (el) => el.getBoundingClientRect().height,
      );
      const contentHeight = await frame
        .locator("main")
        .evaluate((el) => el.getBoundingClientRect().bottom + scrollY);
      assert.ok(
        Math.abs(frameHeight - contentHeight) <= 2,
        name + " height synchronization",
      );
      // A forged message cannot resize an unrelated frame, even with a valid channel and ID.
      await frameElement.evaluate((el) =>
        window.dispatchEvent(
          new MessageEvent("message", {
            origin: "https://evil.example",
            source: el.contentWindow,
            data: {
              channel: "acilione-physics-v1",
              simulation: el.dataset.simulation,
              type: "resize",
              height: 5999,
            },
          }),
        ),
      );
      assert.equal(
        await frameElement.evaluate((el) => el.getBoundingClientRect().height),
        frameHeight,
      );
      await page.setViewportSize({ width: 1440, height: 1000 });
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
    "PASS: six pages, standalone embeds, play/pause, theme/height synchronization, sender validation, downloads, and mobile layout.",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
