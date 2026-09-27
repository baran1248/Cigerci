"use client";

import { useEffect, useState } from "react";

/**
 * Header'ın alt kenarında okuma ilerlemesini gösteren ince gradyan çubuk.
 * rAF ile throttle edilir; reduced-motion kullanıcılarını etkilemez (sadece transform).
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gradient-to-r from-brand-red via-orange to-brand-red"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
