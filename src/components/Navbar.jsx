"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Brand tokens used here: Onyx (glass bg on scroll), Light Azure (scroll shadow
// glow + link underline), Paper White (CTA button).

const links = [
  { href: "/#about", label: "About" },
  { href: "/#model", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const prepareSectionNavigation = (event, href) => {
    const isHomeDestination = href === "/" || href.startsWith("/#");

    if (window.location.pathname === "/products" && isHomeDestination) {
      event.preventDefault();
      const sectionId = href.startsWith("/#") ? href.slice(2) : "";
      const destination = sectionId
        ? `/?notwo_skip_intro=1#${sectionId}`
        : "/?notwo_skip_intro=1";

      window.location.assign(destination);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeMenu = () => setOpen(false);
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };
    const onResize = () => {
      if (window.innerWidth >= 768) closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 px-3 transition-all duration-500 sm:px-6 ${scrolled ? "py-3" : "py-3 sm:py-6"}`}>
      <nav
        aria-label="Main navigation"
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 transition-all duration-500 sm:px-6 lg:px-8 ${
          scrolled
            ? "border-white/10 bg-[#0a0a0c]/80 py-3 shadow-[0_0_40px_-12px_rgba(143,182,222,0.35)] backdrop-blur-xl"
            : "border-transparent bg-transparent py-4"
        }`}
      >
        <Link
          href="/"
          onClick={(event) => prepareSectionNavigation(event, "/")}
          className="flex items-center gap-1 text-lg font-semibold tracking-tight text-white"
        >
          NO TWO
          <span className="ml-0.5 -translate-y-2 text-[10px] text-white/40">™</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-white/60 md:flex lg:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => prepareSectionNavigation(event, link.href)}
              className="group relative py-1 transition-colors hover:text-white"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-[#8fb6de] to-white/60 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8fb6de] md:hidden"
        >
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} className="h-[1.5px] w-5 bg-white" />
          <motion.span animate={{ opacity: open ? 0 : 1 }} className="h-[1.5px] w-5 bg-white" />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} className="h-[1.5px] w-5 bg-white" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            id="mobile-navigation"
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0c]/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(event) => {
                    prepareSectionNavigation(event, link.href);
                    setOpen(false);
                  }}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
