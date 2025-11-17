"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Home } from "lucide-react";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";

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
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    // Fetch website settings (logo)
    fetch('/api/website-settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Error loading header settings:', err));

    // Fetch menus HEADER position (đã filter theo permissions)
    fetch('/api/menus?position=HEADER')
      .then(res => res.json())
      .then(data => {
        // ✅ Fix: Ensure data is array before setting
        if (Array.isArray(data)) {
          setMenus(data);
        } else {
          setMenus([]);
          console.error('Menus data is not an array:', data);
        }
      })
      .catch(err => {
        console.error('Error loading menus:', err);
        setMenus([]); // ✅ Fallback to empty array on error
      });
  }, [status, session]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              {settings?.logo && (
                <img 
                  src={settings.logo} 
                  alt={settings.logoAlt || 'Logo'} 
                  className="h-8 sm:h-10 w-auto"
                />
              )}
              {!settings?.logo && (
                <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Taza Group
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:gap-x-6 lg:gap-x-8">
            {menus.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="text-sm lg:text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden md:flex md:flex-1 md:justify-end">
            <Button asChild>
              <Link href="/admin">Quản trị</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            {menus.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Button asChild className="w-full">
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  Quản trị
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
