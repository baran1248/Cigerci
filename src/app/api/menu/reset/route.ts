import { NextResponse } from "next/server";
import { getEffectiveMenu } from "@/lib/menu-server";
import { resetStoredMenu } from "@/lib/menu-storage";
import { ADMIN_PASSWORD } from "@/lib/menu";

export const dynamic = "force-dynamic";

/**
 * POST /api/menu/reset — menüyü varsayılana sıfırla.
 * Gövde: { password: string }
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz istek." },
      { status: 400 },
    );
  }

  const { password } = (body ?? {}) as { password?: unknown };
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Şifre hatalı. Sıfırlama yapılmadı." },
      { status: 401 },
    );
  }

  try {
    await resetStoredMenu();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Sıfırlama kaydedilemedi. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }

  const menu = await getEffectiveMenu();
  return NextResponse.json({ ok: true, menu });
}
