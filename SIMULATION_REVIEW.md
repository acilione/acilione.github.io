# Simulation review

This is the historical audit of the implementation before extraction. Current code and numerical tests live in [heron-fountain](https://github.com/acilione/heron-fountain), [bubble-deflation](https://github.com/acilione/bubble-deflation), and [boyles-flask](https://github.com/acilione/boyles-flask). Run npm test in each standalone repository; the website tests the integration only.

Reviewed against the supplied PDFs in `assets` on 2026-09-06. These assets are ignored by the repository; they were read locally and have not been copied into the public build.

## Heron’s fountain

Reference: `assets/Erone.pdf`, *The Incredible Amount of Physics Behind the Heron’s Fountain*, especially Eqs. (2), (8), (19), (20), (25), and Figs. 4 and 7.

The original positive velocity roots correctly represented the paper’s viscous Bernoulli model. The errors were in the surrounding implementation:

- Independent hard-coded area ratios did not conserve water. Each transfer now uses the same volume for donor and receiver, with rates derived from the actual pipe and basin areas.
- The initial C reference level disagreed with the starting state, creating sub-atmospheric initial air pressure. The Boyle-law reference now comes directly from the initial state.
- B is the receiving basin. Testing whether B is empty was not a valid stopping condition. The model now stops at joint flow equilibrium or source depletion, and does not stop while the other branch still flows.
- Unbounded forward Euler steps could overshoot and clipping negative heights could create water. Subdivided midpoint integration (maximum 5 ms) and donor-limited transfers preserve volume.
- A rationalized velocity root avoids cancellation close to equilibrium. Pressure and velocity readouts are refreshed from the accepted state.
- The plotted jet now follows the ballistic parabola, using cubic control points derived from endpoint velocities. The old control points did not produce the reported apex.
- Dye bookkeeping uses the actual transferred volumes and bounds the fraction removed from a donor. Tracer colors are illustrative.
- Browser checks verified finite geometry, including the 4.5 mm wall thickness expressed in scene units.

The water-apparatus defaults now use SA = 290 cm², SB = SC = 142 cm², air volume = 3550 cm³, H = 25.4 cm, nozzle height = 33.2 cm, and initial elevations z1 = 31.7 cm, z2 = 4.1 cm, z3 = 20.8 cm. The 6 mm pipe diameter and lengths 22 cm / 30.5 cm come from Fig. 4. In code, h_A is the depth above H, so z1 = H + h_A.

With B = 8πμL/S (units Pa·s/m), the velocity root is:
`v = 2Δp / (sqrt(B² + 2ρΔp) + B)`, for positive pressure head.

Limitations: this is the paper’s quasi-steady **laminar pipe model**, not a turbulence solver. The paper’s water experiment deviates from this prediction because of turbulent pipe flow. Pipe storage, jet flight delay in the reservoir balance, inlet losses, and meniscus effects are omitted. The visualization is schematic.

## Bubble deflation

Reference: `assets/soap_bubble_deflation_paper.pdf`, Provenzano & Stefanini, *Unblowing bubbles: Understanding the physics of bubble deflation through a straw*, American Journal of Physics 93 (2025), DOI [10.1119/5.0254263](https://doi.org/10.1119/5.0254263), especially Eq. (23), Table I, and Eq. (30).

The generalized time-radius expression was algebraically correct. Improvements:

- Use the published straw area, 16.19 mm², instead of the unexplained 16.0 mm² calibration. Keep σ = 0.0248 N/m, μ = 1.84 × 10⁻⁵ Pa·s, and ρ = 1.22 kg/m³.
- Cache a monotone cumulative time table when parameters change, then invert it by binary search and interpolation. This replaces repeated quadrature and root finding for each bubble on every animation frame.
- Handle the initial and final radii explicitly and reject invalid inputs.
- Remove the call to `animate()` from the resize handler, which previously started additional perpetual animation loops.
- Pause on hidden tabs, cap stalled frame deltas, reset consistently after parameter edits, and permit replay after completion.
- Dispose replaced GPU resources, fit the camera to parameter changes, and keep shader normals and view directions in the same coordinate space.
- Apply the internal refraction angle and reflection phase reversal to the illustrative thin-film effect.
- Exclude initial radii smaller than the straw from the UI range.

Limitations: the paper assumes a spherical bubble whose radius is large compared with the straw radius. Continuing to zero is a theoretical extrapolation, not a resolved model of final film collapse. The three-wavelength shader is illustrative, not a spectrally integrated optical model.

## Boyle’s flask

Reference: `assets/Perpetual_fountain.pdf`, *Debunking Boyle’s self-flowing flask*, especially Eqs. (7)–(9), the closed-loop assumptions in Sec. 2, and the analytic solutions in Appendix A. Published DOI: [10.1088/1361-6404/ae280c](https://doi.org/10.1088/1361-6404/ae280c).

The original W, X, Y, Z coefficients correctly represented the constant-section equation. However, the drawing was a tapered funnel and the implementation substituted an average radius without a derivation.

- Draw a cylindrical vessel and use its actual radius, matching the equation.
- Restrict controls to the paper’s recirculating configuration H > h. An outlet below the surface requires a different submerged-outlet boundary condition.
- Replace frame-sized Euler integration with subdivided RK4 and an interpolated zero-velocity event.
- Update initial-push edits immediately, distinguish stopped from paused, and support replay.
- Make particle emission depend on elapsed time, dispose rebuilt geometry/materials, and share the website navigation, theme, and responsive experiment layout.
- Include the flask in the public build and project links.

Limitations: constant level assumes immediate return of the discharged water; jet-flight storage is neglected. The model assumes a rounded inlet and laminar flow. The hose drawing is schematic; the governing length remains 0.8 m.

## Validation

`npm test` runs 16 independent checks:

- Heron initial atmospheric pressure, water conservation over thousands of steps, Boyle invariant, both Bernoulli pressure balances, equilibrium geometry, empty-receiver behavior, active-jet behavior, source depletion, and step refinement.
- Bubble analytic inviscid and Poiseuille limits, monotone radius evolution, inversion versus independent quadrature across UI parameters, endpoints, and a comparison with the Table I measurement (R0 = 4 cm, L = 10 cm, 17.51 s).
- Flask monotone decay, zero-velocity termination, and agreement with an independently evaluated analytic Riccati stopping time.
- Invalid input handling.

Production pages were checked in headless Chromium at desktop and phone widths, in both themes, including navigation and experiment play/pause. Numerical agreement with a paper model does not establish experimental accuracy outside its assumptions.
