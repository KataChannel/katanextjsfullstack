/**
 * Generate dynamic metadata from WebsiteSettings
 * Used in layout.tsx and page components
 */

import type { Metadata, Viewport } from "next";
import { WebsiteSettings } from "@prisma/client";

interface GenerateMetadataOptions {
  settings: WebsiteSettings | null;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

/**
 * Generate metadata for pages based on websiteSettings
 */
export function generateMetadataFromSettings(options: GenerateMetadataOptions): Metadata {
  const { settings, title, description, image, url } = options;

  // Use provided values or fallback to settings or defaults
  const finalTitle = title || settings?.metaTitle || settings?.siteName || "Website";
  const finalDescription = description || settings?.metaDescription || settings?.siteDescription || "";
  const finalImage = image || settings?.siteOgImage || "/og-image.png";
  const baseUrl = url || `https://${settings?.domain}` || "https://localhost:3000";

  // Apply title template if exists
  let displayTitle = finalTitle;
  if (settings?.titleTemplate && title) {
    displayTitle = settings.titleTemplate.replace('%s', title);
  }

  return {
    title: {
      default: displayTitle,
      template: settings?.titleTemplate || "%s",
    },
    description: finalDescription,
    keywords: settings?.siteKeywords?.split(',').map(k => k.trim()),
    authors: [{ name: settings?.siteName || "Website" }],
    creator: settings?.siteName || "Website",
    publisher: settings?.siteName || "Website",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: displayTitle,
      description: finalDescription,
      url: baseUrl,
      siteName: settings?.siteName || "Website",
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: settings?.siteName || "Website",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: finalDescription,
      images: [finalImage],
      creator: settings?.twitterHandle,
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
      icon: settings?.siteFavicon ? [
        { url: settings.siteFavicon }
      ] : [
        { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      ],
    },
  };
}

/**
 * Generate viewport configuration
 */
export function generateViewportFromSettings(settings: WebsiteSettings | null): Viewport {
  const themeColor = settings?.themeColor || "#ffffff";

  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: themeColor },
      { media: "(prefers-color-scheme: dark)", color: "#000000" },
    ],
  };
}

/**
 * Generate PWA manifest from settings
 */
export function generateManifestFromSettings(settings: WebsiteSettings | null) {
  const manifest = settings?.manifestJson as any || {};

  return {
    name: settings?.siteName || "Website",
    short_name: settings?.siteName?.substring(0, 12) || "App",
    description: settings?.siteDescription || "",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: settings?.themeColor || "#ffffff",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    ...manifest, // Merge custom manifest fields
  };
}
