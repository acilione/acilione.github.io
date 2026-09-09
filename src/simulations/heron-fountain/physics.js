// Erone.pdf: Eqs. (2), (8), (19), (20); water apparatus, Figs. 4 and 7.
// SI units. h_A is depth above H; paper z1 = H + h_A.
export class HeronPhysics {
  constructor() {
    this.rho = 1000;
    this.g = 9.8;
    this.p_atm = 101325;
    this.eta = 0.001;
    this.S_A = 0.029;
    this.S_B = 0.0142;
    this.S_C = 0.0142;
    this.S = Math.PI * 0.003 ** 2;
    this.L1 = 0.22;
    this.L2 = 0.305;
    this.H = 0.254;
    this.h_6 = 0.332;
    this.V_D0 = 0.00355;
    this.y0 = [0.317 - this.H, 0.041, 0.208];
    this.alpha = this.S / this.S_A;
    this.beta = this.S / this.S_B;
    this.gamma = this.S / this.S_C;
    this.maxStep = 0.005;
    this.reset();
  }
  get B1() {
    return (8 * Math.PI * this.eta * this.L1) / this.S;
  }
  get B2() {
    return (8 * Math.PI * this.eta * this.L2) / this.S;
  }
  get airVolume() {
    return this.airVolumeAt(this.h_B, this.h_C);
  }
  get waterVolume() {
    return this.S_A * this.h_A + this.S_B * this.h_B + this.S_C * this.h_C;
  }
  airVolumeAt(b, c) {
    return (
      this.V_D0 + this.S_B * (this.y0[1] - b) + this.S_C * (this.y0[2] - c)
    );
  }
  reset() {
    [this.h_A, this.h_B, this.h_C] = this.y0;
    this.t = 0;
    this.isStable = false;
    this.stopReason = "";
    this.transferredAB = 0;
    this.transferredCA = 0;
    this.refresh();
  }
  velocity(head, B) {
    if (head <= 0) return 0;
    // Rationalized positive root: avoids subtractive cancellation near equilibrium.
    return (2 * head) / (Math.sqrt(B * B + 2 * this.rho * head) + B);
  }
  flows(a, b, c) {
    const volume = this.airVolumeAt(b, c);
    if (!(volume > 0))
      throw new RangeError("Air chamber volume must be positive.");
    const pressure = (this.p_atm * this.V_D0) / volume;
    return {
      pressure,
      v2:
        a > 0
          ? this.velocity(
              this.p_atm - pressure + this.rho * this.g * (a + this.H - b),
              this.B1,
            )
          : 0,
      v4:
        c > 0
          ? this.velocity(
              pressure - this.p_atm + this.rho * this.g * (c - this.h_6),
              this.B2,
            )
          : 0,
    };
  }
  system(a, b, c) {
    const { v2, v4 } = this.flows(a, b, c);
    return [
      (this.S * (v4 - v2)) / this.S_A,
      (this.S * v2) / this.S_B,
      (-this.S * v4) / this.S_C,
    ];
  }
  refresh() {
    Object.assign(this, this.flows(this.h_A, this.h_B, this.h_C));
    this.p_D = this.pressure;
  }
  step(dt) {
    if (!Number.isFinite(dt) || dt < 0)
      throw new RangeError("Time step must be finite and nonnegative.");
    this.transferredAB = 0;
    this.transferredCA = 0;
    if (this.isStable || dt === 0) return;
    const count = Math.ceil(dt / this.maxStep),
      h = dt / count;
    for (let i = 0; i < count && !this.isStable; i++) {
      const state = [this.h_A, this.h_B, this.h_C];
      const k = this.system(...state);
      // A donor exhausted within this step still transfers its remaining liquid.
      const middle = state.map((v, j) =>
        Math.max(v > 0 ? Number.EPSILON : 0, v + (k[j] * h) / 2),
      );
      const { v2, v4 } = this.flows(...middle);
      // Transfer the same volume out of a donor and into its receiver.
      const ca = Math.min(this.S * v4 * h, this.S_C * this.h_C);
      const ab = Math.min(this.S * v2 * h, this.S_A * this.h_A + ca);
      this.h_A += (ca - ab) / this.S_A;
      this.h_B += ab / this.S_B;
      this.h_C -= ca / this.S_C;
      this.h_A = Math.max(0, this.h_A);
      this.h_C = Math.max(0, this.h_C);
      this.transferredAB += ab;
      this.transferredCA += ca;
      this.t += h;
      this.refresh();
      if (this.h_C <= 1e-12) this.stopReason = "Source C depleted";
      else if (this.h_A <= 1e-12 && this.v4 === 0)
        this.stopReason = "Basin A depleted";
      else if (this.v2 < 1e-6 && this.v4 < 1e-6)
        this.stopReason = "Equilibrium";
      if (this.stopReason) {
        this.isStable = true;
        this.v2 = 0;
        this.v4 = 0;
      }
    }
  }
}
