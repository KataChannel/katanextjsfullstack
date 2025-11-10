import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { headers } from "next/headers";
import { extractDomain } from "@/lib/database";
import { getPrisma } from "@/lib/prisma";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Taza Group - Giải pháp thẩm mỹ toàn diện",
    template: "%s | Taza Group",
  },
  description: "Taza Group - Hệ thống phòng khám và spa chuyên nghiệp hàng đầu Việt Nam",
  keywords: ["thẩm mỹ", "spa", "phòng khám", "chăm sóc da", "làm đẹp"],
  authors: [{ name: "Taza Group" }],
  creator: "Taza Group",
  publisher: "Taza Group",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tazagroup.vn"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Taza Group - Giải pháp thẩm mỹ toàn diện",
    description: "Hệ thống phòng khám và spa chuyên nghiệp hàng đầu Việt Nam",
    url: "https://tazagroup.vn",
    siteName: "Taza Group",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taza Group - Giải pháp thẩm mỹ toàn diện",
    description: "Hệ thống phòng khám và spa chuyên nghiệp hàng đầu Việt Nam",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get SEO settings for current domain
  const headersList = await headers();
  const hostname = headersList.get("x-hostname") || "";
  const domain = extractDomain(hostname);
  
  let seoSettings = null;
  try {
    const prisma = await getPrisma();
    seoSettings = await prisma.seoSettings.findUnique({
      where: { domain },
    });
  } catch (error) {
    console.error("Error fetching SEO settings:", error);
  }

  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Taza Group" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster />
        
        {/* Analytics Scripts */}
        <Analytics
          googleAnalytics={seoSettings?.googleAnalytics}
          googleTagManager={seoSettings?.googleTagManager}
          facebookPixel={seoSettings?.facebookPixel}
        />
      </body>
    </html>
  );
}
