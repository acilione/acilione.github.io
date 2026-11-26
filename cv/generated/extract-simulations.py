from pathlib import Path
import json
root=Path.cwd()
projects=[
 dict(slug="heron-fountain",title="Heron's fountain",page="heron_fountain_simulation.html",scene="src/simulations/heron-fountain/heron.js",physics="src/simulations/heron-fountain/physics.js",paper="https://pubs.aip.org/aapt/ajp/article/94/7/530/3395784/The-physics-behind-Heron-s-fountain",description="Interactive Heron's fountain: gravity, compressed air, and viscous flow."),
 dict(slug="bubble-deflation",title="Unblowing bubbles",page="bubble_simulation.html",scene="src/simulations/bubble-deflation/bubble.js",physics="src/simulations/bubble-deflation/physics.js",paper="https://doi.org/10.1119/5.0254263",description="Interactive soap bubble deflation: surface tension, air inertia, and viscous resistance."),
 dict(slug="boyles-flask",title="Boyle's self-flowing flask",page="boyles_flask.html",scene="src/flask.js",physics="src/simulations/flask-physics.js",paper="https://doi.org/10.1088/1361-6404/ae280c",description="Interactive Boyle's self-flowing flask: an initial push, gravity, and viscous dissipation.")
]
def write(path,content):
 path.parent.mkdir(parents=True,exist_ok=True)
 path.write_text(content,encoding="utf-8")
ignore=root/".gitignore"
if "/.standalone/" not in ignore.read_text(): write(ignore,ignore.read_text().rstrip()+"\n/.standalone/\n")
tests=(root/"tests/physics.test.js").read_text()
close=tests[tests.index('const close ='):tests.index('test("Heron')]
bodies=[
 'import { HeronPhysics } from "../src/physics.js";\n'+close+tests[tests.index('test("Heron'):tests.index('test("Bubble')]+'test("Reject invalid time steps", () => assert.throws(() => new HeronPhysics().step(NaN), RangeError));\n',
 'import { A, sig, mu, ro, createBubbleTimeline, calc_t_gen, calculate_duration_gen } from "../src/physics.js";\n'+close+tests[tests.index('test("Bubble'):tests.index('const flask =')]+'test("Reject invalid dimensions", () => { assert.throws(() => createBubbleTimeline(-1, 0.04), RangeError); assert.throws(() => createBubbleTimeline(0.1, 0), RangeError); });\n',
 'import { flaskDerivative, stepFlask } from "../src/physics.js";\n'+close+tests[tests.index('const flask ='):tests.index('test("Invalid')]+'test("Reject invalid parameters and time steps", () => { assert.throws(() => flaskDerivative(1, {...flask, H: 0.1}), RangeError); assert.throws(() => stepFlask(1, -1, flask), RangeError); });\n'
]
base=(root/"src/styles/styles.css").read_text()
base=base[base.index(":root {"):base.index(".content {")].replace('"DM Sans"',"Arial").replace('"Space Grotesk"',"Arial")
lab=(root/"src/styles/simulation.css").read_text()
lab=lab[lab.index(".lab-layout {"):].replace('"DM Sans"',"Arial")
css=base+"\n"+lab+"""
main { width: min(1280px, calc(100% - 40px)); margin: 0 auto; padding: 24px 0 8px; }
.app-heading { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-bottom: 28px; }
h1 { font-size: clamp(1.8rem, 4vw, 2.8rem); margin: 12px 0; }
.app-links { display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; }
.app-links a { text-decoration: underline; text-underline-offset: 4px; }
button.theme-toggle { background: var(--surface); color: var(--text); border: 1px solid var(--line); padding: 10px 16px; border-radius: 4px; cursor: pointer; }
:root[data-embed="true"] main { width: 100%; padding-top: 0; }
:root[data-embed="true"] .app-heading { display: none; }
@media (max-width: 600px) { .app-heading { flex-direction: column; align-items: start; } main { width: calc(100% - 24px); } }
"""
notes=[
"Water draining into the receiving basin compresses trapped air, driving the fountain jet. The model combines volume continuity, isothermal air compression, gravity, and laminar pipe resistance. Volume-conserving midpoint steps are capped at 5 ms.\n\nThe defaults describe the paper's water apparatus. Turbulence, pipe storage, delayed jet return, inlet losses, and meniscus effects are not resolved. Colors and geometry are schematic.\n\nTests cover conservation, the Boyle invariant, pressure balances, equilibrium, depletion, and step refinement.",
"Surface tension expels air through a straw. The model combines inertia with viscous resistance. Numerical quadrature builds a monotone time-radius table, inverted by binary search and interpolation during animation.\n\nThe spherical approximation fails near the straw radius; final collapse is an extrapolation. The film shader is illustrative. Tests cover analytical inviscid/viscous limits, independent quadrature, monotonicity, endpoints, and a published measurement.",
"An initial push starts recirculation. Gravity and viscous losses bring the water to rest when the outlet is above the water surface. The constant-section model uses RK4 integration with substeps and a zero-velocity stopping event.\n\nThe model assumes laminar flow, a rounded inlet, and immediate return of discharged water. The drawing is schematic. Tests cover monotone decay, stopping, parameter validation, and an independent analytical stopping time."
]
examples=[
"import { HeronPhysics } from './src/physics.js';\nconst model = new HeronPhysics();\nmodel.step(1);\nconsole.log(model.h_A, model.p_D);",
"import { createBubbleTimeline } from './src/physics.js';\nconst model = createBubbleTimeline(0.1, 0.04);\nconsole.log(model.duration, model.radiusAt(1));",
"import { stepFlask } from './src/physics.js';\nconst parameters = {r_hose: 0.0035, r_container: 0.035, h: 0.12, H: 0.15, L: 0.8};\nconsole.log(stepFlask(1.5, 0.02, parameters));"
]
for i,p in enumerate(projects):
 target=root/".standalone"/p["slug"]
 if target.exists(): raise RuntimeError("Refusing to overwrite "+str(target))
 page=(root/"src"/p["page"]).read_text()
 content=page[page.index('      <div class="lab-layout">'):page.index("    </main>")]
 scene=(root/p["scene"]).read_text()
 if p["slug"]=="boyles-flask":
  scene=scene[:scene.rindex("\ntry {")]+'\nexport function init() { return new FlaskSimulation(); }\nexport { FlaskSimulation };\n'
  scene=scene.replace('./simulations/flask-physics.js','./physics.js')
 write(target/"src/scene.js",scene)
 write(target/"src/physics.js",(root/p["physics"]).read_text())
 write(target/"src/styles.css",css)
 write(target/"src/embed.js",(root/"cv/generated/app-bridge.js").read_text())
 write(target/"src/main.js", """import {announceReady, announceFailure} from "./embed.js";
import {init} from "./scene.js";
try {
  init("scene-container");
  announceReady();
} catch (error) {
  document.getElementById("scene-container").textContent = "The 3D view could not start. Please use a browser with WebGL enabled.";
  announceFailure();
  console.error(error);
}
""")
 write(target/"src/index.html",f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="{p['description']}">
<title>{p['title']} — Antonino Cilione</title>
<link rel="stylesheet" href="styles.css">
</head><body data-simulation="{p['slug']}"><main>
<header class="app-heading">
<div><h1>{p['title']}</h1><nav class="app-links" aria-label="Project links">
<a href="https://github.com/acilione/{p['slug']}">Source code</a>
<a href="https://acilione.github.io/projects.html">More experiments</a>
</nav></div><button class="theme-toggle" type="button">Light mode</button>
</header>
{content}
</main><script type="module" src="main.js"></script></body></html>
""")
 package=dict(name="@acilione/"+p["slug"],version="1.0.0",private=True,type="module",description=p["description"],license="ISC",author="acilione <antoninocilione96@gmail.com>",
 repository={"type":"git","url":"https://github.com/acilione/"+p["slug"]+".git"},homepage="https://acilione.github.io/"+p["slug"]+"/",
 scripts={"start":"parcel src/index.html --port 1234","build":"parcel build src/index.html --dist-dir dist --public-url ./","test":"node --test tests/*.test.js","test:browser":"node scripts/check-browser.mjs"},
 dependencies={"three":"0.180.0","lil-gui":"0.21.0"},devDependencies={"parcel":"2.16.0","playwright":"1.63.0"},engines={"node":">=22.13.0"},targets={"default":{"context":"browser"}})
 write(target/"package.json",json.dumps(package,indent=2)+"\n")
 write(target/".gitignore","node_modules/\ndist/\n.parcel-cache/\ntest-results/\n")
 write(target/"tests/physics.test.js",'import test from "node:test";\nimport assert from "node:assert/strict";\n'+bodies[i])
 write(target/"scripts/check-browser.mjs",(root/"cv/generated/app-check.mjs").read_text())
 write(target/".github/workflows/pages.yml",(root/"cv/generated/pages.yml").read_text())
 write(target/"LICENSE","""ISC License

Copyright (c) 2026 Antonino Cilione

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
""")
 write(target/"README.md",f"""# {p['title']}

{p['description']}

[Interactive demo](https://acilione.github.io/{p['slug']}/) · [Research paper]({p['paper']})

## Run locally

Requires Node.js 22.13 or newer; Node 24 is used in CI.

~~~sh
git clone https://github.com/acilione/{p['slug']}.git
cd {p['slug']}
npm ci
npm start
~~~

Open the URL printed by Parcel. This repository is self-contained: no portfolio checkout, submodules, or remote scripts are required to run the simulation. After installing dependencies, the local app works offline.

## Test and build

~~~sh
npm test
npm run build
npx playwright install chromium
npm run test:browser
~~~

On Linux, add --with-deps to the Playwright install command if browser libraries are missing.
The production app is written to dist/. Pushes to main run numerical and browser checks, then publish it to GitHub Pages using Actions. Pull requests run checks without deployment. Enable Pages with **GitHub Actions** as its source.

## The model

{notes[i]}

Headless use, without a browser or Three.js:

~~~js
{examples[i]}
~~~

## Embed

The portfolio embeds the deployed app; it does not copy or bundle this repository's simulation source.

~~~html
<iframe
  src="https://acilione.github.io/{p['slug']}/?embed=1&amp;theme=dark"
  title="{p['title']}"
  style="width:100%;height:900px;border:0"
></iframe>
~~~

Embedded mode hides the standalone heading. The portfolio sends messages with channel "acilione-physics-v1", simulation "{p['slug']}", type "theme", and a light or dark theme. The app sends ready, resize (numeric height), or error messages. Both sides check the sender window and origin. Automatic resizing/theme updates are supported for the portfolio, same-origin pages, and local previews. The iframe remains scrollable without that integration.

## Provenance

Extracted from [acilione.github.io at 6c8000e](https://github.com/acilione/acilione.github.io/tree/6c8000e) on 2026-09-17. The physics implementation and its numerical checks are preserved. Original website history remains in that repository. Copyrighted paper PDFs are not redistributed.

Author: acilione <antoninocilione96@gmail.com>. ISC license.
""")
print("Prepared:",", ".join(p["slug"] for p in projects))
