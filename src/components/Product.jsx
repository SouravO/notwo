'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import PromoBannerCarousel from './PromoBannerCarousel';

const FORMULAS = [
  {
    id: 'hydra-cream',
    name: 'HYDRA CREAM',
    category: 'HYDRATION',
    tagline: 'Daily hydration for soft skin.',
    description: 'Deep cellular moisture infusion engineered to replenish lipids and restore natural epidermal barrier function.',
    image: '/showcase1.png',
    badges: ['HYDRATION', '150 ML', 'pH 5.5'],
    accentGlow: 'rgba(203, 213, 225, 0.18)',
  },
  {
    id: 'purity-gel',
    name: 'PURITY GEL',
    category: 'CLEANSING',
    tagline: 'Gentle daily cleanser for all skin types.',
    description: 'A micro-foaming pH-balanced formulation that clarifies impurities without stripping vital cellular moisture.',
    image: '/showcase2.png',
    badges: ['CLEANSING', '120 ML', 'AMINO ACID'],
    accentGlow: 'rgba(22, 51, 111, 0.18)',
  },
  {
    id: 'radiance-serum',
    name: 'RADIANCE SERUM',
    category: 'BRIGHTENING',
    tagline: 'Brightening serum with niacinamide.',
    description: 'High-potency bioactive elixir engineered to equalize skin tone, diffuse hyperpigmentation, and amplify natural glow.',
    image: '/showcase3.png',
    badges: ['BRIGHTENING', '100 ML', '10% NIACINAMIDE'],
    accentGlow: 'rgba(22, 51, 111, 0.2)',
  },
  {
    id: 'calm-elixir',
    name: 'CALM ELIXIR',
    category: 'CALMING',
    tagline: 'Soothing care for sensitive skin.',
    description: 'Intense soothing concentrate that rapidly reduces redness, calms inflammatory response, and reinforces reactive skin.',
    image: '/showcase4.png',
    badges: ['CALMING', '50 ML', 'BISABOLOL'],
    accentGlow: 'rgba(22, 51, 111, 0.2)',
  },
  {
    id: 'barrier-oil',
    name: 'BARRIER OIL',
    category: 'NIGHT CARE',
    tagline: 'Overnight lipid replenishment.',
    description: "A silicone-free facial oil that seals overnight moisture loss and reinforces the skin's natural lipid matrix while you sleep.",
    image: '/showcase1.png',
    badges: ['NIGHT CARE', '30 ML', 'CERAMIDE'],
    accentGlow: 'rgba(203, 213, 225, 0.18)',
  },
  {
    id: 'pore-toner',
    name: 'PORE REFINE TONER',
    category: 'TONING',
    tagline: 'Micro-exfoliating toner for texture.',
    description: 'A low-pH toning solution that lifts residue and visibly refines pore appearance without disrupting the acid mantle.',
    image: '/showcase2.png',
    badges: ['TONING', '200 ML', 'PHA'],
    accentGlow: 'rgba(22, 51, 111, 0.18)',
  },
  {
    id: 'repair-mask',
    name: 'OVERNIGHT REPAIR MASK',
    category: 'REPAIR',
    tagline: 'Intensive recovery while you sleep.',
    description: 'A wash-off overnight treatment concentrated with peptides to accelerate visible recovery from environmental stress.',
    image: '/showcase3.png',
    badges: ['REPAIR', '75 ML', 'PEPTIDE'],
    accentGlow: 'rgba(22, 51, 111, 0.2)',
  },
  {
    id: 'eye-complex',
    name: 'EYE COMPLEX',
    category: 'EYE CARE',
    tagline: 'Targeted care for the eye contour.',
    description: 'A cooling, fast-absorbing complex engineered for the thinnest skin on the face — de-puffing, firming, brightening.',
    image: '/showcase4.png',
    badges: ['EYE CARE', '15 ML', 'CAFFEINE'],
    accentGlow: 'rgba(22, 51, 111, 0.2)',
  },
];

const CATEGORIES = ['All', ...new Set(FORMULAS.map((f) => f.category))];

export default function Product() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFormulas =
    activeCategory === 'All'
      ? FORMULAS
      : FORMULAS.filter((f) => f.category === activeCategory);

  return (
    <main className="bg-[#EAECEF] text-[#1C1C1A]">
      <PromoBannerCarousel />

      {/* FORMULATION CATALOG */}
      <section className="relative w-full bg-[#EAECEF] px-4 pt-4 pb-12 text-[#1C1C1A] sm:px-6 sm:pt-6 md:px-16 md:pt-12 md:pb-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between mb-12 md:mb-16 border-b border-black/10 pb-6">
            <h2 className="font-display text-3xl font-medium tracking-tight text-[#1C1C1A] md:text-4xl">
              Shop By Category
            </h2>
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
                  className={`px-4 py-2 text-[10px] font-sans tracking-[0.2em] uppercase border transition-colors duration-300 ${
                    isActive
                      ? 'bg-[#16336F] text-[#EFEDDE] border-[#16336F]'
                      : 'border-[#16336F]/50 text-slate-600 hover:text-[#16336F] hover:border-[#16336F]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Hairline-divided grid — sharp edges, no rounded cards */}
          {filteredFormulas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/15 bg-[linear-gradient(135deg,#34373b_0%,#74797f_24%,#b6bbc0_48%,#70757b_72%,#393c40_100%)]">
              {filteredFormulas.map((f) => (
                <div
                  key={f.id}
                  className="group relative bg-[#F1F3F5]/90 p-6 md:p-8 flex flex-col overflow-hidden hover:bg-[#F8F9FA] transition-colors duration-500"
                >
                  <div
                    className="absolute -inset-10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
                    style={{ background: f.accentGlow }}
                  />

                  <div className="relative w-full aspect-[2/3] mb-6">
                    <Image
                      src={f.image}
                      alt={f.name}
                      fill
                      sizes="(max-width: 768px) 45vw, 22vw"
                      className="object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                    />
                  </div>

                  <h3 className="font-sans text-lg md:text-xl font-light tracking-wide text-[#1C1C1A] mb-2">
                    {f.name}
                  </h3>
                  <p className="text-xs text-[#30343a] font-light leading-relaxed mb-4 flex-1">
                    {f.tagline}
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4 font-sans text-xs text-[#34383e]">
                    {f.badges.slice(0, 2).map((b) => (
                      <span
                        key={b}
                        className="whitespace-nowrap"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-xs font-sans tracking-widest uppercase text-slate-500 border border-black/10">
              No formulas in this category yet.
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
