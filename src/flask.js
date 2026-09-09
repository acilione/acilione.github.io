import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

// ==========================================
// PHYSICS (Provenzano 2025)
// ==========================================
import { stepFlask } from "./simulations/flask-physics.js";
// ==========================================
// SIMULATION
// ==========================================
class FlaskSimulation {
  constructor() {
    this.container = document.getElementById("scene-container");
    this.readout = document.getElementById("status-readout");

    this.params = {
      L_m: 0.8,
      r_hose_mm: 3.5,
      h_water_cm: 12.0,
      H_outlet_cm: 15.0,
      v0: 1.5,
      r_funnel_top_cm: 3.5,
      r_funnel_bot_cm: 3.5,
      funnel_height_cm: 18.0,
      scale: 25,
      reset: () => this.reset(),
      playPause: () => this.togglePlay(),
    };

    this.state = { v: 0, t: 0, running: false, stopped: false };
    this.clock = new THREE.Clock();

    this.initThree();
    this.initGUI();
    this.setupTheme();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.state.running) this.togglePlay();
    });
    this.reset();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.updateThemeColors();

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 6, 14);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 4, 0);
    this.controls.enableDamping = true;

    // Lighting for Glass/Water
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7);
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-5, 5, -5);
    this.scene.add(ambient, dirLight, backLight);

    new ResizeObserver(() => {
      this.camera.aspect =
        this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight,
      );
    }).observe(this.container);
  }

  buildScene() {
    if (this.modelGroup) {
      const materials = new Set();
      this.modelGroup.traverse((obj) => {
        obj.geometry?.dispose();
        if (obj.material) materials.add(obj.material);
      });
      materials.forEach((material) => material.dispose());
      this.scene.remove(this.modelGroup);
    }
    this.modelGroup = new THREE.Group();
    const s = this.params.scale;

    // --- MATERIALS (Based on Heron Fountain Reference) ---

    // Glass: High transmission, clear
    const glassMat = new THREE.MeshBasicMaterial({
      color: 0xabcbbb,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const waterMat = new THREE.MeshPhongMaterial({
      color: 0x69b9cf,
      emissive: 0x102d33,
      transparent: true,
      opacity: 0.65,
      shininess: 80,
      depthWrite: false,
    });
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xa3e6bf,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });

    // --- 1. FUNNEL ---
    const r_top = (this.params.r_funnel_top_cm / 100) * s;
    const r_bot = (this.params.r_funnel_bot_cm / 100) * s;
    const h_funnel = (this.params.funnel_height_cm / 100) * s;

    const funnelGeo = new THREE.CylinderGeometry(
      r_top,
      r_bot,
      h_funnel,
      64,
      1,
      true,
    );
    const funnel = new THREE.Mesh(funnelGeo, glassMat);
    funnel.position.y = h_funnel / 2;
    funnel.renderOrder = 1; // Render glass after opaque
    this.modelGroup.add(funnel);

    // --- 2. WATER VOLUME ---
    const h_w_val = this.params.h_water_cm / 100;
    const h_w_vis = h_w_val * s;
    const ratio = h_w_val / (this.params.funnel_height_cm / 100);
    const r_water_surf = r_bot + (r_top - r_bot) * ratio;

    // Slightly smaller radius to prevent z-fighting with glass
    const waterGeo = new THREE.CylinderGeometry(
      r_water_surf * 0.99,
      r_bot * 0.99,
      h_w_vis,
      32,
    );
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = h_w_vis / 2;
    water.renderOrder = 2; // Render water
    this.modelGroup.add(water);

    // --- 3. TUBE GEOMETRY ---
    const r_hose_vis = (this.params.r_hose_mm / 1000) * s;
    const H_vis = (this.params.H_outlet_cm / 100) * s;
    const loopRadius = r_top * 1.5;
    const funnelRimY = h_funnel;

    // Tight arc over the top
    const loopPeakY = funnelRimY + 0.15 * s;

    const points = [];
    // Start exactly at bottom (0,0,0) touching the tip
    points.push(new THREE.Vector3(0, 0, 0));

    // Curve outwards and slightly up/down
    points.push(new THREE.Vector3(0, -r_hose_vis * 2, 0)); // Initial fitting drop
    points.push(new THREE.Vector3(loopRadius * 0.5, -r_hose_vis * 4, 0)); // Curve out
    points.push(new THREE.Vector3(loopRadius, 0, 0)); // Bottom of loop align with base

    // Vertical run
    points.push(new THREE.Vector3(loopRadius, funnelRimY * 0.5, 0));

    // Top Arc
    points.push(new THREE.Vector3(loopRadius, loopPeakY * 0.9, 0));
    points.push(new THREE.Vector3(loopRadius * 0.2, loopPeakY, 0)); // Peak closer to center

    // Outlet
    points.push(new THREE.Vector3(0, H_vis, 0));

    const path = new THREE.CatmullRomCurve3(points);
    path.curveType = "centripetal";
    path.tension = 0.5;

    const hoseGeo = new THREE.TubeGeometry(path, 128, r_hose_vis, 16, false);
    const hose = new THREE.Mesh(hoseGeo, tubeMat);
    hose.renderOrder = 1;
    this.modelGroup.add(hose);

    this.outletPos = new THREE.Vector3(0, H_vis, 0);
    this.waterSurfaceY = h_w_vis;

    this.scene.add(this.modelGroup);
    this.initParticles();
  }

  initParticles() {
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem);
      this.particleSystem.geometry.dispose();
      this.particleSystem.material.dispose();
      this.pData = [];
    }
    const count = 1000;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < pos.length; i++) pos[i] = 1000;
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    // Particles match the water material color
    const mat = new THREE.PointsMaterial({
      color: 0x00aaff,
      size: 0.2,
      transparent: true,
      opacity: 0.6,
    });

    this.particleSystem = new THREE.Points(geo, mat);
    this.scene.add(this.particleSystem);
    this.pData = Array(count)
      .fill()
      .map(() => ({ active: false, vy: 0 }));
    this.pIdx = 0;
    this.spawnAccumulator = 0;
  }

  updateParticles(dt) {
    if (!this.particleSystem) return;
    const pos = this.particleSystem.geometry.attributes.position.array;
    const s = this.params.scale;

    if (this.state.v > 0.01) {
      this.spawnAccumulator =
        (this.spawnAccumulator || 0) + this.state.v * 480 * dt;
      const spawnRate = Math.floor(this.spawnAccumulator);
      this.spawnAccumulator -= spawnRate;
      for (let k = 0; k < spawnRate; k++) {
        const i = this.pIdx;
        // Slight scatter
        const theta = Math.random() * Math.PI * 2;
        const r =
          ((Math.sqrt(Math.random()) * this.params.r_hose_mm) / 1000) * s;

        pos[i * 3] = this.outletPos.x + r * Math.cos(theta);
        pos[i * 3 + 1] = this.outletPos.y;
        pos[i * 3 + 2] = this.outletPos.z + r * Math.sin(theta);

        this.pData[i].active = true;
        this.pData[i].vy = -this.state.v * s;
        this.pIdx = (this.pIdx + 1) % this.pData.length;
      }
    }

    for (let i = 0; i < this.pData.length; i++) {
      if (!this.pData[i].active) continue;
      this.pData[i].vy -= 9.81 * s * dt;
      pos[i * 3 + 1] += this.pData[i].vy * dt;

      if (pos[i * 3 + 1] <= this.waterSurfaceY) {
        this.pData[i].active = false;
        pos[i * 3 + 1] = 1000;
      }
    }
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();

    if (this.state.running) {
      let dt = Math.min(this.clock.getDelta(), 0.05);

      const p = {
        r_hose: this.params.r_hose_mm / 1000,
        r_container: this.params.r_funnel_top_cm / 100,
        h: this.params.h_water_cm / 100,
        H: this.params.H_outlet_cm / 100,
        L: this.params.L_m,
      };

      const result = stepFlask(this.state.v, dt, p);
      this.state.v = result.v;
      this.state.t += result.elapsed;
      if (this.state.v === 0) {
        this.state.running = false;
        this.state.stopped = true;
      }

      this.updateParticles(dt);
      this.updateReadout();
    }

    this.renderer.render(this.scene, this.camera);
  }

  reset() {
    this.state.v = this.params.v0;
    this.state.t = 0;
    this.state.stopped = false;
    this.state.running = false;
    this.buildScene();
    this.updateReadout();
  }

  togglePlay() {
    if (this.state.stopped) this.reset();
    this.state.running = !this.state.running;
    this.clock.start();
    this.updateReadout();
  }

  updateReadout() {
    const isFlowing = this.state.v > 0.001;
    const status = this.state.running
      ? isFlowing
        ? "FLOWING"
        : "STOPPED"
      : this.state.stopped
        ? "STOPPED"
        : "PAUSED";
    const color = "var(--accent)";

    this.readout.innerHTML = `
<strong style="color:${color}">${status}</strong>
Time:     ${this.state.t.toFixed(2)} s
Velocity: ${this.state.v.toFixed(3)} m/s
`;
  }

  initGUI() {
    const gui = new GUI({
      title: "Flask controls",
      container: document.getElementById("simulation-controls"),
    });
    gui.add(this.params, "playPause").name("Play / Pause");
    gui.add(this.params, "reset").name("Reset experiment");

    const f1 = gui.addFolder("Parameters");
    f1.add(this.params, "v0", 0.1, 5.0)
      .name("Initial push (m/s)")
      .onChange(() => this.reset());
    const outlet = f1
      .add(this.params, "H_outlet_cm", this.params.h_water_cm + 0.5, 25)
      .name("Outlet height (cm)")
      .onChange(() => this.reset());
    f1.add(this.params, "h_water_cm", 5, 15)
      .name("Water level (cm)")
      .onChange(() => {
        this.params.H_outlet_cm = Math.max(
          this.params.H_outlet_cm,
          this.params.h_water_cm + 0.5,
        );
        outlet.min(this.params.h_water_cm + 0.5).updateDisplay();
        this.reset();
      });
    f1.open();
  }

  setupTheme() {
    new MutationObserver(() => this.updateThemeColors()).observe(
      document.documentElement,
      { attributes: true, attributeFilter: ["data-theme"] },
    );
  }

  updateThemeColors() {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    this.scene.background = new THREE.Color(isDark ? 0x0d1211 : 0xf3f5f2);
  }
}

try {
  new FlaskSimulation();
} catch (error) {
  document.getElementById("scene-container").textContent =
    "The 3D view could not start. Please use a browser with WebGL enabled.";
  console.error(error);
}
