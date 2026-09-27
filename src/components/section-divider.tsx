import { Flame } from "lucide-react";

export function SectionDivider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex max-w-6xl items-center gap-4 px-4 sm:px-6 print:hidden"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
      <span className="flex items-center gap-2.5">
        <span className="size-1.5 rounded-full bg-orange/50" />
        <span className="flex size-8 items-center justify-center rounded-full border border-border/80 bg-card shadow-sm">
          <Flame className="size-3.5 text-orange" />
        </span>
        <span className="size-1.5 rounded-full bg-brand-red/50" />
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
    </div>
  );
}
