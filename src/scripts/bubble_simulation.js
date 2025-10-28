import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// =============================================================================
// NUMERICAL UTILITY FUNCTIONS
// =============================================================================

const PI = Math.PI;
// Area of the straw end in m²
const A = 16.0 * Math.pow(10, -6);
// Surface tension of soap solution in N/m (approximated)
const sig = 2.48 * Math.pow(10, -2);
// Viscosity of air in Pa·s
const mu = 1.84 * Math.pow(10, -5);
// Density of air in kg/m³
const ro = 1.22;
// Radius of the straw (calculated from A)
const r_straw = Math.sqrt(A / PI);

function integrateQuad(func, a, b, n = 2000) {
  if (a === b) return 0;
  const h = (b - a) / n;
  let sum = 0.5 * (func(a) + func(b));
  for (let i = 1; i < n; i++) sum += func(a + i * h);
  return sum * h;
}

function brent(
  f,
  lowerBound,
  upperBound,
  tolerance = 1e-6,
  maxIterations = 100
) {
  let a = lowerBound;
  let b = upperBound;
  let fa = f(a);
  let fb = f(b);
  if (fa * fb > 0) return 0;
  if (Math.abs(fa) < Math.abs(fb)) {
    [a, b] = [b, a];
    [fa, fb] = [fb, fa];
  }
  let c = a,
    fc = fa,
    s = 0,
    d = 0;
  let mflag = true;
  for (let i = 0; i < maxIterations; i++) {
    if (fb === 0 || Math.abs(b - a) <= tolerance) return b;
    if (fa !== fc && fb !== fc) {
      s =
        (a * fb * fc) / ((fa - fb) * (fa - fc)) +
        (b * fa * fc) / ((fb - fa) * (fb - fc)) +
        (c * fa * fb) / ((fc - fa) * (fc - fb));
    } else {
      s = b - fb * ((b - a) / (fb - fa));
    }
    if (
      (s - (3 * a + b) / 4) * (s - b) >= 0 ||
      (mflag && Math.abs(s - b) >= Math.abs(b - c) / 2) ||
      (!mflag && Math.abs(s - b) >= Math.abs(c - d) / 2) ||
      (mflag && Math.abs(b - c) < Math.abs(tolerance)) ||
      (!mflag && Math.abs(c - d) < Math.abs(tolerance))
    ) {
      s = (a + b) / 2;
      mflag = true;
    } else {
      mflag = false;
    }

    d = c;
    c = b;
    fc = fb;
    const fs = f(s);
    if (fa * fs < 0) {
      b = s;
      fb = fs;
    } else {
      a = s;
      fa = fs;
    }
    if (Math.abs(fa) < Math.abs(fb)) {
      [a, b] = [b, a];
      [fa, fb] = [fb, fa];
    }
  }
  return b;
}

function integrand(R, L) {
  return (
    Math.pow(R, 2.5) *
    Math.sqrt(1 + (8 / (ro * sig)) * Math.pow((PI * mu * L) / A, 2) * R)
  );
}

function calc_t_gen(L, R_0, R) {
  try {
    const integralRes = integrateQuad((r) => integrand(r, L), R, R_0);
    const term1 =
      ((Math.pow(PI, 2) * mu * L) / (sig * Math.pow(A, 2))) *
      (Math.pow(R_0, 4) - Math.pow(R, 4));
    const term2 = (PI / A) * Math.sqrt((2 * ro) / sig) * integralRes;
    return term1 + term2;
  } catch (e) {
    console.error("Error in calc_t_gen:", e);
    return 0;
  }
}

function calc_rt_gen(L, R_0, t) {
  const rootFunc = (R) => calc_t_gen(L, R_0, R) - t;
  return brent(rootFunc, 0.0, R_0, 1e-6, 100);
}

function calculate_duration_gen(L, R_0) {
  try {
    const integralRes = integrateQuad((r) => integrand(r, L), 0.0, R_0);
    const term1 =
      ((Math.pow(PI, 2) * mu * L) / (sig * Math.pow(A, 2))) * Math.pow(R_0, 4);
    const term2 = (PI / A) * Math.sqrt((2 * ro) / sig) * integralRes;
    return term1 + term2;
  } catch (e) {
    console.error("Error in calculate_duration_gen:", e);
    return 0;
  }
}

// =============================================================================
// THREE.JS SCENE IMPLEMENTATION
// =============================================================================

class DeflatingBubbleScene {
  constructor(containerId = "scene-container") {
    if (typeof THREE === "undefined")
      throw new Error("THREE.js is not loaded.");
    this.container = document.getElementById(containerId);
    if (!this.container)
      throw new Error(`Container element with id '${containerId}' not found.`);

    this.guiParams = {
      R_0: 4.0 * Math.pow(10, -2),
      L1: 1.0 * Math.pow(10, -2),
      L2: 5.0 * Math.pow(10, -2),
      L3: 10.0 * Math.pow(10, -2),
      isRunning: false,
      scale_factor: 40,
      viewMode: "2D",
      showDashedLines: true, // 💡 NEW: Dashed line toggle state
      playPause: () => {
        this.guiParams.isRunning = !this.guiParams.isRunning;
        this.handlePlayPause();
      },
    };

    this.clock = new THREE.Clock(false);
    this.guiControllers = [];

    this.controls = null;
    this.camera2D = null;
    this.camera3D = null;

    this.initThree();
    this.setupPhysicsAndAnimation();
    this.setupGUI();
    this.addTextLabels();

    this.animate = this.animate.bind(this);
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d1117); // Dark background

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);

    // --- DUAL CAMERA SETUP ---
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const viewSize = 12;

    // 2D Camera (Orthographic, fixed view)
    this.camera2D = new THREE.OrthographicCamera(
      -viewSize * aspect,
      viewSize * aspect,
      viewSize,
      -viewSize,
      0.1,
      100
    );
    this.camera2D.position.z = 5;

    // 3D Camera (Perspective, rotatable)
    this.camera3D = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera3D.position.set(0, 5, 15);
    this.camera3D.lookAt(0, 0, 0);

    this.camera = this.camera2D;

    // --- 3D CONTROLS (OrbitControls) ---
    this.controls = new OrbitControls(this.camera3D, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enabled = false;

    const light = new THREE.AmbientLight(0x404040, 10);
    this.scene.add(light);

    window.addEventListener("resize", this.onWindowResize.bind(this));

    this.straws = [];
    this.staticCircles = [];
  }

  onWindowResize() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const viewSize = 12;

    // Update 2D Camera
    this.camera2D.left = -viewSize * aspect;
    this.camera2D.right = viewSize * aspect;
    this.camera2D.top = viewSize;
    this.camera2D.bottom = -viewSize;
    this.camera2D.updateProjectionMatrix();

    // Update 3D Camera
    this.camera3D.aspect = aspect;
    this.camera3D.updateProjectionMatrix();

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.camera =
      this.guiParams.viewMode === "2D" ? this.camera2D : this.camera3D;

    // Re-position text on resize, as screen dimensions changed
    // The animate loop will handle the precise positioning
    this.animate();
  }

  handlePlayPause() {
    if (this.guiParams.isRunning) {
      this.bubble_active = this.bubble_durations.map(
        (d, i) => this.bubble_times[i] < d
      );
      this.clock.start();
    } else {
      this.clock.stop();
    }
  }

  resetAnimation(index) {
    const L_key = `L${index + 1}`;
    const L = this.guiParams[L_key];
    const R_0 = this.guiParams.R_0;

    this.bubble_durations[index] = calculate_duration_gen(L, R_0);
    this.max_duration = Math.max(...this.bubble_durations);

    this.bubble_times[index] = 0;
    this.bubble_active[index] = true;

    const pos = this.positions[index];
    const scaledR0 = R_0 * this.guiParams.scale_factor;

    // --- CALCULATIONS FOR FIXED BUBBLE TOP & STRAW ---
    const strawHeight = L * this.guiParams.scale_factor;
    const fixedTopY = pos.y;
    const initialBubbleCenterY = fixedTopY - scaledR0;
    const strawBottomY = fixedTopY;
    const strawCenterY = strawBottomY + strawHeight / 2;

    // Update straw (FIXED POSITION)
    const straw = this.straws[index];
    if (straw) {
      straw.scale.set(1, strawHeight, 1);
      straw.position.set(pos.x, strawCenterY, 0);
    }

    // Update circle (SPHERE)
    const circle = this.circles[index];
    if (circle) {
      circle.scale.setScalar(scaledR0);
      circle.position.y = initialBubbleCenterY;
    }

    // Update text
    if (this.textGroups && this.textGroups[index]) {
      this.textGroups[index].L.textContent = `L: ${(L * 100).toFixed(2)} cm`;
      this.textGroups[index].R.textContent = `R(t): ${(R_0 * 100).toFixed(
        2
      )} cm`;
      this.textGroups[index].time.textContent = `t: 0.0 s`;
      this.textGroups[index].group.style.opacity = 1;
    }

    // Update static dashed circle
    if (R_0 !== this._lastR0 || !this.staticCircles[index]) {
      if (this.staticCircles[index])
        this.scene.remove(this.staticCircles[index]);
      const static_circle_pos = new THREE.Vector3(
        pos.x,
        initialBubbleCenterY,
        pos.z
      );
      const static_circle = this.createDashedCircle(
        scaledR0,
        static_circle_pos
      );
      static_circle.visible = this.guiParams.showDashedLines;
      this.scene.add(static_circle);
      this.staticCircles[index] = static_circle;
    }

    this.addTextLabels();

    this.renderer.render(this.scene, this.camera);
  }

  setupPhysicsAndAnimation() {
    this.scene.children
      .filter((obj) => obj.userData && obj.userData.isBubbleComponent)
      .forEach((obj) => this.scene.remove(obj));

    this.straws = [];
    this.circles = [];
    this.staticCircles = [];

    const { L1, L2, L3, R_0, scale_factor } = this.guiParams;
    this._lastR0 = R_0;
    this.Ls = [L1, L2, L3];
    this.bubble_durations = this.Ls.map((L) => calculate_duration_gen(L, R_0));
    this.max_duration = Math.max(...this.bubble_durations);

    this.positions = [
      new THREE.Vector3(-8, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(8, 0, 0),
    ];

    this.bubble_times = [0, 0, 0];
    this.bubble_active = [true, true, true];

    // 💡 3D GEOMETRY DEFINITIONS
    const circleGeometry = new THREE.SphereGeometry(1, 32, 32);

    const strawRadius = r_straw * scale_factor;
    // Cylinder of unit height (1), scaled later
    const strawGeometry = new THREE.CylinderGeometry(
      strawRadius,
      strawRadius,
      1,
      32
    );

    const strawMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const scaledR0 = R_0 * scale_factor;

    this.Ls.forEach((L, i) => {
      const pos = this.positions[i];

      // --- CALCULATIONS FOR FIXED BUBBLE TOP & STRAW ---
      const strawHeight = L * scale_factor;
      const fixedTopY = pos.y;
      const initialBubbleCenterY = fixedTopY - scaledR0;
      const strawBottomY = fixedTopY;
      const strawCenterY = strawBottomY + strawHeight / 2;

      // static dashed circle (2D circle for outline)
      const static_circle_pos = new THREE.Vector3(
        pos.x,
        initialBubbleCenterY,
        pos.z
      );
      const static_circle = this.createDashedCircle(
        scaledR0,
        static_circle_pos
      );
      static_circle.userData.isBubbleComponent = true;
      static_circle.visible = this.guiParams.showDashedLines; // initial visibility
      this.scene.add(static_circle);
      this.staticCircles.push(static_circle);

      // DYNAMIC BUBBLE (SPHERE)
      const circleMaterial = new THREE.MeshBasicMaterial({
        color: 0x00bfff,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.position.set(pos.x, initialBubbleCenterY, pos.z);
      circle.scale.setScalar(scaledR0);
      circle.userData.isBubbleComponent = true;
      this.circles.push(circle);
      this.scene.add(circle);

      // STRAW (CYLINDER)
      const straw = new THREE.Mesh(strawGeometry, strawMaterial);
      straw.scale.set(1, strawHeight, 1);
      straw.position.set(pos.x, strawCenterY, 0);
      straw.userData.isBubbleComponent = true;
      this.straws.push(straw);
      this.scene.add(straw);
    });
  }

  createDashedCircle(radius, position) {
    const segments = 64;
    const points = [];
    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0)
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
      color: 0xffffff,
      linewidth: 1,
      scale: 1,
      dashSize: 0.1,
      gapSize: 0.1,
    });
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    line.position.copy(position);
    return line;
  }

  addTextLabels() {
    if (this.textOverlay) this.textOverlay.remove();

    this.textOverlay = document.createElement("div");
    this.textOverlay.style.cssText = `
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none; font-family: monospace; color: white;
                    padding: 10px;
                `;
    this.container.appendChild(this.textOverlay);

    this.textGroups = [];
    this.Ls = [this.guiParams.L1, this.guiParams.L2, this.guiParams.L3];

    this.Ls.forEach((L, i) => {
      const groupDiv = document.createElement("div");
      groupDiv.style.cssText = `
                        position: absolute; display: flex; flex-direction: column;
                        align-items: flex-start; font-size: 18px; line-height: 1.4;
                        text-shadow: 1px 1px 2px black;
                        transform: translate(-50%, 0);
                        /* Initial position is arbitrary, animate() will fix it */
                        left: 0px; top: 0px; 
                    `;

      const L_text = document.createElement("div");
      L_text.textContent = `L: ${(L * 100).toFixed(2)} cm`;

      const time_text = document.createElement("div");
      time_text.textContent = `t: 0.0 s`;

      const r_text = document.createElement("div");
      r_text.textContent = `R(t): ${(this.guiParams.R_0 * 100).toFixed(2)} cm`;

      groupDiv.appendChild(L_text);
      groupDiv.appendChild(time_text);
      groupDiv.appendChild(r_text);
      this.textOverlay.appendChild(groupDiv);

      this.textGroups.push({
        group: groupDiv,
        L: L_text,
        time: time_text,
        R: r_text,
      });
    });
  }

  toScreenPosition(vector3, camera, canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const vector = vector3.clone().project(camera);
    vector.x = ((vector.x + 1) / 2) * width;
    vector.y = (-(vector.y - 1) / 2) * height;
    return { x: vector.x, y: vector.y };
  }

  setupGUI() {
    let gui;
    try {
      gui = new GUI({ autoPlace: true, title: "Bubble Controls" });
    } catch (e) {
      gui = {
        domElement: document.createElement("div"),
        add: () => ({
          step: () => ({ onChange: () => ({ name: () => null }) }),
          name: () => null,
          onChange: () => null,
        }),
      };
    }

    this.gui = gui;
    this.container.appendChild(gui.domElement);
    gui.domElement.style.position = "fixed";
    gui.domElement.style.zIndex = "19";
    gui.domElement.style.top = "10%";
    gui.domElement.style.right = "10%";

    this.guiControllers = [];

    const playCtrl = gui
      .add(this.guiParams, "playPause")
      .name("▶️ / ⏸️ Start/Pause");
    this.guiControllers.push(playCtrl);

    const viewModeController = gui
      .add(this.guiParams, "viewMode", ["2D", "3D"])
      .name("View Mode")
      .onChange((value) => {
        this.camera = value === "2D" ? this.camera2D : this.camera3D;
        this.controls.enabled = value === "3D";
        this.onWindowResize();
      });
    this.guiControllers.push(viewModeController);

    // 💡 NEW: Dashed line visibility toggle
    const dashedCtrl = gui
      .add(this.guiParams, "showDashedLines")
      .name("Show Initial Radius")
      .onChange((value) => {
        this.staticCircles.forEach((circle) => {
          circle.visible = value;
        });
      });
    this.guiControllers.push(dashedCtrl);

    const R0_MIN = 0.1 * 1e-2;
    const R0_MAX = 10.0 * 1e-2;
    const R0_STEP = 0.1 * 1e-2;

    const r0Controller = gui.add(this.guiParams, "R_0", R0_MIN, R0_MAX);
    this.guiControllers.push(r0Controller);
    r0Controller
      .step(R0_STEP)
      .name("R₀ (Initial Radius, m)")
      .onChange(() => {
        this.guiParams.isRunning = false;
        this.setupPhysicsAndAnimation();
        this.addTextLabels();
        for (let i = 0; i < 3; i++) this.resetAnimation(i);
      });

    const L_MIN = 0.1 * 1e-2;
    const L_MAX = 20.0 * 1e-2;
    const L_STEP = 0.1 * 1e-2;

    const resetAllBubblesOnLChange = (index) => {
      this.guiParams.isRunning = false;
      this.resetAnimation(index);
      this.bubble_times = [0, 0, 0];
      this.bubble_active = [true, true, true];
      for (let i = 0; i < 3; i++) {
        if (i !== index) {
          this.Ls[i] = this.guiParams[`L${i + 1}`];
          this.resetAnimation(i);
        }
      }
      this.addTextLabels();
    };

    const l1 = gui.add(this.guiParams, "L1", L_MIN, L_MAX);
    this.guiControllers.push(l1);
    l1.step(L_STEP)
      .name("L₁ (Length 1, m)")
      .onChange(() => resetAllBubblesOnLChange(0));

    const l2 = gui.add(this.guiParams, "L2", L_MIN, L_MAX);
    this.guiControllers.push(l2);
    l2.step(L_STEP)
      .name("L₂ (Length 2, m)")
      .onChange(() => resetAllBubblesOnLChange(1));

    const l3 = gui.add(this.guiParams, "L3", L_MIN, L_MAX);
    this.guiControllers.push(l3);
    l3.step(L_STEP)
      .name("L₃ (Length 3, m)")
      .onChange(() => resetAllBubblesOnLChange(2));

    const resetObj = { reset: () => this.resetAll() };
    const resetCtrl = gui.add(resetObj, "reset");
    this.guiControllers.push(resetCtrl);
    resetCtrl.name("🔄 Reset All");
  }

  resetAll() {
    this.guiParams.R_0 = 4.0 * Math.pow(10, -2);
    this.guiParams.L1 = 1.0 * Math.pow(10, -2);
    this.guiParams.L2 = 5.0 * Math.pow(10, -2);
    this.guiParams.L3 = 10.0 * Math.pow(10, -2);
    this.guiParams.isRunning = false;
    this.guiParams.showDashedLines = true;

    this.setupPhysicsAndAnimation();
    this.addTextLabels();

    for (let i = 0; i < 3; i++) this.resetAnimation(i);

    for (const ctrl of this.guiControllers) {
      try {
        if (ctrl && typeof ctrl.updateDisplay === "function")
          ctrl.updateDisplay();
      } catch (e) {
        // ignore
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(this.animate);

    if (this.guiParams.viewMode === "3D") {
      this.controls.update();
    }

    // 💡 DYNAMIC TEXT POSITIONING: Update text position every frame
    if (this.textGroups && this.circles.length > 0) {
      // Calculate the fixed world Y position for the text (below the initial bubble size)
      const yOffset =
        this.guiParams.R_0 * this.guiParams.scale_factor * 2 + 0.5;
      const yTextRef = this.positions[0].y - yOffset;

      this.Ls.forEach((L, i) => {
        const pos = this.positions[i];

        // Use the consistent X/Z position, and the calculated Y position
        const worldPosition = new THREE.Vector3(pos.x, yTextRef, pos.z);

        // Convert the 3D world coordinate to a 2D screen coordinate
        const textScreenPos = this.toScreenPosition(
          worldPosition,
          this.camera,
          this.renderer.domElement
        );

        const groupDiv = this.textGroups[i].group;

        // Update the CSS position using translate(-50%, 0) from the center point
        groupDiv.style.left = `${textScreenPos.x}px`;
        groupDiv.style.top = `${textScreenPos.y}px`;
      });
    }

    this.renderer.render(this.scene, this.camera);

    if (!this.guiParams.isRunning) {
      return;
    }

    const delta = this.clock.getDelta();

    for (let i = 0; i < 3; i++) {
      if (!this.bubble_active[i]) continue;

      const duration = this.bubble_durations[i];
      let newTime = this.bubble_times[i] + delta;

      if (newTime >= duration) {
        newTime = duration;
        this.bubble_active[i] = false;
        this.textGroups[i].group.style.opacity = 0.5;
      }
      this.bubble_times[i] = newTime;

      const L = this.guiParams[`L${i + 1}`];
      const R_0 = this.guiParams.R_0;
      const R_t = calc_rt_gen(L, R_0, newTime);

      const scaledR = Math.max(0, R_t) * this.guiParams.scale_factor;

      // Update circle scale (SPHERE)
      if (this.circles[i]) this.circles[i].scale.setScalar(scaledR);

      const fixedTopY = this.positions[i].y;

      // New Center Y = Fixed Top Y - Current Radius.
      const newBubbleCenterY = fixedTopY - scaledR;

      if (this.circles[i]) this.circles[i].position.y = newBubbleCenterY;

      // update textual UI
      if (this.textGroups && this.textGroups[i]) {
        this.textGroups[i].time.textContent = `t: ${newTime.toFixed(3)} s`;
        this.textGroups[i].R.textContent = `R(t): ${(R_t * 100).toFixed(2)} cm`;
      }
    }

    if (this.bubble_active.every((a) => !a)) {
      this.guiParams.isRunning = false;
      this.clock.stop();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    // Ensure the container is ready before initializing the scene
    new DeflatingBubbleScene("scene-container");
  } catch (e) {
    console.error("Failed to initialize DeflatingBubbleScene:", e);
  }
});
