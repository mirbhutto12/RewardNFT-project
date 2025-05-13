"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTokenBalance } from "@/utils/token"
import { DEFAULT_USDC_TOKEN_ADDRESS } from "@/config/solana"

interface UsdcBalanceDisplayProps {
  className?: string
  publicKey?: any
}

export function UsdcBalanceDisplay({ className = "", publicKey }: UsdcBalanceDisplayProps) {
  const walletContext = useWallet()
  const { connected, connection } = walletContext
  const [loading, setLoading] = useState(false)
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null)
  const walletPublicKey = publicKey || walletContext.publicKey

  const fetchBalance = async () => {
    if (!connected || !walletPublicKey || !connection) {
      return
    }

    try {
      setLoading(true)
      // Directly fetch the USDC balance using the token utility
      const balance = await getTokenBalance(connection, walletPublicKey, DEFAULT_USDC_TOKEN_ADDRESS)
      setUsdcBalance(balance)
    } catch (error) {
      console.error("Error fetching USDC balance:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()

    // Set up an interval to refresh the balance every 30 seconds
    const intervalId = setInterval(fetchBalance, 30000)

    return () => clearInterval(intervalId)
  }, [walletPublicKey, connected, connection])

  const handleRefresh = () => {
    fetchBalance()
  }

  return (
    <div className={`flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 ${className}`}>
      <span className="text-white font-medium">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          `${usdcBalance !== null && usdcBalance !== undefined ? usdcBalance.toFixed(2) : "0.00"} USDC`
        )}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
        onClick={handleRefresh}
        disabled={loading}
      >
        <RefreshCw className="h-3 w-3" />
        <span className="sr-only">Refresh balance</span>
      </Button>
    </div>
  )
}
