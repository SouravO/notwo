"use client";

import { forwardRef, useLayoutEffect, useRef } from "react";
import { Bodoni_Moda, Space_Grotesk } from "next/font/google";
import Image from "next/image";
import gsap from "gsap";

const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const mono = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

// Reduced to 4 premium cards, added specific image fields
const WHY_CHOOSE = [
  {
    id: "01",
    title: "Personalized Approach",
    copy: "Every recommendation is meticulously crafted based on your unique skin analysis, ensuring a routine that truly belongs to you.",
    img: "/feature-1.png", // Replace with your card image path
    accent: "#8C5A82",
  },
  {
    id: "02",
    title: "Scientific Assessment",
    copy: "We replace guesswork with advanced diagnostic technology, analyzing your skin's deep moisture levels, elasticity, and needs.",
    img: "/feature-2.png", // Replace with your card image path
    accent: "#A45F86",
  },
  {
    id: "03",
    title: "Premium Formulations",
    copy: "Carefully selected, highly active ingredients backed by clinical research to deliver visible, long-lasting results.",
    img: "/feature-3.png", // Replace with your card image path
    accent: "#E9B9CC",
  },
  {
    id: "04",
    title: "Progress Tracking",
    copy: "Monitor your skin's transformation over time. Compare reports and adjust your routine as your skin improves.",
    img: "/feature-4.png", // Replace with your card image path
    accent: "#C97AA0",
  },
];

const INTRO_HOLD = 0.02;
const EXIT_RELEASE = 0.15;
// Adjusted total scroll height for 4 cards
const SECTION_SCROLL_VH = WHY_CHOOSE.length * 0.35 + 1.0; 
const ANIMATION_SCROLL_VH = SECTION_SCROLL_VH - 1;
const SECTION_HEIGHT = `${SECTION_SCROLL_VH * 100}dvh`;

const WhyCard = forwardRef(function WhyCard({ item, index, variant = "stack" }, ref) {
  const { id, title, copy, img, accent } = item;
  const isEven = index % 2 === 0;

  const shape =
    variant === "stack"
      ? "absolute inset-0 m-auto h-[65dvh] w-[90vw] max-w-[1000px]"
      : "relative mx-auto h-auto min-h-[400px] w-full max-w-4xl";

  return (
    <div
      ref={ref}
      className={`${shape} flex flex-col overflow-hidden rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(30,20,45,0.25)] border border-white/40 md:flex-row ${
        !isEven ? "md:flex-row-reverse" : ""
      } bg-white/60 backdrop-blur-2xl`}
      style={{
        willChange: variant === "stack" ? "transform, opacity" : undefined,
      }}
    >
      {/* Image Section */}
      <div className="relative h-[40%] w-full md:h-full md:w-1/2">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 768px) 90vw, 50vw"
        />
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-16">
        <div className="flex items-center gap-4 text-[#2B2330]/60">
          <span className="font-[family-name:var(--font-mono)] text-xl tracking-wider">
            {id}
          </span>
          <span
            className="h-[1px] w-12"
            style={{ backgroundColor: accent }}
          />
        </div>
        
        <h3 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-medium leading-[1.1] text-[#2B2330] sm:text-4xl md:text-5xl">
          {title}
        </h3>
        
        <p className="mt-6 text-base leading-relaxed text-[#2B2330]/80 sm:text-lg">
          {copy}
        </p>
      </div>
    </div>
  );
});

function WhyChooseStack() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const dotRefs = useRef([]);
  const activeIndexRef = useRef(0);

  useLayoutEffect(() => {
    let frame = 0;
    let cleanup = () => {};

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean);
      if (!cards.length) return;

      // Initial Setup
      cards.forEach((card, i) => {
        gsap.set(card, {
          yPercent: 150,
          scale: 0.9,
          opacity: 0,
          rotation: i % 2 === 0 ? -4 : 4,
          xPercent: i % 2 === 0 ? -5 : 5,
          zIndex: i + 1,
          transformOrigin: "50% 100%",
        });
      });

      const updateCards = (progress) => {
        const cardProgress = gsap.utils.clamp(0, 1, (progress - INTRO_HOLD) / (1 - INTRO_HOLD - EXIT_RELEASE));
        const activeIdx = Math.min(cards.length - 1, Math.max(0, Math.floor(cardProgress * cards.length)));

        cards.forEach((card, i) => {
          const local = gsap.utils.clamp(0, 1, cardProgress * cards.length - i);
          const eased = gsap.parseEase("power3.out")(local);
          const depth = Math.max(0, activeIdx - i);
          const entered = local > 0;

          // As cards get pushed back, they stagger upward and scale down
          gsap.set(card, {
            yPercent: entered ? -8 * depth + (1 - eased) * 150 : 150,
            xPercent: entered ? (depth > 0 ? (i % 2 === 0 ? -2 : 2) : 0) : (i % 2 === 0 ? -5 : 5),
            scale: entered ? Math.max(0.85, 1 - 0.05 * depth) : 0.9,
            opacity: entered ? Math.max(0.3, 1 - 0.2 * depth) : 0,
            rotation: entered ? (depth > 0 ? (i % 2 === 0 ? -2 : 2) : 0) : i % 2 === 0 ? -4 : 4,
          });
        });

        if (activeIdx !== activeIndexRef.current) {
          activeIndexRef.current = activeIdx;
          dotRefs.current.forEach((dot, i) => {
            if (!dot) return;
            dot.style.opacity = i === activeIdx ? "1" : "0.35";
            dot.style.transform = i === activeIdx ? "scaleY(1)" : "scaleY(0.6)";
          });
        }
      };

      const readProgress = () => {
        if (!sectionRef.current) return 0;
        const sectionTop = sectionRef.current.getBoundingClientRect().top;
        const animationDuration = window.innerHeight * ANIMATION_SCROLL_VH;
        const scrollDistance = -sectionTop;
        const progress = scrollDistance / animationDuration;
        return gsap.utils.clamp(0, 1, progress);
      };

      const requestUpdate = () => {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          updateCards(readProgress());
        });
      };

      requestUpdate();
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);

      cleanup = () => {
        window.removeEventListener("scroll", requestUpdate);
        window.removeEventListener("resize", requestUpdate);
        if (frame) window.cancelAnimationFrame(frame);
      };
    }, sectionRef);

    let cancelled = false;
    document.fonts?.ready?.then(() => {
      if (!cancelled) window.dispatchEvent(new Event("resize"));
    });

    return () => {
      cancelled = true;
      cleanup();
      ctx.revert();
    };
  }, []);

  return (
    <section id="products" className={`${display.variable} ${mono.variable} relative isolate w-full bg-[#FAF5EE] pb-[10dvh]`}>
      <div ref={sectionRef} className="relative w-full motion-reduce:h-auto" style={{ height: SECTION_HEIGHT }}>
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden motion-reduce:h-auto motion-reduce:sticky motion-reduce:top-auto motion-reduce:overflow-visible">
          
          {/* Main Background Image */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <Image
              src="/skin.jpg"
              alt="Background"
              aria-hidden="true"
              className="h-full w-full object-cover object-center"
              fill
              sizes="100vw"
            />
          </div>

          {/* Gentle overlay so the image isn't too harsh against the glass cards */}
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(180deg, rgba(250,245,238,0.2) 0%, rgba(250,245,238,0.05) 50%, rgba(250,245,238,0.3) 100%)",
            }}
          />

          {/* Progress Indicators */}
          <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 sm:right-10 md:flex">
            {WHY_CHOOSE.map((s, i) => (
              <span
                key={s.id}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className="h-10 w-[2px] origin-bottom bg-[#2B2330] transition-[opacity,transform] duration-500 ease-out"
                style={{ opacity: i === 0 ? 1 : 0.35, transform: i === 0 ? "scaleY(1)" : "scaleY(0.6)" }}
              />
            ))}
          </div>

          {/* Cards Container */}
          <div className="relative z-50 h-full w-full pointer-events-auto">
            {WHY_CHOOSE.map((item, i) => (
              <WhyCard
                key={item.id}
                index={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                item={item}
              />
            ))}
          </div>
        </div>

        {/* Fallback for motion reduced preferences */}
        <div className="hidden flex-col gap-12 bg-[#FAF5EE] px-4 py-16 motion-reduce:flex sm:py-24">
          {WHY_CHOOSE.map((item, i) => (
            <WhyCard key={item.id} index={i} item={item} variant="static" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseStack;