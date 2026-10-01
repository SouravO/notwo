import Link from 'next/link';

export default function SkinType() {
  return (
    <section
      aria-labelledby="skin-journey-title"
      className="relative isolate flex min-h-[760px] items-start overflow-hidden bg-[#08090b] bg-[url('/machinemobile.png')] bg-cover bg-left-top px-6 pb-16 pt-20 text-white sm:px-10 md:min-h-[min(760px,90svh)] md:items-center md:bg-[url('/machine.png')] md:bg-center md:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <h2
            id="skin-journey-title"
            className="mb-7 max-w-[22rem] font-serif text-[clamp(2.2rem,6.5vw,4rem)] font-medium leading-[0.98] tracking-tight text-white md:max-w-2xl"
          >
            <span className="block">Personalized skincare,</span>
            <span className="block">built around you.</span>
          </h2>

          <div className="space-y-3 font-sans text-sm leading-relaxed text-white/85 sm:space-y-4 sm:text-base md:text-lg">
            <p>Walk into most skincare stores. Someone asks, &ldquo;What&rsquo;s your skin type?&rdquo;</p>
            <p>You answer, &ldquo;Maybe oily&hellip; maybe dry&hellip;&rdquo; Then buy a product based on a guess.</p>
            <p className="font-medium text-white">At KYS, guessing ends.</p>
            <p>
              We scientifically analyze your skin, identify its real condition, and recommend
              products designed specifically for your skin.
            </p>
            <p className="italic text-white">Because your skin deserves certainty, not assumptions.</p>
          </div>

          <Link
            href="/technology"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#16336F] px-6 py-3.5 font-sans text-sm font-medium tracking-wide text-[#EFEDDE] transition-colors hover:bg-[#16336F]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B0BEE1]"
          >
            <span>Explore our technology</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
