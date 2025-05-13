"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { MintNftButton } from "@/components/mint-nft-button"
import { NftMintingWithVerification } from "@/components/nft-minting-with-verification"
import { SimplifiedNftGallery } from "@/components/simplified-nft-gallery"
import { NFT_MINT_COST_USDC } from "@/config/solana"
import Image from "next/image"

export function MintPageContent() {
  const { connected } = useWallet()
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Use a placeholder image if the actual image fails to load
  const [imageError, setImageError] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Mint Your Reward NFT</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle>Standard Mint</CardTitle>
              <CardDescription>Mint your exclusive Reward NFT to unlock platform benefits and rewards</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="relative w-64 h-64">
                {imageError ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                    <span className="text-white">NFT Preview</span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="w-48 h-48 relative">
                      <Image
                        src="/mystery-box.png"
                        alt="Reward NFT"
                        width={300}
                        height={300}
                        className="object-contain"
                        onError={() => setImageError(true)}
                        priority
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <p className="text-center w-full">
                Price: <span className="font-bold">{NFT_MINT_COST_USDC} USDC</span>
              </p>
              <MintNftButton className="w-full" />
            </CardFooter>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader>
              <CardTitle>Your NFT Collection</CardTitle>
              <CardDescription>View your minted NFTs and their verification status</CardDescription>
            </CardHeader>
            <CardContent>
              {connected ? (
                <SimplifiedNftGallery maxDisplay={4} />
              ) : (
                <div className="text-center py-12 text-white/70">Connect your wallet to view your NFTs</div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setShowAdvanced(!showAdvanced)}>
                {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {showAdvanced && (
          <Card className="bg-black/40 border-white/10 mb-12">
            <CardHeader>
              <CardTitle>Advanced Minting Options</CardTitle>
              <CardDescription>Advanced options for minting with verification</CardDescription>
            </CardHeader>
            <CardContent>
              <NftMintingWithVerification />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
