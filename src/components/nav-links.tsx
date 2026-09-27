"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SECTIONS = ["anasayfa", "menu", "siparis", "konum"] as const;

const LINKS = [
  { href: "#menu", id: "menu", label: "Menü" },
  { href: "#siparis", id: "siparis", label: "Sipariş" },
  { href: "#konum", id: "konum", label: "Konum" },
] as const;

export function NavLinks() {
  const [active, setActive] = useState<string>("anasayfa");
  // OrderBuilder'ın cy-order-changed etkinliğiyle canlı güncellenen adet
  const [orderCount, setOrderCount] = useState(0);

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

  // Sipariş adedi değiştikçe rozeti güncelle (OrderBuilder tek durum sahibi)
  useEffect(() => {
    const onOrderChanged = (e: Event) => {
      const detail = (e as CustomEvent<{ count: number }>).detail;
      const n = Number(detail?.count);
      if (Number.isFinite(n)) {
        setOrderCount(Math.max(0, Math.floor(n)));
      }
    };
    window.addEventListener("cy-order-changed", onOrderChanged);
    return () => window.removeEventListener("cy-order-changed", onOrderChanged);
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
          aria-label={
            link.id === "siparis" && orderCount > 0
              ? `Sipariş — ${orderCount} ürün seçili`
              : undefined
          }
          className={`group relative transition-colors hover:text-brand-red ${
            active === link.id ? "text-brand-red" : ""
          }`}
        >
          {link.label}
          {/* Sipariş rozeti — seçili ürün sayısı; adet değişiminde
              key yenilendiği için cy-pop kısa vurgu animasyonu tekrar oynar */}
          {link.id === "siparis" && orderCount > 0 && (
            <span
              key={orderCount}
              aria-hidden="true"
              className="cy-pop absolute -right-3.5 -top-2.5 flex min-w-4.5 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-orange px-1 text-[0.6rem] font-bold leading-4.5 text-white shadow-md shadow-brand-red/25"
            >
              {orderCount > 9 ? "9+" : orderCount}
            </span>
          )}
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
