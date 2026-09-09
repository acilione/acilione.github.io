# Soap bubble deflation

Based on Provenzano & Stefanini, *Unblowing bubbles: Understanding the physics of bubble deflation through a straw*, American Journal of Physics 93 (2025), DOI [10.1119/5.0254263](https://doi.org/10.1119/5.0254263).

The generalized time-radius model follows Eq. (23), with A = 16.19 mm² (Table I), σ = 0.0248 N/m, μ = 1.84 × 10⁻⁵ Pa·s, and ρ = 1.22 kg/m³ (Eq. 30). Numerical integration builds a cached monotone time table. Each rendered frame only needs a binary search and interpolation.

## Usage

```js
import { init } from './bubble.js';
const simulation = init('scene-container');

// Headless calculation:
import { createBubbleTimeline } from './physics.js';
const timeline = createBubbleTimeline(0.1, 0.04); // L and R0 in metres
console.log(timeline.duration); // seconds
console.log(timeline.radiusAt(1)); // metres
```

Provide a container with a nonzero width and height. Install `three` and `lil-gui` and serve through an ES-module bundler such as Parcel. The local demo is `index.html`; the website page is `../../bubble_simulation.html`.

The spherical approximation fails when radius approaches straw radius; zero radius is an extrapolated model endpoint. The film shader is illustrative. See [the review](../../../SIMULATION_REVIEW.md) for corrections and validation; run `npm test` from the repository root.
