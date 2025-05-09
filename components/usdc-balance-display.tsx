"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Loader2 } from "lucide-react"

interface UsdcBalanceDisplayProps {
  className?: string
  publicKey?: any
}

export function UsdcBalanceDisplay({ className = "", publicKey }: UsdcBalanceDisplayProps) {
  const walletContext = useWallet()
  const { connected, usdcBalance, refreshBalances } = walletContext
  const [loading, setLoading] = useState(false)
  const walletPublicKey = publicKey || walletContext.publicKey

  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !walletPublicKey) {
        return
      }

      try {
        setLoading(true)
        await refreshBalances()
      } catch (error) {
        console.error("Error fetching balance:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()

    // Set up an interval to refresh the balance every 30 seconds
    const intervalId = setInterval(fetchBalance, 30000)

    return () => clearInterval(intervalId)
  }, [walletPublicKey, connected, refreshBalances])

  return (
    <div className={`text-white ${className}`}>
      {!connected ? (
        <span className="text-white/60">Wallet not connected</span>
      ) : loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-white/60" />
          <span>Loading balance...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <span>{usdcBalance !== null && usdcBalance !== undefined ? usdcBalance.toFixed(2) : "0.00"} USDC</span>
        </div>
      )}
    </div>
  )
}
