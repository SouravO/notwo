import Link from "next/link";

const columns = [
  { title: "Product", links: ["Skin scan", "Formulations", "Routines", "Pricing"] },
  { title: "Company", links: ["About", "Science", "Careers"] },
  { title: "Connect", links: ["Instagram", "TikTok", "Contact"] },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0a0a0c] px-6 pt-20 sm:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 pb-16 sm:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="flex items-center gap-1 text-2xl font-semibold text-white">
            <span className="text-white/40">[</span>
            NOTWO
            <span className="ml-0.5 -translate-y-3 text-xs text-white/40">™</span>
            <span className="text-white/40">]</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/40">
            AI-formulated skincare, engineered around skin that only you have.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-white/70">{col.title}</h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/45 transition-colors hover:text-[#8fb6de]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} NOTWO. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white/60">
            Privacy
          </a>
          <a href="#" className="hover:text-white/60">
            Terms
          </a>
        </div>
      </div>

      {/* Embossed wordmark, echoing the brand's steel packaging */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none pb-4 text-center font-semibold leading-none tracking-tighter"
        style={{
          fontSize: "clamp(4rem, 18vw, 13rem)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.07)",
          textShadow: "0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        NO TWO
      </p>
    </footer>
  );
}