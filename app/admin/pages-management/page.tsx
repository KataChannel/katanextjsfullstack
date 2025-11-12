import { redirect } from 'next/navigation';

/**
 * Pages Management - DEPRECATED
 * Đã merge vào Content Management
 * Redirect to /admin/content
 */
export default function PagesManagementPageRedirect() {
  redirect('/admin/content');
}
