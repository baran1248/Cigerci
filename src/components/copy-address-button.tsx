"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/copy-text";
import { SITE_CONFIG } from "@/lib/site-config";

/**
 * Adresi panoya kopyalayan küçük ikon butonu.
 * Kopyalama sonrası toast bildirimi gösterir.
 */
export function CopyAddressButton() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyText(SITE_CONFIG.address);
    if (ok) {
      setCopied(true);
      toast({
        title: "Adres kopyalandı",
        description: "Navigasyon uygulamasına yapıştırabilirsiniz.",
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: "Kopyalanamadı",
        description: "Adresi elle seçip kopyalayabilirsiniz.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      type="button"
      onClick={handleCopy}
      variant="outline"
      aria-label="Adresi kopyala"
      title="Adresi kopyala"
      className="no-print size-8 shrink-0 rounded-full border-ink/15 bg-transparent p-0 text-ink/60 transition-all hover:border-transparent hover:bg-ink hover:text-cream"
    >
      {copied ? (
        <Check className="size-3.5 text-[#25D366]" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </Button>
  );
}
