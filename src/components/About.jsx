"use client";

import { useEffect, useRef, useId } from "react";
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
          gsap.set(card, { y: 0, yPercent: 0 });
          return;
        }

        gsap.set(card, { y: startY });

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

        gsap.fromTo(
          card,
          { yPercent: -6 },
          {
            yPercent: 6,
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
      ref={containerRef}
      className={`${display.variable} ${mono.variable} relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(135deg,#34373b_0%,#74797f_24%,#b6bbc0_48%,#70757b_72%,#393c40_100%)] px-4 pt-0 pb-10 text-[#17191c] sm:px-8 lg:px-16 lg:pb-16`}
    >
      <div className="max-w-7xl mx-auto relative z-10 mb-1 lg:mb-2 pt-14 sm:pt-16 lg:pt-24">
        <div className="relative flex flex-col items-center text-center">
          <h1
            ref={titleRef}
            className="font-[family-name:var(--font-display)] text-4xl font-semibold italic leading-[1.08] tracking-[-0.05em] sm:text-6xl lg:text-7xl"
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
                <span data-grow-inner className="whitespace-nowrap bg-gradient-to-r from-[#111315] via-[#3e4349] to-[#16181a] bg-clip-text text-transparent">NOW </span>
              </span>
              <span>Y</span>
              <span data-grow-outer className="inline-flex overflow-hidden">
                <span data-grow-inner className="whitespace-nowrap bg-gradient-to-r from-[#111315] via-[#3e4349] to-[#16181a] bg-clip-text text-transparent">OUR </span>
              </span>
              <span>S</span>
              <span data-grow-outer className="inline-flex overflow-hidden">
                <span data-grow-inner className="whitespace-nowrap bg-gradient-to-r from-[#111315] via-[#3e4349] to-[#16181a] bg-clip-text text-transparent">KIN</span>
              </span>
            </span>
            <br />
            <span className="mt-2 block font-[family-name:var(--font-display)] text-3xl font-semibold italic leading-[1.12] text-[#17191c]/90 sm:text-5xl lg:text-6xl">
              before you treat it.
            </span>
          </h1>

          <p className="mt-6 max-w-lg mx-auto font-[family-name:var(--font-mono)] text-sm leading-relaxed text-[#17191c]/75 sm:text-base">
            Modern skincare has become confusing. Thousands of products, thousands of ingredients, and thousands of opinions. But only one thing truly matters: understanding your skin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative min-h-[660px] lg:min-h-[760px] flex items-center justify-center">
        <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden="true">
          <defs>
            <clipPath id={maskId} clipPathUnits="objectBoundingBox">
              <path d="M 1.0056 0.1606 C 1.1476 0.2960, 1.0364 0.5577, 0.7571 0.7451 C 0.4778 0.9326, 0.1365 0.9748, -0.0056 0.8394 C -0.1476 0.7040, -0.0364 0.4423, 0.2429 0.2549 C 0.5222 0.0674, 0.8635 0.0252, 1.0056 0.1606 Z" />
            </clipPath>
          </defs>
        </svg>

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[82%] sm:w-[65%] lg:w-[48%] aspect-[4/5] z-0 bg-[#F7F5EC] drop-shadow-[0_22px_38px_rgba(34,34,32,0.28)]"
          style={{ clipPath: `url(#${maskId})` }}
        >
          <div
            ref={parallaxImgRef}
            className="absolute inset-0 h-[134%] w-full -top-[17%] bg-cover bg-center"
            style={{
              backgroundImage: `url('/parallax.png')`,
            }}
          />
        </div>

        <div className="relative z-10 flex w-full flex-col gap-5 py-6 md:contents">
          <div
            data-floating-card
            className="w-full z-10 md:absolute md:left-[8%] lg:left-[10%] md:top-[4%] md:w-auto md:max-w-[16.5rem] lg:max-w-[18.5rem] rounded-[1.5rem] border border-[#B2BEDE]/30 bg-[linear-gradient(180deg,#FFFFFF_0%,#F2F0E4_100%)] p-3.5 shadow-[0_18px_40px_-25px_rgba(0,0,0,0.28)] backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_22px_45px_-25px_rgba(0,0,0,0.4)] sm:p-4"
          >
            <span className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.22em] text-[#EB583D]">
              Our Mission
            </span>
            <h2 className="mb-2 font-[family-name:var(--font-display)] text-[clamp(1.3rem,1.6vw,1.75rem)] font-semibold italic leading-[1.05] text-[#222220]">
              Informed Skincare Decisions
            </h2>
            <p className="font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-[#222220]/70">
              KYS exists to help people make informed skincare decisions through advanced skin diagnostics and personalized product recommendations.
            </p>
          </div>

          <div
            data-floating-card
            className="w-full z-10 md:absolute md:right-0 lg:right-2 md:top-[15%] md:w-auto md:max-w-[16.5rem] lg:max-w-[18.5rem] rounded-[1.5rem] border border-[#B2BEDE]/30 bg-[linear-gradient(180deg,#FFFFFF_0%,#F2F0E4_100%)] p-3.5 shadow-[0_18px_40px_-25px_rgba(0,0,0,0.28)] backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_22px_45px_-25px_rgba(0,0,0,0.4)] sm:p-4"
          >
            <span className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.22em] text-[#EB583D]">
              Our Vision
            </span>
            <h2 className="mb-2 font-[family-name:var(--font-display)] text-[clamp(1.3rem,1.6vw,1.75rem)] font-semibold italic leading-[1.05] text-[#222220]">
              Trusted Personalization
            </h2>
            <p className="font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-[#222220]/70">
              To become India’s most trusted personalized skincare company by combining technology, science, and skincare into one seamless experience.
            </p>
          </div>

          <div
            data-floating-card
            className="w-full z-10 md:absolute md:left-0 lg:left-2 md:bottom-[15%] md:w-auto md:max-w-[16.5rem] lg:max-w-[18.5rem] rounded-[1.5rem] border border-[#B2BEDE]/30 bg-[linear-gradient(180deg,#FFFFFF_0%,#F2F0E4_100%)] p-3.5 shadow-[0_18px_40px_-25px_rgba(0,0,0,0.28)] backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_22px_45px_-25px_rgba(0,0,0,0.4)] sm:p-4"
          >
            <span className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.22em] text-[#EB583D]">
              Advanced Diagnostics
            </span>
            <h2 className="mb-2 font-[family-name:var(--font-display)] text-[clamp(1.3rem,1.6vw,1.75rem)] font-semibold italic leading-[1.05] text-[#222220]">
              Advanced Skin Analysis
            </h2>
            <p className="font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-[#222220]/70">
              Our advanced skin analysis machine provides detailed insights about your skin health before any product recommendation.
            </p>
          </div>

          <div
            data-floating-card
            className="w-full z-10 md:absolute md:right-[8%] lg:right-[10%] md:bottom-[7%] md:w-auto md:max-w-[16.5rem] lg:max-w-[18.5rem] rounded-[1.5rem] border border-[#B2BEDE]/30 bg-[linear-gradient(180deg,#FFFFFF_0%,#F2F0E4_100%)] p-3.5 shadow-[0_18px_40px_-25px_rgba(0,0,0,0.28)] backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_22px_45px_-25px_rgba(0,0,0,0.4)] sm:p-4"
          >
            <span className="mb-2 block font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase tracking-[0.22em] text-[#EB583D]">
              Our Science
            </span>
            <h2 className="mb-2 font-[family-name:var(--font-display)] text-[clamp(1.3rem,1.6vw,1.75rem)] font-semibold italic leading-[1.05] text-[#222220]">
              No Assumptions. Only Science.
            </h2>
            <p className="font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-[#222220]/70">
              Don’t Guess. Know. Every skincare journey starts with one fundamental question: What does your skin actually need?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}