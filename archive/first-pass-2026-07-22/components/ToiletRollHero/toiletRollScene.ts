import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Brand placeholders — swap these for real ROOSA tokens before shipping.
// ---------------------------------------------------------------------------
const PAPER_PINK = '#f2a6c6';
const PAPER_PINK_DARK = '#e28cae';
const HEART_PINK = 'rgba(217,122,158,0.35)';
const CARDBOARD = '#c9a274';
const CARDBOARD_DARK = '#a9825a';
const BACKGROUND = '#f7f1ea';

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
  /** Tear down the scene, renderer and GPU resources. */
  dispose: () => void;
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

export function createToiletRollScene(container: HTMLElement): ToiletRollHandle {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND);
  scene.fog = new THREE.Fog(BACKGROUND, 6, 14);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(1.7, 0.6, 4.3);
  camera.lookAt(0, -0.05, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  // ---------------------------------------------------------------------
  // Lighting — spec section 4, soft studio setup (no dynamic shadow map;
  // the ground shadow below is a baked gradient, which is cheaper and
  // matches the "soft grounding shadow" guidance).
  // ---------------------------------------------------------------------
  const key = new THREE.DirectionalLight(0xfff2e6, 1.4);
  key.position.set(3, 4, 4);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-4, 1.5, 2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 0.5);
  rim.position.set(-1, 3, -4);
  scene.add(rim);

  const hemi = new THREE.HemisphereLight(0xfff7ef, 0xe4d3c2, 0.55);
  scene.add(hemi);

  // ---------------------------------------------------------------------
  // Canvas-generated textures — no external asset files required.
  // ---------------------------------------------------------------------
  const paperTexture = makePaperTexture();
  const cardboardTexture = makeCardboardTexture();
  const capTexture = makeRingCapTexture();
  const sheetTexture = makeSheetTexture();
  const shadowTexture = makeShadowTexture();

  // ---------------------------------------------------------------------
  // Roll group — laid on its side so the rotation axis runs horizontally.
  // ---------------------------------------------------------------------
  const rollGroup = new THREE.Group();
  rollGroup.rotation.z = Math.PI / 2;
  scene.add(rollGroup);

  const spinGroup = new THREE.Group(); // equivalent to "Roll_Rotation_Empty"
  rollGroup.add(spinGroup);

  // Cardboard core — constant size, never scaled.
  const coreGeo = new THREE.CylinderGeometry(CORE_R, CORE_R, ROLL_WIDTH, 40, 1, false);
  const coreSideMat = new THREE.MeshStandardMaterial({ map: cardboardTexture, roughness: 0.85, metalness: 0 });
  const coreCapMat = new THREE.MeshStandardMaterial({ color: CARDBOARD_DARK, roughness: 0.9, metalness: 0 });
  const core = new THREE.Mesh(coreGeo, [coreSideMat, coreCapMat, coreCapMat]);
  spinGroup.add(core);

  // Wrapped paper — shrinks by scaling radius only (never the axial length).
  const paperGeo = new THREE.CylinderGeometry(R0, R0, ROLL_WIDTH, 64, 1, false);
  const paperSideMat = new THREE.MeshStandardMaterial({ map: paperTexture, roughness: 0.92, metalness: 0 });
  const paperCapMat = new THREE.MeshStandardMaterial({ map: capTexture, roughness: 0.9, metalness: 0 });
  const wrappedPaper = new THREE.Mesh(paperGeo, [paperSideMat, paperCapMat, paperCapMat]);
  spinGroup.add(wrappedPaper);

  // Loose sheet — anchored at the tangent point, NOT parented to spinGroup,
  // so it hangs independently while the roll spins (spec section 9).
  const sheetSegments = 48;
  const sheetGeo = new THREE.PlaneGeometry(ROLL_WIDTH * 0.94, 1, 1, sheetSegments);
  sheetGeo.translate(0, -0.5, 0); // pivot at the top edge
  const sheetMat = new THREE.MeshStandardMaterial({
    map: sheetTexture,
    roughness: 0.9,
    metalness: 0,
    side: THREE.DoubleSide,
    transparent: true,
  });
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
  groundShadow.position.y = -1.15;
  scene.add(groundShadow);

  // ---------------------------------------------------------------------
  // Resize
  // ---------------------------------------------------------------------
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    const mobile = w < 720;
    camera.fov = mobile ? 36 : 30;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  resize();

  // ---------------------------------------------------------------------
  // Per-frame update, driven externally by scroll progress (0..1).
  // ---------------------------------------------------------------------
  function updateProgress(rawProgress: number) {
    const p = Math.min(Math.max(rawProgress, 0), 1);

    // Rotation — spec section 8: 6-10 visible turns across the sequence.
    spinGroup.rotation.y = p * ROTATIONS * Math.PI * 2;

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

    // Natural droop + subtle flutter (spec section 7).
    applySheetBend(sheetGeo, basePositions, p);

    // 3D-to-HTML handoff — spec section 6, State 6 (86-100%).
    const handoff = Math.min(Math.max((p - HANDOFF_START) / (1 - HANDOFF_START), 0), 1);
    sheetMat.opacity = 1 - handoff;
    looseSheet.position.z = 0.18 + handoff * 1.6;
    looseSheet.position.y = -R0 * 0.92 - handoff * 0.3;

    // Gentle camera dolly (spec section 5).
    camera.position.z = 4.3 - p * 0.6;
    camera.position.x = 1.7 - p * 0.5;

    renderer.render(scene, camera);
  }

  function dispose() {
    renderer.dispose();
    [coreGeo, paperGeo, sheetGeo, shadowGeo].forEach((g) => g.dispose());
    [coreSideMat, coreCapMat, paperSideMat, paperCapMat, sheetMat, shadowMat].forEach((m) => m.dispose());
    [paperTexture, cardboardTexture, capTexture, sheetTexture, shadowTexture].forEach((t) => t.dispose());
    if (renderer.domElement.parentElement === container) {
      container.removeChild(renderer.domElement);
    }
  }

  updateProgress(0);

  return { updateProgress, resize, dispose };
}

function applySheetBend(geo: THREE.PlaneGeometry, base: Float32Array, p: number) {
  const pos = geo.attributes.position;
  const count = pos.count;
  for (let i = 0; i < count; i++) {
    const bx = base[i * 3];
    const by = base[i * 3 + 1]; // 0 (top/anchor) .. -1 (loose end) before scale
    const t = -by;
    const droop = Math.sin(t * Math.PI * 0.5) * 0.12 * (0.4 + p * 0.6);
    const flutter = Math.sin(t * 6 + p * 10) * 0.015 * t;
    pos.setXYZ(i, bx + flutter, by, droop);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

// ---------------------------------------------------------------------------
// Canvas texture generators — replace with real baked maps if desired.
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

  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 10, size);
    ctx.stroke();
  }

  ctx.fillStyle = HEART_PINK;
  for (let y = 40; y < size; y += 90) {
    for (let x = 40; x < size; x += 90) {
      drawHeart(ctx, x, y, 10);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
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

  ctx.fillStyle = HEART_PINK;
  drawHeart(ctx, w / 2, h * 0.5, 16);

  ctx.strokeStyle = 'rgba(180,90,120,0.55)';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 6]);
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
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  for (let y = 0; y < size; y += 6) {
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

function makeRingCapTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = PAPER_PINK;
  ctx.fillRect(0, 0, size, size);
  const cx = size / 2;
  const cy = size / 2;
  ctx.strokeStyle = PAPER_PINK_DARK;
  for (let radius = 8; radius < size / 2; radius += 6) {
    ctx.lineWidth = 2 + Math.random();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = CARDBOARD;
  ctx.beginPath();
  ctx.arc(cx, cy, size * (CORE_R / R0) * 0.5, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
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
  grad.addColorStop(0, 'rgba(30,20,15,0.35)');
  grad.addColorStop(1, 'rgba(30,20,15,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
