"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CupSoda,
  Droplet,
  Flame,
  Loader2,
  RotateCcw,
  Save,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  ADMIN_PASSWORD,
  NAME_MAX,
  defaultMenuItems,
  sanitizePriceInput,
  type EditableMenuItem,
} from "@/lib/menu";

/**
 * Menü Düzenleme — fiyat ve ürün adlarının yönetici arayüzü.
 *
 * Foolproof garantiler:
 * - Ad: en fazla 40 karakter (girdi kutusu da sınırlandırır), trim edilir,
 *   çift boşluklar tekilleşir; 2 karakterden kısa ad reddedilir.
 * - Fiyat: yalnızca rakam kabul edilir (harf girişi imkânsız),
 *   1–99999 ₺ arası tam sayı dışı her şey kaydedilmez.
 * - Kaydet düğmesi geçersiz/değişikliksiz durumda çalışmaz.
 * - Sunucu tarafında AYNI kurallar bir kez daha uygulanır; veriyi
 *   elle bozmaya çalışan biri API'den reddedilir.
 * - Okuma yolunda geçersiz alan otomatik varsayılana döner.
 */

interface MenuEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Sunucudan gelen güncel (yayındaki) ürün değerleri. */
  items: EditableMenuItem[];
}

interface DraftRow {
  name: string;
  price: string;
}

type Draft = Record<string, DraftRow>;

function buildDraft(items: EditableMenuItem[]): Draft {
  const draft: Draft = {};
  for (const it of items) {
    draft[it.id] = { name: it.name, price: String(it.price) };
  }
  return draft;
}

/** Sabit ikonlar — düzenlenemez, yerleşimi korur. */
function rowIcon(id: string) {
  if (id === SITE_CONFIG.menu.main.id) {
    return <Flame className="size-4" aria-hidden="true" />;
  }
  const drink = SITE_CONFIG.menu.drinks.items.find((d) => d.id === id);
  return drink?.icon === "droplet" ? (
    <Droplet className="size-4" aria-hidden="true" />
  ) : (
    <CupSoda className="size-4" aria-hidden="true" />
  );
}

export function MenuEditor({ open, onOpenChange, items }: MenuEditorProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [draft, setDraft] = useState<Draft>(() => buildDraft(items));
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const defaults = useMemo(() => {
    const map = new Map<string, EditableMenuItem>();
    for (const d of defaultMenuItems()) map.set(d.id, d);
    return map;
  }, []);

  const cleanName = (raw: string) => raw.trim().replace(/\s+/g, " ");

  const nameError = (id: string): string | null => {
    const n = cleanName(draft[id]?.name ?? "");
    if (n.length < 2) return "En az 2 karakter gerekli.";
    if (n.length > NAME_MAX) return `En fazla ${NAME_MAX} karakter.`;
    return null;
  };

  const priceError = (id: string): string | null => {
    const p = draft[id]?.price ?? "";
    if (!p) return "Fiyat gerekli.";
    const n = Number(p);
    if (n < 1) return "En az 1 ₺.";
    if (n > 99999) return "En çok 99999 ₺.";
    return null;
  };

  const allValid = items.every(
    (it) => nameError(it.id) === null && priceError(it.id) === null,
  );

  const dirty = items.some((it) => {
    const d = draft[it.id];
    if (!d) return false;
    return cleanName(d.name) !== it.name || Number(d.price) !== it.price;
  });

  const updateName = (id: string, value: string) => {
    setDraft((d) => ({ ...d, [id]: { ...d[id], name: value.slice(0, NAME_MAX) } }));
  };

  const updatePrice = (id: string, value: string) => {
    setDraft((d) => ({
      ...d,
      [id]: { ...d[id], price: sanitizePriceInput(value) },
    }));
  };

  const save = async () => {
    if (!allValid || !dirty || saving) return;
    setSaving(true);
    try {
      const payload = items.map((it) => ({
        id: it.id,
        name: cleanName(draft[it.id]?.name ?? ""),
        price: Number(draft[it.id]?.price ?? "0"),
      }));
      const res = await fetch("/api/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: ADMIN_PASSWORD, items: payload }),
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (res.ok && json?.ok) {
        toast({
          title: "Menü güncellendi",
          description:
            "Yeni fiyat ve ürün adları siteye yayınlandı; tüm ziyaretçiler görüyor.",
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast({
          title: "Kaydedilemedi",
          description: json?.error ?? "Beklenmeyen bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Bağlantı hatası",
        description: "İnternet bağlantınızı kontrol edip tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    setConfirmReset(false);
    if (resetting) return;
    setResetting(true);
    try {
      const res = await fetch("/api/menu/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: ADMIN_PASSWORD }),
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (res.ok && json?.ok) {
        toast({
          title: "Menü sıfırlandı",
          description:
            "Tüm fiyat ve ürün adları varsayılan değerlere geri döndürüldü.",
        });
        onOpenChange(false);
        router.refresh();
      } else {
        toast({
          title: "Sıfırlanamadı",
          description: json?.error ?? "Beklenmeyen bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Bağlantı hatası",
        description: "İnternet bağlantınızı kontrol edip tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setResetting(false);
    }
  };

  const mainItem = items.find(
    (it) => it.id === SITE_CONFIG.menu.main.id,
  );
  const drinkItems = items.filter(
    (it) => it.id !== SITE_CONFIG.menu.main.id,
  );

  const renderRow = (it: EditableMenuItem) => {
    const def = defaults.get(it.id);
    const nErr = nameError(it.id);
    const pErr = priceError(it.id);
    return (
      <div
        key={it.id}
        className="rounded-2xl border border-border/70 bg-card p-3 shadow-sm"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              it.id === SITE_CONFIG.menu.main.id
                ? "bg-brand-red/10 text-brand-red"
                : "bg-ink/5 text-ink",
            )}
            aria-hidden="true"
          >
            {rowIcon(it.id)}
          </span>

          <div className="min-w-0 flex-1">
            <label
              htmlFor={`edit-name-${it.id}`}
              className="flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Ürün Adı
              <span className="font-normal normal-case tabular-nums">
                {cleanName(draft[it.id]?.name ?? "").length}/{NAME_MAX}
              </span>
            </label>
            <Input
              id={`edit-name-${it.id}`}
              value={draft[it.id]?.name ?? ""}
              maxLength={NAME_MAX}
              onChange={(e) => updateName(it.id, e.target.value)}
              aria-invalid={nErr !== null}
              className={cn(
                "mt-1 h-10 rounded-xl bg-cream/60",
                nErr && "border-brand-red/60",
              )}
            />
            {nErr && (
              <p className="mt-1 text-xs font-medium text-brand-red">{nErr}</p>
            )}
          </div>

          <div className="w-full shrink-0 sm:w-28">
            <label
              htmlFor={`edit-price-${it.id}`}
              className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Fiyat (₺)
            </label>
            <div className="relative mt-1">
              <Input
                id={`edit-price-${it.id}`}
                inputMode="numeric"
                value={draft[it.id]?.price ?? ""}
                placeholder={String(def?.price ?? "")}
                onChange={(e) => updatePrice(it.id, e.target.value)}
                aria-invalid={pErr !== null}
                className="h-10 rounded-xl bg-cream/60 pr-7 text-right font-semibold tabular-nums"
              />
              <span
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground"
                aria-hidden="true"
              >
                ₺
              </span>
            </div>
            {pErr && (
              <p className="mt-1 text-xs font-medium text-brand-red">{pErr}</p>
            )}
          </div>
        </div>

        {def && (
          <p className="mt-2 text-[0.65rem] text-muted-foreground">
            Varsayılan: {def.name} · {def.price} ₺
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90dvh] flex-col overflow-y-auto overscroll-contain rounded-3xl sm:max-w-lg">
          <DialogHeader className="shrink-0">
            <div className="mx-auto mb-1 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-red to-orange text-white shadow-lg shadow-brand-red/25">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>
            <DialogTitle className="text-center font-display text-2xl tracking-tight">
              Menü Düzenleme
            </DialogTitle>
            <DialogDescription className="text-center">
              Fiyat ve ürün adlarını güncelleyin. Kaydettiğinizde siteye anında
              yansır.
            </DialogDescription>
          </DialogHeader>

          <p className="shrink-0 rounded-xl border border-border/70 bg-cream/70 px-3 py-2 text-center text-xs leading-relaxed text-ink/70">
            Değişiklikler <strong>Kaydet</strong>&apos;e basılana kadar
            yayınlanmaz. Sıfırla, tüm değerleri varsayılana döndürür.
          </p>

          <div className="mt-3 flex min-h-0 flex-col gap-3">
            <div>
              <p className="mb-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-orange">
                Ana Ürün
              </p>
              {mainItem && renderRow(mainItem)}
            </div>
            <div>
              <p className="mb-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-orange">
                İçecekler
              </p>
              <div className="flex flex-col gap-2.5">
                {drinkItems.map(renderRow)}
              </div>
            </div>
          </div>

          <div className="mt-4 flex shrink-0 flex-col-reverse gap-2 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="h-10 rounded-full text-sm"
              >
                Kapat
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmReset(true)}
                disabled={resetting}
                className="h-10 rounded-full border-ink/15 text-sm font-medium text-ink/80 transition-colors hover:border-brand-red/40 hover:bg-brand-red/10 hover:text-brand-red"
              >
                {resetting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <RotateCcw className="size-4" aria-hidden="true" />
                )}
                Varsayılana Sıfırla
              </Button>
            </div>
            <Button
              type="button"
              onClick={save}
              disabled={!allValid || !dirty || saving}
              className="h-10 rounded-full bg-ink px-5 text-sm font-semibold text-cream transition-all hover:-translate-y-0.5 hover:bg-brand-red disabled:pointer-events-none disabled:opacity-40 sm:min-w-40"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Kaydediliyor…
                </>
              ) : (
                <>
                  <Save className="size-4" aria-hidden="true" />
                  Kaydet ve Yayınla
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sıfırlama onayı — yanlışlıkla basılmasın */}
      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent className="max-w-[22rem] rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl tracking-tight">
              Menü sıfırlansın mı?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tüm fiyat ve ürün adları varsayılan değerlere döner (ör. Edirne
              Usulü Yaprak Ciğer 420 ₺). Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 flex-col-reverse gap-2 sm:flex-row">
            <AlertDialogCancel className="rounded-full">
              Vazgeç
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={resetToDefaults}
              className="rounded-full bg-brand-red font-semibold hover:bg-brand-red/90"
            >
              Evet, Sıfırla
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
