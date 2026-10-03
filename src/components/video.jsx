"use client";

import { useRef } from "react";

const VIDEOS = Array.from({ length: 7 }, (_, index) => index + 1);
const VIDEO_WIDTHS = [
  "w-[58vw] sm:w-[32vw] lg:w-[15vw]",
  "w-[63vw] sm:w-[36vw] lg:w-[18vw]",
  "w-[68vw] sm:w-[40vw] lg:w-[21vw]",
  "w-[72vw] sm:w-[44vw] lg:w-[24vw]",
  "w-[63vw] sm:w-[36vw] lg:w-[18vw]",
  "w-[58vw] sm:w-[32vw] lg:w-[15vw]",
  "w-[68vw] sm:w-[40vw] lg:w-[21vw]",
];

export default function VideoFeedback() {
  const railRef = useRef(null);

  const slide = (direction) => {
    if (!railRef.current) return;
    const card = railRef.current.querySelector("[data-video-card]");
    const distance = card ? card.getBoundingClientRect().width + 16 : 280;
    railRef.current.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section
      id="feedback"
      aria-labelledby="feedback-title"
      className="overflow-hidden bg-[#A4A9AE] py-12 text-white sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1600px]">
        <h2
          id="feedback-title"
          className="mb-8 px-5 text-center font-display text-3xl font-medium tracking-wide text-[#f2f5f7] sm:mb-12 sm:text-4xl lg:text-4xl"
        >
          Real stories. Real routines.
        </h2>

        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:gap-5 sm:px-8 lg:px-12 [scrollbar-color:#8fb6de55_transparent] [scrollbar-width:thin]"
        >
          {VIDEOS.map((video) => (
            <div
              key={video}
              data-video-card
              className={`${VIDEO_WIDTHS[video - 1]} h-[min(62svh,680px)] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-xl border border-white/10 bg-[#080d13] shadow-[0_20px_55px_-30px_rgba(0,0,0,0.9)]`}
            >
              <video
                className="block h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label={`Customer feedback video ${video}`}
              >
                <source src="/notwo.mp4" type="video/mp4" />
                Your browser does not support video playback.
              </video>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-2 px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => slide(-1)}
            aria-label="Scroll feedback videos left"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#16336F] bg-[#16336F] text-[#EFEDDE] transition hover:bg-[#16336F]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0BEE1]"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path d="m15 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            aria-label="Scroll feedback videos right"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#16336F] bg-[#16336F] text-[#EFEDDE] transition hover:bg-[#16336F]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0BEE1]"
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
