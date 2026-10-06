import Link from "next/link";
import Image from "next/image";

const navigation = [
  { label: "About", href: "/#about" },
  { label: "Products", href: "/products" },
  { label: "Technology", href: "/technology" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const mutedText = "text-[#1C1C1A]/60";
  const subtleText = "text-[#1C1C1A]/45";
  const primaryText = "text-[#1C1C1A]";
  const hoverText = "hover:text-[#16336F]";

  return (
    <footer className="relative isolate overflow-hidden border-t border-black/10 bg-[#b6bbc0] px-6 pt-12 sm:px-10 sm:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(143,182,222,0.10),transparent_65%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-9 border-b border-black/10 pb-8 sm:pb-10 lg:grid-cols-[1.2fr_0.65fr_1fr] lg:gap-16">
          <div>
            <Link
              href="/"
              className={`group inline-flex items-start text-2xl font-semibold tracking-[-0.06em] ${primaryText}`}
            >
              <Image
                src="/logo.png"
                alt="NO TWO"
                width={1742}
                height={353}
                unoptimized
                className="h-6 w-auto transition-opacity group-hover:opacity-75"
              />
            </Link>
            <p className="mt-5 max-w-sm text-base leading-7 text-[#1C1C1A]/65">
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
            <h2 className="max-w-xs text-xl font-light leading-snug tracking-[-0.03em] text-[#1C1C1A]/90 lg:ml-auto">
              Your skin has its own logic. Your routine should, too.
            </h2>
            <Link
              href="/products"
              className="group mt-5 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-[#1C1C1A]/65 transition-colors hover:text-[#16336F]"
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

      <Image
        src="/logo.png"
        alt=""
        aria-hidden="true"
        width={1742}
        height={353}
        className="pointer-events-none absolute bottom-[-0.12em] left-1/2 -z-10 h-auto w-[82vw] max-w-7xl -translate-x-1/2 select-none opacity-[0.035]"
      />
    </footer>
  );
}
