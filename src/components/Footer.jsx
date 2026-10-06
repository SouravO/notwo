import Link from "next/link";
import Image from "next/image";

const navigation = [
  { label: "About", href: "/#about" },
  { label: "Products", href: "/products" },
  { label: "Technology", href: "/technology" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { label: "YouTube", href: "https://www.youtube.com/", icon: "youtube" },
  { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
];

function SocialIcon({ name }) {
  if (name === "instagram") {
    return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.5" cy="6.8" r="1.1" fill="currentColor" /></svg>;
  }
  if (name === "youtube") {
    return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5"><path d="M21 7.2a2.8 2.8 0 0 0-2-2C17.3 4.7 12 4.7 12 4.7s-5.3 0-7 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.5 12s0 2.9.5 4.8a2.8 2.8 0 0 0 2 2c1.7.5 7 .5 7 .5s5.3 0 7-.5a2.8 2.8 0 0 0 2-2c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="m10 15.5 5-3.5-5-3.5v7Z" fill="currentColor" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z" /></svg>;
}

export default function Footer() {
  const mutedText = "text-[#1C1C1A]/85";
  const subtleText = "text-[#1C1C1A]/75";
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
            <p className="mt-5 max-w-sm text-lg leading-8 text-[#1C1C1A]/90 sm:text-xl">
              Intelligent skincare, shaped around the skin you are in.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="grid grid-cols-2 gap-x-5 gap-y-4 lg:grid-cols-1">
              {navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group inline-flex items-center gap-2 text-base font-medium transition-colors sm:text-lg ${mutedText} ${hoverText}`}
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
            <h2 className="max-w-xs text-2xl font-medium leading-snug tracking-[-0.03em] text-[#1C1C1A] sm:text-3xl lg:ml-auto">
              Your skin has its own logic. Your routine should, too.
            </h2>
            <Link
              href="/products"
              className="group mt-5 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#1C1C1A]/85 transition-colors hover:text-[#16336F] sm:text-base"
            >
              Explore the formulas
              <span className="text-[#16336F] transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div className={`flex flex-col gap-5 py-5 text-sm font-medium ${subtleText} sm:flex-row sm:items-center sm:justify-between`}>
          <p>© {new Date().getFullYear()} NO TWO. All rights reserved.</p>
          <nav aria-label="Social media" className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#1C1C1A]/25 text-[#1C1C1A] transition-colors hover:border-[#16336F] hover:bg-[#16336F] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16336F]"
              >
                <SocialIcon name={link.icon} />
              </a>
            ))}
          </nav>
          <p className="sm:text-right">Made for skin that is uniquely yours.</p>
        </div>
      </div>

      <Image
        src="/logo.png"
        alt=""
        aria-hidden="true"
        width={1742}
        height={353}
        className="pointer-events-none absolute bottom-[-0.12em] left-1/2 -z-10 h-auto w-[82vw] max-w-7xl -translate-x-1/2 select-none opacity-[0.02]"
      />
    </footer>
  );
}
