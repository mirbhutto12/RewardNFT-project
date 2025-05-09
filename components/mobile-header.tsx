"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useMobile } from "@/hooks/use-mobile"

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isMobile } = useMobile()

  // Don't render on desktop
  if (!isMobile) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image src="/images/logo.png" alt="Logo" fill className="object-contain rounded-full" />
          </div>
          <span className="font-bold text-white text-lg">Reward NFT</span>
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/"
                  className={`py-3 px-4 rounded-lg ${pathname === "/" ? "bg-white/10 font-medium" : "text-white/80"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/mint"
                  className={`py-3 px-4 rounded-lg ${
                    pathname === "/mint" ? "bg-white/10 font-medium" : "text-white/80"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mint NFT
                </Link>
                <Link
                  href="/referrals"
                  className={`py-3 px-4 rounded-lg ${
                    pathname === "/referrals" ? "bg-white/10 font-medium" : "text-white/80"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Referrals
                </Link>
                <Link
                  href="/quests"
                  className={`py-3 px-4 rounded-lg ${
                    pathname === "/quests" ? "bg-white/10 font-medium" : "text-white/80"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quests
                </Link>
                <Link
                  href="/leaderboard"
                  className={`py-3 px-4 rounded-lg ${
                    pathname === "/leaderboard" ? "bg-white/10 font-medium" : "text-white/80"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Leaderboard
                </Link>
              </nav>

              <div className="pt-2 border-t border-white/10">
                <WalletConnectButton fullWidth variant="outline" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
