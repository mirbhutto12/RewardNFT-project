"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEnhancedWallet } from "@/contexts/enhanced-wallet-context"
import Image from "next/image"

// Separate the confetti to avoid SSR issues
const ConfettiEffect = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) return null

  // Import confetti dynamically to avoid SSR issues
  const Confetti = require("@/components/ui/animations").Confetti
  return <Confetti />
}

export function MintSuccessContent() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  // Use state to avoid hydration mismatch
  const [walletState, setWalletState] = useState({
    connected: false,
    hasNFT: false,
  })

  // Fetch wallet state unconditionally
  const { connected, hasNFT } = useEnhancedWallet()

  // Get wallet context after component mounts
  useEffect(() => {
    setIsMounted(true)

    // Update wallet state
    setWalletState({ connected, hasNFT })

    // Redirect if not connected or doesn't have NFT
    if (!connected) {
      router.push("/")
    } else if (!hasNFT) {
      router.push("/mint")
    }
  }, [router, connected, hasNFT])

  if (!isMounted) {
    // Return a loading state or skeleton
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/50 p-8 rounded-lg shadow-lg text-center">
          <div className="mb-6 relative w-32 h-32 mx-auto bg-gray-700 animate-pulse rounded-lg"></div>
          <div className="h-8 bg-gray-700 animate-pulse rounded mb-4"></div>
          <div className="h-6 bg-gray-700 animate-pulse rounded mb-8"></div>
          <div className="grid gap-4">
            <div className="h-10 bg-gray-700 animate-pulse rounded"></div>
            <div className="h-10 bg-gray-700 animate-pulse rounded"></div>
            <div className="h-10 bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <ConfettiEffect />

      <div className="max-w-md w-full bg-gray-800/50 p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6 relative w-32 h-32 mx-auto">
          <Image src="/images/mint-nft-box.png" alt="NFT" fill className="object-contain" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
        <p className="text-xl mb-8">You've successfully minted your Reward NFT!</p>

        <div className="grid gap-4">
          <Button onClick={() => router.push("/referrals")} size="lg" className="w-full">
            Go to Referrals
          </Button>

          <Button onClick={() => router.push("/quests")} size="lg" variant="outline" className="w-full">
            Explore Quests
          </Button>

          <Button onClick={() => router.push("/profile")} size="lg" variant="secondary" className="w-full">
            View Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
