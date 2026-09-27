"use client";

import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface QuickAddButtonProps {
  /** Sipariş oluşturucuya eklenecek ürün adı (SITE_CONFIG'ten gelir) */
  name: string;
  /** Verilirse tam boy buton, verilmezse yuvarlak ikon butonu */
  label?: string;
  className?: string;
}

/**
 * Menü kartlarından hızlı sipariş ekleme butonu.
 * `cy-quick-add` custom event'i yayınlar; OrderBuilder dinleyip adeti artırır.
 */
export function QuickAddButton({ name, label, className }: QuickAddButtonProps) {
  const { toast } = useToast();

  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("cy-quick-add", { detail: { name } })
    );
    toast({
      title: "Siparişe eklendi",
      description: `${name}, sipariş oluşturucuya eklendi.`,
      action: (
        <ToastAction
          altText="Sipariş oluşturucuya git"
          onClick={() =>
            document
              .getElementById("siparis")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Siparişi Gör
        </ToastAction>
      ),
    });
  };

  if (!label) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${name} ürününü siparişe ekle`}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-cream text-ink/70 transition-all duration-300 hover:border-transparent hover:bg-ink hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/60 active:scale-95",
          className
        )}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/20 bg-card/60 px-5 text-base font-semibold text-ink backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/60 active:scale-[0.98] sm:px-6",
        className
      )}
    >
      <Plus className="size-4.5" aria-hidden="true" />
      {label}
    </button>
  );
}
