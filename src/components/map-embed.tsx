import { MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";

/**
 * Konum bölümünde interaktif Google Maps gömülü haritası.
 * Koordinatlar SITE_CONFIG'teki yön tarifi URL'sinden türetilir (tek kaynak).
 * API anahtarı gerektirmez (output=embed).
 */

// destination=40.8898,29.18467 → [full, lat, lng]
const coords = SITE_CONFIG.maps.directions.match(
  /destination=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
);
const lat = coords?.[1] ?? "40.8898";
const lng = coords?.[2] ?? "29.18467";

export function MapEmbed() {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=tr&output=embed`;

  return (
    <div className="no-print relative h-72 overflow-hidden rounded-[1.75rem] border-4 border-card bg-muted shadow-2xl shadow-ink/20 sm:h-80 lg:h-auto lg:min-h-80">
      <iframe
        src={src}
        title={`${SITE_CONFIG.brand.fullName} konum haritası — ${SITE_CONFIG.address}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />

      {/* Konum etiketi */}
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full bg-card/95 py-1.5 pl-2 pr-4 shadow-lg shadow-ink/10 backdrop-blur-sm">
        <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-orange text-white">
          <MapPin className="size-3.5" aria-hidden="true" />
        </span>
        <span className="text-xs font-bold text-ink">{SITE_CONFIG.maps.label}</span>
      </div>
    </div>
  );
}
