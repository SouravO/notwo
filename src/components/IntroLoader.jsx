"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function IntroLoader({ onComplete }) {
  const loaderRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      // 1. Initial State: Hidden before flickering
      gsap.set(textRef.current, { opacity: 0, scale: 0.98 });

      // 2. Power-blinking effect (3 electric flickers)
      tl.to(textRef.current, {
        keyframes: [
          { opacity: 0.9, scale: 1, duration: 0.12 },
          { opacity: 0.1, duration: 0.08 },
          { opacity: 1, duration: 0.14 },
          { opacity: 0.25, duration: 0.06 },
          { opacity: 0.95, duration: 0.1 },
          { opacity: 0.15, duration: 0.08 },
          { opacity: 1, duration: 0.18 },
        ],
        ease: "power2.inOut",
      })
      // 3. Hold state until 2 seconds mark
      .to(textRef.current, {
        opacity: 1,
        scale: 1.02,
        duration: 1.24,
        ease: "sine.out",
      })
      // 4. Slide UP to reveal the hero section below
      .to(loaderRef.current, {
        yPercent: -100,
        duration: 1.0,
        ease: "power4.inOut",
      });
    }, loaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#34373b_0%,#74797f_24%,#b6bbc0_48%,#70757b_72%,#393c40_100%)] select-none pointer-events-auto"
    >
      {/* Centered Brand Title */}
      <div className="relative z-10 flex flex-col items-center">
        <h1
          ref={textRef}
          className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-[0.35em] text-[#1C1C1A] uppercase pl-[0.35em] drop-shadow-sm"
        >
          NOTWO
        </h1>
      </div>
    </div>
  );
}
