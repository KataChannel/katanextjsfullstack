"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Global">
        {/* Top Row: Logo | Search | User */}
        <div className="flex h-16 items-center justify-between gap-4 border-b border-gray-100">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center">
              {settings?.logo ? (
                <img 
                  src={settings.logo} 
                  alt={settings.logoAlt || 'Logo'} 
                  className="h-12 w-auto"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">IB</span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-lg font-bold text-blue-800">InnerBright</div>
                    <div className="text-xs text-gray-600">Training & Coaching</div>
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="search"
                placeholder="Tìm kiếm ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              >
                <Search className="h-4 w-4 text-gray-500" />
              </Button>
            </form>
          </div>

          {/* User Icon - Desktop */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full h-10 w-10 hover:bg-gray-100"
            >
              <Link href={session ? "/admin" : "/auth/login"}>
                <User className="h-5 w-5 text-gray-600" />
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden shrink-0">
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

        {/* Bottom Row: Navigation Menu - Desktop Only */}
        <div className="hidden md:flex items-center gap-1 py-3">
          {menus.map((item) => {
            const isActive = pathname === item.url || pathname?.startsWith(item.url + '/');
            return (
              <Link
                key={item.id}
                href={item.url}
                className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap rounded-lg ${
                  isActive
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 space-y-2 border-t">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-4 pb-2">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Tìm kiếm ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 rounded-full"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Mobile Menu Items */}
            {menus.map((item) => {
              const isActive = pathname === item.url || pathname?.startsWith(item.url + '/');
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Mobile User Link */}
            <div className="px-4 pt-2">
              <Button asChild className="w-full" variant="outline">
                <Link href={session ? "/admin" : "/auth/login"} onClick={() => setMobileMenuOpen(false)}>
                  <User className="h-4 w-4 mr-2" />
                  {session ? "Quản trị" : "Đăng nhập"}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
