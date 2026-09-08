"use client";

import { motion, useReducedMotion } from "framer-motion";
import StarField from "./Starfield";

// Brand tokens used here: Onyx (bg), Dark Azure (glow), Light Azure (accent/data),
// Sunset Orange (the "FORMULA NO." tag — a callback to the batch stickers on the
// steel coffee packaging in the brand deck).

const metrics = [
  { label: "Hydration", value: 82 },
  { label: "Barrier", value: 91 },
  { label: "Tone evenness", value: 68 },
  { label: "Elasticity", value: 76 },
];

const headlineLines = ["Skincare that", "reads your skin", "before you do."];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#0a0a0c] px-6 pb-20 pt-32 sm:px-10"
    >
      <StarField density={0.00012} />

      <div className="pointer-events-none absolute -top-32 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_#0a1020_0%,_transparent_70%)] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -top-10 left-1/2 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_#8fb6de_0%,_transparent_70%)] opacity-15 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1
            id="hero-title"
            className="max-w-2xl text-6xl font-semibold leading-[0.97] tracking-[-0.03em] text-white sm:text-7xl lg:text-[5.5rem]"
          >
            {headlineLines.map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="block bg-[linear-gradient(110deg,#f5f4ef_10%,#8c8d94_35%,#eeeef0_50%,#75767d_65%,#f5f4ef_90%)] bg-[length:220%_100%] bg-clip-text text-transparent animate-[shimmer_7s_linear_infinite] motion-reduce:animate-none"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 max-w-md text-lg leading-8 text-white/50"
          >
            A 30-second scan maps your skin&apos;s chemistry. NOTWO formulates
            the routine around it — one that no two people will ever share.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-10"
          >
            <button className="group relative overflow-hidden rounded-full bg-[#f5f4ef] px-8 py-4 text-sm font-semibold text-[#0a0a0c] transition-transform duration-300 hover:scale-[1.03]">
              <span className="relative z-10">Start your scan</span>
              <span className="absolute inset-0 -translate-x-full bg-[#8fb6de]/40 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </motion.div>
        </div>

        {/* Live scan telemetry panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          {/* Sunset Orange formula tag — echoes the batch-number stickers on the
              steel packaging (e.g. "NO.48", "NO.36") from the brand deck */}
          <span className="absolute -top-3 right-6 z-10 rounded-sm bg-[#e4572e] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#0a0a0c]">
            FORMULA NO.01
          </span>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md">
            {/* corner reticle marks */}
            <span className="absolute left-3 top-3 h-3 w-3 border-l border-t border-white/30" />
            <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-white/30" />
            <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-white/30" />
            <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-white/30" />

            {/* scanning sweep */}
            {!shouldReduceMotion && (
              <motion.div
                aria-hidden="true"
                initial={{ y: "-100%" }}
                animate={{ y: "220%" }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#8fb6de]/20 to-transparent"
              />
            )}

            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.15em] text-white/35">Live scan</span>
              <span className="flex items-center gap-1.5 text-[11px] text-[#8fb6de]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8fb6de] motion-reduce:animate-none" />
                analyzing
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {metrics.map((metric, i) => (
                <div key={metric.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white/60">{metric.label}</span>
                    <span className="font-medium tabular-nums text-white/80">{metric.value}%</span>
                  </div>
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: "0%" }}
                      whileInView={{ width: `${metric.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#8fb6de] to-[#a9bfe3]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}