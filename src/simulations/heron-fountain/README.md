# Heron's Fountain Simulation

A physics simulation of Heron's Fountain - an ancient pneumatic device that creates a self-sustaining water fountain using air pressure.

## Features

- **Accurate physics**: Simulates hydrostatic pressure, air compression (Boyle's Law), and viscous flow
- **Three.js visualization**: Real-time 3D water flow and jet rendering
- **Color mixing**: Watch dye colors mix between basins
- **Interactive controls**: Adjust time scale, view mode, play/pause/reset

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

Install via npm:
```bash
npm install three lil-gui
```

## Files

| File | Description |
|------|-------------|
| `heron.js` | Main simulation module (physics + visualization) |
| `heron.css` | Standalone styles |
| `index.html` | Demo page |

## Physics Model

The simulation models:
- Three interconnected basins (A, B, C)
- Air chamber D with isothermal compression
- Bernoulli/Torricelli flow with viscous losses
- Parabolic water jet trajectory

## License

Educational use.
