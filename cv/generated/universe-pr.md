Adds a Universe visualizer entry under Physics and a dedicated page that embeds `https://acilione.github.io/universe_visualizer/`. The atlas, catalogues, textures, build, and deployment remain in the independent `acilione/universe_visualizer` repository; the portfolio contains only the wrapper and links.

The iframe supports fullscreen and WebXR permissions, reports loading failures, and uses a responsive viewport. Browser checks cover catalogue loading, Earth/Saturn selection, and mobile controls alongside the existing simulations and CV downloads.

Adds Universe Visualizer to the canonical Markdown CV and regenerates the website CV and both downloads. Data engineering projects remain first. Condensed three existing project bullets to keep seven projects within two pages at the original font size and layout. The project description includes verified JavaScript/Three.js, NASA/Gaia catalogue integration, WebXR, automated testing, and GitHub Actions work.

Validation: production build; four CV tests; PDF validation (two A4 pages, 53 text blocks in reading order, 11 link annotations, accessibility structure, no images or clipped text); seven-page browser checks against local builds and live GitHub Pages apps, including both CV downloads. Visually reviewed both rendered PDF pages. Independent atlas: production build, 176 unit tests, browser navigation checks, and successful Pages deployment.

Based on `fix/plain-website-copy` (PR #2) to preserve the pending copy cleanup. Merge #2 first, then retarget this PR to `main`.
