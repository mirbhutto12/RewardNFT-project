"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { NavigationBar } from "@/components/navigation-bar"
import { ProfileWalletInfo } from "@/components/profile-wallet-info"
import { ProfileNFTCard } from "@/components/profile-nft-card"
import { SimplifiedNftGallery } from "@/components/simplified-nft-gallery"
import { ReferralHistory } from "@/components/referral-history"
import { ActivityItem } from "@/components/activity-item"
import { ProtectedRoute } from "@/components/protected-route"

export function ProfilePageContent() {
  const { connected, publicKey } = useWallet()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const userStats = {
    totalNFTs: 3,
    questsCompleted: 12,
    referrals: 5,
    points: 1250,
  }

  // Format date to relative time string
  const formatRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
    return `${Math.floor(diffInSeconds / 31536000)} years ago`
  }

  const recentActivity = [
    {
      id: "1",
      type: "mint",
      title: "NFT Minted",
      description: "You minted Reward NFT #123",
      timestamp: formatRelativeTime(new Date(Date.now() - 1000 * 60 * 60 * 2)), // 2 hours ago
    },
    {
      id: "2",
      type: "quest",
      title: "Quest Completed",
      description: "Daily Login Quest",
      timestamp: formatRelativeTime(new Date(Date.now() - 1000 * 60 * 60 * 24)), // 1 day ago
    },
    {
      id: "3",
      type: "referral",
      title: "Referral Bonus",
      description: "User john.sol joined using your referral",
      timestamp: formatRelativeTime(new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)), // 2 days ago
    },
  ]

  // Mock referral data
  const mockReferrals = [
    {
      address: "john.sol",
      date: "2 days ago",
      status: "completed" as const,
      points: 50,
    },
    {
      address: "alice.sol",
      date: "1 week ago",
      status: "completed" as const,
      points: 50,
    },
    {
      address: "bob.sol",
      date: "2 weeks ago",
      status: "pending" as const,
      points: 50,
    },
  ]

  if (!connected) {
    return (
      <div className="min-h-screen text-white">
        <NavigationBar />

        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-8 text-center max-w-md">
            Connect your wallet to view your profile, NFTs, and track your rewards.
          </p>
          <WalletConnectButton size="lg" />
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col text-white">
        <NavigationBar />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
              <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-gray-400">Manage your NFTs and rewards</p>
              </div>
              <ProfileWalletInfo />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="nfts">My NFTs</TabsTrigger>
                <TabsTrigger value="quests">Quests</TabsTrigger>
                <TabsTrigger value="referrals">Referrals</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total NFTs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{userStats.totalNFTs}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Quests Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{userStats.questsCompleted}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Referrals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{userStats.referrals}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{userStats.points}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest actions and rewards</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <ActivityItem
                            key={activity.id}
                            type={activity.type}
                            title={activity.title}
                            description={activity.description}
                            timestamp={activity.timestamp}
                          />
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View All Activity
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Featured NFT</CardTitle>
                      <CardDescription>Your most valuable NFT</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <ProfileNFTCard name="Reward NFT #123" image="/nft-reward-token.png" rarity="Legendary" />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="nfts">
                <Card>
                  <CardHeader>
                    <CardTitle>My NFT Collection</CardTitle>
                    <CardDescription>All your minted and collected NFTs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SimplifiedNftGallery />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quests">
                <Card>
                  <CardHeader>
                    <CardTitle>Quests</CardTitle>
                    <CardDescription>Complete quests to earn rewards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Quest content will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="referrals">
                <Card>
                  <CardHeader>
                    <CardTitle>Referrals</CardTitle>
                    <CardDescription>Invite friends and earn rewards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReferralHistory referrals={mockReferrals} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your profile preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">Settings content will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
