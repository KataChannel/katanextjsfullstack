import { redirect } from 'next/navigation';

/**
 * Posts Management - DEPRECATED
 * Đã merge vào Content Management
 * Redirect to /admin/content
 */
export default function PostsManagementPageRedirect() {
  redirect('/admin/content');
}
