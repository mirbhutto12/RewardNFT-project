"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/contexts/wallet-context"
import { ProfileWalletInfo } from "@/components/profile-wallet-info"
import { SimplifiedNftGallery } from "@/components/simplified-nft-gallery"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnectButton } from "@/components/wallet-connect-button"

export function ProfilePageContent() {
  const { connected, publicKey } = useWallet()
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    username: "user123",
    walletAddress: publicKey ? publicKey.toString() : "0x1a2b3c4d5e6f7g8h9i0j",
    bio: "NFT collector and crypto enthusiast. Joined Reward NFT in 2023.",
    email: "user123@example.com",
    twitter: "@user123",
    discord: "user123#1234",
  })

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
    } else {
      navigator.clipboard.writeText(profileData.walletAddress)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setProfileData({
      ...profileData,
      username: (formData.get("username") as string) || profileData.username,
      bio: (formData.get("bio") as string) || profileData.bio,
      email: (formData.get("email") as string) || profileData.email,
      twitter: (formData.get("twitter") as string) || profileData.twitter,
      discord: (formData.get("discord") as string) || profileData.discord,
    })

    setIsEditing(false)
  }

  // Sample activity data
  const activities = [
    {
      id: 1,
      type: "mint",
      title: "Minted Reward NFT",
      date: "2023-09-15",
      description: "Successfully minted a new NFT",
    },
    {
      id: 2,
      type: "reward",
      title: "Earned 50 Points",
      date: "2023-10-05",
      description: "Completed daily login quest",
    },
    {
      id: 3,
      type: "referral",
      title: "New Referral",
      date: "2023-10-12",
      description: "User0x5f joined using your referral link",
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">View your NFTs, wallet information, and activity</p>
        </div>

        {!connected ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>Connect your wallet to view your profile information and NFTs</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <WalletConnectButton size="lg" />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="nfts">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="nfts">My NFTs</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="nfts" className="mt-6">
              <SimplifiedNftGallery />
            </TabsContent>
            <TabsContent value="wallet" className="mt-6">
              <ProfileWalletInfo />
            </TabsContent>
            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent transactions and platform activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">No recent activity to display</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
