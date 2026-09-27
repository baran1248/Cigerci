import { SITE_CONFIG } from "./site-config";

/**
 * Menü düzenleme sistemi — istemci ve sunucunun ORTAK kullandığı
 * tipler, sabitler ve doğrulama fonksiyonları.
 *
 * Foolproof ilkesi: aynı doğrulama hem tarayıcıda (anında geri bildirim)
 * hem de API'de (güvenlik) çalışır; okuma yolunda ise geçersiz her alan
 * otomatik olarak varsayılana döner — site hiçbir koşulda bozulamaz.
 */

/** Yönetici şifresi (menü düzenleme girişi). Sunucu her kayıtta yeniden doğrular. */
export const ADMIN_PASSWORD = "2747";

/** Düzenlenebilir ürün: yalnızca ad ve fiyat. */
export interface EditableMenuItem {
  id: string;
  name: string;
  price: number;
}

/** Ad kuralları */
export const NAME_MIN = 2;
export const NAME_MAX = 40;

/** Fiyat kuralları (₺, tam sayı) */
export const PRICE_MIN = 1;
export const PRICE_MAX = 99999;

/** Değiştirilemez, kalıcı ürün kimlikleri (asla değişmez). */
export const MAIN_ITEM_ID = SITE_CONFIG.menu.main.id;
export const DRINK_ITEM_IDS = SITE_CONFIG.menu.drinks.items.map(
  (d) => d.id,
) as string[];
export const MENU_ITEM_IDS = [MAIN_ITEM_ID, ...DRINK_ITEM_IDS];

/** Varsayılan (yayındaki) ürün değerleri — sıfırlama bunlara döner. */
export function defaultMenuItems(): EditableMenuItem[] {
  return [
    {
      id: SITE_CONFIG.menu.main.id,
      name: SITE_CONFIG.menu.main.title,
      price: SITE_CONFIG.menu.main.price,
    },
    ...SITE_CONFIG.menu.drinks.items.map((d) => ({
      id: d.id,
      name: d.name,
      price: d.price,
    })),
  ];
}

/** Ürün adı doğrulama: trim + tek boşluk + uzunluk. Geçerliyse temizlenmiş adı döner. */
export function validateName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.trim().replace(/\s+/g, " ");
  if (cleaned.length < NAME_MIN || cleaned.length > NAME_MAX) return null;
  return cleaned;
}

/** Fiyat doğrulama: tam sayı, 1–99999 ₺. */
export function validatePrice(raw: unknown): number | null {
  if (typeof raw === "number") {
    if (!Number.isInteger(raw)) return null;
    if (raw < PRICE_MIN || raw > PRICE_MAX) return null;
    return raw;
  }
  if (typeof raw === "string") {
    if (!/^\d{1,5}$/.test(raw.trim())) return null;
    const n = Number(raw.trim());
    if (n < PRICE_MIN || n > PRICE_MAX) return null;
    return n;
  }
  return null;
}

/** Fiyat giriş kutusu için rakam filtresi (foolproof yazım deneyimi). */
export function sanitizePriceInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 5);
}
