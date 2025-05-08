"use client"

import { useWallet } from "@/contexts/wallet-context"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface UsdtBalanceDisplayProps {
  className?: string
}

export function UsdtBalanceDisplay({ className = "" }: UsdtBalanceDisplayProps) {
  const { connected, usdcBalance, refreshBalances } = useWallet()
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    if (!connected) return

    setLoading(true)
    try {
      await refreshBalances()
    } catch (error) {
      console.error("Error refreshing balance:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (connected) {
      handleRefresh()
    }
  }, [connected])

  if (!connected) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 ${className}`}>
      <span className="text-white font-medium">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          `${usdcBalance !== null ? usdcBalance.toFixed(2) : "0.00"} USDC`
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
