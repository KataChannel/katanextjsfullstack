"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Mail, Home, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: "/auth/login",
      redirect: true 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-red-200">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Không Có Quyền Truy Cập
          </CardTitle>
          <CardDescription className="text-base">
            Bạn không có quyền truy cập vào khu vực quản trị
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 mb-3">
              <strong>Lý do:</strong> Tài khoản của bạn chưa được cấp quyền quản trị viên.
            </p>
            <p className="text-sm text-red-700">
              Chỉ các vai trò sau có thể truy cập:
            </p>
            <ul className="text-sm text-red-700 mt-2 ml-4 space-y-1">
              <li>• <strong>Admin</strong> - Quản trị viên (full quyền)</li>
              <li>• <strong>Manager</strong> - Người quản lý (quản lý nội dung, media)</li>
              <li>• <strong>Editor</strong> - Biên tập viên (chỉnh sửa nội dung)</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Cần quyền truy cập?
                </p>
                <p className="text-sm text-blue-700">
                  Vui lòng liên hệ quản trị viên hệ thống để được cấp quyền.
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  Email: <a href="mailto:admin@tazagroup.vn" className="underline">admin@tazagroup.vn</a>
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Về Trang Chủ
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đăng Xuất
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
