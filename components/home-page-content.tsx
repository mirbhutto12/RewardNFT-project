"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context" // Assuming you might want to use wallet state
import { ArrowRight, Gift, Users, Zap } from "lucide-react"

export function HomePageContent() {
  const { connected, publicKey } = useWallet()

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-20">
      {/* Hero Section */}
      <section className="w-full max-w-4xl px-4">
        <Image
          src="/images/logo.png" // Replace with a more prominent hero image if you have one
          alt="Reward NFT Platform Hero"
          width={128}
          height={128}
          className="mx-auto mb-8 rounded-2xl shadow-lg border-2 border-theme-dark-primary"
          priority
        />
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-theme-dark-primary via-theme-dark-secondary to-theme-dark-primary">
            Reward NFT Platform
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-theme-dark-text-secondary max-w-2xl mx-auto">
          Mint exclusive NFTs, refer friends, complete quests, and earn USDC rewards directly on the Solana blockchain.
          Your journey to digital ownership and earnings starts here.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-theme-dark-primary hover:bg-theme-dark-primary-hover text-black font-semibold px-8 py-3"
          >
            <Link href="/mint">
              Mint Your NFT <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-theme-dark-secondary text-theme-dark-secondary hover:bg-theme-dark-secondary/10 hover:text-theme-dark-secondary font-semibold px-8 py-3"
          >
            <Link href="/referrals">
              Explore Rewards <Gift className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        {connected && publicKey && (
          <p className="mt-8 text-sm text-theme-dark-text-secondary">
            Welcome back, {publicKey.toBase58().substring(0, 4)}...
            {publicKey.toBase58().substring(publicKey.toBase58().length - 4)}!
          </p>
        )}
      </section>

      {/* Features Section */}
      <section className="w-full mt-20 md:mt-32 py-16 bg-theme-dark-surface border-y border-theme-dark-border">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 text-theme-dark-text-primary">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center p-6 bg-background rounded-xl shadow-md border border-theme-dark-border/50">
              <div className="p-4 bg-theme-dark-primary/20 rounded-full mb-4">
                <Zap size={32} className="text-theme-dark-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-theme-dark-text-primary">1. Mint Exclusive NFTs</h3>
              <p className="text-theme-dark-text-secondary text-center">
                Secure your unique digital identity and unlock platform benefits by minting our special Reward NFTs.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-background rounded-xl shadow-md border border-theme-dark-border/50">
              <div className="p-4 bg-theme-dark-secondary/20 rounded-full mb-4">
                <Users size={32} className="text-theme-dark-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-theme-dark-text-primary">2. Refer & Earn</h3>
              <p className="text-theme-dark-text-secondary text-center">
                Share your unique referral link. Earn USDC rewards for every friend who mints an NFT through you.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-background rounded-xl shadow-md border border-theme-dark-border/50">
              <div className="p-4 bg-theme-dark-primary/20 rounded-full mb-4">
                <Gift size={32} className="text-theme-dark-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-theme-dark-text-primary">3. Complete Quests</h3>
              <p className="text-theme-dark-text-secondary text-center">
                Engage with the platform, complete daily and special quests, and accumulate more USDC rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full mt-20 md:mt-32 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold text-theme-dark-text-primary mb-6">Ready to Join the Revolution?</h2>
          <p className="text-lg text-theme-dark-text-secondary max-w-xl mx-auto mb-8">
            Become a part of our growing community. Mint, refer, complete quests, and start earning today!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-theme-dark-primary to-theme-dark-secondary hover:opacity-90 text-black font-bold px-10 py-4 text-lg"
          >
            <Link href={connected ? "/profile" : "/mint"}>{connected ? "Go to My Profile" : "Get Started Now"}</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
