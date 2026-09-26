"use client";

import { usePhone } from "./phone";
import { useScrollFall } from "./useScrollFall";

/**
 * One block on the ingredient rows' scroll curve, below 720 only. On a phone
 * the source carries the SOL-G7 heading and footnote on it - 0.50 opacity at
 * 123px of offset, settling as they rise - where the desktop holds them still.
 */
export default function PhoneFall({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const isPhone = usePhone();
  const { setRef, styleFor } = useScrollFall<HTMLDivElement>(1);

  return (
    <div
      ref={setRef(0)}
      className={className}
      style={isPhone ? styleFor(0) : undefined}
    >
      {children}
    </div>
  );
}
