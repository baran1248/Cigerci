import { Flame } from "lucide-react";

/**
 * Hero ile menü arasındaki eğik "kayan şerit".
 * İçerik sayfadaki gerçek bilgilerden oluşur (dekoratif, aria-hidden).
 * prefers-reduced-motion için animasyon CSS tarafında kapatılır.
 */

const ITEMS = [
  "Edirne Tava Ciğer",
  "160 gr Porsiyon",
  "Kartal / İstanbul",
  "WhatsApp Sipariş",
  "Taze Hazırlanır",
];

function MarqueeRow() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-6 pr-6 sm:gap-8 sm:pr-8">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cream/85 sm:text-sm">
            {item}
          </span>
          <Flame className="size-3.5 shrink-0 text-orange" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

export function MarqueeStrip() {
  return (
    <div
      aria-hidden="true"
      className="no-print relative z-10 -mx-2 -rotate-1 border-y-2 border-ink/90 bg-ink py-3 shadow-lg shadow-ink/10"
    >
      <div className="overflow-hidden">
        {/* İki özdeş yarı → translateX(-50%) ile kesintisiz döngü */}
        <div className="cy-marquee flex w-max">
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>
    </div>
  );
}
