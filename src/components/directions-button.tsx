"use client";

import { Navigation } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

interface DirectionsButtonProps {
  label?: string;
  variant?: "hero" | "card";
  className?: string;
}

export function DirectionsButton({
  label = "Yol Tarifi",
  variant = "hero",
  className = "",
}: DirectionsButtonProps) {
  const openDirections = () => {
    window.open(
      SITE_CONFIG.maps.directions,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const baseClasses =
    "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-red to-orange px-6 text-base font-semibold text-white shadow-lg shadow-brand-red/20 transition-all hover:shadow-xl hover:shadow-brand-red/30 active:scale-[0.98]";

  const variantClasses =
    variant === "hero" ? baseClasses : `${baseClasses} w-full flex-1`;

  return (
    <button
      type="button"
      onClick={openDirections}
      aria-label="Restoran konumuna yol tarifi al"
      className={`${variantClasses} ${className}`}
    >
      <Navigation className="size-5" aria-hidden="true" />
      {label}
    </button>
  );
}
