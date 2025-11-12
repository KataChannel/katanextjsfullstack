import { ReactNode } from 'react';

/**
 * Page Builder Layout
 * Full screen layout, không có admin header/footer/sidebar
 */
export default function PageBuilderLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      {children}
    </div>
  );
}
