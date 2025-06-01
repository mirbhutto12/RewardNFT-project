"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useEnhancedWallet } from "@/contexts/enhanced-wallet-context"
import { WalletAddress } from "./wallet-address"
import { toast } from "@/components/ui/use-toast"

export function WalletIntegrationDemo() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Wallet Integration Demo</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <WalletDemoContent />
}

function WalletDemoContent() {
  const { connected, connecting, publicKey, connect, disconnect, walletProviders, selectedWallet } = useEnhancedWallet()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error("Connection failed:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error("Disconnection failed:", error)
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Wallet Integration Demo</CardTitle>
        <CardDescription>Test the Solana wallet integration functionality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Connection Status:</span>
          <Badge variant={connected ? "default" : "secondary"}>{connected ? "Connected" : "Disconnected"}</Badge>
        </div>

        {/* Wallet Address */}
        {connected && publicKey && (
          <div className="space-y-2">
            <span className="font-medium">Wallet Address:</span>
            <WalletAddress address={publicKey.toString()} />
          </div>
        )}

        {/* Selected Wallet */}
        {selectedWallet && (
          <div className="flex items-center justify-between">
            <span className="font-medium">Selected Wallet:</span>
            <Badge variant="outline">{selectedWallet}</Badge>
          </div>
        )}

        {/* Available Wallets */}
        <div className="space-y-2">
          <span className="font-medium">Available Wallets:</span>
          <div className="flex flex-wrap gap-2">
            {walletProviders.length > 0 ? (
              walletProviders.map((provider) => (
                <Badge key={provider} variant="outline">
                  {provider}
                </Badge>
              ))
            ) : (
              <Alert>
                <AlertDescription>
                  No wallet providers detected. Please install a Solana wallet like Phantom.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!connected ? (
            <Button onClick={handleConnect} disabled={connecting || walletProviders.length === 0} className="flex-1">
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          ) : (
            <Button onClick={handleDisconnect} variant="outline" className="flex-1">
              Disconnect Wallet
            </Button>
          )}
        </div>

        {/* Instructions */}
        {!connected && walletProviders.length === 0 && (
          <Alert>
            <AlertDescription>
              To test the wallet integration, please install a Solana wallet browser extension like Phantom, Solflare,
              or Backpack.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
