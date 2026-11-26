
from pathlib import Path
p=Path('scripts/check-site.mjs');s=p.read_text().replace('import { chromium, expect } from "playwright";','import { chromium } from "playwright";')
s=s.replace('await expect(page.locator(\'a[href="universe_visualizer.html"]\')).toHaveCount(1);','assert.equal(await page.locator(\'a[href="universe_visualizer.html"]\').count(), 1);')
s=s.replace('await expect(page.locator("#simulation-status")).toBeHidden();','await page.locator("#simulation-status").waitFor({ state: "hidden" });')
s=s.replace('await expect(frame.locator("#universe")).toBeVisible();','await frame.locator("#universe").waitFor();')
s=s.replace('await expect(frame.locator(".webgl-error")).toHaveCount(0);','assert.equal(await frame.locator(".webgl-error").count(), 0);')
s=s.replace('await expect(frame.locator("#object-card h2")).toHaveText("Earth");','await frame.locator(\'#object-card h2:text-is("Earth")\').waitFor();')
s=s.replace('await expect(frame.locator("#modal")).toBeVisible();','await frame.locator("#modal").waitFor();')
s=s.replace('await expect(frame.locator(\'[data-constellation="Ori"]\')).toBeVisible({ timeout: 30000 });','await frame.locator(\'[data-constellation="Ori"]\').waitFor({ timeout: 30000 });')
s=s.replace('await expect.poll(async () => (await canvas.boundingBox()).width).toBeLessThan(before.width);','await embeddedPage.waitForFunction(width => document.querySelector("#universe").getBoundingClientRect().width < width, before.width);')
s=s.replace('await expect(frame.locator("#modal-body h2")).toHaveText("Saturn");','await frame.locator(\'#modal-body h2:text-is("Saturn")\').waitFor();')
p.write_text(s)
