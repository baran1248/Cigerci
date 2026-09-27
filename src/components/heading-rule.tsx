import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bölüm başlıklarının altındaki gradyan çizgi — ortada alevli elmas süsü.
 * Menü, Sipariş ve Konum başlıklarında tutarlı kullanılır.
 */
export function HeadingRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "mx-auto mt-4 flex w-fit items-center gap-2.5",
        className
      )}
    >
      <span className="h-1 w-11 rounded-full bg-gradient-to-r from-transparent to-brand-red sm:w-14" />
      <span className="flex size-6 rotate-45 items-center justify-center rounded-[0.4rem] bg-gradient-to-br from-brand-red to-orange shadow-md shadow-brand-red/25">
        <Flame className="size-3 -rotate-45 text-white" />
      </span>
      <span className="h-1 w-11 rounded-full bg-gradient-to-l from-transparent to-orange sm:w-14" />
    </div>
  );
}
