"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MobileNav } from "@/components/mobile-nav"
import { SocialShare } from "@/components/social-share"
import { ReferralHistory } from "@/components/referral-history"

export function ReferralsPageContent() {
  const [copied, setCopied] = useState(false)
  const referralLink = "https://rewardnft.com/ref123"

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const leaderboardData = [
    { address: "0xfd5....b3c4", points: 1840, color: "bg-cyan-500" },
    { address: "0x124...64f9", points: 1570, color: "bg-green-500" },
    { address: "0x54a...2b7d", points: 1320, color: "bg-blue-600" },
    { address: "0x3b2...c9e0", points: 1140, color: "bg-yellow-500" },
    { address: "0x9f1...e3a8", points: 980, color: "bg-orange-500" },
  ]

  const recentReferrals = [
    { address: "0xa12...45f6", date: "2 days ago", status: "completed" as const, points: 10 },
    { address: "0xb23...56g7", date: "5 days ago", status: "completed" as const, points: 10 },
    { address: "0xc34...67h8", date: "1 week ago", status: "pending" as const, points: 10 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00C2FF] via-[#8A76FF] to-[#FF2E63] p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
        {/* Header */}
        <header className="w-full py-4 px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-white font-bold text-xl">RewardNFT</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/mint" className="text-white font-medium hover:text-white/80 transition-colors">
              Mint NFT
            </Link>
            <Link href="/airdrop" className="text-white font-medium hover:text-white/80 transition-colors">
              Airdrop
            </Link>
            <Link href="/quests" className="text-white font-medium hover:text-white/80 transition-colors">
              Quests
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6">Connect Wallet</Button>
            <MobileNav />
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Referrals */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold text-white">Referrals</h1>

              {/* Referral Link */}
              <div className="space-y-2">
                <h2 className="text-xl text-white">Referral link</h2>
                <div className="flex items-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-l-lg border border-white/20 py-3 px-4 flex-1 text-white overflow-hidden text-ellipsis">
                    {referralLink}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="bg-white/10 backdrop-blur-sm rounded-r-lg border-t border-r border-b border-white/20 py-3 px-4 text-white hover:bg-white/20 transition-colors"
                  >
                    {copied ? <Check className="h-5 w-5" /> : <span>Copy</span>}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-white">126</p>
                  <p className="text-white/80">Total Points</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-white">15</p>
                  <p className="text-white/80">Referred Users</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-bold text-white">2 USDC</p>
                  <p className="text-white/80">per referral</p>
                </div>
              </div>

              {/* Invite Friends Button */}
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6 rounded-lg">
                Invite Friends
              </Button>

              {/* Referral History */}
              <ReferralHistory referrals={recentReferrals} />

              {/* Quests Section */}
              <div className="space-y-4 pt-4">
                <h2 className="text-5xl font-bold text-white">Quests</h2>
                <p className="text-white/80 text-lg">Complete quests to earn points</p>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6 rounded-lg">
                  View
                </Button>
              </div>
            </div>

            {/* Right Column - Leaderboard */}
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold text-white">Leaderboard</h2>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 space-y-4">
                {leaderboardData.map((user, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Avatar className={`${user.color} h-10 w-10`}>
                        <AvatarFallback className="text-white">{index + 1}</AvatarFallback>
                      </Avatar>
                      <span className="text-white font-medium">{user.address}</span>
                    </div>
                    <span className="text-white font-bold text-xl">{user.points.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Social Share */}
              <SocialShare referralLink={referralLink} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
