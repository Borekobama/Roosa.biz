/**
 * Phone motion presets, kept apart from the usePhone hook so server components
 * can build them as props.
 */
export type PhoneMotion =
  | "static"
  | { x?: number; y?: number; duration?: number; easing?: string };

/*
 * Timings sampled off the source's phone reveals at ~45ms intervals, opacity
 * and offset always moving together on one curve:
 *  - rises (statement, benefits heading, closing): 30px, ease-out-cubic over
 *    1s - 0.17/0.41/0.60/0.75/0.84 at 0.1/0.2/0.3/0.4/0.5s.
 *  - slides (offer copy, FAQ and blog ledes): a slow start, a fast middle and
 *    a long tail, done by about 1.1s.
 *  - the stats' drift: a quick start and a very long tail, 0.50 at 0.3s but
 *    only 0.91 at 1s and 0.98 at 1.5s - ease-out-quint over 2.5s.
 */
export const phoneRise = (y = 30): PhoneMotion => ({ y });

export const phoneSlide = (x: number): PhoneMotion => ({
  x,
  duration: 1100,
  easing: "cubic-bezier(0.65, 0, 0.35, 1)",
});

export const phoneDrift = (x: number): PhoneMotion => ({
  x,
  duration: 2500,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
});
