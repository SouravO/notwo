'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const PROMO_BANNERS = ['/pdtbanner1.png', '/pdtbanner2.png'];

export default function PromoBannerCarousel() {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveBanner((current) => (current + 1) % PROMO_BANNERS.length);
    }, 5500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#EAECEF] px-4 pb-2 pt-28 sm:px-6 sm:pb-3 sm:pt-32 md:px-8 md:pt-36">
      <div className="mx-auto w-full max-w-[1440px]">
        <div
          aria-label="Promotional offers"
          aria-roledescription="carousel"
          className="relative aspect-[3/1] w-full overflow-hidden rounded-xl bg-[#EAECEF] sm:rounded-2xl"
        >
          {PROMO_BANNERS.map((src, index) => (
            <div
              key={src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${PROMO_BANNERS.length}`}
              aria-hidden={activeBanner !== index}
              className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                activeBanner === index
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-3 opacity-0'
              }`}
            >
              <Image
                src={src}
                alt={`NO TWO skincare promotion ${index + 1}`}
                fill
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 3rem), min(1440px, calc(100vw - 4rem))"
                className="object-contain"
              />
            </div>
          ))}

          <button
            type="button"
            aria-label="Previous promotional banner"
            onClick={() => setActiveBanner((current) => (current - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length)}
            className="absolute left-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#16336F] bg-[#16336F]/90 text-[#EFEDDE] transition-colors hover:bg-[#16336F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0BEE1] sm:left-4 sm:flex sm:h-10 sm:w-10"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next promotional banner"
            onClick={() => setActiveBanner((current) => (current + 1) % PROMO_BANNERS.length)}
            className="absolute right-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#16336F] bg-[#16336F]/90 text-[#EFEDDE] transition-colors hover:bg-[#16336F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0BEE1] sm:right-4 sm:flex sm:h-10 sm:w-10"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
              <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>

        <div className="mt-1 grid min-h-11 grid-cols-[1fr_auto_1fr] items-center" role="group" aria-label="Promotional banner controls">
          <button
            type="button"
            aria-label="Previous promotional banner"
            onClick={() => setActiveBanner((current) => (current - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length)}
            className="flex h-11 w-11 items-center justify-center justify-self-start rounded-full text-[#16336F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#16336F] sm:hidden"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center" role="group" aria-label="Choose promotional banner">
            {PROMO_BANNERS.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`Show promotional banner ${index + 1}`}
                aria-current={activeBanner === index ? 'true' : undefined}
                onClick={() => setActiveBanner(index)}
                className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#B0BEE1]"
              >
                <span
                  className={`h-1 rounded-full transition-[width,background-color] duration-300 ${
                    activeBanner === index
                      ? 'w-6 bg-[#16336F]'
                      : 'w-2 bg-[#16336F]/35 hover:bg-[#16336F]/60'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next promotional banner"
            onClick={() => setActiveBanner((current) => (current + 1) % PROMO_BANNERS.length)}
            className="flex h-11 w-11 items-center justify-center justify-self-end rounded-full text-[#16336F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#16336F] sm:hidden"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
