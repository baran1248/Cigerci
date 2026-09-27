export const SITE_CONFIG = {
  brand: {
    upper: "Edirne Tava",
    lower: "Ciğercisi",
    fullName: "Edirne Tava Ciğercisi",
  },
  phone: {
    display: "+90 543 486 07 22",
    tel: "tel:+905434860722",
    waNumber: "905434860722",
  },
  whatsappUrl:
    "https://wa.me/905434860722?text=Merhaba%20Edirne%20Tava%20Ci%C4%9Fercisi%2C%20Edirne%20tava%20ci%C4%9Fer%20sipari%C5%9Fi%20vermek%20istiyorum.",
  instagram: {
    handle: "@edirnetavaciger_kartal",
    url: "https://www.instagram.com/edirnetavaciger_kartal?utm_source=qr&stkn=MWJmbDl3cGZzemRnbQ==",
  },
  address:
    "Çırçır Caddesi No:12, 34860 Kartal / İstanbul, Türkiye",
  maps: {
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=40.8898,29.18467",
    review: "https://maps.app.goo.gl/5QfFZnAtEyYYdXrS7?g_st=iw",
    label: "Edirne Tava Ciğercisi — Kartal / İstanbul",
  },
  hero: {
    titleLines: ["Edirne", "Tava Ciğer"],
    description:
      "İncecik kesilip tam kıvamında yağda kızartılan yaprak ciğerin efsane lezzeti. Dışı çıtır, içi yumuşak —",
    highlight: "160 gramlık porsiyon",
    highlightSuffix: "ile sıcacık karşınızda.",
    image: "/ciger-yusuf-portion.jpg",
    imageAlt: "Edirne usulü yağda kızartılmış yaprak ciğer tava",
    badge: "Edirne Usulü Ciğer",
  },
  menu: {
    label: "Menü",
    main: {
      id: "ciger",
      title: "Edirne Usulü Yaprak Ciğer",
      description:
        "Yanında soğan, domates ve kızartılmış biber ile sıcak servis edilir.",
      gram: "160 gr",
      price: 420,
      image: "/ciger-yusuf-plate.jpg",
      imageAlt: "Edirne usulü yaprak ciğer tabağı",
    },
    drinks: {
      title: "İçecekler",
      items: [
        { id: "ayran", name: "Açık Ayran", volume: "300 ml", price: 50, icon: "droplet" },
        { id: "cola-sise", name: "Coca Cola (Şişe)", volume: "250 ml", price: 60, icon: "cup" },
        { id: "cola-kutu", name: "Coca Cola (Kutu)", volume: "330 ml", price: 70, icon: "cup" },
        { id: "fanta", name: "Fanta", volume: "330 ml", price: 60, icon: "cup" },
        { id: "soda", name: "Damla Soda", volume: "200 ml", price: 30, icon: "cup" },
        { id: "su", name: "Damla Su", volume: "0,5 L", price: 20, icon: "droplet" },
      ] as DrinkItem[],
    },
  },
  location: {
    label: "Konum",
    title: "Bize Ulaşın",
  },
  footer: {
    description:
      "Edirne usulü ince kesim, yağda kızartılan yaprak ciğerin adresi. Kartal'da sıcacık servis.",
    copyright: "Edirne Tava Ciğercisi",
    tagline: "Edirne Tava Ciğer · Kartal / İstanbul",
  },
} as const;

export interface DrinkItem {
  id: string;
  name: string;
  volume: string;
  price: number;
  icon: "droplet" | "cup";
}
