"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import Hero from "@/components/Hero";
import IntroLoader from "@/components/IntroLoader";

let introCompletedInDocument = false;

export default function HeroIntro() {
  const [introResolved, setIntroResolved] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useLayoutEffect(() => {
    const currentUrl = new URL(window.location.href);
    const hasSkipParameter = currentUrl.searchParams.get("notwo_skip_intro") === "1";
    const hadSectionHash = Boolean(currentUrl.hash);
    let skipForNavigation = false;

    try {
      skipForNavigation = window.sessionStorage.getItem("notwo_skip_intro_navigation") === "1";
      window.sessionStorage.removeItem("notwo_skip_intro_navigation");
    } catch {
      // Continue with the intro if session storage is unavailable.
    }

    const shouldSkipIntro =
      hasSkipParameter || skipForNavigation || introCompletedInDocument;

    if (!shouldSkipIntro) {
      currentUrl.hash = "";
      window.scrollTo(0, 0);
    }

    if (hasSkipParameter) {
      currentUrl.searchParams.delete("notwo_skip_intro");
    }

    if (hasSkipParameter || (!shouldSkipIntro && hadSectionHash)) {
      window.history.replaceState(
        window.history.state,
        "",
        `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
      );
    }

    // Resolve the intro gate from browser-only navigation state after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowIntro(!shouldSkipIntro);
    setIntroResolved(true);
  }, []);

  const handleIntroComplete = useCallback(() => {
    introCompletedInDocument = true;
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <IntroLoader onComplete={handleIntroComplete} />}
      <Hero isActive={introResolved && !showIntro} />
    </>
  );
}
