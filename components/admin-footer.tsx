import Link from "next/link";
import { Heart } from "lucide-react";

export function AdminFooter() {
  const currentYear = new Date().getFullYear();
  const version = "1.0.0";

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
          {/* Copyright */}
          <div className="flex items-center gap-1">
            <span>© {currentYear} Taza Group.</span>
            <span className="hidden sm:inline">Phát triển với</span>
            <Heart className="h-3 w-3 fill-destructive text-destructive hidden sm:inline" />
            <span className="hidden sm:inline">bởi Taza Tech Team</span>
          </div>

          {/* Version & Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs bg-secondary px-2 py-1 rounded">v{version}</span>
            <Link 
              href="/admin/help" 
              className="hover:text-primary transition-colors"
            >
              Trợ giúp
            </Link>
            <Link 
              href="/admin/docs" 
              className="hover:text-primary transition-colors"
            >
              Tài liệu
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
