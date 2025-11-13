"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface WebsiteSettings {
  footerText?: string;
  footerHtml?: string;
  socialLinks?: SocialLink[];
}

const footerLinks = {
  about: [
    { name: "Về chúng tôi", href: "/ve-chung-toi" },
    { name: "Dịch vụ", href: "/dich-vu" },
    { name: "Blog", href: "/posts" },
    { name: "Liên hệ", href: "/lien-he" },
  ],
  services: [
    { name: "Chăm sóc da", href: "/dich-vu#cham-soc-da" },
    { name: "Thẩm mỹ", href: "/dich-vu#tham-my" },
    { name: "Spa & Massage", href: "/dich-vu#spa" },
    { name: "Tư vấn", href: "/lien-he" },
  ],
  legal: [
    { name: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
    { name: "Điều khoản sử dụng", href: "/dieu-khoan-su-dung" },
    { name: "Chính sách hoàn tiền", href: "/chinh-sach-hoan-tien" },
  ],
};

const defaultSocialLinks = [
  { name: "Facebook", href: "https://facebook.com/tazagroup", icon: Facebook },
  { name: "Instagram", href: "https://instagram.com/tazagroup", icon: Instagram },
  { name: "Youtube", href: "https://youtube.com/@tazagroup", icon: Youtube },
];

const iconMap: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
};

export function Footer() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/website-settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error loading footer settings:', err));
  }, []);

  const socialLinks = settings?.socialLinks && settings.socialLinks.length > 0
    ? settings.socialLinks.map(link => ({
        name: link.platform,
        href: link.url,
        icon: iconMap[link.icon.toLowerCase()] || Facebook,
      }))
    : defaultSocialLinks;

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Custom Footer HTML */}
        {settings?.footerHtml && (
          <div 
            className="mb-8" 
            dangerouslySetInnerHTML={{ __html: settings.footerHtml }} 
          />
        )}

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Taza Group
            </h3>
            <p className="text-sm text-muted-foreground">
              Hệ thống thẩm mỹ viện và spa hàng đầu Việt Nam với công nghệ hiện đại và đội ngũ chuyên gia.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:1900xxxx" className="hover:text-primary transition-colors">
                  1900 xxxx
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:contact@tazagroup.vn" className="hover:text-primary transition-colors">
                  contact@tazagroup.vn
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Về chúng tôi</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Dịch vụ</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Pháp lý</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold mb-3">Theo dõi chúng tôi</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>{settings?.footerText || `© ${new Date().getFullYear()} Taza Group. Bảo lưu mọi quyền.`}</p>
            <p className="text-center sm:text-right">
              Thiết kế bởi{" "}
              <Link href="/" className="text-primary hover:underline">
                Taza Tech Team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
