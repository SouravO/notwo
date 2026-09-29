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

// Bigger display products (desktop height adapts to the screen height, capped at 460px)
const SIZE_CLASSES = {
  lg: "h-[150px] sm:h-[230px] lg:h-[min(54svh,460px)]",
  md: "h-[90px] sm:h-[130px] lg:h-[216px]",
};

// Product height (px) during the initial spotlight reveal, per breakpoint.
// After the silver reveal the products grow to the big size defined in SIZE_CLASSES.
const INTRO_PRODUCT_HEIGHTS = { lg: 270, md: 160, sm: 110 };

// HEADLINE LINES
const HEADLINE_LINES = [
  { text: "No two skins" },
  { text: "read the same." },
  { text: "Neither should" },
  { text: "your routine." },
];

// HERO COPY (edit freely)
const SUBCOPY =
  "Our AI reads what your skin actually needs, then matches formulas built around it. One routine. Yours alone.";
const CTA_PRIMARY = { label: "Discover your routine", href: "#products" };
const CTA_SECONDARY = { label: "How it works", href: "#technology" };

// STORY TIMING
const DARK_HOLD = 0.04;
const PRODUCT_GAP = 0.5;
const CENTER_SPIN_TIME = 2.2;

// PRODUCT SPIN SPEED (lower = faster)
const ORBIT_STEP = 0.8; // seconds a bottle takes to rotate to the next position
const ORBIT_HOLD = 0.5; // short pause with a bottle in front

// PRODUCT EMPHASIS (front bottle big, back bottles small)
const SCALE_BACK = 0.62;
const SCALE_FRONT = 1.25;

// SPOTLIGHT / PODIUM ALIGNMENT (intro only)
// Where the podium's top-surface center sits inside light.png, as a fraction of the image height (0 = top, 1 = bottom).
const PODIUM_Y_FRAC = 0.85;
// Fallback width/height ratio of light.png (real ratio is read from the image once it loads)
const LIGHT_ASPECT_FALLBACK = 1.6;

// FULL BACKGROUND SILVER (solid, no gradient)
const SILVER = "#b6bbc0";

// Subtle film grain for the silver surface (texture only, not a gradient)
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export default function Hero({ isActive = true }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const stageInnerRef = useRef(null);
  const anchorRef = useRef(null);
  const lineRefs = useRef([]);
  const fadeRefs = useRef([]);
  const copyGlowRef = useRef(null);
  const productRefs = useRef([]);
  const spotlightRef = useRef(null);
  const lightImgRef = useRef(null);
  const bgRef = useRef(null);

  // Depth decor (appears with the silver reveal)
  const watermarkRef = useRef(null);
  const haloRef = useRef(null);
  const groundRef = useRef(null);
  const ringRef = useRef(null);

  // Live product caption
  const captionNumRef = useRef(null);
  const captionNameRef = useRef(null);
  const dotRefs = useRef([]);

  const orbitTlRef = useRef(null);
  const layoutLightRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generatedParticles = Array.from({ length: 60 }).map(() => ({
      id: Math.random(),
      left: `${40 + Math.random() * 20}%`,
      top: `${10 + Math.random() * 85}%`,
      tx: `${(Math.random() - 0.5) * 80}px`,
      ty: `${-50 - Math.random() * 120}px`,
      s: Math.random() * 0.45 + 0.35,
      o: Math.random() * 0.6 + 0.4,
      dur: 4 + Math.random() * 7,
      del: Math.random() * 5,
    }));
    setParticles(generatedParticles);
  }, []);

  useLayoutEffect(() => {
    if (!isActive) return;

    const mediaQueries = gsap.matchMedia(sectionRef);
    const stageRightShift = window.matchMedia("(min-width: 1024px)").matches ? 48 : 0;

    const orbit = { rotation: 90 };
    const orbitStep = 360 / PRODUCTS.length;
    const global = { alpha: 1 };
    const reveals = PRODUCTS.map(() => ({ v: 1 }));
    let currentRadii = { x: 250, y: 58 };
    let activeIdx = -1;

    // Intro product size: products start smaller (intro height) and grow to full size after the silver reveal
    const sizeFactor = { v: 1 };
    let introH = INTRO_PRODUCT_HEIGHTS.lg;
    let introRatio = 1;
    let introGrown = false;

    const getDecor = () =>
      [watermarkRef, haloRef, groundRef, ringRef].map((r) => r.current).filter(Boolean);

    // Sizes the spotlight so its top touches the very top of the screen (section)
    // and its podium lands exactly under the front product of the orbit.
    const layoutLight = () => {
      const section = sectionRef.current;
      const inner = stageInnerRef.current;
      const anchor = anchorRef.current;
      const light = spotlightRef.current;
      const img = lightImgRef.current;
      if (!section || !inner || !anchor || !light) return;

      const s = section.getBoundingClientRect();
      const i = inner.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();

      const top = s.top - i.top; // negative: pulls the light up to the top edge of the screen
      const podiumY = a.top - i.top + currentRadii.y; // front product's feet sit here
      const height = (podiumY - top) / PODIUM_Y_FRAC;
      const aspect =
        img && img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : LIGHT_ASPECT_FALLBACK;

      gsap.set(light, { top, height, width: height * aspect });
    };

    // Sizes the halo / floor shadow / orbit ring around the orbit anchor (all positions are relative to the anchor)
    const layoutDecor = () => {
      const rX = currentRadii.x;
      const rY = currentRadii.y;
      const productH = (productRefs.current[0] && productRefs.current[0].offsetHeight) || 300;
      const frontH = productH * SCALE_FRONT;

      if (ringRef.current) {
        gsap.set(ringRef.current, { left: -rX, top: -rY, width: rX * 2, height: rY * 2 });
      }
      if (groundRef.current) {
        const w = rX * 2.6;
        const h = rY * 3;
        gsap.set(groundRef.current, { left: -w / 2, top: -h / 2 + rY * 0.3, width: w, height: h });
      }
      if (haloRef.current) {
        const w = productH * 2.1;
        const h = productH * 1.5;
        const centerY = rY - frontH * 0.5;
        gsap.set(haloRef.current, { left: -w / 2, top: centerY - h / 2, width: w, height: h });
      }
    };

    // Keeps the intro (smaller) product size in sync with the real product size at this breakpoint
    const layoutIntroSize = () => {
      const bigH = productRefs.current[0] && productRefs.current[0].offsetHeight;
      if (bigH) introRatio = Math.min(1, introH / bigH);
      if (!introGrown) sizeFactor.v = introRatio;
    };

    const layoutAll = () => {
      layoutLight();
      layoutDecor();
      layoutIntroSize();
    };
    layoutLightRef.current = layoutAll;

    mediaQueries.add("(min-width: 1024px)", () => { currentRadii = { x: 250, y: 58 }; introH = INTRO_PRODUCT_HEIGHTS.lg; layoutAll(); });
    mediaQueries.add("(min-width: 640px) and (max-width: 1023px)", () => { currentRadii = { x: 160, y: 40 }; introH = INTRO_PRODUCT_HEIGHTS.md; layoutAll(); });
    mediaQueries.add("(max-width: 639px)", () => { currentRadii = { x: 95, y: 25 }; introH = INTRO_PRODUCT_HEIGHTS.sm; layoutAll(); });

    layoutAll();
    window.addEventListener("resize", layoutAll);
    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(layoutAll) : null;
    if (resizeObserver && sectionRef.current) resizeObserver.observe(sectionRef.current);

    // Updates the caption + dots to the bottle currently in front
    const updateCaption = (idx, animate) => {
      if (captionNumRef.current) captionNumRef.current.textContent = PRODUCTS[idx].id;
      if (captionNameRef.current) {
        captionNameRef.current.textContent = PRODUCTS[idx].name;
        if (animate) {
          gsap.fromTo(
            captionNameRef.current,
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", overwrite: true }
          );
        }
      }
      dotRefs.current.forEach((d, k) => {
        if (!d) return;
        d.style.width = k === idx ? "28px" : "10px";
        d.style.opacity = k === idx ? "1" : "0.35";
      });
    };

    const renderOrbit = () => {
      const rX = currentRadii.x;
      const rY = currentRadii.y;
      let frontIdx = 0;
      let frontSin = -2;

      productRefs.current.forEach((ref, i) => {
        if (!ref) return;

        const angleDeg = orbit.rotation - i * orbitStep;
        const angleRad = angleDeg * (Math.PI / 180);

        const sin = Math.sin(angleRad);
        const cos = Math.cos(angleRad);

        if (sin > frontSin) {
          frontSin = sin;
          frontIdx = i;
        }

        const x = cos * rX;
        const y = sin * rY;

        const depthProgress = (sin + 1) / 2;
        const frontProgress = Math.max(0, sin);
        const activeStrength = Math.pow(frontProgress, 4);

        // Front bottle big, bottles going to the back get small
        // (sizeFactor.v shrinks everything during the intro, then grows to 1 after the silver reveal)
        const scale =
          (SCALE_BACK + Math.pow(depthProgress, 2.2) * (SCALE_FRONT - SCALE_BACK)) * sizeFactor.v;
        const targetOpacity = 0.4 + depthProgress * 0.2 + activeStrength * 0.4;
        const finalOpacity = targetOpacity * global.alpha * reveals[i].v;
        const brightness = 0.58 + depthProgress * 0.17 + activeStrength * 0.3;
        const blur = (1 - depthProgress) * 1.8; // depth of field: back bottles softer

        gsap.set(ref, {
          xPercent: -50,
          x,
          y,
          scale,
          opacity: finalOpacity,
          filter: `brightness(${brightness}) blur(${blur}px)`,
          zIndex: Math.round(depthProgress * 100),
          transformOrigin: "center bottom",
        });
      });

      if (frontIdx !== activeIdx) {
        const isFirst = activeIdx === -1;
        activeIdx = frontIdx;
        updateCaption(frontIdx, !isFirst);
      }
    };

    // --- REDUCED MOTION ---
    mediaQueries.add("(prefers-reduced-motion: reduce)", () => {
      global.alpha = 1;
      orbit.rotation = 90;
      introGrown = true; // no intro: show the final (big) product size
      sizeFactor.v = 1;
      renderOrbit();
      gsap.set(stageRef.current, { x: stageRightShift });
      gsap.set(bgRef.current, { opacity: 1 });
      gsap.set(spotlightRef.current, { opacity: 0 }); // final state: spotlight is gone, only products remain
      gsap.set(getDecor(), { opacity: 1 });
      gsap.set(copyGlowRef.current, { opacity: 1, clipPath: "circle(150% at 30% 50%)" });
      gsap.set(lineRefs.current, { yPercent: 0, opacity: 1 });
      gsap.set(fadeRefs.current, { opacity: 1, y: 0 });
    });

    // --- CINEMATIC STORY MOTION ---
    mediaQueries.add("(prefers-reduced-motion: no-preference)", () => {
      const stage = stageRef.current;
      const section = sectionRef.current;
      const decor = getDecor();

      gsap.set(stage, { x: 0 });
      const stageBox = stage.getBoundingClientRect();
      const sectionBox = section.getBoundingClientRect();
      const centerOffset =
        sectionBox.left + sectionBox.width / 2 - (stageBox.left + stageBox.width / 2);

      // Intro: products start at the smaller (previous) size
      introGrown = false;
      sizeFactor.v = introRatio;

      gsap.set(stage, { x: centerOffset });
      gsap.set(bgRef.current, { opacity: 0 });
      gsap.set(spotlightRef.current, { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(copyGlowRef.current, { opacity: 0, clipPath: "circle(0% at 30% 50%)" });
      gsap.set(decor, { opacity: 0 });
      gsap.set(lineRefs.current, { yPercent: 110, opacity: 0 });
      gsap.set(fadeRefs.current, { opacity: 0, y: 16 });
      gsap.set(reveals, { v: 0 });

      // Continuous fast spin: short hold with a bottle in front, then a quick step to the next one
      orbitTlRef.current = gsap.timeline({ paused: true, repeat: -1, onUpdate: renderOrbit });
      for (let i = 0; i < PRODUCTS.length; i += 1) {
        const fromRotation = 90 + orbitStep * i;
        const toRotation = fromRotation + orbitStep;

        orbitTlRef.current
          .to({}, { duration: ORBIT_HOLD })
          .fromTo(
            orbit,
            { rotation: fromRotation },
            { rotation: toRotation, duration: ORBIT_STEP, ease: "power2.inOut", immediateRender: false }
          );
      }

      orbit.rotation = 90;
      renderOrbit();

      const story = gsap.timeline();

      story
        .to({}, { duration: DARK_HOLD })
        // Spotlight snaps ON quickly
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
        .to({}, { duration: PRODUCT_GAP })
        .to(reveals[0], { v: 1, duration: 0.7, ease: "power2.out", onUpdate: renderOrbit })
        .to(reveals.slice(1), { v: 1, duration: 0.6, stagger: 0.12, ease: "power2.out", onUpdate: renderOrbit }, "-=0.25")
        .add(() => orbitTlRef.current && orbitTlRef.current.play(0))
        .to({}, { duration: CENTER_SPIN_TIME })
        .addLabel("travel")
        .add(() => { introGrown = true; }, "travel")
        .to(stage, { x: stageRightShift, duration: 1.6, ease: "power3.inOut" }, "travel")
        // Products GROW from the intro size to the big display size with the silver reveal
        .to(sizeFactor, { v: 1, duration: 1.6, ease: "power3.inOut", onUpdate: renderOrbit }, "travel")
        // Spotlight DISAPPEARS: flickers off, then retracts upward and fades out
        .to(spotlightRef.current, {
          keyframes: [
            { opacity: 0.55, duration: 0.05 },
            { opacity: 0.85, duration: 0.05 },
            { opacity: 0.3, duration: 0.07 },
            { opacity: 0, duration: 0.6, ease: "power2.in" },
          ],
        }, "travel")
        .fromTo(
          spotlightRef.current,
          { clipPath: "inset(0% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "power3.in", immediateRender: false },
          "travel+=0.1"
        )
        // Full screen solid silver reveal
        .to(copyGlowRef.current, { 
            opacity: 1, 
            clipPath: "circle(150% at 30% 50%)", 
            duration: 1.6, 
            ease: "power2.inOut" 
        }, "travel")
        // Depth decor (watermark, halo, floor shadow, orbit ring) fades in with the silver
        .to(decor, { opacity: 1, duration: 1.4, stagger: 0.12, ease: "power2.out" }, "travel+=0.2")
        .to(lineRefs.current, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: "power3.out" }, "travel")
        .to(fadeRefs.current, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, "travel+=0.5");
    });

    return () => {
      window.removeEventListener("resize", layoutAll);
      if (resizeObserver) resizeObserver.disconnect();
      layoutLightRef.current = null;
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
      <style>{`
        @keyframes scrollCue {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>

      {/* Ambient background depth */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none opacity-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.015)_0%,transparent_40%)]" />
      </div>

      {/* FULL SCREEN SOLID SILVER BACKGROUND (+ subtle film grain) */}
      <div
        ref={copyGlowRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 opacity-0"
        style={{ background: SILVER }}
      >
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col lg:flex-row items-center lg:items-stretch gap-8 sm:gap-10 lg:gap-8 min-h-[60vh]">
        {/* LEFT: HERO TEXT */}
        <div className="relative w-full lg:w-[42%] flex flex-col justify-center order-2 lg:order-1 pt-0 lg:pt-20 z-20 pointer-events-auto">
          <div className="relative z-10">
           
            <h1
              id="hero-title"
              className="font-serif text-[clamp(2.4rem,5.5vw,3.75rem)] font-normal italic tracking-[-0.02em] text-[#090a0c] uppercase leading-[1.02]"
            >
              {HEADLINE_LINES.map((line, i) => (
                <span key={line.text} className="block overflow-hidden">
                  <span
                    ref={(el) => { lineRefs.current[i] = el; }}
                    className="block whitespace-nowrap"
                    style={{ opacity: 0 }}
                  >
                    {line.text}
                  </span>
                </span>
              ))}
            </h1>

            {/* Subcopy + actions */}
            <div
              ref={(el) => { fadeRefs.current[1] = el; }}
              className="mt-8 sm:mt-10 flex max-w-[30rem] flex-col gap-7"
              style={{ opacity: 0 }}
            >
              <p className="font-sans text-sm leading-relaxed text-[#090a0c]/70 sm:text-base">
                {SUBCOPY}
              </p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <a
                  href={CTA_PRIMARY.href}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#090a0c] px-7 py-3.5 font-sans text-sm font-medium tracking-wide text-[#e6e9ec] transition-transform duration-300 hover:scale-[1.03]"
                >
                  {CTA_PRIMARY.label}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                <a
                  href={CTA_SECONDARY.href}
                  className="font-sans text-sm font-medium tracking-wide text-[#090a0c] underline decoration-[#090a0c]/30 underline-offset-[6px] transition-colors duration-300 hover:decoration-[#090a0c]"
                >
                  {CTA_SECONDARY.label}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CINEMATIC PRODUCT ORBIT */}
        <div
          ref={stageRef}
          className="relative w-full lg:w-[58%] flex flex-col justify-end order-1 lg:order-2 z-10"
        >
          <div
            ref={stageInnerRef}
            className="relative w-full min-h-[360px] sm:min-h-[460px] lg:min-h-[min(84svh,700px)]"
          >
            {/* WATERMARK: large soft "NO TWO" sitting behind the products */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[12%] lg:top-[16%] z-0 flex select-none justify-center"
            >
              <span
                ref={watermarkRef}
                className="whitespace-nowrap font-serif font-semibold uppercase leading-none tracking-[-0.06em] text-[22vw] sm:text-[16vw] lg:text-[clamp(120px,11.5vw,190px)]"
                style={{
                  opacity: 0,
                  backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 85%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }}
              >
                NO TWO
              </span>
            </div>

            {/* SPOTLIGHT WITH PARTICLES (intro only) — top/height/width are set in JS */}
            <div
              ref={spotlightRef}
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-0"
              style={{ opacity: 0 }}
              aria-hidden="true"
            >
              <img
                ref={lightImgRef}
                src="/light.png"
                alt="Overhead spotlight beam"
                loading="lazy"
                onLoad={() => layoutLightRef.current && layoutLightRef.current()}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ 
                  mixBlendMode: "screen",
                  WebkitMaskImage: "radial-gradient(ellipse 80% 100% at 50% 50%, black 40%, transparent 95%)",
                  maskImage: "radial-gradient(ellipse 80% 100% at 50% 50%, black 40%, transparent 95%)"
                }}
              />

              <style>{`
                @keyframes floatDust {
                  0% { transform: translate(0, 0) scale(var(--s)); opacity: 0; }
                  30% { opacity: var(--o); }
                  70% { opacity: var(--o); }
                  100% { transform: translate(var(--tx), var(--ty)) scale(var(--s)); opacity: 0; }
                }
              `}</style>

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
              <div
                ref={anchorRef}
                className="absolute top-[76%] sm:top-[82%] lg:top-[84%] left-1/2 w-0 h-0"
              >
                {/* Soft backlight halo behind the front bottle */}
                <div
                  ref={haloRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute rounded-[50%]"
                  style={{
                    opacity: 0,
                    background:
                      "radial-gradient(closest-side, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 100%)",
                  }}
                />
                {/* Floor shadow grounding the orbit */}
                <div
                  ref={groundRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute rounded-[50%]"
                  style={{
                    opacity: 0,
                    background:
                      "radial-gradient(closest-side, rgba(9,10,12,0.22) 0%, rgba(9,10,12,0) 100%)",
                  }}
                />
                {/* Hairline orbit ring */}
                <div
                  ref={ringRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute rounded-[50%] border border-[#090a0c]/[0.14]"
                  style={{ opacity: 0 }}
                />

                {PRODUCTS.map((product, idx) => (
                  <div
                    key={product.id}
                    ref={(el) => { productRefs.current[idx] = el; }}
                    className="absolute bottom-0 flex flex-col items-center w-[170px] sm:w-[260px] lg:w-[340px] pointer-events-none"
                    style={{ opacity: 0 }}
                  >
                    <div className={`${SIZE_CLASSES[product.size]} w-full flex items-end justify-center relative`}>
                      <Image
                        src={product.img}
                        alt={product.name}
                        loading={idx === 0 ? "eager" : "lazy"}
                        className="relative z-10 max-h-full w-auto object-contain select-none"
                        draggable={false}
                      />
                      <div className="absolute bottom-[1px] left-1/2 -translate-x-1/2 w-[45%] h-[3px] bg-black/90 blur-[2px] rounded-[100%] z-0 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVE PRODUCT CAPTION */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-1 sm:pb-2">
              <div
                ref={(el) => { fadeRefs.current[2] = el; }}
                className="flex flex-col items-center gap-3"
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 font-sans text-[11px] font-medium uppercase tracking-[0.3em] text-[#090a0c] sm:text-xs">
                  <span ref={captionNumRef} className="tabular-nums text-[#090a0c]/50">01</span>
                  <span className="h-px w-6 bg-[#090a0c]/30" />
                  <span ref={captionNameRef} className="block">HYDRA CREAM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {PRODUCTS.map((product, idx) => (
                    <span
                      key={product.id}
                      ref={(el) => { dotRefs.current[idx] = el; }}
                      className="h-[2px] w-[10px] rounded-full bg-[#090a0c] opacity-35 transition-all duration-500"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </section>
  );
}
