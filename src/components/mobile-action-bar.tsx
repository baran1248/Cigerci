"use client";

import { Phone, Navigation } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const { phone, whatsappUrl, maps } = SITE_CONFIG;

export function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      role="navigation"
      aria-label="Hızlı işlemler"
    >
      <div className="border-t border-ink/10 bg-cream/95 shadow-[0_-8px_24px_rgba(29,20,15,0.12)] backdrop-blur-md">
        <div className="grid grid-cols-3 gap-1 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2">
          {/* WhatsApp Sipariş */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp üzerinden sipariş ver"
            className="cy-pulse flex flex-col items-center justify-center gap-1 rounded-xl bg-[#25D366] px-2 py-2.5 text-white shadow-md transition-transform active:scale-95"
          >
            <WhatsAppIcon className="size-5" />
            <span className="text-[0.7rem] font-semibold leading-none">
              Sipariş Ver
            </span>
          </a>

          {/* Telefonla Ara */}
          <a
            href={phone.tel}
            aria-label={`Telefonla ara: ${phone.display}`}
            className="flex flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-brand-red to-orange px-2 py-2.5 text-white shadow-md transition-transform active:scale-95"
          >
            <Phone className="size-5" />
            <span className="text-[0.7rem] font-semibold leading-none">
              Ara
            </span>
          </a>

          {/* Yol Tarifi */}
          <a
            href={maps.directions}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Restoran konumuna yol tarifi al"
            className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#1A73E8] px-2 py-2.5 text-white shadow-md transition-transform active:scale-95"
          >
            <Navigation className="size-5" />
            <span className="text-[0.7rem] font-semibold leading-none">
              Yol Tarifi
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
