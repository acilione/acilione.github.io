# Heron's Fountain Simulation

A physics simulation of Heron's Fountain based on the research paper by Daniele B. Provenzano.

## Reference Paper

> **"The Incredible Amount of Physics Behind the Heron's Fountain"**  
> Daniele B. Provenzano  
> *Extends Bernoulli's equation to include viscous effects with experimental validation*

**Acknowledgment from paper:**
> "The author also wishes to thank his lifelong friend, Antonino Cilione, for creating a compelling simulation that illustrates the time evolution of Heron's fountain"

## Physics Model

### Viscous Bernoulli's Equation (VBE)
From paper Eq. (5):

$$p + \frac{1}{2}\rho v^2 + \rho gz + \frac{8\mu Q}{\pi} \int \frac{ds}{r^4(s)} = \text{const}$$

### Key Equations Implemented

| Component | Paper Eq. | Formula |
|-----------|-----------|---------|
| **Viscous coefficient** | Eq. 7 | `B = 8πμL/S` |
| **Boyle's Law** | Eq. 8 | `pin = (patm·V₀)/V(t)` |
| **Left pipe velocity** | Eq. 19 | `vL = √(B² + 2ΔP/ρ) - B` |
| **Right pipe velocity** | Eq. 20 | `vR = √(B² + 2ΔP/ρ) - B` |
| **Operating condition** | Eq. 25 | `z₁ - z₂ + z₃ = h₆` |

### Physical Constants

```javascript
ρ = 1000      // Water density [kg/m³]
g = 9.8       // Gravity [m/s²]
μ = 0.001     // Dynamic viscosity [Pa·s]
patm = 101325 // Atmospheric pressure [Pa]
```

## Features

- **Accurate physics**: VBE with viscous losses, Boyle's Law air compression
- **Three.js visualization**: Real-time 3D water flow and jet rendering
- **Color mixing**: Watch dye colors mix between basins
- **Interactive controls**: Time scale, view mode, play/pause/reset

## Usage

### Standalone (copy this folder)

```html
<div id="my-simulation" class="heron-simulation-container"></div>
<script type="module">
  import { init } from './heron.js';
  init('my-simulation');
</script>
```

### As ES Module

```javascript
import { HeronFountainScene, HeronPhysics } from './heron.js';
const sim = new HeronFountainScene('container-id');
```

## Dependencies

- [Three.js](https://threejs.org/) - 3D rendering  
- [lil-gui](https://lil-gui.georgealways.com/) - GUI controls

```bash
npm install three lil-gui
```

## Files

| File | Description |
|------|-------------|
| `heron.js` | Physics (`HeronPhysics`) + visualization (`HeronFountainScene`) |
| `heron.css` | Standalone styles |
| `index.html` | Demo page |

## License

Educational use. Based on academic research.
