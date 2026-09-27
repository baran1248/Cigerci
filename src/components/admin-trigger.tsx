"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { MenuEditor } from "@/components/menu-editor";
import { ADMIN_PASSWORD, type EditableMenuItem } from "@/lib/menu";

/** Marka yazısına basılı tutma süresi (ms). */
const HOLD_MS = 800;

interface AdminTriggerProps {
  /** Uzun basılınca yönetici akışını açan sarmalayıcı içerik (marka yazısı). */
  children: React.ReactNode;
  /** Düzenleyicinin başlangıç değerleri — sunucudan gelen güncel menü. */
  items: EditableMenuItem[];
  className?: string;
}

/**
 * Marka yazısına ~0.8 sn BASILI TUTUNCA açılan gizli yönetici girişi.
 * 1) uzun basma → şifre penceresi, 2) doğru şifre (2747) → menü düzenleyici.
 *
 * - Normal tıklama davranışı (link/navigasyon) aynen korunur:
 *   kısa tıklamada zamanlayıcı iptal olur, click olayı engellenmez.
 *   Uzun basma başarılı olduğunda ise hemen ardından gelecek click
 *   bilinçli olarak yutulur (sayfa başına atlamayı önler).
 * - Dokunmatik: metin seçimi/çağrı menüsü engellenir, kaydırma
 *   hareketi basılmayı iptal eder (pointercancel/pointerleave).
 */
export function AdminTrigger({ children, items, className }: AdminTriggerProps) {
  const [holding, setHolding] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickRef = useRef(false);

  const cancelHold = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setHolding(false);
  };

  const startHold = (e: React.PointerEvent<HTMLSpanElement>) => {
    // Yalnızca birincil düğme (sol tık / dokunma)
    if (e.pointerType === "mouse" && e.button !== 0) return;
    cancelHold();
    suppressClickRef.current = false;
    setHolding(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setHolding(false);
      // Başarılı uzun basma: art arda gelecek click'i yut
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 600);
      setPin("");
      setPinError(false);
      setPinOpen(true);
    }, HOLD_MS);
  };

  // Unmount'ta zamanlayıcıyı temizle
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const submitPin = () => {
    if (pin === ADMIN_PASSWORD) {
      setPinOpen(false);
      setEditorOpen(true);
    } else {
      setPinError(true);
    }
  };

  return (
    <>
      <span
        role="presentation"
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        onPointerCancel={cancelHold}
        onContextMenu={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          if (suppressClickRef.current) {
            e.preventDefault();
            e.stopPropagation();
            suppressClickRef.current = false;
          }
        }}
        className={cn(
          "relative inline-flex touch-manipulation select-none [-webkit-touch-callout:none] transition-all duration-300",
          holding && "scale-[1.04] opacity-75",
          className,
        )}
      >
        {children}
      </span>

      {/* Şifre penceresi */}
      <Dialog
        open={pinOpen}
        onOpenChange={(o) => {
          setPinOpen(o);
          if (!o) {
            setPin("");
            setPinError(false);
          }
        }}
      >
        <DialogContent className="max-w-[22rem]">
          <DialogHeader>
            <div className="mx-auto mb-1 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-red to-orange text-white shadow-lg shadow-brand-red/25">
              <Lock className="size-5" aria-hidden="true" />
            </div>
            <DialogTitle className="text-center font-display text-2xl tracking-tight">
              Yönetici Girişi
            </DialogTitle>
            <DialogDescription className="text-center">
              Menü düzenleme bölümüne erişmek için 4 haneli şifreyi girin.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <Input
              autoFocus
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              value={pin}
              placeholder="••••"
              aria-label="Yönetici şifresi"
              aria-invalid={pinError}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                if (pinError) setPinError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && pin.length === 4) submitPin();
              }}
              className={cn(
                "h-12 rounded-xl border-2 bg-card text-center text-2xl font-bold tracking-[0.55em]",
                pinError && "border-brand-red cy-shake",
              )}
            />
            {pinError && (
              <p className="mt-2 text-center text-sm font-medium text-brand-red" role="alert">
                Hatalı şifre, tekrar deneyin.
              </p>
            )}
            <Button
              type="button"
              onClick={submitPin}
              disabled={pin.length !== 4}
              className="mt-4 h-11 w-full rounded-full bg-ink text-base font-semibold text-cream transition-all hover:-translate-y-0.5 hover:bg-brand-red"
            >
              Giriş Yap
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Menü düzenleyici — her açılışta güncel verilerle taze mount olur */}
      {editorOpen && (
        <MenuEditor
          open={editorOpen}
          onOpenChange={setEditorOpen}
          items={items}
        />
      )}
    </>
  );
}
