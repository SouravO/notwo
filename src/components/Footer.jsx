import Link from "next/link";

const navigation = [
  { label: "About", href: "/#about" },
  { label: "Products", href: "/products" },
  { label: "Technology", href: "/technology" },
  { label: "Contact", href: "/contact" },
];

export default function Footer({ light = false }) {
  const mutedText = light ? "text-[#1C1C1A]/60" : "text-white/60";
  const subtleText = light ? "text-[#1C1C1A]/45" : "text-white/35";
  const primaryText = light ? "text-[#1C1C1A]" : "text-white";
  const hoverText = light ? "hover:text-[#16336F]" : "hover:text-white";

  return (
    <footer className={`relative isolate overflow-hidden border-t px-6 pt-12 sm:px-10 sm:pt-14 ${light ? "border-black/10 bg-[#EAECEF]" : "border-white/[0.08] bg-[#1C1C1A]"}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(143,182,222,0.10),transparent_65%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className={`grid gap-9 border-b pb-8 sm:pb-10 lg:grid-cols-[1.2fr_0.65fr_1fr] lg:gap-16 ${light ? "border-black/10" : "border-white/10"}`}>
          <div>
            <Link
              href="/"
              className={`group inline-flex items-start text-2xl font-semibold tracking-[-0.06em] ${primaryText}`}
            >
              <span className="transition-opacity group-hover:opacity-75">NO TWO</span>
            </Link>
            <p className={`mt-5 max-w-sm text-base leading-7 ${light ? "text-[#1C1C1A]/65" : "text-white/55"}`}>
              Intelligent skincare, shaped around the skin you are in.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="grid grid-cols-2 gap-x-5 gap-y-4 lg:grid-cols-1">
              {navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group inline-flex items-center gap-2 text-sm transition-colors ${mutedText} ${hoverText}`}
                  >
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className="-translate-x-1 text-[#16336F] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    >
                      ↗
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:justify-self-end lg:text-right">
            <h2 className={`max-w-xs text-xl font-light leading-snug tracking-[-0.03em] ${light ? "text-[#1C1C1A]/90" : "text-white/90"} lg:ml-auto`}>
              Your skin has its own logic. Your routine should, too.
            </h2>
            <Link
              href="/products"
              className={`group mt-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${light ? "text-[#1C1C1A]/65 hover:text-[#16336F]" : "text-white/65 hover:text-white"}`}
            >
              Explore the formulas
              <span className="text-[#16336F] transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div className={`flex flex-col gap-3 py-5 text-[11px] ${subtleText} sm:flex-row sm:items-center sm:justify-between`}>
          <p>© {new Date().getFullYear()} NO TWO. All rights reserved.</p>
          <p className="sm:text-right">Made for skin that is uniquely yours.</p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-[-0.12em] left-1/2 -z-10 w-max -translate-x-1/2 select-none text-center text-[14vw] font-semibold leading-none tracking-[-0.105em] ${light ? "text-black/[0.035]" : "text-white/[0.025]"} sm:text-[12vw] lg:text-[10vw]`}
      >
        NO TWO
      </p>
    </footer>
  );
}
