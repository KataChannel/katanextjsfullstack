import { redirect } from 'next/navigation';

// SEO Settings has been merged into Website Settings
export default function SeoSettingsPage() {
  redirect('/admin/website-settings');
}
