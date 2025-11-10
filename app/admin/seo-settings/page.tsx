import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPrisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { extractDomain } from "@/lib/database";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function SeoSettingsPage() {
  const headersList = await headers();
  const hostname = headersList.get("x-hostname") || "";
  const domain = extractDomain(hostname);
  
  const prisma = await getPrisma();
  
  // Get or create SEO settings for current domain
  let seoSettings = await prisma.seoSettings.findUnique({
    where: { domain }
  });

  if (!seoSettings) {
    seoSettings = await prisma.seoSettings.create({
      data: {
        domain,
        siteName: "",
        siteDescription: "",
        defaultOgImage: "",
        twitterHandle: "",
        googleAnalytics: "",
        googleTagManager: "",
        facebookPixel: "",
      }
    });
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cài đặt SEO</h1>
          <p className="text-muted-foreground mt-2">
            Cấu hình SEO và tracking cho domain: <strong>{domain}</strong>
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
      </div>

      <form action="/api/seo-settings" method="POST">
        <input type="hidden" name="domain" value={domain} />
        
        {/* Basic SEO */}
        <Card className="mb-6">
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
        <Card className="mb-6">
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Analytics & Tracking Codes</CardTitle>
            <CardDescription>
              Cấu hình các mã tracking cho Google Analytics, Facebook Pixel, TikTok Pixel
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

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin">Hủy</Link>
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Lưu cài đặt
          </Button>
        </div>
      </form>
    </div>
  );
}
