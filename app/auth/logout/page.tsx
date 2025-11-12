"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/auth/login" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-lg text-gray-700">Đang đăng xuất...</p>
      </div>
    </div>
  );
}
