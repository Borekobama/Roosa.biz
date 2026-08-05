import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const { chromium } = await import(
  process.env.PLAYWRIGHT_PATH ?? "playwright"
);
const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3005";
const outputDirectory = new URL("../output/qa/", import.meta.url);
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH,
});

async function testSequence(name, viewport, expectedLastFrame) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  const failedRequests = [];
  const sequenceRequests = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => {
    if (!request.url().includes("_rsc=")) failedRequests.push(request.url());
  });
  page.on("response", (response) => {
    if (response.url().includes("/media/toilet-scroll/v2/")) {
      sequenceRequests.push(response.url());
    }
  });

  await page.goto(`${baseUrl}/en`, { waitUntil: "networkidle" });
  assert.equal(
    await page.locator(".hero_visuals .roosa-hero-pack").getAttribute("src"),
    "/media/v4/hero-roll-editorial.webp",
    `${name}: V5 hero photography remains intact`,
  );

  assert.equal(
    await page.locator("[data-v6-unroll]").count(),
    0,
    `${name}: separate unroll chapter has been removed`,
  );
  const section = page.locator("#team");
  const stage = page.locator("[data-v6-team-sequence]");
  await section.scrollIntoViewIfNeeded();
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-v6-team-sequence]")
        ?.getAttribute("data-ready") === "true",
  );

  const scrollToProgress = async (progress) => {
    await section.evaluate((element, nextProgress) => {
      const box = element.getBoundingClientRect();
      const travel = Math.max(1, box.height + window.innerHeight * 0.6);
      const targetTop = window.innerHeight * 0.8 - travel * nextProgress;
      window.scrollTo({
        top: box.top + window.scrollY - targetTop,
        behavior: "instant",
      });
    }, progress);
    await page.waitForTimeout(450);
  };

  await scrollToProgress(0);
  const startFrame = Number(await stage.getAttribute("data-frame"));
  await scrollToProgress(0.5);
  const middleFrame = Number(await stage.getAttribute("data-frame"));
  await page.screenshot({
    path: new URL(`${name}-middle.png`, outputDirectory).pathname,
    fullPage: false,
  });
  await scrollToProgress(1);
  const endFrame = Number(await stage.getAttribute("data-frame"));

  const geometry = await page.evaluate(() => {
    const sectionElement = document.querySelector("#team");
    const stageElement = document.querySelector("[data-v6-team-sequence]");
    const heading = sectionElement?.querySelector("h2");
    const canvas = stageElement?.querySelector("canvas");
    if (!stageElement || !heading || !canvas) return null;
    const stageBox = stageElement.getBoundingClientRect();
    const headingBox = heading.getBoundingClientRect();
    return {
      stageWidth: Math.round(stageBox.width),
      stageHeight: Math.round(stageBox.height),
      headingBottom: Math.round(headingBox.bottom),
      stageTop: Math.round(stageBox.top),
      canvasOpacity: getComputedStyle(canvas).opacity,
    };
  });

  assert.equal(errors.length, 0, `${name}: browser console errors`);
  assert.equal(
    failedRequests.length,
    0,
    `${name}: failed requests ${JSON.stringify(failedRequests)}`,
  );
  assert.ok(startFrame <= 12, `${name}: sequence begins near frame 1`);
  assert.ok(
    middleFrame > expectedLastFrame * 0.42 &&
      middleFrame < expectedLastFrame * 0.58,
    `${name}: middle scroll maps to a middle frame (got ${middleFrame})`,
  );
  assert.ok(
    endFrame >= expectedLastFrame - 5,
    `${name}: end scroll reaches the final frames`,
  );
  assert.ok(sequenceRequests.length > 2, `${name}: sequence frames load`);
  assert.equal(geometry?.canvasOpacity, "1", `${name}: canvas is visible`);

  await context.close();
  return {
    name,
    startFrame,
    middleFrame,
    endFrame,
    requestedFrames: new Set(sequenceRequests).size,
    geometry,
  };
}

async function testReducedMotion() {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const requestedSequenceAssets = [];
  page.on("response", (response) => {
    if (response.url().includes("/media/toilet-scroll/v2/")) {
      requestedSequenceAssets.push(response.url());
    }
  });

  await page.goto(`${baseUrl}/en`, { waitUntil: "networkidle" });
  const section = page.locator("#team");
  await section.scrollIntoViewIfNeeded();
  const result = await page.evaluate(() => {
    const stage = document.querySelector("[data-v6-team-sequence]");
    const canvas = stage?.querySelector("canvas");
    const fallback = stage?.querySelector("picture");
    return {
      isStatic: stage?.getAttribute("data-static"),
      canvasDisplay: canvas ? getComputedStyle(canvas).display : null,
      fallbackOpacity: fallback ? getComputedStyle(fallback).opacity : null,
    };
  });

  assert.equal(result.isStatic, "true", "reduced motion uses static mode");
  assert.equal(result.canvasDisplay, "none", "reduced motion hides the canvas");
  assert.equal(result.fallbackOpacity, "1", "reduced motion shows the fallback");
  await context.close();

  return {
    name: "reduced-motion",
    ...result,
    requestedAssets: new Set(requestedSequenceAssets).size,
  };
}

try {
  console.log(
    JSON.stringify(
      [
        await testSequence("desktop", { width: 1440, height: 900 }, 140),
        await testSequence("mobile", { width: 390, height: 844 }, 94),
        await testReducedMotion(),
      ],
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
