"use client";

import { useEffect, useRef } from "react";
import { Bodoni_Moda, Space_Grotesk } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const mono = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export default function Services() {
  const containerRef = useRef(null);
  const pinRef = useRef(null);
  const textContainerRef = useRef(null);
  const badgeRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!containerRef.current || !textContainerRef.current) return;

        const words = textContainerRef.current.querySelectorAll(".scroll-word");
        const subtext = textContainerRef.current.querySelector(".scroll-subtext");
        const line = textContainerRef.current.querySelector(".accent-line");

        // Continuous slow rotation for decorative badge
        gsap.to(badgeRef.current, {
          rotate: 360,
          duration: 20,
          repeat: -1,
          ease: "none",
        });

        // Parallax ambient fluid movement
        gsap.to(orb1Ref.current, {
          y: -80,
          x: 40,
          scale: 1.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        gsap.to(orb2Ref.current, {
          y: 80,
          x: -40,
          scale: 1.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });

        // Scroll-pinned text illumination timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        // Sequentially illuminate each word/phrase on scroll
        tl.to(words, {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          stagger: 0.15,
          ease: "power2.out",
        })
          .to(line, {
            scaleX: 1,
            duration: 0.4,
            ease: "power3.inOut",
          }, "-=0.2")
          .to(subtext, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          }, "-=0.1");
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".scroll-word, .scroll-subtext", { opacity: 1, filter: "none", y: 0 });
        gsap.set(".accent-line", { scaleX: 1 });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={`${display.variable} ${mono.variable} w-full bg-[#E3E6E8]`}>
      <section
        ref={containerRef}
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#FAFBFC_0%,#D2D7DB_28%,#FFFFFF_50%,#BEC5CA_72%,#EEF1F3_100%)]"
      >
        {/* Animated Fluid Ambient Glow Orbs */}
        <div
          ref={orb1Ref}
          className="pointer-events-none absolute -left-20 top-1/4 h-[350px] w-[350px] rounded-full bg-gradient-to-tr from-white/80 to-[#8E989F]/25 blur-3xl md:h-[500px] md:w-[500px]"
        />
        <div
          ref={orb2Ref}
          className="pointer-events-none absolute -right-20 bottom-1/4 h-[380px] w-[380px] rounded-full bg-gradient-to-br from-[#758089]/25 to-white/35 blur-3xl md:h-[550px] md:w-[550px]"
        />

        {/* Subtle Luxury Grid Overlay */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#20252A 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Rotating Editorial Seal/Badge */}
        <div className="absolute right-8 top-12 z-10 hidden sm:block md:right-16 md:top-16">
          <div ref={badgeRef} className="relative flex h-24 w-24 items-center justify-center">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <path
                id="textPath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text className="fill-[#20252A]/60 font-[family-name:var(--font-mono)] text-[9.5px] tracking-[2.8px] uppercase">
                <textPath href="#textPath">
                  • Pure Honesty • Skin First • BareLogic
                </textPath>
              </text>
            </svg>
            <div className="absolute h-2 w-2 rounded-full bg-[#59636B]" />
          </div>
        </div>

        {/* Main Content Area */}
        <div
          ref={textContainerRef}
          className="relative z-10 flex max-w-5xl flex-col items-center px-6 text-center md:px-12"
        >
          {/* Eyebrow Tag */}
          <div className="mb-8 flex items-center gap-3">
            <span className="h-[1px] w-8 bg-[#59636B]" />
            <span className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.25em] text-[#475159]">
              Our Uncompromised Promise
            </span>
            <span className="h-[1px] w-8 bg-[#59636B]" />
          </div>

          {/* Kinetic Headline with Word-by-Word Scroll Reveal */}
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium leading-[1.25] text-[#171B1F] sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="scroll-word inline-block translate-y-4 opacity-15 blur-[4px] transition-all">
              We promise to
            </span>{" "}
            <span className="scroll-word inline-block translate-y-4 opacity-15 blur-[4px] transition-all italic font-normal text-[#3E4850]">
              recommend only
            </span>{" "}
            <br className="hidden sm:inline" />
            <span className="scroll-word inline-block translate-y-4 opacity-15 blur-[4px] transition-all">
              what your skin
            </span>{" "}
            <span className="scroll-word inline-block translate-y-4 opacity-15 blur-[4px] transition-all underline decoration-[#78838A] decoration-wavy decoration-1 underline-offset-8">
              truly needs.
            </span>
          </h2>

          {/* Bold Impact Phrases */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-[family-name:var(--font-display)] text-2xl italic sm:mt-12 sm:text-4xl md:text-5xl">
            <span className="scroll-word inline-block translate-y-4 opacity-15 blur-[4px] transition-all text-[#52606A]">
              Nothing more.
            </span>
            <span className="scroll-word inline-block translate-y-4 opacity-15 blur-[4px] transition-all text-[#171B1F]/45 font-light">
              —
            </span>
            <span className="scroll-word inline-block translate-y-4 opacity-15 blur-[4px] transition-all text-[#171B1F]">
              Nothing less.
            </span>
          </div>

          {/* Expanding Decorative Separator Line */}
          <div className="accent-line my-10 h-[1.5px] w-24 origin-center scale-x-0 bg-gradient-to-r from-transparent via-[#59636B] to-transparent sm:my-12 sm:w-36" />

          {/* Subtext */}
          <p className="scroll-subtext max-w-md translate-y-4 font-[family-name:var(--font-mono)] text-sm tracking-wide text-[#283038]/80 opacity-0 sm:text-base">
            Because genuine care begins with uncompromised honesty.
          </p>
        </div>
      </section>
    </div>
  );
}
