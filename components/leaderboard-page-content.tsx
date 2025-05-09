"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Trophy, ArrowRight, Loader2 } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"
import { useWallet } from "@/contexts/wallet-context"
import { getLeaderboard, getUserLeaderboardPosition, type LeaderboardEntry } from "@/services/leaderboard-service"

export function LeaderboardPageContent() {
  const { connected, publicKey } = useWallet()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [timeframe, setTimeframe] = useState("weekly")
  const [sortBy, setSortBy] = useState<"total_points" | "referral_count">("total_points")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true)
      try {
        const data = await getLeaderboard(10, 0, sortBy)
        setLeaderboardData(data)

        // Get user's rank if connected
        if (connected && publicKey) {
          const walletAddress = publicKey.toString()
          const userPosition = await getUserLeaderboardPosition(walletAddress)
          setUserRank(userPosition)
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboardData()
  }, [connected, publicKey, sortBy])

  // Filter leaderboard data based on search term
  const filteredLeaderboardData = leaderboardData.filter((entry) =>
    entry.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <Link href="/quests" className="text-white hover:text-white/80 transition-colors">
              Quests
            </Link>
            <Link href="/leaderboard" className="text-white/80 font-medium border-b-2 border-white">
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="hidden sm:flex border-white/30 text-white hover:bg-white/10">
              <Link href="/profile">My Profile</Link>
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
              <h1 className="text-5xl font-bold text-white mb-2">Leaderboard</h1>
              <p className="text-xl text-white/80">See the top performers on the platform</p>
            </div>

            {connected && userRank && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-white/60 text-sm">Your Rank</p>
                    <p className="text-2xl font-bold text-white">#{userRank.rank || "-"}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Your Referrals</p>
                    <p className="text-2xl font-bold text-white">{userRank.referralCount}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Total Points</p>
                    <p className="text-2xl font-bold text-white">{userRank.totalPoints}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center w-full sm:w-auto relative">
              <Input
                type="text"
                placeholder="Search by wallet address"
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="referrals" className="w-full">
            <TabsList className="bg-white/10 border border-white/20 mb-8">
              <TabsTrigger
                value="referrals"
                className="data-[state=active]:bg-white/20 text-white"
                onClick={() => setSortBy("referral_count")}
              >
                Referrals
              </TabsTrigger>
              <TabsTrigger
                value="points"
                className="data-[state=active]:bg-white/20 text-white"
                onClick={() => setSortBy("total_points")}
              >
                Total Points
              </TabsTrigger>
            </TabsList>

            <TabsContent value="referrals" className="mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 sm:p-8">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-white/60 py-4 px-2 sm:px-4">#</th>
                          <th className="text-left text-white/60 py-4 px-2 sm:px-4">User</th>
                          <th className="text-right text-white/60 py-4 px-2 sm:px-4">Referrals</th>
                          <th className="text-right text-white/60 py-4 px-2 sm:px-4">Total Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeaderboardData.map((user, index) => (
                          <tr
                            key={user.id}
                            className={`border-b border-white/10 last:border-0 ${index < 3 ? "bg-white/5" : ""}`}
                          >
                            <td className="py-4 px-2 sm:px-4">
                              <div className="flex items-center">
                                {index < 3 ? (
                                  <div className="bg-white/10 rounded-full h-8 w-8 flex items-center justify-center">
                                    <Trophy
                                      className={`h-4 w-4 ${
                                        index === 0
                                          ? "text-yellow-400"
                                          : index === 1
                                            ? "text-gray-300"
                                            : "text-amber-600"
                                      }`}
                                    />
                                  </div>
                                ) : (
                                  <span className="text-white font-medium pl-2">{index + 1}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-2 sm:px-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500">
                                  <AvatarFallback className="text-white">
                                    {user.walletAddress ? user.walletAddress.substring(0, 1).toUpperCase() : "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-white font-medium">
                                    {user.walletAddress
                                      ? `${user.walletAddress.substring(0, 4)}...${user.walletAddress.substring(user.walletAddress.length - 4)}`
                                      : "Unknown"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="text-right text-white font-medium py-4 px-2 sm:px-4">
                              {user.referralCount}
                            </td>
                            <td className="text-right text-white font-medium py-4 px-2 sm:px-4">{user.totalPoints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-8">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  View All Rankings
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="points" className="mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 sm:p-8">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-white/60 py-4 px-2 sm:px-4">#</th>
                          <th className="text-left text-white/60 py-4 px-2 sm:px-4">User</th>
                          <th className="text-right text-white/60 py-4 px-2 sm:px-4">Total Points</th>
                          <th className="text-right text-white/60 py-4 px-2 sm:px-4">Quests</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeaderboardData.map((user, index) => (
                          <tr
                            key={user.id}
                            className={`border-b border-white/10 last:border-0 ${index < 3 ? "bg-white/5" : ""}`}
                          >
                            <td className="py-4 px-2 sm:px-4">
                              <div className="flex items-center">
                                {index < 3 ? (
                                  <div className="bg-white/10 rounded-full h-8 w-8 flex items-center justify-center">
                                    <Trophy
                                      className={`h-4 w-4 ${
                                        index === 0
                                          ? "text-yellow-400"
                                          : index === 1
                                            ? "text-gray-300"
                                            : "text-amber-600"
                                      }`}
                                    />
                                  </div>
                                ) : (
                                  <span className="text-white font-medium pl-2">{index + 1}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-2 sm:px-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500">
                                  <AvatarFallback className="text-white">
                                    {user.walletAddress ? user.walletAddress.substring(0, 1).toUpperCase() : "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-white font-medium">
                                    {user.walletAddress
                                      ? `${user.walletAddress.substring(0, 4)}...${user.walletAddress.substring(user.walletAddress.length - 4)}`
                                      : "Unknown"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="text-right text-white font-medium py-4 px-2 sm:px-4">{user.totalPoints}</td>
                            <td className="text-right text-white font-medium py-4 px-2 sm:px-4">{user.questCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-8">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  View All Rankings
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Rewards for Top Players */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-6">Rewards for Top Players</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
                <div className="bg-yellow-500/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">1st Place</h3>
                <p className="text-white/80 mb-4">Top referrer of the month</p>
                <p className="text-3xl font-bold text-white mb-2">50 USDC</p>
                <p className="text-white/60 text-sm">Plus exclusive NFT bonus</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
                <div className="bg-gray-500/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">2nd Place</h3>
                <p className="text-white/80 mb-4">Runner-up referrer</p>
                <p className="text-3xl font-bold text-white mb-2">25 USDC</p>
                <p className="text-white/60 text-sm">Plus platform bonus rewards</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
                <div className="bg-amber-700/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">3rd Place</h3>
                <p className="text-white/80 mb-4">Third place referrer</p>
                <p className="text-3xl font-bold text-white mb-2">15 USDC</p>
                <p className="text-white/60 text-sm">Plus platform bonus rewards</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Join the Competition?</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Mint your NFT, start referring friends, and climb the leaderboard to earn USDC rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white hover:bg-white/90 text-black">
                <Link href="/mint">Mint Your NFT</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/referrals">
                  View Referral Program
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
