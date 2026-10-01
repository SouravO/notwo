"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const WHY_CHOOSE = [
  {
    id: "01",
    title: "Personalized Approach",
    copy: "Every recommendation is meticulously crafted based on your unique skin analysis, ensuring a routine that truly belongs to you.",
    img: "/feature-1.png?v=2",
  },
  {
    id: "02",
    title: "Scientific Assessment",
    copy: "We replace guesswork with advanced diagnostic technology, analyzing your skin's deep moisture levels, elasticity, and needs.",
    img: "/feature-2.png?v=2",
  },
  {
    id: "03",
    title: "Premium Formulations",
    copy: "Carefully selected, highly active ingredients backed by clinical research to deliver visible, long-lasting results.",
    img: "/feature-3.png?v=2",
  },
  {
    id: "04",
    title: "Progress Tracking",
    copy: "Monitor your skin's transformation over time. Compare reports and adjust your routine as your skin improves.",
    img: "/feature-4.png?v=2",
  },
];

const COUNT = WHY_CHOOSE.length;

// Scroll budget: roughly half a screen of scroll per step, plus one screen for the pinned stage itself
const SECTION_SCROLL_VH = COUNT * 0.55 + 1.0;
const SECTION_HEIGHT = `${SECTION_SCROLL_VH * 100}dvh`;
// Last step holds for this fraction of the scroll before the stage unpins
const EXIT_RELEASE = 0.12;

// Opacity of inactive index rows (raised from 0.4 so they stay readable)
const INACTIVE = 0.5;

const SHOWN_CLIP = "inset(0% 0% 0% 0%)";
const HIDDEN_CLIP = "inset(100% 0% 0% 0%)";

const clamp01 = gsap.utils.clamp(0, 1);

// Fine film grain, same treatment as the About section
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

// Static card, only used for prefers-reduced-motion
function StaticCard({ item }) {
  return (
    <article className="mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] border border-[#1C1C1A]/10 bg-[#F6F4EA] shadow-[0_30px_70px_-35px_rgba(20,24,40,0.45)] md:flex-row">
      <div className="relative h-72 w-full md:h-auto md:min-h-[24rem] md:w-1/2">
        <Image
          src={item.img}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, 50vw"
        />
      </div>
      <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#16336F]">{item.id}</span>
        <h3 className="mt-4 font-serif text-3xl font-semibold italic leading-[1.05] text-[#1C1C1A] sm:text-4xl">
          {item.title}
        </h3>
        <p className="mt-5 font-sans text-base leading-[1.75] text-[#1C1C1A]/75">{item.copy}</p>
      </div>
    </article>
  );
}

function WhyChooseStack() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let frame = 0;
    let active = 0;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stage);
      const blocks = q("[data-block]");
      const titles = q("[data-title]");
      const copies = q("[data-copy]");
      const nums = q("[data-num]");
      const imgs = q("[data-img]");
      const imgInners = q("[data-img-inner]");
      const rows = q("[data-row]");
      const fills = q("[data-fill]").map((el) => ({ el, i: Number(el.dataset.fill) }));

      // ---- initial state: step 01 showing ----
      blocks.forEach((b, i) => gsap.set(b, { autoAlpha: i === 0 ? 1 : 0 }));
      titles.forEach((t, i) => gsap.set(t, { yPercent: i === 0 ? 0 : 110 }));
      copies.forEach((c, i) => gsap.set(c, { y: i === 0 ? 0 : 24, autoAlpha: i === 0 ? 1 : 0 }));
      nums.forEach((n, i) => gsap.set(n, { yPercent: i === 0 ? 0 : 110 }));
      imgs.forEach((im, i) => gsap.set(im, { clipPath: i === 0 ? SHOWN_CLIP : HIDDEN_CLIP, zIndex: i + 1 }));
      imgInners.forEach((im, i) => gsap.set(im, { scale: i === 0 ? 1 : 1.14 }));
      rows.forEach((r, i) => gsap.set(r, { opacity: i === 0 ? 1 : INACTIVE }));

      const goTo = (next) => {
        const prev = active;
        if (next === prev) return;
        const dir = next > prev ? 1 : -1;
        active = next;

        // A scroll can change steps again before the previous transition finishes.
        // Stop every in-flight copy/title animation and make the visibility state
        // exclusive before animating the new step, so stacked text cannot show.
        gsap.killTweensOf([...blocks, ...titles, ...copies, ...nums]);
        for (let i = 0; i < COUNT; i++) {
          gsap.set(blocks[i], { autoAlpha: i === next ? 1 : 0 });
          if (i !== next) {
            gsap.set(titles[i], { yPercent: 110 * dir });
            gsap.set(copies[i], { y: 24 * dir, autoAlpha: 0 });
          }

          if (i === next) {
            gsap.set(titles[i], { yPercent: 110 * dir });
            gsap.set(copies[i], { y: 24 * dir, autoAlpha: 0 });
            gsap.to(titles[i], { yPercent: 0, duration: 0.8, ease: "power4.out", overwrite: true });
            gsap.to(copies[i], { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", delay: 0.08, overwrite: true });
          }

          // counter numeral rolls the same way
          if (i === next) {
            gsap.set(nums[i], { yPercent: 110 * dir });
            gsap.to(nums[i], { yPercent: 0, duration: 0.8, ease: "power4.out", overwrite: true });
          } else {
            gsap.set(nums[i], { yPercent: 110 * dir });
          }

          // one rule for images: everything up to the active step is revealed, the rest waits below.
          // Scrolling forward wipes the next image up; scrolling back wipes the top one away.
          gsap.to(imgs[i], {
            clipPath: i <= next ? SHOWN_CLIP : HIDDEN_CLIP,
            duration: 1.15,
            ease: "power3.inOut",
            overwrite: true,
          });
          gsap.to(imgInners[i], {
            scale: i === next ? 1 : i < next ? 1.06 : 1.14,
            duration: 1.6,
            ease: "power3.out",
            overwrite: true,
          });

          gsap.to(rows[i], { opacity: i === next ? 1 : INACTIVE, duration: 0.5, ease: "power2.out", overwrite: true });
        }
      };

      const readProgress = () => {
        const distance = section.offsetHeight - window.innerHeight;
        if (distance <= 0) return 0;
        return clamp01(-section.getBoundingClientRect().top / distance);
      };

      const update = () => {
        frame = 0;
        const cp = clamp01(readProgress() / (1 - EXIT_RELEASE));

        fills.forEach(({ el, i }) => {
          el.style.transform = `scaleX(${clamp01(cp * COUNT - i)})`;
        });

        goTo(Math.min(COUNT - 1, Math.floor(cp * COUNT)));
      };

      const requestUpdate = () => {
        if (frame) return;
        frame = window.requestAnimationFrame(update);
      };

      update();
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);

      section.__whyCleanup = () => {
        window.removeEventListener("scroll", requestUpdate);
        window.removeEventListener("resize", requestUpdate);
      };
    }, stage);

    let cancelled = false;
    document.fonts?.ready?.then(() => {
      if (!cancelled) window.dispatchEvent(new Event("resize"));
    });

    return () => {
      cancelled = true;
      section.__whyCleanup?.();
      delete section.__whyCleanup;
      if (frame) window.cancelAnimationFrame(frame);
      ctx.revert();
    };
  }, []);

  // Clicking an index row scrolls to the middle of that step
  const scrollToStep = (i) => {
    const section = sectionRef.current;
    if (!section) return;
    const progress = ((i + 0.5) / COUNT) * (1 - EXIT_RELEASE);
    const distance = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY + progress * distance;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    // scroll-mt-0: the pinned stage is a full viewport tall, so the #products anchor must land
    // exactly at the top of the screen. Any scroll margin pushes the stage down and cuts off its bottom.
    <section id="products" className="relative isolate w-full scroll-mt-0 bg-[#EFEDDE] pb-[3dvh]">
      <div ref={sectionRef} className="relative w-full motion-reduce:!h-auto" style={{ height: SECTION_HEIGHT }}>
        <div
          ref={stageRef}
          className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#EFEDDE] motion-reduce:hidden"
        >
          {/* Solid cream ground: soft light + film grain, nothing busy behind the type */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_70%_at_25%_45%,rgba(255,255,255,0.75)_0%,rgba(255,255,255,0)_70%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.10] mix-blend-multiply"
            style={{ backgroundImage: GRAIN }}
          />

          {/* Mobile: stacked. md+: a true two-column grid, so the copy can never run under the image */}
          <div className="relative z-10 flex h-full w-full flex-col justify-center gap-6 px-5 sm:px-8 md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-stretch md:gap-0 md:px-0">
            {/* ---------- LEFT: editorial copy ---------- */}
            <div className="order-2 flex flex-col md:order-none md:justify-center md:pb-10 md:pl-[max(2rem,calc((100vw_-_80rem)/2_+_3rem))] md:pr-12 md:pt-24 lg:pr-16">
              <div className="mb-5 flex items-center gap-4 md:mb-8">
                <span className="h-px w-10 bg-[#16336F]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#16336F]">
                  Why choose KYS
                </span>
              </div>

              {/* all four blocks share one grid cell, so the column never changes height */}
              <div className="grid">
                {WHY_CHOOSE.map((item, i) => (
                  <div
                    key={item.id}
                    data-block
                    className={`[grid-area:1/1] ${i === 0 ? "" : "opacity-0"}`}
                  >
                    <div className="-mx-1 overflow-hidden px-1 pb-[0.14em]">
                      <h3
                        data-title
                        className="font-serif text-[clamp(2rem,8vw,2.75rem)] font-semibold italic leading-[1.02] tracking-[-0.02em] text-[#1C1C1A] md:text-5xl lg:text-[3.5rem]"
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p
                      data-copy
                      className="mt-4 max-w-md font-sans text-[15px] leading-[1.75] text-[#1C1C1A]/80 md:mt-6 md:max-w-lg md:text-lg"
                    >
                      {item.copy}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop index — doubles as progress and navigation */}
              <ol className="mt-10 hidden max-w-lg md:block lg:mt-14 [@media(max-height:700px)]:!hidden">
                {WHY_CHOOSE.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      data-row
                      onClick={() => scrollToStep(i)}
                      className="relative flex w-full items-baseline gap-5 py-3.5 text-left"
                      style={{ opacity: i === 0 ? 1 : INACTIVE }}
                    >
                      <span className="font-mono text-[10px] tracking-[0.3em] text-[#16336F]">{item.id}</span>
                      <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#1C1C1A]">
                        {item.title}
                      </span>
                      <span className="absolute inset-x-0 bottom-0 h-px bg-[#1C1C1A]/15" />
                      <span
                        data-fill={i}
                        className="absolute inset-x-0 bottom-0 h-px origin-left bg-[#16336F]"
                        style={{ transform: "scaleX(0)" }}
                      />
                    </button>
                  </li>
                ))}
              </ol>

              {/* Mobile progress segments */}
              <div className="mt-6 flex gap-2 md:hidden" aria-hidden="true">
                {WHY_CHOOSE.map((item, i) => (
                  <span key={item.id} className="relative h-[2px] flex-1 bg-[#1C1C1A]/15">
                    <span
                      data-fill={i}
                      className="absolute inset-0 origin-left bg-[#16336F]"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* ---------- RIGHT: full-height image panel, its own grid column ---------- */}
            <div className="relative order-1 w-full md:order-none md:h-full">
              <div
                className="relative h-[38dvh] w-full overflow-hidden rounded-[1.25rem] bg-[#D9D6C6] shadow-[0_30px_60px_-28px_rgba(20,24,40,0.5)] md:h-full md:rounded-none md:shadow-[-40px_0_90px_-50px_rgba(20,24,40,0.55)]"
                style={{ isolation: "isolate" }}
              >
                {WHY_CHOOSE.map((item, i) => (
                  <div
                    key={item.id}
                    data-img
                    className="absolute inset-0"
                    style={{ clipPath: i === 0 ? SHOWN_CLIP : HIDDEN_CLIP, zIndex: i + 1 }}
                  >
                    <div data-img-inner className="absolute inset-0">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        priority={i === 0}
                        className="object-cover"
                        sizes="(max-width: 768px) 90vw, 48vw"
                      />
                    </div>
                  </div>
                ))}

                {/* soft scrim, fine inset frame + step counter */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-black/45 to-transparent" />
                {/* on desktop the frame starts below the floating navbar */}
                <div className="pointer-events-none absolute inset-3 z-20 rounded-[0.9rem] border border-white/40 md:inset-x-6 md:bottom-6 md:top-24 md:rounded-none" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end gap-3 p-6 text-white md:p-11">
                  <div className="relative h-10 w-12 overflow-hidden md:h-14 md:w-16">
                    {WHY_CHOOSE.map((item) => (
                      <span
                        key={item.id}
                        data-num
                        className="absolute inset-0 flex items-end font-serif text-4xl italic leading-none md:text-5xl"
                      >
                        {item.id}
                      </span>
                    ))}
                  </div>
                  <span className="pb-1 font-mono text-[10px] tracking-[0.3em] text-white/70">
                    / {String(COUNT).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reduced-motion fallback: plain stacked cards, no pinning */}
        <div className="hidden flex-col gap-10 px-4 py-14 motion-reduce:flex sm:px-8 sm:py-16">
          {WHY_CHOOSE.map((item) => (
            <StaticCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseStack;
