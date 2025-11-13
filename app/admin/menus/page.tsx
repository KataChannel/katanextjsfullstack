"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Menu as MenuIcon, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Menu {
  id: string;
  label: string;
  url: string;
  icon?: string | null;
  order: number;
  published: boolean;
  parentId?: string | null;
  parent?: Menu | null;
  children?: Menu[];
}

export default function MenuManagementPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    url: "",
    icon: "",
    order: 0,
    published: true,
    parentId: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role !== "admin") {
      router.push("/admin");
    } else {
      fetchMenus();
    }
  }, [session, status, router]);

  const fetchMenus = async () => {
    try {
      const res = await fetch("/api/admin/menus");
      if (res.ok) {
        const data = await res.json();
        setMenus(data);
      }
    } catch (error) {
      toast.error("Lỗi tải menu");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (menu?: Menu) => {
    if (menu) {
      setSelectedMenu(menu);
      setFormData({
        label: menu.label,
        url: menu.url,
        icon: menu.icon || "",
        order: menu.order,
        published: menu.published,
        parentId: menu.parentId || "",
      });
    } else {
      setSelectedMenu(null);
      setFormData({
        label: "",
        url: "",
        icon: "",
        order: menus.length,
        published: true,
        parentId: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMenu(null);
  };

  const handleSaveMenu = async () => {
    if (!formData.label || !formData.url) {
      toast.error("Tên và URL là bắt buộc");
      return;
    }

    try {
      const method = selectedMenu ? "PUT" : "POST";
      const payload = selectedMenu ? { id: selectedMenu.id, ...formData } : formData;

      const res = await fetch("/api/admin/menus", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(selectedMenu ? "Đã cập nhật menu" : "Đã tạo menu mới");
        handleCloseDialog();
        fetchMenus();
      } else {
        toast.error("Lỗi lưu menu");
      }
    } catch (error) {
      toast.error("Lỗi lưu menu");
    }
  };

  const handleDeleteMenu = async () => {
    if (!selectedMenu) return;

    try {
      const res = await fetch(`/api/admin/menus?id=${selectedMenu.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Đã xóa menu");
        setIsDeleteDialogOpen(false);
        setSelectedMenu(null);
        fetchMenus();
      } else {
        toast.error("Lỗi xóa menu");
      }
    } catch (error) {
      toast.error("Lỗi xóa menu");
    }
  };

  const handleTogglePublish = async (menu: Menu) => {
    try {
      const res = await fetch("/api/admin/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: menu.id,
          label: menu.label,
          url: menu.url,
          icon: menu.icon,
          order: menu.order,
          published: !menu.published,
          parentId: menu.parentId,
        }),
      });

      if (res.ok) {
        toast.success(menu.published ? "Đã ẩn menu" : "Đã hiện menu");
        fetchMenus();
      }
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const handleReorder = async (menu: Menu, direction: "up" | "down") => {
    const currentIndex = menus.findIndex(m => m.id === menu.id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === menus.length - 1)
    ) {
      return;
    }

    const newMenus = [...menus];
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    
    // Swap orders
    const temp = newMenus[currentIndex].order;
    newMenus[currentIndex].order = newMenus[swapIndex].order;
    newMenus[swapIndex].order = temp;

    // Update both menus
    try {
      await fetch("/api/admin/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newMenus[currentIndex].id,
          label: newMenus[currentIndex].label,
          url: newMenus[currentIndex].url,
          icon: newMenus[currentIndex].icon,
          order: newMenus[currentIndex].order,
          published: newMenus[currentIndex].published,
          parentId: newMenus[currentIndex].parentId,
        }),
      });

      await fetch("/api/admin/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newMenus[swapIndex].id,
          label: newMenus[swapIndex].label,
          url: newMenus[swapIndex].url,
          icon: newMenus[swapIndex].icon,
          order: newMenus[swapIndex].order,
          published: newMenus[swapIndex].published,
          parentId: newMenus[swapIndex].parentId,
        }),
      });

      toast.success("Đã cập nhật thứ tự");
      fetchMenus();
    } catch (error) {
      toast.error("Lỗi cập nhật thứ tự");
    }
  };

  const parentMenuOptions = menus
    .filter(m => !m.parentId)
    .map(m => ({ value: m.id, label: m.label }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <Card>
        <CardHeader className="border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MenuIcon className="h-6 w-6" />
                Quản lý Menu
              </CardTitle>
              <CardDescription className="mt-1">
                Thêm, sửa, xóa menu của website
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm menu
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">STT</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tên menu</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">URL</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Thứ tự</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {menus.map((menu, index) => (
                  <tr key={menu.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{menu.label}</span>
                        {menu.parentId && (
                          <Badge variant="outline" className="text-xs">
                            Submenu
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {menu.url}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={menu.published ? "default" : "secondary"}>
                        {menu.published ? "Hiện" : "Ẩn"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleReorder(menu, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground w-8 text-center">
                          {menu.order}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleReorder(menu, "down")}
                          disabled={index === menus.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTogglePublish(menu)}
                          title={menu.published ? "Ẩn menu" : "Hiện menu"}
                        >
                          {menu.published ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(menu)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedMenu(menu);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Thêm/Sửa Menu */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>
              {selectedMenu ? "Sửa menu" : "Thêm menu mới"}
            </DialogTitle>
            <DialogDescription>
              {selectedMenu ? "Cập nhật thông tin menu" : "Tạo menu mới cho website"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Tên menu *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="VD: Về chúng tôi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="VD: /ve-chung-toi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon (tùy chọn)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="VD: Home, Menu, Settings"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Thứ tự</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Menu cha (tùy chọn)</Label>
              <Combobox
                options={[
                  { value: "", label: "Không có (Menu chính)" },
                  ...parentMenuOptions,
                ]}
                value={formData.parentId}
                onValueChange={(value: string) => setFormData({ ...formData, parentId: value })}
                placeholder="Chọn menu cha"
                searchPlaceholder="Tìm menu..."
                emptyText="Không tìm thấy menu"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="published" className="cursor-pointer">
                Hiển thị menu
              </Label>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={handleCloseDialog}>
              Hủy
            </Button>
            <Button onClick={handleSaveMenu}>
              {selectedMenu ? "Cập nhật" : "Tạo menu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Xóa Menu */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa menu "{selectedMenu?.label}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteMenu}>
              Xóa menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
