import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

// ---------------------------------------------------------------------------
// Brand placeholders — swap for real ROOSA tokens before shipping.
// ---------------------------------------------------------------------------
const PAPER_PINK = '#ff5c9a';
const HEART_ACCENT = 'rgba(210,40,100,0.14)';
const PERFORATION_COLOR = 'rgba(140,20,70,0.5)';
const BG_TOP = '#fff0e8';
const BG_BOTTOM = '#ffc9de';

// Roll model: a real scanned/modeled asset, not procedural geometry. Copy
// these three files into the consuming project's `public/model/` folder:
//   tp.obj, color.jpg (base color, ~2K), bump.jpg (relief map, ~1K)
// Source: single mesh named "Tube001" with a modeled hole + a small
// pre-sculpted paper flap at the tangent point. Units are the model's
// native (large) units; everything is renormalized at load time so the
// roll's outer radius equals R0 below, regardless of source scale.
const MODEL_BASE_PATH = '/model';

// ---------------------------------------------------------------------------
// Roll proportions — see "ROOSA Toilet Roll Spline.md" section 3.
// ---------------------------------------------------------------------------
const R0 = 1.0; // full outer radius (after renormalization)
const CORE_R = 0.32; // approximate cardboard-core radius, as a fraction of R0
const FINAL_R = 0.38; // outer radius at scroll-end (leave a thin layer)
const ROLL_WIDTH = 1.15; // axial length used for sheet/shadow placement
const ROTATIONS = 8; // visible rotations across the whole sequence
const SHEET_MIN_LEN = 0.55;
const SHEET_MAX_LEN = 5.2;
const PERFORATION_UNIT = 0.55; // world units per perforation repeat
const HANDOFF_START = 0.86; // matches spec State 6

// p at which the shrink curve reaches FINAL_R (see spec section 8 formula)
const P_MAX = 1 - (FINAL_R ** 2 - CORE_R ** 2) / (R0 ** 2 - CORE_R ** 2);

function rollRadius(p: number): number {
  const effectiveP = Math.min(Math.max(p, 0), 1) * P_MAX;
  return Math.sqrt(CORE_R ** 2 + (1 - effectiveP) * (R0 ** 2 - CORE_R ** 2));
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

export interface ToiletRollHandle {
  /** Drive the animation. progress is normalized scroll position, 0..1. */
  updateProgress: (progress: number) => void;
  /** Call on container resize (ResizeObserver or window resize). */
  resize: () => void;
  /** Tear down the scene, renderer, GPU resources and any running loop. */
  dispose: () => void;
}

export interface SceneOptions {
  /**
   * Continuous idle bob/sway/breathe, independent of scroll. Set false for
   * the reduced-motion / static preview (spec section 16: "do not rotate
   * continuously").
   */
  idleMotion?: boolean;
}

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export function createToiletRollScene(container: HTMLElement, options: SceneOptions = {}): ToiletRollHandle {
  const idleMotion = options.idleMotion ?? true;
  let disposed = false;

  const scene = new THREE.Scene();
  scene.background = makeBackgroundGradient();

  const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 50);
  camera.position.set(3.6, 1.1, 9.0);
  camera.lookAt(-0.4, -0.15, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  // ---------------------------------------------------------------------
  // Environment reflections — a small hand-built "softbox room" baked
  // into a PMREM env map, so the glossy roll material picks up soft,
  // believable reflections without needing an external HDRI file.
  // ---------------------------------------------------------------------
  const envRenderTarget = createRoomEnvironment(renderer);
  scene.environment = envRenderTarget.texture;

  // ---------------------------------------------------------------------
  // Lighting — modest; the environment map does most of the illumination
  // and reflection work. This just defines a key highlight direction and
  // keeps the shadow side from going fully dark.
  // ---------------------------------------------------------------------
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(2.5, 3.5, 3);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffe9f2, 0.35);
  fill.position.set(-3, 1, -2);
  scene.add(fill);

  // ---------------------------------------------------------------------
  // Loose-sheet material — the source asset is a rigid mesh with no
  // animatable sheet, so this stays a separate procedural plane (as
  // before), positioned to emerge from roughly where the model's own
  // small sculpted flap sits.
  // ---------------------------------------------------------------------
  const sheetTexture = makeSheetTexture();
  // Reuse the roll's real bump map (already loading) so the sheet's relief
  // matches the roll's quilting instead of looking like a flat slab.
  const sheetBumpTexture = new THREE.TextureLoader().load(`${MODEL_BASE_PATH}/bump.jpg`);
  sheetBumpTexture.wrapS = sheetBumpTexture.wrapT = THREE.RepeatWrapping;
  // The source atlas is a 2x2 grid (cap spiral | quilted side pattern) x
  // (flat cardboard | quilted side pattern) — sample only the right half
  // so the sheet picks up the quilted pattern, not the cap spiral.
  sheetBumpTexture.repeat.set(0.5, 1.4);
  sheetBumpTexture.offset.set(0.5, -0.1);
  const sheetMat = new THREE.MeshPhysicalMaterial({
    map: sheetTexture,
    bumpMap: sheetBumpTexture,
    bumpScale: 2,
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.35,
    side: THREE.DoubleSide,
    transparent: true,
    envMapIntensity: 1,
  });

  const shadowTexture = makeShadowTexture();

  // ---------------------------------------------------------------------
  // Roll group — laid on its side so the rotation axis runs horizontally,
  // with a jaunty resting tilt for a more confident, less static pose.
  // The model's own rotation axis is already local X (see loadRollModel),
  // so — unlike the old procedural geometry — no 90° layover is needed
  // here, just a small styling tilt.
  // ---------------------------------------------------------------------
  const rollGroup = new THREE.Group();
  rollGroup.rotation.z = 0.12;
  rollGroup.rotation.y = -0.18;
  scene.add(rollGroup);

  const spinGroup = new THREE.Group(); // equivalent to "Roll_Rotation_Empty"
  rollGroup.add(spinGroup);

  let modelMesh: THREE.Mesh | null = null;

  function loadRollModel() {
    const texLoader = new THREE.TextureLoader();
    const colorTex = texLoader.load(`${MODEL_BASE_PATH}/color.jpg`);
    colorTex.colorSpace = THREE.SRGBColorSpace;
    const bumpTex = texLoader.load(`${MODEL_BASE_PATH}/bump.jpg`);

    const rollMat = new THREE.MeshPhysicalMaterial({
      map: colorTex,
      bumpMap: bumpTex,
      bumpScale: 3,
      color: new THREE.Color(PAPER_PINK),
      roughness: 0.55,
      metalness: 0,
      clearcoat: 0.4,
      clearcoatRoughness: 0.3,
      envMapIntensity: 1.1,
    });

    new OBJLoader().load(
      `${MODEL_BASE_PATH}/tp.obj`,
      (obj) => {
        if (disposed) return;
        const mesh = obj.children.find(
          (child): child is THREE.Mesh => child instanceof THREE.Mesh && child.name === 'Tube001',
        );
        if (!mesh) {
          console.error('ToiletRollHero: expected mesh "Tube001" not found in tp.obj');
          return;
        }
        mesh.geometry.center();
        mesh.geometry.computeBoundingBox();
        const box = mesh.geometry.boundingBox!;
        // The model's rotation axis is local X (verified by rendering it
        // face-on down each world axis — its bounding box is NOT a
        // reliable signal here because the small sculpted paper flap
        // skews it). Radius lives in Y/Z.
        const measuredRadius = Math.max(box.max.y - box.min.y, box.max.z - box.min.z) / 2;
        mesh.userData.baseScale = R0 / measuredRadius;
        mesh.material = rollMat;
        spinGroup.add(mesh);
        modelMesh = mesh;
        if (!idleMotion) renderFrame(currentProgress, 0); // pick up late-loaded model in the static preview
      },
      undefined,
      (err) => console.error('ToiletRollHero: failed to load roll model', err),
    );
  }
  loadRollModel();

  // Loose sheet — anchored at the tangent point, NOT parented to spinGroup,
  // so it hangs independently while the roll spins (spec section 9).
  const sheetSegments = 48;
  const sheetGeo = new THREE.PlaneGeometry(ROLL_WIDTH * 0.94, 1, 1, sheetSegments);
  sheetGeo.translate(0, -0.5, 0); // pivot at the top edge
  // Added to `scene` directly (not `rollGroup`) so "down" stays global -Y
  // regardless of the roll's own rotation/orientation.
  const looseSheet = new THREE.Mesh(sheetGeo, sheetMat);
  looseSheet.position.set(0.36, -0.8, 0.22);
  scene.add(looseSheet);

  const basePositions = sheetGeo.attributes.position.array.slice() as Float32Array;

  // Ground shadow — baked radial gradient, cheaper than a real shadow map.
  const shadowGeo = new THREE.PlaneGeometry(4, 4);
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false });
  const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.y = -1.2;
  scene.add(groundShadow);

  // ---------------------------------------------------------------------
  // Resize
  // ---------------------------------------------------------------------
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    const mobile = w < 720;
    camera.fov = mobile ? 24 : 20;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  resize();

  // ---------------------------------------------------------------------
  // Per-frame update. `progress` is scroll-driven (0..1); `t` is elapsed
  // seconds, only non-zero when idleMotion is on, and drives a small
  // continuous bob/sway/breathe so the scene feels alive, not posed.
  // ---------------------------------------------------------------------
  let currentProgress = 0;

  function updateProgress(p: number) {
    currentProgress = Math.min(Math.max(p, 0), 1);
    if (!idleMotion) renderFrame(currentProgress, 0);
  }

  function renderFrame(p: number, t: number) {
    const idleSway = idleMotion ? Math.sin(t * 0.9) * 0.05 : 0;
    const idleNod = idleMotion ? Math.sin(t * 1.4 + 1) * 0.025 : 0;
    const idleBob = idleMotion ? Math.abs(Math.sin(t * 1.1)) * 0.03 - 0.012 : 0;
    const breathe = idleMotion ? 1 + Math.sin(t * 1.6) * 0.006 : 1;

    // Rotation — spec section 8: 6-10 visible turns across the sequence,
    // plus a tiny idle sway so it never looks frozen between scrolls.
    // Spins around local X — the model's true rotation axis (verified
    // empirically; see loadRollModel).
    spinGroup.rotation.x = p * ROTATIONS * Math.PI * 2 + idleSway;
    rollGroup.position.y = idleBob;
    rollGroup.rotation.z = 0.12 + idleNod;
    rollGroup.scale.setScalar(breathe);

    // Wrapped-paper radius — spec section 8 formula, capped at FINAL_R.
    // Applied as a non-uniform scale (radius axes only, never the length
    // axis, which is X on this model).
    if (modelMesh) {
      const r = rollRadius(p);
      const s = (r / R0) * (modelMesh.userData.baseScale as number);
      const lengthScale = modelMesh.userData.baseScale as number;
      modelMesh.scale.set(lengthScale, s, s);
    }

    // Loose-sheet length.
    const growth = easeOutCubic(Math.min(p / HANDOFF_START, 1));
    const targetLen = SHEET_MIN_LEN + (SHEET_MAX_LEN - SHEET_MIN_LEN) * growth;
    looseSheet.scale.y = targetLen;
    if (sheetMat.map) {
      sheetMat.map.repeat.set(1, targetLen / PERFORATION_UNIT);
    }

    // Natural droop + continuous flutter (spec section 7).
    applySheetBend(sheetGeo, basePositions, p, idleMotion ? t : 0);

    // 3D-to-HTML handoff — spec section 6, State 6 (86-100%).
    const handoff = Math.min(Math.max((p - HANDOFF_START) / (1 - HANDOFF_START), 0), 1);
    sheetMat.opacity = 1 - handoff;
    looseSheet.position.z = 0.22 + handoff * 1.6;
    looseSheet.position.y = -0.8 - handoff * 0.3 + idleBob;

    // Gentle camera dolly (spec section 5).
    camera.position.z = 9.0 - p * 1.0;
    camera.position.x = 3.6 - p * 0.7;

    renderer.render(scene, camera);
  }

  const startTime = performance.now();
  let rafHandle: number | null = null;

  function loop() {
    renderFrame(currentProgress, (performance.now() - startTime) / 1000);
    rafHandle = requestAnimationFrame(loop);
  }

  if (idleMotion) {
    loop();
  } else {
    renderFrame(0, 0);
  }

  function dispose() {
    disposed = true;
    if (rafHandle !== null) cancelAnimationFrame(rafHandle);
    renderer.dispose();
    envRenderTarget.dispose();
    [sheetGeo, shadowGeo].forEach((g) => g.dispose());
    [sheetMat, shadowMat].forEach((m) => m.dispose());
    [sheetTexture, sheetBumpTexture, shadowTexture].forEach((t) => t.dispose());
    if (modelMesh) {
      modelMesh.geometry.dispose();
      (modelMesh.material as THREE.MeshPhysicalMaterial).dispose();
    }
    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  }

  return { updateProgress, resize, dispose };
}

function applySheetBend(geo: THREE.PlaneGeometry, base: Float32Array, p: number, t: number) {
  const pos = geo.attributes.position;
  const count = pos.count;
  for (let i = 0; i < count; i++) {
    const bx = base[i * 3];
    const by = base[i * 3 + 1]; // 0 (top/anchor) .. -1 (loose end) before scale
    const dist = -by;
    const droop = Math.sin(dist * Math.PI * 0.5) * 0.12 * (0.4 + p * 0.6);
    const flutter = Math.sin(dist * 6 + t * 2.2) * 0.02 * dist;
    pos.setXYZ(i, bx + flutter, by, droop);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

// ---------------------------------------------------------------------------
// Environment map — a hand-built "softbox room" (same idea as three.js's
// RoomEnvironment example), rendered once into a PMREM env map so glossy
// materials pick up soft, believable reflections without any external
// HDRI file.
// ---------------------------------------------------------------------------
function createRoomEnvironment(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(1, 1);

  const panels: Array<{ color: number; pos: [number, number, number]; rot: [number, number, number]; scale: [number, number, number] }> = [
    { color: 0xffffff, pos: [0, 0, -8], rot: [0, 0, 0], scale: [14, 14, 1] }, // back wall
    { color: 0xffd2e6, pos: [-8, 0, 0], rot: [0, Math.PI / 2, 0], scale: [14, 14, 1] }, // left, pink bounce
    { color: 0xfff1df, pos: [8, 0, 0], rot: [0, -Math.PI / 2, 0], scale: [14, 14, 1] }, // right, warm bounce
    { color: 0xffffff, pos: [0, 8, 0], rot: [Math.PI / 2, 0, 0], scale: [14, 14, 1] }, // ceiling
    { color: 0xffdcec, pos: [0, -8, 0], rot: [-Math.PI / 2, 0, 0], scale: [10, 10, 1] }, // floor bounce
    { color: 0xffffff, pos: [-2.5, 2.5, -3], rot: [0, 0.35, 0], scale: [4, 1.4, 1] }, // key highlight strip
    { color: 0xffffff, pos: [2, 1, -2.5], rot: [0, -0.5, 0], scale: [2.4, 3, 1] }, // secondary highlight
  ];

  panels.forEach(({ color, pos, rot, scale }) => {
    const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.scale.set(...scale);
    envScene.add(mesh);
  });

  const renderTarget = pmrem.fromScene(envScene, 0.035);
  pmrem.dispose();
  return renderTarget;
}

// ---------------------------------------------------------------------------
// Canvas texture generators — no external asset files required.
// ---------------------------------------------------------------------------
function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  const s = size / 10;
  ctx.moveTo(0, 3 * s);
  ctx.bezierCurveTo(-5 * s, -2 * s, -10 * s, 2 * s, 0, 8 * s);
  ctx.bezierCurveTo(10 * s, 2 * s, 5 * s, -2 * s, 0, 3 * s);
  ctx.fill();
  ctx.restore();
}

function makeSheetTexture(): THREE.CanvasTexture {
  const w = 256;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = PAPER_PINK;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = HEART_ACCENT;
  drawHeart(ctx, w / 2, h * 0.5, 18);

  ctx.strokeStyle = PERFORATION_COLOR;
  ctx.lineWidth = 3;
  ctx.setLineDash([7, 7]);
  ctx.beginPath();
  ctx.moveTo(0, h - 4);
  ctx.lineTo(w, h - 4);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(80,30,55,0.3)');
  grad.addColorStop(1, 'rgba(80,30,55,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function makeBackgroundGradient(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, BG_TOP);
  grad.addColorStop(1, BG_BOTTOM);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
