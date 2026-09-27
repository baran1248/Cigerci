import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CupSoda,
  Droplet,
  Flame,
  Instagram,
  Leaf,
  MapPin,
  Navigation,
  Phone,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirectionsButton } from "@/components/directions-button";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Reveal } from "@/components/reveal";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { BackToTop } from "@/components/back-to-top";
import { NavLinks } from "@/components/nav-links";
import { ShareButton } from "@/components/share-button";
import { ScrollProgress } from "@/components/scroll-progress";
import { MarqueeStrip } from "@/components/marquee-strip";
import { SectionOrnament } from "@/components/section-ornament";
import { OrderBuilder } from "@/components/order-builder";
import { HowToOrder } from "@/components/how-to-order";
import { MapEmbed } from "@/components/map-embed";
import { CopyPhoneButton } from "@/components/copy-phone-button";
import { CopyAddressButton } from "@/components/copy-address-button";
import { PhotoZoom } from "@/components/photo-zoom";
import { PrintMenuButton } from "@/components/print-menu-button";
import { QuickAddButton } from "@/components/quick-add-button";
import { HeadingRule } from "@/components/heading-rule";
import { AdminTrigger } from "@/components/admin-trigger";
import { getEffectiveMenu } from "@/lib/menu-server";
import type { EditableMenuItem } from "@/lib/menu";
import { SITE_CONFIG, type DrinkItem } from "@/lib/site-config";

const { phone, whatsappUrl, instagram, address, maps, hero, location } =
  SITE_CONFIG;

// Menü verileri her istekte veritabanından okunur: yönetici düzenlemeleri
// tüm ziyaretçilere anında yansır ( dinamik render gerekli).
export const dynamic = "force-dynamic";

function formatPrice(price: number) {
  return `${price} ₺`;
}

function DrinkIcon({ icon }: { icon: DrinkItem["icon"] }) {
  if (icon === "droplet") return <Droplet className="size-5" />;
  return <CupSoda className="size-5" />;
}



export default async function Home() {
  // Yayındaki menü: varsayılanlar + yönetici düzenlemeleri (veritabanı)
  const menu = await getEffectiveMenu();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_CONFIG.brand.fullName,
    alternateName: "Edirne Tava Ciğer",
    description:
      "Edirne usulü ince kesim, yağda kızartılan yaprak ciğer. Kartal İstanbul'da geleneksel tava ciğer ve içecekler.",
    servesCuisine: ["Türk Mutfağı", "Edirne Ciğeri", "Tava Ciğer"],
    telephone: "+905434860722",
    url: "https://edirnecigercisikartal.space-z.ai",
    priceRange: "₺₺",
    currenciesAccepted: "TRY",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Çırçır Caddesi No:12",
      addressLocality: "Kartal",
      addressRegion: "İstanbul",
      postalCode: "34860",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.8898,
      longitude: 29.18467,
    },
    sameAs: [
      "https://www.instagram.com/edirnetavaciger_kartal",
    ],
    hasMap: maps.directions,
    acceptsReservations: "False",
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: "Ciğer",
          hasMenuItem: [
            {
              "@type": "MenuItem",
              name: menu.main.title,
              description:
                "Yanında soğan, domates ve kızartılmış biber ile sıcak servis edilir.",
              offers: {
                "@type": "Offer",
                price: menu.main.price,
                priceCurrency: "TRY",
              },
            },
          ],
        },
        {
          "@type": "MenuSection",
          name: "İçecekler",
          hasMenuItem: menu.drinks.items.map((d) => ({
            "@type": "MenuItem",
            name: d.name,
            offers: {
              "@type": "Offer",
              price: d.price,
              priceCurrency: "TRY",
            },
          })),
        },
      ],
    },
  };

  // Menü düzenleyicinin başlangıç değerleri (güncel yayındaki menü)
  const adminItems: EditableMenuItem[] = [
    {
      id: menu.main.id,
      name: menu.main.title,
      price: menu.main.price,
    },
    ...menu.drinks.items.map((d) => ({
      id: d.id,
      name: d.name,
      price: d.price,
    })),
  ];

  return (
    <div className="bg-cream-texture flex min-h-screen flex-col overflow-x-clip text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Klavye kullanıcıları için içeriğe geç bağlantısı */}
      <a
        href="#anasayfa"
        className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-sm font-semibold text-cream focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:shadow-lg"
      >
        İçeriğe geç
      </a>


      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-cream/80 shadow-[0_1px_12px_rgba(29,20,15,0.04)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Marka — uzun basılı tutunca yönetici girişi açılır */}
          <AdminTrigger items={adminItems}>
            <Link
              href="#anasayfa"
              className="group flex flex-col leading-none"
              aria-label="Edirne Tava Ciğercisi ana sayfa"
            >
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {SITE_CONFIG.brand.upper}
              </span>
              <span className="text-sm font-semibold tracking-wide text-ink/80 transition-colors group-hover:text-brand-red">
                {SITE_CONFIG.brand.lower}
              </span>
            </Link>
          </AdminTrigger>

          <NavLinks />

          <div className="flex items-center gap-2.5">
            <Button
              asChild
              className="h-9 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1ebe5a] hover:shadow-md"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp üzerinden sipariş ver"
              >
                <WhatsAppIcon className="size-4" />
                <span className="hidden sm:inline">Sipariş Ver</span>
                <span className="sm:hidden">Sipariş</span>
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="size-9 rounded-full border-ink/15 bg-card/60 p-0 text-ink transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-[#E1306C] hover:text-white"
            >
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram adresimiz"
              >
                <Instagram className="size-4" />
              </a>
            </Button>

            <ShareButton />
          </div>
        </div>

        {/* Okuma ilerleme çubuğu */}
        <ScrollProgress />
      </header>

      <main className="flex-1">
        {/* Yazdırma başlığı — ekranda gizli; print çıktısının tepesinde marka bandı
            (yalnızca mevcut marka/adres/telefon verileriyle, yeni bilgi yok) */}
        <div
          aria-hidden="true"
          className="hidden print:mb-7 print:block print:border-b-2 print:border-brand-red/60 print:pb-4 print:text-center"
        >
          <p className="font-display text-3xl tracking-wide text-brand-red">
            {SITE_CONFIG.brand.upper} {SITE_CONFIG.brand.lower}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.35em] text-ink/70">
            Edirne Tava Ciğer
          </p>
          <p className="mt-2 text-[0.7rem] text-ink/70">
            {address} · {phone.display}
          </p>
        </div>

        {/* ================= HERO ================= */}
        <section
          id="anasayfa"
          tabIndex={-1}
          className="relative overflow-hidden focus:outline-none"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-8 pb-12 sm:px-6 md:pt-10 md:pb-16 lg:grid-cols-2 lg:gap-12 lg:pt-12 lg:pb-20">
            <div className="order-2 lg:order-1">
              <Reveal>
                <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                  <span className="text-brand-gradient">
                    {hero.titleLines[0]}
                  </span>
                  <br />
                  <span className="text-brand-gradient">
                    {hero.titleLines[1]}
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70 sm:text-lg">
                  {hero.description}{" "}
                  <span className="font-semibold text-ink">
                    {hero.highlight}
                  </span>{" "}
                  {hero.highlightSuffix}
                </p>
              </Reveal>

              <Reveal delay={220}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <DirectionsButton />

                  <Button
                    asChild
                    variant="outline"
                    className="group h-12 rounded-full border-ink/20 bg-card/60 px-6 text-base font-semibold text-ink backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream"
                  >
                    <a href="#menu">
                      Menüyü Gör
                      <ArrowRight className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
                    </a>
                  </Button>

                  <Button
                    asChild
                    className="h-12 rounded-full bg-[#1A73E8] px-6 text-base font-semibold text-white shadow-lg shadow-[#1A73E8]/20 transition-all hover:-translate-y-0.5 hover:bg-[#1557B0]"
                  >
                    <a
                      href={maps.review}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Star className="size-5" />
                      Bize Yorum Yapın
                    </a>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink/60">
                  <span className="inline-flex items-center gap-2">
                    <Flame className="size-4 text-orange" />
                    Yağda kızartma
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Leaf className="size-4 text-orange" />
                    Taze hazırlanır
                  </span>
                </div>
              </Reveal>
            </div>

            <div className="order-1 lg:order-2">
              <Reveal delay={150}>
                <div className="group relative">
                  {/* 160 gr damgası */}
                  <div
                    aria-hidden="true"
                    className="absolute -right-3 -top-3 z-20 flex size-20 rotate-12 flex-col items-center justify-center rounded-full border-2 border-dashed border-cream/80 bg-gradient-to-br from-brand-red to-orange text-cream shadow-xl shadow-ink/25 transition-transform duration-500 motion-safe:group-hover:rotate-6 sm:size-24"
                  >
                    <span className="font-display text-2xl leading-none sm:text-3xl">
                      {menu.main.gram.split(" ")[0]}
                    </span>
                    <span className="mt-0.5 text-[0.58rem] font-bold uppercase tracking-[0.2em]">
                      {menu.main.gram.split(" ")[1] ?? "gr"}
                    </span>
                  </div>
                  {/* Köşe çerçeve aksanları */}
                  <span aria-hidden="true" className="absolute -left-2 -top-2 z-10 size-9 rounded-tl-2xl border-l-[3px] border-t-[3px] border-orange/80" />
                  <span aria-hidden="true" className="absolute -right-2 -top-2 z-10 size-9 rounded-tr-2xl border-r-[3px] border-t-[3px] border-orange/80" />
                  <span aria-hidden="true" className="absolute -bottom-2 -left-2 z-10 size-9 rounded-bl-2xl border-b-[3px] border-l-[3px] border-orange/80" />
                  <span aria-hidden="true" className="absolute -bottom-2 -right-2 z-10 size-9 rounded-br-2xl border-b-[3px] border-r-[3px] border-orange/80" />
                  <div className="absolute -inset-3 -rotate-2 rounded-[2rem] bg-gradient-to-br from-orange/20 to-brand-red/20 blur-xl transition-all duration-500 group-hover:rotate-0 group-hover:blur-2xl" />
                  <div className="relative overflow-hidden rounded-[1.75rem] border-4 border-card shadow-2xl shadow-ink/20">
                    <Image
                      alt={hero.imageAlt}
                      width={800}
                      height={533}
                      priority
                      className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                      src={hero.image}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/80 via-ink/20 to-transparent p-4 sm:p-5">
                      <p className="font-display text-2xl text-cream">
                        {hero.badge}
                      </p>
                      <div className="cy-shimmer relative overflow-hidden rounded-full bg-cream px-3 py-1 text-sm font-bold tabular-nums text-ink shadow-lg">
                        {formatPrice(menu.main.price)}
                      </div>
                    </div>

                    {/* Fotoğraf büyütme katmanı */}
                    <PhotoZoom src={hero.image} alt={hero.imageAlt} />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Kayan şerit */}
        <MarqueeStrip />

        {/* ================= MENU ================= */}
        <section id="menu" className="scroll-mt-20 pt-16 pb-10 md:pt-24 md:pb-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="mb-12 text-center">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange">
                  {menu.label}
                </p>
                <HeadingRule />
              </div>
            </Reveal>

            {/* Ana ürün kartı */}
            <Reveal delay={100}>
              <div className="mb-14">
                <div className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl shadow-ink/5 transition-shadow duration-500 hover:shadow-2xl hover:shadow-ink/10">
                  <div className="grid md:grid-cols-5">
                  <div className="relative overflow-hidden md:col-span-2">
                    {/* Şefin Önerisi rozeti */}
                    <div className="cy-shimmer absolute left-4 top-4 z-10 flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-brand-red to-orange px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-white shadow-lg shadow-ink/20">
                      <Flame className="size-3.5" aria-hidden="true" />
                      Şefin Önerisi
                    </div>
                    <Image
                        alt={menu.main.imageAlt}
                        src={menu.main.image}
                        width={800}
                        height={533}
                        loading="lazy"
                        className="h-64 w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105 md:h-full"
                      />

                      {/* Fotoğraf büyütme katmanı */}
                      <PhotoZoom
                        src={menu.main.image}
                        alt={menu.main.imageAlt}
                        caption="Tabağı Gör"
                      />
                    </div>
                    <div className="flex flex-col justify-between gap-6 p-6 sm:p-8 md:col-span-3">
                      <div>
                        <h3 className="font-display text-3xl leading-tight text-ink md:text-4xl">
                          {menu.main.title}
                        </h3>
                        <p className="mt-3 max-w-lg text-ink/65">
                          {menu.main.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-muted-foreground">
                            {menu.main.gram}
                          </span>
                          <span className="font-display text-4xl tabular-nums text-brand-red">
                            {formatPrice(menu.main.price)}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            asChild
                            className="h-12 rounded-full bg-gradient-to-r from-brand-red to-orange px-6 text-base font-semibold text-white shadow-lg shadow-brand-red/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-red/30"
                          >
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ShoppingBag className="size-4.5" />
                              Sipariş Ver
                            </a>
                          </Button>
                          <QuickAddButton
                            name={menu.main.title}
                            label="Siparişe Ekle"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* İçecekler */}
            <Reveal>
              <div className="mb-6 flex items-center gap-3">
                <CupSoda className="size-5 text-orange" />
                <h3 className="font-display text-2xl tracking-tight text-ink md:text-3xl">
                  {menu.drinks.title}
                </h3>
                <div className="h-px flex-1 bg-border/70" />
                <PrintMenuButton />
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {menu.drinks.items.map((drink, i) => (
                <Reveal key={drink.name} delay={i * 80}>
                  <div className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange/40 hover:shadow-lg hover:shadow-ink/10 sm:p-5">
                    <div className="flex min-w-0 items-center gap-3.5">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange/10 text-orange transition-all duration-300 group-hover:rotate-6 group-hover:bg-orange group-hover:text-white">
                        <DrinkIcon icon={drink.icon} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold leading-tight text-ink">
                          {drink.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {drink.volume}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2.5">
                      <span className="font-display text-2xl tabular-nums text-brand-red transition-colors duration-300 group-hover:text-orange">
                        {formatPrice(drink.price)}
                      </span>
                      <QuickAddButton name={drink.name} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================= NASIL SİPARİŞ VERİLİR ================= */}
        <HowToOrder />

        {/* ================= SİPARİŞ OLUŞTURUCU ================= */}
        <OrderBuilder menu={menu} />

        {/* Bölüm süsü */}
        <SectionOrnament />

        {/* ================= KONUM ================= */}
        <section id="konum" className="scroll-mt-20 pt-10 pb-16 md:pt-14 md:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <div className="mb-12 text-center">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange">
                  {location.label}
                </p>
                <h2 className="font-display text-4xl tracking-tight text-ink md:text-5xl">
                  {location.title}
                </h2>
                <HeadingRule />
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-6 rounded-3xl border border-border/70 bg-card p-6 shadow-xl shadow-ink/5 sm:p-8">
                  {/* Adres */}
                  <div className="group flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red transition-transform duration-300 motion-safe:group-hover:scale-110">
                      <MapPin className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Adres
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <p className="font-medium leading-relaxed text-ink">
                          {address}
                        </p>
                        <CopyAddressButton />
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Sipariş Hattı */}
                  <div className="group flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink/5 text-ink transition-transform duration-300 motion-safe:group-hover:scale-110">
                      <Phone className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        WhatsApp Sipariş Hattı
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-ink underline-offset-4 hover:text-brand-red hover:underline"
                        >
                          {phone.display}
                        </a>
                        <CopyPhoneButton />
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="group flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#E1306C]/10 text-[#E1306C] transition-transform duration-300 motion-safe:group-hover:scale-110">
                      <Instagram className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Instagram Adresimiz
                      </p>
                      <a
                        href={instagram.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 font-medium text-ink underline-offset-4 hover:text-brand-red hover:underline"
                      >
                        {instagram.handle}
                      </a>
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
                    <DirectionsButton
                      label="Yol Tarifi Al"
                      variant="card"
                    />
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 flex-1 rounded-full border-ink/20 bg-transparent px-6 text-base font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream"
                    >
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsAppIcon className="size-5 text-[#25D366]" />
                        Sipariş Ver
                      </a>
                    </Button>
                  </div>

                  <Button
                    asChild
                    className="h-12 w-full rounded-full bg-[#1A73E8] px-6 text-base font-semibold text-white shadow-lg shadow-[#1A73E8]/20 transition-all hover:-translate-y-0.5 hover:bg-[#1557B0]"
                  >
                    <a
                      href={maps.review}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Star className="size-5" />
                      Bize Yorum Yapın
                    </a>
                  </Button>
                </div>

                {/* İnteraktif harita */}
                <MapEmbed />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative mt-auto overflow-hidden bg-ink text-cream">
        {/* Üst gradyan çizgi */}
        <div
          aria-hidden="true"
          className="h-1 w-full bg-gradient-to-r from-brand-red via-orange to-brand-red"
        />
        {/* Büyük filigran */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none font-display text-[24vw] leading-none text-cream/[0.045] md:text-[15rem]"
        >
          EDİRNE
        </span>
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 md:grid-cols-3">
            {/* Marka — uzun basılı tutunca yönetici girişi açılır */}
            <div>
              <AdminTrigger items={adminItems}>
                <div className="flex flex-col leading-none">
                  <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-cream/50">
                    {SITE_CONFIG.brand.upper}
                  </p>
                  <p className="text-sm font-semibold text-cream/90">
                    {SITE_CONFIG.brand.lower}
                  </p>
                </div>
              </AdminTrigger>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
                {SITE_CONFIG.footer.description}
              </p>
            </div>

            {/* İletişim */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-orange">
                İletişim
              </p>
              <ul className="space-y-3 text-sm text-cream/70">
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-orange" />
                  <span>{address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-orange" />
                  <a href={phone.tel} className="hover:text-cream">
                    {phone.display}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Instagram className="size-4 shrink-0 text-orange" />
                  <a
                    href={instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cream"
                  >
                    {instagram.handle}
                  </a>
                </li>
              </ul>
            </div>

            {/* Hızlı Erişim */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-orange">
                Hızlı Erişim
              </p>
              <ul className="space-y-2.5 text-sm text-cream/70">
                <li>
                  <Link
                    href="#menu"
                    className="transition-colors hover:text-cream"
                  >
                    Menü
                  </Link>
                </li>
                <li>
                  <Link
                    href="#konum"
                    className="transition-colors hover:text-cream"
                  >
                    Konum &amp; Yol Tarifi
                  </Link>
                </li>
                <li>
                  <a
                    href={maps.review}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-cream"
                  >
                    <Star className="size-4 text-[#1A73E8]" />
                    Bize Yorum Yapın
                  </a>
                </li>
                <li>
                  <a
                    href={instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-cream"
                  >
                    <Instagram className="size-4 text-[#E1306C]" />
                    Instagram Adresimiz
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-cream"
                  >
                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                    WhatsApp Sipariş
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Ayraç süsü — alev ve gradyan çizgiler (marka teması) */}
          <div aria-hidden="true" className="mt-10 flex items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cream/15 to-cream/15" />
            <Flame className="size-3.5 text-orange/80" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-cream/15 to-cream/15" />
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-cream/50 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {SITE_CONFIG.footer.copyright}. Tüm
              hakları saklıdır.
            </p>
            <p>{SITE_CONFIG.footer.tagline}</p>
          </div>
        </div>
      </footer>

      {/* Mobil hızlı işlem çubuğu için alt boşluk */}
      <div
        className="h-0 md:hidden"
        style={{ height: "calc(4.5rem + env(safe-area-inset-bottom))" }}
        aria-hidden="true"
      />

      {/* Mobil hızlı işlem çubuğu + yukarı çık butonu */}
      <MobileActionBar />
      <BackToTop />
    </div>
  );
}
