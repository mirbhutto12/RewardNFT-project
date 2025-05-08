"use client"

import { useState, useEffect } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { DEFAULT_RPC_ENDPOINT, DEFAULT_USDC_TOKEN_ADDRESS } from "@/config/solana"
import { getTokenBalance } from "@/utils/token"
import { Skeleton } from "@/components/ui/skeleton"

interface UsdcBalanceDisplayProps {
  walletAddress: string
  className?: string
}

export function UsdcBalanceDisplay({ walletAddress, className = "" }: UsdcBalanceDisplayProps) {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) {
        setBalance(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const connection = new Connection(DEFAULT_RPC_ENDPOINT, "confirmed")
        const publicKey = new PublicKey(walletAddress)

        const usdcBalance = await getTokenBalance(connection, publicKey, DEFAULT_USDC_TOKEN_ADDRESS)
        setBalance(usdcBalance)
      } catch (err: any) {
        console.error("Error fetching USDC balance:", err)
        setError(err.message || "Failed to fetch USDC balance")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()

    // Set up an interval to refresh the balance every 30 seconds
    const intervalId = setInterval(fetchBalance, 30000)

    return () => clearInterval(intervalId)
  }, [walletAddress])

  if (isLoading) {
    return <Skeleton className={`h-6 w-24 ${className}`} />
  }

  if (error) {
    return <span className={`text-red-500 text-sm ${className}`}>Error: {error}</span>
  }

  return <span className={className}>{balance !== null ? `${balance.toFixed(2)} USDC` : "No USDC"}</span>
}
