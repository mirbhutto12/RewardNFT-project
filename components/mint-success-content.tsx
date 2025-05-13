"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEnhancedWallet } from "@/contexts/enhanced-wallet-context"
import { Confetti } from "@/components/ui/animations"
import Image from "next/image"

export function MintSuccessContent() {
  const { connected, hasNFT } = useEnhancedWallet()
  const router = useRouter()

  // Redirect if not connected or doesn't have NFT
  useEffect(() => {
    if (!connected) {
      router.push("/")
    } else if (!hasNFT) {
      router.push("/mint")
    }
  }, [connected, hasNFT, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Confetti />

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
