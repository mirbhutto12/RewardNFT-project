"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { UsdcBalanceDisplay } from "./usdc-balance-display"
import { WalletConnectButton } from "./wallet-connect-button"
import { useWalletModal } from "@/hooks/use-wallet-modal"
import { NftMintingWithVerification } from "./nft-minting-with-verification"

export function MintPageContent() {
  const [mintSuccess, setMintSuccess] = useState(false)
  const { walletAddress } = useWalletModal()

  const handleMintSuccess = () => {
    setMintSuccess(true)
    // Reset the success message after 5 seconds
    setTimeout(() => {
      setMintSuccess(false)
    }, 5000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Mint Your Reward NFT</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Mint your NFT to start earning rewards and participating in quests.
      </p>

      {mintSuccess && (
        <Alert className="mb-6 bg-green-500/10 border-green-500 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your NFT has been successfully minted. You can view it in your profile.</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-transparent to-indigo-900 text-white border-none">
          <CardContent className="p-6">
            <NftMintingWithVerification onSuccess={handleMintSuccess} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Mint Details</h2>
              <p className="mb-4">
                Minting an NFT requires a connected wallet with USDC tokens. Follow these steps to mint your NFT:
              </p>
              <ol className="list-decimal list-inside space-y-2 mb-6">
                <li>Connect your Solana wallet</li>
                <li>Ensure you have enough USDC for minting</li>
                <li>Click the "Mint NFT" button</li>
                <li>Approve the transaction in your wallet</li>
                <li>Wait for confirmation and verification</li>
              </ol>

              <div className="flex flex-col space-y-4">
                {walletAddress ? <UsdcBalanceDisplay walletAddress={walletAddress} /> : <WalletConnectButton />}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">NFT Benefits</h2>
              <Tabs defaultValue="rewards">
                <TabsList className="mb-4">
                  <TabsTrigger value="rewards">Rewards</TabsTrigger>
                  <TabsTrigger value="quests">Quests</TabsTrigger>
                  <TabsTrigger value="referrals">Referrals</TabsTrigger>
                </TabsList>
                <TabsContent value="rewards" className="space-y-2">
                  <p>Holding this NFT gives you access to:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Weekly USDC rewards</li>
                    <li>Exclusive airdrops</li>
                    <li>Governance voting rights</li>
                    <li>Premium platform features</li>
                  </ul>
                </TabsContent>
                <TabsContent value="quests" className="space-y-2">
                  <p>Complete quests to earn additional rewards:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Daily login bonuses</li>
                    <li>Community challenges</li>
                    <li>Educational tasks</li>
                    <li>Social media engagement</li>
                  </ul>
                </TabsContent>
                <TabsContent value="referrals" className="space-y-2">
                  <p>Earn from your network:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>10% commission on referral mints</li>
                    <li>Tiered referral system</li>
                    <li>Special rewards for top referrers</li>
                    <li>Custom referral links and tracking</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
