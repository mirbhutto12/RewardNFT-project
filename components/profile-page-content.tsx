"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileWalletInfo } from "@/components/profile-wallet-info"
import { SimplifiedNftGallery } from "@/components/simplified-nft-gallery"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/contexts/wallet-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { ActivityItem } from "@/components/activity-item"

export function ProfilePageContent() {
  const { connected } = useWallet()
  const [activeTab, setActiveTab] = useState("nfts")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {connected ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-white/10 mb-6">
                <TabsTrigger value="nfts" className="flex-1">
                  My NFTs
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex-1">
                  Activity
                </TabsTrigger>
                <TabsTrigger value="rewards" className="flex-1">
                  Rewards
                </TabsTrigger>
              </TabsList>

              <TabsContent value="nfts" className="mt-0">
                <SimplifiedNftGallery />
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ActivityItem
                      type="mint"
                      title="NFT Minted"
                      description="You minted a new Reward NFT"
                      timestamp="2 hours ago"
                    />
                    <ActivityItem
                      type="reward"
                      title="Reward Earned"
                      description="You earned 5 USDC from quest completion"
                      timestamp="1 day ago"
                    />
                    <ActivityItem
                      type="referral"
                      title="Referral Bonus"
                      description="You received a referral bonus of 2 USDC"
                      timestamp="3 days ago"
                    />
                    <ActivityItem
                      type="mint"
                      title="NFT Minted"
                      description="You minted a new Reward NFT"
                      timestamp="1 week ago"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards" className="mt-0">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Rewards Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                        <div>
                          <h3 className="font-medium text-white">Total Earned</h3>
                          <p className="text-white/60 text-sm">All-time earnings</p>
                        </div>
                        <div className="text-2xl font-bold text-white">25 USDC</div>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                        <div>
                          <h3 className="font-medium text-white">Quest Rewards</h3>
                          <p className="text-white/60 text-sm">From completed quests</p>
                        </div>
                        <div className="text-2xl font-bold text-white">15 USDC</div>
                      </div>

                      <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                        <div>
                          <h3 className="font-medium text-white">Referral Bonuses</h3>
                          <p className="text-white/60 text-sm">From referred users</p>
                        </div>
                        <div className="text-2xl font-bold text-white">10 USDC</div>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-medium text-white mb-2">Pending Rewards</h3>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <p className="text-white/60">No pending rewards at this time</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                <h2 className="text-xl font-bold text-white">Connect Your Wallet</h2>
                <p className="text-white/60 text-center mb-4">
                  Connect your wallet to view your NFTs, activity, and rewards
                </p>
                <WalletConnectButton />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <ProfileWalletInfo />

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">NFTs Owned</span>
                  <span className="font-medium text-white">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Quests Completed</span>
                  <span className="font-medium text-white">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Referrals</span>
                  <span className="font-medium text-white">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Total Rewards</span>
                  <span className="font-medium text-white">25 USDC</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
