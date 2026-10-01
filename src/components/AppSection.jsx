"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Replace with the real Google Play listing URL when it is ready.
const PLAY_STORE_URL = "YOUR_PLAY_STORE_URL";
const IS_PLACEHOLDER_URL = PLAY_STORE_URL === "YOUR_PLAY_STORE_URL";

const HEADING_FONT = "var(--font-editorial)";
const BODY_FONT = "var(--font-utility)";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const FEATURES = [
  {
    number: "01",
    title: "ANALYSE",
    description: "Understand your skin through intelligent skin analysis.",
  },
  {
    number: "02",
    title: "UNDERSTAND",
    description: "See what your skin needs with clear, meaningful insights.",
  },
  {
    number: "03",
    title: "PERSONALISE",
    description:
      "Build a skincare routine based on your individual skin needs.",
  },
];

const AppSection = () => {
  const sectionRef = useRef(null);
  const parallaxRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Reveal once when the section enters the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      const revealFrame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(revealFrame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Very gentle scroll-linked drift on the phone image (no looping motion).
  useEffect(() => {
    const section = sectionRef.current;
    const target = parallaxRef.current;
    if (!section || !target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = null;

    const update = () => {
      frame = null;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = Math.min(
        1,
        Math.max(0, (vh - rect.top) / (vh + rect.height))
      );
      const amplitude = window.innerWidth >= 1024 ? 44 : 18;
      const offset = (0.5 - progress) * amplitude;
      target.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  // Soft fade (optionally with a short rise) with a stagger delay.
  const reveal = (delay = 0, hidden = "opacity-0") => ({
    className: `transition-[opacity,transform] duration-[1000ms] ${EASE} motion-reduce:transition-none ${
      visible ? "opacity-100 translate-y-0" : hidden
    }`,
    style: { transitionDelay: visible ? `${delay}ms` : "0ms" },
  });

  const handlePlayClick = (e) => {
    if (IS_PLACEHOLDER_URL) e.preventDefault();
  };

  const sub = reveal(350);
  const cta = reveal(900);
  const visual = reveal(200, "opacity-0 translate-y-10");

  // Heading lines rise out of a mask — the one orchestrated moment.
  const headingLine = (text, delay) => (
    <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
      <span
        className={`block transition-transform duration-[1200ms] ${EASE} motion-reduce:transition-none ${
          visible ? "translate-y-0" : "translate-y-[110%]"
        }`}
        style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      >
        {text}
      </span>
    </span>
  );

  return (
    <section
      ref={sectionRef}
      id="app"
      aria-labelledby="app-section-heading"
      className="relative w-full bg-[#EFEDDE] text-[#1C1C1A]"
      style={{ overflowX: "clip", fontFamily: BODY_FONT }}
    >
      {/* Soft atmospheric light — decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 12% 0%, rgba(176,190,225,0.16) 0%, rgba(176,190,225,0) 70%)",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-14 px-6 py-20 md:px-10 md:py-28 lg:min-h-[min(100svh,960px)] lg:grid-cols-12 lg:gap-6 lg:px-16 lg:py-32">
        {/* Left: typography, features, CTA */}
        <div className="relative z-10 lg:col-span-5">
          <h2
            id="app-section-heading"
            className="text-[clamp(2.5rem,10.5vw,5rem)] font-normal uppercase leading-[0.94] tracking-[-0.04em] text-[#1C1C1A] lg:text-[clamp(3.25rem,5vw,5.25rem)]"
            style={{ fontFamily: HEADING_FONT }}
          >
            {headingLine("Your skin,", 0)}
            {headingLine("understood.", 140)}
          </h2>

          <div className={`mt-9 max-w-[32rem] ${sub.className}`} style={sub.style}>
            <p
              className="text-[1.2rem] leading-snug text-[#1C1C1A] md:text-[1.35rem]"
              style={{ fontFamily: BODY_FONT }}
            >
              Technology that understands your skin.
            </p>
            <p
              className="mt-3 text-[0.98rem] leading-relaxed text-[#1C1C1A]/65"
              style={{ fontFamily: BODY_FONT }}
            >
              Analyse your skin, understand what it needs, and discover
              personalized skincare guidance designed around you.
            </p>
          </div>

          <ol className="mt-12 grid grid-cols-1 md:grid-cols-3 md:gap-8 lg:grid-cols-1 lg:gap-0">
            {FEATURES.map((item, i) => (
              <li
                key={item.number}
                className="relative grid grid-cols-[2.5rem_1fr] items-baseline py-5 md:grid-cols-1 md:pt-6 lg:grid-cols-[2.75rem_9.25rem_1fr] lg:py-6"
              >
                {/* Hairline draws in from the left */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-0 h-px w-full origin-left bg-[#1C1C1A]/20 transition-transform duration-[1200ms] ${EASE} motion-reduce:transition-none ${
                    visible ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{
                    transitionDelay: visible ? `${520 + i * 120}ms` : "0ms",
                  }}
                />
                <span
                  className={`text-[0.78rem] font-medium tracking-[0.16em] text-[#16336F] transition-opacity duration-[900ms] motion-reduce:transition-none md:mb-3 lg:mb-0 ${
                    visible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    fontFamily: BODY_FONT,
                    transitionDelay: visible ? `${620 + i * 120}ms` : "0ms",
                  }}
                >
                  {item.number}
                </span>
                <h3
                  className={`text-[0.92rem] font-medium tracking-[0.16em] text-[#1C1C1A] transition-opacity duration-[900ms] motion-reduce:transition-none ${
                    visible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    fontFamily: HEADING_FONT,
                    transitionDelay: visible ? `${660 + i * 120}ms` : "0ms",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className={`col-start-2 mt-2 max-w-[24rem] text-[0.95rem] leading-relaxed text-[#1C1C1A]/65 transition-opacity duration-[900ms] motion-reduce:transition-none md:col-start-1 lg:col-start-3 lg:row-start-1 lg:mt-0 ${
                    visible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    fontFamily: BODY_FONT,
                    transitionDelay: visible ? `${700 + i * 120}ms` : "0ms",
                  }}
                >
                  {item.description}
                </p>
              </li>
            ))}
          </ol>

          <div className={`relative mt-10 ${cta.className}`} style={cta.style}>
            <a
              href={IS_PLACEHOLDER_URL ? "#" : PLAY_STORE_URL}
              onClick={handlePlayClick}
              target={IS_PLACEHOLDER_URL ? undefined : "_blank"}
              rel={IS_PLACEHOLDER_URL ? undefined : "noopener noreferrer"}
              aria-label="Get the NO TWO app on Google Play"
              className="group inline-flex items-center gap-4 rounded-full bg-[#16336F] py-2 pl-2 pr-8 text-[0.8rem] font-medium tracking-[0.2em] text-[#EFEDDE] transition-colors duration-300 hover:bg-[#1C1C1A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16336F]"
              style={{ fontFamily: BODY_FONT }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFEDDE]">
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-[2px]"
                >
                  <path d="M2.5 1.5L12 7L2.5 12.5V1.5Z" fill="#FD492A" />
                </svg>
              </span>
              INSTALL NOW
            </a>
          </div>
        </div>

        {/* Right: phone visual, extending past its column on desktop */}
        <div className="relative lg:col-span-7">
          <div
            className={`relative -mx-3 sm:mx-0 lg:w-[116%] lg:max-w-none ${visual.className}`}
            style={visual.style}
          >
            <div ref={parallaxRef} className="relative will-change-transform">
              {/* Soft depth behind the phones — separate layers, image untouched */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[100%] w-[100%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(176,190,225,0.42) 0%, rgba(176,190,225,0) 100%)",
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[3%] left-1/2 h-[18%] w-[72%] -translate-x-1/2"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(28,28,26,0.12) 0%, rgba(28,28,26,0) 100%)",
                }}
              />

              <Image
                src="/mobile.png"
                alt="The NO TWO mobile app shown on two phone screens"
                width={1600}
                height={1600}
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="relative z-10 block"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppSection;
