"use client";

import { useEffect } from "react";

/*
 * V5 scroll reveal for the React routes, matching the layer injected into the
 * static routes by scripts/prepare-v5-static.mjs.
 *
 * Two rules keep content from ever being stranded at opacity 0:
 *   1. Only elements that start below the fold are hidden. Anything already on
 *      screen when this runs is left alone.
 *   2. A rAF-throttled scroll backstop reveals anything that has passed the
 *      viewport bottom, in case an IntersectionObserver callback is missed
 *      during a fast scroll. It detaches once every target has been revealed.
 */
const groups: [selector: string, stagger: number][] = [
  ["[class*='grid'] > [class*='card']", 60],
  ["[class*='flowStep']", 70],
  ["[class*='logos'] > [class*='logo']", 80],
  ["article[class*='project']", 0],
  ["[class*='sectionHeader']", 0],
];

export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const targets: HTMLElement[] = [];
    for (const [selector, stagger] of groups) {
      document.querySelectorAll<HTMLElement>(`main ${selector}`).forEach((node, index) => {
        if (node.dataset.v5Reveal) return;
        if (node.getBoundingClientRect().top < window.innerHeight) return;
        node.dataset.v5Reveal = "true";
        node.style.setProperty("--v5-delay", `${Math.min(index * stagger, 300)}ms`);
        targets.push(node);
      });
    }
    if (!targets.length) return;

    document.documentElement.classList.add("v5-js");

    const pending = new Set(targets);
    const reveal = (node: HTMLElement) => {
      node.dataset.v5Inview = "true";
      pending.delete(node);
      observer.unobserve(node);
      if (!pending.size) window.removeEventListener("scroll", onScroll);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    targets.forEach((node) => observer.observe(node));

    let queued = false;
    const sweep = () => {
      queued = false;
      for (const node of [...pending]) {
        if (node.getBoundingClientRect().top < window.innerHeight) reveal(node);
      }
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(sweep);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("v5-js");
      targets.forEach((node) => {
        delete node.dataset.v5Reveal;
        delete node.dataset.v5Inview;
        node.style.removeProperty("--v5-delay");
      });
    };
  }, []);

  return null;
}
