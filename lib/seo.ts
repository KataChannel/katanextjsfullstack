import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  siteName?: string;
  locale?: string;
  twitterHandle?: string;
}

/**
 * Generate comprehensive SEO metadata for Next.js pages
 */
export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    ogImage,
    ogType = 'website',
    canonicalUrl,
    siteName = 'InnerBright',
    locale = 'vi_VN',
    twitterHandle,
  } = config;

  return {
    title,
    description,
    keywords: keywords?.split(',').map(k => k.trim()),
    
    // Open Graph
    openGraph: {
      title,
      description,
      type: ogType as any,
      locale,
      siteName,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : [],
      url: canonicalUrl,
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
      creator: twitterHandle,
      site: twitterHandle,
    },

    // Canonical URL
    alternates: canonicalUrl ? {
      canonical: canonicalUrl,
    } : undefined,

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema(data: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
  };
  sameAs?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    address: data.address ? {
      '@type': 'PostalAddress',
      ...data.address,
    } : undefined,
    contactPoint: data.contactPoint ? {
      '@type': 'ContactPoint',
      ...data.contactPoint,
    } : undefined,
    sameAs: data.sameAs,
  };
}

/**
 * Generate JSON-LD structured data for Article/BlogPosting
 */
export function generateArticleSchema(data: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    description: data.description,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    author: {
      '@type': 'Person',
      name: data.author.name,
      url: data.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: data.publisher.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
  };
}

/**
 * Generate JSON-LD structured data for Website
 */
export function generateWebsiteSchema(data: {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    description: data.description,
    potentialAction: data.searchUrl ? {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${data.searchUrl}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    } : undefined,
  };
}

/**
 * Generate JSON-LD structured data for BreadcrumbList
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate domain-aware SEO metadata
 * Import domain config để tự động lấy thông tin domain
 */
export async function generateDomainSEOMetadata(config: Partial<SEOConfig> = {}): Promise<Metadata> {
  const { getCurrentDomainConfig } = await import('./domain-helpers');
  const domainConfig = await getCurrentDomainConfig();
  
  return generateSEOMetadata({
    siteName: domainConfig.siteName,
    title: config.title || domainConfig.siteTitle,
    description: config.description || domainConfig.description,
    keywords: config.keywords,
    ogImage: config.ogImage,
    ogType: config.ogType,
    canonicalUrl: config.canonicalUrl,
    locale: config.locale,
    twitterHandle: config.twitterHandle,
  });
}

/**
 * Generate domain-aware Organization schema
 */
export async function generateDomainOrganizationSchema() {
  const { getDomainConfig, getBaseUrl } = await import('./domain-config');
  const { getCurrentHostname } = await import('./domain-helpers');
  
  const hostname = await getCurrentHostname();
  const domainConfig = getDomainConfig(hostname);
  const baseUrl = getBaseUrl(domainConfig);
  
  return generateOrganizationSchema({
    name: domainConfig.siteName,
    url: baseUrl,
    description: domainConfig.description,
    address: {
      streetAddress: domainConfig.address,
      addressCountry: 'VN',
    },
    contactPoint: {
      telephone: domainConfig.hotline,
      email: domainConfig.email,
      contactType: 'Customer Service',
    },
  });
}
