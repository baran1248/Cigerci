import { getStore } from "@netlify/blobs";

/**
 * Kalıcı menü depolama — Netlify Blobs.
 *
 * Site Netlify'da sunucusuz (serverless) çalıştığı için dosya sistemi
 * kalıcı değildir; SQLite dosyasına yazılan menü düzenlemeleri kaybolur.
 * Bu yüzden yönetici düzenlemeleri Netlify'nin kalıcı anahtar-değer
 * deposunda (Blobs) tutulur: kaydedilen fiyat/anında yayına girer.
 *
 * Okuma yolunda hata olursa çağıran taraf (getEffectiveMenu) zaten
 * varsayılan menüye düşer; site asla hata sayfası göstermez.
 */

const BLOB_STORE = "site-settings";
const BLOB_KEY = "menu";

function store() {
  return getStore(BLOB_STORE);
}

/** Kayıtlı menü JSON'unu oku; hiç kayıt yoksa null döner. */
export async function readStoredMenuJson(): Promise<string | null> {
  return (await store().get(BLOB_KEY)) ?? null;
}

/** Menü JSON'unu kalıcı olarak kaydet. */
export async function writeStoredMenuJson(data: string): Promise<void> {
  await store().set(BLOB_KEY, data);
}

/**
 * Menüyü varsayılana döndür: boş kayıt yazar.
 * (Silme yerine yazma kullanılır: yazma yolunda okuma anında tutarlıdır,
 * silme sonrası ise kısa süre eski değer okunabilir.)
 */
export async function resetStoredMenu(): Promise<void> {
  await writeStoredMenuJson(JSON.stringify({ items: {} }));
}
