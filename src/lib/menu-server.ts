import { readStoredMenuJson } from "./menu-storage";
import { SITE_CONFIG } from "./site-config";
import { validateName, validatePrice, type DrinkItem } from "./menu";

/**
 * Sunucu tarafı: kalıcı depodaki (Netlify Blobs) yönetici düzenlemeleriyle
 * varsayılanları birleştirip SAYFANIN GERÇEKTEN KULLANDIĞI menüyü üretir.
 *
 * Foolproof garanti:
 * - Depoda kayıt yoksa / JSON bozuksa / herhangi bir alan geçersizse
 *   o alan sessizce varsayılana döner; site asla hata sayfası göstermez.
 */

export interface EffectiveMainItem {
  id: string;
  title: string;
  description: string;
  gram: string;
  price: number;
  image: string;
  imageAlt: string;
}

export interface EffectiveMenu {
  label: string;
  main: EffectiveMainItem;
  drinks: { title: string; items: DrinkItem[] };
}

function defaultMenu(): EffectiveMenu {
  return {
    label: SITE_CONFIG.menu.label,
    main: { ...SITE_CONFIG.menu.main },
    drinks: {
      title: SITE_CONFIG.menu.drinks.title,
      items: SITE_CONFIG.menu.drinks.items.map((d) => ({ ...d })),
    },
  };
}

type StoredItem = { name?: unknown; price?: unknown };

export async function getEffectiveMenu(): Promise<EffectiveMenu> {
  const menu = defaultMenu();
  try {
    const raw = await readStoredMenuJson();
    if (!raw) return menu;

    const parsed = JSON.parse(raw) as { items?: Record<string, StoredItem> };
    const stored = parsed?.items;
    if (!stored || typeof stored !== "object") return menu;

    // Ana ürün — yalnızca geçerli alanlar uygulanır
    const mainStored = stored[menu.main.id];
    if (mainStored) {
      const name = validateName(mainStored.name);
      const price = validatePrice(mainStored.price);
      if (name !== null) menu.main.title = name;
      if (price !== null) menu.main.price = price;
    }

    // İçecekler — her biri bağımsız doğrulanır
    menu.drinks.items = menu.drinks.items.map((d) => {
      const s = stored[d.id];
      if (!s) return d;
      const name = validateName(s.name);
      const price = validatePrice(s.price);
      return {
        ...d,
        name: name !== null ? name : d.name,
        price: price !== null ? price : d.price,
      };
    });

    return menu;
  } catch {
    // Depo erişilemiyor / veri bozuk → varsayılan menü
    return menu;
  }
}
