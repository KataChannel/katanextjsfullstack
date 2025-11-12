"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { HomePageSelector } from "@/components/homepage-selector";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SeoSettings {
  id: string;
  domain: string;
  siteName: string;
  siteDescription: string | null;
  defaultOgImage: string | null;
  twitterHandle: string | null;
  googleAnalytics: string | null;
  googleTagManager: string | null;
  facebookPixel: string | null;
  homePageType: string | null;
  homePageId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface SeoSettingsFormProps {
  domain: string;
  seoSettings: SeoSettings;
}

export function SeoSettingsForm({ domain, seoSettings }: SeoSettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const response = await fetch("/api/seo-settings", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Cài đặt SEO đã được lưu thành công!");
        router.refresh();
      } else {
        toast.error(result.error || "Có lỗi xảy ra khi lưu cài đặt");
      }
    } catch (err) {
      console.error("Error saving SEO settings:", err);
      toast.error("Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="domain" value={domain} />
      
      {/* Basic SEO */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin SEO cơ bản</CardTitle>
          <CardDescription>
            Thiết lập title, description và keywords cho website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Tên website (Site Name)</Label>
            <Input
              id="siteName"
              name="siteName"
              defaultValue={seoSettings.siteName || ""}
              placeholder="Ví dụ: Taza Group - Giải pháp làm đẹp toàn diện"
              className="max-w-full"
            />
            <p className="text-xs text-muted-foreground">
              Nên từ 50-60 ký tự. Hiện tại: {seoSettings.siteName?.length || 0} ký tự
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Mô tả (Site Description)</Label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              defaultValue={seoSettings.siteDescription || ""}
              placeholder="Mô tả ngắn gọn về website của bạn..."
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
            />
            <p className="text-xs text-muted-foreground">
              Nên từ 150-160 ký tự. Hiện tại: {seoSettings.siteDescription?.length || 0} ký tự
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitterHandle">Twitter Handle</Label>
            <Input
              id="twitterHandle"
              name="twitterHandle"
              defaultValue={seoSettings.twitterHandle || ""}
              placeholder="@tazagroup"
            />
            <p className="text-xs text-muted-foreground">
              Tài khoản Twitter/X của bạn (bao gồm @)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Open Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Open Graph & Social Media</CardTitle>
          <CardDescription>
            Thiết lập hình ảnh và icon cho chia sẻ mạng xã hội
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultOgImage">Hình ảnh OG (Open Graph)</Label>
            <Input
              id="defaultOgImage"
              name="defaultOgImage"
              type="url"
              defaultValue={seoSettings.defaultOgImage || ""}
              placeholder="https://example.com/og-image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Kích thước đề nghị: 1200x630px
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analytics & Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Tracking Codes</CardTitle>
          <CardDescription>
            Cấu hình các mã tracking cho Google Analytics, Facebook Pixel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
            <Input
              id="googleAnalytics"
              name="googleAnalytics"
              defaultValue={seoSettings.googleAnalytics || ""}
              placeholder="G-XXXXXXXXXX hoặc UA-XXXXXXXXX-X"
            />
            <p className="text-xs text-muted-foreground">
              Ví dụ: G-1234567890 (GA4) hoặc UA-123456789-1 (Universal Analytics)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
            <Input
              id="googleTagManager"
              name="googleTagManager"
              defaultValue={seoSettings.googleTagManager || ""}
              placeholder="GTM-XXXXXXX"
            />
            <p className="text-xs text-muted-foreground">
              Ví dụ: GTM-ABC123
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
            <Input
              id="facebookPixel"
              name="facebookPixel"
              defaultValue={seoSettings.facebookPixel || ""}
              placeholder="1234567890123456"
            />
            <p className="text-xs text-muted-foreground">
              ID số gồm 15-16 chữ số
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Homepage Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt Trang chủ</CardTitle>
          <CardDescription>
            Chọn trang hoặc bài viết để hiển thị làm trang chủ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HomePageSelector 
            defaultType={seoSettings.homePageType}
            defaultId={seoSettings.homePageId}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Lưu cài đặt
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
