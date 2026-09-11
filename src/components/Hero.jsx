"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

import HydraCreamImg from "@/app/assets/HydraCream.png";
import PurityGelImg from "@/app/assets/PurityGel.png";
import RadianceSerumImg from "@/app/assets/RadianceSerum.png";
import CalmElixirImg from "@/app/assets/calm-elixir.png";

// FIXED PRODUCT DATA
const PRODUCTS = [
  { id: "01", name: "HYDRA CREAM", img: HydraCreamImg, size: "lg" },
  { id: "02", name: "PURITY GEL", img: PurityGelImg, size: "lg" },
  { id: "03", name: "RADIANCE SERUM", img: RadianceSerumImg, size: "lg" },
  { id: "04", name: "CALM ELIXIR", img: CalmElixirImg, size: "md" },
];

const SIZE_CLASSES = {
  lg: "h-[110px] sm:h-[160px] lg:h-[250px]",
  md: "h-[90px] sm:h-[130px] lg:h-[200px]",
};

export default function Hero() {
  const sectionRef = useRef(null);
  const textElementsRef = useRef([]);
  const productRefs = useRef([]);
  const spotlightRef = useRef(null);
  const bgRef = useRef(null);

  // Animation timelines
  const orbitTlRef = useRef(null);
  const introTweenRef = useRef(null);

  // Particles state
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate prominent, realistic dust particles caught in the spotlight
    const generatedParticles = Array.from({ length: 60 }).map(() => ({
      id: Math.random(),
      left: `${40 + Math.random() * 20}%`, // Focus tightly inside the beam's center width
      top: `${10 + Math.random() * 85}%`, // Spread across the entire beam's height
      tx: `${(Math.random() - 0.5) * 80}px`, // Gentle horizontal drift
      ty: `${-50 - Math.random() * 120}px`, // Upward thermal drift (heat from light)
      s: Math.random() * 0.45 + 0.35,
      o: Math.random() * 0.6 + 0.4, // Higher peak opacity to catch the light (0.4 to 1.0)
      dur: 4 + Math.random() * 7, // Loop duration (4s to 11s)
      del: Math.random() * 5, // Staggered start times
    }));
    setParticles(generatedParticles);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // State proxies for mathematical rendering
      const orbit = { rotation: 45 }; // Starts at 45deg (Hydra Cream approaching from dark right)
      const global = { alpha: 0 }; // Master darkness fade
      let currentRadii = { x: 240, y: 55 }; // Default desktop orbit size

      // Responsive adjustments
      mm.add("(min-width: 1024px)", () => { currentRadii = { x: 240, y: 55 }; });
      mm.add("(min-width: 640px) and (max-width: 1023px)", () => { currentRadii = { x: 160, y: 40 }; });
      mm.add("(max-width: 639px)", () => { currentRadii = { x: 95, y: 25 }; }); // Compact mobile orbit

      // The 3D Engine: Maps current rotation to physical screen coordinates
      const renderOrbit = () => {
        const rX = currentRadii.x;
        const rY = currentRadii.y;

        productRefs.current.forEach((ref, i) => {
          if (!ref) return;

          // Sequential 90-degree separation
          const angleDeg = orbit.rotation - i * 90;
          const angleRad = angleDeg * (Math.PI / 180);

          const sin = Math.sin(angleRad); // 1 = Front, -1 = Back
          const cos = Math.cos(angleRad); // 1 = Right, -1 = Left

          const x = cos * rX;
          const y = sin * rY;

          // Depth progression (0 to 1). 1 means it is exactly in the front spotlight.
          const depthProgress = (sin + 1) / 2;
          
          // Non-linear "spotlight peak" - rapidly increases only when dead center
          const frontProgress = Math.max(0, sin);
          const activeStrength = Math.pow(frontProgress, 4);

          // Physical attributes
          const scale = 0.82 + activeStrength * 0.33; // ~0.8 resting -> 1.15 active
          const targetOpacity = 0.15 + depthProgress * 0.2 + activeStrength * 0.65;
          const finalOpacity = targetOpacity * global.alpha; // Multiplied by global darkness
          const brightness = 0.25 + depthProgress * 0.25 + activeStrength * 0.6; // 0.25 -> 1.1

          // Apply to bottle wrapper
          gsap.set(ref, {
            xPercent: -50,
            x,
            y,
            scale,
            opacity: finalOpacity,
            filter: `brightness(${brightness})`,
            zIndex: Math.round(depthProgress * 100),
            transformOrigin: "center bottom", // Anchors all products to one shared floor point
          });
        });
      };

      // --- REDUCED MOTION ---
      mm.add("(prefers-reduced-motion: reduce)", () => {
        global.alpha = 1;
        orbit.rotation = 90; // Lock Hydra Cream to front
        renderOrbit();
        gsap.set([bgRef.current, spotlightRef.current, textElementsRef.current], { opacity: 1, y: 0 });
      });

      // --- CINEMATIC MOTION ---
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Initial hidden states
        gsap.set(bgRef.current, { opacity: 0 });
        gsap.set(textElementsRef.current, { opacity: 0, y: 16 });
        gsap.set(spotlightRef.current, { opacity: 0, scaleY: 0.85, transformOrigin: "top center" });

        const stepDur = 1.2;
        const holdDur = 1.0;

        // 1. The Seamless Looping Engine
        orbitTlRef.current = gsap.timeline({ paused: true, repeat: -1, onUpdate: renderOrbit })
          .to({}, { duration: holdDur }) // Hold at 90
          .fromTo(orbit, { rotation: 90 }, { rotation: 180, duration: stepDur, ease: "power2.inOut" })
          .to({}, { duration: holdDur }) // Hold at 180
          .fromTo(orbit, { rotation: 180 }, { rotation: 270, duration: stepDur, ease: "power2.inOut" })
          .to({}, { duration: holdDur }) // Hold at 270
          .fromTo(orbit, { rotation: 270 }, { rotation: 360, duration: stepDur, ease: "power2.inOut" })
          .to({}, { duration: holdDur }) // Hold at 360
          .fromTo(orbit, { rotation: 360 }, { rotation: 450, duration: stepDur, ease: "power2.inOut" });

        // 2. The Master Reveal
        const masterTl = gsap.timeline();
        
        masterTl.to(bgRef.current, { opacity: 1, duration: 0.8, ease: "power1.out" }, 0)
          .to(spotlightRef.current, { opacity: 0.85, scaleY: 1, duration: 1.5, ease: "power2.out" }, 0.3)
          .to(textElementsRef.current, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out" }, 0.5)
          .to(global, { alpha: 1, duration: 1.2, ease: "power2.out", onUpdate: renderOrbit }, 0.4);

        // 3. The Intro Approach (starts moving as lights come on)
        introTweenRef.current = gsap.to(orbit, {
          rotation: 90, // Brings Hydra from right (45) to front center (90)
          duration: 1.8,
          ease: "power2.inOut",
          onUpdate: renderOrbit,
          delay: 0.6,
          onComplete: () => orbitTlRef.current.play() // Hand off to the continuous loop
        });
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#030304] px-4 py-16 sm:py-20 sm:px-10 lg:py-0"
    >
      {/* Ambient background depth */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none opacity-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.015)_0%,transparent_40%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col lg:flex-row items-center lg:items-stretch gap-8 sm:gap-10 lg:gap-8 min-h-[60vh]">
        {/* LEFT: HERO TEXT (order-2 on mobile so it sits below the image, order-1 on lg to keep desktop layout) */}
        <div className="w-full lg:w-[42%] flex flex-col justify-center order-2 lg:order-1 pt-0 lg:pt-20 z-20 pointer-events-auto">
          <h1
            id="hero-title"
            ref={(el) => { textElementsRef.current[0] = el; }}
            className="text-4xl font-light tracking-tight text-[#e2e2e5] sm:text-5xl lg:text-6xl uppercase leading-[1.1]"
          >
            No two skins<br />
            read the same.<br />
            <span className="font-semibold text-white">
              Neither should<br />
              your routine.
            </span>
          </h1>

          <p
            ref={(el) => { textElementsRef.current[1] = el; }}
            className="mt-8 max-w-md text-sm lg:text-base leading-relaxed text-[#a1a1aa]"
          >
            NO TWO reads your skin through AI and builds a routine around what it
            actually finds — not what everyone else is using.
          </p>

        </div>

        {/* RIGHT: CINEMATIC PRODUCT ORBIT (order-1 on mobile so it renders first/on top, order-2 on lg to keep desktop layout) */}
        <div className="relative w-full lg:w-[58%] flex flex-col justify-end order-1 lg:order-2 z-10">
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#030304] to-transparent z-20 pointer-events-none" />

          <div className="relative w-full min-h-[320px] sm:min-h-[420px] lg:min-h-[560px]">
            {/* FIXED SPOTLIGHT WITH PARTICLES */}
            <div
              ref={spotlightRef}
              className="absolute left-1/2 -translate-x-1/2 top-[-16%] sm:top-[-24%] lg:top-[-32%] w-[100%] sm:w-[108%] lg:w-[112%] h-[110%] sm:h-[128%] lg:h-[145%] pointer-events-none z-0"
              aria-hidden="true"
            >
              <img
                src="/light.png"
                alt="Overhead spotlight beam"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ mixBlendMode: 'screen' }}
              />
              
              {/* CSS Keyframes for the specific dust drift */}
              <style>{`
                @keyframes floatDust {
                  0% { transform: translate(0, 0) scale(var(--s)); opacity: 0; }
                  30% { opacity: var(--o); }
                  70% { opacity: var(--o); }
                  100% { transform: translate(var(--tx), var(--ty)) scale(var(--s)); opacity: 0; }
                }
              `}</style>
              
              {/* Particle Container mapping radial depth mask so they don't bleed out */}
              <div 
                className="absolute inset-0 z-10 overflow-hidden" 
                style={{
                  maskImage: "radial-gradient(ellipse at center, black 0%, transparent 65%)",
                  WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 65%)",
                }}
              >
                {particles.map((p) => (
                  <div
                    key={p.id}
                    className="absolute w-[2px] h-[2px] bg-white rounded-full blur-[0.5px]"
                    style={{
                      left: p.left,
                      top: p.top,
                      "--tx": p.tx,
                      "--ty": p.ty,
                      "--s": p.s,
                      "--o": p.o,
                      animation: `floatDust ${p.dur}s infinite linear ${p.del}s`,
                      opacity: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ORBIT STAGE */}
            <div className="absolute inset-0 z-10 cursor-default">
              {/* Lowered invisible floor coordinate point to sit directly inside the light pool */}
              <div className="absolute top-[80%] sm:top-[85%] lg:top-[92%] left-1/2 w-0 h-0">
                {PRODUCTS.map((product, idx) => (
                  <div
                    key={product.id}
                    ref={(el) => { productRefs.current[idx] = el; }}
                    className="absolute bottom-0 flex flex-col items-center w-[130px] sm:w-[200px] lg:w-[260px] pointer-events-none"
                    style={{ opacity: 0 }}
                  >
                    {/* Bottle Wrapper */}
                    <div className={`${SIZE_CLASSES[product.size]} w-full flex items-end justify-center relative`}>
                      <Image
                        src={product.img}
                        alt={product.name}
                        className="relative z-10 max-h-full w-auto object-contain select-none"
                        draggable={false}
                        priority
                      />
                      {/* Dynamic Contact Shadow */}
                      <div className="absolute bottom-[1px] left-1/2 -translate-x-1/2 w-[45%] h-[3px] bg-black/90 blur-[2px] rounded-[100%] z-0 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}