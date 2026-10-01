'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// NOTE: prices and ratings below are placeholders. Replace with real values.
const PRODUCTS = [
  {
    id: 'hydra-cream',
    name: 'No Two Hydra Cream, 150ml',
    category: 'Moisturiser',
    rating: '4.7',
    size: '150ml',
    blurb: 'Daily hydration | Restores skin barrier',
    skinFor: 'For dry skin',
    price: '₹490',
    image: '/pdt1.png',
    href: '/products',
  },
  {
    id: 'purity-gel',
    name: 'No Two Purity Gel Cleanser, 120ml',
    category: 'Cleanser',
    rating: '4.5',
    size: '120ml',
    blurb: 'Amino acid, pH balanced | Gentle daily cleanse',
    skinFor: 'For all skin types',
    price: '₹399',
    image: '/pdt2.png',
    href: '/products',
  },
  {
    id: 'radiance-serum',
    name: 'No Two Radiance Serum, 100ml',
    category: 'Serum',
    rating: '4.8',
    size: '100ml',
    blurb: '10% niacinamide | Evens tone, boosts glow',
    skinFor: 'For dull, uneven skin',
    price: '₹599',
    image: '/pdt3.png',
    href: '/products',
  },
];

const ArrowIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function ProductShowcase() {
  const sectionRef = useRef(null);
  const bannerRef = useRef(null);
  const trackRef = useRef(null);

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

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

      // Cards rise in once as the carousel enters the viewport
      if (trackRef.current) {
        gsap.from('[data-card]', {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: trackRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Keep arrow states in sync with the scroll position
  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, []);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#B0BEE1] text-white overflow-hidden selection:bg-[#16336F]/20 selection:text-[#EFEDDE]"
    >
      {/* SHARED ONYX ATMOSPHERE & GLOW */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Fine Technical Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

        {/* Ambient tint */}
        <div
          className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[400px] md:h-[600px] rounded-full blur-[140px]"
          style={{ background: 'rgba(22, 51, 111, 0.14)' }}
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

      {/* PRODUCT CARD CAROUSEL */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-16 pt-6 pb-16 md:pb-24">
        {/* Header row: title, catalog link, and carousel controls */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <h3 className="font-serif text-2xl font-light italic text-white sm:text-3xl">
            Formulas built for your skin
          </h3>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-[#16336F] bg-[#16336F] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EFEDDE] transition-colors hover:bg-[#16336F]/90 sm:px-5"
            >
              <span>See all</span>
              <ArrowIcon className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              aria-label="Previous products"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-[#16336F] hover:bg-[#16336F] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:bg-transparent"
            >
              <ArrowIcon className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Next products"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-300 hover:border-[#16336F] hover:bg-[#16336F] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:bg-transparent"
            >
              <ArrowIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scroll-snap track */}
        <div
          ref={trackRef}
          onScroll={updateArrows}
          className="-mx-6 flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto px-6 pb-6 md:-mx-16 md:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              data-card
              style={{ backgroundColor: '#101114' }}
              className="group flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101114] shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)] sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]"
            >
              {/* Image tile */}
              <div className="relative aspect-[4/3.6] w-full overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#1a2340_0%,#0b0e18_70%)]">
                {/* Category badge */}
                <span className="absolute left-3 top-3 z-10 rounded-md bg-[#16336F] px-3 py-1.5 font-sans text-xs tracking-wide text-[#EFEDDE]">
                  {p.category}
                </span>

                {/* Rating */}
                <span className="absolute right-3 top-3 z-10 flex items-center gap-1.5 font-sans text-sm text-white/90">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#F5B93A]" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                  </svg>
                  {p.rating}
                </span>

                {/* Product image */}
                <div className="absolute inset-x-6 bottom-6 top-12">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 28vw"
                    className="object-contain object-center drop-shadow-[0_20px_36px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Size tag, bottom-right corner */}
                <span className="absolute bottom-0 right-0 z-10 rounded-tl-2xl bg-black px-4 py-2.5 font-sans text-sm font-bold text-white">
                  {p.size}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col items-center bg-[#101114] px-5 pb-5 pt-6 text-center">
                <h4 className="min-h-[3.5rem] font-sans text-lg font-medium leading-snug text-white">
                  {p.name}
                </h4>

                <p className="mt-3 min-h-[3.25rem] max-w-[16rem] font-sans text-[13px] font-light leading-relaxed text-slate-400">
                  {p.blurb}
                  <br />
                  {p.skinFor}
                </p>

                <p className="mt-auto pt-4 font-sans text-3xl font-semibold text-white">{p.price}</p>

                <Link
                  href={p.href}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-[#16336F] bg-[#16336F] px-5 py-3 font-sans text-sm tracking-wide text-[#EFEDDE] transition-colors duration-300 hover:bg-[#16336F]/85"
                >
                  <span>View product</span>
                </Link>
              </div>
            </article>
          ))}

        </div>
      </div>
    </section>
  );
}
