import Link from 'next/link';
import { FileQuestion, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Custom 404 page for Page Builder
 * Shows helpful message and actions
 */
export default function PageBuilderNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md px-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <FileQuestion className="w-10 h-10 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Page Builder Not Found
        </h1>
        
        <p className="text-gray-600 mb-2">
          Page Builder này không tồn tại hoặc đã bị xóa.
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          Có thể page này thuộc về domain khác hoặc đã bị xóa khỏi hệ thống.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/admin/content" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/admin/content/new?mode=builder" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Tạo Page Builder mới
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Đảm bảo bạn đang truy cập đúng domain cho page này.
          </p>
        </div>
      </div>
    </div>
  );
}
