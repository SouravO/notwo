'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

// Reused product assets (placeholders for the 4 new formulas until real images are ready)
import hydraCreamImg from '@/app/assets/HydraCream.png';
import purityGelImg from '@/app/assets/PurityGel.png';
import radianceSerumImg from '@/app/assets/RadianceSerum.png';
import calmElixirImg from '@/app/assets/calm-elixir.png';

// Hero background lives in /public, so it's referenced by path, not imported.
// Adjust this string if your actual filename/casing/extension differs
// (e.g. '/Banner.png', '/banner.jpg').
const BANNER_SRC = '/Banner.png';

const FORMULAS = [
  {
    id: 'hydra-cream',
    code: 'FORMULA / 01',
    name: 'HYDRA CREAM',
    category: 'HYDRATION',
    tagline: 'Daily hydration for soft skin.',
    description: 'Deep cellular moisture infusion engineered to replenish lipids and restore natural epidermal barrier function.',
    image: hydraCreamImg,
    badges: ['HYDRATION', '150 ML', 'pH 5.5'],
    clinicalStat: 'BARRIER REPAIR: +98%',
    accentGlow: 'rgba(203, 213, 225, 0.18)',
  },
  {
    id: 'purity-gel',
    code: 'FORMULA / 02',
    name: 'PURITY GEL',
    category: 'CLEANSING',
    tagline: 'Gentle daily cleanser for all skin types.',
    description: 'A micro-foaming pH-balanced formulation that clarifies impurities without stripping vital cellular moisture.',
    image: purityGelImg,
    badges: ['CLEANSING', '120 ML', 'AMINO ACID'],
    clinicalStat: 'PURITY INDEX: 99.4%',
    accentGlow: 'rgba(125, 211, 252, 0.18)',
  },
  {
    id: 'radiance-serum',
    code: 'FORMULA / 03',
    name: 'RADIANCE SERUM',
    category: 'BRIGHTENING',
    tagline: 'Brightening serum with niacinamide.',
    description: 'High-potency bioactive elixir engineered to equalize skin tone, diffuse hyperpigmentation, and amplify natural glow.',
    image: radianceSerumImg,
    badges: ['BRIGHTENING', '100 ML', '10% NIACINAMIDE'],
    clinicalStat: 'LUMINESCENCE: +84%',
    accentGlow: 'rgba(96, 165, 250, 0.2)',
  },
  {
    id: 'calm-elixir',
    code: 'FORMULA / 04',
    name: 'CALM ELIXIR',
    category: 'CALMING',
    tagline: 'Soothing care for sensitive skin.',
    description: 'Intense soothing concentrate that rapidly reduces redness, calms inflammatory response, and reinforces reactive skin.',
    image: calmElixirImg,
    badges: ['CALMING', '50 ML', 'BISABOLOL'],
    clinicalStat: 'REDNESS REDUCTION: IMMEDIATE',
    accentGlow: 'rgba(129, 140, 248, 0.2)',
  },
  {
    id: 'barrier-oil',
    code: 'FORMULA / 05',
    name: 'BARRIER OIL',
    category: 'NIGHT CARE',
    tagline: 'Overnight lipid replenishment.',
    description: "A silicone-free facial oil that seals overnight moisture loss and reinforces the skin's natural lipid matrix while you sleep.",
    image: hydraCreamImg,
    badges: ['NIGHT CARE', '30 ML', 'CERAMIDE'],
    clinicalStat: 'MOISTURE LOSS: -76%',
    accentGlow: 'rgba(203, 213, 225, 0.18)',
    placeholder: true,
  },
  {
    id: 'pore-toner',
    code: 'FORMULA / 06',
    name: 'PORE REFINE TONER',
    category: 'TONING',
    tagline: 'Micro-exfoliating toner for texture.',
    description: 'A low-pH toning solution that lifts residue and visibly refines pore appearance without disrupting the acid mantle.',
    image: purityGelImg,
    badges: ['TONING', '200 ML', 'PHA'],
    clinicalStat: 'TEXTURE SCORE: +61%',
    accentGlow: 'rgba(125, 211, 252, 0.18)',
    placeholder: true,
  },
  {
    id: 'repair-mask',
    code: 'FORMULA / 07',
    name: 'OVERNIGHT REPAIR MASK',
    category: 'REPAIR',
    tagline: 'Intensive recovery while you sleep.',
    description: 'A wash-off overnight treatment concentrated with peptides to accelerate visible recovery from environmental stress.',
    image: radianceSerumImg,
    badges: ['REPAIR', '75 ML', 'PEPTIDE'],
    clinicalStat: 'RECOVERY TIME: -40%',
    accentGlow: 'rgba(96, 165, 250, 0.2)',
    placeholder: true,
  },
  {
    id: 'eye-complex',
    code: 'FORMULA / 08',
    name: 'EYE COMPLEX',
    category: 'EYE CARE',
    tagline: 'Targeted care for the eye contour.',
    description: 'A cooling, fast-absorbing complex engineered for the thinnest skin on the face — de-puffing, firming, brightening.',
    image: calmElixirImg,
    badges: ['EYE CARE', '15 ML', 'CAFFEINE'],
    clinicalStat: 'PUFFINESS: -52%',
    accentGlow: 'rgba(129, 140, 248, 0.2)',
    placeholder: true,
  },
];

const CATEGORIES = ['All', ...new Set(FORMULAS.map((f) => f.category))];

export default function Product() {
  const heroContentRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // One orchestrated hero reveal on load
  useEffect(() => {
    if (!heroContentRef.current) return;
    gsap.fromTo(
      heroContentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 }
    );
  }, []);

  const filteredFormulas =
    activeCategory === 'All'
      ? FORMULAS
      : FORMULAS.filter((f) => f.category === activeCategory);

  return (
    <main className="bg-[#070709] text-white">
      <Link
        href="/"
        className="fixed right-4 top-4 z-50 rounded-full border border-white/20 bg-[#070709]/90 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white hover:text-[#070709] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
      >
        Home
      </Link>

      {/* HERO */}
      <section className="relative w-full h-[100svh] min-h-[600px] overflow-hidden">
        <Image
          src={BANNER_SRC}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#070709]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

        <div className="relative z-10 h-full w-full max-w-[1600px] mx-auto px-6 md:px-16 flex flex-col justify-end pb-24 md:pb-32">
          <div ref={heroContentRef}>
            <p className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase text-slate-300 flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              COMPLETE FORMULATION RANGE
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-light tracking-wide text-white mb-6 max-w-3xl">
              The Archive
            </h1>
            <p className="text-sm md:text-base text-slate-300 font-light max-w-md leading-relaxed">
              Every formula the NO TWO system has ever prescribed — indexed below, from first hydration to the newest overnight repair.
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-slate-400">
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Scroll to catalog</span>
          <span className="w-[1px] h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* FORMULATION CATALOG */}
      <section className="relative w-full py-20 md:py-32 px-6 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16 border-b border-white/10 pb-6">
            <h2 className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-slate-400">
              Formulation Catalog
            </h2>
            <span className="text-[11px] font-mono tracking-widest text-slate-500">
              {String(filteredFormulas.length).padStart(2, '0')} FORMULAS
            </span>
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex flex-wrap items-center gap-2 mb-10 md:mb-12">
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={isActive}
                  className={`px-4 py-2 text-[10px] font-mono tracking-[0.2em] uppercase border transition-colors duration-300 ${
                    isActive
                      ? 'bg-white text-black border-white'
                      : 'border-white/15 text-slate-400 hover:text-white hover:border-white/30'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Hairline-divided grid — sharp edges, no rounded cards */}
          {filteredFormulas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
              {filteredFormulas.map((f) => (
                <div
                  key={f.id}
                  className="group relative bg-[#070709] p-6 md:p-8 flex flex-col overflow-hidden hover:bg-white/[0.02] transition-colors duration-500"
                >
                  <div
                    className="absolute -inset-10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
                    style={{ background: f.accentGlow }}
                  />

                  <div className="relative w-full aspect-square mb-6">
                    <Image
                      src={f.image}
                      alt={f.name}
                      fill
                      sizes="(max-width: 768px) 45vw, 22vw"
                      className="object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                    />
                    {f.placeholder && (
                      <span className="absolute top-0 right-0 text-[8px] font-mono tracking-widest uppercase text-amber-300/80 border border-amber-300/30 bg-black/50 px-1.5 py-0.5">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-2 text-[9px] font-mono tracking-[0.2em] uppercase text-slate-500 mb-3">
                    <span className="w-1 h-1 rounded-full bg-cyan-400" />
                    {f.code}
                  </div>

                  <h3 className="text-lg md:text-xl font-light tracking-wide text-white mb-2">
                    {f.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-4 flex-1">
                    {f.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {f.badges.slice(0, 2).map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 border border-white/10 text-[9px] font-mono tracking-widest uppercase text-slate-400"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10 text-[9px] font-mono tracking-wider uppercase text-slate-500">
                    <span className="text-cyan-400">[CLINICAL]</span> {f.clinicalStat}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-xs font-mono tracking-widest uppercase text-slate-500 border border-white/10">
              No formulas in this category yet.
            </div>
          )}

          {/* Closing CTA */}
          <div className="mt-16 md:mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <p className="text-sm md:text-base text-slate-300 font-light max-w-md">
              Not sure which formula matches your skin? Run the scan and the system will narrow it down for you.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
