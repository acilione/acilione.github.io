# Antonino Cilione — personal website

A minimal portfolio and interactive physics experiments, built with Parcel and Three.js.

## Development

Use Node.js 22.13 or newer (Node 24 recommended).

```sh
npm install
npm run cv:setup
npm start
```

Open the URL printed by Parcel. All six public HTML entry points are included.

## Checks and production build

```sh
npm test
npm run cv:check
npm run build
npm run site:check
```

The build writes the GitHub Pages site to `docs/`. Existing historical bundles are retained. Deployment is not performed by the build command.

The browser check opens all six built pages, checks simulation initialization and local assets, exercises both CV downloads, and checks the mobile CV layout. Parcel explicitly targets browsers; the Node.js engine requirement applies to development tools.

## CV

Edit [cv/Antonino_Cilione_CV.md](cv/Antonino_Cilione_CV.md), then run `npm run cv:build`. The Markdown supplies the website, Markdown download, and a separately typeset, text-based PDF. Starting or building the website also regenerates these files.

See [cv/README.md](cv/README.md) for the export pipeline, ATS formatting sources, and PDF validation checks.

Physics is separated from rendering in:

- `src/simulations/heron-fountain/physics.js`
- `src/simulations/bubble-deflation/physics.js`
- `src/simulations/flask-physics.js`

See [SIMULATION_REVIEW.md](SIMULATION_REVIEW.md) for the references, corrections, assumptions, and validation. The supplied papers remain in the locally ignored `assets/` folder.
