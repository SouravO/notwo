"use client";

import { useEffect, useRef, useMemo, useState, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, Line, useGLTF } from "@react-three/drei";
import { AdditiveBlending, Box3, CanvasTexture, Vector3 } from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const CAM_Z = 5;
const HALF_TAN = Math.tan((45 * Math.PI) / 360);
const NORM_SIZE = 2.2;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

const STAGES = [
  { title: "Analyze", side: "r", lead: "Your skin scanned using", body: "professional skin analysis technology." },
  { title: "Understand", side: "l", lead: "Receive a complete report explaining", body: "your skin condition." },
  { title: "Personalize", side: "r", lead: "Experts recommend a skincare routine", body: "based on your unique skin profile." },
  { title: "Transform", side: "l", lead: "Follow routine. Track improvements. Re-analyze periodically.", body: "Healthy skin becomes measurable." },
];

const AI_NODES = [
  [-0.9, 0.7, 0.3],
  [0.0, 1.0, 0.3],
  [0.95, 0.55, 0.3],
  [1.0, -0.2, 0.3],
  [0.2, -0.85, 0.3],
  [-0.95, -0.3, 0.3],
];
const AI_EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 4]];
const makeProxy = () => ({
  x: 0, y: 0.02, z: -1.6, rotX: 0.05, rotY: -0.9, rotZ: 0, scale: 0.72,
  light: 0, rim: 0.6, lx: 0,
  zone: 0.5, overlays: 1, float: 1,
  scanY: 0, scanA: 0,
  sensor: 0, scanTag: 0, surface: 0, points: 0, ai: 0, progress: 0,
});

const REDUCED_POSE = {
  x: 0, y: 0, z: 0, scale: 1, rotX: 0.05, rotY: 0.4, rotZ: 0,
  light: 0.95, rim: 1, lx: 0.4, zone: 0.8, overlays: 0, float: 0, scanA: 0, ai: 0,
};

const SILVER = "radial-gradient(ellipse 48% 58% at 50% 46%, rgba(226,232,240,0.34) 0%, rgba(148,163,184,0.16) 34%, rgba(10,11,13,0) 70%)";
const COOL = "radial-gradient(ellipse 40% 50% at 50% 52%, rgba(147,170,205,0.22) 0%, rgba(147,170,205,0) 70%)";
const GRAPHITE = "linear-gradient(180deg, #050506 0%, #14161a 55%, #08090b 100%), linear-gradient(0deg, rgba(203,213,225,0.08), transparent 35%)";
const VIGNETTE = "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)";
const IMG_MASK = "radial-gradient(ellipse 78% 72% at 50% 50%, #000 42%, transparent 100%)";
const STREAK_MASK = "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)";
const STREAK_BG = "linear-gradient(100deg, transparent 0%, rgba(226,232,240,0.05) 30%, rgba(241,245,249,0.22) 48%, rgba(203,213,225,0.08) 62%, transparent 100%)";
const REDUCED_BG = "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(203,213,225,0.10), transparent 70%), linear-gradient(180deg, #000 0%, #0d0e11 50%, #000 100%)";
const TITLE_STYLE = {
  backgroundImage: "linear-gradient(180deg,#ffffff 8%,#e2e8f0 52%,#94a3b8 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

/* ------------------------------------------------------------------ */
/* 3D                                                                  */
/* ------------------------------------------------------------------ */

function makeScanTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  const img = g.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const v = (y / (size - 1) - 0.5) * 2;
      const u = (x / (size - 1) - 0.5) * 2;
      const a = Math.exp(-v * v * 14) * Math.min(1, (1 - Math.abs(u)) * 3.2);
      const i = (y * size + x) * 4;
      img.data[i] = 226;
      img.data[i + 1] = 232;
      img.data[i + 2] = 240;
      img.data[i + 3] = Math.round(255 * a);
    }
  }
  g.putImageData(img, 0, 0);
  return new CanvasTexture(canvas);
}

function AnalyzerScene({ proxyRef }) {
  const { scene } = useGLTF("/model.glb");
  const outer = useRef(null);
  const inner = useRef(null);
  const key = useRef(null);
  const fill = useRef(null);
  const rim = useRef(null);
  const ambient = useRef(null);
  const scan = useRef(null);
  const ai = useRef(null);
  const scanTex = useMemo(() => makeScanTexture(), []);

  const model = useMemo(() => {
    const object = scene.clone(true);
    object.updateMatrixWorld(true);
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const norm = NORM_SIZE / Math.max(size.x, size.y, size.z);
    const set = new Set();
    object.traverse((c) => {
      if (c.isMesh) [].concat(c.material).forEach((m) => set.add(m));
    });
    return {
      object,
      norm,
      center,
      w: Math.max(size.x, size.z) * norm,
      h: size.y * norm,
      mats: [...set].map((m) => ({ m, base: m.envMapIntensity ?? 1 })),
    };
  }, [scene]);

  // Three.js frame updates intentionally mutate scene objects and material values.
  /* eslint-disable react-hooks/immutability */
  useFrame((state) => {
    const p = proxyRef.current;
    const o = outer.current;
    if (!o) return;
    const t = state.clock.elapsedTime;

    const viewH = 2 * HALF_TAN * CAM_Z;
    const viewW = viewH * (state.size.width / state.size.height);
    const depth = (CAM_Z - p.z) / CAM_Z;
    o.position.set(p.x * viewW * depth, p.y * viewH * depth, p.z);
    o.scale.setScalar(Math.min(p.scale, (viewW * p.zone) / model.w));

    const f = p.float;
    inner.current.position.y = Math.sin(t * 1.2) * 0.012 * f;
    inner.current.rotation.set(
      p.rotX + Math.cos(t * 0.9) * 0.004 * f,
      p.rotY + Math.sin(t * 0.6) * 0.01 * f,
      p.rotZ
    );

    const L = p.light;
    key.current.intensity = 2.4 * L;
    key.current.position.set(p.lx * 5, 7, 6);
    fill.current.intensity = 0.9 * L;
    rim.current.intensity = 1.4 * p.rim * L;
    ambient.current.intensity = 0.25 * L;

    const env = 0.15 + 0.85 * L;
    state.scene.environmentIntensity = env;
    for (const e of model.mats) e.m.envMapIntensity = e.base * env;

    scan.current.position.y = (p.scanY - 0.5) * model.h * 1.2;
    scan.current.material.opacity = p.scanA * 0.6;
    scan.current.visible = p.scanA > 0.01;

    const a = p.ai * p.overlays;
    ai.current.visible = a > 0.01;
    if (ai.current.visible) {
      ai.current.traverse((n) => {
        if (n.material) n.material.opacity = (n.userData.a ?? 1) * a;
      });
    }
  });
  /* eslint-enable react-hooks/immutability */

  const c = model.center;
  const n = model.norm;

  return (
    <>
      <Environment preset="studio" />
      <ambientLight ref={ambient} intensity={0} />
      <directionalLight ref={key} color="#ffffff" intensity={0} />
      <directionalLight ref={fill} position={[-5, 3, 4]} color="#dfe5ec" intensity={0} />
      <directionalLight ref={rim} position={[-2, 4, -6]} color="#b8ccf0" intensity={0} />

      <group ref={outer}>
        <group ref={inner}>
          <group scale={n} position={[-c.x * n, -c.y * n, -c.z * n]}>
            <primitive object={model.object} />
          </group>
        </group>

        <ContactShadows position={[0, -model.h / 2 - 0.03, 0]} opacity={0.5} scale={8} blur={2.8} far={3} color="#000000" />

        <mesh ref={scan} position={[0, 0, 0.8]} renderOrder={5} visible={false}>
          <planeGeometry args={[model.w * 1.25, 0.9]} />
          <meshBasicMaterial map={scanTex} transparent opacity={0} depthWrite={false} depthTest={false} blending={AdditiveBlending} toneMapped={false} />
        </mesh>

        <group ref={ai} visible={false}>
          {AI_NODES.map((pos, i) => (
            <mesh key={i} position={pos} userData={{ a: 0.9 }}>
              <sphereGeometry args={[0.02, 10, 10]} />
              <meshBasicMaterial color="#e2e8f0" transparent opacity={0} toneMapped={false} />
            </mesh>
          ))}
          {AI_EDGES.map(([a, b], i) => (
            <Line key={i} points={[AI_NODES[a], AI_NODES[b]]} color="#cbd5e1" lineWidth={0.7} transparent opacity={0} userData={{ a: 0.35 }} />
          ))}
        </group>

      </group>
    </>
  );
}

useGLTF.preload("/model.glb");

/* ------------------------------------------------------------------ */
/* Copy blocks                                                         */
/* ------------------------------------------------------------------ */

function StageCopy({ s, animated }) {
  return (
    <div data-stage className={`w-full ${animated ? "opacity-0" : ""}`}>
      <div style={{ filter: "drop-shadow(0 0 18px rgba(226,232,240,0.2))" }}>
        <h2
          className="pr-[0.08em] font-serif text-[clamp(2.6rem,12vw,3.5rem)] font-medium italic leading-[1.02] md:text-[clamp(2.75rem,6vw,6rem)]"
          style={TITLE_STYLE}
        >
          {s.title}
        </h2>
      </div>
      <p className="mt-5 max-w-[30ch] font-sans text-[15px] font-light leading-relaxed text-white/60 md:max-w-[34ch] md:text-base lg:text-lg">
        {s.lead} <span className="font-normal text-white/90">{s.body}</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Technology() {
  const [reduced, setReduced] = useState(false);
  const R = useRef({});
  const ref = useMemo(() => {
    const cache = {};
    return (k) => (cache[k] ||= (n) => { R.current[k] = n; });
  }, []);
  const proxyRef = useRef(makeProxy());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const P = proxyRef.current;
    if (reduced) {
      Object.assign(P, REDUCED_POSE);
      return;
    }

    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: "(min-width: 1024px)",
        tablet: "(min-width: 768px) and (max-width: 1023px)",
        mobile: "(max-width: 767px)",
      },
      (ctx) => {
        const { desktop, tablet, mobile } = ctx.conditions;
        const { section, pin, root, par, img, veil, sheen, scan, atmo, silver, cool, graphite, sweep } = R.current;
        const stages = gsap.utils.toArray("[data-stage]", section);
        const K = desktop ? 1 : 0.85;

        Object.assign(P, makeProxy(), {
          zone: mobile ? 0.9 : 0.5,
          overlays: mobile ? 0 : 1,
          y: mobile ? 0.16 : 0.02,
        });

        const pose = (i) => ({
          x: mobile ? 0 : [-1, 1, -1, 1][i] * 0.235,
          y: mobile ? 0.155 : [-0.01, -0.02, -0.005, 0][i],
          z: [0, 0.25, 0.35, 0.55][i] * (mobile ? 0.6 : K),
          scale: [1, 1.06, 1.14, 1.22][i] * (mobile ? 0.8 : K),
          rotX: [0.06, 0.12, -0.06, 0.1][i] * (mobile ? 0.5 : 1),
          rotY: [0.12, -0.75, 0.85, -0.32][i] * (mobile ? 0.6 : K),
          rotZ: [0, 0.02, -0.015, 0][i],
        });
        const LIGHT = [
          { light: 0.85, rim: 0.6, lx: -0.5 },
          { light: 0.95, rim: 0.9, lx: 0.6 },
          { light: 1.0, rim: 1.1, lx: -0.7 },
          { light: 1.15, rim: 1.5, lx: 0.5 },
        ];

        const W = [[15, 20], [35, 22], [57, 22], [79, 16]];
        const T = W.map(([s, l]) => ({
          in0: s + l * 0.16,
          in1: s + l * 0.38,
          ov: s + l * 0.42,
          hold: s + l * 0.82,
          out1: s + l * 0.94,
          arrive: s + l * 0.3,
        }));
        const MV = [[11, T[0].arrive], [T[0].hold, T[1].arrive], [T[1].hold, T[2].arrive], [T[2].hold, T[3].arrive]];

        gsap.set(root, { autoAlpha: 1 });
        gsap.set(veil, { opacity: 0.65 });
        gsap.set(img, { scale: 1.03 });
        gsap.set(par, { yPercent: 2 });
        gsap.set(sheen, { xPercent: -110, opacity: 0 });
        gsap.set(scan, { yPercent: -110, opacity: 0 });
        gsap.set([silver, cool, graphite], { opacity: 0 });
        gsap.set(atmo, { xPercent: 0, yPercent: mobile ? -14 : 0 });
        gsap.set(sweep, { xPercent: -110, opacity: 0 });
        stages.forEach((el, i) => {
          const dir = mobile ? 0 : STAGES[i].side === "r" ? 1 : -1;
          gsap.set(el, { autoAlpha: 0, x: dir * 56, y: mobile ? 26 : 16, filter: "blur(6px)" });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * (desktop ? 8 : tablet ? 7.5 : 7))}`,
            scrub: 1,
            pin,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Banner: emerge, metallic pass, zoom, scan line, dissolve
        tl.to(veil, { opacity: 0, duration: 6.5, ease: "power2.out" }, 0)
          .to(img, { scale: 1, duration: 6.5, ease: "power2.out" }, 0)
          .to(par, { yPercent: -2, duration: 15, ease: "none" }, 0)
          .to(img, { scale: 1.08, duration: 6, ease: "power2.in" }, 9)
          .to(sheen, { xPercent: 150, duration: 6, ease: "power2.inOut" }, 2)
          .to(sheen, { opacity: 0.9, duration: 2.4, ease: "sine.out" }, 2)
          .to(sheen, { opacity: 0, duration: 3.6, ease: "sine.in" }, 4.4)
          .set(sheen, { xPercent: -110 }, 8.9)
          .to(sheen, { xPercent: 150, duration: 4.2, ease: "power2.inOut" }, 9)
          .to(sheen, { opacity: 0.7, duration: 1.6, ease: "sine.out" }, 9)
          .to(sheen, { opacity: 0, duration: 2.6, ease: "sine.in" }, 10.6)
          .to(scan, { yPercent: 480, duration: 4, ease: "power2.inOut" }, 9.6)
          .to(scan, { opacity: 1, duration: 1.2, ease: "sine.out" }, 9.6)
          .to(scan, { opacity: 0, duration: 2.2, ease: "sine.in" }, 11.6)
          .to(veil, { opacity: 1, duration: 3.6, ease: "power2.in" }, 11)
          .to(root, { autoAlpha: 0, duration: 2.6, ease: "power2.inOut" }, 13.4);

        // Model: one path per stage, position + rotation + scale + depth + light
        const moveTo = (i, [t0, t1], withLight = true) => {
          const d = t1 - t0;
          const { x, y, z, scale, rotX, rotY, rotZ } = pose(i);
          tl.to(P, { x, y, z, scale, duration: d, ease: "power3.inOut" }, t0)
            .to(P, { rotX, rotY, rotZ, duration: d, ease: "power4.inOut" }, t0);
          if (withLight) tl.to(P, { ...LIGHT[i], duration: d, ease: "sine.inOut" }, t0);
        };
        tl.to(P, { ...LIGHT[0], duration: 4.7, ease: "sine.inOut" }, 10.8);
        moveTo(0, MV[0], false);
        moveTo(1, MV[1]);
        moveTo(2, MV[2]);
        moveTo(3, MV[3]);
        const f = pose(3);
        tl.to(P, { light: 0.7, rim: 0.8, lx: 0, z: f.z - 0.2 * K, scale: f.scale * 0.95, rotY: f.rotY * 0.6, duration: 8, ease: "power2.inOut" }, 92);

        // Copy
        stages.forEach((el, i) => {
          const dir = mobile ? 0 : STAGES[i].side === "r" ? 1 : -1;
          const t = T[i];
          tl.to(el, { autoAlpha: 1, x: 0, y: 0, filter: "blur(0px)", duration: t.in1 - t.in0, ease: "power3.out" }, t.in0);
          if (i < 3) {
            tl.to(el, { autoAlpha: 0, x: dir * 56, y: mobile ? -18 : -10, filter: "blur(6px)", duration: t.out1 - t.hold, ease: "power3.in" }, t.hold);
          }
        });

        // Overlays
        const fx = (key, t, d, to) => tl.to(P, { [key]: to, duration: d, ease: "sine.inOut" }, t);
        fx("sensor", T[0].ov, 1.6, 1);
        fx("scanTag", T[0].ov + 2.6, 1.6, 1);
        fx("sensor", T[0].hold, 1.6, 0);
        fx("scanTag", T[0].hold, 1.6, 0);
        tl.to(P, { scanY: 1, duration: 6, ease: "power2.inOut" }, 24.5)
          .to(P, { scanA: 1, duration: 0.9 }, 24.5)
          .to(P, { scanA: 0, duration: 1 }, 29.6);
        fx("surface", T[1].ov, 1.6, 1);
        fx("points", T[1].ov + 1.4, 2.2, 1);
        fx("surface", T[1].hold, 1.6, 0);
        fx("points", T[1].hold, 1.6, 0);
        fx("ai", T[2].ov, 2.4, 1);
        fx("ai", T[2].hold, 1.6, 0);
        fx("progress", T[3].ov, 1.6, 1);
        fx("progress", T[3].hold, 2, 0);

        // Atmosphere
        const bg = (target, vars, [t0, t1]) => tl.to(target, { ...vars, duration: t1 - t0, ease: "sine.inOut" }, t0);
        const hx = mobile ? 0 : 17;
        [-hx, hx, -hx, hx].forEach((xPercent, i) => bg(atmo, { xPercent }, MV[i]));
        bg(atmo, { xPercent: hx * 0.6 }, [92, 100]);
        bg(silver, { opacity: 0.15 }, [10, 15]);
        bg(silver, { opacity: 0.38 }, [15, 24]);
        bg(silver, { opacity: 0.6 }, MV[1]);
        bg(silver, { opacity: 0.85 }, MV[2]);
        bg(silver, { opacity: 1 }, MV[3]);
        bg(silver, { opacity: 0.3 }, [92, 100]);
        bg(graphite, { opacity: 0.55 }, MV[1]);
        bg(graphite, { opacity: 0.8 }, MV[2]);
        bg(graphite, { opacity: 0.35 }, [92, 100]);
        bg(cool, { opacity: 0.9 }, MV[3]);
        bg(cool, { opacity: 0.25 }, [92, 100]);

        // Metallic sweep on transitions
        const pass = (t, d, peak) => {
          tl.to(sweep, { xPercent: 150, duration: d, ease: "power2.inOut" }, t)
            .to(sweep, { opacity: peak, duration: d * 0.4, ease: "sine.out" }, t)
            .to(sweep, { opacity: 0, duration: d * 0.6, ease: "sine.in" }, t + d * 0.4)
            .set(sweep, { xPercent: -110 }, t + d + 0.01);
        };
        pass(13.5, 7, 0.5);
        pass(33, 7, 0.75);
        pass(55, 7, 0.9);
        pass(76.5, 6.5, 1);

        tl.set({}, {}, 100);
      }
    );

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);

    return () => mm.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section
        id="technology"
        ref={ref("section")}
        aria-label="AI skin analysis technology"
        className={`relative w-full bg-black`}
        style={{ background: REDUCED_BG }}
      >
        <div className="relative h-[70svh] w-full overflow-hidden bg-black">
          <img
            src="/TechnologyBanner.png"
            alt="Skin analysis technology"
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover"
            style={{ maskImage: IMG_MASK, WebkitMaskImage: IMG_MASK }}
          />
        </div>
        <div className="relative h-[75svh] w-full" aria-hidden="true">
          <Canvas frameloop="demand" camera={{ position: [0, 0, CAM_Z], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
            <Suspense fallback={null}>
              <AnalyzerScene proxyRef={proxyRef} />
            </Suspense>
          </Canvas>
        </div>
        <div className="mx-auto max-w-[1100px] px-6 pb-8 md:px-12">
          {STAGES.map((s) => (
              <div key={s.title} className={`border-t border-white/10 py-12 md:w-[60%] md:py-16 ${s.side === "r" ? "md:ml-auto" : ""}`}>
              <StageCopy s={s} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="technology"
      ref={ref("section")}
      aria-label="AI skin analysis technology"
      className={`relative w-full bg-black`}
    >
      <div ref={ref("pin")} className="relative h-screen w-full overflow-hidden bg-black supports-[height:100svh]:h-[100svh]">
        {/* Atmosphere */}
        <div ref={ref("graphite")} className="pointer-events-none absolute inset-0 z-0 opacity-0" style={{ background: GRAPHITE }} />
        <div ref={ref("atmo")} className="pointer-events-none absolute -inset-[12%] z-0">
          <div ref={ref("silver")} className="absolute inset-0 opacity-0" style={{ background: SILVER }} />
          <div ref={ref("cool")} className="absolute inset-0 opacity-0" style={{ background: COOL }} />
        </div>

        {/* Brushed-metal light pass */}
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <div ref={ref("sweep")} className="absolute -top-[30%] left-0 h-[160%] w-[70vw] opacity-0 will-change-transform">
            <div
              className="absolute inset-0 -skew-x-[14deg]"
              style={{ background: STREAK_BG, filter: "blur(28px)", maskImage: STREAK_MASK, WebkitMaskImage: STREAK_MASK }}
            />
            <div
              className="absolute inset-y-0 left-[47%] w-[5%] -skew-x-[14deg] opacity-70"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                filter: "blur(14px)",
                maskImage: STREAK_MASK,
                WebkitMaskImage: STREAK_MASK,
              }}
            />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 z-[2]" style={{ background: VIGNETTE }} />

        {/* 3D analyzer */}
        <div className="absolute inset-0 z-10" aria-hidden="true">
          <Canvas camera={{ position: [0, 0, CAM_Z], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, powerPreference: "high-performance" }}>
            <Suspense fallback={null}>
              <AnalyzerScene proxyRef={proxyRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* Copy: protected opposite zones on ≥768px, bottom stack on mobile */}
        <div className="pointer-events-none absolute inset-0 z-20 mx-auto max-w-[1440px]">
          {STAGES.map((s) => (
            <div
              key={s.title}
              className={`absolute inset-x-0 bottom-[5%] px-6 md:bottom-0 md:top-0 md:flex md:w-[40%] md:items-center md:px-0 ${
                s.side === "r" ? "md:left-auto md:right-[5%]" : "md:left-[5%] md:right-auto"
              }`}
            >
              <StageCopy s={s} animated />
            </div>
          ))}
        </div>

        {/* Opening scene: TechnologyBanner */}
        <div ref={ref("root")} className="absolute inset-0 z-30 overflow-hidden bg-black">
          <div ref={ref("par")} className="absolute -inset-[4%] will-change-transform">
            <img
              ref={ref("img")}
              src="/TechnologyBanner.png"
              alt="Skin analysis technology"
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover will-change-transform"
              style={{ maskImage: IMG_MASK, WebkitMaskImage: IMG_MASK }}
            />
          </div>
          <div ref={ref("sheen")} className="pointer-events-none absolute -top-[10%] left-0 h-[120%] w-[55vw] opacity-0 mix-blend-screen will-change-transform">
            <div
              className="absolute inset-0 -skew-x-[14deg]"
              style={{ background: STREAK_BG, filter: "blur(24px)", maskImage: STREAK_MASK, WebkitMaskImage: STREAK_MASK }}
            />
          </div>
          <div
            ref={ref("scan")}
            className="pointer-events-none absolute inset-x-0 top-0 h-[22vh] opacity-0 will-change-transform"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(226,232,240,0.16) 70%, rgba(255,255,255,0.55) 99%, transparent 100%)" }}
          />
          <div ref={ref("veil")} className="absolute inset-0 bg-black" />
        </div>
      </div>
    </section>
  );
}
