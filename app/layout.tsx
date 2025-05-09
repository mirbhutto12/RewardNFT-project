import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/contexts/wallet-context"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientLayoutWrapper } from "@/components/client-layout-wrapper"
import { SecureWalletProvider } from "@/contexts/secure-wallet-context"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

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
            <AuthProvider>
              <SecureWalletProvider>
                <ClientLayoutWrapper>
                  {children}
                  <Toaster />
                </ClientLayoutWrapper>
              </SecureWalletProvider>
            </AuthProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
