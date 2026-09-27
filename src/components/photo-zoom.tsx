"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

/**
 * Fotoğraf büyütme (lightbox) katmanı: herhangi bir `relative` görsel
 * kabının içine bırakılır. Kapsayıcı alanı tam kaplayan görünmez bir
 * tetikleyici buton + tam ekran görüntüleyici içerir.
 *
 * - ESC ve arka plan tıklaması ile kapanır
 * - Açılınca kapatma butonuna odaklanır, kapanınca tetikleyiciye geri döner
 * - Açıkken sayfa kaydırması kilitlenir
 */

interface PhotoZoomProps {
  src: string;
  alt: string;
  /** Işıldayan köşe çipinde gösterilecek kısa başlık (isteğe bağlı) */
  caption?: string;
}

export function PhotoZoom({ src, alt, caption }: PhotoZoomProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      {/* Görünmez tetikleyici — kabı tamamen kaplar */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} — büyüt`}
        className="absolute inset-0 z-10 cursor-zoom-in"
      >
        <span className="sr-only">Fotoğrafı tam ekran görüntüle</span>
      </button>

      {/* Hover'da beliren büyütme çipi — print'te asla görünmez (no-print) */}
      <span
        aria-hidden="true"
        className="no-print pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-ink/55 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-wider text-cream opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 motion-reduce:transition-none"
      >
        <ZoomIn className="size-3.5" />
        {caption ?? "Büyüt"}
      </span>

      {/* Tam ekran görüntüleyici */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="no-print fixed inset-0 z-[100] flex animate-in fade-in duration-200 flex-col items-center justify-center gap-4 bg-ink/92 p-4 backdrop-blur-sm sm:p-8"
        >
          <div
            className="relative h-[78vh] w-full max-w-5xl animate-in zoom-in-95 fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="92vw"
              priority
              className="rounded-2xl object-contain"
            />
          </div>

          <div className="flex animate-in fade-in duration-300 items-center gap-3">
            <p className="text-sm font-medium text-cream/80">{alt}</p>
            <span className="text-cream/30">·</span>
            <p className="font-display text-sm uppercase tracking-widest text-orange">
              {SITE_CONFIG.brand.fullName}
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Görüntüleyiciyi kapat"
            className="absolute right-4 top-4 flex size-12 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur-sm transition-all hover:rotate-90 hover:bg-brand-red active:scale-95 sm:right-6 sm:top-6"
          >
            <X className="size-5" />
          </button>
        </div>
      )}
    </>
  );
}
