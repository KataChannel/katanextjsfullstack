'use client';

import { Header } from './header';
import { Footer } from './footer';

interface PageLayoutWrapperProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function PageLayoutWrapper({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: PageLayoutWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header />}
      <main className={showHeader ? "flex-1" : "flex-1 pt-0"}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
