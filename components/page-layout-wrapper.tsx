'use client';

interface PageLayoutWrapperProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

/**
 * PageLayoutWrapper - chỉ wrap content
 * Không render Header/Footer vì page đã nằm trong (public) layout
 * showHeader và showFooter props được giữ lại để tương thích nhưng không sử dụng
 */
export function PageLayoutWrapper({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: PageLayoutWrapperProps) {
  return (
    <>
      {children}
    </>
  );
}
