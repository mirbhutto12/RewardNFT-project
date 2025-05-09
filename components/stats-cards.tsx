import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Users, Award, Gift } from "lucide-react"

async function getStats() {
  const supabase = createServerSupabaseClient()

  // Get user count
  const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true })

  // Get NFT count
  const { count: nftCount } = await supabase.from("nft_metadata").select("*", { count: "exact", head: true })

  // Get completed quests count
  const { count: completedQuestsCount } = await supabase
    .from("user_quests")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")

  // Get total USDC distributed
  const { data: airdropRecipients } = await supabase
    .from("airdrop_recipients")
    .select("amount")
    .eq("status", "completed")

  const totalDistributed = airdropRecipients?.reduce((sum, recipient) => sum + Number(recipient.amount), 0) || 0

  return {
    userCount: userCount || 0,
    nftCount: nftCount || 0,
    completedQuestsCount: completedQuestsCount || 0,
    totalDistributed,
  }
}

export async function StatsCards() {
  const stats = await getStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white text-lg font-medium">Total Users</CardTitle>
          <Users className="h-5 w-5 text-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{stats.userCount}</div>
          <p className="text-white/60 text-sm">Registered wallets</p>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white text-lg font-medium">NFTs Minted</CardTitle>
          <svg className="h-5 w-5 text-white/60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 9H21M9 21V9M7 3H17L21 9L12 20L3 9L7 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{stats.nftCount}</div>
          <p className="text-white/60 text-sm">Total NFTs in collection</p>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white text-lg font-medium">Quests Completed</CardTitle>
          <Award className="h-5 w-5 text-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{stats.completedQuestsCount}</div>
          <p className="text-white/60 text-sm">Total completed quests</p>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white text-lg font-medium">USDC Distributed</CardTitle>
          <Gift className="h-5 w-5 text-white/60" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{stats.totalDistributed.toFixed(2)}</div>
          <p className="text-white/60 text-sm">Total USDC rewards</p>
        </CardContent>
      </Card>
    </div>
  )
}
