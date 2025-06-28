
"use client"

import Link from "next/link"
import { Home, Info, Users } from "lucide-react"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import type React from "react"

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-1 text-xs transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {icon}
      {children}
    </Link>
  )
}

export function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container grid h-16 grid-cols-3 items-center">
        <NavLink href="/" icon={<Home className="h-5 w-5" />}>
          Games
        </NavLink>
        <NavLink href="/team" icon={<Users className="h-5 w-5" />}>
          Team
        </NavLink>
        <NavLink href="/about" icon={<Info className="h-5 w-5" />}>
          About
        </NavLink>
      </div>
    </div>
  )
}
