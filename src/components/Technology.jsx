"use client";

import { useEffect, useRef, useMemo, Suspense } from "react";
import { Bodoni_Moda, Space_Grotesk } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Html, useGLTF } from "@react-three/drei";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const display = Bodoni_Moda({
  subsets: ["latin"],
  preload: false,
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const mono = Space_Grotesk({
  subsets: ["latin"],
  preload: false,
  weight: ["300", "400", "500"],
  variable: "--font-mono",
});

/**
 * 3D Model Component
 */
function SkinAnalyzerScene({ proxyRef, calloutOpacityRef }) {
  const modelRef = useRef(null);
  const calloutRef = useRef(null);
  const { scene } = useGLTF("/model.glb");

  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  useFrame((state) => {
    if (!modelRef.current) return;
    const proxy = proxyRef.current;

    modelRef.current.position.set(proxy.x, proxy.y, proxy.z);
    modelRef.current.rotation.set(proxy.rotX, proxy.rotY, proxy.rotZ);
    modelRef.current.scale.setScalar(proxy.scale);

    const time = state.clock.getElapsedTime();
    // Subtle cinematic floating movement
    modelRef.current.position.y += Math.sin(time * 1.5) * 0.012;
    modelRef.current.rotation.x += Math.cos(time * 1.2) * 0.002;

    if (calloutRef.current) {
      calloutRef.current.style.opacity = calloutOpacityRef.current.value;
    }
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      {/* Neutral white key light, soft cool-silver fill for metallic clinical feel */}
      <directionalLight position={[5, 10, 5]} intensity={2.0} color="#ffffff" castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.9} color="#f1f5f9" />
      <spotLight position={[0, 2, 10]} intensity={0.6} color="#ffffff" penumbra={1} />

      <group ref={modelRef} dispose={null}>
        <primitive object={clonedScene} />

        <ContactShadows
          position={[0, -0.4, 0]}
          opacity={0.7}
          scale={12}
          blur={3}
          far={5}
          color="#000000"
        />

        {/* Cleaner Restrained Callout */}
        <Html
          position={[0.6, 1.2, 0.4]}
          center
          className="pointer-events-none"
        >
          <div ref={calloutRef} className="relative flex w-[160px] flex-row items-center gap-3 opacity-0 transition-opacity duration-300">
            <div className="z-10 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)]" />
            <div className="h-px w-5 bg-white/50" />
            <div className="flex flex-col">
              <p className="font-[family-name:var(--font-mono)] text-[9px] font-bold uppercase tracking-[0.25em] text-white/70">
                Sensor Array
              </p>
              <p className="font-[family-name:var(--font-mono)] text-xs font-medium text-white">
                Multi-spectral lens
              </p>
            </div>
          </div>
        </Html>
      </group>
    </>
  );
}

useGLTF.preload("/model.glb");

/**
 * Main Section Component
 */
export default function Technology() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);

  // Presentation Refs
  const bannerRef = useRef(null);
  const bgGlowRef = useRef(null);
  const bgSweepRef = useRef(null);

  // 4 Story Points Refs
  const r1Ref = useRef(null); // Stage 01 - Analyze
  const r2Ref = useRef(null); // Stage 02 - Understand
  const r3Ref = useRef(null); // Stage 03 - Personalize
  const r4Ref = useRef(null); // Stage 04 - Transform
  const calloutOpacityRef = useRef({ value: 0 });

  const proxyRef = useRef({
    x: 0,
    y: 0,
    z: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    scale: 1,
  });

  useEffect(() => {
    let ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"
      }, (context) => {
        let { isDesktop, isMobile, reduceMotion } = context.conditions;

        if (reduceMotion) {
          gsap.set(bannerRef.current, { position: "relative", opacity: 1, filter: "none", height: "60vh" });
          gsap.set([r1Ref.current, r2Ref.current, r3Ref.current, r4Ref.current], {
            opacity: 1, position: "relative", transform: "none", display: "block", width: "100%", padding: "3rem 1.5rem", marginTop: "2rem"
          });
          gsap.set(pinRef.current, { height: "auto", overflow: "visible" });
          return;
        }

        // Initial setup
        gsap.set(bannerRef.current, { opacity: 1, scale: 1, filter: "blur(0px)", display: "flex" });
        gsap.set([r1Ref.current, r2Ref.current, r3Ref.current, r4Ref.current], { opacity: 0, display: "none" });
        gsap.set(bgGlowRef.current, { opacity: 0 });
        gsap.set(bgSweepRef.current, { xPercent: -100 });

        if (isDesktop) {
          gsap.set(r1Ref.current, { x: 40 });
          gsap.set(r2Ref.current, { x: -40 });
          gsap.set(r3Ref.current, { x: 40 });
          gsap.set(r4Ref.current, { x: -40 });
          // Model hidden slightly behind and scaled down during banner intro
          gsap.set(proxyRef.current, { x: 0, y: 0, rotX: 0, rotY: 0, rotZ: 0, scale: 0.7 });
        } else {
          gsap.set([r1Ref.current, r2Ref.current, r3Ref.current, r4Ref.current], { y: 30 });
          gsap.set(proxyRef.current, { x: 0, y: 0.2, rotX: 0, rotY: 0, rotZ: 0, scale: 0.6 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 5)}`,
            scrub: 0.8,
            pin: pinRef.current,
            invalidateOnRefresh: true,
          },
        });

        // ============================================
        // INTRO (Banner fade out, Model moves to Stage 1)
        // ============================================
        tl.addLabel("intro")
          .to(bannerRef.current, { opacity: 0, scale: 1.05, filter: "blur(12px)", duration: 1.5, ease: "power3.inOut" }, "intro")
          .to(bgGlowRef.current, { opacity: 0.15, duration: 1.5 }, "intro")
          .to(proxyRef.current, {
            x: isDesktop ? -2.2 : 0,
            y: isDesktop ? -0.2 : 0.8,
            rotX: 0.05,
            rotY: 0.25,
            scale: isDesktop ? 1.05 : 0.85,
            duration: 1.5,
            ease: "power3.inOut"
          }, "intro")
          .set(bannerRef.current, { display: "none" }, "intro+=1.5")
          .set(r1Ref.current, { display: "block" }, "intro+=1.0")
          .to(r1Ref.current, { opacity: 1, x: 0, y: 0, duration: 0.8, ease: "power3.out" }, "intro+=1.0")
          .to(calloutOpacityRef.current, { value: 1, duration: 0.5 }, "intro+=1.2")
          // HOLD STAGE 1
          .to({}, { duration: 1.0 });

        // ============================================
        // STAGE 2 (UNDERSTAND)
        // ============================================
        tl.addLabel("stage2")
          .to(r1Ref.current, { opacity: 0, x: isDesktop ? 40 : 0, y: isDesktop ? 0 : -20, duration: 0.6, ease: "power3.inOut" }, "stage2")
          .set(r1Ref.current, { display: "none" }, "stage2+=0.6")
          .to(calloutOpacityRef.current, { value: 0, duration: 0.3 }, "stage2")
          .to(bgGlowRef.current, { opacity: 0.3, duration: 1.2 }, "stage2")
          .fromTo(bgSweepRef.current, { xPercent: -100 }, { xPercent: 100, duration: 1.2, ease: "power3.inOut" }, "stage2")
          .to(proxyRef.current, {
            x: isDesktop ? 2.2 : 0,
            y: isDesktop ? -0.3 : 0.8,
            rotY: isDesktop ? -0.6 : -0.7,
            rotX: 0.1,
            scale: isDesktop ? 1.1 : 0.85,
            duration: 1.2,
            ease: "power3.inOut"
          }, "stage2")
          .set(r2Ref.current, { display: "block" }, "stage2+=0.8")
          .to(r2Ref.current, { opacity: 1, x: 0, y: 0, duration: 0.6, ease: "power3.out" }, "stage2+=0.8")
          // HOLD STAGE 2
          .to({}, { duration: 1.0 });

        // ============================================
        // STAGE 3 (PERSONALIZE)
        // ============================================
        tl.addLabel("stage3")
          .to(r2Ref.current, { opacity: 0, x: isDesktop ? -40 : 0, y: isDesktop ? 0 : -20, duration: 0.6, ease: "power3.inOut" }, "stage3")
          .set(r2Ref.current, { display: "none" }, "stage3+=0.6")
          .to(bgGlowRef.current, { opacity: 0.5, duration: 1.2 }, "stage3")
          .fromTo(bgSweepRef.current, { xPercent: -100 }, { xPercent: 100, duration: 1.2, ease: "power3.inOut" }, "stage3")
          .to(proxyRef.current, {
            x: isDesktop ? -2.2 : 0,
            y: isDesktop ? -0.1 : 0.8,
            rotY: 0.7,
            rotX: -0.05,
            scale: isDesktop ? 1.2 : 0.9,
            duration: 1.2,
            ease: "power3.inOut"
          }, "stage3")
          .set(r3Ref.current, { display: "block" }, "stage3+=0.8")
          .to(r3Ref.current, { opacity: 1, x: 0, y: 0, duration: 0.6, ease: "power3.out" }, "stage3+=0.8")
          .to(calloutOpacityRef.current, { value: 1, duration: 0.5 }, "stage3+=1.0")
          // HOLD STAGE 3
          .to({}, { duration: 1.0 });

        // ============================================
        // STAGE 4 (TRANSFORM)
        // ============================================
        tl.addLabel("stage4")
          .to(r3Ref.current, { opacity: 0, x: isDesktop ? 40 : 0, y: isDesktop ? 0 : -20, duration: 0.6, ease: "power3.inOut" }, "stage4")
          .set(r3Ref.current, { display: "none" }, "stage4+=0.6")
          .to(calloutOpacityRef.current, { value: 0, duration: 0.3 }, "stage4")
          .to(bgGlowRef.current, { opacity: 0.8, duration: 1.2 }, "stage4")
          .fromTo(bgSweepRef.current, { xPercent: -100 }, { xPercent: 100, duration: 1.2, ease: "power3.inOut" }, "stage4")
          .to(proxyRef.current, {
            x: isDesktop ? 2.2 : 0,
            y: isDesktop ? -0.2 : 0.8,
            rotY: -0.3,
            rotX: 0.15,
            scale: isDesktop ? 1.15 : 0.95,
            duration: 1.2,
            ease: "power3.inOut"
          }, "stage4")
          .set(r4Ref.current, { display: "block" }, "stage4+=0.8")
          .to(r4Ref.current, { opacity: 1, x: 0, y: 0, duration: 0.6, ease: "power3.out" }, "stage4+=0.8")
          // HOLD STAGE 4
          .to({}, { duration: 1.0 });

        // ============================================
        // FINAL OUTRO
        // ============================================
        tl.addLabel("final")
          .to(bgGlowRef.current, { opacity: 0.1, duration: 1.5, ease: "power3.inOut" }, "final");

      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="technology"
      ref={sectionRef}
      className={`${display.variable} ${mono.variable} relative w-full bg-black`}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-black">

        {/* Intro Cinematic Banner */}
        <div ref={bannerRef} className="absolute inset-0 z-30 flex items-center justify-center bg-black">
          <img
            src="/TechnologyBanner.png"
            alt="Skin Analysis Technology"
            className="w-full h-full object-cover opacity-90"
            style={{
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)',
            }}
          />
        </div>

        {/* Ambient Silver Glow Background */}
        <div ref={bgGlowRef} className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300/[0.04] blur-[100px] transition-opacity" />

        {/* Subtle Metallic Light Sweep */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div ref={bgSweepRef} className="absolute inset-0 flex items-center justify-center -translate-x-full">
            <div className="h-[200%] w-[100px] md:w-[250px] rotate-[25deg] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl" />
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-10">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <Suspense fallback={null}>
              <SkinAnalyzerScene
                proxyRef={proxyRef}
                calloutOpacityRef={calloutOpacityRef}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* LAYOUT ARCHITECTURE: Protected Desktop L/R Zones, Mobile bottom lock */}
        <div className="relative z-20 h-full w-full mx-auto max-w-[1440px] pointer-events-none">

          {/* ROUND 1: Text Right */}
          <div
            ref={r1Ref}
            className="absolute top-1/2 -translate-y-1/2 right-[5%] w-[42%] max-md:left-0 max-md:right-0 max-md:w-full max-md:top-auto max-md:bottom-[8%] max-md:translate-y-0 max-md:px-6 pointer-events-auto"
          >
            <div className="flex items-center gap-3 mb-6 opacity-80">
               <div className="h-px w-8 bg-white/50"></div>
               <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">Step 01</span>
            </div>
            <h2 className="mb-6 font-[family-name:var(--font-display)] text-5xl md:text-[4rem] font-medium italic leading-[1.05] text-[#f8fafc] drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              Analyze
            </h2>
            <div className="space-y-4 font-[family-name:var(--font-mono)] text-base font-light leading-relaxed text-white/60 md:text-lg">
              <p>Your skin scanned using</p>
              <p className="font-medium text-white/90">professional skin analysis technology.</p>
            </div>
          </div>

          {/* ROUND 2: Text Left */}
          <div
            ref={r2Ref}
            className="absolute top-1/2 -translate-y-1/2 left-[5%] w-[42%] max-md:left-0 max-md:right-0 max-md:w-full max-md:top-auto max-md:bottom-[8%] max-md:translate-y-0 max-md:px-6 pointer-events-auto"
          >
            <div className="flex items-center gap-3 mb-6 opacity-80">
               <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">Step 02</span>
               <div className="h-px w-12 bg-gradient-to-r from-white/50 to-transparent"></div>
            </div>
            <h2 className="mb-6 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-medium italic leading-[1.1] text-[#f8fafc] drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              Understand
            </h2>
            <p className="font-[family-name:var(--font-mono)] text-base font-light leading-relaxed text-white/60 md:text-lg">
              Receive complete report explaining your skin condition.
            </p>
          </div>

          {/* ROUND 3: Text Right */}
          <div
            ref={r3Ref}
            className="absolute top-1/2 -translate-y-1/2 right-[5%] w-[42%] max-md:left-0 max-md:right-0 max-md:w-full max-md:top-auto max-md:bottom-[8%] max-md:translate-y-0 max-md:px-6 pointer-events-auto text-left"
          >
            <div className="flex items-center justify-start gap-3 mb-6 opacity-80 md:flex-row-reverse">
               <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">Step 03</span>
               <div className="h-px w-12 bg-gradient-to-r from-white/50 to-transparent md:bg-gradient-to-l md:from-white/50 md:to-transparent"></div>
            </div>
            <h2 className="mb-6 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-medium italic leading-[1.1] text-[#f8fafc] drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              Personalize
            </h2>
            <p className="font-[family-name:var(--font-mono)] text-base font-light leading-relaxed text-white/60 md:text-lg">
              Experts recommend skincare routine based on your unique skin profile.
            </p>
          </div>

          {/* ROUND 4: Text Left */}
          <div
            ref={r4Ref}
            className="absolute top-1/2 -translate-y-1/2 left-[5%] w-[42%] max-md:left-0 max-md:right-0 max-md:w-full max-md:top-auto max-md:bottom-[8%] max-md:translate-y-0 max-md:px-6 pointer-events-auto text-left"
          >
            <div className="flex items-center gap-3 mb-6 opacity-80">
               <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">Step 04</span>
               <div className="h-px w-12 bg-gradient-to-r from-white/50 to-transparent"></div>
            </div>
            <h2 className="mb-6 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-medium italic leading-[1.1] text-[#f8fafc] drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              Transform
            </h2>
            <p className="font-[family-name:var(--font-mono)] text-base font-light leading-relaxed text-white/60 md:text-lg">
              Follow routine. Track improvements. Re-analyze periodically. Healthy skin becomes measurable.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
