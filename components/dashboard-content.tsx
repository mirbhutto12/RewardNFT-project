import { StatsCards } from "@/components/stats-cards"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { QuestsList } from "@/components/quests-list"
import { AirdropsList } from "@/components/airdrops-list"
import { RecentNfts } from "@/components/recent-nfts"
import { RecentReferrals } from "@/components/recent-referrals"

export function DashboardContent() {
  return (
    <div className="space-y-8">
      <StatsCards />

      <LeaderboardTable />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuestsList />
        <AirdropsList />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentNfts />
        <RecentReferrals />
      </div>
    </div>
  )
}
