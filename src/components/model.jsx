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

// NO TWO brand palette — Dark Azure / Light Azure / Onyx / Paper White
const GRADIENT =
  "linear-gradient(115deg, #14263F 0%, #1B3A5C 30%, #2F5D85 55%, #4A90C2 75%, #8FC1E8 100%)";

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
    modelRef.current.position.y += Math.sin(time * 1.5) * 0.02;

    if (calloutRef.current) {
      calloutRef.current.style.opacity = calloutOpacityRef.current.value;
    }
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#F5F7FA" castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#8FC1E8" />

      <group ref={modelRef} dispose={null}>
        <primitive object={clonedScene} />

        <ContactShadows
          position={[0, -0.4, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
          color="#0a0a0c"
        />

        {/* Dynamic Callout 01 */}
        <Html
          position={[0.5, 1.2, 0.5]}
          center
          className="pointer-events-none"
        >
          <div ref={calloutRef} className="relative flex w-[240px] flex-row items-center gap-4 opacity-0 md:flex-col md:items-start md:gap-0">
            <div className="z-10 h-2 w-2 rounded-full bg-[#8fb6de] shadow-[0_0_10px_rgba(143,182,222,0.7)]" />
            <div className="ml-[3px] mt-[-4px] hidden h-12 w-px bg-gradient-to-b from-[#8fb6de] to-transparent md:block" />
            <div className="rounded-lg border border-[#8fb6de]/25 bg-[#0a1020]/90 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <p className="mb-1 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.15em] text-[#8fb6de]">Sensor Array</p>
              <p className="font-[family-name:var(--font-mono)] text-sm font-medium text-white">Multi-spectral lens</p>
            </div>
          </div>
        </Html>
      </group>
    </>
  );
}

// Preload so the model starts fetching as soon as the module is imported.
useGLTF.preload("/model.glb");

/**
 * Main Section Component
 */
export default function Model() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);

  // References for all our text blocks
  const introCopyRef = useRef(null);
  const analysisCopyRef = useRef(null);
  const midSpecCopyRef = useRef(null);
  const specsLeftRef = useRef(null);
  const specsRightRef = useRef(null);
  const calloutOpacityRef = useRef({ value: 0 });

  const proxyRef = useRef({
    x: 0, 
    y: -0.2,
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
          gsap.set(calloutOpacityRef.current, { value: 0 });

          if (isDesktop) {
            gsap.set(introCopyRef.current, { opacity: 1, x: 0, y: 0 });
            gsap.set([analysisCopyRef.current, specsLeftRef.current], { opacity: 0, x: -40, y: 0 });
            gsap.set([midSpecCopyRef.current, specsRightRef.current], { opacity: 0, x: 40, y: 0 });
            gsap.set(proxyRef.current, { x: -1.8, y: -0.2, rotX: 0, rotY: 0.15, rotZ: 0, scale: 1 });
          } else if (isMobile) {
            gsap.set(introCopyRef.current, { opacity: 1, x: 0, y: 0 });
            gsap.set([analysisCopyRef.current, midSpecCopyRef.current, specsLeftRef.current, specsRightRef.current], { opacity: 0, x: 0, y: 20 });
            gsap.set(proxyRef.current, { x: 0, y: 0.5, rotX: 0, rotY: 0.15, rotZ: 0, scale: 0.85 });
          }
        };

        if (reduceMotion) {
          gsap.set([
            introCopyRef.current, 
            analysisCopyRef.current, 
            midSpecCopyRef.current, 
            specsLeftRef.current, 
            specsRightRef.current
          ], { opacity: 1, position: "relative" });
          return;
        }

        setInitialState();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * (isDesktop ? 2.1 : 1.75))}`,
            scrub: 0.5,
            pin: pinRef.current,
            invalidateOnRefresh: true, 
            onRefreshInit: setInitialState,
          },
        });

        // ============================================
        // DESKTOP TIMELINE
        // ============================================
        if (isDesktop) {
          tl.addLabel("step1")
            .to(introCopyRef.current, { opacity: 0, x: 40, duration: 0.8 }, "step1")
            .to(proxyRef.current, {
              x: 1.8, y: -0.5, rotY: -0.9, rotX: 0.15, scale: 1.1, duration: 1.2, ease: "power2.inOut",
            }, "step1")
            .to(analysisCopyRef.current, { opacity: 1, x: 0, duration: 0.8 }, "step1+=0.5");

          tl.addLabel("step2", "+=0.3")
            .to(analysisCopyRef.current, { opacity: 0, x: -40, duration: 0.8 }, "step2")
            .to(proxyRef.current, {
              x: -1.8, y: -0.2, rotY: 0.9, rotX: -0.1, scale: 1.1, duration: 1.2, ease: "power2.inOut",
            }, "step2")
            .to(calloutOpacityRef.current, { value: 1, duration: 0.5 }, "step2+=0.4")
            .to(midSpecCopyRef.current, { opacity: 1, x: 0, duration: 0.8 }, "step2+=0.5");

          tl.addLabel("step3", "+=0.3")
            .to(calloutOpacityRef.current, { value: 0, duration: 0.5 }, "step3")
            .to(midSpecCopyRef.current, { opacity: 0, x: 40, duration: 0.8 }, "step3")
            .to(proxyRef.current, {
              x: 0, y: -0.1, rotY: 0, rotX: 0.05, scale: 1.7, duration: 1.5, ease: "power2.inOut"
            }, "step3")
            .to(specsLeftRef.current, { opacity: 1, x: 0, duration: 0.8 }, "step3+=0.8")
            .to(specsRightRef.current, { opacity: 1, x: 0, duration: 0.8 }, "step3+=0.8");
        } 
        // ============================================
        // MOBILE TIMELINE
        // ============================================
        else if (isMobile) {
          tl.addLabel("step1")
            .to(introCopyRef.current, { opacity: 0, y: -20, duration: 0.8 }, "step1")
            .to(proxyRef.current, {
              x: 0, y: 0.45, rotY: -0.9, rotX: 0.15, scale: 0.9, duration: 1.2, ease: "power2.inOut",
            }, "step1")
            .to(analysisCopyRef.current, { opacity: 1, y: 0, duration: 0.8 }, "step1+=0.5");

          tl.addLabel("step2", "+=0.3")
            .to(analysisCopyRef.current, { opacity: 0, y: -20, duration: 0.8 }, "step2")
            .to(proxyRef.current, {
              x: 0, y: 0.45, rotY: 0.9, rotX: -0.1, scale: 0.9, duration: 1.2, ease: "power2.inOut",
            }, "step2")
            .to(calloutOpacityRef.current, { value: 1, duration: 0.5 }, "step2+=0.4")
            .to(midSpecCopyRef.current, { opacity: 1, y: 0, duration: 0.8 }, "step2+=0.5");

          tl.addLabel("step3", "+=0.3")
            .to(calloutOpacityRef.current, { value: 0, duration: 0.5 }, "step3")
            .to(midSpecCopyRef.current, { opacity: 0, y: -20, duration: 0.8 }, "step3")
            .to(proxyRef.current, {
              x: 0, y: 0.7, rotY: 0, rotX: 0.05, scale: 1.1, duration: 1.5, ease: "power2.inOut" 
            }, "step3")
            .to(specsLeftRef.current, { opacity: 1, y: 0, duration: 0.8 }, "step3+=0.8")
            .to(specsRightRef.current, { opacity: 1, y: 0, duration: 0.8 }, "step3+=1.0");
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
      className={`${display.variable} ${mono.variable} relative w-full bg-[#0a1020]`}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-[#0a1020]">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(143,182,222,1) 1px, transparent 1px), linear-gradient(90deg, rgba(143,182,222,1) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div className="pointer-events-none absolute -left-40 top-1/2 z-0 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full bg-[#8fb6de]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-[-12rem] z-0 h-[36rem] w-[36rem] rounded-full bg-[#16224a]/80 blur-3xl" />

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

      <div className="relative z-20 h-full w-full mx-auto max-w-7xl px-6 pointer-events-none">
        
        {/* INTRO TEXT */}
        <div 
          ref={introCopyRef}
          className="absolute bottom-[10%] md:bottom-auto md:top-[20%] left-6 right-6 md:left-auto md:right-12 max-w-md pointer-events-auto"
        >
          <div className="flex items-center gap-3 mb-6 opacity-80">
             <div className="h-px w-8 bg-[#8fb6de]"></div>
             <span className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.2em] text-[#8fb6de]">The Philosophy</span>
          </div>
          <h2
            className="mb-6 font-[family-name:var(--font-display)] text-5xl md:text-6xl font-semibold italic leading-[1.05]"
            style={{
              backgroundImage: GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Don&rsquo;t Guess.
            <br />
            Know.
          </h2>
          <div className="space-y-4 font-[family-name:var(--font-mono)] text-base font-light leading-relaxed text-white/65 md:text-[1.1rem]">
            <p>Every skincare journey starts with one question.</p>
            <p className="font-medium italic text-white">What does your skin actually need?</p>
          </div>
        </div>

        {/* ANALYSIS TEXT */}
        <div 
          ref={analysisCopyRef}
          className="absolute bottom-[10%] md:bottom-auto md:top-[35%] left-6 right-6 md:right-auto md:left-12 max-w-sm pointer-events-auto"
        >
          <div className="flex items-center gap-3 mb-4">
             <span className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.2em] text-[#8fb6de]">Phase 01</span>
             <div className="h-px w-12 bg-gradient-to-r from-[#8fb6de] to-transparent"></div>
          </div>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-4xl font-semibold italic text-white">
            Precision<br/>Diagnostics
          </h2>
          <p className="font-[family-name:var(--font-mono)] text-sm font-light leading-relaxed text-white/65 md:text-base">
            Our system evaluates multiple parameters within minutes, transforming assumptions into absolute certainty.
          </p>
        </div>

        {/* MID-SPEC TEXT (3rd Position) */}
        <div 
          ref={midSpecCopyRef}
          className="absolute bottom-[10%] md:bottom-auto md:top-[35%] left-6 right-6 md:left-auto md:right-12 max-w-sm pointer-events-auto text-left"
        >
          <div className="flex items-center justify-start gap-3 mb-4 md:flex-row-reverse">
             <span className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.2em] text-[#8fb6de]">Phase 02</span>
             <div className="h-px w-12 bg-gradient-to-r from-[#8fb6de] to-transparent md:bg-gradient-to-l md:from-[#8fb6de] md:to-transparent"></div>
          </div>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-4xl font-semibold italic text-white">
            Deep Tissue<br/>Scanning
          </h2>
          <p className="font-[family-name:var(--font-mono)] text-sm font-light leading-relaxed text-white/65 md:text-base">
            By analyzing sub-surface layers, we expose hidden pigmentation, vascular conditions, and structural damage before they surface.
          </p>
        </div>

        {/* FINALE: LEFT SPECIFICATION */}
        <div 
          ref={specsLeftRef}
          className="absolute bottom-[35%] md:bottom-auto md:top-[40%] left-6 right-6 md:right-auto md:left-12 max-w-full md:max-w-[280px] pointer-events-auto text-left"
        >
          <h3 className="mb-2 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.25em] text-[#8fb6de]">Hardware Spec</h3>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl font-semibold italic text-white md:text-3xl">
            Spectral Imaging
          </h2>
          <div className="mb-4 h-px w-full bg-white/15"></div>
          <p className="font-[family-name:var(--font-mono)] text-sm font-light leading-relaxed text-white/65">
            High-resolution capture across 8 distinct light spectrums reveals exact conditions invisible to the human eye.
          </p>
        </div>

        {/* FINALE: RIGHT SPECIFICATION */}
        <div 
          ref={specsRightRef}
          className="absolute bottom-[6%] md:bottom-auto md:top-[40%] left-6 right-6 md:left-auto md:right-12 max-w-full md:max-w-[280px] pointer-events-auto text-left"
        >
          <h3 className="mb-2 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.25em] text-[#8fb6de]">Software Spec</h3>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl font-semibold italic text-white md:text-3xl">
            AI Processing
          </h2>
          <div className="mb-4 h-px w-full bg-white/15"></div>
          <p className="font-[family-name:var(--font-mono)] text-sm font-light leading-relaxed text-white/65">
            Advanced algorithms cross-reference millions of data points to generate your hyper-personalized daily protocol.
          </p>
        </div>

      </div>
      </div>
    </section>
  );
}
