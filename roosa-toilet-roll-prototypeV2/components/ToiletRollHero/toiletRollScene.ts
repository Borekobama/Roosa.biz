import * as THREE from 'three';

// ===========================================================================
// ROOSA Toilet Roll — V2 scene engine (vanilla Three.js, framework-agnostic)
//
// APPROACH (and why it differs from V1):
//   The supplied asset (ToiletPaperV2) is a beautiful but *single-pose* prop:
//   a thin, open ~270° paper shell with a modelled flap, no core, hollow ends.
//   Loading it rigidly (as V1 did with its asset) and then spinning + shrinking
//   it exposes the shell's gap and hollow — it simply wasn't built to rotate.
//   The spec (§17) explicitly says a downloaded model is only a *starting
//   mesh* and must be reworked (separate core / wrapped paper / loose sheet,
//   shrinking morph). That rework is normally a Blender job; Blender can't be
//   driven here, so it is done in Three.js instead:
//
//     • The wrapped paper is a SOLID procedural roll that wears the asset's
//       REAL 4K cherry-blossom quilt (cropped from its normal map, tiled with
//       MirroredRepeat so it's seamless and covers the full circumference).
//     • A SEPARATE constant kraft CORE that never scales — so, unlike V1 which
//       scaled the whole mesh, the core stays put and is revealed as paper is
//       "used" (spec §3/§8).
//     • The loose sheet tracks the shrinking radius so it stays attached.
//
//   Net result: correct mechanics (clean spin, area-based shrink, core reveal)
//   AND the artist's real surface design. The raw asset is kept in /source.
// ===========================================================================

// --- ROOSA brand tokens (verified from src/app/globals.css) -----------------
const PAPER_PINK = '#ef83b6';
const PAPER_EDGE = '#e07ba8'; // slightly deeper: the wound-paper end face
const SHEET_PINK = '#e79ec1'; // dusty pink the loose sheet is painted in (WYSIWYG)
const BG_TOP = '#fffaf4'; // --color-paper
const BG_BOTTOM = '#ffe4f0';
const KRAFT = '#cba06a';
const PERFORATION_COLOR = 'rgba(150,54,98,0.5)';

const MODEL_BASE_PATH = '/model';

// --- Roll proportions — spec §3 ---------------------------------------------
const R0 = 1.0; // full outer radius
const CORE_R = 0.33; // cardboard-core radius (spec 0.30–0.34)
const FINAL_R = 0.4; // outer radius at scroll-end — thin layer left (spec 0.36–0.40)
const ROLL_WIDTH = 1.15; // axial length (spec 1.10–1.25)
const PERFORATION_UNIT = 0.62; // world units per perforation repeat (constant spacing)
const EASE_HANDOFF_DEFAULT = 0.86; // spec State 6 begins at 86%

// p at which the area-based shrink curve reaches FINAL_R (spec §8)
const P_MAX = 1 - (FINAL_R ** 2 - CORE_R ** 2) / (R0 ** 2 - CORE_R ** 2);

/** Cross-sectional-area based radius: R(p) = √(r² + (1−p)(R₀²−r²)). Spec §8. */
function rollRadius(p: number): number {
  const effectiveP = clamp01(p) * P_MAX;
  return Math.sqrt(CORE_R ** 2 + (1 - effectiveP) * (R0 ** 2 - CORE_R ** 2));
}

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

export interface ToiletRollHandle {
  updateProgress: (progress: number) => void;
  resize: () => void;
  dispose: () => void;
}

export interface SceneOptions {
  /** Subtle idle sway independent of scroll. Off for reduced-motion (spec §16). */
  idleMotion?: boolean;
}

// Responsive tuning — spec §5, §12.
interface Variant {
  rotations: number; // visible turns across the sequence (spec §8: 6–10)
  sheetMax: number;
  handoffStart: number;
  rollShiftX: number;
  rollShiftY: number; // vertical placement (mobile drops the roll below the copy)
  camera: { pos: [number, number, number]; look: [number, number, number]; fov: number };
  pixelRatioCap: number;
}

function variantFor(width: number, height: number): Variant {
  const portrait = height >= width;
  if (width < 720 || portrait) {
    // Mobile: roll below the headline (spec §5), fewer turns, shorter sheet.
    return { rotations: 4, sheetMax: 3.0, handoffStart: 0.8, rollShiftX: 0, rollShiftY: -0.5,
      camera: { pos: [0, 0.1, 7.4], look: [0, 0.05, 0], fov: 32 }, pixelRatioCap: 2 };
  }
  if (width < 1080) {
    return { rotations: 6, sheetMax: 4.2, handoffStart: 0.84, rollShiftX: 0.55, rollShiftY: 0,
      camera: { pos: [1.4, 0.1, 7.4], look: [0.05, -0.08, 0], fov: 26 }, pixelRatioCap: 2 };
  }
  return { rotations: 8, sheetMax: 5.2, handoffStart: EASE_HANDOFF_DEFAULT, rollShiftX: 1.1, rollShiftY: 0,
    camera: { pos: [1.9, 0.05, 8.6], look: [0.1, -0.05, 0], fov: 22 }, pixelRatioCap: 2 };
}

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export function createToiletRollScene(container: HTMLElement, options: SceneOptions = {}): ToiletRollHandle {
  const idleMotion = options.idleMotion ?? true;
  let disposed = false;
  let variant = variantFor(container.clientWidth || 1280, container.clientHeight || 720);

  const scene = new THREE.Scene();
  scene.background = makeBackgroundGradient();

  const camera = new THREE.PerspectiveCamera(variant.camera.fov, 1, 0.1, 60);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, variant.pixelRatioCap));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  // Soft studio environment (spec §4) baked into a PMREM env map.
  const envRenderTarget = createRoomEnvironment(renderer);
  scene.environment = envRenderTarget.texture;

  // Lighting — the roll SPINS, so illumination must be rotation-invariant:
  // the soft environment + ambient do most of the work and keep the pink even
  // at every angle; the directionals only add gentle form (spec §4).
  const key = new THREE.DirectionalLight(0xfff4ea, 0.55);
  key.position.set(3, 4.2, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffe6f1, 0.5);
  fill.position.set(-3.5, 0.6, 3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.35);
  rim.position.set(-1.5, 2.5, -4);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  // Group hierarchy (mirrors spec §9): rollGroup(pose) > spinGroup(rotation) > parts.
  const rollGroup = new THREE.Group();
  rollGroup.rotation.z = 0.05;
  rollGroup.rotation.y = -0.16;
  rollGroup.position.x = variant.rollShiftX;
  scene.add(rollGroup);

  const spinGroup = new THREE.Group();
  rollGroup.add(spinGroup);

  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  // --- Wrapped paper: solid roll wearing the asset's real floral quilt -------
  // Cells must be square in world space: circumference (2πr) ÷ n_around must
  // equal width ÷ n_along. The tile holds ~4 blossoms per edge, so the base
  // U-repeat below keeps them roughly square; it scales with r each frame.
  const QUILT_U = 4.5;
  // Re-render the single static frame once async textures arrive — otherwise
  // an unloaded map/normalMap samples as black (colour × black = black roll),
  // which the animated render loop hides but the static path would freeze on.
  const onTexLoad = () => { if (!disposed && !idleMotion) renderFrame(currentProgress, 0); };
  const quiltNormal = new THREE.TextureLoader().load(`${MODEL_BASE_PATH}/quilt_normal.webp`, onTexLoad);
  quiltNormal.wrapS = quiltNormal.wrapT = THREE.MirroredRepeatWrapping;
  quiltNormal.anisotropy = maxAniso;
  quiltNormal.repeat.set(QUILT_U, 1);
  const quiltBase = new THREE.TextureLoader().load(`${MODEL_BASE_PATH}/quilt_base.webp`, onTexLoad);
  quiltBase.wrapS = quiltBase.wrapT = THREE.MirroredRepeatWrapping;
  quiltBase.colorSpace = THREE.SRGBColorSpace;
  quiltBase.repeat.set(QUILT_U, 1);

  const wallMat = new THREE.MeshStandardMaterial({
    map: quiltBase,
    color: new THREE.Color(PAPER_PINK),
    normalMap: quiltNormal,
    normalScale: new THREE.Vector2(1.5, 1.5),
    roughness: 0.92,
    metalness: 0,
    envMapIntensity: 1.0,
  });
  const wallGeo = new THREE.CylinderGeometry(1, 1, ROLL_WIDTH, 176, 1, true);
  wallGeo.rotateZ(Math.PI / 2); // Y-axis cylinder -> world X
  const wall = new THREE.Mesh(wallGeo, wallMat);
  spinGroup.add(wall);

  // Wound-paper end faces (annulus reads via a concentric-ring bump). Discs
  // that scale with the radius; the constant core covers their centre.
  const capBump = makeConcentricBump();
  const capMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(PAPER_EDGE),
    bumpMap: capBump,
    bumpScale: 0.004,
    roughness: 1.0,
    metalness: 0,
    envMapIntensity: 0.6,
  });
  const capGeo = new THREE.CircleGeometry(1, 96);
  const capL = new THREE.Mesh(capGeo, capMat);
  const capR = new THREE.Mesh(capGeo, capMat);
  capL.rotation.y = -Math.PI / 2;
  capR.rotation.y = Math.PI / 2;
  capL.position.x = -ROLL_WIDTH / 2;
  capR.position.x = ROLL_WIDTH / 2;
  spinGroup.add(capL, capR);

  // Rounded rim: a thin torus at each edge so the wall/cap junction isn't a
  // hard 90° "cheap primitive" edge (the classic dated-CGI tell).
  const rimMat = wallMat;
  const rimGeo = new THREE.TorusGeometry(1, 0.055, 16, 96);
  const rimL = new THREE.Mesh(rimGeo, rimMat);
  const rimR = new THREE.Mesh(rimGeo, rimMat);
  rimL.rotation.y = Math.PI / 2;
  rimR.rotation.y = Math.PI / 2;
  rimL.position.x = -ROLL_WIDTH / 2 + 0.02;
  rimR.position.x = ROLL_WIDTH / 2 - 0.02;
  spinGroup.add(rimL, rimR);

  // Constant kraft core — rotates with the paper (spec §3) but never scales.
  const kraftTex = makeKraftTexture();
  kraftTex.wrapS = kraftTex.wrapT = THREE.RepeatWrapping;
  kraftTex.repeat.set(7, 2);
  const coreMat = new THREE.MeshStandardMaterial({
    map: kraftTex, bumpMap: kraftTex, bumpScale: 0.5,
    color: new THREE.Color(KRAFT), roughness: 1.0, metalness: 0, envMapIntensity: 0.6,
  });
  const coreGeo = new THREE.CylinderGeometry(CORE_R, CORE_R, ROLL_WIDTH * 1.004, 96, 1, false);
  coreGeo.rotateZ(Math.PI / 2);
  const core = new THREE.Mesh(coreGeo, coreMat);
  spinGroup.add(core);

  // --- Loose sheet ----------------------------------------------------------
  const { sheetColor, sheetNormal } = makeSheetTextures();
  const sheetMat = new THREE.MeshStandardMaterial({
    map: sheetColor,
    normalMap: sheetNormal,
    normalScale: new THREE.Vector2(0.6, 0.6),
    color: new THREE.Color(0xffffff),
    roughness: 0.95,
    metalness: 0,
    side: THREE.DoubleSide,
    transparent: true,
    envMapIntensity: 0.35,
  });
  const sheetGeo = new THREE.PlaneGeometry(ROLL_WIDTH * 0.9, 1, 1, 60);
  sheetGeo.translate(0, -0.5, 0); // pivot at the top edge (the tangent anchor)
  const looseSheet = new THREE.Mesh(sheetGeo, sheetMat);
  scene.add(looseSheet); // world space so "down" stays global −Y
  const sheetBase = sheetGeo.attributes.position.array.slice() as Float32Array;

  // --- Ground shadow --------------------------------------------------------
  const shadowTexture = makeShadowTexture();
  const shadowGeo = new THREE.PlaneGeometry(4.5, 4.5);
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.85 });
  const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.y = -1.15;
  scene.add(groundShadow);

  // Scroll-driven progress (0..1). Declared before resize(), which may call
  // renderFrame() in the static/reduced-motion path.
  let currentProgress = 0;

  // --- Resize ---------------------------------------------------------------
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    variant = variantFor(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, variant.pixelRatioCap));
    camera.fov = variant.camera.fov;
    camera.position.set(...variant.camera.pos);
    camera.lookAt(...variant.camera.look);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    rollGroup.position.x = variant.rollShiftX;
    if (!idleMotion) renderFrame(currentProgress, 0);
  }
  resize();

  // --- Per-frame update -----------------------------------------------------
  function updateProgress(p: number) {
    currentProgress = clamp01(p);
    if (!idleMotion) renderFrame(currentProgress, 0);
  }

  function renderFrame(p: number, t: number) {
    const idleSway = idleMotion ? Math.sin(t * 0.8) * 0.04 : 0;
    const idleNod = idleMotion ? Math.sin(t * 1.2 + 1) * 0.02 : 0;
    const idleBob = idleMotion ? Math.sin(t * 1.0) * 0.02 : 0;

    // Rotation — spec §8 (6–10 turns) + a whisper of idle sway.
    spinGroup.rotation.x = p * variant.rotations * Math.PI * 2 + idleSway;
    rollGroup.position.y = idleBob + variant.rollShiftY;
    rollGroup.rotation.z = 0.05 + idleNod;

    const r = rollRadius(p);

    // Wrapped-paper radius: scale the wall, caps and rims radially. The core is
    // untouched, so it stays constant and is revealed as the paper thins.
    wall.scale.set(1, r, r);
    capL.scale.set(r, r, 1);
    capR.scale.set(r, r, 1);
    // Torus ring lies in its local XY (hole along local Z, aimed down world X
    // by rotation.y): scale the ring plane, keep the tube axis.
    rimL.scale.set(r, r, 1);
    rimR.scale.set(r, r, 1);
    // Keep the quilt cells a roughly constant physical size as the roll shrinks
    // (circumference ∝ r, so the U-repeat scales with r).
    const around = Math.max(1.6, QUILT_U * r);
    quiltNormal.repeat.set(around, 1);
    quiltBase.repeat.set(around, 1);

    // Loose sheet: grow length, constant perforation spacing (no stretch).
    const growth = easeOutCubic(clamp01(p / variant.handoffStart));
    const targetLen = 0.5 + (variant.sheetMax - 0.5) * growth;
    looseSheet.scale.y = targetLen;
    const repeats = targetLen / PERFORATION_UNIT;
    sheetColor.repeat.set(1, repeats);
    sheetNormal.repeat.set(1, repeats);

    // Anchor at the roll's CURRENT radius (front-bottom tangent, ~5 o'clock).
    const ang = 2.15;
    const anchorY = r * Math.cos(ang);
    const anchorZ = r * Math.sin(ang);
    looseSheet.position.x = rollGroup.position.x;

    // 3D→HTML handoff — spec §6 State 6 / §14.
    const handoff = smoothstep(variant.handoffStart, 1, p);
    sheetMat.opacity = 1 - handoff;
    looseSheet.position.y = rollGroup.position.y + anchorY - 0.02 + idleBob;
    looseSheet.position.z = anchorZ + handoff * 1.8;
    applySheetBend(sheetGeo, sheetBase, p, idleMotion ? t : 0);

    // Gentle camera dolly-in (spec §5).
    camera.position.z = variant.camera.pos[2] - p * 0.6;
    camera.position.y = variant.camera.pos[1] + p * 0.05;
    camera.lookAt(...variant.camera.look);

    renderer.render(scene, camera);
  }

  const startTime = performance.now();
  let rafHandle: number | null = null;
  function loop() {
    renderFrame(currentProgress, (performance.now() - startTime) / 1000);
    rafHandle = requestAnimationFrame(loop);
  }
  if (idleMotion) loop();
  else renderFrame(0, 0);

  function dispose() {
    disposed = true;
    if (rafHandle !== null) cancelAnimationFrame(rafHandle);
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const mat = o.material as THREE.Material | THREE.Material[];
        (Array.isArray(mat) ? mat : [mat]).forEach((mm) => mm.dispose());
      }
    });
    [quiltNormal, quiltBase, kraftTex, capBump, sheetColor, sheetNormal, shadowTexture].forEach((tx) => tx.dispose());
    envRenderTarget.dispose();
    renderer.dispose();
    if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
  }

  return { updateProgress, resize, dispose };
}

// ---------------------------------------------------------------------------
// Loose-sheet bend: droop under its own weight + faint flutter (spec §7).
// ---------------------------------------------------------------------------
function applySheetBend(geo: THREE.PlaneGeometry, base: Float32Array, p: number, t: number) {
  const pos = geo.attributes.position;
  const count = pos.count;
  for (let i = 0; i < count; i++) {
    const bx = base[i * 3];
    const by = base[i * 3 + 1];
    const dist = -by;
    const droop = Math.sin(dist * Math.PI * 0.55) * 0.2 * (0.45 + p * 0.55);
    const flutter = Math.sin(dist * 5 + t * 2.0) * 0.018 * dist;
    pos.setXYZ(i, bx + flutter, by, droop);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

// ---------------------------------------------------------------------------
// Soft "softbox room" env map — warm off-white, low contrast (spec §4: matte,
// not glossy). Rendered once through PMREM; no external HDRI file.
// ---------------------------------------------------------------------------
function createRoomEnvironment(renderer: THREE.WebGLRenderer): THREE.WebGLRenderTarget {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const geometry = new THREE.PlaneGeometry(1, 1);
  const panels: Array<{ color: number; pos: [number, number, number]; rot: [number, number, number]; scale: [number, number, number] }> = [
    { color: 0xfff2ea, pos: [0, 0, -8], rot: [0, 0, 0], scale: [16, 16, 1] },
    { color: 0xffe4ef, pos: [-8, 0, 0], rot: [0, Math.PI / 2, 0], scale: [16, 16, 1] },
    { color: 0xfff3e6, pos: [8, 0, 0], rot: [0, -Math.PI / 2, 0], scale: [16, 16, 1] },
    { color: 0xffffff, pos: [0, 8, 0], rot: [Math.PI / 2, 0, 0], scale: [16, 16, 1] },
    { color: 0xffe9f1, pos: [0, -8, 0], rot: [-Math.PI / 2, 0, 0], scale: [12, 12, 1] },
    { color: 0xffffff, pos: [-2.5, 3, -3], rot: [0, 0.4, 0], scale: [5, 2, 1] },
    { color: 0xfff6ee, pos: [3, 1.5, -2], rot: [0, -0.5, 0], scale: [3, 3.5, 1] },
  ];
  panels.forEach(({ color, pos, rot, scale }) => {
    const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.scale.set(...scale);
    envScene.add(mesh);
  });
  const rt = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  geometry.dispose();
  return rt;
}

// ---------------------------------------------------------------------------
// Canvas texture helpers.
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

/** Loose sheet: dusty SHEET_PINK, faint heart emboss, one perforation per repeat. */
function makeSheetTextures(): { sheetColor: THREE.CanvasTexture; sheetNormal: THREE.CanvasTexture } {
  const w = 256, h = 256;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = SHEET_PINK;
  ctx.fillRect(0, 0, w, h);
  const sheen = ctx.createLinearGradient(0, 0, w, 0);
  sheen.addColorStop(0, 'rgba(255,255,255,0.05)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0.11)');
  sheen.addColorStop(1, 'rgba(255,255,255,0.05)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  drawHeart(ctx, w / 2, h * 0.45, 24);
  ctx.fillStyle = 'rgba(190,110,150,0.10)';
  drawHeart(ctx, w / 2, h * 0.45 + 2, 24);
  ctx.strokeStyle = PERFORATION_COLOR;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([9, 9]);
  ctx.beginPath();
  ctx.moveTo(0, h - 2);
  ctx.lineTo(w, h - 2);
  ctx.stroke();
  const sheetColor = new THREE.CanvasTexture(c);
  sheetColor.wrapS = THREE.ClampToEdgeWrapping;
  sheetColor.wrapT = THREE.RepeatWrapping;
  sheetColor.colorSpace = THREE.SRGBColorSpace;

  const nc = document.createElement('canvas');
  nc.width = w; nc.height = h;
  const nctx = nc.getContext('2d')!;
  nctx.fillStyle = 'rgb(128,128,255)';
  nctx.fillRect(0, 0, w, h);
  const grad = nctx.createRadialGradient(w / 2, h * 0.45, 2, w / 2, h * 0.45, 34);
  grad.addColorStop(0, 'rgba(150,150,255,0.4)');
  grad.addColorStop(1, 'rgba(128,128,255,0)');
  nctx.fillStyle = grad;
  drawHeart(nctx, w / 2, h * 0.45, 28);
  nctx.fillStyle = 'rgba(110,110,255,0.5)';
  nctx.fillRect(0, h - 5, w, 3);
  const sheetNormal = new THREE.CanvasTexture(nc);
  sheetNormal.wrapS = THREE.ClampToEdgeWrapping;
  sheetNormal.wrapT = THREE.RepeatWrapping;
  return { sheetColor, sheetNormal };
}

/** Warm kraft core with a faint spiral-wound seam. */
function makeKraftTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#c79a63';
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i++) {
    const a = Math.random() * 0.12;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(90,60,30,${a})` : `rgba(255,235,200,${a})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }
  ctx.strokeStyle = 'rgba(120,85,45,0.35)';
  ctx.lineWidth = 2;
  for (let x = -size; x < size * 2; x += 46) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + size * 0.55, size);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Concentric-ring bump for the roll's end faces — reads as wound paper. */
function makeConcentricBump(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);
  const cx = size / 2, cy = size / 2;
  for (let radius = 4; radius < size / 2; radius += 3) {
    const shade = 128 + Math.sin(radius * 0.9) * 55;
    ctx.strokeStyle = `rgb(${shade | 0},${shade | 0},${shade | 0})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

function makeShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(90,40,60,0.32)');
  grad.addColorStop(0.6, 'rgba(90,40,60,0.12)');
  grad.addColorStop(1, 'rgba(90,40,60,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function makeBackgroundGradient(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
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
