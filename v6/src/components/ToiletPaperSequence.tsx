"use client";

import { useEffect, useRef } from "react";
import styles from "./Homepage.module.css";

type SequencePreset = {
  count: number;
  directory: "desktop" | "mobile";
  prefix: "toilet-desktop-" | "toilet-mobile-";
};

type NetworkInformationLike = {
  effectiveType?: string;
  saveData?: boolean;
};

const ASSET_ROOT = "/media/toilet-scroll/v2";
const DESKTOP: SequencePreset = {
  count: 140,
  directory: "desktop",
  prefix: "toilet-desktop-",
};
const MOBILE: SequencePreset = {
  count: 94,
  directory: "mobile",
  prefix: "toilet-mobile-",
};
const BACKGROUND = "#f9f5f4";
const MAX_CONCURRENT = 5;

function frameUrl(preset: SequencePreset, frame: number) {
  return `${ASSET_ROOT}/${preset.directory}/${preset.prefix}${String(frame).padStart(4, "0")}.webp`;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export function ToiletPaperSequence() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const hero = stage?.closest("section");
    const heroFrame = stage?.closest("[data-hero-frame]") as HTMLElement | null;
    if (!stage || !canvas || !hero || !heroFrame) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMedia = window.matchMedia("(max-width: 700px)");
    const connection = (
      navigator as Navigator & { connection?: NetworkInformationLike }
    ).connection;
    const constrainedConnection =
      Boolean(connection?.saveData) ||
      Boolean(connection?.effectiveType?.includes("2g"));

    if (reducedMotion.matches || constrainedConnection) {
      heroFrame.style.setProperty("--hero-progress", "0");
      stage.dataset.static = "true";
      return;
    }

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    let preset = mobileMedia.matches ? MOBILE : DESKTOP;
    let generation = 0;
    let activeLoads = 0;
    let desiredFrame = 1;
    let drawnFrame = 0;
    let animationFrame = 0;
    let destroyed = false;
    let loaded = new Map<number, HTMLImageElement>();
    let loading = new Set<number>();
    let queue: number[] = [];

    const resizeCanvas = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        drawnFrame = 0;
      }
    };

    const nearestLoadedFrame = (target: number) => {
      if (loaded.has(target)) return target;
      for (let distance = 1; distance < preset.count; distance += 1) {
        const before = target - distance;
        const after = target + distance;
        if (before >= 1 && loaded.has(before)) return before;
        if (after <= preset.count && loaded.has(after)) return after;
      }
      return 0;
    };

    const draw = () => {
      resizeCanvas();
      const frame = nearestLoadedFrame(desiredFrame);
      if (!frame || frame === drawnFrame) return;
      const image = loaded.get(frame);
      if (!image) return;

      const scale = Math.min(
        canvas.width / image.naturalWidth,
        canvas.height / image.naturalHeight,
      );
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;

      context.fillStyle = BACKGROUND;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, x, y, width, height);
      drawnFrame = frame;
      stage.dataset.ready = "true";
      stage.dataset.frame = String(frame);
    };

    const startLoad = (frame: number) => {
      if (loaded.has(frame) || loading.has(frame)) return false;

      const token = generation;
      const image = new Image();
      activeLoads += 1;
      loading.add(frame);
      image.decoding = "async";
      image.onload = () => {
        if (destroyed || token !== generation) return;
        activeLoads -= 1;
        loading.delete(frame);
        loaded.set(frame, image);
        draw();
        pump();
      };
      image.onerror = () => {
        if (destroyed || token !== generation) return;
        activeLoads -= 1;
        loading.delete(frame);
        pump();
      };
      image.src = frameUrl(preset, frame);
      return true;
    };

    function pump() {
      while (!destroyed && activeLoads < MAX_CONCURRENT && queue.length) {
        const frame = queue.shift();
        if (!frame) continue;
        startLoad(frame);
      }
    }

    const enqueue = (frame: number, priority = false) => {
      if (
        frame < 1 ||
        frame > preset.count ||
        loaded.has(frame) ||
        loading.has(frame)
      ) return;
      const existingIndex = queue.indexOf(frame);
      if (existingIndex >= 0) {
        if (!priority) return;
        queue.splice(existingIndex, 1);
      }
      if (priority) queue.unshift(frame);
      else queue.push(frame);
    };

    const prioritize = (frame: number) => {
      // The exact scroll target may bypass the background preload cap so the
      // paper remains visually attached to the user's gesture.
      startLoad(frame);
      for (let distance = 4; distance >= 0; distance -= 1) {
        enqueue(frame - distance, true);
        if (distance) enqueue(frame + distance, true);
      }
      pump();
    };

    const seedQueue = () => {
      enqueue(1, true);
      enqueue(preset.count, true);
      for (let frame = 1; frame <= preset.count; frame += 10) enqueue(frame);
      for (let frame = 1; frame <= preset.count; frame += 1) enqueue(frame);
      pump();
    };

    const update = () => {
      animationFrame = 0;
      const rect = hero.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const rawProgress = clamp(-rect.top / travel);
      const progress = clamp((rawProgress - 0.08) / 0.84);
      const nextFrame = 1 + Math.round(progress * (preset.count - 1));

      heroFrame.style.setProperty("--hero-progress", progress.toFixed(4));
      if (nextFrame !== desiredFrame) {
        desiredFrame = nextFrame;
        prioritize(desiredFrame);
      }
      draw();
    };

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update);
    };

    const changePreset = () => {
      const nextPreset = mobileMedia.matches ? MOBILE : DESKTOP;
      if (nextPreset.directory === preset.directory) {
        requestUpdate();
        return;
      }

      generation += 1;
      preset = nextPreset;
      loaded = new Map();
      loading = new Set();
      queue = [];
      activeLoads = 0;
      desiredFrame = 1;
      drawnFrame = 0;
      delete stage.dataset.ready;
      seedQueue();
      requestUpdate();
    };

    seedQueue();
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    mobileMedia.addEventListener("change", changePreset);

    return () => {
      destroyed = true;
      generation += 1;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      mobileMedia.removeEventListener("change", changePreset);
    };
  }, []);

  return (
    <div ref={stageRef} className={styles.sequenceStage} aria-hidden="true">
      <picture className={styles.sequenceFallback}>
        <source
          media="(prefers-reduced-motion: reduce)"
          srcSet={`${ASSET_ROOT}/fallback/toilet-paper-fallback.webp`}
        />
        <source media="(max-width: 700px)" srcSet={frameUrl(MOBILE, 1)} />
        {/* The sequence is already encoded at its delivery dimensions. */}
        <img src={frameUrl(DESKTOP, 1)} alt="" fetchPriority="high" />
      </picture>
      <canvas ref={canvasRef} className={styles.sequenceCanvas} />
    </div>
  );
}
