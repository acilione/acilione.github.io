
from pathlib import Path
p=Path('scripts/check-site.mjs');s=p.read_text()
s=s.replace('import { chromium } from "playwright";','import { chromium, expect } from "playwright";')
s=s.replace('const browser = await chromium.launch();','const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });')
s=s.replace('["heron-fountain", "bubble-deflation", "boyles-flask"]','["heron-fountain", "bubble-deflation", "boyles-flask", "universe_visualizer"]')
s=s.replace('    "cv",','    "universe_visualizer",\n    "cv",',1)
needle='    assert.equal(await page.locator("h1").count(), 1, name);'
s=s.replace(needle,needle+"""
    if (name === "projects") {
      await expect(page.getByRole("link", { name: "Try It", exact: true }).filter({
        has: undefined,
      }).locator('xpath=self::*[@href="universe_visualizer.html"]')).toHaveCount(1);
    }
    if (name === "universe_visualizer") {
      await page.locator('iframe[data-ready="true"]').waitFor();
      await expect(page.locator("#simulation-status")).toBeHidden();
      const frame = page.frameLocator('iframe[data-simulation="universe_visualizer"]');
      await expect(frame.locator("#universe")).toBeVisible();
      await expect(frame.locator(".webgl-error")).toHaveCount(0);
      await frame.locator('[data-action="planets"]').first().click();
      await frame.locator('.solar-shortcuts [data-object="earth"]').click();
      await expect(frame.locator("#object-card h2")).toHaveText("Earth");
      await frame.locator('[data-action="constellations"]').first().click();
      await expect(frame.locator("#modal")).toBeVisible();
      await expect(frame.locator('[data-constellation="Ori"]')).toBeVisible({ timeout: 30000 });
      await page.screenshot({ path: "cv/generated/universe-desktop.png" });
      await page.keyboard.press("Escape");
      const embeddedPage = page.frames().find(child => child.url().includes("/universe_visualizer/"));
      const canvas = frame.locator("#universe");
      const before = await canvas.boundingBox();
      await page.setViewportSize({ width: 390, height: 844 });
      await expect.poll(async () => (await canvas.boundingBox()).width).toBeLessThan(before.width);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "Atlas parent overflow");
      assert.equal(await embeddedPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "Atlas frame overflow");
      await frame.locator('[data-action="planets"]').first().click();
      await frame.locator('.solar-shortcuts [data-object="saturn"]').click();
      await frame.locator('.view-controls [data-action="object"]').click();
      await expect(frame.locator("#modal-body h2")).toHaveText("Saturn");
      await page.screenshot({ path: "cv/generated/universe-mobile.png" });
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
""")
s=s.replace('page.getByRole("link", { name: "Try It", exact: true }).filter({\n        has: undefined,\n      }).locator(\'xpath=self::*[@href="universe_visualizer.html"]\')','page.locator(\'a[href="universe_visualizer.html"]\')')
s=s.replace('PASS: six pages, standalone embeds','PASS: seven pages, atlas catalogues and mobile controls, standalone embeds')
p.write_text(s)
