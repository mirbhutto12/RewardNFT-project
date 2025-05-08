"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { connected } = useWallet()

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="md:hidden">
      <button onClick={toggleMenu} className="text-white p-2" aria-label={isOpen ? "Close menu" : "Open menu"}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black/80 backdrop-blur-md p-4 z-50 border-b border-white/20">
          <nav className="flex flex-col space-y-4">
            <Link href="/mint" className="text-white font-medium py-2" onClick={() => setIsOpen(false)}>
              Mint NFT
            </Link>
            <Link href="/referrals" className="text-white font-medium py-2" onClick={() => setIsOpen(false)}>
              Referrals
            </Link>
            <Link href="/quests" className="text-white font-medium py-2" onClick={() => setIsOpen(false)}>
              Quests
            </Link>
            <Link href="/leaderboard" className="text-white font-medium py-2" onClick={() => setIsOpen(false)}>
              Leaderboard
            </Link>

            {connected && (
              <Link href="/profile" className="text-white font-medium py-2" onClick={() => setIsOpen(false)}>
                My Profile
              </Link>
            )}

            <div className="pt-2">
              <WalletConnectButton className="w-full" />
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
