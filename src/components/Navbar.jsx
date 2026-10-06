"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Shared brand colors and destinations for desktop and mobile navigation.

const links = [
  { href: "/#about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/technology", label: "Technology" },
  { href: "/contact", label: "Contact" },
];

const routeLinks = {
  "/products": "/products",
  "/technology": "/technology",
  "/contact": "/contact",
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(null);

  const prepareSectionNavigation = (href) => {
    const isHomeDestination = href === "/" || href.startsWith("/#");

    if (window.location.pathname !== "/" && isHomeDestination) {
      try {
        window.sessionStorage.setItem("notwo_skip_intro_navigation", "1");
      } catch {
        // Keep client-side navigation working when session storage is unavailable.
      }
    }
  };

  const navigateToSection = (event, href) => {
    if (!href.startsWith("/#")) {
      prepareSectionNavigation(href);
      return;
    }

    event.preventDefault();
    prepareSectionNavigation(href);

    if (pathname !== "/") {
      router.push(href, { scroll: false });
      return;
    }

    const target = document.getElementById(href.slice(2));
    if (target) {
      window.history.pushState(null, "", href);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (pathname !== "/" || !window.location.hash) return;

    const targetId = decodeURIComponent(window.location.hash.slice(1));
    let frame;
    let attempts = 0;
    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attempts++ < 20) frame = window.requestAnimationFrame(scrollToTarget);
    };

    frame = window.requestAnimationFrame(scrollToTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const updateNavigationState = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 24);

      if (open || currentScrollY <= 24) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY + 6) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY - 6) {
        setVisible(true);
      }
      lastScrollY = currentScrollY;

      if (routeLinks[pathname]) {
        setActiveHref(routeLinks[pathname]);
        return;
      }

      if (pathname !== "/") {
        setActiveHref(null);
        return;
      }

      const activeSection = ["about", "products"]
        .map((id) => document.getElementById(id))
        .filter((section) => section && section.getBoundingClientRect().top <= window.innerHeight * 0.42)
        .at(-1);

      setActiveHref(activeSection ? `/#${activeSection.id}` : null);
    };

    const onScroll = () => updateNavigationState();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, open]);

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
    <header className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-500 ${visible ? "translate-y-0" : "-translate-y-full pointer-events-none"}`}>
      <nav
        aria-label="Main navigation"
        className={`flex w-full items-center justify-between border-b px-5 transition-all duration-500 sm:px-8 lg:px-12 ${
          scrolled
            ? "border-black/10 bg-transparent py-2.5 shadow-sm md:bg-[#EAECEF]"
            : "border-black/10 bg-transparent py-3 backdrop-blur-none md:bg-[#EAECEF]/95 md:backdrop-blur-md"
        }`}
      >
        <Link
          href="/"
          onClick={() => prepareSectionNavigation("/")}
          className="group flex items-center gap-1 text-lg font-semibold tracking-tight text-[#1C1C1A]"
        >
          <span className="transition-opacity group-hover:opacity-75">NO TWO</span>
          <span className="ml-0.5 -translate-y-2 text-[10px] text-black/40">™</span>
          <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-[#16336F]" />
        </Link>

        <div className="hidden items-center gap-1 text-[13px] font-medium text-[#34383e] md:flex">
          {links.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => navigateToSection(event, link.href)}
                aria-current={isActive ? "page" : undefined}
                className={`group relative isolate rounded-full px-4 py-2.5 transition-colors duration-300 hover:text-[#16336F] ${isActive ? "text-white hover:text-white" : ""}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="desktop-nav-active"
                    className="absolute inset-0 -z-10 rounded-full border border-[#16336F] bg-[#16336F]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full bg-[#16336F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0BEE1] md:hidden"
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
            className="mt-0 w-full overflow-hidden border-b border-black/10 bg-[#EAECEF] md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map((link) => {
                const isActive = activeHref === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(event) => {
                      navigateToSection(event, link.href);
                      setOpen(false);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative isolate overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:text-[#16336F] ${isActive ? "text-white hover:text-white" : "text-[#34383e]"}`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="mobile-nav-active"
                        className="absolute inset-0 -z-10 rounded-xl border border-[#16336F] bg-[#16336F]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
