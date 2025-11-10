"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Home, FileText, Mail, Info } from "lucide-react";
import { Button } from "./ui/button";

const navigation = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Blog", href: "/posts", icon: FileText },
  { name: "Về chúng tôi", href: "/ve-chung-toi", icon: Info },
  { name: "Liên hệ", href: "/lien-he", icon: Mail },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Taza Group
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:gap-x-6 lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm lg:text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
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
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
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
