"use client";

import { useEffect, useRef, useState } from "react";
import { Bodoni_Moda, Space_Grotesk } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const mono = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

const GRADIENT =
  "linear-gradient(115deg, #3E1F3D 0%, #6E3F63 30%, #A45F86 55%, #C97AA0 75%, #E9B9CC 100%)";

const GUESS_WORDS = [
  { text: "Oily?", top: "6%", left: "4%" },
  { text: "Dry?", top: "16%", left: "76%" },
  { text: "Combination?", top: "46%", left: "0%" },
  { text: "Sensitive?", top: "60%", left: "80%" },
  { text: "Normal?", top: "82%", left: "8%" },
  { text: "Dehydrated?", top: "90%", left: "66%" },
];

export default function SkinType() {
  const stageRef = useRef(null);
  const climaxRef = useRef(null);
  const canvasRef = useRef(null);
  const faceRef = useRef(null);
  const clearFaceRef = useRef(null);
  const glowRef = useRef(null);
  const flashRef = useRef(null);
  const bracketsRef = useRef(null);
  const scanTrackRef = useRef(null);
  const scanLineRef = useRef(null);
  const scanGlowRef = useRef(null);
  const wordsWrapRef = useRef(null);
  const entrancePlayedRef = useRef(false);

  // NEW: parallax targets — image panel wrapper and text column
  const parallaxImageRef = useRef(null);
  const parallaxTextRef = useRef(null);

  // reveal state — mirrored into refs so the click handler always reads the latest value
  const [revealed, setRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const revealedRef = useRef(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = Array.from(wordsWrapRef.current?.querySelectorAll("[data-guess-word]") ?? []);
      const track = scanTrackRef.current;
      const line = scanLineRef.current;
      const glowBand = scanGlowRef.current;
      const face = faceRef.current;
      const glow = glowRef.current;
      const flash = flashRef.current;
      const brackets = bracketsRef.current;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set([face, glow, flash, wordsWrapRef.current], {
          clearProps: "all",
          opacity: 1,
          filter: "none",
        });
        gsap.set(face, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(wordsWrapRef.current, { opacity: 0 });
        gsap.set([line, glowBand], { opacity: 0 });
        return;
      }

      gsap.set(face, {
        opacity: 0.16,
        filter: "blur(11px) saturate(0.35)",
        clipPath: "inset(0% 0% 0% 0%)",
      });
      gsap.set(glow, { opacity: 0, scale: 0.85 });
      gsap.set(flash, { opacity: 0, scale: 0.8 });
      gsap.set([line, glowBand], { y: 0, opacity: 0 });

      const mm = gsap.matchMedia();

      // Keep the layered parallax for wider screens only. On phones it tends to
      // compound with the stacked layout and push content into awkward positions.
      mm.add("(min-width: 768px)", () => {
        if (parallaxImageRef.current) {
          gsap.fromTo(
            parallaxImageRef.current,
            { yPercent: 14 },
            {
              yPercent: -14,
              ease: "none",
              scrollTrigger: {
                trigger: stageRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );
        }

        if (parallaxTextRef.current) {
          gsap.fromTo(
            parallaxTextRef.current,
            { yPercent: 4 },
            {
              yPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: stageRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );
        }
      });

      gsap.to(words, {
        y: (i) => (i % 2 === 0 ? "+=14" : "-=14"),
        x: (i) => (i % 3 === 0 ? "+=8" : "-=8"),
        rotate: (i) => (i % 2 === 0 ? 3 : -3),
        duration: (i) => 4 + (i % 4),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.25 },
        scrollTrigger: {
          trigger: canvasRef.current,
          start: "top 90%",
          end: "bottom top",
          toggleActions: "play pause resume pause",
        },
      });

      gsap.to(brackets, {
        opacity: 0.85,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: canvasRef.current,
          start: "top 90%",
          end: "bottom top",
          toggleActions: "play pause resume pause",
        },
      });

      const runEntranceScan = () => {
        if (!track || !line || !glowBand || entrancePlayedRef.current) return;
        entrancePlayedRef.current = true;

        const travel = track.offsetHeight;
        gsap
          .timeline()
          .set([line, glowBand], { y: 0 })
          .to([line, glowBand], { opacity: 1, duration: 0.15, ease: "none" }, 0)
          .to([line, glowBand], { y: travel, duration: 1.1, ease: "sine.inOut" }, 0)
          .to([line, glowBand], { opacity: 0, duration: 0.25, ease: "none" }, 0.95);
      };

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          runEntranceScan();
        } else {
          ScrollTrigger.create({
            trigger: canvasRef.current,
            start: "top 80%",
            once: true,
            onEnter: runEntranceScan,
          });
        }
      }

      if (stageRef.current && climaxRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 65%",
            endTrigger: climaxRef.current,
            end: "center 55%",
            scrub: 0.7,
          },
        });

        tl.to(face, { opacity: 1, filter: "blur(0px) saturate(1)", duration: 1, ease: "none" }, 0)
          .to(
            words,
            { opacity: 0, y: -16, scale: 0.85, filter: "blur(4px)", stagger: 0.04, duration: 0.7, ease: "none" },
            0.22
          )
          .to(glow, { opacity: 0.9, scale: 1.15, duration: 0.8, ease: "none" }, 0.35)
          .to(flash, { opacity: 0.55, scale: 1.25, duration: 0.2, ease: "none" }, 0.78)
          .to(flash, { opacity: 0, duration: 0.3, ease: "none" }, 0.95)
          .to(brackets, { opacity: 1, borderColor: "#3E1F3D", duration: 0.4, ease: "none" }, 0.75);
      }
    }, stageRef);

    return () => ctx.revert();
  }, []);

  // click-to-reveal: clips the pimple layer away top-to-bottom, exposing clearskin.png underneath.
  // the scan line/glow sweep along with the clip edge so it reads as one continuous scan.
  const handleReveal = () => {
    if (isAnimatingRef.current) return;

    const track = scanTrackRef.current;
    const line = scanLineRef.current;
    const glowBand = scanGlowRef.current;
    const face = faceRef.current;
    if (!track || !line || !face) return;

    const travel = track.offsetHeight;
    const goingToClear = !revealedRef.current;

    isAnimatingRef.current = true;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        setIsAnimating(false);
        revealedRef.current = goingToClear;
        setRevealed(goingToClear);
      },
    });

    if (goingToClear) {
      tl.set(face, { opacity: 1, filter: "blur(0px) saturate(1)" }, 0)
        .set([line, glowBand], { y: 0, opacity: 1 }, 0)
        .to(face, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.1, ease: "sine.inOut" }, 0)
        .to([line, glowBand], { y: travel, duration: 1.1, ease: "sine.inOut" }, 0)
        .to([line, glowBand], { opacity: 0, duration: 0.3, ease: "none" }, 1.0);
    } else {
      tl.set([line, glowBand], { y: travel, opacity: 1 })
        .to(face, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "sine.inOut" }, 0)
        .to([line, glowBand], { y: 0, duration: 1.1, ease: "sine.inOut" }, 0)
        .to([line, glowBand], { opacity: 0, duration: 0.3, ease: "none" }, 1.0);
    }
  };

  return (
    <div
      ref={stageRef}
      data-stage
      className={`${display.variable} ${mono.variable} overflow-hidden border-b border-[#2B2330]/10 px-4 py-14 first:pt-0 sm:px-6 md:-mx-8 md:w-[calc(100%+4rem)] md:px-0 md:py-24 lg:-mx-12 lg:w-[calc(100%+6rem)] xl:-mx-20 xl:w-[calc(100%+10rem)] 2xl:-mx-32 2xl:w-[calc(100%+16rem)]`}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-16 md:px-8 lg:px-12 xl:px-20 2xl:px-32">
        <div ref={parallaxTextRef} className="flex h-full flex-col justify-center">
          <h2
            data-reveal
            className="mb-8 max-w-[11ch] font-[family-name:var(--font-display)] text-[clamp(2.1rem,10vw,3rem)] font-semibold italic leading-[1.05] sm:mb-10 sm:max-w-none sm:text-4xl md:text-5xl"
            style={{
              backgroundImage: GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            We Don&rsquo;t Sell Products.
            <br />
            We Build Personalized
            <br />
            Skin Journeys.
          </h2>

          <div className="max-w-[38rem] space-y-5 font-[family-name:var(--font-mono)] text-[clamp(1rem,4.7vw,1.125rem)] leading-relaxed text-white/75 md:text-xl">
            <p data-reveal>Walk into most skincare stores.</p>
            <p data-reveal>
              Someone asks,
              <br />
              &ldquo;What&rsquo;s your skin type?&rdquo;
            </p>
            <p data-reveal>
              You answer,
              <br />
              &ldquo;Maybe oily&hellip; maybe dry&hellip;&rdquo;
            </p>
            <p data-reveal>Then buy product based on guess.</p>
            <p data-reveal ref={climaxRef} className="font-semibold text-white">
              At KYS, guessing ends.
            </p>
            <p data-reveal>
              We scientifically analyze your skin, identify its real condition, and recommend
              products designed specifically for your skin.
            </p>
            <p data-reveal className="italic">
              Because your skin deserves certainty, not assumptions.
            </p>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="order-first mx-auto w-full max-w-[min(100%,22rem)] select-none sm:max-w-sm md:order-last md:sticky md:top-28 md:mx-0 md:max-w-none"
        >
          <div ref={parallaxImageRef} className="flex h-full w-full flex-col items-stretch">
            <div className="relative h-[min(118vw,30rem)] min-h-[360px] w-full md:h-full md:min-h-[540px]">
              <div aria-hidden="true" className="h-full w-full">
                <div className="absolute inset-0 rounded-[28px] border border-[#2B2330]/10 bg-gradient-to-b from-[#FFFBF6]/70 to-[#FFFBF6]/15" />

                <div ref={bracketsRef} className="pointer-events-none absolute inset-5 opacity-40">
                  <span className="absolute left-0 top-0 h-5 w-5 rounded-tl-md border-l-2 border-t-2 border-[#8C5A82]" />
                  <span className="absolute right-0 top-0 h-5 w-5 rounded-tr-md border-r-2 border-t-2 border-[#8C5A82]" />
                  <span className="absolute bottom-0 left-0 h-5 w-5 rounded-bl-md border-b-2 border-l-2 border-[#8C5A82]" />
                  <span className="absolute bottom-0 right-0 h-5 w-5 rounded-br-md border-b-2 border-r-2 border-[#8C5A82]" />
                </div>

                <div
                  ref={glowRef}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[50px]"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(201,122,160,0.55) 0%, rgba(140,90,130,0.25) 45%, rgba(250,245,238,0) 75%)",
                  }}
                />

                <div
                  ref={flashRef}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255,251,246,0.95) 0%, rgba(255,251,246,0) 70%)",
                  }}
                />

                {/* clear-skin result, sits behind the scan layer and is revealed as it's clipped away */}
                <img
                  ref={clearFaceRef}
                  src="/clearskin.png"
                  alt=""
                  className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-[18px] object-cover sm:inset-5 sm:h-[calc(100%-2.5rem)] sm:w-[calc(100%-2.5rem)] sm:rounded-[20px]"
                />

                <img
                  ref={faceRef}
                  src="/facescan.png"
                  alt=""
                  className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-[18px] object-cover sm:inset-5 sm:h-[calc(100%-2.5rem)] sm:w-[calc(100%-2.5rem)] sm:rounded-[20px]"
                />

                <div
                  ref={scanTrackRef}
                  className="pointer-events-none absolute inset-4 overflow-hidden rounded-[18px] sm:inset-5 sm:rounded-[20px]"
                >
                  <div
                    ref={scanGlowRef}
                    className="absolute left-0 top-0 h-16 w-full opacity-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(201,122,160,0) 0%, rgba(201,122,160,0.4) 100%)",
                    }}
                  />
                  <div
                    ref={scanLineRef}
                    className="absolute left-0 top-0 h-[3px] w-full opacity-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, #C97AA0 15%, #FCEFE3 50%, #C97AA0 85%, transparent 100%)",
                      boxShadow: "0 0 18px 3px rgba(201,122,160,0.85)",
                    }}
                  />
                </div>

                <div ref={wordsWrapRef} className="pointer-events-none absolute inset-0">
                  {GUESS_WORDS.map((w) => (
                    <span
                      key={w.text}
                      data-guess-word
                      className="absolute font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[#2B2330]/70 sm:text-xs"
                      style={{ top: w.top, left: w.left }}
                    >
                      {w.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* reveal CTA — anchored low, on the chest, well clear of the face, with a warm
                  radial glow plus a small "live" ping badge so it reads as tappable at a glance */}
              <div className="pointer-events-none absolute inset-x-0 bottom-[10%] z-20 flex justify-center px-6">
                <div className="relative flex items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="absolute h-28 w-28 animate-pulse rounded-full blur-2xl sm:h-36 sm:w-36"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(250,239,227,0.9) 0%, rgba(201,122,160,0.55) 45%, rgba(201,122,160,0) 75%)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleReveal}
                    disabled={isAnimating}
                    className="pointer-events-auto relative flex min-h-12 max-w-[calc(100vw-5rem)] shrink-0 items-center justify-center gap-2 whitespace-normal rounded-full border-2 border-[#FFFBF6]/80 px-5 py-3 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase leading-tight tracking-[0.14em] text-[#FFFBF6] shadow-[0_10px_24px_-6px_rgba(62,31,61,0.55),0_0_36px_6px_rgba(233,185,204,0.6)] transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 sm:max-w-none sm:px-7 sm:py-3.5 sm:text-xs sm:tracking-[0.15em]"
                    style={{ backgroundImage: GRADIENT }}
                  >
                    {isAnimating ? "Scanning\u2026" : revealed ? "Scan Again" : "Reveal My Clear Skin"}
                    {!revealed && !isAnimating && (
                      <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
                        <span
                          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-80"
                          style={{ backgroundImage: GRADIENT }}
                        />
                        <span className="relative inline-flex h-3.5 w-3.5 rounded-full border border-[#8C5A82] bg-[#FFFBF6]" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
