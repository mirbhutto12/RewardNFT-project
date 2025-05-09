import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy } from "lucide-react"

async function getLeaderboardData() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase
    .from("leaderboard")
    .select(`
      *,
      users:wallet_address (
        username,
        avatar_url
      )
    `)
    .order("rank", { ascending: true })
    .limit(10)

  return data || []
}

export async function LeaderboardTable() {
  const leaderboardData = await getLeaderboardData()

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">Top Performers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/60 py-3 px-4">#</th>
                <th className="text-left text-white/60 py-3 px-4">User</th>
                <th className="text-right text-white/60 py-3 px-4">Points</th>
                <th className="text-right text-white/60 py-3 px-4">Referrals</th>
                <th className="text-right text-white/60 py-3 px-4">Quests</th>
                <th className="text-right text-white/60 py-3 px-4">NFTs</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry: any, index: number) => (
                <tr key={entry.id} className="border-b border-white/10 last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {index < 3 ? (
                        <div className="bg-white/10 rounded-full h-8 w-8 flex items-center justify-center">
                          <Trophy
                            className={`h-4 w-4 ${
                              index === 0 ? "text-yellow-400" : index === 1 ? "text-gray-300" : "text-amber-600"
                            }`}
                          />
                        </div>
                      ) : (
                        <span className="text-white font-medium pl-2">{entry.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500">
                        <AvatarFallback className="text-white">
                          {entry.wallet_address ? entry.wallet_address.substring(0, 1).toUpperCase() : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">
                          {entry.users?.username ||
                            (entry.wallet_address
                              ? `${entry.wallet_address.substring(0, 4)}...${entry.wallet_address.substring(entry.wallet_address.length - 4)}`
                              : "Unknown")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right text-white font-medium py-3 px-4">{entry.total_points}</td>
                  <td className="text-right text-white font-medium py-3 px-4">{entry.referral_count}</td>
                  <td className="text-right text-white font-medium py-3 px-4">{entry.quest_count}</td>
                  <td className="text-right text-white font-medium py-3 px-4">{entry.mint_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
