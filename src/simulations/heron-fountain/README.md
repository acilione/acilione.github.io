# Heron’s fountain

The visualization implements the model in the supplied `assets/Erone.pdf`: *The Incredible Amount of Physics Behind the Heron’s Fountain*. See [the review](../../../SIMULATION_REVIEW.md) for the audit and limitations.

## Model

- Continuity: SA·dhA/dt = S(vR − vL), SB·dhB/dt = SvL, SC·dhC/dt = −SvR (Eq. 2).
- Isothermal air: p·V = patm·V0 (Eq. 8).
- Viscous Bernoulli velocities (Eqs. 19–20), with B = 8πμL/S in Pa·s/m. The rationalized positive root is v = 2Δp / (sqrt(B² + 2ρΔp) + B).
- Equilibrium: H + hA − hB + hC = h6 (Eq. 25). Both velocities must approach zero.
- Default parameters match the water apparatus in Figs. 4 and 7. hA is depth above H; the paper’s z1 = H + hA.
- Midpoint integration with steps no larger than 5 ms and volume-conserving transfers.

This is a laminar-pipe approximation. The paper reports turbulent deviations for water. The drawing and tracer colors are schematic.

## Usage

```js
import { init, HeronFountainScene, HeronPhysics } from './heron.js';
const simulation = init('scene-container');

// Headless calculations, with no Three.js or DOM dependency:
import { HeronPhysics as Physics } from './physics.js';
const model = new Physics();
model.step(1);
```

Provide a container with a nonzero width and height. Install `three` and `lil-gui` and serve through an ES-module bundler such as Parcel. The local demo is `index.html`; the website page is `../../heron_fountain_simulation.html`.

Run `npm test` from the repository root for the numerical checks.
