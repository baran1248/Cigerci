import { Flame } from "lucide-react";

/**
 * Bölümler arası süsleme ayırıcısı:
 * gradyan çizgiler arasında alev elmastı rozet.
 */
export function SectionOrnament() {
  return (
    <div
      aria-hidden="true"
      className="no-print mx-auto flex max-w-6xl items-center gap-4 px-4 py-2 sm:px-6"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border/40" />
      <div className="flex size-11 rotate-45 items-center justify-center rounded-xl bg-gradient-to-br from-brand-red to-orange shadow-lg shadow-brand-red/25">
        <Flame className="size-5 -rotate-45 text-cream" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border/40" />
    </div>
  );
}
