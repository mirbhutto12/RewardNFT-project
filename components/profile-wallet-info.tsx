"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { WalletBalance } from "@/components/wallet-balance"
import { Button } from "@/components/ui/button"
import { Copy, Check, ExternalLink, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { NetworkIndicator } from "@/components/network-indicator"

export function ProfileWalletInfo() {
  const { publicKey, connected, refreshBalances, network, explorerUrl } = useWallet()
  const [copied, setCopied] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  if (!connected || !publicKey) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Wallet Information</h3>
        <p className="text-white/80">Connect your wallet to view your information</p>
      </div>
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey.toString())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const openExplorer = () => {
    window.open(`${explorerUrl}/address/${publicKey.toString()}`, "_blank")
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshBalances()
      toast({
        title: "Balances Updated",
        description: "Your wallet balances have been refreshed",
      })
    } catch (error) {
      console.error("Error refreshing balances:", error)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Wallet Information</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh balances</span>
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-white/60 text-sm mb-1">Connected Address</p>
          <div className="flex items-center gap-2">
            <p className="text-white font-mono bg-white/10 rounded p-2 text-sm truncate flex-1">
              {publicKey.toString()}
            </p>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-9 w-9 p-0">
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-white/60" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={openExplorer} className="h-9 w-9 p-0">
              <ExternalLink className="h-4 w-4 text-white/60" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-white/60">SOL Balance</p>
          <WalletBalance className="font-medium" showUsdt={false} />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-white/60">USDT Balance</p>
          <WalletBalance className="font-medium" showSol={false} />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-white/60">Network</p>
          <NetworkIndicator />
        </div>
      </div>
    </div>
  )
}
