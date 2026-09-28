"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

import HydraCreamImg from "@/app/assets/HydraCream.png";
import PurityGelImg from "@/app/assets/PurityGel.png";
import RadianceSerumImg from "@/app/assets/RadianceSerum.png";

// FIXED PRODUCT DATA
const PRODUCTS = [
  { id: "01", name: "HYDRA CREAM", img: HydraCreamImg, size: "lg" },
  { id: "02", name: "PURITY GEL", img: PurityGelImg, size: "lg" },
  { id: "03", name: "RADIANCE SERUM", img: RadianceSerumImg, size: "lg" },
  { id: "04", name: "HYDRA CREAM", img: HydraCreamImg, size: "lg" },
];

const SIZE_CLASSES = {
  lg: "h-[110px] sm:h-[160px] lg:h-[270px]",
  md: "h-[90px] sm:h-[130px] lg:h-[216px]",
};

// HEADLINE LINES (each one is revealed separately)
const HEADLINE_LINES = [
  { text: "No two skins", strong: false },
  { text: "read the same.", strong: false },
  { text: "Neither should", strong: true },
  { text: "your routine.", strong: true },
];

// STORY TIMING (seconds) — tweak these to adjust the pacing
const DARK_HOLD = 0.04; // brief handoff from the intro loader to the spotlight
const PRODUCT_GAP = 0.5; // beat between the spotlight being on and the first product appearing
const CENTER_SPIN_TIME = 2.2; // how long products spin in the center before moving right

export default function Hero({ isActive = true }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null); // spotlight + orbit column (moves center -> right)
  const lineRefs = useRef([]);
  const fadeRefs = useRef([]);
  const copyGlowRef = useRef(null);
  const productRefs = useRef([]);
  const spotlightRef = useRef(null);
  const bgRef = useRef(null);

  // Animation timelines
  const orbitTlRef = useRef(null);

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
    if (!isActive) return;

    const mediaQueries = gsap.matchMedia(sectionRef);
    const stageRightShift = window.matchMedia("(min-width: 1024px)").matches ? 48 : 0;

    // State proxies for mathematical rendering
    const orbit = { rotation: 90 }; // Starts with Hydra Cream already at the front (in the light)
    const orbitStep = 360 / PRODUCTS.length;
    const global = { alpha: 1 }; // Master fade
    const reveals = PRODUCTS.map(() => ({ v: 1 })); // Per-product reveal (Hydra Cream shows first)
    let currentRadii = { x: 250, y: 58 }; // Default desktop orbit size

    // Responsive adjustments
    mediaQueries.add("(min-width: 1024px)", () => { currentRadii = { x: 250, y: 58 }; });
    mediaQueries.add("(min-width: 640px) and (max-width: 1023px)", () => { currentRadii = { x: 160, y: 40 }; });
    mediaQueries.add("(max-width: 639px)", () => { currentRadii = { x: 95, y: 25 }; }); // Compact mobile orbit

    // The 3D Engine: Maps current rotation to physical screen coordinates
    const renderOrbit = () => {
      const rX = currentRadii.x;
      const rY = currentRadii.y;

      productRefs.current.forEach((ref, i) => {
        if (!ref) return;

        // Keep the products evenly spaced around the orbit.
        const angleDeg = orbit.rotation - i * orbitStep;
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
        const finalOpacity = targetOpacity * global.alpha * reveals[i].v; // Multiplied by reveal state
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
    mediaQueries.add("(prefers-reduced-motion: reduce)", () => {
      global.alpha = 1;
      orbit.rotation = 90; // Lock Hydra Cream to front
      renderOrbit();
      gsap.set(stageRef.current, { x: stageRightShift });
      gsap.set([bgRef.current, spotlightRef.current], { opacity: 1 });
      gsap.set(copyGlowRef.current, { opacity: 1 });
      gsap.set(lineRefs.current, { yPercent: 0, opacity: 1 });
      gsap.set(fadeRefs.current, { opacity: 1, y: 0 });
    });

    // --- CINEMATIC STORY MOTION ---
    mediaQueries.add("(prefers-reduced-motion: no-preference)", () => {
      const stage = stageRef.current;
      const section = sectionRef.current;

      // How far left the stage must sit so the spotlight is centered on the screen
      gsap.set(stage, { x: 0 });
      const stageBox = stage.getBoundingClientRect();
      const sectionBox = section.getBoundingClientRect();
      const centerOffset =
        sectionBox.left + sectionBox.width / 2 - (stageBox.left + stageBox.width / 2);

      // Initial hidden states (total darkness)
      gsap.set(stage, { x: centerOffset });
      gsap.set(bgRef.current, { opacity: 0 });
      gsap.set(spotlightRef.current, { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(copyGlowRef.current, { opacity: 0 });
      gsap.set(lineRefs.current, { yPercent: 110, opacity: 0 });
      gsap.set(fadeRefs.current, { opacity: 0, y: 16 });
      gsap.set(reveals, { v: 0 }); // products fully hidden until their reveal

      const stepDur = 1.2;
      const holdDur = 1.0;

      // 1. The Seamless Looping Engine (paused until the reveal finishes)
      // immediateRender: false -> building the loop must NOT change the orbit position
      orbitTlRef.current = gsap.timeline({ paused: true, repeat: -1, onUpdate: renderOrbit });
      for (let i = 0; i < PRODUCTS.length; i += 1) {
        const fromRotation = 90 + orbitStep * i;
        const toRotation = fromRotation + orbitStep;

        orbitTlRef.current
          .to({}, { duration: holdDur })
          .fromTo(
            orbit,
            { rotation: fromRotation },
            { rotation: toRotation, duration: stepDur, ease: "power2.inOut", immediateRender: false }
          );
      }

      // Lock the formation: Hydra Cream in the front of the light, everything still hidden
      orbit.rotation = 90;
      renderOrbit();

      // 2. The Master Story Timeline
      const story = gsap.timeline();

      story
        // Beat 1 — Hold on full darkness
        .to({}, { duration: DARK_HOLD })

        // Beat 2 — Spotlight snaps ON quickly (top-to-bottom reveal + flicker)
        .to(spotlightRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.3, ease: "power3.out" })
        .to(spotlightRef.current, {
          keyframes: [
            { opacity: 0.5, duration: 0.04 },
            { opacity: 0.2, duration: 0.05 },
            { opacity: 0.95, duration: 0.06 },
            { opacity: 0.6, duration: 0.04 },
            { opacity: 0.85, duration: 0.25, ease: "power2.out" },
          ],
          onComplete: () => gsap.set(spotlightRef.current, { clearProps: "clipPath" }),
        }, "<")
        .to(bgRef.current, { opacity: 1, duration: 0.4, ease: "power1.out" }, "<")

        // Beat 3 — Short beat: only the light is on the empty stage
        .to({}, { duration: PRODUCT_GAP })

        // Beat 4 — Hydra Cream fades in first, right on the light (no movement)
        .to(reveals[0], { v: 1, duration: 0.7, ease: "power2.out", onUpdate: renderOrbit })

        // Beat 5 — the remaining products fade in around it (still no movement)
        .to(reveals.slice(1), { v: 1, duration: 0.6, stagger: 0.12, ease: "power2.out", onUpdate: renderOrbit }, "-=0.25")

        // Beat 6 — reveal is complete, THEN the spin starts from Hydra Cream (skips part of the first hold so it starts promptly)
        .add(() => orbitTlRef.current && orbitTlRef.current.play(0.4))

        // Let the products spin in the center for a moment
        .to({}, { duration: CENTER_SPIN_TIME })

        // Beat 7 — Spotlight + Products travel from center to the right corner
        // AND the left text starts revealing at that exact same moment (everything is anchored to the "travel" label)
        .addLabel("travel")
        .to(stage, { x: stageRightShift, duration: 1.6, ease: "power3.inOut" }, "travel")

        // Beat 8 — Text reveals line by line on the left, starting together with the stage movement
        .to(lineRefs.current, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: "power3.out" }, "travel")
        .to(copyGlowRef.current, { opacity: 1, duration: 1.2, ease: "power2.out" }, "travel")
        .to(fadeRefs.current, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "travel+=0.5");
    });

    return () => {
      mediaQueries.revert();
      orbitTlRef.current = null;
    };
  }, [isActive]);

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
        <div className="relative w-full lg:w-[42%] flex flex-col justify-center order-2 lg:order-1 pt-0 lg:pt-20 z-20 pointer-events-auto">
          {/* SILVER TEXT BACKDROP — stays solid silver behind all the text, then fades into black with a soft curved edge.
              The elliptical mask fades every side of the box to transparent, so no rectangle is ever visible. */}
          <div
            ref={copyGlowRef}
            aria-hidden="true"
            className="pointer-events-none absolute -left-[28%] -right-[30%] -top-[20%] -bottom-[20%] z-0 opacity-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 42% at 30% 45%, rgba(222,226,230,0.5) 0%, rgba(222,226,230,0) 100%), linear-gradient(100deg, rgba(196,201,206,0.97) 0%, rgba(184,189,195,0.95) 55%, rgba(150,155,161,0.8) 80%, rgba(3,3,4,0) 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 100% 50% at 6% 50%, #000 0%, #000 62%, rgba(0,0,0,0.75) 76%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0) 100%)",
              maskImage:
                "radial-gradient(ellipse 100% 50% at 6% 50%, #000 0%, #000 62%, rgba(0,0,0,0.75) 76%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div className="relative z-10">
            <h1
              id="hero-title"
              className="font-serif text-4xl font-light italic tracking-[-0.045em] text-[#090a0c] sm:text-5xl lg:text-6xl xl:text-7xl uppercase leading-[1.02]"
            >
              {HEADLINE_LINES.map((line, i) => (
                <span key={line.text} className="block overflow-hidden">
                  <span
                    ref={(el) => { lineRefs.current[i] = el; }}
                    className={`block ${line.strong ? "font-sans font-semibold not-italic tracking-[-0.055em] text-[#090a0c]" : ""}`}
                    style={{ opacity: 0 }}
                  >
                    {line.text}
                  </span>
                </span>
              ))}
            </h1>



            <div
              ref={(el) => { fadeRefs.current[1] = el; }}
              className="mt-8"
              style={{ opacity: 0 }}
            >

            </div>
          </div>
        </div>

        {/* RIGHT: CINEMATIC PRODUCT ORBIT (order-1 on mobile so it renders first/on top, order-2 on lg to keep desktop layout) */}
        <div
          ref={stageRef}
          className="relative w-full lg:w-[58%] flex flex-col justify-end order-1 lg:order-2 z-10"
        >
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#030304] to-transparent z-20 pointer-events-none" />

          <div className="relative w-full min-h-[320px] sm:min-h-[420px] lg:min-h-[560px]">
            {/* FIXED SPOTLIGHT WITH PARTICLES */}
            <div
              ref={spotlightRef}
              className="absolute left-1/2 -translate-x-1/2 top-[-16%] sm:top-[-24%] lg:top-[-34%] w-[100%] sm:w-[108%] lg:w-[118%] h-[110%] sm:h-[128%] lg:h-[152%] pointer-events-none z-0"
              style={{ opacity: 0 }}
              aria-hidden="true"
            >
              <img
                src="/light.png"
                alt="Overhead spotlight beam"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ mixBlendMode: "screen" }}
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
              {/* Shared floor anchor aligns the front product base with the podium surface */}
              <div className="absolute top-[76%] sm:top-[82%] lg:top-[88%] left-1/2 w-0 h-0">
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
                        loading={idx === 0 ? "eager" : "lazy"}
                        className="relative z-10 max-h-full w-auto object-contain select-none"
                        draggable={false}
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
