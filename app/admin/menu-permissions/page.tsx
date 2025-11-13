'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, User, CheckCircle2, Circle } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  published: boolean;
}

interface UserPermission {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: Date | null;
  menuPermissions: Array<{
    allowedMenus: string[];
  }>;
}

export default function MenuPermissionsPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserPermission[]>([]);
  const [availableMenus, setAvailableMenus] = useState<MenuItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserPermission | null>(null);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAvailableMenus();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/menu-permissions');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      } else {
        toast.error('Không có quyền truy cập');
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách users');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMenus = async () => {
    try {
      const res = await fetch('/api/admin/menus');
      if (res.ok) {
        const data = await res.json();
        // Chỉ lấy menu published và không có parent (menu chính)
        const mainMenus = data.filter((m: any) => m.published && !m.parentId);
        setAvailableMenus(mainMenus);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const handleSelectUser = (user: UserPermission) => {
    setSelectedUser(user);
    const currentMenus = user.menuPermissions[0]?.allowedMenus || [];
    setSelectedMenus(currentMenus);
  };

  const toggleMenu = (url: string) => {
    setSelectedMenus(prev =>
      prev.includes(url)
        ? prev.filter(m => m !== url)
        : [...prev, url]
    );
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/menu-permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          allowedMenus: selectedMenus,
        }),
      });

      if (res.ok) {
        toast.success('Đã cập nhật quyền menu');
        fetchUsers(); // Refresh list
      } else {
        toast.error('Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi khi lưu quyền menu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
          Quản Lý Quyền Menu
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Phân quyền truy cập menu cho từng người dùng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Danh sách Users */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Danh sách người dùng</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedUser?.id === user.id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-accent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{user.name || user.email}</div>
                    <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.menuPermissions[0]?.allowedMenus.length || 0} menu
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Panel phân quyền */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Quyền truy cập menu</h2>
          
          {selectedUser ? (
            <div className="space-y-4">
              <div className="pb-4 border-b">
                <div className="font-medium">{selectedUser.name || selectedUser.email}</div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    selectedUser.role === 'admin'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              {selectedUser.role === 'admin' ? (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Admin có quyền truy cập tất cả menu. Không cần phân quyền riêng.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Chọn menu được phép truy cập:</Label>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {availableMenus.map((menu) => (
                        <button
                          key={menu.url}
                          onClick={() => toggleMenu(menu.url)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                            selectedMenus.includes(menu.url)
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-accent'
                          }`}
                        >
                          {selectedMenus.includes(menu.url) ? (
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                          )}
                          <div className="flex-1 text-left">
                            <div className="font-medium">{menu.label}</div>
                            <div className="text-xs text-muted-foreground">{menu.url}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t sticky bottom-0 bg-background">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="w-full"
                      size="lg"
                    >
                      {saving ? 'Đang lưu...' : `Lưu quyền (${selectedMenus.length} menu)`}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <User className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                Chọn một người dùng để phân quyền menu
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
