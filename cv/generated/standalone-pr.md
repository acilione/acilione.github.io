The physics simulations were maintained inside the portfolio and could not be cloned as independent projects. This change preserves their existing website URLs while embedding separately deployed apps.

Standalone repositories and live demos:
- [Heron's fountain](https://github.com/acilione/heron-fountain) · [demo](https://acilione.github.io/heron-fountain/)
- [Bubble deflation](https://github.com/acilione/bubble-deflation) · [demo](https://acilione.github.io/bubble-deflation/)
- [Boyle's flask](https://github.com/acilione/boyles-flask) · [demo](https://acilione.github.io/boyles-flask/)

Each repository owns its model, renderer, controls, documentation, numerical tests, dependency lockfile, and Pages workflow. The website now contains an embed adapter with theme synchronization, automatic height updates, validated message senders, and direct demo/source links.

Remove the website's Three.js/lil-gui dependencies and simulation source. Most of the large deletion diff is 422 obsolete generated files in docs plus previously tracked development output in dist. Local dist files remain on disk; Git history is preserved.

Validation:
- All three standalone CI build/deploy workflows succeeded, including 18 numerical tests and desktop/mobile browser checks.
- Website build, four CV tests, PDF validation, and browser checks passed.
- Browser checks passed against both local standalone builds and the live Pages demos, including playback, theme/height synchronization, mobile layout, and rejected forged messages.
- Confirmed that the website Git tree no longer contains simulation implementations.

The feature branch does not change the website's main branch. Merging it switches the existing pages to the already deployed apps.