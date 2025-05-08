import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/contexts/wallet-context"
import { ThemeProvider } from "@/components/theme-provider"
import dynamic from "next/dynamic"
import { SecureWalletProvider } from "@/contexts/secure-wallet-context"

const inter = Inter({ subsets: ["latin"] })

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

export const metadata: Metadata = {
  title: "Reward NFT Platform | Mint, Refer, Earn",
  description: "Mint your exclusive NFT, refer friends, complete quests, and earn USDC rewards on Solana blockchain",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <WalletProvider>
            <SecureWalletProvider>
              {children}
              <MobileBottomNav />
              <Toaster />
              {process.env.NODE_ENV === "development" && <WalletDebug />}
            </SecureWalletProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
