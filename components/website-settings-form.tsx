"use client";

/**
 * WebsiteSettingsForm - Unified form for website configuration
 * Combines SEO, Metadata, Header/Footer, and Tracking settings
 * Following shadcn UI patterns with Mobile First approach
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, Globe, Settings2, Code, Palette } from "lucide-react";
import type { WebsiteSettings } from "@prisma/client";

interface WebsiteSettingsFormProps {
  domain: string;
  websiteSettings: WebsiteSettings;
}

export function WebsiteSettingsForm({ domain, websiteSettings }: WebsiteSettingsFormProps) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch("/api/website-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, ...data }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      toast.success("Đã lưu cài đặt thành công!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Lỗi khi lưu cài đặt");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="metadata" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="metadata" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Metadata</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Giao diện</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Nâng cao</span>
          </TabsTrigger>
        </TabsList>

        {/* METADATA TAB */}
        <TabsContent value="metadata" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Metadata cơ bản</CardTitle>
              <CardDescription>
                Cấu hình thông tin meta cơ bản của website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Tên website *</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  defaultValue={websiteSettings.siteName}
                  placeholder="VD: Taza Group"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Nên từ 50-60 ký tự. Hiện tại: {websiteSettings.siteName?.length || 0} ký tự
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  defaultValue={websiteSettings.metaTitle || ""}
                  placeholder="Title mặc định cho trang"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="titleTemplate">Title Template</Label>
                <Input
                  id="titleTemplate"
                  name="titleTemplate"
                  defaultValue={websiteSettings.titleTemplate || ""}
                  placeholder="%s | Tên Website"
                />
                <p className="text-sm text-muted-foreground">
                  Sử dụng %s để thay thế title của từng trang
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Mô tả website</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  defaultValue={websiteSettings.siteDescription || ""}
                  placeholder="Mô tả ngắn gọn về website..."
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Nên từ 150-160 ký tự. Hiện tại: {websiteSettings.siteDescription?.length || 0} ký tự
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  defaultValue={websiteSettings.metaDescription || ""}
                  placeholder="Description mặc định..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteKeywords">Keywords</Label>
                <Input
                  id="siteKeywords"
                  name="siteKeywords"
                  defaultValue={websiteSettings.siteKeywords || ""}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-sm text-muted-foreground">
                  Các từ khóa cách nhau bởi dấu phẩy
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteOgImage">Open Graph Image</Label>
                <Input
                  id="siteOgImage"
                  name="siteOgImage"
                  defaultValue={websiteSettings.siteOgImage || ""}
                  placeholder="/images/og-image.jpg"
                />
                <p className="text-sm text-muted-foreground">
                  Ảnh mặc định khi chia sẻ trên social media (1200x630px)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteFavicon">Favicon</Label>
                <Input
                  id="siteFavicon"
                  name="siteFavicon"
                  defaultValue={websiteSettings.siteFavicon || ""}
                  placeholder="/favicon.ico"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterHandle">Twitter Handle</Label>
                <Input
                  id="twitterHandle"
                  name="twitterHandle"
                  defaultValue={websiteSettings.twitterHandle || ""}
                  placeholder="@username"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO TAB */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt SEO</CardTitle>
              <CardDescription>
                Tối ưu SEO và cấu hình homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homePageType">Homepage Type</Label>
                <select
                  id="homePageType"
                  name="homePageType"
                  defaultValue={websiteSettings.homePageType || ""}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Static Homepage</option>
                  <option value="page">Custom Page</option>
                  <option value="post">Latest Posts</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="homePageId">Homepage ID</Label>
                <Input
                  id="homePageId"
                  name="homePageId"
                  defaultValue={websiteSettings.homePageId || ""}
                  placeholder="Page/Post ID nếu chọn custom"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeRedirect">Homepage Redirect</Label>
                <Input
                  id="homeRedirect"
                  name="homeRedirect"
                  defaultValue={websiteSettings.homeRedirect || ""}
                  placeholder="/innerbright"
                />
                <p className="text-sm text-muted-foreground">
                  URL để redirect khi truy cập trang chủ (VD: /innerbright, /khoa-hoc). Để trống nếu không cần redirect.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="robotsTxt">Robots.txt</Label>
                <Textarea
                  id="robotsTxt"
                  name="robotsTxt"
                  defaultValue={websiteSettings.robotsTxt || ""}
                  placeholder="User-agent: *\nAllow: /"
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo & Màu sắc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  defaultValue={websiteSettings.logo || ""}
                  placeholder="/images/logo.png"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logoWidth">Logo Width (px)</Label>
                  <Input
                    id="logoWidth"
                    name="logoWidth"
                    type="number"
                    defaultValue={websiteSettings.logoWidth || ""}
                    placeholder="150"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoHeight">Logo Height (px)</Label>
                  <Input
                    id="logoHeight"
                    name="logoHeight"
                    type="number"
                    defaultValue={websiteSettings.logoHeight || ""}
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoAlt">Logo Alt Text</Label>
                <Input
                  id="logoAlt"
                  name="logoAlt"
                  defaultValue={websiteSettings.logoAlt || ""}
                  placeholder="Logo của website"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="themeColor">Theme Color</Label>
                <Input
                  id="themeColor"
                  name="themeColor"
                  type="color"
                  defaultValue={websiteSettings.themeColor || "#ffffff"}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Header & Footer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headerHtml">Header HTML</Label>
                <Textarea
                  id="headerHtml"
                  name="headerHtml"
                  defaultValue={websiteSettings.headerHtml || ""}
                  placeholder="<div>Custom header...</div>"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerHtml">Footer HTML</Label>
                <Textarea
                  id="footerHtml"
                  name="footerHtml"
                  defaultValue={websiteSettings.footerHtml || ""}
                  placeholder="<div>Custom footer...</div>"
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Input
                  id="footerText"
                  name="footerText"
                  defaultValue={websiteSettings.footerText || ""}
                  placeholder="© 2025 Company Name"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRACKING TAB */}
        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Tracking</CardTitle>
              <CardDescription>
                Cấu hình Google Analytics, GTM, Facebook Pixel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                <Input
                  id="googleAnalytics"
                  name="googleAnalytics"
                  defaultValue={websiteSettings.googleAnalytics || ""}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
                <Input
                  id="googleTagManager"
                  name="googleTagManager"
                  defaultValue={websiteSettings.googleTagManager || ""}
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixel"
                  name="facebookPixel"
                  defaultValue={websiteSettings.facebookPixel || ""}
                  placeholder="XXXXXXXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADVANCED TAB */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Code</CardTitle>
              <CardDescription>
                Inject custom CSS, JavaScript và code vào head/footer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  name="customCss"
                  defaultValue={websiteSettings.customCss || ""}
                  placeholder=".custom-class { color: red; }"
                  rows={5}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customJs">Custom JavaScript</Label>
                <Textarea
                  id="customJs"
                  name="customJs"
                  defaultValue={websiteSettings.customJs || ""}
                  placeholder="console.log('Hello');"
                  rows={5}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headerCode">Header Code ({"<head>"})</Label>
                <Textarea
                  id="headerCode"
                  name="headerCode"
                  defaultValue={websiteSettings.headerCode || ""}
                  placeholder="<script>...</script>"
                  rows={5}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerCode">Footer Code (before {"</body>"})</Label>
                <Textarea
                  id="footerCode"
                  name="footerCode"
                  defaultValue={websiteSettings.footerCode || ""}
                  placeholder="<script>...</script>"
                  rows={5}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Button - Fixed at bottom on mobile */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t pt-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto"
          size="lg"
        >
          {saving ? (
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
