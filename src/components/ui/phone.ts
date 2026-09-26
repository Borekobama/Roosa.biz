import { useSyncExternalStore } from "react";

export type { PhoneMotion } from "./phoneMotion";

/**
 * The source's layout switch. Below 720 it runs its phone variants, and several
 * of those animate differently from the desktop: different offsets, different
 * axes, one-shot reveals where the desktop is scroll-linked.
 */
// Range syntax, so it is the exact complement of Tailwind's min-[720px] and
// matches its max-[720px] - (max-width: 719px) leaves 719.x uncovered.
const QUERY = "(width < 720px)";

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/** False on the server and through hydration, then the live phone match. */
export function usePhone() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
