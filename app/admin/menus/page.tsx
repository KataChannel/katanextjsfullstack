"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Menu as MenuIcon, Eye, EyeOff, ArrowUp, ArrowDown, Search, X, CheckSquare, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Menu {
  id: string;
  label: string;
  url: string;
  icon?: string | null;
  order: number;
  published: boolean;
  position: string; // HEADER, FOOTER, ADMIN, SIDEBAR
  parentId?: string | null;
  parent?: Menu | null;
  children?: Menu[];
  createdAt?: string;
  updatedAt?: string;
}

const POSITION_OPTIONS = [
  { value: "HEADER", label: "Header (Navigation chính)" },
  { value: "FOOTER", label: "Footer" },
  { value: "ADMIN", label: "Admin Sidebar" },
  { value: "SIDEBAR", label: "Sidebar phụ" },
];

const SORT_OPTIONS = [
  { value: "order-asc", label: "Thứ tự: Tăng dần" },
  { value: "order-desc", label: "Thứ tự: Giảm dần" },
  { value: "label-asc", label: "Tên: A → Z" },
  { value: "label-desc", label: "Tên: Z → A" },
  { value: "created-desc", label: "Mới nhất" },
  { value: "created-asc", label: "Cũ nhất" },
];

const FILTER_POSITION_OPTIONS = [
  { value: "ALL", label: "Tất cả vị trí" },
  { value: "HEADER", label: "Header" },
  { value: "FOOTER", label: "Footer" },
  { value: "ADMIN", label: "Admin Sidebar" },
  { value: "SIDEBAR", label: "Sidebar phụ" },
];

const FILTER_PUBLISHED_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PUBLISHED", label: "Đã hiển thị" },
  { value: "DRAFT", label: "Đã ẩn" },
];

export default function MenuManagementPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedDomain, setSelectedDomain] = useState<string>("");
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
    position: "HEADER",
    parentId: "",
  });

  // Search, Sort, Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("order-asc");
  const [filterPosition, setFilterPosition] = useState("ALL");
  const [filterPublished, setFilterPublished] = useState("ALL");

  // Bulk selection states
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // Detect current domain from port
  useEffect(() => {
    const detectDomain = () => {
      const port = window.location.port || "3000";
      const portMap: Record<string, string> = {
        "3000": "tazagroup.vn",
        "3001": "tazaskinclinic.com",
        "3002": "timona.edu.vn",
        "3003": "hderma.vn",
        "3004": "elasome.com",
        "3005": "innerbright.vn",
      };
      
      const detectedDomain = portMap[port] || "tazagroup.vn";
      setSelectedDomain(detectedDomain);
    };

    detectDomain();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role !== "admin") {
      router.push("/admin");
    } else if (selectedDomain) {
      fetchMenus();
    }
  }, [session, status, router, selectedDomain]);

  const fetchMenus = async () => {
    if (!selectedDomain) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/menus?domain=${selectedDomain}`);
      if (res.ok) {
        const data = await res.json();
        setMenus(data);
      } else {
        toast.error("Lỗi tải menu");
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
        position: menu.position || "HEADER",
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
        position: "HEADER",
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

      const res = await fetch(`/api/admin/menus?domain=${selectedDomain}`, {
        method,
        headers: { 
          "Content-Type": "application/json",
        },
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
      const res = await fetch(`/api/admin/menus?domain=${selectedDomain}&id=${selectedMenu.id}`, {
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

  // Bulk selection handlers
  const handleToggleSelectAll = () => {
    if (selectedMenuIds.length === filteredAndSortedMenus.length) {
      setSelectedMenuIds([]);
    } else {
      setSelectedMenuIds(filteredAndSortedMenus.map(m => m.id));
    }
  };

  const handleToggleSelectMenu = (menuId: string) => {
    setSelectedMenuIds(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedMenuIds.length === 0) return;

    try {
      const deletePromises = selectedMenuIds.map(id =>
        fetch(`/api/admin/menus?domain=${selectedDomain}&id=${id}`, {
          method: "DELETE",
        })
      );

      const results = await Promise.all(deletePromises);
      const successCount = results.filter(res => res.ok).length;

      if (successCount === selectedMenuIds.length) {
        toast.success(`Đã xóa ${successCount} menu`);
      } else {
        toast.warning(`Đã xóa ${successCount}/${selectedMenuIds.length} menu`);
      }

      setIsBulkDeleteDialogOpen(false);
      setSelectedMenuIds([]);
      fetchMenus();
    } catch (error) {
      toast.error("Lỗi xóa menu hàng loạt");
    }
  };

  const handleTogglePublish = async (menu: Menu) => {
    try {
      const res = await fetch(`/api/admin/menus?domain=${selectedDomain}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: menu.id,
          label: menu.label,
          url: menu.url,
          icon: menu.icon,
          order: menu.order,
          published: !menu.published,
          position: menu.position, // ✅ Include position
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
      await fetch(`/api/admin/menus?domain=${selectedDomain}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: newMenus[currentIndex].id,
          label: newMenus[currentIndex].label,
          url: newMenus[currentIndex].url,
          icon: newMenus[currentIndex].icon,
          order: newMenus[currentIndex].order,
          published: newMenus[currentIndex].published,
          position: newMenus[currentIndex].position, // ✅ Include position
          parentId: newMenus[currentIndex].parentId,
        }),
      });

      await fetch(`/api/admin/menus?domain=${selectedDomain}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: newMenus[swapIndex].id,
          label: newMenus[swapIndex].label,
          url: newMenus[swapIndex].url,
          icon: newMenus[swapIndex].icon,
          order: newMenus[swapIndex].order,
          published: newMenus[swapIndex].published,
          position: newMenus[swapIndex].position, // ✅ Include position
          parentId: newMenus[swapIndex].parentId,
        }),
      });

      toast.success("Đã cập nhật thứ tự");
      fetchMenus();
    } catch (error) {
      toast.error("Lỗi cập nhật thứ tự");
    }
  };

  // Filter and Sort logic
  const filteredAndSortedMenus = useMemo(() => {
    let result = [...menus];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (menu) =>
          menu.label.toLowerCase().includes(query) ||
          menu.url.toLowerCase().includes(query)
      );
    }

    // Position filter
    if (filterPosition !== "ALL") {
      result = result.filter((menu) => menu.position === filterPosition);
    }

    // Published filter
    if (filterPublished !== "ALL") {
      result = result.filter((menu) =>
        filterPublished === "PUBLISHED" ? menu.published : !menu.published
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "order-asc":
          return a.order - b.order;
        case "order-desc":
          return b.order - a.order;
        case "label-asc":
          return a.label.localeCompare(b.label, "vi");
        case "label-desc":
          return b.label.localeCompare(a.label, "vi");
        case "created-desc":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "created-asc":
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        default:
          return a.order - b.order;
      }
    });

    return result;
  }, [menus, searchQuery, sortBy, filterPosition, filterPublished]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortBy("order-asc");
    setFilterPosition("ALL");
    setFilterPublished("ALL");
    setSelectedMenuIds([]);
  };

  const hasActiveFilters = searchQuery || sortBy !== "order-asc" || filterPosition !== "ALL" || filterPublished !== "ALL";

  const isAllSelected = selectedMenuIds.length > 0 && selectedMenuIds.length === filteredAndSortedMenus.length;
  const isSomeSelected = selectedMenuIds.length > 0 && selectedMenuIds.length < filteredAndSortedMenus.length;

  const parentMenuOptions = menus
    .filter(m => !m.parentId)
    .map(m => ({ value: m.id, label: m.label }));

  if (loading || !selectedDomain) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Đang tải menu...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <Card>
        <CardHeader className="border-b sticky top-0 bg-background z-10">
          <div className="flex flex-col gap-4">
            {/* Title and Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MenuIcon className="h-6 w-6" />
                  Quản lý Menu
                </CardTitle>
                <CardDescription className="mt-1">
                  Thêm, sửa, xóa menu của website
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedMenuIds.length > 0 && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setIsBulkDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa {selectedMenuIds.length} menu
                  </Button>
                )}
                <Button onClick={() => handleOpenDialog()} className="flex-1 sm:flex-none">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm menu
                </Button>
                <Badge variant="outline">
                  {filteredAndSortedMenus.length}/{menus.length}
                </Badge>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Sort and Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Sắp xếp</Label>
                <Combobox
                  options={SORT_OPTIONS}
                  value={sortBy}
                  onValueChange={setSortBy}
                  placeholder="Sắp xếp theo..."
                  searchPlaceholder="Tìm kiểu sắp xếp..."
                  emptyText="Không tìm thấy"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Vị trí</Label>
                <Combobox
                  options={FILTER_POSITION_OPTIONS}
                  value={filterPosition}
                  onValueChange={setFilterPosition}
                  placeholder="Lọc theo vị trí..."
                  searchPlaceholder="Tìm vị trí..."
                  emptyText="Không tìm thấy"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Trạng thái</Label>
                <Combobox
                  options={FILTER_PUBLISHED_OPTIONS}
                  value={filterPublished}
                  onValueChange={setFilterPublished}
                  placeholder="Lọc theo trạng thái..."
                  searchPlaceholder="Tìm trạng thái..."
                  emptyText="Không tìm thấy"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleClearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredAndSortedMenus.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MenuIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Không tìm thấy menu</p>
              <p className="text-sm text-muted-foreground mt-1">
                {hasActiveFilters
                  ? "Thử điều chỉnh bộ lọc hoặc tìm kiếm"
                  : "Bắt đầu bằng cách thêm menu mới"}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-4">
                  <X className="h-4 w-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-center w-12">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={handleToggleSelectAll}
                      >
                        {isAllSelected ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : isSomeSelected ? (
                          <CheckSquare className="h-4 w-4 opacity-50" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </Button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">STT</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tên menu</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">URL</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Vị trí</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Thứ tự</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredAndSortedMenus.map((menu, index) => (
                  <tr key={menu.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleToggleSelectMenu(menu.id)}
                      >
                        {selectedMenuIds.includes(menu.id) ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
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
                      <Badge variant="outline" className="text-xs">
                        {POSITION_OPTIONS.find(p => p.value === menu.position)?.label || menu.position}
                      </Badge>
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
          )}
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              <Label htmlFor="position">Vị trí menu *</Label>
              <Combobox
                options={POSITION_OPTIONS}
                value={formData.position}
                onValueChange={(value: string) => setFormData({ ...formData, position: value })}
                placeholder="Chọn vị trí menu"
                searchPlaceholder="Tìm vị trí..."
                emptyText="Không tìm thấy vị trí"
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

      {/* Dialog Xóa Hàng Loạt */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa hàng loạt</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa <strong>{selectedMenuIds.length} menu</strong> đã chọn? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted rounded-md p-3 max-h-48 overflow-y-auto">
              <p className="text-sm font-medium mb-2">Danh sách menu sẽ xóa:</p>
              <ul className="text-sm space-y-1">
                {selectedMenuIds.map(id => {
                  const menu = menus.find(m => m.id === id);
                  return menu ? (
                    <li key={id} className="flex items-center gap-2">
                      <Trash2 className="h-3 w-3 text-destructive" />
                      <span>{menu.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {menu.position}
                      </Badge>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa {selectedMenuIds.length} menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
