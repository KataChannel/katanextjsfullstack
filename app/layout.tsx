import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import { Providers } from "@/components/providers";
import { headers } from "next/headers";
import { extractDomain } from "@/lib/database";
import { getPrisma } from "@/lib/prisma";
import { generateMetadataFromSettings, generateViewportFromSettings } from "@/lib/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Generate dynamic metadata from database
 * Falls back to default values if websiteSettings not found
 */
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const hostname = headersList.get("x-hostname") || "";
  const domain = extractDomain(hostname);
  
  let websiteSettings = null;
  try {
    const prisma = await getPrisma();
    websiteSettings = await prisma.websiteSettings.findUnique({
      where: { domain },
    });
  } catch (error) {
    console.error("Error fetching website settings:", error);
  }

  return generateMetadataFromSettings({
    settings: websiteSettings,
  });
}

/**
 * Generate viewport configuration
 */
export async function generateViewport(): Promise<Viewport> {
  const headersList = await headers();
  const hostname = headersList.get("x-hostname") || "";
  const domain = extractDomain(hostname);
  
  let websiteSettings = null;
  try {
    const prisma = await getPrisma();
    websiteSettings = await prisma.websiteSettings.findUnique({
      where: { domain },
    });
  } catch (error) {
    console.error("Error fetching website settings:", error);
  }

  return generateViewportFromSettings(websiteSettings);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get website settings for current domain
  const headersList = await headers();
  const hostname = headersList.get("x-hostname") || "";
  const domain = extractDomain(hostname);
  
  let websiteSettings = null;
  try {
    const prisma = await getPrisma();
    websiteSettings = await prisma.websiteSettings.findUnique({
      where: { domain },
    });
  } catch (error) {
    console.error("Error fetching website settings:", error);
  }

  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={websiteSettings?.siteName || "Website"} />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Custom header code from settings */}
        {websiteSettings?.headerCode && (
          <script
            dangerouslySetInnerHTML={{ __html: websiteSettings.headerCode }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Custom CSS from settings */}
        {websiteSettings?.customCss && (
          <style dangerouslySetInnerHTML={{ __html: websiteSettings.customCss }} />
        )}
        
        <Providers>
          {children}
        </Providers>
        <Toaster />
        
        {/* Analytics Scripts */}
        <Analytics
          googleAnalytics={websiteSettings?.googleAnalytics}
          googleTagManager={websiteSettings?.googleTagManager}
          facebookPixel={websiteSettings?.facebookPixel}
        />
        
        {/* Custom footer code from settings */}
        {websiteSettings?.footerCode && (
          <script
            dangerouslySetInnerHTML={{ __html: websiteSettings.footerCode }}
          />
        )}
        
        {/* Custom JavaScript from settings */}
        {websiteSettings?.customJs && (
          <script
            dangerouslySetInnerHTML={{ __html: websiteSettings.customJs }}
          />
        )}
      </body>
    </html>
  );
}
