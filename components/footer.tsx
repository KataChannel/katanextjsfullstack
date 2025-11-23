"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { getImageUrl } from "@/lib/image-utils";

interface SocialLink {
  name?: string;
  platform?: string;
  href?: string;
  url?: string;
  icon: string;
}

interface MenuItem {
  id: string;
  label: string;
  url: string;
  icon?: string | null;
  order: number;
  published: boolean;
}

interface WebsiteSettings {
  logo?: string;
  logoAlt?: string;
  phone?: string;
  email?: string;
  footerText?: string;
  footerHtml?: string;
  socialLinks?: SocialLink[];
}

interface NormalizedSocialLink {
  name: string;
  href: string;
  icon: string;
}

const defaultSocialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { name: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { name: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
  { name: "Youtube", href: "https://youtube.com", icon: "youtube" },
];

export function Footer() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [footerMenus, setFooterMenus] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch('/api/website-settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error loading footer settings:', err));

    // Fetch footer menus
    fetch('/api/menus?position=FOOTER')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFooterMenus(data);
        } else {
          setFooterMenus([]);
        }
      })
      .catch(err => {
        console.error('Error loading footer menus:', err);
        setFooterMenus([]);
      });
  }, []);

  const socialLinks: NormalizedSocialLink[] = settings?.socialLinks && settings.socialLinks.length > 0
    ? settings.socialLinks.map(link => ({
        name: link.name || link.platform || 'Social',
        href: link.href || link.url || '#',
        icon: link.icon || 'facebook'
      }))
    : defaultSocialLinks;

  const getSocialIcon = (iconName: string) => {
    const name = iconName.toLowerCase();
    switch (name) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'tiktok':
        return <SiTiktok className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <Facebook className="h-5 w-5" />;
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Logo & Contact Info */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="mb-6">
              <img 
                src={getImageUrl("https://116.118.49.243:12007/innerbright/1763620956393-ajrdh.webp")}
                alt="InnerBright Logo" 
                className="h-24 w-auto"
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-700">
                <Phone className="h-5 w-5 shrink-0 mt-1" />
                <a 
                  href="tel:0908370968" 
                  className="hover:text-blue-600 transition-colors font-medium text-lg"
                >
                  090 837 09 68
                </a>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <Mail className="h-5 w-5 shrink-0 mt-1" />
                <a 
                  href="mailto:info@innerbright.vn"
                  className="hover:text-blue-600 transition-colors"
                >
                  info@innerbright.vn
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: INNNER */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">INNNER</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/our-support" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Our Support
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/write-for-us" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Write For Us
                </Link>
              </li>
              <li>
                <Link href="/group" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Group
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: OUR SERVICES */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">OUR SERVICES</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dao-tao-doanh-nghiep" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Đào tạo doanh nghiệp
                </Link>
              </li>
              <li>
                <Link href="/khai-van-ca-nhan" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Khai vấn cá nhân
                </Link>
              </li>
              <li>
                <Link href="/dao-tao-doanh-nghiep" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Đào tạo doanh nghiệp
                </Link>
              </li>
              <li>
                <Link href="/khai-van-ca-nhan" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Khai vấn cá nhân
                </Link>
              </li>
              <li>
                <Link href="/dao-tao-doanh-nghiep" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Đào tạo doanh nghiệp
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media Icons */}
          <div className="flex items-start">
            <div className="flex gap-4">
              <a
                href="https://facebook.com/innerbright"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com/innerbright"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://tiktok.com/@innerbright"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 transition-colors"
                aria-label="TikTok"
              >
                <SiTiktok className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com/@innerbright"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-red-600 transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright - Optional, có thể bỏ nếu không cần */}
        {settings?.footerText && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              {settings.footerText}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
