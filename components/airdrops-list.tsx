import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon } from "lucide-react"
import type { Airdrop } from "@/types/database"

async function getUpcomingAirdrops() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase
    .from("airdrops")
    .select("*")
    .eq("status", "scheduled")
    .gt("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(5)

  return data || []
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export async function AirdropsList() {
  const airdrops = await getUpcomingAirdrops()

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">Upcoming Airdrops</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {airdrops.map((airdrop: Airdrop) => (
            <div key={airdrop.id} className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium">{airdrop.name}</h3>
                <Badge className="bg-blue-500/20 text-blue-300">{airdrop.type}</Badge>
              </div>
              <p className="text-white/60 text-sm mb-3">{airdrop.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-white/80 text-sm">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {formatDate(airdrop.scheduled_at)}
                </div>
                <span className="text-white font-medium">
                  {airdrop.amount} {airdrop.type}
                </span>
              </div>
            </div>
          ))}

          {airdrops.length === 0 && (
            <div className="text-center py-6">
              <p className="text-white/60">No upcoming airdrops scheduled</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
