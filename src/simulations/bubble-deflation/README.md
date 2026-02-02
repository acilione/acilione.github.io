# Soap Bubble Deflation Simulation

A physics simulation of soap bubble deflation through a straw, based on the academic paper:

> **"Unblowing bubbles: Understanding the physics of bubble deflation through a straw"**  
> Provenzano & Stefanini, Am. J. Phys. 93, 797–805 (2025)  
> DOI: [10.1119/5.0254263](https://doi.org/10.1119/5.0254263)

## Features

- **Accurate physics**: Implements the generalized model from the paper (Eq. 23)
- **Three.js visualization**: Real-time 3D bubble rendering
- **Soap effect**: Optional iridescent thin-film interference shader
- **Interactive controls**: Adjust initial radius, straw lengths, 2D/3D view

## Usage

### Standalone (copy this folder)

```html
<div id="my-simulation" class="bubble-simulation-container"></div>
<script type="module">
  import { init } from './bubble.js';
  init('my-simulation');
</script>
```

### As ES Module

```javascript
import { DeflatingBubbleScene } from './bubble.js';
const sim = new DeflatingBubbleScene('container-id');
```

## Dependencies

- [Three.js](https://threejs.org/) - 3D rendering
- [lil-gui](https://lil-gui.georgealways.com/) - GUI controls

Install via npm:
```bash
npm install three lil-gui
```

## Files

| File | Description |
|------|-------------|
| `bubble.js` | Main simulation module (physics + visualization) |
| `bubble.css` | Standalone styles |
| `index.html` | Demo page |

## Physics Constants

From paper Eq. 30:
- Surface tension σ = 2.48 × 10⁻² N/m
- Air viscosity μ = 1.84 × 10⁻⁵ Pa·s
- Air density ρ = 1.22 kg/m³
- Straw area A = 16.19 mm²

## License

Based on open-access research (CC BY-NC 4.0).
