// soap_bubble_deflation_paper.pdf, Eq. (23), Table I, Eq. (30).
export const A = 16.19e-6,
  sig = 2.48e-2,
  mu = 1.84e-5,
  ro = 1.22;
export const r_straw = Math.sqrt(A / Math.PI);
function validate(L, R0) {
  if (!Number.isFinite(L) || L < 0 || !Number.isFinite(R0) || R0 <= 0)
    throw new RangeError("Use L >= 0 and R0 > 0 in metres.");
}
// dt/dR in the generalized model; zero is its continuous endpoint limit.
export function timeDensity(R, L) {
  if (R === 0) return 0;
  const B = (8 * Math.PI * mu * L) / A;
  return (
    (Math.PI / (2 * sig * A)) *
    (B * R ** 3 + R ** 2.5 * Math.sqrt(B * B * R + 8 * ro * sig))
  );
}
export function calc_t_gen(L, R0, R) {
  validate(L, R0);
  if (!Number.isFinite(R) || R < 0 || R > R0)
    throw new RangeError("Radius must be between 0 and R0.");
  const n = 2048,
    h = (R0 - R) / n;
  let sum = timeDensity(R, L) + timeDensity(R0, L);
  for (let i = 1; i < n; i++)
    sum += (i % 2 ? 4 : 2) * timeDensity(R + i * h, L);
  return (sum * h) / 3;
}
export function calculate_duration_gen(L, R0) {
  return calc_t_gen(L, R0, 0);
}
// Precompute once per parameter change, then invert a monotone cumulative table.
export function createBubbleTimeline(L, R0, segments = 8192) {
  validate(L, R0);
  if (!Number.isInteger(segments) || segments < 16)
    throw new RangeError("At least 16 segments are required.");
  const remaining = new Float64Array(segments + 1),
    dr = R0 / segments;
  for (let i = 1; i <= segments; i++) {
    const lo = (i - 1) * dr,
      hi = i * dr;
    remaining[i] =
      remaining[i - 1] +
      (dr / 6) *
        (timeDensity(lo, L) +
          4 * timeDensity((lo + hi) / 2, L) +
          timeDensity(hi, L));
  }
  const duration = remaining[segments];
  return {
    duration,
    radiusAt(t) {
      if (!Number.isFinite(t)) throw new RangeError("Time must be finite.");
      if (t <= 0) return R0;
      if (t >= duration) return 0;
      const target = duration - t;
      let lo = 0,
        hi = segments;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (remaining[mid] < target) lo = mid;
        else hi = mid;
      }
      return (
        dr * (lo + (target - remaining[lo]) / (remaining[hi] - remaining[lo]))
      );
    },
  };
}
export function calc_rt_gen(L, R0, t) {
  return createBubbleTimeline(L, R0).radiusAt(t);
}
