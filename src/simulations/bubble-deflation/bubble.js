import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// =============================================================================
// SOAP BUBBLE DEFLATION SIMULATION
// Based on: "Unblowing bubbles" - Provenzano & Stefanini (Am. J. Phys. 93, 2025)
// =============================================================================
// This is a standalone module. Export: DeflatingBubbleScene class
// Usage: import { DeflatingBubbleScene } from './bubble.js';
//        new DeflatingBubbleScene('container-id');
// =============================================================================

// =============================================================================
// NUMERICAL UTILITY FUNCTIONS
// =============================================================================

import { r_straw, createBubbleTimeline } from "./physics.js";

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
      showDashedLines: true,
      soapEffect: true, // Toggle soap bubble visual effect (iridescence)
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
        theme === "dark" ? 0x0d1211 : 0xf3f5f2, // Originale dark, bianco per light
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
    this.scene = new THREE.Scene();
    this.updateSceneTheme();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
    this.container.appendChild(this.renderer.domElement);

    // --- DUAL CAMERA SETUP ---
    const aspect = this.container.clientWidth / this.container.clientHeight;

    let horizontalHalfWidth = 0;
    if (this.container.clientWidth > 1280) {
      horizontalHalfWidth = 28;
    } else {
      horizontalHalfWidth = 14;
    }
    const verticalHalfHeight = horizontalHalfWidth / aspect;

    this.camera2D = new THREE.OrthographicCamera(
      -horizontalHalfWidth,
      horizontalHalfWidth,
      verticalHalfHeight,
      -verticalHalfHeight,
      0.1,
      100,
    );
    this.camera2D.position.z = 5;

    // 3D Camera (Perspective, rotatable)
    this.camera3D = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera3D.position.set(0, 4, 36);
    this.camera3D.lookAt(0, 0, 0);

    this.camera = this.camera2D;

    // --- 3D CONTROLS (OrbitControls) ---
    this.controls = new OrbitControls(this.camera3D, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enabled = false;

    const light = new THREE.AmbientLight(0x404040, 10);
    this.scene.add(light);

    this.resizeObserver = new ResizeObserver(() => this.onWindowResize());
    this.resizeObserver.observe(this.container);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.guiParams.isRunning)
        this.guiParams.playPause();
    });

    this.straws = [];
    this.staticCircles = [];

    this.setupThemeObserver();
  }

  onWindowResize() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const verticalNeeded = Math.max(
      6,
      this.guiParams.R_0 * this.guiParams.scale_factor * 2 + 1,
      Math.max(this.guiParams.L1, this.guiParams.L2, this.guiParams.L3) *
        this.guiParams.scale_factor +
        1,
    );
    const horizontalHalfWidth = Math.max(14, verticalNeeded * aspect);
    const verticalHalfHeight = horizontalHalfWidth / aspect;
    this.camera2D.left = -horizontalHalfWidth;
    this.camera2D.right = horizontalHalfWidth;
    this.camera2D.top = verticalHalfHeight;
    this.camera2D.bottom = -verticalHalfHeight;
    this.camera2D.updateProjectionMatrix();

    // Update 3D Camera
    this.camera3D.aspect = aspect;
    this.camera3D.zoom = Math.min(1, aspect);
    this.camera3D.updateProjectionMatrix();

    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );

    this.camera =
      this.guiParams.viewMode === "2D" ? this.camera2D : this.camera3D;

    // The existing animation loop will reposition labels on its next frame.
  }

  handlePlayPause() {
    if (this.guiParams.isRunning) {
      this.bubble_active = this.bubble_durations.map(
        (d, i) => this.bubble_times[i] < d,
      );
      if (this.bubble_active.every((active) => !active)) {
        this.bubble_times = [0, 0, 0];
        this.bubble_active = [true, true, true];
        this.textGroups.forEach((label) => {
          label.group.style.opacity = 1;
        });
      }
      this.clock.start();
    } else {
      this.clock.stop();
    }
  }

  resetAnimation(index) {
    const L_key = `L${index + 1}`;
    const L = this.guiParams[L_key];
    const R_0 = this.guiParams.R_0;

    this.timelines[index] = createBubbleTimeline(L, R_0);
    this.bubble_durations[index] = this.timelines[index].duration;
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
        2,
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
        pos.z,
      );
      const static_circle = this.createDashedCircle(
        scaledR0,
        static_circle_pos,
      );
      static_circle.visible = this.guiParams.showDashedLines;
      static_circle.userData.isBubbleComponent = true;
      this.scene.add(static_circle);
      this.staticCircles[index] = static_circle;
    }

    this.onWindowResize();
    this.renderer.render(this.scene, this.camera);
  }

  setupPhysicsAndAnimation() {
    const components = this.scene.children.filter(
      (obj) => obj.userData?.isBubbleComponent,
    );
    const geometries = new Set(components.map((obj) => obj.geometry));
    const materials = new Set(components.map((obj) => obj.material));
    components.forEach((obj) => this.scene.remove(obj));
    geometries.forEach((geometry) => geometry?.dispose());
    materials.forEach((material) => material?.dispose());

    this.straws = [];
    this.circles = [];
    this.staticCircles = [];

    const { L1, L2, L3, R_0, scale_factor } = this.guiParams;
    this._lastR0 = R_0;
    this.Ls = [L1, L2, L3];
    this.timelines = this.Ls.map((L) => createBubbleTimeline(L, R_0));
    this.bubble_durations = this.timelines.map((t) => t.duration);
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
      32,
    );

    const strawMaterial = new THREE.MeshBasicMaterial({
      color: 0x80bfa0,
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
        pos.z,
      );
      const static_circle = this.createDashedCircle(
        scaledR0,
        static_circle_pos,
      );
      static_circle.userData.isBubbleComponent = true;
      static_circle.visible = this.guiParams.showDashedLines; // initial visibility
      this.scene.add(static_circle);
      this.staticCircles.push(static_circle);

      // DYNAMIC BUBBLE (SPHERE) with soap effect material
      const circleMaterial = this.guiParams.soapEffect
        ? this.createSoapBubbleMaterial()
        : new THREE.MeshBasicMaterial({
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
    this.onWindowResize();
  }

  createDashedCircle(radius, position) {
    const segments = 64;
    const points = [];
    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          radius * Math.cos(angle),
          radius * Math.sin(angle),
          0,
        ),
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
      color: 0x789888,
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

  /**
   * Creates a soap bubble material with thin-film interference (iridescence).
   * Based on the physics of light interference in thin films.
   * @returns {THREE.ShaderMaterial} The soap bubble shader material
   */
  createSoapBubbleMaterial() {
    const vertexShader = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        vWorldPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform float uThickness;
      uniform vec3 uCameraPosition;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;
      
      // Attempt to simulate thin-film interference colors
      // Based on wavelength-dependent phase shift in thin films
      vec3 thinFilmInterference(float thickness, float cosAngle) {
        // Refractive index of soap film (approximately 1.33 like water)
        float n = 1.33;
        
        // Optical path difference for different wavelengths (nm)
        // Red: 700nm, Green: 530nm, Blue: 470nm
        float pathDiff = 2.0 * n * thickness * cosAngle;
        
        // Calculate phase for each color channel
        // Higher frequencies (shorter wavelengths) shift faster
        float phaseR = pathDiff / 700.0;
        float phaseG = pathDiff / 530.0;
        float phaseB = pathDiff / 470.0;
        
        // Interference pattern (constructive/destructive)
        vec3 color;
        color.r = 0.5 - 0.5 * cos(phaseR * 3.14159 * 2.0);
        color.g = 0.5 - 0.5 * cos(phaseG * 3.14159 * 2.0);
        color.b = 0.5 - 0.5 * cos(phaseB * 3.14159 * 2.0);
        
        return color;
      }
      
      void main() {
        // Calculate view direction
        vec3 viewDir = normalize(-vWorldPosition);
        
        // Fresnel effect - stronger reflection at grazing angles
        float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
        fresnel = pow(fresnel, 3.0); // Higher power = more subtle edge effect
        
        // Film thickness varies based on position and time (slower, subtler flow)
        float thickness = uThickness * (1.0 + 0.15 * sin(vUv.x * 6.0 + uTime * 0.3) 
                                              + 0.1 * sin(vUv.y * 5.0 - uTime * 0.2)
                                              + 0.08 * sin(vPosition.x * 3.0 + vPosition.y * 2.0 + uTime * 0.15));
        
        // Thin-film interference color
        float cosAngle = sqrt(1.0 - (1.0 - pow(abs(dot(viewDir, normalize(vNormal))), 2.0)) / (1.33 * 1.33));
        vec3 interferenceColor = thinFilmInterference(thickness, cosAngle);
        
        // Base soap color (soft, slightly iridescent white-blue)
        vec3 baseColor = vec3(0.92, 0.95, 1.0);
        
        // Mix interference with base color - much more subtle blend
        vec3 finalColor = mix(baseColor, interferenceColor, 0.25 + 0.15 * fresnel);
        
        // Subtle rainbow tint at edges only
        vec3 rainbowEdge = vec3(
          0.5 + 0.5 * sin(fresnel * 4.0 + 0.0),
          0.5 + 0.5 * sin(fresnel * 4.0 + 2.09),
          0.5 + 0.5 * sin(fresnel * 4.0 + 4.18)
        );
        finalColor = mix(finalColor, rainbowEdge, fresnel * 0.15); // Much subtler edge rainbow
        
        // Add soft highlight for reflection simulation
        float highlight = pow(max(dot(reflect(-viewDir, vNormal), vec3(0.5, 1.0, 0.5)), 0.0), 48.0);
        finalColor += vec3(1.0) * highlight * 0.4;
        
        // Transparency: more transparent overall, subtle edge opacity
        float alpha = 0.2 + fresnel * 0.35;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uThickness: { value: 400.0 }, // Film thickness in nm (typical soap film: 100-500nm)
        uCameraPosition: { value: new THREE.Vector3() },
      },
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
    });

    return material;
  }

  addTextLabels() {
    if (this.textOverlay) this.textOverlay.remove();

    this.textOverlay = document.createElement("div");
    this.textOverlay.className = "text-label-overlay";

    this.container.appendChild(this.textOverlay);

    this.textGroups = [];
    this.Ls = [this.guiParams.L1, this.guiParams.L2, this.guiParams.L3];

    this.Ls.forEach((L, i) => {
      const groupDiv = document.createElement("div");
      groupDiv.className = "label-group";

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
      gui = new GUI({ autoPlace: false, title: "Bubble Controls" });
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
    const controlsHost = document.getElementById("simulation-controls");
    (controlsHost || this.container).appendChild(gui.domElement);
    if (!controlsHost)
      Object.assign(gui.domElement.style, {
        position: "absolute",
        top: "16px",
        right: "16px",
      });

    this.guiControllers = [];

    const playCtrl = gui.add(this.guiParams, "playPause").name("Play / Pause");
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

    // Soap effect toggle (iridescent visual effect)
    const soapCtrl = gui
      .add(this.guiParams, "soapEffect")
      .name("Iridescent film")
      .onChange(() => {
        this.guiParams.isRunning = false;
        this.clock.stop();
        // Rebuild the scene with new materials
        this.setupPhysicsAndAnimation();
        this.addTextLabels();
        for (let i = 0; i < 3; i++) this.resetAnimation(i);
      });
    this.guiControllers.push(soapCtrl);

    const R0_MIN = 1.0 * 1e-2;
    const R0_MAX = 10.0 * 1e-2;
    const R0_STEP = 0.1 * 1e-2;

    const r0Controller = gui.add(this.guiParams, "R_0", R0_MIN, R0_MAX);
    this.guiControllers.push(r0Controller);
    r0Controller
      .step(R0_STEP)
      .name("R₀ (Initial Radius, m)")
      .onChange(() => {
        this.guiParams.isRunning = false;
        this.clock.stop();
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
    resetCtrl.name("Reset experiment");
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
          this.renderer.domElement,
        );

        const groupDiv = this.textGroups[i].group;

        // Update the CSS position using translate(-50%, 0) from the center point
        groupDiv.style.left = `${textScreenPos.x}px`;
        groupDiv.style.top = `${textScreenPos.y}px`;
      });
    }

    // Update soap bubble shader uniforms
    if (this.guiParams.soapEffect && this.circles) {
      const elapsedTime = performance.now() * 0.001; // Convert to seconds
      this.circles.forEach((circle) => {
        if (circle.material.uniforms) {
          circle.material.uniforms.uTime.value = elapsedTime;
          circle.material.uniforms.uCameraPosition.value.copy(
            this.camera.position,
          );
        }
      });
    }

    this.renderer.render(this.scene, this.camera);

    if (!this.guiParams.isRunning) {
      return;
    }

    const delta = Math.min(this.clock.getDelta(), 0.05);

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
      const R_t = this.timelines[i].radiusAt(newTime);

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

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Initialize the bubble simulation in a container.
 * @param {string} containerId - The ID of the container element
 * @returns {DeflatingBubbleScene} The simulation instance
 */
export function init(containerId = "scene-container") {
  return new DeflatingBubbleScene(containerId);
}

export { DeflatingBubbleScene };
export default DeflatingBubbleScene;
