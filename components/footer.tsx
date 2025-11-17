"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Youtube, Mail, Phone } from "lucide-react";
import { SiTiktok } from "react-icons/si";

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
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Logo & Contact Info */}
          <div className="space-y-6">
            {/* Logo */}
            <div>
              {settings?.logo ? (
                <img 
                  src={settings.logo} 
                  alt={settings.logoAlt || 'Logo'} 
                  className="h-16 w-auto mb-4"
                />
              ) : (
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">IB</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">InnerBright</div>
                    <div className="text-xs text-gray-600">Training & Coaching</div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="h-5 w-5 shrink-0" />
                <a 
                  href={`tel:${settings?.phone || '0908370968'}`} 
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  {settings?.phone || '090 837 09 68'}
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="h-5 w-5 shrink-0" />
                <a 
                  href={`mailto:${settings?.email || 'info@innerbright.vn'}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {settings?.email || 'info@innerbright.vn'}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: INNNER (First menu group) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 uppercase">INNNER</h3>
            <ul className="space-y-3">
              {footerMenus.slice(0, 4).map((menu) => (
                <li key={menu.id}>
                  <Link
                    href={menu.url}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {menu.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: OUR SERVICES (Second menu group) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 uppercase">OUR SERVICES</h3>
            <ul className="space-y-3">
              {footerMenus.slice(4, 9).map((menu) => (
                <li key={menu.id}>
                  <Link
                    href={menu.url}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {menu.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social Media Icons */}
          <div className="flex lg:justify-end items-start">
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label={social.name}
                >
                  {getSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500 italic">
            {settings?.footerText || 'Bản quyền InnerBright 2025 Bảo lưu mọi quyền'}
          </p>
        </div>
      </div>
    </footer>
  );
}
