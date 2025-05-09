import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import type { Referral } from "@/types/database"

async function getRecentReferrals() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase
    .from("referrals")
    .select("*")
    .not("referred_wallet", "is", null)
    .order("created_at", { ascending: false })
    .limit(5)

  return data || []
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-500/20 text-green-300"
    case "pending":
      return "bg-yellow-500/20 text-yellow-300"
    default:
      return "bg-gray-500/20 text-gray-300"
  }
}

export async function RecentReferrals() {
  const referrals = await getRecentReferrals()

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">Recent Referrals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {referrals.map((referral: Referral) => (
            <div key={referral.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">
                    {referral.referrer_wallet
                      ? `${referral.referrer_wallet.substring(0, 4)}...${referral.referrer_wallet.substring(referral.referrer_wallet.length - 4)}`
                      : "Unknown"}
                  </p>
                  <span className="text-white/60">→</span>
                  <p className="text-white font-medium">
                    {referral.referred_wallet
                      ? `${referral.referred_wallet.substring(0, 4)}...${referral.referred_wallet.substring(referral.referred_wallet.length - 4)}`
                      : "Unknown"}
                  </p>
                </div>
                <p className="text-white/60 text-xs mt-1">{formatDate(referral.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(referral.status)}>{referral.status}</Badge>
                {referral.reward_amount && (
                  <span className="text-white font-medium">{referral.reward_amount} USDC</span>
                )}
              </div>
            </div>
          ))}

          {referrals.length === 0 && (
            <div className="text-center py-6">
              <p className="text-white/60">No referrals yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
