"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { useWallet } from "@/contexts/wallet-context"
import { Menu } from "lucide-react"

export function Header() {
  const wallet = useWallet()
  const [showMobileNav, setShowMobileNav] = useState(false)

  // Safe wallet hook usage with error boundary
  let connected = false
  try {
    connected = wallet?.connected || false
  } catch (error) {
    console.warn("Wallet context not available in Header:", error)
  }

  // Get app name from environment or use default
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Reward NFT Platform"
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo and App Name */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="rounded-md" />
            <span className="hidden font-bold sm:inline-block">{appName}</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setShowMobileNav(!showMobileNav)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Mobile Logo */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <Image src="/images/logo.png" alt="Logo" width={28} height={28} className="rounded-md" />
              <span className="font-bold text-sm">{appName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <MainNav />
          </div>
        </div>

        {/* Right Side - Network Badge and Wallet */}
        <div className="flex items-center space-x-4">
          {/* Network Badge */}
          <Badge variant={network === "mainnet" ? "default" : "secondary"} className="hidden sm:inline-flex">
            {network.toUpperCase()}
          </Badge>

          {/* Wallet Connect Button */}
          <WalletConnectButton />
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileNav && (
        <div className="border-t md:hidden">
          <MobileNav />
        </div>
      )}
    </header>
  )
}
