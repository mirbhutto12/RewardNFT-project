"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NftMintingWithVerification } from "@/components/nft-minting-with-verification"
import { NFT_MINT_COST_USDT } from "@/config/solana"

export function MintPageContent() {
  const [mintedNftAddress, setMintedNftAddress] = useState<string | null>(null)

  const handleMintSuccess = (mintAddress: string) => {
    setMintedNftAddress(mintAddress)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Mint Your Reward NFT</h1>
        <p className="text-muted-foreground mb-8">
          Mint your verified NFT to start earning rewards and participating in quests.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white border-none">
            <CardContent className="p-6">
              <NftMintingWithVerification onSuccess={handleMintSuccess} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Mint Details</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">{NFT_MINT_COST_USDT} USDT</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Blockchain</span>
                    <span className="font-medium">Solana</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Verification</span>
                    <span className="font-medium text-green-600">Included</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rewards</span>
                    <span className="font-medium">Enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Benefits</h2>
                <Tabs defaultValue="rewards">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="rewards">Rewards</TabsTrigger>
                    <TabsTrigger value="quests">Quests</TabsTrigger>
                    <TabsTrigger value="referrals">Referrals</TabsTrigger>
                  </TabsList>
                  <TabsContent value="rewards" className="pt-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Earn USDT rewards for completing quests</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Stake your NFT for passive income</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Access exclusive reward tiers</span>
                      </li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="quests" className="pt-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Access to daily and weekly quests</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Participate in community challenges</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Unlock special quest rewards</span>
                      </li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="referrals" className="pt-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Earn 5% of referred users' rewards</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Generate unique referral links</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>Track referral performance</span>
                      </li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
