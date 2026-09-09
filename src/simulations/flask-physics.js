// Perpetual_fountain.pdf, Eqs. (7)-(9): constant-section recirculating vessel.
// Model domain H > h; liquid leaving the hose returns to the reservoir.
export function flaskDerivative(v, p) {
  const { r_hose, r_container, h, H, L } = p;
  if (
    ![r_hose, r_container, h, H, L, v].every(Number.isFinite) ||
    r_hose <= 0 ||
    r_container <= r_hose ||
    h <= 0 ||
    H <= h ||
    L <= 0
  )
    throw new RangeError(
      "Require H > h > 0, L > 0, and container radius > hose radius.",
    );
  if (v <= 0) return 0;
  const rho = 1000,
    mu = 0.001,
    g = 9.81,
    S = Math.PI * r_hose ** 2,
    ratio = (r_hose / r_container) ** 2;
  return (
    (0.5 * (ratio ** 2 - 1) * v * v -
      ((8 * Math.PI * mu) / (rho * S)) * (ratio ** 2 * h + L) * v +
      g * (h - H)) /
    (ratio * h + L)
  );
}
export function stepFlask(v, dt, p) {
  if (!Number.isFinite(dt) || dt < 0)
    throw new RangeError("Time step must be finite and nonnegative.");
  const count = Math.max(1, Math.ceil(dt / 0.001)),
    h = dt / count;
  let elapsed = 0;
  for (let i = 0; i < count && v > 0; i++) {
    const k1 = flaskDerivative(v, p),
      k2 = flaskDerivative(Math.max(0, v + (h * k1) / 2), p);
    const k3 = flaskDerivative(Math.max(0, v + (h * k2) / 2), p),
      k4 = flaskDerivative(Math.max(0, v + h * k3), p);
    const next = v + (h * (k1 + 2 * k2 + 2 * k3 + k4)) / 6;
    if (next <= 0) {
      elapsed += (h * v) / (v - next);
      v = 0;
      break;
    }
    v = next;
    elapsed += h;
  }
  return { v, elapsed };
}
