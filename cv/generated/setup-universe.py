
from pathlib import Path
import json
root=Path('.')
app=root/'.standalone/universe_visualizer'
p=app/'vite.config.js'
s=p.read_text();s=s.replace("export default defineConfig({","export default defineConfig({\n  base: process.env.BASE_PATH || '/',")
p.write_text(s)
p=app/'src/main.js';s=p.read_text()
s="import { announceReady, announceFailure } from './embed.js';\n"+s
s=s.replace('src="/favicon.svg"','src="${import.meta.env.BASE_URL}favicon.svg"')
s=s.replace("  console.error('Aether renderer:', error);","  announceFailure();\n  console.error('Aether renderer:', error);")
s=s.replace("  $('.loading').classList.add('done');","  $('.loading').classList.add('done');\n  if (universe) announceReady();")
p.write_text(s)
(app/'src/embed.js').write_text("""// The atlas keeps its viewport-sized layout and dark sky in embedded mode.
const embedded = window.parent !== window && new URLSearchParams(location.search).get('embed') === '1';
let parentOrigin;
if (embedded && document.referrer) {
  const referrer = new URL(document.referrer);
  if (referrer.origin === location.origin ||
      ['localhost', '127.0.0.1', '[::1]'].includes(referrer.hostname)) {
    parentOrigin = referrer.origin;
  }
}
function announce(type) {
  if (parentOrigin) window.parent.postMessage({
    channel: 'acilione-physics-v1',
    simulation: 'universe_visualizer',
    type,
  }, parentOrigin);
}
export const announceReady = () => announce('ready');
export const announceFailure = () => announce('error');
""")
p=app/'README.md';s=p.read_text();s=s.replace('[Documentazione italiana](README.it.md)','[Open the atlas](https://acilione.github.io/universe_visualizer/) · [Documentazione italiana](README.it.md)');p.write_text(s)
(app/'.github/workflows').mkdir(parents=True,exist_ok=True)
(app/'.github/workflows/pages.yml').write_text("""name: Test and deploy
on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
        env:
          BASE_PATH: /universe_visualizer/
      - run: npx playwright install --with-deps chromium
      - name: Check the hosted build
        run: |
          npm run preview -- --port 5174 --base /universe_visualizer/ > /tmp/atlas-preview.log 2>&1 &
          for attempt in $(seq 1 30); do
            curl --fail --silent http://localhost:5174/universe_visualizer/ > /dev/null && break
            sleep 1
          done
          npm run test:browser
        env:
          TEST_URL: http://localhost:5174/universe_visualizer/
      - uses: actions/upload-pages-artifact@v4
        if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
        with:
          path: dist
  deploy:
    if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
""")
p=root/'package.json';d=json.loads(p.read_text())
for k in ['start','build']:
 d['scripts'][k]=d['scripts'][k].replace('src/boyles_flask.html','src/boyles_flask.html src/universe_visualizer.html')
p.write_text(json.dumps(d,indent=2)+'\n')
s=(root/'src/heron_fountain_simulation.html').read_text()
s=s.replace('Heron’s fountain','Universe visualizer').replace('Simulation of water flow driven by gravity and compressed air.','An interactive astronomical atlas with planets, stars, constellations, and WebXR.').replace('← Experiments / 01 / Fluid dynamics','← Projects / Astronomy').replace('heron-fountain','universe_visualizer').replace('interactive experiment','interactive astronomical atlas').replace('class="simulation-frame"','class="simulation-frame universe-frame"').replace('allow="fullscreen"','allow="fullscreen; xr-spatial-tracking"').replace('Loading the experiment…','Loading the atlas…').replace('Skip to experiment','Skip to atlas').replace('aria-label="Experiment links"','aria-label="Atlas links"')
(root/'src/universe_visualizer.html').write_text(s)
p=root/'src/styles/simulation.css';s=p.read_text();s += """
/* The atlas manages its own viewport and panels. */
.simulation-frame.universe-frame {
  height: clamp(640px, 85vh, 1000px);
  background: #080b0e;
}
"""
p.write_text(s)
p=root/'src/projects.html';s=p.read_text()
marker='        <h2 class="category-heading">Physics</h2>'
card="""
        <div class="project-item">
          <div class="project-title">Universe visualizer / ÆTHER</div>
          <div class="project-actions">
            <a href="universe_visualizer.html" class="action-link live-app">Try It</a>
            <a href="https://github.com/acilione/universe_visualizer" class="action-link source-code">Source code</a>
          </div>
          <div class="project-description">
            An interactive astronomical atlas with planets, stars, 3D
            constellations, and Earth sky views. Uses NASA and Gaia catalogues
            and supports desktop, VR, and mixed reality.
          </div>
          <div class="project-details">
            <small class="detail-tag language-tag">JavaScript</small>
            <small class="detail-tag library-tag">Three.js, WebXR</small>
          </div>
        </div>
"""
assert marker in s;s=s.replace(marker,marker+'\n'+card);p.write_text(s)
