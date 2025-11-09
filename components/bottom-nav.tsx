"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, PackagePlus, PackageMinus, ClipboardCheck, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    label: "Trang chủ",
    icon: Home,
  },
  {
    href: "/import",
    label: "Nhập",
    icon: PackagePlus,
  },
  {
    href: "/export",
    label: "Xuất",
    icon: PackageMinus,
  },
  {
    href: "/inventory",
    label: "Kiểm kê",
    icon: ClipboardCheck,
  },
  {
    href: "/dashboard",
    label: "Báo cáo",
    icon: BarChart3,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}