import Link from "next/link";

type Variant = "solid" | "outline" | "light";

/**
 * Measured from the source: the pills are 45px tall at 1440 - Jetzt entdecken
 * 100x45, Know more 115x45, Open Blog 108x45 - and 42 below 1200, where the
 * same three measure 92x42, 105x42 and 100x42 at both 390 and 768. The flat 45
 * here was the desktop figure at every width. The solid fill is olive
 * rgb(125,145,83) and the light fill is cream rgb(255,255,245).
 *
 * The widths stay wider than the source's throughout because Inter Display is
 * not available to this clone; that is a settled difference and not something
 * to close with tracking.
 *
 * Below 720 the source sets the label 16/22.4, not 18/25. At 18 the hero pair
 * outgrew a 375 screen and each label broke onto a second line that spilled
 * out of its pill; nowrap keeps a label on one line wherever it sits.
 */
const base =
  "m-surface inline-flex h-[42px] items-center justify-center gap-2 whitespace-nowrap rounded-[999px] px-4 text-[16px] font-normal leading-[22.4px] tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest min-[720px]:text-[18px] min-[720px]:leading-[25px] min-[1200px]:h-[45px]";

const variants: Record<Variant, string> = {
  solid: "bg-olive text-cream hover:bg-moss",
  outline: "border border-forest/25 text-moss hover:bg-olive hover:text-cream",
  light: "bg-cream text-moss hover:bg-sage",
};

export default function Button({
  href,
  children,
  variant = "solid",
  className = "",
  ...rest
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
