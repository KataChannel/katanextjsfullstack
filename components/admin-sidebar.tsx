'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  Layout,
  Image,
  Settings,
  BarChart3,
  Users,
  Menu,
  ChevronLeft,
  Home,
  Palette,
  X,
  Shield,
  Globe,
  Menu as MenuIcon,
  Blocks,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon mapping từ string name sang component
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  Layout,
  Image,
  Settings,
  BarChart3,
  Users,
  Menu: MenuIcon,
  Shield,
  Globe,
  Blocks,
  Palette,
};

interface MenuItem {
  id: string;
  label: string;
  url: string;
  icon: string | null;
  order: number;
  published: boolean;
  position: string;
  parentId: string | null;
}

// Hardcoded fallback menu items
const defaultMenuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/admin', exact: true },
  { title: 'Quản lý Nội dung', icon: FileText, href: '/admin/content' },
  { title: 'Page Builder', icon: Palette, href: '/admin/page-builder' },
  { title: 'Block Templates', icon: Blocks, href: '/admin/block-templates' },
  { title: 'Thư viện Media', icon: Image, href: '/admin/media' },
  { title: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { title: 'Cài đặt SEO', icon: Settings, href: '/admin/seo-settings' },
  { title: 'Website Settings', icon: Globe, href: '/admin/website-settings' },
  { title: 'Quản lý Menu', icon: MenuIcon, href: '/admin/menus' },
  { title: 'Quyền Menu', icon: Shield, href: '/admin/menu-permissions' },
  { title: 'Người dùng', icon: Users, href: '/admin/users' },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminMenus, setAdminMenus] = useState<MenuItem[]>([]);
  const [useDefaultMenu, setUseDefaultMenu] = useState(true);
  const pathname = usePathname();

  // Fetch admin menus from API
  useEffect(() => {
    const fetchAdminMenus = async () => {
      try {
        const response = await fetch('/api/admin/menus?position=ADMIN');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setAdminMenus(data);
            setUseDefaultMenu(false);
          } else {
            console.warn('⚠️ No admin menus found in database. Run: bun run scripts/seed-admin-menu.ts');
            setAdminMenus([]);
            setUseDefaultMenu(true);
          }
        } else {
          console.error('Failed to fetch admin menus:', response.status);
          setUseDefaultMenu(true);
        }
      } catch (error) {
        console.error('Error fetching admin menus:', error);
        setUseDefaultMenu(true);
      }
    };
    fetchAdminMenus();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Use dynamic menus if available, otherwise fallback to default
  const menuItems = useDefaultMenu ? defaultMenuItems : adminMenus.map(menu => ({
    title: menu.label,
    icon: menu.icon ? (iconMap[menu.icon] || LayoutDashboard) : LayoutDashboard,
    href: menu.url,
    exact: menu.url === '/admin'
  }));

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen border-r bg-background transition-all duration-300 flex flex-col',
          // Desktop
          'hidden lg:flex',
          collapsed ? 'lg:w-16' : 'lg:w-64',
          // Mobile
          mobileOpen ? 'flex w-64' : 'hidden'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4 shrink-0">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <LayoutDashboard className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn('h-8 w-8 hidden lg:flex', collapsed && 'mx-auto')}
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    collapsed && 'lg:justify-center lg:px-2',
                    isActive && 'bg-secondary'
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className={cn('h-5 w-5', !collapsed && 'mr-2')} />
                  <span className={cn(collapsed && 'lg:hidden')}>{item.title}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-2 shrink-0">
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start',
                collapsed && 'lg:justify-center lg:px-2'
              )}
              title={collapsed ? 'Về trang chủ' : undefined}
            >
              <Home className={cn('h-5 w-5', !collapsed && 'mr-2')} />
              <span className={cn(collapsed && 'lg:hidden')}>Về trang chủ</span>
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
