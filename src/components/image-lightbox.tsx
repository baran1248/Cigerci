"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface LightboxImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  caption?: string;
}

export function LightboxImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority,
  loading,
  caption,
}: LightboxImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} — büyütmek için tıklayın`}
        className="lightbox-trigger group/lightbox relative block w-full cursor-zoom-in"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          loading={loading}
          className={className}
        />
        <span
          aria-hidden="true"
          className="zoom-hint absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink/55 text-cream opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 motion-safe:group-hover/lightbox:scale-110 group-hover/lightbox:opacity-100 motion-reduce:transition-none"
        >
          <ZoomIn className="size-4" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl gap-3 border-cream/20 bg-ink p-3 sm:p-4 [&>button]:text-cream/70 [&>button:hover]:text-cream [&>button:hover]:opacity-100">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">
            {caption ?? "Büyük boyutlu ürün görseli"}
          </DialogDescription>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-auto w-full rounded-xl object-contain"
            sizes="(min-width: 768px) 768px, 100vw"
          />
          {caption && (
            <p className="px-2 pb-1 text-center text-sm text-cream/70">
              {caption}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
