import { ReactNode } from 'react';

/**
 * Page Builder Layout
 * Full screen layout, không có admin header/footer/sidebar
 * Z-index cao để hiển thị trên mọi component khác
 */
export default function PageBuilderLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-background" style={{ zIndex: 9998 }}>
      {children}
    </div>
  );
}
