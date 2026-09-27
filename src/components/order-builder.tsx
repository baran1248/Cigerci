"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Check,
  CupSoda,
  Droplet,
  Flame,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
  StickyNote,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Reveal } from "@/components/reveal";
import { HeadingRule } from "@/components/heading-rule";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { SITE_CONFIG, type DrinkItem } from "@/lib/site-config";
import type { EffectiveMenu } from "@/lib/menu-server";

const { phone } = SITE_CONFIG;

const STORAGE_KEY = "cy-siparis-secimleri";
const NOTE_KEY = "cy-siparis-notu";
const MAX_QTY = 99;
const MAX_NOTE_LEN = 200;

function formatPrice(price: number) {
  return `${price} ₺`;
}

function DrinkIcon({ icon }: { icon: DrinkItem["icon"] }) {
  if (icon === "droplet") return <Droplet className="size-4.5" />;
  return <CupSoda className="size-4.5" />;
}

function Stepper({
  name,
  qty,
  onDec,
  onInc,
}: {
  name: string;
  qty: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-ink/10 bg-cream p-1 shadow-inner">
      <button
        type="button"
        onClick={onDec}
        disabled={qty === 0}
        aria-label={`${name} adedini azalt`}
        className="flex size-7 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink hover:text-cream disabled:pointer-events-none disabled:opacity-25"
      >
        <Minus className="size-3.5" />
      </button>
      <span
        className="min-w-7 text-center text-sm font-bold tabular-nums text-ink"
        aria-label={`${name}: ${qty} adet`}
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={onInc}
        aria-label={`${name} adedini artır`}
        className="flex size-7 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink hover:text-cream"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

interface SelectedItem {
  name: string;
  detail: string;
  qty: number;
  price: number;
}

interface OrderBuilderProps {
  /** Sunucudan gelen güncel menü (varsayılanlar + yönetici düzenlemeleri). */
  menu: EffectiveMenu;
}

export function OrderBuilder({ menu }: OrderBuilderProps) {
  // Yayındaki ürün adları — hızlı ekleme ve kayıtlı seçim doğrulaması bunlarla yapılır
  const VALID_NAMES = new Set<string>([
    menu.main.title,
    ...menu.drinks.items.map((d) => d.name),
  ]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [note, setNote] = useState("");
  const restoredRef = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const { toast } = useToast();

  // Mount'ta: kaydedilmiş seçimleri ve notu güvenli şekilde geri yükle
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const restored: Record<string, number> = {};
        for (const [name, qty] of Object.entries(parsed)) {
          const n = Number(qty);
          if (VALID_NAMES.has(name) && Number.isFinite(n) && n >= 1) {
            restored[name] = Math.min(MAX_QTY, Math.floor(n));
          }
        }
        if (Object.keys(restored).length > 0) {
          // Mikro görev: hidrasyon sonrası, paint öncesi uygula
          queueMicrotask(() => setQuantities(restored));
          // Toaster'ın dinleyicisi ilk mount akışında geç kaydolabilir —
          // güvenli gösterim için kısa gecikme
          setTimeout(() => {
            toast({
              title: "Kayıtlı seçimler geri yüklendi",
              description: "Önceki sipariş seçiminiz bu cihazdan geri getirildi.",
            });
          }, 300);
        }
      }
      const savedNote = window.localStorage.getItem(NOTE_KEY);
      if (typeof savedNote === "string" && savedNote.trim()) {
        const restoredNote = savedNote.trim().slice(0, MAX_NOTE_LEN);
        queueMicrotask(() => setNote(restoredNote));
      }
    } catch {
      /* localStorage kullanılamıyor — sessizce geç */
    }
    restoredRef.current = true;
  }, [toast]);

  // Mobil yüzen çubuk: özet paneli ekranda görünürken gizle
  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setSummaryVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Seçim değiştikçe kaydet
  useEffect(() => {
    if (!restoredRef.current) return;
    try {
      if (Object.keys(quantities).length === 0) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
      }
    } catch {
      /* sessizce geç */
    }
  }, [quantities]);

  // Not değiştikçe kaydet
  useEffect(() => {
    if (!restoredRef.current) return;
    try {
      const t = note.trim();
      if (t) {
        window.localStorage.setItem(NOTE_KEY, t);
      } else {
        window.localStorage.removeItem(NOTE_KEY);
      }
    } catch {
      /* sessizce geç */
    }
  }, [note]);

  // Menü kartlarından hızlı ekleme (QuickAddButton → cy-quick-add event'i)
  useEffect(() => {
    const handler = (e: Event) => {
      const name = (e as CustomEvent<{ name: string }>).detail?.name;
      if (name && VALID_NAMES.has(name)) {
        setQuantities((q) => ({
          ...q,
          [name]: Math.min(MAX_QTY, Math.max(0, (q[name] ?? 0) + 1)),
        }));
      }
    };
    window.addEventListener("cy-quick-add", handler);
    return () => window.removeEventListener("cy-quick-add", handler);
  }, []);

  const setQty = (name: string, delta: number) =>
    setQuantities((q) => ({
      ...q,
      [name]: Math.min(MAX_QTY, Math.max(0, (q[name] ?? 0) + delta)),
    }));

  // Özet satırındaki X butonu: ürünü tümüyle kaldır — "Geri Al" ile geri alınabilir
  const removeItem = (name: string) => {
    const prevQty = quantities[name] ?? 0;
    setQuantities((q) => {
      const next = { ...q };
      delete next[name];
      return next;
    });
    if (prevQty > 0) {
      toast({
        title: "Ürün kaldırıldı",
        description: `${name} siparişten çıkarıldı.`,
        action: (
          <ToastAction
            altText={`${name} ürününü geri ekle`}
            onClick={() =>
              setQuantities((q) => ({
                ...q,
                [name]: Math.min(MAX_QTY, prevQty),
              }))
            }
          >
            Geri Al
          </ToastAction>
        ),
      });
    }
  };

  const clearAll = () => {
    const snapshot = { ...quantities };
    const snapshotNote = note;
    setQuantities({});
    setNote("");
    toast({
      title: "Seçimler temizlendi",
      description: "Tüm sipariş seçimleri ve not kaldırıldı.",
      action: (
        <ToastAction
          altText="Seçimleri geri yükle"
          onClick={() => {
            setQuantities(snapshot);
            setNote(snapshotNote);
          }}
        >
          Geri Al
        </ToastAction>
      ),
    });
  };

  const selected: SelectedItem[] = [];
  const mainQty = quantities[menu.main.title] ?? 0;
  if (mainQty > 0) {
    selected.push({
      name: menu.main.title,
      detail: menu.main.gram,
      qty: mainQty,
      price: menu.main.price,
    });
  }
  for (const drink of menu.drinks.items) {
    const q = quantities[drink.name] ?? 0;
    if (q > 0) {
      selected.push({
        name: drink.name,
        detail: drink.volume,
        qty: q,
        price: drink.price,
      });
    }
  }

  const totalCount = selected.reduce((sum, item) => sum + item.qty, 0);
  const total = selected.reduce((sum, item) => sum + item.qty * item.price, 0);

  // Sipariş sayısı/tutarı değiştikçe diğer bileşenlere bildir
  // (ör. header'daki "Sipariş" bağlantısı rozeti)
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("cy-order-changed", {
        detail: { count: totalCount, total },
      })
    );
  }, [totalCount, total]);

  const sendOrder = () => {
    if (totalCount === 0) return;
    const lines = selected.map(
      (item) =>
        `• ${item.qty}x ${item.name} (${item.detail}) — ${item.qty * item.price} ₺`
    );
    const noteText = note.trim().slice(0, MAX_NOTE_LEN);
    const message = `Merhaba ${SITE_CONFIG.brand.fullName}! Sipariş vermek istiyorum:\n\n${lines.join(
      "\n"
    )}${noteText ? `\n\nNot: ${noteText}` : ""}\n\nToplam: ${total} ₺`;
    window.open(
      `https://wa.me/${phone.waNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section
      id="siparis"
      aria-labelledby="siparis-baslik"
      className="no-print scroll-mt-20 pt-10 pb-12 md:pt-14 md:pb-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange">
              Hızlı Sipariş
            </p>
            <h2
              id="siparis-baslik"
              className="font-display text-4xl tracking-tight text-ink md:text-5xl"
            >
              Siparişini Oluştur
            </h2>
            <HeadingRule />
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink/65">
              Ürünleri seçin — seçtikleriniz ve toplam tutar, WhatsApp hattımızda
              hazır mesaj olarak açılır.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Sol taraf: ürün seçimi */}
          <Reveal
            className="flex min-w-0 flex-col gap-4 lg:col-span-3"
            delay={120}
          >
            {/* Ana ürün */}
            <div
              className={`rounded-2xl border bg-card p-4 shadow-sm transition-all duration-300 hover:border-orange/40 sm:p-5 ${
                mainQty > 0
                  ? "border-orange/50 bg-orange/[0.04] shadow-md shadow-orange/10"
                  : "border-border/70"
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <span className="relative shrink-0">
                  <Image
                    src={menu.main.image}
                    alt={menu.main.imageAlt}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="size-16 rounded-xl border-2 border-card object-cover shadow-sm sm:size-20"
                  />
                  {mainQty > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-brand-red text-[0.65rem] font-bold text-white shadow">
                      {mainQty}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1 max-sm:min-w-44">
                  <p className="flex items-center gap-1.5 font-semibold leading-tight text-ink">
                    <Flame className="size-4 shrink-0 text-orange" />
                    <span className="break-words">{menu.main.title}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {menu.main.gram} · {formatPrice(menu.main.price)}
                  </p>
                </div>
                <div className="shrink-0 max-sm:ml-auto">
                  <Stepper
                    name={menu.main.title}
                    qty={mainQty}
                    onDec={() => setQty(menu.main.title, -1)}
                    onInc={() => setQty(menu.main.title, 1)}
                  />
                </div>
              </div>
            </div>

            {/* İçecekler */}
            <div className="grid gap-4 sm:grid-cols-2">
              {menu.drinks.items.map((drink) => {
                const q = quantities[drink.name] ?? 0;
                return (
                  <div
                    key={drink.name}
                    className={`flex items-center justify-between gap-3 rounded-2xl border bg-card p-4 transition-all duration-300 hover:border-orange/40 ${
                      q > 0
                        ? "border-orange/50 bg-orange/[0.04] shadow-md shadow-orange/10"
                        : "border-border/70"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                          q > 0 ? "bg-orange text-white" : "bg-orange/10 text-orange"
                        }`}
                      >
                        <DrinkIcon icon={drink.icon} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold leading-tight text-ink">
                          {drink.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {drink.volume} · {formatPrice(drink.price)}
                        </p>
                      </div>
                    </div>
                    <Stepper
                      name={drink.name}
                      qty={q}
                      onDec={() => setQty(drink.name, -1)}
                      onInc={() => setQty(drink.name, 1)}
                    />
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Sağ taraf: canlı sipariş özeti */}
          <Reveal
            className="min-w-0 lg:col-span-2 lg:sticky lg:top-24 lg:self-start"
            delay={220}
          >
            <div
              ref={summaryRef}
              className="flex flex-col rounded-3xl bg-ink p-6 text-cream shadow-xl shadow-ink/20 sm:p-7"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-red to-orange shadow-lg">
                  <ShoppingBag className="size-5 text-white" />
                </span>
                <div>
                  <h3 className="font-display text-2xl leading-none">
                    Sipariş Özeti
                  </h3>
                  <p className="mt-1 text-xs text-cream/50">
                    {totalCount > 0
                      ? `${totalCount} ürün seçildi`
                      : "Henüz ürün seçilmedi"}
                  </p>
                </div>
                {/* Otomatik kayıt göstergesi — seçim değiştikçe belirir, sonra solar */}
                {totalCount > 0 && (
                  <span
                    key={JSON.stringify(quantities)}
                    aria-hidden="true"
                    className="cy-saved-chip pointer-events-none ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-cream/15 bg-cream/[0.08] px-2.5 py-1 text-[0.65rem] font-semibold text-cream/70"
                  >
                    <Check className="size-3 text-[#25D366]" />
                    Kaydedildi
                  </span>
                )}
              </div>

              {totalCount === 0 ? (
                <div className="mt-7 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-cream/20 p-6 text-center">
                  <Utensils className="size-6 text-cream/30" />
                  <p className="text-sm leading-relaxed text-cream/55">
                    Menüden ürün seçin; seçtikleriniz ve toplam tutar burada
                    görünecek.
                  </p>
                </div>
              ) : (
                <>
                  <ul className="mt-6 flex-1 space-y-1">
                    {selected.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-cream/[0.07]"
                      >
                        <span className="min-w-0 text-cream/75">
                          <span className="font-bold text-cream">{item.qty}×</span>{" "}
                          {item.name}{" "}
                          <span className="text-cream/45">({item.detail})</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1">
                          <span className="font-semibold tabular-nums">
                            {formatPrice(item.qty * item.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.name)}
                            aria-label={`${item.name} ürününü siparişten çıkar`}
                            title={`${item.name} ürününü siparişten çıkar`}
                            className="flex size-6 items-center justify-center rounded-full text-cream/35 transition-all hover:bg-brand-red hover:text-white hover:shadow-md hover:shadow-brand-red/30 active:scale-90"
                          >
                            <X className="size-3.5" />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Sipariş notu */}
                  <div className="mt-5">
                    <label
                      htmlFor="siparis-notu"
                      className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cream/45"
                    >
                      <StickyNote className="size-3" aria-hidden="true" />
                      Sipariş Notu
                      <span className="font-normal normal-case tracking-normal text-cream/30">
                        (isteğe bağlı)
                      </span>
                    </label>
                    <textarea
                      id="siparis-notu"
                      value={note}
                      onChange={(e) =>
                        setNote(e.target.value.slice(0, MAX_NOTE_LEN))
                      }
                      rows={2}
                      maxLength={MAX_NOTE_LEN}
                      placeholder="Siparişinize dair bir notunuz varsa buraya yazın"
                      className="mt-2 w-full resize-none rounded-xl border border-cream/15 bg-cream/[0.06] px-3 py-2 text-sm leading-relaxed text-cream placeholder:text-cream/30 transition-colors focus:border-orange/60 focus:outline-none focus:ring-1 focus:ring-orange/40"
                    />
                    <p
                      className="mt-1 text-right text-[0.6rem] tabular-nums text-cream/30"
                      aria-hidden="true"
                    >
                      {note.length}/{MAX_NOTE_LEN}
                    </p>
                  </div>
                </>
              )}

              <div className="mt-6 border-t border-dashed border-cream/25 pt-5">
                <div
                  className="flex items-baseline justify-between"
                  role="status"
                  aria-live="polite"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/50">
                    Toplam
                  </span>
                  <span className="font-display text-4xl text-cream">
                    <span
                      key={total}
                      className="cy-pop inline-block tabular-nums"
                    >
                      {total}
                    </span>{" "}
                    <span className="text-2xl text-orange">₺</span>
                  </span>
                </div>

                <Button
                  type="button"
                  onClick={sendOrder}
                  disabled={totalCount === 0}
                  className="mt-5 h-12 w-full rounded-full bg-[#25D366] text-base font-semibold text-white shadow-lg shadow-[#25D366]/20 transition-all hover:-translate-y-0.5 hover:bg-[#1ebe5a] hover:shadow-xl disabled:pointer-events-none disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  <WhatsAppIcon className="size-5" />
                  WhatsApp ile Gönder
                </Button>

                {totalCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-medium text-cream/50 transition-colors hover:bg-cream/10 hover:text-cream"
                  >
                    <RotateCcw className="size-3.5" />
                    Seçimleri Temizle
                  </button>
                )}

                <p className="mt-4 text-center text-[0.7rem] leading-relaxed text-cream/40">
                  Siparişiniz {phone.display} numaralı WhatsApp hattımızda hazır
                  mesaj olarak açılır.
                </p>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-[0.65rem] text-cream/35">
                  <RotateCcw className="size-3" aria-hidden="true" />
                  Seçimleriniz bu cihazda otomatik saklanır
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Mobil yüzen sipariş çubuğu — özet paneli görünür değilken
          (ürün seçiliyken menüde gezinirken hızlı erişim) */}
      {totalCount > 0 && !summaryVisible && (
        <div
          className="no-print fixed inset-x-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-40 md:hidden"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-ink py-2.5 pl-4 pr-2.5 text-cream shadow-2xl shadow-ink/40 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="min-w-0">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-cream/60">
                <span
                  key={totalCount}
                  className="cy-pop inline-block tabular-nums"
                >
                  {totalCount}
                </span>{" "}
                ürün
              </p>
              <p className="font-display text-xl leading-tight text-orange">
                <span key={total} className="cy-pop inline-block tabular-nums">
                  {total}
                </span>{" "}
                <span className="text-sm text-cream/60">₺</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={clearAll}
                aria-label="Seçimleri temizle"
                className="flex size-10 items-center justify-center rounded-full text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream active:scale-95"
              >
                <Trash2 className="size-4.5" />
              </button>
              <button
                type="button"
                onClick={sendOrder}
                className="flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1ebe5a] active:scale-95"
              >
                <WhatsAppIcon className="size-4.5" />
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
