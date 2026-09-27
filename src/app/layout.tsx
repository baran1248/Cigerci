import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Anton } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://edirnecigercisikartal.space-z.ai"),
  title: "Edirne Tava Ciğercisi | Edirne Tava Ciğer",
  description:
    "Edirne Tava Ciğercisi — Edirne usulü ince kesim, yağda kızartılan yaprak ciğer. Kartal İstanbul'da geleneksel tava ciğer ve içecekler. WhatsApp sipariş hattı ile sipariş verin.",
  applicationName: "Edirne Tava Ciğercisi",
  authors: [{ name: "Edirne Tava Ciğercisi" }],
  keywords: [
    "Edirne ciğer",
    "tava ciğer",
    "Kartal ciğer",
    "Edirne Tava Ciğercisi",
    "yaprak ciğer",
    "ciğer sipariş",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Edirne Tava Ciğercisi | Edirne Tava Ciğer",
    description:
      "Edirne usulü ince kesim, yağda kızartılan yaprak ciğer. Kartal / İstanbul.",
    type: "website",
    locale: "tr_TR",
    images: [
      {
        url: "/og-card.jpg",
        width: 1200,
        height: 630,
        alt: "Edirne Tava Ciğercisi — Edirne Tava Ciğer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edirne Tava Ciğercisi | Edirne Tava Ciğer",
    description:
      "Edirne usulü ince kesim, yağda kızartılan yaprak ciğer. Kartal / İstanbul. WhatsApp ile sipariş: +90 543 486 07 22",
    images: ["/og-card.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#b8412a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
