"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { Loader2 } from "lucide-react"

interface WalletBalanceProps {
  className?: string
  showSol?: boolean
  showUsdt?: boolean
}

export function WalletBalance({ className = "", showSol = true, showUsdt = true }: WalletBalanceProps) {
  const { publicKey, connected, solBalance, usdtBalance, refreshBalances } = useWallet()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !publicKey) {
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
  }, [publicKey, connected, refreshBalances])

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
          {showSol && solBalance !== null && <span>{solBalance.toFixed(4)} SOL</span>}
          {showUsdt && usdtBalance !== null && <span>{usdtBalance.toFixed(2)} USDT</span>}
          {solBalance === null && usdtBalance === null && <span className="text-white/60">Error loading balance</span>}
        </div>
      )}
    </div>
  )
}
