'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, GripVertical } from 'lucide-react';

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
  logo?: string;
  logoAlt?: string;
  headerHtml?: string;
  navigationMenu?: MenuItem[];
  footerHtml?: string;
  footerText?: string;
  socialLinks?: SocialLink[];
}

export default function WebsiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings>({
    logo: '',
    logoAlt: '',
    headerHtml: '',
    navigationMenu: [],
    footerHtml: '',
    footerText: '',
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
        toast.success('Đã lưu cài đặt website');
      } else {
        toast.error('Lỗi khi lưu cài đặt');
      }
    } catch (error) {
      toast.error('Lỗi khi lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

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
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Cài Đặt Website</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Quản lý header, footer và navigation menu
        </p>
      </div>

      <div className="space-y-6">
        {/* Logo Section */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Logo</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="logo" className="text-sm sm:text-base">URL Logo</Label>
              <Input
                id="logo"
                value={settings.logo || ''}
                onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                placeholder="/logo.png"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="logoAlt" className="text-sm sm:text-base">Alt Text</Label>
              <Input
                id="logoAlt"
                value={settings.logoAlt || ''}
                onChange={(e) => setSettings({ ...settings, logoAlt: e.target.value })}
                placeholder="Logo description"
                className="mt-1.5"
              />
            </div>
          </div>
        </Card>

        {/* Navigation Menu */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Menu Điều Hướng</h2>
            <Button onClick={addMenuItem} size="sm" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Menu
            </Button>
          </div>

          <div className="space-y-3">
            {(settings.navigationMenu || []).map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2 p-3 border rounded-lg">
                <div className="hidden sm:flex items-center">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2">
                  <Input
                    value={item.label}
                    onChange={(e) => updateMenuItem(index, 'label', e.target.value)}
                    placeholder="Label (vd: Trang chủ)"
                    className="text-sm"
                  />
                  <Input
                    value={item.url}
                    onChange={(e) => updateMenuItem(index, 'url', e.target.value)}
                    placeholder="URL (vd: /)"
                    className="text-sm"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMenuItem(index)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Footer Settings */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Footer</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="footerText" className="text-sm sm:text-base">Văn Bản Footer</Label>
              <Input
                id="footerText"
                value={settings.footerText || ''}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                placeholder="© 2025 Company. All rights reserved."
                className="mt-1.5"
              />
            </div>
          </div>
        </Card>

        {/* Social Links */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Mạng Xã Hội</h2>
            <Button onClick={addSocialLink} size="sm" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Link
            </Button>
          </div>

          <div className="space-y-3">
            {(settings.socialLinks || []).map((link, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2 p-3 border rounded-lg">
                <div className="flex-1 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-2">
                  <Input
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                    placeholder="Platform (vd: facebook)"
                    className="text-sm"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder="URL"
                    className="text-sm"
                  />
                  <Input
                    value={link.icon}
                    onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                    placeholder="Icon name"
                    className="text-sm"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
            size="lg"
          >
            {saving ? 'Đang lưu...' : 'Lưu Cài Đặt'}
          </Button>
        </div>
      </div>
    </div>
  );
}
