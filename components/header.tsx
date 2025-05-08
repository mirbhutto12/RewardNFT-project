"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { WalletDetection } from "@/components/wallet-detection"
import { UsdtBalanceDisplay } from "@/components/usdt-balance-display"
import { NetworkIndicator } from "@/components/network-indicator"
import { EnvStatus } from "@/components/env-status"
import { RpcStatus } from "@/components/rpc-status"

interface HeaderProps {
  transparent?: boolean
}

export function Header({ transparent = false }: HeaderProps) {
  const { connected } = useWallet()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const headerClass = transparent
    ? `w-full py-4 px-6 transition-all duration-300 ${isScrolled ? "bg-black/30 backdrop-blur-md" : "bg-transparent"}`
    : "w-full py-4 px-6 bg-black/20 backdrop-blur-md"

  return (
    <>
      <WalletDetection />
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-12 w-12 bg-[#00FFE0] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
            <span className="text-white font-bold text-2xl">Reward NFT</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/mint" className="text-white hover:text-white/80 transition-colors">
              Mint
            </Link>
            <Link href="/referrals" className="text-white hover:text-white/80 transition-colors">
              Referrals
            </Link>
            <Link href="/quests" className="text-white hover:text-white/80 transition-colors">
              Quests
            </Link>
            <Link href="/leaderboard" className="text-white hover:text-white/80 transition-colors">
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <EnvStatus />
            <RpcStatus />
            <NetworkIndicator className="hidden sm:flex" />
            {connected && <UsdtBalanceDisplay className="hidden sm:flex" />}
            {connected && (
              <Button asChild variant="outline" className="hidden sm:flex border-white/30 text-white hover:bg-white/10">
                <Link href="/profile">My Profile</Link>
              </Button>
            )}
            <WalletConnectButton
              variant={connected ? "outline" : "default"}
              className={connected ? "bg-white/10 text-white border border-white/30" : "bg-white text-black"}
            />
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  )
}
