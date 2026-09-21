"use client";

import Image from "next/image";
import { useState } from "react";
import { useScrollFall } from "@/components/ui/useScrollFall";
import { ingredientTiles } from "@/lib/assets";
import { ingredients } from "@/lib/content";

export default function IngredientRows() {
  const { refs, styleFor } = useScrollFall<HTMLLIElement>(ingredients.length);
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
      <p className="t-ingredient-label shrink-0 text-moss sm:w-[115.5px]">ROOSA Qualität</p>
      <ul className="min-w-0 flex-1" onMouseLeave={() => setActive(null)}>
        {ingredients.map((item, i) => (
          <li
            key={item}
            ref={(el) => { refs.current[i] = el; }}
            className="relative border-b border-forest/15 last:border-0"
            style={styleFor(i)}
          >
            <button
              type="button"
              className={`t-ingredient relative z-20 w-full py-1 text-left transition-[color,transform] duration-300 ${active === i ? "translate-x-3 text-olive" : "text-forest"}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(active === i ? null : i)}
              aria-expanded={active === i}
            >
              {item}
            </button>
            <div className={`relative z-30 grid transition-[grid-template-rows,opacity] duration-500 md:pointer-events-none md:absolute md:right-0 md:top-1/2 md:w-[380px] md:-translate-y-1/2 ${active === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden">
                <div className="relative my-3 aspect-video overflow-hidden rounded-[24px] shadow-xl md:my-0">
                  <Image src={ingredientTiles[i].src} alt={ingredientTiles[i].alt} fill sizes="(max-width: 768px) 100vw, 380px" className="object-cover" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
