import { NextResponse } from "next/server";
import { getEffectiveMenu } from "@/lib/menu-server";
import { writeStoredMenuJson } from "@/lib/menu-storage";
import {
  ADMIN_PASSWORD,
  MENU_ITEM_IDS,
  validateName,
  validatePrice,
  type EditableMenuItem,
} from "@/lib/menu";

export const dynamic = "force-dynamic";

/** GET /api/menu — o anda yayında olan (varsayılan + düzenleme) menü. */
export async function GET() {
  const menu = await getEffectiveMenu();
  return NextResponse.json({ ok: true, menu });
}

/**
 * PUT /api/menu — menü güncelleme.
 * Gövde: { password: string, items: { id, name, price }[] }
 * Tüm ürünler eksiksiz ve geçerli olmalı; şifre doğru olmalı.
 */
export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz istek." },
      { status: 400 },
    );
  }

  const { password, items } = (body ?? {}) as {
    password?: unknown;
    items?: unknown;
  };

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Şifre hatalı. Değişiklik kaydedilmedi." },
      { status: 401 },
    );
  }

  if (!Array.isArray(items)) {
    return NextResponse.json(
      { ok: false, error: "Ürün listesi geçersiz." },
      { status: 400 },
    );
  }

  const validated: Record<string, EditableMenuItem> = {};
  for (const raw of items) {
    const item = raw as { id?: unknown; name?: unknown; price?: unknown };
    if (typeof item?.id !== "string" || !MENU_ITEM_IDS.includes(item.id)) {
      return NextResponse.json(
        { ok: false, error: "Bilinmeyen ürün algılandı; kayıt reddedildi." },
        { status: 400 },
      );
    }
    if (validated[item.id]) {
      return NextResponse.json(
        { ok: false, error: "Aynı ürün birden çok kez gönderildi." },
        { status: 400 },
      );
    }
    const name = validateName(item.name);
    const price = validatePrice(item.price);
    if (name === null || price === null) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Bir ürün adı veya fiyatı geçersiz. Ad 2–40 karakter, fiyat 1–99999 ₺ arası tam sayı olmalı.",
        },
        { status: 400 },
      );
    }
    validated[item.id] = { id: item.id, name, price };
  }

  if (Object.keys(validated).length !== MENU_ITEM_IDS.length) {
    return NextResponse.json(
      { ok: false, error: "Eksik ürün var; tüm menü gönderilmeli." },
      { status: 400 },
    );
  }

  const data = JSON.stringify({ items: validated });
  try {
    await writeStoredMenuJson(data);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Değişiklik kaydedilemedi. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }

  const menu = await getEffectiveMenu();
  return NextResponse.json({ ok: true, menu });
}
