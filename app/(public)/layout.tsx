'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen max-w-[1920px] mx-auto">
      {/* Website Public Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Website Public Footer */}
      <Footer />
    </div>
  );
}
