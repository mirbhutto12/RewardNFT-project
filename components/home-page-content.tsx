"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Check, ArrowRight, Users, Award, Wallet } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import { Footer } from "@/components/footer"

export function HomePageContent() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFA500] via-[#FF5555] to-[#00C2FF]">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full py-4 px-6 transition-all duration-300 ${
          isScrolled ? "bg-black/30 backdrop-blur-md" : "bg-transparent"
        }`}
      >
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
            <Link href="/leaderboard" className="text-white hover:text-white/80 transition-colors">
              Leaderboard
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="hidden sm:flex border-white/30 text-white hover:bg-white/10">
              <Link href="/profile">My Profile</Link>
            </Button>
            <Button asChild className="bg-white hover:bg-white/90 text-black">
              <Link href="/mint">Connect Wallet</Link>
            </Button>
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-36 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Mint, Refer, <br />
                <span className="text-[#00FFE0]">Earn Rewards</span>
              </h1>
              <p className="text-xl text-white/90 max-w-lg">
                Mint your exclusive identity NFT, refer friends, complete quests, and earn real USDC rewards on the
                Solana blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white hover:bg-white/90 text-black text-lg px-8">
                  <Link href="/mint">
                    Mint Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-lg px-8"
                >
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">Solana-based</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">Earn USDC</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white">Low Fees</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-72 md:w-96 aspect-square rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/images/mint-nft-box.png"
                    alt="NFT Preview"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md rounded-xl p-4 text-center">
                  <p className="text-white font-semibold">Exclusive Identity NFT</p>
                  <p className="text-white/80 text-sm">Mint Price: 10 USDC</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#FF2E63] opacity-30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-[#00FFE0] opacity-20 rounded-full blur-3xl -z-10" />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              A simple three-step process to start earning rewards on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 hover:transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">1. Mint Your NFT</h3>
              <p className="text-white/80">
                Connect your Solana wallet and mint your exclusive identity NFT for 10 USDC. Each wallet can mint only
                one NFT.
              </p>
              <Link href="/mint" className="inline-flex items-center text-[#00FFE0] mt-4 hover:underline">
                Mint Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 hover:transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2. Refer Friends</h3>
              <p className="text-white/80">
                Share your unique referral link with friends. Earn 4 USDC for each friend who mints an NFT using your
                link.
              </p>
              <Link href="/referrals" className="inline-flex items-center text-[#00FFE0] mt-4 hover:underline">
                View Referrals <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 hover:transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">3. Complete Quests</h3>
              <p className="text-white/80">
                Participate in various quests to earn additional USDC rewards and climb the leaderboard rankings.
              </p>
              <Link href="/quests" className="inline-flex items-center text-[#00FFE0] mt-4 hover:underline">
                View Quests <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#121212]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Platform Features</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Explore the key features of the Reward NFT platform
            </p>
          </div>

          <Tabs defaultValue="nft" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white/10 border border-white/20">
                <TabsTrigger value="nft" className="data-[state=active]:bg-white/20 text-white">
                  NFT Minting
                </TabsTrigger>
                <TabsTrigger value="referrals" className="data-[state=active]:bg-white/20 text-white">
                  Referral System
                </TabsTrigger>
                <TabsTrigger value="quests" className="data-[state=active]:bg-white/20 text-white">
                  Quests
                </TabsTrigger>
                <TabsTrigger value="rewards" className="data-[state=active]:bg-white/20 text-white">
                  Rewards
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="nft" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <h3 className="text-3xl font-bold text-white mb-4">Exclusive Identity NFT</h3>
                  <p className="text-white/80 mb-6">
                    Mint your unique identity NFT on the Solana blockchain. Each wallet can only mint one NFT, making it
                    a truly exclusive item in your collection.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Powered by Solana for low gas fees",
                      "Mint price: 10 USDC per NFT",
                      "Limited to one NFT per wallet",
                      "Unlocks access to the referral system",
                      "Exclusive identity representation",
                      "Future utility and benefits",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="bg-[#00FFE0]/20 rounded-full p-1 mt-1">
                          <Check className="h-3 w-3 text-[#00FFE0]" />
                        </div>
                        <span className="text-white/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-8 bg-white hover:bg-white/90 text-black">
                    <Link href="/mint">Mint Your NFT</Link>
                  </Button>
                </div>
                <div className="order-1 lg:order-2 flex justify-center">
                  <div className="relative w-64 md:w-80 aspect-square">
                    <Image src="/images/mint-nft-box.png" alt="NFT Preview" fill className="object-contain" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="referrals" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <h3 className="text-3xl font-bold text-white mb-4">Powerful Referral System</h3>
                  <p className="text-white/80 mb-6">
                    Share your unique referral link with friends and earn real USDC rewards for each successful mint
                    through your link.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Earn 4 USDC per successful referral",
                      "Track your referral statistics in real-time",
                      "Unique referral link for each user",
                      "Compete on the referral leaderboard",
                      "Automatic reward distribution",
                      "No limit on the number of referrals",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="bg-[#FF5555]/20 rounded-full p-1 mt-1">
                          <Check className="h-3 w-3 text-[#FF5555]" />
                        </div>
                        <span className="text-white/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-8 bg-white hover:bg-white/90 text-black">
                    <Link href="/referrals">View Referral System</Link>
                  </Button>
                </div>
                <div className="order-1 lg:order-2">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8">
                    <h4 className="text-xl font-bold text-white mb-4">Sample Referral Dashboard</h4>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-white/60 text-sm">Your Referral Link</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="bg-black/20 rounded p-2 text-white text-sm truncate flex-1">
                            https://rewardnft.com/ref/0x123...
                          </div>
                          <Button variant="ghost" size="sm" className="text-white">
                            Copy
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-white">12</p>
                          <p className="text-white/60 text-sm">Total Referrals</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                          <p className="text-2xl font-bold text-white">48</p>
                          <p className="text-white/60 text-sm">USDC Earned</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quests" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">Engaging Quest System</h3>
                  <p className="text-white/80 mb-6">
                    Complete exciting quests to earn additional USDC rewards and climb the leaderboard rankings.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Daily and weekly quests available",
                      "Earn USDC for completing quests",
                      "Track your progress in real-time",
                      "Various difficulty levels",
                      "Community challenges and events",
                      "Seasonal special quests with bonus rewards",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="bg-[#FFA500]/20 rounded-full p-1 mt-1">
                          <Check className="h-3 w-3 text-[#FFA500]" />
                        </div>
                        <span className="text-white/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-8 bg-white hover:bg-white/90 text-black">
                    <Link href="/quests">Explore Quests</Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-white">Daily Check-in</h4>
                      <span className="bg-[#00FFE0]/20 text-[#00FFE0] text-xs rounded-full px-2 py-1">Easy</span>
                    </div>
                    <p className="text-white/80 mb-4">Check in daily to earn points and USDC rewards.</p>
                    <div className="bg-white/10 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Progress</span>
                        <span className="text-white text-sm">4/7 days</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div className="bg-[#00FFE0] h-2 rounded-full" style={{ width: "57%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Reward:</span>
                      <span className="text-white font-medium">0.5 USDC</span>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-white">Refer 5 Friends</h4>
                      <span className="bg-[#FF5555]/20 text-[#FF5555] text-xs rounded-full px-2 py-1">Medium</span>
                    </div>
                    <p className="text-white/80 mb-4">Refer 5 friends who mint an NFT.</p>
                    <div className="bg-white/10 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Progress</span>
                        <span className="text-white text-sm">3/5 referrals</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div className="bg-[#FF5555] h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Reward:</span>
                      <span className="text-white font-medium">5 USDC</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-4">Real USDC Rewards</h3>
                  <p className="text-white/80 mb-6">
                    Earn real USDC rewards through referrals, quests, and other platform activities.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "4 USDC per successful referral",
                      "Various USDC rewards for completing quests",
                      "Bonus rewards for top leaderboard positions",
                      "Daily check-in rewards",
                      "Automatic rewards distribution",
                      "Withdraw to your Solana wallet anytime",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="bg-[#00C2FF]/20 rounded-full p-1 mt-1">
                          <Check className="h-3 w-3 text-[#00C2FF]" />
                        </div>
                        <span className="text-white/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-8 bg-white hover:bg-white/90 text-black">
                    <Link href="/profile">View Your Rewards</Link>
                  </Button>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8">
                  <h4 className="text-xl font-bold text-white mb-6">Earnings Simulation</h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Referrals (10)</span>
                        <span className="text-white font-medium">40 USDC</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-[#FF5555] h-2 rounded-full" style={{ width: "40%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Daily Quests (30 days)</span>
                        <span className="text-white font-medium">15 USDC</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-[#00FFE0] h-2 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Weekly Challenges (4)</span>
                        <span className="text-white font-medium">20 USDC</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-[#FFA500] h-2 rounded-full" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white">Leaderboard Bonus</span>
                        <span className="text-white font-medium">25 USDC</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-[#00C2FF] h-2 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    <div className="border-t border-white/20 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">Total Potential Earnings</span>
                        <span className="text-white text-xl font-bold">100 USDC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Mint your exclusive NFT today, refer friends, complete quests, and start earning real USDC rewards on the
            Solana blockchain.
          </p>
          <Button asChild size="lg" className="bg-white hover:bg-white/90 text-black text-lg px-10">
            <Link href="/mint">Get Started Now</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
