"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Flame, Check, Trophy, Clock, Calendar } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"

export function QuestsPageContent() {
  const [connected, setConnected] = useState(false)

  const dailyQuests = [
    {
      id: 1,
      title: "Daily Check-in",
      description: "Check in daily to earn points and USDC rewards.",
      difficulty: "Easy",
      difficultyColor: "bg-[#00FFE0]/20 text-[#00FFE0]",
      reward: "0.5 USDC",
      progress: 100,
      completed: true,
      icon: Calendar,
    },
    {
      id: 2,
      title: "Share on Twitter",
      description: "Share your NFT or referral link on Twitter.",
      difficulty: "Easy",
      difficultyColor: "bg-[#00FFE0]/20 text-[#00FFE0]",
      reward: "1 USDC",
      progress: 0,
      completed: false,
      icon: Clock,
    },
  ]

  const weeklyQuests = [
    {
      id: 3,
      title: "Refer 3 Friends",
      description: "Refer 3 friends who mint an NFT.",
      difficulty: "Medium",
      difficultyColor: "bg-[#FF5555]/20 text-[#FF5555]",
      reward: "5 USDC",
      progress: 66,
      progressText: "2/3 referrals",
      completed: false,
      icon: Flame,
    },
    {
      id: 4,
      title: "Complete 5 Daily Quests",
      description: "Complete 5 daily quests this week.",
      difficulty: "Medium",
      difficultyColor: "bg-[#FF5555]/20 text-[#FF5555]",
      reward: "3 USDC",
      progress: 20,
      progressText: "1/5 completed",
      completed: false,
      icon: Calendar,
    },
  ]

  const specialQuests = [
    {
      id: 5,
      title: "Top 10 Referrers",
      description: "End the month in the top 10 referrers on the leaderboard.",
      difficulty: "Hard",
      difficultyColor: "bg-[#FFA500]/20 text-[#FFA500]",
      reward: "25 USDC",
      progress: 40,
      progressText: "Current position: #15",
      completed: false,
      icon: Trophy,
    },
    {
      id: 6,
      title: "Refer 10 Friends",
      description: "Refer a total of 10 friends who mint an NFT.",
      difficulty: "Hard",
      difficultyColor: "bg-[#FFA500]/20 text-[#FFA500]",
      reward: "15 USDC",
      progress: 30,
      progressText: "3/10 referrals",
      completed: false,
      icon: Flame,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFA500] via-[#FF5555] to-[#00C2FF]">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-12 w-12 bg-[#00FFE0] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
            <span className="text-white font-bold text-2xl">Reward NFT</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/mint" className="text-white hover:text-white/80 transition-colors">
              Mint
            </Link>
            <Link href="/referrals" className="text-white hover:text-white/80 transition-colors">
              Referrals
            </Link>
            <Link href="/quests" className="text-white/80 font-medium border-b-2 border-white">
              Quests
            </Link>
            <Link href="/leaderboard" className="text-white hover:text-white/80 transition-colors">
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="hidden sm:flex border-white/30 text-white hover:bg-white/10">
              <Link href="/profile">My Profile</Link>
            </Button>
            <Button
              onClick={() => setConnected(!connected)}
              className={connected ? "bg-white/10 text-white border border-white/30" : "bg-white text-black"}
            >
              {connected ? "Disconnect" : "Connect Wallet"}
            </Button>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">Quests</h1>
              <p className="text-xl text-white/80">Complete quests to earn USDC rewards</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 flex items-center gap-8">
              <div>
                <p className="text-white/60 text-sm">Total Earned</p>
                <p className="text-2xl font-bold text-white">12.5 USDC</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Quests Completed</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </div>

          {connected ? (
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="bg-white/10 border border-white/20 mb-8">
                <TabsTrigger value="daily" className="data-[state=active]:bg-white/20 text-white">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" className="data-[state=active]:bg-white/20 text-white">
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="special" className="data-[state=active]:bg-white/20 text-white">
                  Special
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-white/20 text-white">
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="daily" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dailyQuests.map((quest) => (
                    <div
                      key={quest.id}
                      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:border-white/40 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-white/10 rounded-full p-3">
                          <quest.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-white">{quest.title}</h3>
                            <span className={`${quest.difficultyColor} text-xs font-medium rounded-full px-2 py-1`}>
                              {quest.difficulty}
                            </span>
                          </div>
                          <p className="text-white/80 mt-1 mb-4">{quest.description}</p>

                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white/60 text-sm">Progress</span>
                                <span className="text-white text-sm">
                                  {quest.progressText || (quest.completed ? "Completed" : "Not started")}
                                </span>
                              </div>
                              <Progress
                                value={quest.progress}
                                className="h-2 bg-white/10"
                                barClassName={quest.completed ? "bg-green-500" : ""}
                              />
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-white/60 text-sm">Reward</span>
                                <p className="text-white font-medium">{quest.reward}</p>
                              </div>

                              {quest.completed ? (
                                <div className="bg-green-500/20 text-green-400 rounded-full px-3 py-1 text-sm flex items-center">
                                  <Check className="h-4 w-4 mr-1" /> Completed
                                </div>
                              ) : (
                                <Button size="sm">Complete Quest</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="weekly" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {weeklyQuests.map((quest) => (
                    <div
                      key={quest.id}
                      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:border-white/40 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-white/10 rounded-full p-3">
                          <quest.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-white">{quest.title}</h3>
                            <span className={`${quest.difficultyColor} text-xs font-medium rounded-full px-2 py-1`}>
                              {quest.difficulty}
                            </span>
                          </div>
                          <p className="text-white/80 mt-1 mb-4">{quest.description}</p>

                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white/60 text-sm">Progress</span>
                                <span className="text-white text-sm">{quest.progressText}</span>
                              </div>
                              <Progress value={quest.progress} className="h-2 bg-white/10" />
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-white/60 text-sm">Reward</span>
                                <p className="text-white font-medium">{quest.reward}</p>
                              </div>

                              <Button size="sm" disabled={quest.progress < 100}>
                                {quest.progress < 100 ? "In Progress" : "Claim Reward"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="special" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {specialQuests.map((quest) => (
                    <div
                      key={quest.id}
                      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:border-white/40 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-white/10 rounded-full p-3">
                          <quest.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-white">{quest.title}</h3>
                            <span className={`${quest.difficultyColor} text-xs font-medium rounded-full px-2 py-1`}>
                              {quest.difficulty}
                            </span>
                          </div>
                          <p className="text-white/80 mt-1 mb-4">{quest.description}</p>

                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white/60 text-sm">Progress</span>
                                <span className="text-white text-sm">{quest.progressText}</span>
                              </div>
                              <Progress value={quest.progress} className="h-2 bg-white/10" />
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-white/60 text-sm">Reward</span>
                                <p className="text-white font-medium">{quest.reward}</p>
                              </div>

                              <Button size="sm" disabled>
                                In Progress
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Completed Quests</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-500/20 rounded-full p-2">
                          <Check className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">Daily Check-in</h3>
                          <p className="text-white/60 text-sm">Completed on May 5, 2023</p>
                        </div>
                      </div>
                      <span className="text-white font-medium">0.5 USDC</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-500/20 rounded-full p-2">
                          <Check className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">Share on Twitter</h3>
                          <p className="text-white/60 text-sm">Completed on May 4, 2023</p>
                        </div>
                      </div>
                      <span className="text-white font-medium">1 USDC</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-500/20 rounded-full p-2">
                          <Check className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">Daily Check-in</h3>
                          <p className="text-white/60 text-sm">Completed on May 4, 2023</p>
                        </div>
                      </div>
                      <span className="text-white font-medium">0.5 USDC</span>
                    </div>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-green-500/20 rounded-full p-2">
                          <Check className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">Invite 3 Friends</h3>
                          <p className="text-white/60 text-sm">Completed on May 2, 2023</p>
                        </div>
                      </div>
                      <span className="text-white font-medium">5 USDC</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    View All Completed Quests
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet to Access Quests</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Mint your exclusive NFT and connect your wallet to access quests and start earning USDC rewards.
              </p>
              <Button size="lg" className="bg-white hover:bg-white/90 text-black">
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
