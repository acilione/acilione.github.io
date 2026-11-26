from pathlib import Path
import re,json
root=Path.cwd()
path=root/"scripts/check-site.mjs"
text=path.read_text().replace('import { resolve, extname }','import { resolve, extname, sep }')
text=text.replace('  const errors = [];',"""  const simulations = ["heron-fountain", "bubble-deflation", "boyles-flask"];
  if (process.env.SIMULATION_CHECKOUTS) {
    await page.route("https://acilione.github.io/**", async route => {
      const url = new URL(route.request().url());
      const [slug, ...parts] = url.pathname.slice(1).split("/");
      if (!simulations.includes(slug)) return route.continue();
      const root = resolve(process.env.SIMULATION_CHECKOUTS, slug, "dist");
      const file = resolve(root, parts.join("/") || "index.html");
      assert.ok(file.startsWith(root + sep), "Simulation asset outside build");
      try {
        await route.fulfill({status: 200, contentType: mime[extname(file)] || "application/octet-stream", body: await readFile(file)});
      } catch { await route.fulfill({status:404, body:"Missing standalone build asset"}); }
    });
  }
  const errors = [];""")
text=text.replace('if (response.url().startsWith(base) && response.status() >= 400)', 'if ((response.url().startsWith(base) || simulations.some(slug => response.url().startsWith("https://acilione.github.io/" + slug + "/"))) && response.status() >= 400)')
start=text.index('      assert.equal(\n        await page.locator("#scene-container canvas")')
end=text.index('\n    }\n  }',start)
text=text[:start]+"""      const frameElement = page.locator("iframe[data-simulation]");
      await page.locator('iframe[data-ready="true"]').waitFor();
      const frame = page.frameLocator("iframe[data-simulation]");
      await frame.locator("#scene-container canvas").waitFor();
      assert.equal(await frame.locator("#simulation-controls .lil-gui").count(), 1);
      await frame.getByRole("button", {name:"Play / Pause", exact:true}).click();
      await frame.getByRole("button", {name:"Play / Pause", exact:true}).click();
      await page.locator(".theme-toggle").click();
      const expectedTheme = await page.locator("html").getAttribute("data-theme");
      await frame.locator('html[data-theme="' + expectedTheme + '"]').waitFor();
      await page.setViewportSize({width:390, height:844});
      await page.waitForTimeout(250);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, name + " parent overflow");
      assert.equal(await frame.locator("html").evaluate(el => el.scrollWidth > innerWidth), false, name + " frame overflow");
      const frameHeight = await frameElement.evaluate(el => el.getBoundingClientRect().height);
      const contentHeight = await frame.locator("main").evaluate(el => el.getBoundingClientRect().bottom + scrollY);
      assert.ok(Math.abs(frameHeight - contentHeight) <= 2, name + " height synchronization");
      // A forged message cannot resize an unrelated frame, even with a valid channel and ID.
      await frameElement.evaluate(el => window.dispatchEvent(new MessageEvent("message", {
        origin: "https://evil.example", source: el.contentWindow,
        data: {channel:"acilione-physics-v1", simulation:el.dataset.simulation, type:"resize", height:5999}
      })));
      assert.equal(await frameElement.evaluate(el => el.getBoundingClientRect().height), frameHeight);
      await page.setViewportSize({width:1440, height:1000});"""+text[end:]
text=text.replace('six built pages, PDF/Markdown downloads match source artifacts, no page errors or missing local assets, no mobile horizontal overflow.', 'six pages, standalone embeds, play/pause, theme/height synchronization, sender validation, downloads, and mobile layout.')
path.write_text(text)
# The physics now belongs exclusively to the standalone projects.
for p in (root/"src/simulations").rglob("*"):
 if p.is_file(): p.unlink()
for p in sorted((root/"src/simulations").rglob("*"),reverse=True):
 if p.is_dir(): p.rmdir()
(root/"src/simulations").rmdir()
(root/"src/flask.js").unlink()
(root/"tests/physics.test.js").unlink()
package=json.loads((root/"package.json").read_text())
package["dependencies"].pop("three",None)
package["dependencies"].pop("lil-gui",None)
(root/"package.json").write_text(json.dumps(package,indent=2)+"\n")
path=root/"README.md"
text=path.read_text().replace("A minimal portfolio and interactive physics experiments, built with Parcel and Three.js.","A minimal portfolio built with Parcel, embedding independently maintained physics experiments.")
text=text[:text.index("Physics is separated from rendering in:")]+"""## Standalone simulations

| Experiment | Source repository | Hosted app |
| --- | --- | --- |
| Heron's fountain | [heron-fountain](https://github.com/acilione/heron-fountain) | [Demo](https://acilione.github.io/heron-fountain/) |
| Unblowing bubbles | [bubble-deflation](https://github.com/acilione/bubble-deflation) | [Demo](https://acilione.github.io/bubble-deflation/) |
| Boyle's flask | [boyles-flask](https://github.com/acilione/boyles-flask) | [Demo](https://acilione.github.io/boyles-flask/) |

The existing simulation page URLs remain portfolio pages, with an iframe loading the corresponding hosted app. Physics, renderers, controls, model descriptions, and numerical tests live only in their standalone repositories. The portfolio has no Three.js dependency, submodules, or copied simulation implementation.

Each app is independently cloneable. Run npm ci, npm test, and npm start in that repository. Its GitHub Actions workflow builds and deploys GitHub Pages after numerical and browser checks.

The small website adapter sends the current theme and accepts ready/resize/error messages. It validates both the sender window and origin; height messages are bounded. Direct app and source links remain available if embedding fails. Each app can run locally without this website.

### Checking changes before deployment

By default, npm run site:check exercises the deployed apps. To exercise local standalone builds while preserving realistic cross-origin messaging, point the check at a directory containing the three repository checkouts:

~~~sh
SIMULATION_CHECKOUTS=/path/to/checkouts npm run site:check
~~~

Build each checkout first with npm run build. The browser test intercepts only the three known app URLs and serves those build files; the production website always uses the public URLs.

This migration does not rewrite Git history. Earlier commits contain the original implementations; the current branch no longer maintains or publishes copies. Historical tracked development output is removed from version control, while local files are left on disk.

See [SIMULATION_REVIEW.md](SIMULATION_REVIEW.md) for the original scientific audit.
"""
text=text.replace("Existing historical bundles are retained. ","")
path.write_text(text)
path=root/"SIMULATION_REVIEW.md"
text=path.read_text()
text=text.replace("# Simulation review","# Simulation review\n\nThis is the historical audit of the implementation before extraction. Current code and numerical tests live in [heron-fountain](https://github.com/acilione/heron-fountain), [bubble-deflation](https://github.com/acilione/bubble-deflation), and [boyles-flask](https://github.com/acilione/boyles-flask). Run npm test in each standalone repository; the website tests the integration only.",1)
path.write_text(text)
ignore=root/".gitignore"
text=ignore.read_text()
if "/dist/" not in text: ignore.write_text(text.rstrip()+"\n/dist/\n")
print("Removed portfolio implementation copies; updated integration checks and documentation.")
