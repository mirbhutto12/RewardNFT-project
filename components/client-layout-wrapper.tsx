"use client"

import { type ReactNode, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { MobileHeader } from "@/components/mobile-header"
import { useMobile } from "@/hooks/use-mobile"
import { Footer } from "@/components/footer"

// Dynamically import components that aren't needed for initial render
const MobileBottomNavDynamic = dynamic(
  () => import("@/components/mobile-bottom-nav").then((mod) => ({ default: mod.MobileBottomNav })),
  {
    ssr: false,
    loading: () => <div className="h-16" />,
  },
)

const WalletDebug = dynamic(() => import("@/components/wallet-debug").then((mod) => ({ default: mod.WalletDebug })), {
  ssr: false,
})

interface ClientLayoutWrapperProps {
  children: ReactNode
}

export function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  const [isDevMode, setIsDevMode] = useState(false)
  const pathname = usePathname()
  const { isMobile } = useMobile()

  // Add padding to the top and bottom for mobile to account for fixed header and nav
  const mobileStyles = isMobile ? "pt-16 pb-16" : ""

  useEffect(() => {
    setIsDevMode(process.env.NODE_ENV === "development")
  }, [])

  return (
    <div className={`min-h-screen flex flex-col ${mobileStyles}`}>
      {/* Mobile-specific header */}
      <MobileHeader />

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Mobile-specific bottom navigation */}
      <MobileBottomNav />
    </div>
  )
}
