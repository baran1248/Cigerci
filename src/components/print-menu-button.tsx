"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Menüyü yazdır butonu — tarayıcının yazdırma iletişim kutusunu açar.
 * Siteye özel print stilleri yalnızca menü ve konum bilgilerini
 * şık bir şekilde yazdırır (header/hero/sipariş bölümü otomatik gizlenir).
 */
export function PrintMenuButton() {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => window.print()}
      className="no-print h-8 shrink-0 rounded-full border-ink/20 bg-card/60 px-3 text-xs font-semibold text-ink/70 transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-ink hover:text-cream sm:px-4 sm:text-sm"
    >
      <Printer className="size-3.5 sm:size-4" />
      Menüyü Yazdır
    </Button>
  );
}
