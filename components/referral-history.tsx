"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ExternalLink } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { getReferralsByReferrer, type Referral } from "@/services/referral-service"

export function ReferralHistory() {
  const { connected, publicKey, explorerUrl } = useWallet()
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState<Referral[]>([])

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!connected || !publicKey) return

      setLoading(true)
      try {
        const walletAddress = publicKey.toString()
        const referralData = await getReferralsByReferrer(walletAddress)
        setReferrals(referralData)
      } catch (error) {
        console.error("Error fetching referrals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferrals()
  }, [connected, publicKey])

  if (!connected) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="pt-6">
          <p className="text-center text-white/60">Connect your wallet to view your referral history</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="pt-6 flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (referrals.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="pt-6">
          <p className="text-center text-white/60">You haven't referred anyone yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Referral History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="p-4 bg-white/5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium">
                    {referral.referredWallet
                      ? `${referral.referredWallet.substring(0, 6)}...${referral.referredWallet.substring(
                          referral.referredWallet.length - 4,
                        )}`
                      : "Pending"}
                  </p>
                  <Badge
                    className={`${
                      referral.status === "completed"
                        ? "bg-green-500/20 text-green-300"
                        : referral.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {referral.status === "completed"
                      ? "Completed"
                      : referral.status === "pending"
                        ? "Pending"
                        : "Failed"}
                  </Badge>
                </div>
                <p className="text-white/60 text-sm">
                  {new Date(referral.createdAt).toLocaleDateString()} at{" "}
                  {new Date(referral.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {referral.rewardAmount && <p className="text-white font-medium">{referral.rewardAmount} USDC</p>}
                {referral.transactionId && (
                  <a
                    href={`${explorerUrl}/tx/${referral.transactionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="hidden sm:inline">View Transaction</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
