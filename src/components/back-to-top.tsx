"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Sayfanın başına dön"
      className={`fixed right-6 bottom-6 z-40 hidden size-12 cursor-pointer items-center justify-center rounded-full bg-ink text-cream shadow-xl shadow-ink/25 transition-all duration-300 hover:bg-brand-red md:flex ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
