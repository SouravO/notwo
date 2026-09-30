'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    id: 'hydra-cream',
    name: 'HYDRA CREAM',
    tagline: 'Daily hydration for soft skin.',
    description: 'Deep cellular moisture infusion engineered to replenish lipids and restore natural epidermal barrier function.',
    image: '/pdt1.png',
    badges: ['HYDRATION', '150 ML', 'pH 5.5'],
    imageScale: 'scale-100',
    accentGlow: 'rgba(203, 213, 225, 0.12)',
  },
  {
    id: 'purity-gel',
    name: 'PURITY GEL',
    tagline: 'Gentle daily cleanser for all skin types.',
    description: 'A micro-foaming pH-balanced formulation that clarifies impurities without stripping vital cellular moisture.',
    image: '/pdt2.png',
    badges: ['CLEANSING', '120 ML', 'AMINO ACID'],
    imageScale: 'scale-100',
    accentGlow: 'rgba(125, 211, 252, 0.12)',
  },
  {
    id: 'radiance-serum',
    name: 'RADIANCE SERUM',
    tagline: 'Brightening serum with niacinamide.',
    description: 'High-potency bioactive elixir engineered to equalize skin tone, diffuse hyperpigmentation, and amplify natural glow.',
    image: '/pdt3.png',
    badges: ['BRIGHTENING', '100 ML', '10% NIACINAMIDE'],
    imageScale: 'scale-105',
    accentGlow: 'rgba(96, 165, 250, 0.14)',
  },
  {
    id: 'see-all',
    isSeeAll: true,
  },
];

export default function ProductShowcase() {
  const sectionRef = useRef(null);
  const bannerRef = useRef(null);
  const slidesRef = useRef([]);
  const progressBarRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const animState = useRef({
    currentIndex: 0,
    timer: null,
    progressTween: null,
    isAnimating: false,
  });

  useEffect(() => {
    let ctx = gsap.context(() => {
      const bannerImage = bannerRef.current?.querySelector('img');
      if (bannerImage) {
        gsap.fromTo(
          bannerImage,
          { scale: 0.96 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: bannerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      // 1. Initial DOM Setup: Hide all slides completely
      slidesRef.current.forEach((slide, idx) => {
        if (!slide) return;
        if (idx === 0) {
          gsap.set(slide, { display: 'flex', autoAlpha: 1 });
        } else {
          gsap.set(slide, { display: 'none', autoAlpha: 0 });
        }
      });

      // 2. Play Countdown Progress Bar & Transition Queue
      const playNext = () => {
        // Uniform 2s hold — slides advance continuously, no pause-on-hover
        const holdDuration = 2.0;

        // Animate bottom timeline progress bar
        if (progressBarRef.current) {
          gsap.set(progressBarRef.current, { scaleX: 0 });
          animState.current.progressTween = gsap.to(progressBarRef.current, {
            scaleX: 1,
            duration: holdDuration,
            ease: 'none',
          });
        }

        // Schedule next transition
        animState.current.timer = gsap.delayedCall(holdDuration, () => {
          const current = animState.current.currentIndex;
          const next = (current + 1) % SLIDES.length;
          transitionSlides(current, next);
        });
      };

      // 3. Cinematic GSAP Transition Engine
      const transitionSlides = (current, next) => {
        if (animState.current.isAnimating) return;
        animState.current.isAnimating = true;

        const outSlide = slidesRef.current[current];
        const inSlide = slidesRef.current[next];

        if (!outSlide || !inSlide) return;

        const outAsset = outSlide.querySelector('.product-asset');
        const outInfo = outSlide.querySelector('.product-info');
        const inAsset = inSlide.querySelector('.product-asset');
        const inInfo = inSlide.querySelector('.product-info');

        setActiveIndex(next);

        const tl = gsap.timeline({
          onComplete: () => {
            // STRICT CLEANUP: Completely unmount/hide outgoing slide
            gsap.set(outSlide, { display: 'none', autoAlpha: 0 });
            animState.current.currentIndex = next;
            animState.current.isAnimating = false;
            playNext();
          },
        });

        // Make incoming slide visible in DOM right before animation starts
        gsap.set(inSlide, { display: 'flex', autoAlpha: 1 });

        // OUTGOING ANIMATION: Moves smoothly left and fades out
        if (outAsset && outInfo) {
          tl.to(
            outAsset,
            { x: -140, opacity: 0, scale: 0.9, duration: 0.7, ease: 'power3.in' },
            0
          );
          tl.to(
            outInfo,
            { x: -90, opacity: 0, duration: 0.6, ease: 'power3.in' },
            0.05
          );
        } else {
          tl.to(outSlide.children, { x: -100, opacity: 0, duration: 0.7, ease: 'power3.in' }, 0);
        }

        // INCOMING ANIMATION: Enters dynamically from the right
        if (inAsset && inInfo) {
          gsap.set(inAsset, { x: 150, opacity: 0, scale: 0.92 });
          gsap.set(inInfo, { x: 100, opacity: 0 });

          tl.to(
            inAsset,
            { x: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power4.out' },
            0.25
          );
          tl.to(
            inInfo,
            { x: 0, opacity: 1, duration: 1.0, ease: 'power4.out' },
            0.35
          );
        } else {
          gsap.set(inSlide.children, { x: 100, opacity: 0 });
          tl.to(
            inSlide.children,
            { x: 0, opacity: 1, duration: 1.0, ease: 'power4.out' },
            0.25
          );
        }
      };

      // Start initial sequence
      playNext();
    }, sectionRef);

    return () => {
      if (animState.current.timer) animState.current.timer.kill();
      if (animState.current.progressTween) animState.current.progressTween.kill();
      ctx.revert();
    };
  }, []);

  const currentSlideData = SLIDES[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#070709] text-white overflow-hidden selection:bg-cyan-500/20 selection:text-cyan-200"
    >
      {/* SHARED ONYX ATMOSPHERE & GLOW */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Fine Technical Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

        {/* Dynamic Formula Aura Ambient Tint */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[400px] md:h-[600px] rounded-full blur-[140px] transition-all duration-1000 ease-out"
          style={{
            background: currentSlideData?.accentGlow || 'rgba(255,255,255,0.05)',
          }}
        />
      </div>

      {/* PRODUCT RANGE BANNER */}
      <div ref={bannerRef} className="relative z-10 w-full aspect-[1944/809] overflow-hidden">
        <Image
          src="/pdtbanner.png"
          alt="No Two product range"
          fill
          priority
          sizes="100vw"
          className="object-contain will-change-transform"
        />
      </div>

      <div className="relative z-10 flex h-[90svh] min-h-[600px] flex-col justify-between">

      {/* MAIN SINGLE-PRODUCT EXHIBITION STAGE */}
      <div className="relative z-10 flex-1 w-full max-w-[1600px] mx-auto flex items-center">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => (slidesRef.current[index] = el)}
            className="absolute inset-0 w-full h-full items-center"
          >
            {slide.isSeeAll ? (
              /* FINAL STATE: SEE ALL BUTTON */
              <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white/20 mb-8" />

                <Link
                  href="/products"
                  className="group relative inline-flex items-center gap-4 px-10 py-5 border border-white/20 bg-white/[0.02] hover:bg-white hover:text-black text-xs font-mono tracking-[0.3em] uppercase text-white transition-all duration-500 backdrop-blur-md shadow-2xl cursor-pointer"
                >
                  <span>SEE ALL</span>
                  <svg
                    className="w-4 h-4 text-slate-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>

                <div className="w-[1px] h-12 bg-gradient-to-t from-transparent to-white/20 mt-8" />
              </div>
            ) : (
              /* PRODUCT FRAME (LEFT: PRODUCT IMAGE | RIGHT: EDITORIAL COPY) */
              <div className="w-full h-full flex flex-col md:flex-row items-center">

                {/* LEFT SIDE: Product Asset Stage */}
                <div className="product-asset w-full md:w-1/2 h-[50%] md:h-full flex flex-col justify-center items-center relative px-6 md:px-8 pt-6 md:pt-0">
                  {/* Subtle ground reflection shadow */}
                  <div className="absolute bottom-6 md:bottom-20 left-1/2 -translate-x-1/2 w-2/3 h-6 bg-black/80 blur-xl rounded-full pointer-events-none" />

                  <div className={`relative w-full h-[92%] md:w-full md:h-[94%] transition-transform duration-500 ${slide.imageScale}`}>
                    <Image
                      src={slide.image}
                      alt={slide.name}
                      fill
                      sizes="(max-width: 768px) 60vw, 35vw"
                      className="object-contain object-center filter contrast-[1.02] brightness-[1.02] drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
                    />
                  </div>

                </div>

                {/* RIGHT SIDE: Product Information */}
                <div className="product-info w-full md:w-1/2 h-[50%] md:h-full flex flex-col justify-start md:justify-center items-center md:items-start text-center md:text-left px-6 lg:px-16 pb-8 md:pb-0">

                  {/* Product Title */}
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-white mb-3">
                    {slide.name}
                  </h3>

                  {/* Tagline */}
                  <p className="text-base sm:text-lg text-slate-200 font-light mb-3">
                    {slide.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 font-light max-w-md leading-relaxed mb-6">
                    {slide.description}
                  </p>

                  <Link
                    href="/products"
                    className="group inline-flex items-center gap-3 border border-cyan-400/40 bg-cyan-400/[0.06] px-6 py-3 text-[10px] font-mono tracking-[0.25em] uppercase text-cyan-200 transition-colors duration-300 hover:border-cyan-300 hover:bg-cyan-300 hover:text-[#070709] mb-6"
                  >
                    <span>SHOP NOW</span>
                    <svg
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>

                  {/* Minimal Metadata Badges */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mb-6 text-xs font-sans text-slate-400">
                    {slide.badges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="whitespace-nowrap"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                </div>

              </div>
            )}
          </div>
        ))}
      </div>

      {/* BOTTOM TIMELINE & PROGRESS BAR */}
      <div className="relative z-20 pb-8 px-6 md:px-16 w-full max-w-[1600px] mx-auto flex flex-col gap-3">
        {/* Progress Bar Line */}
        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
          <div
            ref={progressBarRef}
            className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-cyan-500 to-white origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Minimal Dot Indicators */}
        <div className="flex items-center justify-end text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <span
                key={s.id}
                className={`h-1 rounded-full transition-all duration-500 ${
                  activeIndex === i ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
