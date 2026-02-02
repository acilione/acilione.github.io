import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// =============================================================================
// HERON'S FOUNTAIN SIMULATION
// =============================================================================
// This is a standalone module. Export: HeronFountainScene class
// Usage: import { HeronFountainScene } from './heron.js';
//        new HeronFountainScene('container-id');
// =============================================================================

// =============================================================================
// PHYSICS IMPLEMENTATION (Revised)
// =============================================================================

class HeronPhysics {
  constructor() {
    // --- Costanti del Modello Fisico (Constants of the Physical Model) ---
    this.alpha = 1 / 1024; // Unitless ratio
    this.beta = 1 / 502; // Unitless ratio
    this.gamma = 1 / 502; // Unitless ratio

    // Costanti Fisiche (Physical Constants)
    this.rho = 1000.0; // Density of water [kg/m³]
    this.g = 9.8; // Acceleration due to gravity [m/s²]
    this.p_atm = 101325.0; // Atmospheric pressure [Pa]

    this.wallThickness = 0.2; // Thickness of basin walls [m]
    // Parametri Geometrici del Sistema (Geometric Parameters of the System)
    this.S_B = 0.0142; // Cross-sectional area of water surface in Basin B [m²]
    this.S_C = 0.0142; // Cross-sectional area of water surface in Basin C [m²]

    // *** BUG 2 FIX ***
    // The area of A is the sum of B and C
    this.S_A = this.S_B + this.S_C;

    this.V_D0 = 0.00355; // Initial volume of air in the air chamber (connecting B and C) [m³]

    // Livelli di Riferimento Iniziali (Initial Reference Levels)
    this.h_B0_ref = 0.04; // Initial water height in Basin B [m]
    this.h_C0_ref = 0.21; // Initial water height in Basin C [m]

    // Altezze Verticali Fisse (Fixed Vertical Heights)
    this.h_6 = 0.33; // Height of the nozzle above the bottom reference [m]
    this.H = 0.25; // Height difference between the surface of Basin A and the top surface of B/C volume [m]

    // Perdite viscose (Poiseuille) (Viscous Losses)
    this.eta = 0.001; // Dynamic viscosity of water [Pa·s] or [kg/(m·s)]
    this.S = 0.0000285; // Cross-sectional area of the narrow internal pipes [m²]
    this.L1 = 0.22; // Length of the pipe segment (related to flow Q_AB/v2) [m]
    this.L2 = 0.31; // Length of the pipe segment (related to flow Q_C4/v4) [m]

    // Viscous resistance coefficient [kg/(m·s)]
    this.B1 = (8 * Math.PI * this.eta * this.L1) / this.S;
    this.B2 = (8 * Math.PI * this.eta * this.L2) / this.S;

    // Initial heights (h_A, h_B, h_C) [m]
    this.y0 = [0.06, 0.04, 0.2];

    // Tolerance and Guard Parameters
    this.EPS_DHB = 1e-4; // Epsilon for checking if dhB/dt is near zero [m/s]
    this.H_EPSILON = 1e-5; // Small tolerance for height check [m]
    this.T_GUARD = 10.0; // Time guard for stability check [s]

    // State Variables (Initialised in reset)
    this.t = 0.0; // Elapsed time [s]
    this.h_A = 0.0; // Water height in Basin A [m]
    this.h_B = 0.0; // Water height in Basin B [m]
    this.h_C = 0.0; // Water height in Basin C [m]
    this.v2 = 0.0; // Velocity in pipe (A->B) [m/s]
    this.v4 = 0.0; // Velocity of the water jet (at nozzle 4) [m/s]
    this.isStable = false; // System stability flag (unitless)

    // *** NEW ***: Expose p_D for visualizer
    this.p_D = this.p_atm; // Initial air pressure

    this.reset();
  }

  reset() {
    [this.h_A, this.h_B, this.h_C] = this.y0;
    this.t = 0.0;
    this.v2 = 0.0;
    this.v4 = 0.0;
    this.isStable = false;

    // *** NEW ***: Calculate initial p_D for the visualizer
    const delta_V_reset =
      (this.h_B0_ref - this.y0[1]) * this.S_B +
      (this.h_C0_ref - this.y0[2]) * this.S_C;
    const V_D = this.V_D0 + delta_V_reset;
    this.p_D = (this.p_atm * this.V_D0) / V_D;
  }

  system(h_A, h_B, h_C) {
    // Change in total air/water volume in B and C relative to initial state [m³]
    const delta_V =
      (this.h_B0_ref - h_B) * this.S_B + (this.h_C0_ref - h_C) * this.S_C;
    // Current volume of air in the air chamber D [m³]
    const V_D = this.V_D0 + delta_V;
    // Current pressure in the air chamber D (Boyle's Law: P*V = constant) [Pa]

    // *** MODIFIED ***: Update class property
    this.p_D = (this.p_atm * this.V_D0) / V_D;

    // Total pressure head driving flow v2 (A to B) [Pa]
    const deltaP_AB =
      this.p_atm - this.p_D + this.rho * this.g * (h_A + this.H - h_B);
    // Total pressure head driving flow v4 (C to jet) [Pa]
    const deltaP_C4 =
      this.p_D - this.p_atm + this.rho * this.g * (h_C - this.h_6);

    // Velocity v2 (from A to B) - derived from modified Bernoulli/Torricelli with viscous term B1 [m/s]
    const v2 =
      (-this.B1 +
        Math.sqrt(this.B1 ** 2 + 2 * this.rho * Math.max(deltaP_AB, 0.0))) /
      this.rho;
    // Velocity v4 (of the jet) - derived from modified Bernoulli/Torricelli with viscous term B2 [m/s]
    const v4 =
      (-this.B2 +
        Math.sqrt(this.B2 ** 2 + 2 * this.rho * Math.max(deltaP_C4, 0.0))) /
      this.rho;

    this.v2 = v2;
    this.v4 = v4;

    // Change in height over time (Flow rate / Area) [m/s]
    const dhA_dt = -this.alpha * v2 + this.alpha * v4; // Change in h_A [m/s]
    const dhB_dt = this.beta * v2; // Change in h_B [m/s]
    const dhC_dt = -this.gamma * v4; // Change in h_C [m/s]

    return [dhA_dt, dhB_dt, dhC_dt];
  }

  step(dt) {
    if (this.isStable) return;

    // Check if Basin B is empty
    if (this.h_B < this.H_EPSILON) {
      this.h_B = 0; // Snap to zero
      this.isStable = true;
      this.v2 = 0;
      this.v4 = 0;
      return;
    }

    const [dhA_dt, dhB_dt, dhC_dt] = this.system(this.h_A, this.h_B, this.h_C);

    // Check for stability (e.g., flow is near zero)
    if (this.t > this.T_GUARD && Math.abs(dhB_dt) < this.EPS_DHB) {
      this.isStable = true;
      this.v2 = 0;
      this.v4 = 0;
      return;
    }

    this.h_A += dhA_dt * dt;
    this.h_B = Math.max(0, this.h_B + dhB_dt * dt);
    this.h_C += dhC_dt * dt;
    this.t += dt;

    this.h_A = Math.max(0, this.h_A);
    this.h_C = Math.max(0, this.h_C);
  }
}

// =============================================================================
// THREE.JS SCENE IMPLEMENTATION (MODIFIED)
// =============================================================================

class HeronFountainScene {
  constructor(containerId = "scene-container") {
    this.container = document.getElementById(containerId);
    if (!this.container)
      throw new Error(`Container element with id '${containerId}' not found.`);

    // --- *** REVERTED ***: guiParams
    this.guiParams = {
      isRunning: false,
      timeScale: 1.0,
      viewMode: "3D",
      playPause: () => {
        this.guiParams.isRunning = !this.guiParams.isRunning;
        this.handlePlayPause();
      },
      reset: () => {
        this.resetAll();
      },
    };

    // --- Setup di base ---
    this.clock = new THREE.Clock(false);
    this.elapsedTime = 0.0;
    // --- *** REMOVED ***: this.accumulator
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = null;
    this.camera2D = null;
    this.camera3D = null;
    this.camera = null;
    this.h_jet = 0.0;
    this.currentColors = null; // Initialize the currentColors property

    // --- *** NEW ***: Theme observer ---
    this.themeObserver = null;

    // --- Oggetti di scena ---
    this.scale = 20; // 1 meter = 20 units in three.js
    this.physics = new HeronPhysics();
    this.waterA = null;
    this.waterB = null;
    this.waterC = null;
    this.waterCascade = null; // Tube mesh
    this.waterPipe14 = null; // Water mesh inside pipe (A->B)
    this.waterPipe56 = null; // Water mesh inside pipe (C->Jet)
    this.pipe56 = null; // Reference to the glass pipe
    this.cascadeCurve = null; // Curve object
    this.textOverlay = null;
    this.textGroups = {};

    // We will track the mass of each dye (R, G, B) in each basin.
    this.dyeMassA = { r: 0, g: 0, b: 0 };
    this.dyeMassB = { r: 0, g: 0, b: 0 };
    this.dyeMassC = { r: 0, g: 0, b: 0 };
    // We assume an initial concentration of 1.0 mass unit per volume unit.
    this.initialConcentration = 1.0;

    // --- Layout constants (scaled) ---
    this.H_scaled = this.physics.H * this.scale;
    this.h6_scaled = this.physics.h_6 * this.scale;

    // Layout sizes
    this.worldWidth = 0.3 * this.scale;
    this.worldDepth = 0.1 * this.scale;
    this.internalWallBCH = 0.22 * this.scale;
    this.topBasinY = this.H_scaled;
    this.topBasinHeight = 3;

    // --- Pipe & Jet Radius (Unscaled) ---
    // Calculate inner radius based on the physics area 'S'
    this.pipeInnerRadius = Math.sqrt(this.physics.S / Math.PI); // approx 0.00301m (3.01mm)
    // Add a 1mm wall thickness
    this.pipeOuterRadius = this.pipeInnerRadius + 0.001; // approx 0.00401m (4.01mm)
    // The jet's radius is the *inner* radius of the pipe
    this.jetRadius = this.pipeInnerRadius;

    this.initThree();
    this.setupSceneGeometry();
    this.setupGUI();
    this.addTextLabels();
    this.resetAll(); // resetAll() will now call resetColors()

    this.animate = this.animate.bind(this);
    this.animate();
  }

  // --- *** THEME FUNCTIONS *** ---
  /**
   * Gets the current theme from the HTML data attribute.
   * Defaults to 'light'.
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  /**
   * Updates the scene's background color based on the current theme.
   */
  updateSceneTheme() {
    const theme = this.getCurrentTheme();
    if (this.scene) {
      this.scene.background = new THREE.Color(
        theme === "dark" ? 0x202020 : 0xffffff
      );
    }
  }

  /**
   * Sets up a MutationObserver to watch for changes to the
   * `data-theme` attribute on the <html> tag.
   */
  setupThemeObserver() {
    this.themeObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          this.updateSceneTheme();
        }
      }
    });

    this.themeObserver.observe(document.documentElement, { attributes: true });
  }

  initThree() {
    // Set initial background color based on theme
    this.updateSceneTheme();

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    const aspect = this.container.clientWidth / this.container.clientHeight;
    const viewSize = 15;

    this.camera2D = new THREE.OrthographicCamera(
      -viewSize * aspect,
      viewSize * aspect,
      viewSize,
      -viewSize,
      0.1,
      100
    );
    this.camera2D.position.set(0, 0, 50);
    this.camera2D.lookAt(0, this.H_scaled, 0);

    this.camera3D = new THREE.PerspectiveCamera(50, aspect, 0.1, 200);
    this.camera3D.position.set(15, 12, 25);
    this.camera3D.lookAt(0, this.H_scaled, 0);

    this.camera = this.camera3D;

    this.controls = new OrbitControls(this.camera3D, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, this.H_scaled, 0);
    this.controls.enabled = this.guiParams.viewMode === "3D";

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    window.addEventListener("resize", this.onWindowResize.bind(this));

    // --- Auto-pause to prevent "time bomb" ---
    window.addEventListener("blur", () => {
      if (this.guiParams.isRunning) {
        this.guiParams.playPause(); // This toggles isRunning and stops the clock
      }
    });

    // Start listening for theme changes
    this.setupThemeObserver();
  }

  setupSceneGeometry() {
    const waterMaterial = new THREE.MeshPhysicalMaterial({
      transmission: 1.0,
      roughness: 0.05,    // Low roughness
      metalness: 0.0,     // Explicitly non-metallic
      ior: 1.33,          // Index of Refraction for water
      thickness: 1.5 * this.scale,
      clearcoat: 1.0,     // Adds a glossy surface layer
      clearcoatRoughness: 0.0, // Ensures the surface is highly reflective/smooth
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      thickness: 0.5,
      roughness: 0.05,
      ior: 1.52,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const pipeGlassMaterial = new THREE.MeshPhysicalMaterial({
      ...glassMaterial,
      color: 0xffa500,
    });

    const basinWidth = this.worldWidth / 2;
    const basinDepth = this.worldDepth;

    const waterAMaterial = new THREE.MeshPhysicalMaterial({ ...waterMaterial });
    const waterBMaterial = new THREE.MeshPhysicalMaterial({ ...waterMaterial });
    const waterCMaterial = new THREE.MeshPhysicalMaterial({ ...waterMaterial });

    // Water boxes
    const waterGeom = new THREE.BoxGeometry(1, 1, 1);
    this.waterA = new THREE.Mesh(waterGeom, waterAMaterial);
    this.waterA.scale.set(this.worldWidth, 1, basinDepth);

    this.waterA.renderOrder = 2;
    this.scene.add(this.waterA);

    this.waterB = new THREE.Mesh(waterGeom, waterBMaterial);
    this.waterB.scale.set(basinWidth, 1, basinDepth);
    this.waterB.position.x = -basinWidth / 2;

    this.waterB.renderOrder = 2;

    this.scene.add(this.waterB);

    this.waterC = new THREE.Mesh(waterGeom, waterCMaterial);
    this.waterC.scale.set(basinWidth, 1, basinDepth);
    this.waterC.position.x = basinWidth / 2;

    this.waterC.renderOrder = 2;
    this.scene.add(this.waterC);

    // Walls (glass)
    const wallThickness = this.physics.wallThickness;
    const createWall = (w, h, d, x, y, z) => {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geom, glassMaterial.clone()); // Use clone
      mesh.position.set(x, y, z);

      mesh.renderOrder = 1;

      this.scene.add(mesh);

      return mesh;
    };

    createWall(
      this.worldWidth + wallThickness * 2,
      wallThickness,
      basinDepth + wallThickness * 2,
      0,
      -wallThickness / 2,
      0
    );
    createWall(
      this.worldWidth + wallThickness * 2,
      wallThickness,
      basinDepth + wallThickness * 2,
      0,
      this.H_scaled,
      0
    );
    createWall(
      this.worldWidth + wallThickness * 2,
      wallThickness,
      basinDepth + wallThickness * 2,
      0,
      this.topBasinY + this.topBasinHeight,
      0
    );

    const totalHeight = this.topBasinY + this.topBasinHeight;
    createWall(
      wallThickness,
      totalHeight,
      basinDepth + wallThickness,
      -this.worldWidth / 2 - wallThickness / 2,
      totalHeight / 2 - wallThickness / 2,
      0
    );
    createWall(
      wallThickness,
      totalHeight,
      basinDepth + wallThickness,
      this.worldWidth / 2 + wallThickness / 2,
      totalHeight / 2 - wallThickness / 2,
      0
    );
    createWall(
      this.worldWidth + wallThickness * 2,
      totalHeight,
      wallThickness,
      0,
      totalHeight / 2 - wallThickness / 2,
      -basinDepth / 2 - wallThickness / 2
    );
    createWall(
      this.worldWidth + wallThickness * 2,
      totalHeight,
      wallThickness,
      0,
      totalHeight / 2 - wallThickness / 2,
      basinDepth / 2 + wallThickness / 2
    );

    // Internal divider
    createWall(
      wallThickness,
      this.internalWallBCH, // Use scaled value
      basinDepth,
      0,
      this.internalWallBCH / 2,
      0
    );

    // Pipes (MODIFIED for hollow appearance)
    const s = this.scale;
    const innerR_scaled = this.pipeInnerRadius * s;
    const outerR_scaled = this.pipeOuterRadius * s;

    /**
     * Helper function to create a thick-walled hollow pipe
     * using THREE.ExtrudeGeometry.
     */
    const createHollowPipe = (outerR, innerR, height, x, y_center, z) => {
      // 1. Create the Annulus (ring) shape
      const shape = new THREE.Shape();
      shape.absarc(0, 0, outerR, 0, Math.PI * 2, false); // Outer circle
      const hole = new THREE.Path();
      hole.absarc(0, 0, innerR, 0, Math.PI * 2, true); // Inner circle (hole)
      shape.holes.push(hole);

      // 2. Define extrusion settings
      const extrudeSettings = {
        depth: height, // The length of the pipe
        bevelEnabled: false,
      };

      // 3. Create the geometry
      const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      // 4. Create the mesh
      const mesh = new THREE.Mesh(geom, pipeGlassMaterial.clone()); // Use transparent glass

      // 5. Orient and position the mesh
      // ExtrudeGeometry builds along the Z-axis. We rotate it to stand along the Y-axis.
      mesh.rotation.x = Math.PI / 2;

      // The CylinderGeometry's position 'y' was its center.
      // The Extruded geometry (after rotation) runs from y=0 to y=height.
      // We set its position so its center matches the original y_center.
      mesh.position.set(x, y_center + height / 2, z);

      mesh.renderOrder = 1;
      this.scene.add(mesh);

      return mesh;
    };

    // Tubo 1-4 (A -> B)
    createHollowPipe(
      outerR_scaled,
      innerR_scaled,
      this.H_scaled, // height
      -basinWidth / 2, // x
      this.H_scaled / 2, // y_center
      0 // z
    );

    // Tubo 5-6 (C -> A -> Jet)
    this.pipe56 = createHollowPipe(
      outerR_scaled,
      innerR_scaled,
      this.h6_scaled, // height
      basinWidth / 2, // x
      this.h6_scaled / 2, // y_center
      0 // z
    );

    // --- Water inside the pipes ---

    // Water for Tube 1-4 (A -> B)
    const waterPipeGeom1 = new THREE.CylinderGeometry(
      innerR_scaled,
      innerR_scaled,
      this.H_scaled, // NOTE: This is the *original* height
      16
    );
    this.waterPipe14 = new THREE.Mesh(waterPipeGeom1, waterMaterial.clone());
    this.waterPipe14.position.set(-basinWidth / 2, this.H_scaled / 2, 0);
    this.waterPipe14.visible = false;

    this.waterPipe14.renderOrder = 2;
    this.scene.add(this.waterPipe14);

    // Water for Tube 5-6 (C -> Jet)
    const waterPipeGeom2 = new THREE.CylinderGeometry(
      innerR_scaled,
      innerR_scaled,
      this.h6_scaled, // NOTE: This is the *original* height
      16
    );
    this.waterPipe56 = new THREE.Mesh(waterPipeGeom2, waterMaterial.clone());
    this.waterPipe56.position.set(basinWidth / 2, this.h6_scaled / 2, 0);
    this.waterPipe56.visible = false;

    this.waterPipe56.renderOrder = 2;
    this.scene.add(this.waterPipe56);

    // --- Curved water jet using TubeGeometry ---
    const cascadeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x40a0ff,
      transmission: 0.7,
      thickness: 0.1 * this.scale,
      roughness: 0.3,
      ior: 1.33,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    // Initialize with a dummy curve
    // this.jetRadius is now unscaled inner radius. We scale it for the geometry.
    const path = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 1, 1)
    );
    const tubeGeometry = new THREE.TubeGeometry(
      path,
      20,
      this.jetRadius * s,
      8,
      false
    );

    this.waterCascade = new THREE.Mesh(tubeGeometry, cascadeMaterial);
    this.waterCascade.visible = false; // Initially hidden

    this.waterCascade.renderOrder = 3;
    this.scene.add(this.waterCascade);
  }

  setupGUI() {
    let gui;
    try {
      gui = new GUI({ autoPlace: true, title: "Heron's Fountain Controls" });
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

    // const guiContainer = document.getElementById("info-panel");
    // if (guiContainer) {
    //   guiContainer.appendChild(gui.domElement);
    // }

    gui.add(this.guiParams, "playPause").name("▶️ / ⏸️ Start/Pause");
    gui.add(this.guiParams, "reset").name("🔄 Reset All");
    gui.add(this.guiParams, "timeScale", 0.1, 5.0, 0.1).name("Time Scale");
    gui
      .add(this.guiParams, "viewMode", ["2D", "3D"])
      .name("View Mode")
      .onChange((value) => {
        this.camera = value === "2D" ? this.camera2D : this.camera3D;
        this.controls.enabled = value === "3D";
        this.onWindowResize();
      });
  }

  // --- *** REVERTED ***: resetColors
  resetColors() {
    // Get initial volumes from the physics model
    const volA0 = this.physics.y0[0] * this.physics.S_A; // h_A * S_A
    const volB0 = this.physics.y0[1] * this.physics.S_B; // h_B * S_B
    const volC0 = this.physics.y0[2] * this.physics.S_C; // h_C * S_C

    // Set initial dye mass based on volume and concentration
    this.dyeMassA = {
      r: volA0 * this.initialConcentration,
      g: 0,
      b: 0,
    };
    this.dyeMassB = {
      r: 0,
      g: volB0 * this.initialConcentration,
      b: 0,
    };
    this.dyeMassC = {
      r: 0,
      g: 0,
      b: volC0 * this.initialConcentration,
    };

    // Apply the initial visual colors (for frame 0)
    // We use a subtractive (pigment) model: 1.0 - (other colors)
    if (this.waterA) this.waterA.material.color.setRGB(1, 0, 0); // Red
    if (this.waterB) this.waterB.material.color.setRGB(0, 1, 0); // Green
    if (this.waterC) this.waterC.material.color.setRGB(0, 0, 1); // Blue
    if (this.waterCascade) this.waterCascade.material.color.setRGB(0, 0, 1);
  }

  // --- *** REVERTED ***: resetAll
  resetAll() {
    this.guiParams.isRunning = false;
    this.clock.stop();
    this.elapsedTime = 0.0;
    // --- *** REMOVED ***: this.accumulator
    this.physics.reset(); // This now uses the default y0 values
    this.h_jet = 0.0;

    this.resetColors(); // This now uses the default y0 values

    this.updateWaterMeshes();

    // Reset the water cascade
    this.waterCascade.visible = false;

    // Hide water in pipes (will be set by updatePipeWaterLevels)
    if (this.waterPipe14) this.waterPipe14.visible = false;
    if (this.waterPipe56) this.waterPipe56.visible = false;

    this.updateTextLabels();

    // --- Manually update colors one last time after reset ---
    this.updateWaterColors(0.0);
  }

  handlePlayPause() {
    if (this.guiParams.isRunning) {
      if (this.physics.isStable) {
        this.resetAll();
      }
      this.guiParams.isRunning = true;
      this.clock.start();
    } else {
      this.clock.stop();
    }
  }

  updateWaterMeshes() {
    const { h_A, h_B, h_C } = this.physics;
    const s = this.scale;

    const hA_s = Math.max(0.01, h_A * s);
    const hB_s = Math.max(0.01, h_B * s);
    this.waterB.visible = h_B > 0; // Hide mesh if empty

    const hC_s = Math.max(0.01, h_C * s);

    this.waterA.scale.y = hA_s;
    this.waterA.position.y = this.H_scaled + hA_s / 2;

    this.waterB.scale.y = hB_s;
    this.waterB.position.y = hB_s / 2;

    this.waterC.scale.y = hC_s;
    this.waterC.position.y = hC_s / 2;
  }

  /**
   * Vertical jet
   */
  updateCascade(dt) {
    // Hide immediately if stable
    if (this.physics.isStable) {
      this.waterCascade.visible = false;
      return;
    }

    // We use the actual unscaled velocity (m/s) for calculating the trajectory
    const v4 = Math.max(0, this.physics.v4);

    // Set a minimum threshold for visibility
    if (v4 < 0.1 || !this.guiParams.isRunning) {
      this.waterCascade.visible = false;
      return;
    }

    this.waterCascade.visible = true;

    // --- Scaled Position Constants ---
    const s = this.scale;
    const G = this.physics.g; // Unscaled gravity

    // The ExtrudeGeometry's X/Z position is correct
    const nozzleX = this.pipe56.position.x;
    const nozzleZ = this.pipe56.position.z;
    // The nozzle Y is the top of the pipe
    const nozzleY = this.h6_scaled;

    const waterATopY = this.waterA.position.y + this.waterA.scale.y / 2;

    // --- Trajectory Parameters ---

    // Set angle to be almost vertical (e.g., 85 degrees) to match image
    const angleRad = (Math.PI * 85) / 180;

    // Unscaled velocity components
    const v_y0 = v4 * Math.sin(angleRad); // High vertical velocity
    const v_x0 = v4 * Math.cos(angleRad); // Low horizontal velocity

    // --- Calculate Time of Flight (T) and Landing Position ---

    // Target landing Y is the water surface in Basin A
    const finalY_target = waterATopY - 0.5 * this.jetRadius * s;

    // Quadratic equation coefficients (scaled)
    const a = 0.5 * G * s;
    const b = -v_y0 * s;
    const c = finalY_target - nozzleY;

    const discriminant = b * b - 4 * a * c;

    let timeToFall = 0;
    if (discriminant >= 0) {
      timeToFall = (-b + Math.sqrt(discriminant)) / (2 * a);
    }

    timeToFall = isNaN(timeToFall) ? 0.2 : Math.max(0.1, timeToFall);

    // Calculate final position (scaled coordinates)
    const horizontalOffset = -v_x0 * timeToFall * s;
    const endX = nozzleX + horizontalOffset;
    const endY = finalY_target;
    const endZ = nozzleZ;

    // --- Define the Curved Path (Cubic Bezier Curve) ---

    const p0 = new THREE.Vector3(nozzleX, nozzleY, nozzleZ);
    const p3 = new THREE.Vector3(endX, endY, endZ);

    // 1. Calculate Apex Position (Scaled)
    const t_apex = v_y0 / G; // Time to reach max height (unscaled)
    const apexY = nozzleY + v_y0 * t_apex * s - 0.5 * G * t_apex * t_apex * s;
    const apexX = nozzleX + horizontalOffset / 2.0;

    const actualApexY = Math.max(apexY, nozzleY);

    // 2. Control Point 1 (P1):
    const p1 = new THREE.Vector3(
      p0.x + (p3.x - p0.x) * (1 / 3),
      actualApexY, // Force control point to height of apex
      p0.z
    );

    // 3. Control Point 2 (P2):
    const p2 = new THREE.Vector3(
      p0.x + (p3.x - p0.x) * (2 / 3),
      actualApexY, // Force control point to height of apex
      p3.z
    );

    // Create the new curve
    this.cascadeCurve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);

    // --- Update Tube Geometry ---
    if (this.waterCascade.geometry) {
      this.waterCascade.geometry.dispose();
    }

    const segments = 30;

    // Create new Tube Geometry
    this.waterCascade.geometry = new THREE.TubeGeometry(
      this.cascadeCurve,
      segments,
      this.jetRadius * s, // Use scaled inner radius
      8,
      false
    );

    // Update h_jet for the display
    const jetHeightMeters = (v_y0 * v_y0) / (2 * G);
    this.h_jet = jetHeightMeters;
  }

  updateWaterColors(dt) {
    if (dt <= 0) return; // Do not run if time is not advancing

    const epsilon = 1e-6; // Prevent division by zero

    // --- 1. Get current volumes from physics ---
    const volA = this.physics.h_A * this.physics.S_A + epsilon;
    const volB = this.physics.h_B * this.physics.S_B + epsilon;
    const volC = this.physics.h_C * this.physics.S_C + epsilon;

    // --- 2. Get volumetric flow rates (m³/s) and flow volumes (m³) ---
    // Q_C4 = (dhC/dt) * S_C = (gamma * v4) * S_C
    const flowVolume_CA =
      this.physics.gamma * this.physics.v4 * this.physics.S_C * dt;
    // Q_AB = (dhB/dt) * S_B = (beta * v2) * S_B
    const flowVolume_AB =
      this.physics.beta * this.physics.v2 * this.physics.S_B * dt;

    // --- 3. Mass Transfer: C -> A (Jet) ---
    if (flowVolume_CA > 0 && this.physics.v4 > 0.01) {
      // Find concentration (mass/volume) in C
      const concR_C = this.dyeMassC.r / volC;
      const concG_C = this.dyeMassC.g / volC;
      const concB_C = this.dyeMassC.b / volC;

      // Find mass transferred (concentration * flow_volume)
      const massR_flow = concR_C * flowVolume_CA;
      const massG_flow = concG_C * flowVolume_CA;
      const massB_flow = concB_C * flowVolume_CA;

      // Update masses in A and C
      this.dyeMassA.r += massR_flow;
      this.dyeMassA.g += massG_flow;
      this.dyeMassA.b += massB_flow;

      this.dyeMassC.r = Math.max(0, this.dyeMassC.r - massR_flow);
      this.dyeMassC.g = Math.max(0, this.dyeMassC.g - massG_flow);
      this.dyeMassC.b = Math.max(0, this.dyeMassC.b - massB_flow);
    }

    // --- 4. Mass Transfer: A -> B (Pipe) ---
    if (flowVolume_AB > 0 && this.physics.v2 > 0.01) {
      // Find concentration (mass/volume) in A
      const concR_A = this.dyeMassA.r / volA;
      const concG_A = this.dyeMassA.g / volA;
      const concB_A = this.dyeMassA.b / volA;

      // Find mass transferred (concentration * flow_volume)
      const massR_flow = concR_A * flowVolume_AB;
      const massG_flow = concG_A * flowVolume_AB;
      const massB_flow = concB_A * flowVolume_AB;

      // Update masses in B and A
      this.dyeMassB.r += massR_flow;
      this.dyeMassB.g += massG_flow;
      this.dyeMassB.b += massB_flow;

      this.dyeMassA.r = Math.max(0, this.dyeMassA.r - massR_flow);
      this.dyeMassA.g = Math.max(0, this.dyeMassA.g - massG_flow);
      this.dyeMassA.b = Math.max(0, this.dyeMassA.b - massB_flow);
    }

    // --- 5. Apply Visual Colors (Subtractive Pigment Model) ---
    // This model correctly mixes R+B=Purple and R+G+B=Brown/Black.

    // Clamp concentration (0.0 to 1.0) for the color model
    const clamp = (val) => Math.max(0, Math.min(val, 1.0));

    // Calculate concentrations in A
    const cR_A = clamp(this.dyeMassA.r / volA / this.initialConcentration);
    const cG_A = clamp(this.dyeMassA.g / volA / this.initialConcentration);
    const cB_A = clamp(this.dyeMassA.b / volA / this.initialConcentration);

    // Calculate concentrations in B
    const cR_B = clamp(this.dyeMassB.r / volB / this.initialConcentration);
    const cG_B = clamp(this.dyeMassB.g / volB / this.initialConcentration);
    const cB_B = clamp(this.dyeMassB.b / volB / this.initialConcentration);

    // Calculate concentrations in C
    const cR_C = clamp(this.dyeMassC.r / volC / this.initialConcentration);
    const cG_C = clamp(this.dyeMassC.g / volC / this.initialConcentration);
    const cB_C = clamp(this.dyeMassC.b / volC / this.initialConcentration);

    // Apply subtractive mixing: Color = 1.0 - (other pigments)
    this.waterA.material.color.setRGB(
      clamp(1.0 - cG_A - cB_A),
      clamp(1.0 - cR_A - cB_A),
      clamp(1.0 - cR_A - cG_A)
    );

    this.waterB.material.color.setRGB(
      clamp(1.0 - cG_B - cB_B),
      clamp(1.0 - cR_B - cB_B),
      clamp(1.0 - cR_B - cG_B)
    );

    this.waterC.material.color.setRGB(
      clamp(1.0 - cG_C - cB_C),
      clamp(1.0 - cR_C - cB_C),
      clamp(1.0 - cR_C - cG_C)
    );

    // Jet, Pipe 1-4, and Pipe 5-6 take the color of their source basin
    this.waterCascade.material.color.copy(this.waterC.material.color);
    this.waterPipe56.material.color.copy(this.waterC.material.color);
    this.waterPipe14.material.color.copy(this.waterA.material.color);
  }

  /**
   * *** NEW METHOD ***
   * Updates the visual water level inside the pipes based on physics.
   */
  updatePipeWaterLevels() {
    const s = this.scale;
    // Only show pipe water if running and not stable
    const isRunning = this.guiParams.isRunning && !this.physics.isStable;
    const h_min_scaled = 0.01 * s; // Minimum visible height

    // --- Pipe 1-4 (A -> B) ---
    // This pipe represents water falling from Basin A (at y=H) down to the
    // water level of Basin B (at y=h_B).
    const h_A_unscaled = this.physics.h_A;
    const h_B_unscaled = this.physics.h_B;
    const H_unscaled = this.physics.H; // Top of pipe

    // The water column in the pipe exists between the top of the pipe (H)
    // and the water level in Basin B (h_B).
    let waterHeight_unscaled = Math.max(0, H_unscaled - h_B_unscaled);
    let waterHeight_scaled = waterHeight_unscaled * s;

    // The Y-position of the *bottom* of this water column is h_B
    let waterBottom_scaled = h_B_unscaled * s;

    // The Y-position of the *center* of this water column
    let waterCenter_scaled = waterBottom_scaled + waterHeight_scaled / 2;

    // We only show this water if:
    // 1. The simulation is running.
    // 2. There is actually water falling (v2 > 0.01).
    // 3. There is water in Basin A to fall from (h_A > 0).
    // 4. The pipe isn't 'full' (h_B < H).
    if (
      isRunning &&
      this.physics.v2 > 0.01 &&
      h_A_unscaled > 0 &&
      waterHeight_scaled > h_min_scaled
    ) {
      this.waterPipe14.visible = true;

      // The original geometry was H_scaled tall.
      // We must scale its Y-axis to match the new calculated height.
      // (new_height / original_height)
      this.waterPipe14.scale.y = Math.max(
        0.001,
        waterHeight_scaled / this.H_scaled
      );

      // We must also move its position to the new center.
      this.waterPipe14.position.y = waterCenter_scaled;
    } else {
      this.waterPipe14.visible = false;
    }

    // --- Pipe 5-6 (C -> Jet) ---
    // This pipe's water level rises based on air pressure p_D.
    const { p_D, rho, g, h_C, h_6, p_atm } = this.physics;

    // Calculate the static height the water *would* reach in the pipe (unscaled)
    // h_pipe = (Pressure_Diff / (rho*g)) + source_height
    let h_pipe_unscaled = (p_D - p_atm) / (rho * g) + h_C;

    // Clamp 1: Water level in pipe can't be *lower* than the source (Basin C)
    h_pipe_unscaled = Math.max(h_C, h_pipe_unscaled);
    // Clamp 2: Water level can't be *higher* than the physical pipe's end (nozzle)
    h_pipe_unscaled = Math.min(h_pipe_unscaled, h_6);
    // Clamp 3: Water level can't be negative
    h_pipe_unscaled = Math.max(0, h_pipe_unscaled);

    const h_pipe_scaled = h_pipe_unscaled * s;

    if (h_pipe_scaled > h_min_scaled && isRunning) {
      this.waterPipe56.visible = true;

      // The geometry for waterPipe56 was created with height h6_scaled
      // We must scale its Y-axis to match the new calculated height
      this.waterPipe56.scale.y = Math.max(
        0.001,
        h_pipe_scaled / this.h6_scaled
      );

      // We must also move its position, as the center of the
      // cylinder is now at (h_pipe_scaled / 2)
      this.waterPipe56.position.y = h_pipe_scaled / 2;
    } else {
      this.waterPipe56.visible = false;
    }
  }

  // --- UI & helpers (Unchanged) ---

  addTextLabels() {
    if (this.textOverlay) this.textOverlay.remove();

    this.textOverlay = document.createElement("div");
    this.textOverlay.className = "text-label-overlay";
    this.container.appendChild(this.textOverlay);

    const createLabel = (id) => {
      const div = document.createElement("div");
      div.className = "label-group";
      div.id = id;
      this.textOverlay.appendChild(div);
      return div;
    };

    this.textGroups.A = createLabel("label-A");
    this.textGroups.B = createLabel("label-B");
    this.textGroups.C = createLabel("label-C");
    this.textGroups.Time = createLabel("label-Time");
    this.textGroups.Jet = createLabel("label-Jet");
  }

  toScreenPosition(vector3, camera, canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const vector = vector3.clone().project(camera);
    vector.x = ((vector.x + 1) / 2) * width;
    vector.y = (-(vector.y - 1) / 2) * height;
    return { x: vector.x, y: vector.y };
  }

  updateTextLabels() {
    if (!this.textGroups.A) return;

    const s = this.scale;
    const canvas = this.renderer.domElement;

    const posA = new THREE.Vector3(
      0,
      this.H_scaled + this.topBasinHeight - 1,
      0
    );
    const posB = new THREE.Vector3(-this.worldWidth / 4, this.H_scaled - 1, 0);
    const posC = new THREE.Vector3(this.worldWidth / 4, this.H_scaled - 1, 0);
    const posJet = new THREE.Vector3(
      this.worldWidth / 8,
      this.h6_scaled + 2,
      0
    );

    const screenPosA = this.toScreenPosition(posA, this.camera, canvas);
    this.textGroups.A.style.left = `${screenPosA.x}px`;
    this.textGroups.A.style.top = `${screenPosA.y}px`;
    this.textGroups.A.innerHTML = `
                <div>Basin A</div>
                <div>h_A: ${(this.physics.h_A * 100).toFixed(1)} cm</div>
                `;

    const screenPosB = this.toScreenPosition(posB, this.camera, canvas);
    this.textGroups.B.style.left = `${screenPosB.x}px`;
    this.textGroups.B.style.top = `${screenPosB.y}px`;
    this.textGroups.B.innerHTML = `
                <div>Basin B</div>
                <div>h_B: ${(this.physics.h_B * 100).toFixed(1)} cm</div>
                `;

    const screenPosC = this.toScreenPosition(posC, this.camera, canvas);
    this.textGroups.C.style.left = `${screenPosC.x}px`;
    this.textGroups.C.style.top = `${screenPosC.y}px`;
    this.textGroups.C.innerHTML = `
                <div>Basin C</div>
                <div>h_C: ${(this.physics.h_C * 100).toFixed(1)} cm</div>
                `;

    const screenPosJet = this.toScreenPosition(posJet, this.camera, canvas);
    this.textGroups.Jet.style.left = `${screenPosJet.x}px`;
    this.textGroups.Jet.style.top = `${screenPosJet.y}px`;
    this.textGroups.Jet.innerHTML = `
                <div>Jet</div>
                <div>v_4: ${this.physics.v4.toFixed(2)} m/s</div>
                <div>h_jet: ${(this.h_jet * 100).toFixed(1)} cm</div>
                `;

    this.textGroups.Time.style.left = `50%`;
    this.textGroups.Time.style.top = `100px`;

    const status = this.physics.isStable
      ? "STABLE (B empty)"
      : this.guiParams.isRunning
        ? "RUNNING"
        : "PAUSED";
    this.textGroups.Time.innerHTML = `
                <div>Time: ${this.physics.t.toFixed(2)} s</div>
                <div>State: ${status}</div>
                `;
  }

  onWindowResize() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const viewSize = 8;

    this.camera2D.left = -viewSize * aspect;
    this.camera2D.right = viewSize * aspect;
    this.camera2D.top = viewSize;
    this.camera2D.bottom = -viewSize;
    this.camera2D.updateProjectionMatrix();

    this.camera3D.aspect = aspect;
    this.camera3D.updateProjectionMatrix();

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }

  // --- *** REVERTED ***: animate()
  animate() {
    requestAnimationFrame(this.animate);

    if (this.guiParams.viewMode === "3D") {
      this.controls.update();
    }

    if (this.guiParams.isRunning) {
      // Get the real time delta, uncapped
      const delta = this.clock.getDelta() * this.guiParams.timeScale;

      this.elapsedTime += delta;

      if (!this.physics.isStable) {
        this.physics.step(delta);
        this.updateWaterMeshes();
        this.updateWaterColors(delta);
      } else {
        // If stable, stop running the simulation automatically
        this.guiParams.isRunning = false;
        this.clock.stop();
      }

      this.updateCascade(delta); // Use the new curve update
    } else {
      // Even when paused, allow the cascade to hide
      this.updateCascade(0.0);
    }

    // *** NEW ***: Call this every frame
    this.updatePipeWaterLevels();

    this.updateTextLabels();
    this.renderer.render(this.scene, this.camera);
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Initialize the Heron's Fountain simulation in a container.
 * @param {string} containerId - The ID of the container element
 * @returns {HeronFountainScene} The simulation instance
 */
export function init(containerId = "scene-container") {
  return new HeronFountainScene(containerId);
}

export { HeronFountainScene, HeronPhysics };
export default HeronFountainScene;

