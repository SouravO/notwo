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
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const mono = Space_Grotesk({
  subsets: ["latin"],
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
    // Very small vertical floating motion
    modelRef.current.position.y += Math.sin(time * 1.2) * 0.015;

    if (calloutRef.current) {
      calloutRef.current.style.opacity = calloutOpacityRef.current.value;
    }
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      {/* Crisp, clean, non-blue lighting */}
      <directionalLight position={[5, 10, 5]} intensity={1.8} color="#ffffff" castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#e2e8f0" />

      <group ref={modelRef} dispose={null}>
        <primitive object={clonedScene} />

        <ContactShadows
          position={[0, -0.4, 0]}
          opacity={0.6}
          scale={10}
          blur={2.5}
          far={4}
          color="#000000"
        />

        {/* Minimalist Restrained Callout */}
        <Html
          position={[0.5, 1.2, 0.5]}
          center
          className="pointer-events-none"
        >
          <div ref={calloutRef} className="relative flex w-[180px] flex-row items-center gap-3 opacity-0 transition-opacity duration-300">
            <div className="z-10 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <div className="h-px w-6 bg-white/40" />
            <div className="flex flex-col">
              <p className="font-[family-name:var(--font-mono)] text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">
                Sensor Array
              </p>
              <p className="font-[family-name:var(--font-mono)] text-xs font-medium text-white/90">
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
export default function Model() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);

  // 4 Story Points Refs
  const r1Ref = useRef(null); // Step 01 - Analyze (Right)
  const r2Ref = useRef(null); // Step 02 - Understand (Left)
  const r3Ref = useRef(null); // Step 03 - Personalize (Right)
  const r4Ref = useRef(null); // Step 04 - Transform (Left)
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
    let resizeObserver;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)"
      }, (context) => {
        let { isDesktop, isMobile, reduceMotion } = context.conditions;

        const setInitialState = () => {
          if (isDesktop) {
            // Desktop: Model strictly partitioned to one side, Text strictly on the other.
            gsap.set(calloutOpacityRef.current, { value: 1 });
            gsap.set(r1Ref.current, { opacity: 1, x: 0, y: 0, display: "block" });
            gsap.set(r2Ref.current, { opacity: 0, x: -40, y: 0, display: "none" });
            gsap.set(r3Ref.current, { opacity: 0, x: 40, y: 0, display: "none" });
            gsap.set(r4Ref.current, { opacity: 0, x: -40, y: 0, display: "none" });
            gsap.set(proxyRef.current, { x: -2.2, y: -0.2, rotX: 0.05, rotY: 0.25, rotZ: 0, scale: 1.05 });
          } else if (isMobile) {
            // Mobile: Model top, Text bottom sequence
            gsap.set(calloutOpacityRef.current, { value: 1 });
            gsap.set(r1Ref.current, { opacity: 1, x: 0, y: 0, display: "block" });
            gsap.set([r2Ref.current, r3Ref.current, r4Ref.current], { opacity: 0, x: 0, y: 20, display: "none" });
            gsap.set(proxyRef.current, { x: 0, y: 0.8, rotX: 0, rotY: 0.15, rotZ: 0, scale: 0.8 });
          }
        };

        if (reduceMotion) {
          gsap.set([r1Ref.current, r2Ref.current, r3Ref.current, r4Ref.current], { 
            opacity: 1, position: "relative", transform: "none", display: "block", marginBottom: "3rem" 
          });
          return;
        }

        setInitialState();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 3.5)}`, // Plenty of scroll length for 4 stages
            scrub: 0.8,
            pin: pinRef.current,
            invalidateOnRefresh: true, 
            onRefreshInit: setInitialState,
          },
        });

        // ============================================
        // DESKTOP TIMELINE (Strict 4-Stage Alternating)
        // ============================================
        if (isDesktop) {
          // STAGE 1 -> 2: Model travels Right, R2 text enters Left
          tl.addLabel("stage2")
            .to(r1Ref.current, { opacity: 0, x: 40, duration: 0.6, display: "none" }, "stage2")
            .to(calloutOpacityRef.current, { value: 0, duration: 0.3 }, "stage2") // Hide callout to avoid text collision
            .to(proxyRef.current, {
              x: 2.2, y: -0.3, rotY: -0.6, rotX: 0.1, scale: 1.1, duration: 1.2, ease: "power2.inOut",
            }, "stage2")
            .set(r2Ref.current, { display: "block" }, "stage2+=0.6")
            .to(r2Ref.current, { opacity: 1, x: 0, duration: 0.6 }, "stage2+=0.6");

          // STAGE 2 -> 3: Model travels Left, R3 text enters Right
          tl.addLabel("stage3", "+=0.4")
            .to(r2Ref.current, { opacity: 0, x: -40, duration: 0.6, display: "none" }, "stage3")
            .to(proxyRef.current, {
              x: -2.2, y: -0.1, rotY: 0.7, rotX: -0.05, scale: 1.2, duration: 1.2, ease: "power2.inOut",
            }, "stage3")
            .to(calloutOpacityRef.current, { value: 1, duration: 0.4 }, "stage3+=0.8") // Show callout safely on left
            .set(r3Ref.current, { display: "block" }, "stage3+=0.6")
            .to(r3Ref.current, { opacity: 1, x: 0, duration: 0.6 }, "stage3+=0.6");

          // STAGE 3 -> 4: Model travels Right, R4 text enters Left
          tl.addLabel("stage4", "+=0.4")
            .to(r3Ref.current, { opacity: 0, x: 40, duration: 0.6, display: "none" }, "stage4")
            .to(calloutOpacityRef.current, { value: 0, duration: 0.3 }, "stage4")
            .to(proxyRef.current, {
              x: 2.2, y: -0.2, rotY: -0.3, rotX: 0.15, scale: 1.15, duration: 1.2, ease: "power2.inOut"
            }, "stage4")
            .set(r4Ref.current, { display: "block" }, "stage4+=0.6")
            .to(r4Ref.current, { opacity: 1, x: 0, duration: 0.6 }, "stage4+=0.6");
        } 
        // ============================================
        // MOBILE TIMELINE (Vertical Stack Preservation)
        // ============================================
        else if (isMobile) {
          // STAGE 1 -> 2
          tl.addLabel("stage2")
            .to(r1Ref.current, { opacity: 0, y: -20, duration: 0.6, display: "none" }, "stage2")
            .to(proxyRef.current, {
              x: 0, y: 0.8, rotY: -0.7, rotX: 0.1, scale: 0.85, duration: 1.2, ease: "power2.inOut",
            }, "stage2")
            .set(r2Ref.current, { display: "block" }, "stage2+=0.6")
            .to(r2Ref.current, { opacity: 1, y: 0, duration: 0.6 }, "stage2+=0.6");

          // STAGE 2 -> 3
          tl.addLabel("stage3", "+=0.4")
            .to(r2Ref.current, { opacity: 0, y: -20, duration: 0.6, display: "none" }, "stage3")
            .to(proxyRef.current, {
              x: 0, y: 0.8, rotY: 0.7, rotX: -0.05, scale: 0.9, duration: 1.2, ease: "power2.inOut",
            }, "stage3")
            .set(r3Ref.current, { display: "block" }, "stage3+=0.6")
            .to(r3Ref.current, { opacity: 1, y: 0, duration: 0.6 }, "stage3+=0.6");

          // STAGE 3 -> 4
          tl.addLabel("stage4", "+=0.4")
            .to(r3Ref.current, { opacity: 0, y: -20, duration: 0.6, display: "none" }, "stage4")
            .to(proxyRef.current, {
              x: 0, y: 0.8, rotY: -0.15, rotX: 0.15, scale: 0.95, duration: 1.2, ease: "power2.inOut" 
            }, "stage4")
            .set(r4Ref.current, { display: "block" }, "stage4+=0.6")
            .to(r4Ref.current, { opacity: 1, y: 0, duration: 0.6 }, "stage4+=0.6");
        }
      });

      resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });
      resizeObserver.observe(document.body);

      document.fonts?.ready?.then(() => {
        ScrollTrigger.refresh();
      });

    }, sectionRef);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section 
      id="model" 
      ref={sectionRef} 
      className={`${display.variable} ${mono.variable} relative w-full bg-black`}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-black">
        
        {/* Extremely Subtle Cool-Dark Atmospheric Depth (No blue grid, no oversized blobs) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-[100px]" />

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

        {/* LAYOUT ARCHITECTURE: 45% L/R Zones ensuring zero overlap */}
        <div className="relative z-20 h-full w-full mx-auto max-w-[1440px] pointer-events-none">
          
          {/* ROUND 1: Text Right (45% Width) */}
          <div 
            ref={r1Ref}
            className="absolute top-1/2 -translate-y-1/2 right-[5%] w-[42%] max-md:right-6 max-md:left-6 max-md:w-auto max-md:top-auto max-md:bottom-[10%] max-md:translate-y-0 pointer-events-auto"
          >
            <div className="flex items-center gap-3 mb-6 opacity-80">
               <div className="h-px w-8 bg-white/40"></div>
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

          {/* ROUND 2: Text Left (45% Width) */}
          <div 
            ref={r2Ref}
            className="absolute top-1/2 -translate-y-1/2 left-[5%] w-[42%] max-md:right-6 max-md:left-6 max-md:w-auto max-md:top-auto max-md:bottom-[10%] max-md:translate-y-0 pointer-events-auto"
          >
            <div className="flex items-center gap-3 mb-6 opacity-80">
               <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">Step 02</span>
               <div className="h-px w-12 bg-gradient-to-r from-white/40 to-transparent"></div>
            </div>
            <h2 className="mb-6 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-medium italic leading-[1.1] text-[#f8fafc] drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              Understand
            </h2>
            <p className="font-[family-name:var(--font-mono)] text-base font-light leading-relaxed text-white/60 md:text-lg">
              Receive complete report explaining your skin condition.
            </p>
          </div>

          {/* ROUND 3: Text Right (45% Width) */}
          <div 
            ref={r3Ref}
            className="absolute top-1/2 -translate-y-1/2 right-[5%] w-[42%] max-md:right-6 max-md:left-6 max-md:w-auto max-md:top-auto max-md:bottom-[10%] max-md:translate-y-0 pointer-events-auto text-left"
          >
            <div className="flex items-center justify-start gap-3 mb-6 opacity-80 md:flex-row-reverse">
               <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">Step 03</span>
               <div className="h-px w-12 bg-gradient-to-r from-white/40 to-transparent md:bg-gradient-to-l md:from-white/40 md:to-transparent"></div>
            </div>
            <h2 className="mb-6 font-[family-name:var(--font-display)] text-4xl md:text-5xl font-medium italic leading-[1.1] text-[#f8fafc] drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              Personalize
            </h2>
            <p className="font-[family-name:var(--font-mono)] text-base font-light leading-relaxed text-white/60 md:text-lg">
              Experts recommend skincare routine based on your unique skin profile.
            </p>
          </div>

          {/* ROUND 4: Text Left (45% Width) */}
          <div 
            ref={r4Ref}
            className="absolute top-1/2 -translate-y-1/2 left-[5%] w-[42%] max-md:right-6 max-md:left-6 max-md:w-auto max-md:top-auto max-md:bottom-[10%] max-md:translate-y-0 pointer-events-auto text-left"
          >
            <div className="flex items-center gap-3 mb-6 opacity-80">
               <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">Step 04</span>
               <div className="h-px w-12 bg-gradient-to-r from-white/40 to-transparent"></div>
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