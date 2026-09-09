"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import StarField from "./Starfield";

import BoxImg from "@/app/assets/Box.png";
import CalmElixirImg from "@/app/assets/calm-elixir.png";

export default function Hero() {
  const comp = useRef(null);
  const introLayerRef = useRef(null);
  const titleTextRef = useRef(null);
  const introElixirRef = useRef(null);
  
  const heroContentRef = useRef(null);
  const boardWrapperRef = useRef(null);
  const boardImgRef = useRef(null);
  const elixirRef = useRef(null);
  const shadowRef = useRef(null);

  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // Some browsers restore their previous scroll position after hydration.
    // Repeat the reset on the next frame so the intro always owns first paint.
    const scrollResetFrame = window.requestAnimationFrame(() => window.scrollTo(0, 0));

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ACCESSIBLE FALLBACK
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(introLayerRef.current, { display: "none" });
        gsap.set([heroContentRef.current, boardWrapperRef.current, boardImgRef.current], { opacity: 1, x: 0, y: 0 });
        gsap.set(elixirRef.current, { left: "74.5%", top: "52.3%", xPercent: -50, yPercent: -50, scale: 1, rotationZ: 0, opacity: 1 });
        gsap.set(shadowRef.current, { opacity: 0.6 });
        setIsAnimationComplete(true);
      });

      // MASTER CINEMATIC TIMELINE
      mm.add("(prefers-reduced-motion: no-preference)", (context) => {
        const isDesktop = window.innerWidth >= 1024;
        
        const tl = gsap.timeline({
          onComplete: () => setIsAnimationComplete(true),
        });

        if (isDesktop) {
          // =========================================================
          // DESKTOP TIMELINE (UNTOUCHED)
          // =========================================================
          gsap.set(heroContentRef.current, { opacity: 0, y: 30 });
          gsap.set(shadowRef.current, { opacity: 0 });
          
          gsap.set(boardWrapperRef.current, { x: "28vw", opacity: 0 });
          gsap.set(boardImgRef.current, { opacity: 0, scale: 0.95 });
          
          gsap.set(introLayerRef.current, { backgroundColor: "#0a0a0c" });
          gsap.set(titleTextRef.current, { scale: 1.5, opacity: 1, filter: "brightness(1.2)" });
          
          const initialElixirState = {
            scale: 2.2,
            rotationZ: -10,
            opacity: 0,
            filter: "drop-shadow(0px 30px 20px rgba(0,0,0,0.8))"
          };
          
          gsap.set(introElixirRef.current, { ...initialElixirState, y: 30 });
          gsap.set(elixirRef.current, { 
            ...initialElixirState, left: "50%", top: "50%", xPercent: -50, yPercent: -50 
          });

          tl.to({}, { duration: 0.55 })
            .to(titleTextRef.current, { scale: 0.55, opacity: 0, filter: "blur(8px)", duration: 0.55, ease: "power2.in" }, 0.55)
            .to(introElixirRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, 1.05)
            .to(introLayerRef.current, { backgroundColor: "rgba(10, 10, 12, 0)", duration: 0.45, ease: "power2.inOut" }, 1.75)
            .to(boardWrapperRef.current, { x: "-25vw", opacity: 1, duration: 0.7, ease: "power3.out" }, 2.05)
            .to(boardImgRef.current, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }, 2.05)
            .to(shadowRef.current, { opacity: 0.6, duration: 0.6 }, 2.05)
            .to(introElixirRef.current, { autoAlpha: 0, duration: 0.15 }, 2.75)
            .to(elixirRef.current, { autoAlpha: 1, duration: 0.15 }, 2.75)
            .to(elixirRef.current, {
              left: "74.5%", scale: 1, rotationZ: 0, filter: "drop-shadow(0px 6px 10px rgba(0,0,0,0.5))",
              duration: 0.8, ease: "power2.inOut"
            }, 2.9)
            .to(elixirRef.current, { top: "52.3%", duration: 0.8, ease: "back.out(1.1)" }, 2.9)
            .to(introLayerRef.current, { autoAlpha: 0, duration: 0.1 }, 3.05)
            .to(boardWrapperRef.current, { x: 0, duration: 0.7, ease: "power3.inOut" }, 3.85)
            .to(heroContentRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 4.25);

        } else {
          // =========================================================
          // MOBILE & TABLET TIMELINE
          // =========================================================
          // Calculate exact dynamic vertical offset needed to center the Box on mobile
          // since the text is stacked above it in the CSS Grid.
          gsap.set(heroContentRef.current, { opacity: 0, y: 20 });
          gsap.set(shadowRef.current, { opacity: 0 });
          
          gsap.set(boardWrapperRef.current, { x: "18vw", y: 0, opacity: 0 });
          gsap.set(boardImgRef.current, { opacity: 0, scale: 0.95 });
          
          gsap.set(introLayerRef.current, { backgroundColor: "#0a0a0c" });
          gsap.set(titleTextRef.current, { scale: 1.5, opacity: 1, filter: "brightness(1.2)" });
          
          const initialElixirState = {
            scale: 2.2,
            rotationZ: -10,
            opacity: 0,
            filter: "drop-shadow(0px 30px 20px rgba(0,0,0,0.8))"
          };
          
          gsap.set(introElixirRef.current, { ...initialElixirState, y: 30 });
          gsap.set(elixirRef.current, { 
            ...initialElixirState, left: "50%", top: "50%", xPercent: -50, yPercent: -50 
          });

          tl.to({}, { duration: 0.55 })
            .to(titleTextRef.current, { scale: 0.55, opacity: 0, filter: "blur(8px)", duration: 0.55, ease: "power2.in" }, 0.55)
            .to(introElixirRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, 1.05)
            .to(introLayerRef.current, { backgroundColor: "rgba(10, 10, 12, 0)", duration: 0.45, ease: "power2.inOut" }, 1.75)
            .to(boardWrapperRef.current, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 2.05)
            .to(boardImgRef.current, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }, 2.05)
            .to(shadowRef.current, { opacity: 0.6, duration: 0.6 }, 2.05)
            .to(introElixirRef.current, { autoAlpha: 0, duration: 0.15 }, 2.75)
            .to(elixirRef.current, { autoAlpha: 1, duration: 0.15 }, 2.75)
            .to(elixirRef.current, {
              left: "74.5%", scale: 1, rotationZ: 0, filter: "drop-shadow(0px 6px 10px rgba(0,0,0,0.5))",
              duration: 0.8, ease: "power2.inOut"
            }, 2.9)
            .to(elixirRef.current, { top: "52.3%", duration: 0.8, ease: "back.out(1.1)" }, 2.9)
            .to(introLayerRef.current, { autoAlpha: 0, duration: 0.1 }, 3.05)
            .to(heroContentRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 3.9);
        }
      });

      return () => mm.revert();
    }, comp);

    return () => {
      window.cancelAnimationFrame(scrollResetFrame);
      window.history.scrollRestoration = previousScrollRestoration;
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={comp}
      aria-labelledby="hero-title"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0c] px-6 pb-20 pt-24 sm:px-10"
    >
      {/* INTRO CINEMATIC LAYER */}
      <div
        ref={introLayerRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0c] pointer-events-none"
      >
        <h1
          ref={titleTextRef}
          className="absolute z-20 text-[18vw] font-black uppercase tracking-tighter bg-gradient-to-b from-[#ffffff] via-[#e2e2e5] to-[#71717a] bg-clip-text text-transparent select-none whitespace-nowrap leading-none"
        >
          NO TWO
        </h1>
        
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="relative w-full max-w-[760px] flex items-center justify-center">
            <div ref={introElixirRef} className="absolute w-[60%]">
              <Image
                src={CalmElixirImg}
                alt="Calm Elixir Intro"
                className="h-auto w-full object-contain select-none"
                draggable={false}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
        <StarField density={0.00008} />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-6 lg:gap-8 lg:grid-cols-[1fr_1.1fr] xl:max-w-[1500px] xl:grid-cols-[0.85fr_1.15fr]">
        
        {/* LEFT COMPOSITION: HERO TEXT */}
        <div ref={heroContentRef} className="max-w-xl z-20">
          <h1
            id="hero-title"
            className="text-4xl font-light tracking-tight text-[#f5f4ef] sm:text-5xl lg:text-6xl uppercase leading-[1.1]"
          >
            No two skins<br />
            read the same.<br />
            <span className="font-semibold text-[#f5f4ef]">
              Neither should<br />
              your routine.
            </span>
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed text-[#c4c4c6]/80 sm:text-lg">
            NO TWO reads your skin through AI and builds a routine around what it actually finds — not what everyone else is using.
          </p>

          <div className="mt-10">
            <button className="group relative overflow-hidden bg-[#f5f4ef] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0a0a0c] transition-all hover:bg-white">
              <span className="relative z-10">START YOUR SCAN</span>
              <span className="absolute inset-0 -translate-x-full bg-[#c4c4c6]/30 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </div>
        </div>

        {/* RIGHT COMPOSITION: PRODUCT SYSTEM */}
        <div className="relative flex h-auto w-full items-center justify-center z-10 mt-4 lg:mt-0 lg:h-[480px] xl:h-[580px]">
          
          <div ref={boardWrapperRef} className="relative w-full max-w-[760px] transform-style-3d">
            
            <div
              ref={shadowRef}
              className="absolute bottom-[2%] left-[10%] h-[30px] w-[80%] rounded-[100%] bg-black/90 blur-2xl pointer-events-none"
            />

            <Image
              ref={boardImgRef}
              src={BoxImg}
              alt="NO TWO System Board"
              className="relative z-10 h-auto w-full object-contain drop-shadow-2xl select-none"
              draggable={false}
              priority
            />

            {/* LOCKED FINAL POSITION */}
            <div
              ref={elixirRef}
              className="absolute z-20 w-[60%] pointer-events-none"
            >
              <Image
                src={CalmElixirImg}
                alt="Calm Elixir"
                className="h-auto w-full object-contain select-none"
                draggable={false}
                priority
              />
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
