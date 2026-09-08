"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight canvas starfield used behind dark sections for the space mood.
 * No external dependency — plain canvas + rAF, capped particle count,
 * and it fully respects prefers-reduced-motion.
 */
export default function StarField({ density = 0.00012, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let stars = [];
    let width, height;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const count = Math.min(Math.floor(width * height * density), 220);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.1 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.15,
        speed: Math.random() * 0.4 + 0.05,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        const twinkle = prefersReducedMotion
          ? star.baseAlpha
          : star.baseAlpha + Math.sin(time * 0.001 * star.speed + star.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(twinkle, 0)})`;
        ctx.fill();
      });
      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(draw);
      }
    };

    setup();
    draw(0);

    const handleResize = () => {
      cancelAnimationFrame(animationId);
      setup();
      draw(0);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}