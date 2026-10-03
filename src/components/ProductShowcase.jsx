'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Runs before paint on the client (no SSR warning), so cards never flash visible then hide.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const PRODUCTS = [
  {
    id: 'hydra-cream',
    name: 'No Two Hydra Cream',
    image: '/showcase1.png',
    href: '/products',
  },
  {
    id: 'purity-gel',
    name: 'No Two Purity Gel Cleanser',
    image: '/showcase2.png',
    href: '/products',
  },
  {
    id: 'radiance-serum',
    name: 'No Two Radiance Serum',
    image: '/showcase3.png',
    href: '/products',
  },
  {
    id: 'calm-elixir',
    name: 'No Two Calm Elixir',
    image: '/showcase4.png',
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

  // Banner: gentle scroll-linked scale (unchanged)
  useEffect(() => {
    let ctx = gsap.context(() => {
      const bannerImage = bannerRef.current?.querySelector('img');
      if (bannerImage) {
        gsap.fromTo(
          bannerImage,
          { scale: 0.98 },
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cards: same reveal as before (rise 40px + fade, 0.9s, 0.12s stagger, plays once),
  // but driven by IntersectionObserver instead of a ScrollTrigger measured at mount.
  // The old trigger could be positioned wrongly when layout above shifted afterwards
  // (images, fonts, pinned sections), leaving the cards stuck at opacity 0.
  useIsoLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const cards = Array.from(track.querySelectorAll('[data-card]'));
    if (!cards.length) return undefined;

    // Without IntersectionObserver, simply leave the cards visible.
    if (!('IntersectionObserver' in window)) return undefined;

    gsap.set(cards, { y: 40, opacity: 0 });

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        overwrite: true,
        // Remove GSAP's inline styles at the end so the cards return to their natural CSS state
        clearProps: 'opacity,transform',
      });
    };

    // Same start line as before ("top 85%"): reveal once the track's top reaches 85% of the viewport,
    // or immediately if it is already above that line (e.g. page reloaded further down).
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight * 0.85) {
            reveal();
            observer.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 }
    );
    observer.observe(track);

    return () => {
      observer.disconnect();
      gsap.killTweensOf(cards);
      gsap.set(cards, { clearProps: 'opacity,transform' });
    };
  }, []);

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
      className="relative w-full bg-[#EAECEF] text-[#0A0A0A] overflow-hidden selection:bg-[#0A0A0A]/10"
    >
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* PRODUCT RANGE BANNER */}
      <div ref={bannerRef} className="relative z-10 w-full aspect-[1944/809] overflow-hidden">
        <Image
          src="/pdtbanner1.png"
          alt="No Two product range"
          fill
          sizes="100vw"
          className="object-contain will-change-transform"
        />
      </div>

      {/* PRODUCT CAROUSEL */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-16 pt-8 pb-20 md:pb-28">
        {/* Header row */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-black/10 pb-6">
          <h3 className="font-display text-3xl font-light tracking-tight text-[#0A0A0A] sm:text-4xl">
            Formulas built for your skin
          </h3>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#191970]/40 text-[#191970] transition-all duration-300 hover:bg-[#191970] hover:text-white disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-[#191970]"
            >
              <ArrowIcon className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Next products"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#191970]/40 text-[#191970] transition-all duration-300 hover:bg-[#191970] hover:text-white disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-[#191970]"
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
              className="group flex w-[80%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#F4F6F8] shadow-[0_15px_35px_-15px_rgba(0,0,0,0.06)] transition-shadow duration-500 hover:shadow-[0_25px_50px_-20px_rgba(0,0,0,0.12)] sm:w-[calc((100%_-_1.5rem)/2)] xl:w-[calc((100%_-_4.5rem)/4)]"
            >
              {/* 3/4 Height Image Area (Light Silver Container) */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-[#FAFBFD] via-[#EEF1F5] to-[#E3E7ED]">
                <div className="relative h-full w-full">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Minimal Info: Name & Action Button */}
              <div className="flex flex-1 flex-col items-center justify-between bg-[#F4F6F8] p-6 text-center">
                <h4 className="font-sans text-lg font-normal leading-snug tracking-tight text-[#0A0A0A]">
                  {p.name}
                </h4>

                <Link
                  href={p.href}
                  className="mt-6 flex w-full items-center justify-center rounded-full border border-[#191970] bg-transparent px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] text-[#191970] transition-all duration-300 hover:bg-[#191970] hover:text-white"
                >
                  <span>View product</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-3 rounded-full border border-[#191970] bg-[#191970] px-7 py-3.5 font-sans text-xs uppercase tracking-[0.22em] text-white transition-all hover:bg-[#10104D] hover:border-[#10104D]"
          >
            <span>See all collections</span>
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
