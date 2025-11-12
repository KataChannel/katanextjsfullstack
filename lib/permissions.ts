/**
 * Role-based access control helpers
 */

export type UserRole = 'user' | 'editor' | 'manager' | 'admin';

export interface RolePermissions {
  canAccessAdmin: boolean;
  canManageUsers: boolean;
  canManageContent: boolean;
  canManageMedia: boolean;
  canManagePages: boolean;
  canViewAnalytics: boolean;
  canManageSEO: boolean;
}

/**
 * Get permissions for a specific role
 */
export function getRolePermissions(role: UserRole): RolePermissions {
  const permissions: Record<UserRole, RolePermissions> = {
    admin: {
      canAccessAdmin: true,
      canManageUsers: true,
      canManageContent: true,
      canManageMedia: true,
      canManagePages: true,
      canViewAnalytics: true,
      canManageSEO: true,
    },
    manager: {
      canAccessAdmin: true,
      canManageUsers: false,
      canManageContent: true,
      canManageMedia: true,
      canManagePages: true,
      canViewAnalytics: false,
      canManageSEO: false,
    },
    editor: {
      canAccessAdmin: true,
      canManageUsers: false,
      canManageContent: true,
      canManageMedia: true,
      canManagePages: true,
      canViewAnalytics: false,
      canManageSEO: false,
    },
    user: {
      canAccessAdmin: false,
      canManageUsers: false,
      canManageContent: false,
      canManageMedia: false,
      canManagePages: false,
      canViewAnalytics: false,
      canManageSEO: false,
    },
  };

  return permissions[role] || permissions.user;
}

/**
 * Check if role can access a specific route
 */
export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const permissions = getRolePermissions(role);

  // Check admin access first
  if (!permissions.canAccessAdmin && pathname.startsWith('/admin')) {
    return false;
  }

  // Route-specific checks
  if (pathname.startsWith('/admin/users')) {
    return permissions.canManageUsers;
  }
  
  if (pathname.startsWith('/admin/content')) {
    return permissions.canManageContent;
  }
  
  if (pathname.startsWith('/admin/media')) {
    return permissions.canManageMedia;
  }
  
  if (pathname.startsWith('/admin/page-builder')) {
    return permissions.canManagePages;
  }
  
  if (pathname.startsWith('/admin/analytics')) {
    return permissions.canViewAnalytics;
  }
  
  if (pathname.startsWith('/admin/seo-settings')) {
    return permissions.canManageSEO;
  }

  // Default: allow if has admin access
  return permissions.canAccessAdmin;
}

/**
 * Get available menu items based on role
 */
export interface MenuItem {
  name: string;
  href: string;
  icon?: string;
  description?: string;
}

export function getAvailableMenuItems(role: UserRole): MenuItem[] {
  const permissions = getRolePermissions(role);
  const allMenuItems: MenuItem[] = [
    {
      name: 'Tổng quan',
      href: '/admin',
      icon: 'LayoutDashboard',
      description: 'Dashboard tổng quan',
    },
    {
      name: 'Nội dung',
      href: '/admin/content',
      icon: 'FileText',
      description: 'Quản lý bài viết và nội dung',
    },
    {
      name: 'Page Builder',
      href: '/admin/page-builder',
      icon: 'Layout',
      description: 'Xây dựng trang với blocks',
    },
    {
      name: 'Media',
      href: '/admin/media',
      icon: 'Image',
      description: 'Quản lý hình ảnh và media',
    },
    {
      name: 'SEO Settings',
      href: '/admin/seo-settings',
      icon: 'Search',
      description: 'Cài đặt SEO',
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: 'BarChart3',
      description: 'Thống kê và phân tích',
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: 'Users',
      description: 'Quản lý người dùng',
    },
  ];

  return allMenuItems.filter(item => canAccessRoute(role, item.href));
}

/**
 * Role display names in Vietnamese
 */
export const roleDisplayNames: Record<UserRole, string> = {
  admin: 'Quản trị viên',
  manager: 'Người quản lý',
  editor: 'Biên tập viên',
  user: 'Người dùng',
};

/**
 * Role descriptions in Vietnamese
 */
export const roleDescriptions: Record<UserRole, string> = {
  admin: 'Có toàn quyền quản trị hệ thống',
  manager: 'Quản lý nội dung, media và page builder',
  editor: 'Chỉnh sửa nội dung và quản lý media',
  user: 'Người dùng thường, không có quyền quản trị',
};
