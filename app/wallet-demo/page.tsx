"use client"

import { WalletIntegrationDemo } from "@/components/wallet-integration-demo"
import { useEffect, useState } from "react"

export default function WalletDemoPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Solana Web3.js Wallet Integration</h1>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading wallet demo...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Solana Web3.js Wallet Integration</h1>
      <WalletIntegrationDemo />
    </div>
  )
}
