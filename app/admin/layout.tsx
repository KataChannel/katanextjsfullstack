'use client';

import { SessionProvider } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { AdminHeader } from '@/components/admin-header';
import { AdminFooter } from '@/components/admin-footer';
import { Toaster } from '@/components/ui/sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar - Desktop Only */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 lg:ml-64">
          {/* Admin Header */}
          <AdminHeader />
          
          {/* Main Content with proper spacing */}
          <main className="flex-1 pt-16 transition-all duration-300">
            <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
              {children}
            </div>
          </main>
          
          {/* Admin Footer */}
          <AdminFooter />
        </div>
        
        <Toaster />
      </div>
    </SessionProvider>
  );
}
