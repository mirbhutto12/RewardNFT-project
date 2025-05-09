"use client"

import { type ReactNode, useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import components that aren't needed for initial render
const MobileBottomNav = dynamic(
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

  useEffect(() => {
    setIsDevMode(process.env.NODE_ENV === "development")
  }, [])

  return (
    <>
      {children}
      <MobileBottomNav />
      {isDevMode && <WalletDebug />}
    </>
  )
}
