import test from "node:test";
import assert from "node:assert/strict";
import { HeronPhysics } from "../src/simulations/heron-fountain/physics.js";
import {
  A,
  sig,
  mu,
  ro,
  createBubbleTimeline,
  calc_t_gen,
  calculate_duration_gen,
} from "../src/simulations/bubble-deflation/physics.js";
import {
  flaskDerivative,
  stepFlask,
} from "../src/simulations/flask-physics.js";
const close = (actual, expected, tolerance) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${actual} differs from ${expected} by ${Math.abs(actual - expected)}`,
  );
test("Heron starts at atmospheric pressure with the paper dimensions", () => {
  const p = new HeronPhysics();
  close(p.p_D, p.p_atm, 1e-9);
  close(p.H + p.h_A, 0.317, 1e-12);
  close(p.S_A, 0.029, 1e-12);
  assert.ok(p.v2 > 0);
  assert.equal(p.v4, 0);
});
test("Heron continuity conserves total water at each step; Boyle invariant holds", () => {
  const p = new HeronPhysics(),
    volume = p.waterVolume;
  for (let i = 0; i < 10000; i++) {
    p.step(0.025);
    close(p.waterVolume, volume, 1e-13);
    close(p.p_D * p.airVolume, p.p_atm * p.V_D0, 1e-10);
    assert.ok(p.h_A >= 0 && p.h_C >= 0 && p.airVolume > 0);
  }
});
test("Heron matches both Bernoulli pressure balances during operation", () => {
  const p = new HeronPhysics();
  p.step(10);
  for (const [v, B, dp] of [
    [p.v2, p.B1, p.p_atm - p.p_D + p.rho * p.g * (p.h_A + p.H - p.h_B)],
    [p.v4, p.B2, p.p_D - p.p_atm + p.rho * p.g * (p.h_C - p.h_6)],
  ]) {
    assert.ok(v > 0);
    close(0.5 * p.rho * v * v + B * v, dp, 1e-8);
  }
});
test("Heron reaches the paper equilibrium with water remaining in B and C", () => {
  const p = new HeronPhysics();
  p.step(400);
  assert.ok(p.isStable);
  assert.equal(p.stopReason, "Equilibrium");
  assert.ok(p.h_B > 0 && p.h_C > 0);
  close(p.H + p.h_A - p.h_B + p.h_C, p.h_6, 1e-6);
});
test("Heron does not stop just because the receiving basin B is empty", () => {
  const p = new HeronPhysics();
  p.y0[1] = 0;
  p.reset();
  p.step(0.1);
  assert.ok(p.h_B > 0);
  assert.ok(!p.isStable);
});
test("Heron does not stop while the jet still has a pressure head", () => {
  const p = new HeronPhysics();
  p.h_B += 0.01;
  p.refresh();
  assert.equal(p.v2, 0);
  assert.ok(p.v4 > 0);
  p.step(0.001);
  assert.ok(!p.isStable);
});
test("Heron reports source C depletion and retains total water", () => {
  const p = new HeronPhysics();
  p.y0[2] = 1e-10;
  p.reset();
  p.h_B += 0.02;
  const total = p.waterVolume;
  p.step(0.1);
  assert.equal(p.stopReason, "Source C depleted");
  close(p.waterVolume, total, 1e-13);
});
test("Heron solution converges when the integration step is halved", () => {
  const a = new HeronPhysics(),
    b = new HeronPhysics();
  b.maxStep = 0.0025;
  a.step(60);
  b.step(60);
  close(a.h_A, b.h_A, 2e-6);
  close(a.h_B, b.h_B, 2e-6);
  close(a.h_C, b.h_C, 2e-6);
});
test("Bubble zero-length straw recovers the analytic inviscid limit", () => {
  const r = 0.04,
    expected = ((2 * Math.PI) / (7 * A)) * Math.sqrt((2 * ro) / sig) * r ** 3.5;
  close(calculate_duration_gen(0, r), expected, 1e-8);
});
test("Bubble long-straw limit approaches Poiseuille deflation time", () => {
  const L = 100,
    r = 0.04,
    expected = (2 * Math.PI ** 2 * mu * L * r ** 4) / (sig * A * A);
  close(calculate_duration_gen(L, r) / expected, 1, 1e-5);
});
test("Bubble inverse table matches independent quadrature across allowed parameters", () => {
  for (const L of [0.001, 0.01, 0.1, 0.2])
    for (const R0 of [0.01, 0.04, 0.1]) {
      const table = createBubbleTimeline(L, R0);
      close(table.duration, calculate_duration_gen(L, R0), 1e-7);
      for (const fraction of [0.01, 0.2, 0.7, 0.95, 0.999]) {
        const t = table.duration * fraction;
        close(calc_t_gen(L, R0, table.radiusAt(t)), t, table.duration * 2e-7);
      }
    }
});
test("Bubble radii shrink monotonically and clamp at the correct endpoints", () => {
  const timeline = createBubbleTimeline(0.1, 0.04);
  assert.equal(timeline.radiusAt(-1), 0.04);
  assert.equal(timeline.radiusAt(0), 0.04);
  let last = 0.04;
  for (let i = 1; i <= 1000; i++) {
    const r = timeline.radiusAt((timeline.duration * i) / 1000);
    assert.ok(r <= last && r >= 0);
    last = r;
  }
  assert.equal(timeline.radiusAt(timeline.duration + 1), 0);
  assert.ok(createBubbleTimeline(0.2, 0.04).duration > timeline.duration);
});
test("Bubble prediction is close to the Table I water-straw measurement", () => {
  // R0=4 cm, L=10 cm: 17.51 +/- .25 s; no fitted timing adjustment.
  close(calculate_duration_gen(0.1, 0.04), 17.51, 0.75);
});
const flask = { r_hose: 0.0035, r_container: 0.035, h: 0.12, H: 0.15, L: 0.8 };
test("Flask loses momentum monotonically and stops with outlet above water", () => {
  let v = 1.5;
  for (let i = 0; i < 5000 && v > 0; i++) {
    const next = stepFlask(v, 0.005, flask).v;
    assert.ok(next < v);
    v = next;
  }
  assert.equal(v, 0);
  assert.equal(stepFlask(0, 1, flask).v, 0);
});
test("Flask RK4 agrees with independent analytic Riccati stopping time", () => {
  const S = Math.PI * flask.r_hose ** 2,
    q = (flask.r_hose / flask.r_container) ** 2;
  const W = q * flask.h + flask.L,
    a = (1 - q * q) / 2,
    b = ((8 * Math.PI * 0.001) / (1000 * S)) * (q * q * flask.h + flask.L),
    c = 9.81 * (flask.H - flask.h);
  const d = Math.sqrt(4 * a * c - b * b),
    expected =
      ((2 * W) / d) * (Math.atan((2 * a * 1.5 + b) / d) - Math.atan(b / d));
  let v = 1.5,
    t = 0;
  while (v > 0) {
    const step = stepFlask(v, 0.02, flask);
    v = step.v;
    t += step.elapsed;
  }
  close(t, expected, 0.002);
});
test("Invalid parameters and time steps fail explicitly", () => {
  assert.throws(() => new HeronPhysics().step(NaN), RangeError);
  assert.throws(() => createBubbleTimeline(-1, 0.04), RangeError);
  assert.throws(() => createBubbleTimeline(0.1, 0), RangeError);
  assert.throws(() => flaskDerivative(1, { ...flask, H: 0.1 }), RangeError);
  assert.throws(() => stepFlask(1, -1, flask), RangeError);
});
