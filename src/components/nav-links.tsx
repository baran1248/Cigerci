"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SECTIONS = ["anasayfa", "menu", "konum"] as const;

const LINKS = [
  { href: "#menu", id: "menu", label: "Menü" },
  { href: "#konum", id: "konum", label: "Konum" },
] as const;

export function NavLinks() {
  const [active, setActive] = useState<string>("anasayfa");

  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + 160;
      let current = "anasayfa";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= pos) {
          current = id;
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="hidden items-center gap-7 text-sm font-medium text-ink/70 md:flex"
      aria-label="Ana navigasyon"
    >
      {LINKS.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          aria-current={active === link.id ? "true" : undefined}
          className={`group relative transition-colors hover:text-brand-red ${
            active === link.id ? "text-brand-red" : ""
          }`}
        >
          {link.label}
          <span
            className={`absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-gradient-to-r from-brand-red to-orange transition-all duration-300 ${
              active === link.id
                ? "w-full opacity-100"
                : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"
            }`}
            aria-hidden="true"
          />
        </Link>
      ))}
    </nav>
  );
}
