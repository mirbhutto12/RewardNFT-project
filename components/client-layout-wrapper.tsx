"use client"

import type React from "react"
import { WalletProvider } from "@/contexts/wallet-context"
import { PersistentWalletProvider } from "@/contexts/persistent-wallet-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <PersistentWalletProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </PersistentWalletProvider>
    </WalletProvider>
  )
}
