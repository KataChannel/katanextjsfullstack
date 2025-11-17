"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Image, 
  Settings,
  LogOut,
  User,
  BarChart3,
  FileCode
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

const adminNavigation:any = [
  // { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  // { name: "Quản lý Nội dung", href: "/admin/content", icon: FileText },
  // { name: "Page Builder", href: "/admin/page-builder", icon: LayoutDashboard },
  // { name: "Thư viện Media", href: "/admin/media", icon: Image },
  // { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  // { name: "Cài đặt SEO", href: "/admin/seo-settings", icon: Settings },
  // { name: "Người dùng", href: "/admin/users", icon: Users },
];

export function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:left-64">
      <nav className="h-full px-4 sm:px-6 lg:px-8" aria-label="Admin navigation">
        <div className="flex h-full items-center justify-between">
          {/* Logo - Mobile Only */}
          <div className="flex lg:hidden">
            <Link href="/admin" className="-m-1.5 p-1.5">
              <span className="text-lg font-bold text-primary">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:flex lg:flex-1">
            <h1 className="text-lg font-semibold">Quản trị hệ thống</h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* View Website */}
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link href="/" target="_blank">
                Xem website
              </Link>
            </Button>

            {/* User Menu */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="space-y-1">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@tazagroup.vn</p>
                  </div>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/profile">
                      <User className="mr-2 h-4 w-4" />
                      Hồ sơ
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Cài đặt
                    </Link>
                  </Button>
                  <div className="border-t pt-1">
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
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
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg">
            <div className="py-4 px-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {adminNavigation.map((item:any) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-2 border-t">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/" target="_blank">
                    Xem website
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
