import { ClipboardList, Flame, Send } from "lucide-react";
import { Reveal } from "@/components/reveal";

/**
 * Menü ile sipariş oluşturucu arasına yerleşen 3 adımlı sipariş rehberi.
 * İçerik yalnızca sitede zaten var olan gerçek bilgilere dayanır
 * (menüden seçim → WhatsApp mesajı → taze hazırlık); yeni iş iddiası içermez.
 */

const STEPS = [
  {
    icon: ClipboardList,
    title: "Ürünlerini Seç",
    desc: "Menüden dilediğin ürün ve adetleri aşağıdaki sipariş panelinden belirle.",
  },
  {
    icon: Send,
    title: "WhatsApp ile Gönder",
    desc: "Seçtiklerin ve toplam tutar, hazır mesaj olarak WhatsApp hattımıza gider.",
  },
  {
    icon: Flame,
    title: "Taze Hazırlanır",
    desc: "Siparişin taze hazırlanır — sıcacık servis için hazır olur.",
  },
] as const;

export function HowToOrder() {
  return (
    <section
      id="nasil-siparis"
      aria-labelledby="nasil-siparis-baslik"
      className="no-print pt-8 md:pt-10"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-8 flex items-center gap-3">
            <h2
              id="nasil-siparis-baslik"
              className="font-display text-2xl tracking-tight text-ink md:text-3xl"
            >
              Nasıl Sipariş Verilir?
            </h2>
            <div className="h-px flex-1 bg-border/70" />
          </div>
        </Reveal>

        <div className="relative grid gap-4 sm:grid-cols-3 sm:gap-6">
          {/* Masaüstünde adımları bağlayan kesikli çizgi */}
          <div
            aria-hidden="true"
            className="absolute left-[17%] right-[17%] top-11 hidden border-t-2 border-dashed border-orange/35 sm:block"
          />

          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <div className="group relative flex h-full flex-col items-center rounded-2xl border border-border/70 bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange/40 hover:shadow-lg hover:shadow-ink/10">
                <span className="relative">
                  <span className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-red to-orange text-white shadow-lg shadow-brand-red/25 transition-transform duration-300 motion-safe:group-hover:rotate-6 motion-safe:group-hover:scale-110">
                    <step.icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border-2 border-card bg-ink text-[0.7rem] font-bold text-cream">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-4 font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
