"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";

export function ShareButton() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `${SITE_CONFIG.brand.fullName} | Edirne Tava Ciğer`,
      text: "Edirne usulü tava ciğer — Kartal / İstanbul.",
      url: typeof window !== "undefined" ? window.location.href : SITE_CONFIG.maps.directions,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      // Fallback: panoya kopyala
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      toast({
        title: "Bağlantı kopyalandı",
        description: "Site adresini arkadaşlarınızla paylaşabilirsiniz.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Kullanıcı paylaşımı iptal etti veya izin verilmedi — sessizce geç
      if ((err as Error)?.name === "AbortError") return;
      toast({
        title: "Paylaşılamadı",
        description: "Tarayıcınız paylaşımı desteklemiyor olabilir.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={handleShare}
      variant="outline"
      aria-label="Sayfayı paylaş"
      className="size-9 rounded-full border-ink/15 bg-card/60 p-0 text-ink transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-ink hover:text-cream"
    >
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
    </Button>
  );
}
