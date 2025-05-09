"use client"

import Link from "next/link"
import MainNav from "@/components/main-nav" // Changed from named import to default import
import { MobileNav } from "@/components/mobile-nav"
import { useMobile } from "@/hooks/use-mobile"
import { NetworkIndicator } from "@/components/network-indicator"
import { AuthButton } from "@/components/auth-button"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ShieldCheck } from "lucide-react"

export function Header() {
  const isMobile = useMobile()
  const { isAdmin } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="items-center space-x-2 flex">
            <span className="font-bold inline-block">Solana Reward NFT</span>
          </Link>
          {!isMobile && <MainNav />}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {isAdmin && (
              <Button asChild variant="outline" size="sm" className="hidden md:flex">
                <Link href="/admin/dashboard">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>
            )}
            <NetworkIndicator />
            <AuthButton />
          </nav>
        </div>
        {isMobile && <MobileNav />}
      </div>
    </header>
  )
}
