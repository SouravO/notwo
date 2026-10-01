"use client";

import { useEffect, useRef, useId } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Same blob path as before, shared by the clip mask and the hairline outline
const BLOB_PATH =
  "M 1.0056 0.1606 C 1.1476 0.2960, 1.0364 0.5577, 0.7571 0.7451 C 0.4778 0.9326, 0.1365 0.9748, -0.0056 0.8394 C -0.1476 0.7040, -0.0364 0.4423, 0.2429 0.2549 C 0.5222 0.0674, 0.8635 0.0252, 1.0056 0.1606 Z";

// Fine film grain — gives the metallic background a tactile, printed feel
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

const CARDS = [
  {
    title: "Informed Skincare Decisions",
    body: "KYS exists to help people make informed skincare decisions through advanced skin diagnostics and personalized product recommendations.",
    position: "md:left-[8%] lg:left-[10%] md:top-[4%]",
  },
  {
    title: "Trusted Personalization",
    body: "To become India's most trusted personalized skincare company by combining technology, science, and skincare into one seamless experience.",
    position: "md:right-0 lg:right-2 md:top-[15%]",
  },
  {
    title: "Advanced Skin Analysis",
    body: "Our advanced skin analysis machine provides detailed insights about your skin health before any product recommendation.",
    position: "md:left-0 lg:left-2 md:bottom-[15%]",
  },
  {
    title: "No Assumptions. Only Science.",
    body: "Don't Guess. Know. Every skincare journey starts with one question. What does your skin actually need?",
    position: "md:right-[8%] lg:right-[10%] md:bottom-[7%]",
  },
];

export default function MissionVision() {
  const containerRef = useRef(null);
  const parallaxImgRef = useRef(null);

  const titleRef = useRef(null); 
  const titleWrapRef = useRef(null); 

  const rawId = useId();
  const maskId = `kys-mv-mask-${rawId.replace(/:/g, "")}`;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (parallaxImgRef.current && containerRef.current && !prefersReducedMotion) {
        gsap.fromTo(
          parallaxImgRef.current,
          { yPercent: -14, scale: 1.22 },
          {
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }

      const cards = gsap.utils.toArray("[data-floating-card]", containerRef.current);

      cards.forEach((card, index) => {
        const startY = 110 + index * 20;

        if (prefersReducedMotion) {
          gsap.set(card, { y: 0, yPercent: 0, opacity: 1 });
          return;
        }

        gsap.set(card, { y: startY, opacity: 0 });

        gsap.fromTo(
          card,
          { y: startY },
          {
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 62%",
              scrub: true,
            },
          }
        );

        // Cards emerge rather than just slide in
        gsap.fromTo(
          card,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 75%",
              scrub: true,
            },
          }
        );

        // Gentler drift than before (was -6 / 6)
        gsap.fromTo(
          card,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });

      // --- TITLE ENTRANCE ANIMATION ---
      if (titleWrapRef.current) {
        const growPairs = gsap.utils
          .toArray("[data-grow-outer]", titleWrapRef.current)
          .map((outer) => ({
            outer,
            inner: outer.querySelector("[data-grow-inner]"),
          }));

        if (prefersReducedMotion) {
          growPairs.forEach(({ outer, inner }) => {
            gsap.set(outer, { width: "auto" });
            gsap.set(inner, { opacity: 1 });
          });
        } else if (growPairs.length) {
          const outers = growPairs.map((p) => p.outer);
          const inners = growPairs.map((p) => p.inner);

          gsap.set(outers, { width: 0 });
          gsap.set(inners, { opacity: 0 });

          if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
              ScrollTrigger.refresh();
            });
          }

          let expanded = false;

          const playTitleExpand = () => {
            if (expanded) return;
            expanded = true;

            // Measure strictly before animating using exact fractional values
            // to avoid ANY pixel snapping or jumping during transition.
            growPairs.forEach((pair) => {
              gsap.set(pair.outer, { width: "auto" });
              // Sub-pixel accuracy prevents layout shift
              pair.naturalWidth = pair.inner.getBoundingClientRect().width;
              gsap.set(pair.outer, { width: 0 });
            });

            const tl = gsap.timeline();

            // 1) SPREAD: Expand the gaps smoothly with zero transforms to the text geometry
            tl.to(
              outers,
              {
                width: (i) => growPairs[i].naturalWidth,
                duration: 1.2,
                ease: "power3.inOut",
                stagger: 0.08,
              },
              0
            );

            // 2) FILL: Pure opacity fade-in. No X/Y/Scale applied. 
            // The expansion of the outer wrapper natively creates the "wipe/reveal" effect.
            tl.fromTo(
              inners,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.08,
              },
              0.35 // Starts fading just as the space opens up
            );

            // 3) CLEANUP: Safely release layout constraints
            tl.set(outers, { width: "auto", overflow: "visible" });
          };

          const st = ScrollTrigger.create({
            trigger: titleRef.current,
            start: "center center",
            once: true,
            onEnter: playTitleExpand,
          });

          if (st.progress > 0 || st.isActive) {
            playTitleExpand();
          }
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className={`relative left-1/2 min-h-screen w-screen -translate-x-1/2 scroll-mt-24 overflow-hidden bg-[linear-gradient(135deg,#34373b_0%,#74797f_24%,#b6bbc0_48%,#70757b_72%,#393c40_100%)] px-4 pt-0 pb-10 text-[#1C1C1A] sm:px-8 lg:px-16 lg:pb-16`}
    >
      {/* Soft studio light pooled behind the image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_58%,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0)_70%)]"
      />
      {/* Film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.16] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="max-w-7xl mx-auto relative z-10 mb-1 lg:mb-2 pt-14 sm:pt-16 lg:pt-24">
        <div className="relative flex flex-col items-center text-center">
          <h1
            ref={titleRef}
            className="font-serif text-4xl font-semibold italic leading-[1.08] tracking-[-0.05em] sm:text-6xl lg:text-7xl"
          >
            {/* 
              CRITICAL STRUCTURAL FIX: 
              Using 'inline-flex items-baseline' natively locks the baseline of ALL child elements, 
              preventing 'overflow-hidden' from shifting the text vertically. 
            */}
            <span
              ref={titleWrapRef}
              className="inline-flex items-baseline whitespace-nowrap bg-gradient-to-r from-[#111315] via-[#3e4349] to-[#16181a] bg-clip-text text-transparent"
            >
              <span>K</span>
              <span data-grow-outer className="inline-flex overflow-hidden">
                <span data-grow-inner className="whitespace-nowrap bg-gradient-to-r from-[#111315] via-[#3e4349] to-[#16181a] bg-clip-text text-transparent">{"NOW\u00a0"}</span>
              </span>
              <span>Y</span>
              <span data-grow-outer className="inline-flex overflow-hidden">
                <span data-grow-inner className="whitespace-nowrap bg-gradient-to-r from-[#111315] via-[#3e4349] to-[#16181a] bg-clip-text text-transparent">{"OUR\u00a0"}</span>
              </span>
              <span>S</span>
              <span data-grow-outer className="inline-flex overflow-hidden">
                <span data-grow-inner className="whitespace-nowrap bg-gradient-to-r from-[#111315] via-[#3e4349] to-[#16181a] bg-clip-text text-transparent">KIN</span>
              </span>
            </span>
            <br />
            <span className="mt-2 block font-serif text-3xl font-semibold italic leading-[1.12] text-[#1C1C1A]/90 sm:text-5xl lg:text-6xl">
              before you treat it.
            </span>
          </h1>

          <p className="mt-6 max-w-lg mx-auto font-sans text-sm leading-relaxed text-[#1C1C1A]/75 sm:text-base">
            Modern skincare has become confusing. Thousands of products, thousands of ingredients, and thousands of opinions. But only one thing truly matters: understanding your skin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative min-h-[660px] lg:min-h-[760px] flex items-center justify-center">
        <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden="true">
          <defs>
            <clipPath id={maskId} clipPathUnits="objectBoundingBox">
              <path d={BLOB_PATH} />
            </clipPath>
          </defs>
        </svg>

        {/* Image frame: hairline outline + shadow layer + clipped image */}
        <div className="absolute left-1/2 top-1/2 z-0 aspect-[4/5] w-[82%] -translate-x-1/2 -translate-y-1/2 sm:w-[65%] lg:w-[48%]">
          {/* Offset hairline echoing the blob shape */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            style={{ transform: "scale(1.06)" }}
          >
            <path
              d={BLOB_PATH}
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* drop-shadow lives on a parent of the clipped element so clip-path doesn't cut it off */}
          <div className="absolute inset-0 drop-shadow-[0_32px_44px_rgba(20,22,25,0.32)]">
            <div className="absolute inset-0 bg-[#EFEDDE]" style={{ clipPath: `url(#${maskId})` }}>
              <div
                ref={parallaxImgRef}
                className="absolute inset-0 h-[134%] w-full -top-[17%] bg-cover bg-center"
                style={{
                  backgroundImage: `url('/Parallax.png')`,
                }}
              />
              {/* Gentle tonal grade so the photo sits inside the metallic palette */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_35%,rgba(10,12,14,0.22)_100%)]" />
            </div>
          </div>
        </div>

        <div className="relative z-10 flex w-full flex-col gap-5 py-6 md:contents">
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              data-floating-card
              className={`w-full z-10 md:absolute ${card.position} md:w-auto md:max-w-[16.5rem] lg:max-w-[18.5rem] rounded-[1.5rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(239,237,222,0.94)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_6px_-2px_rgba(0,0,0,0.10),0_26px_50px_-28px_rgba(0,0,0,0.45)] backdrop-blur-md transition-shadow duration-500 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_6px_-2px_rgba(0,0,0,0.12),0_30px_56px_-28px_rgba(0,0,0,0.55)] sm:p-5`}
            >
              <div className="mb-3 flex items-center gap-3" aria-hidden="true">
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#1C1C1A]/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-[#1C1C1A]/15" />
              </div>
              <h2 className="mb-2 font-serif text-[clamp(1.3rem,1.6vw,1.75rem)] font-semibold italic leading-[1.05] tracking-[-0.01em] text-[#1C1C1A]">
                {card.title}
              </h2>
              <p className="font-sans text-[13px] leading-[1.7] text-[#1C1C1A]/70">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}