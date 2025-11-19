'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Trash2, GripVertical, Save, Globe, Search, Code, Palette } from 'lucide-react';

interface MenuItem {
  label: string;
  url: string;
  children: MenuItem[];
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface WebsiteSettings {
  // Metadata & SEO
  siteName?: string;
  siteDescription?: string;
  siteKeywords?: string;
  siteFavicon?: string;
  siteOgImage?: string;
  titleTemplate?: string;
  metaTitle?: string;
  metaDescription?: string;
  twitterHandle?: string;
  
  // SEO & Tracking
  googleAnalytics?: string;
  googleTagManager?: string;
  facebookPixel?: string;
  
  // PWA
  themeColor?: string;
  
  // Header & Navigation
  logo?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  headerHtml?: string;
  navigationMenu?: MenuItem[];
  
  // Footer
  footerHtml?: string;
  footerText?: string;
  socialLinks?: SocialLink[];
  
  // Advanced
  customCss?: string;
  customJs?: string;
  headerCode?: string;
  footerCode?: string;
  robotsTxt?: string;
}

export default function WebsiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings>({
    siteName: '',
    themeColor: '#ffffff',
    navigationMenu: [],
    socialLinks: [],
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/website-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải cài đặt website');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/website-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Đã lưu cài đặt website thành công');
        fetchSettings();
      } else {
        toast.error('Lỗi khi lưu cài đặt');
      }
    } catch (error) {
      toast.error('Lỗi khi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  // Menu handlers
  const addMenuItem = () => {
    setSettings({
      ...settings,
      navigationMenu: [
        ...(settings.navigationMenu || []),
        { label: '', url: '', children: [] },
      ],
    });
  };

  const updateMenuItem = (index: number, field: 'label' | 'url', value: string) => {
    const updatedMenu = [...(settings.navigationMenu || [])];
    updatedMenu[index] = { ...updatedMenu[index], [field]: value };
    setSettings({ ...settings, navigationMenu: updatedMenu });
  };

  const removeMenuItem = (index: number) => {
    const updatedMenu = (settings.navigationMenu || []).filter((_, i) => i !== index);
    setSettings({ ...settings, navigationMenu: updatedMenu });
  };

  // Social links handlers
  const addSocialLink = () => {
    setSettings({
      ...settings,
      socialLinks: [
        ...(settings.socialLinks || []),
        { platform: '', url: '', icon: '' },
      ],
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...(settings.socialLinks || [])];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setSettings({ ...settings, socialLinks: updatedLinks });
  };

  const removeSocialLink = (index: number) => {
    const updatedLinks = (settings.socialLinks || []).filter((_, i) => i !== index);
    setSettings({ ...settings, socialLinks: updatedLinks });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải cài đặt...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Cài Đặt Website & SEO</h1>
        <p className="text-muted-foreground">
          Quản lý toàn bộ cài đặt website, SEO, tracking và giao diện
        </p>
      </div>

      <Tabs defaultValue="seo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="seo" className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="header" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Header</span>
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Footer</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Nâng Cao</span>
          </TabsTrigger>
        </TabsList>

        {/* SEO & Metadata Tab */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Website</CardTitle>
              <CardDescription>Cấu hình metadata cơ bản cho website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Tên Website *</Label>
                <Input
                  id="siteName"
                  value={settings.siteName || ''}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="VD: InnerBright Training"
                />
              </div>
              
              <div>
                <Label htmlFor="siteDescription">Mô Tả Website</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription || ''}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  placeholder="Mô tả ngắn gọn về website của bạn"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="siteKeywords">Từ Khóa (Keywords)</Label>
                <Input
                  id="siteKeywords"
                  value={settings.siteKeywords || ''}
                  onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
                  placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                />
                <p className="text-xs text-muted-foreground mt-1">Phân cách bằng dấu phẩy</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteFavicon">Favicon URL</Label>
                  <Input
                    id="siteFavicon"
                    value={settings.siteFavicon || ''}
                    onChange={(e) => setSettings({ ...settings, siteFavicon: e.target.value })}
                    placeholder="/favicon.ico"
                  />
                </div>
                
                <div>
                  <Label htmlFor="siteOgImage">Open Graph Image</Label>
                  <Input
                    id="siteOgImage"
                    value={settings.siteOgImage || ''}
                    onChange={(e) => setSettings({ ...settings, siteOgImage: e.target.value })}
                    placeholder="/og-image.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Meta Tags</CardTitle>
              <CardDescription>Cấu hình meta title và description mặc định</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titleTemplate">Template Tiêu Đề</Label>
                <Input
                  id="titleTemplate"
                  value={settings.titleTemplate || ''}
                  onChange={(e) => setSettings({ ...settings, titleTemplate: e.target.value })}
                  placeholder="%s | InnerBright"
                />
                <p className="text-xs text-muted-foreground mt-1">%s sẽ được thay bằng tiêu đề trang</p>
              </div>

              <div>
                <Label htmlFor="metaTitle">Meta Title Mặc Định</Label>
                <Input
                  id="metaTitle"
                  value={settings.metaTitle || ''}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                  placeholder="InnerBright - Training & Coaching NLP"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description Mặc Định</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription || ''}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  placeholder="Mô tả website hiển thị trên kết quả tìm kiếm"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="twitterHandle">Twitter Handle</Label>
                <Input
                  id="twitterHandle"
                  value={settings.twitterHandle || ''}
                  onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                  placeholder="@innerbright"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PWA Settings</CardTitle>
              <CardDescription>Cấu hình Progressive Web App</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="themeColor">Theme Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="themeColor"
                    type="color"
                    value={settings.themeColor || '#ffffff'}
                    onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    value={settings.themeColor || '#ffffff'}
                    onChange={(e) => setSettings({ ...settings, themeColor: e.target.value })}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Header Tab */}
        <TabsContent value="header" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>Cấu hình logo website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo">URL Logo</Label>
                <Input
                  id="logo"
                  value={settings.logo || ''}
                  onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                  placeholder="/logo.png"
                />
              </div>
              
              <div>
                <Label htmlFor="logoAlt">Alt Text</Label>
                <Input
                  id="logoAlt"
                  value={settings.logoAlt || ''}
                  onChange={(e) => setSettings({ ...settings, logoAlt: e.target.value })}
                  placeholder="Logo description"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logoWidth">Chiều Rộng (px)</Label>
                  <Input
                    id="logoWidth"
                    type="number"
                    value={settings.logoWidth || ''}
                    onChange={(e) => setSettings({ ...settings, logoWidth: parseInt(e.target.value) || undefined })}
                    placeholder="150"
                  />
                </div>
                <div>
                  <Label htmlFor="logoHeight">Chiều Cao (px)</Label>
                  <Input
                    id="logoHeight"
                    type="number"
                    value={settings.logoHeight || ''}
                    onChange={(e) => setSettings({ ...settings, logoHeight: parseInt(e.target.value) || undefined })}
                    placeholder="50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Menu Điều Hướng</CardTitle>
                  <CardDescription>Quản lý navigation menu</CardDescription>
                </div>
                <Button onClick={addMenuItem} size="sm" className="sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Menu
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(settings.navigationMenu || []).map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 p-3 border rounded-lg">
                    <div className="hidden sm:flex items-center">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={item.label}
                        onChange={(e) => updateMenuItem(index, 'label', e.target.value)}
                        placeholder="Label (vd: Trang chủ)"
                      />
                      <Input
                        value={item.url}
                        onChange={(e) => updateMenuItem(index, 'url', e.target.value)}
                        placeholder="URL (vd: /)"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMenuItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Header HTML</CardTitle>
              <CardDescription>HTML tùy chỉnh cho header (nâng cao)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.headerHtml || ''}
                onChange={(e) => setSettings({ ...settings, headerHtml: e.target.value })}
                placeholder="<div>Custom header content</div>"
                rows={6}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Tab */}
        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Footer Text</CardTitle>
              <CardDescription>Văn bản hiển thị ở footer</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.footerText || ''}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                placeholder="© 2025 InnerBright. All rights reserved."
                rows={2}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle>Mạng Xã Hội</CardTitle>
                  <CardDescription>Links đến các mạng xã hội</CardDescription>
                </div>
                <Button onClick={addSocialLink} size="sm" className="sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Link
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(settings.socialLinks || []).map((link, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        value={link.platform}
                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                        placeholder="Platform (facebook)"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        placeholder="https://facebook.com/..."
                      />
                      <Input
                        value={link.icon}
                        onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                        placeholder="Icon (lucide name)"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Footer HTML</CardTitle>
              <CardDescription>HTML tùy chỉnh cho footer (nâng cao)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.footerHtml || ''}
                onChange={(e) => setSettings({ ...settings, footerHtml: e.target.value })}
                placeholder="<div>Custom footer content</div>"
                rows={6}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tracking Tab */}
        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Tracking</CardTitle>
              <CardDescription>Cấu hình các công cụ theo dõi và phân tích</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                <Input
                  id="googleAnalytics"
                  value={settings.googleAnalytics || ''}
                  onChange={(e) => setSettings({ ...settings, googleAnalytics: e.target.value })}
                  placeholder="G-XXXXXXXXXX hoặc UA-XXXXXXXXX-X"
                />
              </div>

              <div>
                <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
                <Input
                  id="googleTagManager"
                  value={settings.googleTagManager || ''}
                  onChange={(e) => setSettings({ ...settings, googleTagManager: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixel"
                  value={settings.facebookPixel || ''}
                  onChange={(e) => setSettings({ ...settings, facebookPixel: e.target.value })}
                  placeholder="XXXXXXXXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom CSS</CardTitle>
              <CardDescription>CSS tùy chỉnh cho toàn bộ website</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.customCss || ''}
                onChange={(e) => setSettings({ ...settings, customCss: e.target.value })}
                placeholder=".custom-class { color: red; }"
                rows={8}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom JavaScript</CardTitle>
              <CardDescription>JavaScript tùy chỉnh (cẩn thận khi sử dụng)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.customJs || ''}
                onChange={(e) => setSettings({ ...settings, customJs: e.target.value })}
                placeholder="console.log('Custom JS');"
                rows={8}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Header Code</CardTitle>
              <CardDescription>Code inject vào &lt;head&gt;</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.headerCode || ''}
                onChange={(e) => setSettings({ ...settings, headerCode: e.target.value })}
                placeholder="<meta name='...' content='...' />"
                rows={6}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer Code</CardTitle>
              <CardDescription>Code inject trước &lt;/body&gt;</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.footerCode || ''}
                onChange={(e) => setSettings({ ...settings, footerCode: e.target.value })}
                placeholder="<script>...</script>"
                rows={6}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Robots.txt</CardTitle>
              <CardDescription>Nội dung file robots.txt tùy chỉnh</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.robotsTxt || ''}
                onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
                placeholder="User-agent: *&#10;Disallow: /admin/"
                rows={8}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button - Sticky */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur pt-4 pb-2 border-t mt-6">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full"
          size="lg"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Đang lưu...' : 'Lưu Tất Cả Cài Đặt'}
        </Button>
      </div>
    </div>
  );
}
