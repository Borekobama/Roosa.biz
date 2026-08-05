import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Brand placeholders — swap these for real ROOSA tokens before shipping.
// Real glossy PBR materials + environment reflections, aiming for the same
// "believable studio product photo" register as premium DTC 3D heroes
// (glossy highlight streaks, soft reflections) rather than a flat/cartoon
// treatment.
// ---------------------------------------------------------------------------
const PAPER_PINK = '#ff5c9a';
const HEART_ACCENT = 'rgba(210,40,100,0.14)';
const PERFORATION_COLOR = 'rgba(140,20,70,0.5)';
const CARDBOARD = '#e0a24f';
const BG_TOP = '#fff0e8';
const BG_BOTTOM = '#ffc9de';

// ---------------------------------------------------------------------------
// Roll proportions — see "ROOSA Toilet Roll Spline.md" section 3.
// ---------------------------------------------------------------------------
const R0 = 1.0; // full outer radius
const CORE_R = 0.32; // cardboard-core radius
const ROLL_WIDTH = 1.15; // axial length of the roll
const FINAL_R = 0.38; // outer radius at scroll-end (leave a thin layer)
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
  // into a PMREM env map. This is what makes glossy PBR materials read as
  // real (curved specular streaks, soft gradient reflections) instead of
  // flat; without it a PhysicalMaterial just looks like dull grey plastic.
  // ---------------------------------------------------------------------
  const envRenderTarget = createRoomEnvironment(renderer);
  scene.environment = envRenderTarget.texture;

  // ---------------------------------------------------------------------
  // Lighting — modest now that the environment map is doing most of the
  // illumination + reflection work; this just defines a key highlight
  // direction and keeps the shadow side from going fully dark.
  // ---------------------------------------------------------------------
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(2.5, 3.5, 3);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffe9f2, 0.35);
  fill.position.set(-3, 1, -2);
  scene.add(fill);

  // ---------------------------------------------------------------------
  // Materials — glossy PBR with a thin clearcoat for that "soft glossy
  // wrapped paper" sheen, not a flat toon band.
  // ---------------------------------------------------------------------
  const paperTexture = makePaperTexture();
  const paperRoughness = makeRoughnessTexture(0.32, 0.12);
  const paperMat = new THREE.MeshPhysicalMaterial({
    map: paperTexture,
    roughnessMap: paperRoughness,
    roughness: 1,
    metalness: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
    envMapIntensity: 1.1,
  });

  const cardboardTexture = makeCardboardTexture();
  const coreMat = new THREE.MeshPhysicalMaterial({
    map: cardboardTexture,
    roughness: 0.75,
    metalness: 0,
    clearcoat: 0.08,
    envMapIntensity: 0.7,
  });

  const sheetTexture = makeSheetTexture();
  const sheetMat = new THREE.MeshPhysicalMaterial({
    map: sheetTexture,
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
  // ---------------------------------------------------------------------
  const rollGroup = new THREE.Group();
  rollGroup.rotation.z = Math.PI / 2 + 0.1;
  rollGroup.rotation.x = -0.22;
  scene.add(rollGroup);

  const spinGroup = new THREE.Group(); // equivalent to "Roll_Rotation_Empty"
  rollGroup.add(spinGroup);

  // Cardboard core — constant size, never scaled. Rounded rim (not a hard
  // 90° edge) so the silhouette reads as a designed object, not a raw
  // primitive.
  const coreGeo = roundedCylinderGeometry(CORE_R, ROLL_WIDTH, 48, CORE_R * 0.22);
  const core = new THREE.Mesh(coreGeo, coreMat);
  spinGroup.add(core);

  // Wrapped paper — shrinks by scaling radius only (never the axial
  // length). High segment count so the clearcoat highlight stays smooth.
  const paperGeo = roundedCylinderGeometry(R0, ROLL_WIDTH, 96, R0 * 0.1);
  const wrappedPaper = new THREE.Mesh(paperGeo, paperMat);
  spinGroup.add(wrappedPaper);

  // Loose sheet — anchored at the tangent point, NOT parented to spinGroup,
  // so it hangs independently while the roll spins (spec section 9).
  const sheetSegments = 48;
  const sheetGeo = new THREE.PlaneGeometry(ROLL_WIDTH * 0.94, 1, 1, sheetSegments);
  sheetGeo.translate(0, -0.5, 0); // pivot at the top edge
  // Added to `scene` directly (not `rollGroup`) so "down" stays global -Y
  // regardless of the roll's own rotation/orientation.
  const looseSheet = new THREE.Mesh(sheetGeo, sheetMat);
  looseSheet.position.set(0, -R0 * 0.92, 0.18);
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
    spinGroup.rotation.y = p * ROTATIONS * Math.PI * 2 + idleSway;
    rollGroup.position.y = idleBob;
    rollGroup.rotation.x = -0.22 + idleNod;
    rollGroup.scale.setScalar(breathe);

    // Wrapped-paper radius — spec section 8 formula, capped at FINAL_R.
    const r = rollRadius(p);
    const s = r / R0;
    wrappedPaper.scale.set(s, 1, s);

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
    looseSheet.position.z = 0.18 + handoff * 1.6;
    looseSheet.position.y = -R0 * 0.92 - handoff * 0.3 + idleBob;

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
    if (rafHandle !== null) cancelAnimationFrame(rafHandle);
    renderer.dispose();
    envRenderTarget.dispose();
    [coreGeo, paperGeo, sheetGeo, shadowGeo].forEach((g) => g.dispose());
    [paperMat, coreMat, sheetMat, shadowMat].forEach((m) => m.dispose());
    [paperTexture, paperRoughness, cardboardTexture, sheetTexture, shadowTexture].forEach((t) => t.dispose());
    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  }

  return { updateProgress, resize, dispose };
}

/**
 * A cylinder profile revolved with rounded rim fillets instead of the hard
 * 90° edge CylinderGeometry produces. That sharp edge, under studio
 * lighting, is one of the strongest "generic 3D primitive" tells —
 * rounding it reads immediately as a designed product, not a raw shape.
 */
function roundedCylinderGeometry(
  radius: number,
  height: number,
  radialSegments: number,
  filletRadius: number,
  filletSegments = 8,
): THREE.LatheGeometry {
  const halfH = height / 2;
  const f = Math.min(filletRadius, radius * 0.9, halfH * 0.9);
  const pts: THREE.Vector2[] = [];

  pts.push(new THREE.Vector2(0, -halfH));
  pts.push(new THREE.Vector2(radius - f, -halfH));
  for (let i = 0; i <= filletSegments; i++) {
    const a = (Math.PI / 2) * (i / filletSegments);
    pts.push(new THREE.Vector2(radius - f + f * Math.sin(a), -halfH + f - f * Math.cos(a)));
  }
  for (let i = 0; i <= filletSegments; i++) {
    const a = (Math.PI / 2) * (i / filletSegments);
    pts.push(new THREE.Vector2(radius - f + f * Math.cos(a), halfH - f + f * Math.sin(a)));
  }
  pts.push(new THREE.Vector2(0, halfH));

  return new THREE.LatheGeometry(pts, radialSegments);
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

function makePaperTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = PAPER_PINK;
  ctx.fillRect(0, 0, size, size);

  // Faint fibre variation — natural, not perfectly uniform plastic.
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  for (let i = 0; i < 160; i++) {
    const x = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 8, size);
    ctx.stroke();
  }

  ctx.fillStyle = HEART_ACCENT;
  for (let y = 50; y < size; y += 110) {
    for (let x = 50; x < size; x += 110) {
      drawHeart(ctx, x, y, 12);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Subtle per-pixel roughness variation so specular highlights aren't a
 * perfectly even mirror band (which reads as fake/CG). */
function makeRoughnessTexture(base: number, variance: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const baseV = Math.round(base * 255);
  ctx.fillStyle = `rgb(${baseV},${baseV},${baseV})`;
  ctx.fillRect(0, 0, size, size);
  const imgData = ctx.getImageData(0, 0, size, size);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const n = (Math.random() - 0.5) * variance * 255;
    imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = Math.min(255, Math.max(0, baseV + n));
  }
  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  return tex;
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

function makeCardboardTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = CARDBOARD;
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(0,0,0,0.07)';
  for (let y = 0; y < size; y += 5) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
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
