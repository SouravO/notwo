"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Each block alternates sides: `reverse: false` puts the image on the left (desktop),
// `reverse: true` puts it on the right. Add more entries to keep the zig-zag going.
const STORY_BLOCKS = [
  {
    id: "brand-story-title",
    image: "/sideimg.png?v=77b3edad23bc2d59",
    alt: "NO TWO skincare collection arranged on a minimal surface",
    reverse: false,
    lead: "Because no two",
    tail: "skin journeys are the same.",
    paragraphs: [
      "At NO TWO, we believe true radiance begins with honoring your individuality. Born from a desire to strip away the noise of the beauty industry, our formulations are meticulously crafted using clinically proven, consciously sourced ingredients.",
      "We don\u2019t just create skincare; we curate a daily ritual that adapts to you. Explore a collection designed to make your routine feel clear, considered, and deeply personal.",
    ],
    cta: { label: "Discover our ingredients", href: "#" },
  },
  {
    id: "brand-story-ritual-title",
    image: "/sideimg1.png",
    alt: "NO TWO skincare ritual styled with a calm, minimal feel",
    reverse: true,
    lead: "A routine that",
    tail: "listens to your skin.",
    paragraphs: [
      "Your skin changes with the seasons, your schedule, and every stage of life. NO TWO starts by understanding what yours needs today, then builds a routine around it \u2014 simple, clear, and never one-size-fits-all.",
      "Fewer steps, thoughtfully chosen formulas, and guidance that makes sense. So caring for your skin feels less like a project and more like a moment that\u2019s entirely yours.",
    ],
    cta: { label: "Explore the collection", href: "#" },
  },
  {
    id: "brand-story-formula-title",
    image: "/brand.png",
    alt: "Model holding a NO TWO soothing face toner",
    reverse: false,
    lead: "Skincare, made",
    tail: "personal to you.",
    paragraphs: [
      "Every NO TWO formula is made to support the way your skin feels today. Thoughtful ingredients and clear routines make daily care easier to understand and make your own.",
      "Discover considered essentials, including our soothing face toner for sensitive skin, designed to bring a calm, comfortable step to your routine.",
    ],
    cta: { label: "Explore the collection", href: "/products" },
  },
];

// Fine film grain for a soft brushed-metal feel
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

export default function BrandStory() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.utils.toArray("[data-story-image]").forEach((image) => {
        gsap.fromTo(
          image,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: image.closest("article"),
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="brand-story-title"
      className="relative isolate w-full bg-[#E9ECF0] py-12 text-[#1A1A1A] [overflow-x:clip] sm:py-16 lg:py-20"
    >
      {/* Light silver ground: soft sheen + faint grain, all decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,#F4F6F9_0%,#E6E9EE_38%,#EFF1F5_68%,#DEE2E8_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_40%_at_82%_6%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_70%),radial-gradient(ellipse_50%_40%_at_8%_92%,rgba(176,190,225,0.22)_0%,rgba(176,190,225,0)_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />

      <div className="flex flex-col gap-14 sm:gap-16 lg:gap-20">
        {STORY_BLOCKS.map((block, index) => (
          <article
            key={block.id}
            aria-labelledby={block.id}
            className={`grid grid-cols-1 items-center gap-9 lg:gap-0 ${
              index === 2 ? "lg:gap-x-[clamp(2rem,5vw,6rem)]" : ""
            } ${
              index === 2
                ? "lg:grid-cols-[0.9fr_1.1fr]"
                : block.reverse
                  ? "lg:grid-cols-[0.85fr_1.15fr]"
                  : "lg:grid-cols-[1.15fr_0.85fr]"
            }`}
          >
            {/* Image: runs to the screen edge on desktop, rounded on its inner side */}
            <div
              data-story-image
              className={`group relative order-2 mx-6 aspect-[1.12/1] min-w-0 overflow-hidden rounded-[1.5rem] shadow-[0_30px_80px_-30px_rgba(28,28,26,0.35)] sm:mx-10 lg:mx-0 ${
                block.reverse
                  ? "lg:order-2 lg:rounded-l-[3rem] lg:rounded-r-none"
                  : "lg:order-1 lg:rounded-l-none lg:rounded-r-[3rem]"
              } ${index === 2 ? "lg:aspect-[0.85/1]" : ""}`}
            >
              <Image
                src={block.image}
                alt={block.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 57vw"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                priority={index === 0}
              />
              {/* faint inner edge so the photo sits crisply on the silver ground */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/40"
              />
            </div>

            {/* Text: the outer edge padding lines it up with the site's 80rem content width
                while the image on the other side runs to the screen edge */}
            <div
              className={`order-1 min-w-0 px-6 sm:px-10 lg:px-14 ${
                block.reverse
                  ? "lg:order-1 lg:pl-[max(2rem,calc((100vw_-_80rem)/2_+_4rem))]"
                  : "lg:order-2 lg:pr-[max(2rem,calc((100vw_-_80rem)/2_+_4rem))]"
              } ${index === 2 ? "lg:pl-0" : ""}`}
            >
              <div className="max-w-xl">
                <h2
                  id={block.id}
                  className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.05] tracking-[-0.03em] text-[#0A0A0A]"
                >
                  {block.lead}{" "}
                  <span className="text-[#0A0A0A]/50">{block.tail}</span>
                </h2>

                <div className="mt-7 flex flex-col gap-5 font-sans text-base font-light leading-relaxed text-[#3F4146] sm:text-lg sm:leading-[1.75]">
                  {block.paragraphs.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>

              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
