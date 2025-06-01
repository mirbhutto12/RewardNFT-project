"use client"

import { USDCTransactionVerification } from "@/components/usdc-transaction-verification"
import { USDCBalanceDisplay } from "@/components/usdc-balance-display"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export default function USDCTestPage() {
  const [config, setConfig] = useState<{
    network: string
    usdcAddress: string
    isLoaded: boolean
  }>({
    network: "",
    usdcAddress: "",
    isLoaded: false,
  })

  useEffect(() => {
    // Load configuration on client side to avoid SSR issues
    const loadConfig = async () => {
      try {
        const { USDC_TOKEN_ADDRESS, CURRENT_NETWORK } = await import("@/config/solana")

        const network = CURRENT_NETWORK || "devnet"
        const tokenAddresses = USDC_TOKEN_ADDRESS || {}
        const usdcAddress = tokenAddresses[network]?.toString() || "Not configured"

        setConfig({
          network,
          usdcAddress,
          isLoaded: true,
        })
      } catch (error) {
        console.error("Failed to load Solana config:", error)
        setConfig({
          network: "devnet",
          usdcAddress: "Configuration error",
          isLoaded: true,
        })
      }
    }

    loadConfig()
  }, [])

  if (!config.isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">USDC Integration Test</h1>
            <p className="text-gray-600">Loading configuration...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">USDC Integration Test</h1>
          <p className="text-gray-600 mb-4">Test and verify USDC functionality on Solana</p>
          <Badge variant="secondary">Network: {config.network.toUpperCase()}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>USDC Configuration</CardTitle>
              <CardDescription>Current USDC token configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Network</p>
                <p className="text-sm text-gray-600">{config.network}</p>
              </div>
              <div>
                <p className="text-sm font-medium">USDC Mint Address</p>
                <p className="text-xs text-gray-600 font-mono break-all">{config.usdcAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Your USDC Balance</p>
                <USDCBalanceDisplay showRefresh={true} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Information</CardTitle>
              <CardDescription>Solana network details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Mainnet USDC</p>
                <p className="text-xs text-gray-600 font-mono">EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v</p>
              </div>
              <div>
                <p className="text-sm font-medium">Devnet USDC</p>
                <p className="text-xs text-gray-600 font-mono">4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU</p>
              </div>
              <div>
                <p className="text-sm font-medium">Current Network</p>
                <Badge variant={config.network === "mainnet" ? "default" : "secondary"}>{config.network}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <USDCTransactionVerification />
      </div>
    </div>
  )
}
