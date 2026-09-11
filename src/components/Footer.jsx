import Link from "next/link";

const navigation = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#model" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-[#08090b] px-6 pt-16 sm:px-10 sm:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8fb6de]/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-12 lg:gap-8 lg:pb-16">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-start text-2xl font-semibold tracking-tight text-white">
              NO TWO
              <sup className="ml-1 mt-0.5 text-[9px] font-medium text-white/40">TM</sup>
            </Link>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/50">
              Intelligent skincare, shaped around the skin you are in.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="lg:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Explore</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:max-w-sm lg:grid-cols-1">
              {navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true" className="translate-x-0 text-[#8fb6de] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                      ↗
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start lg:col-span-4 lg:items-end">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Personalized care</p>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/50 lg:text-right">
              Start with a skin scan and receive a routine that responds to you.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NO TWO. All rights reserved.</p>
          <p>Made for skin that is uniquely yours.</p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none -mb-[0.16em] mt-3 select-none text-center text-[20vw] font-semibold leading-none tracking-[-0.1em] text-white/[0.025] sm:text-[17vw]"
      >
        NO TWO
      </p>
    </footer>
  );
}
