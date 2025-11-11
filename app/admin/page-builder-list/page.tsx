import { redirect } from 'next/navigation';

/**
 * Page Builder List - DEPRECATED
 * Đã merge vào pages-management
 * Redirect to pages-management
 */
export default function PageBuilderListPage() {
  redirect('/admin/pages-management');
}
