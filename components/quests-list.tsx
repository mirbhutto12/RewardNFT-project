import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import type { Quest } from "@/types/database"

async function getActiveQuests() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase
    .from("quests")
    .select("*")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(5)

  return data || []
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-500/20 text-green-300"
    case "medium":
      return "bg-yellow-500/20 text-yellow-300"
    case "hard":
      return "bg-orange-500/20 text-orange-300"
    case "legendary":
      return "bg-purple-500/20 text-purple-300"
    default:
      return "bg-blue-500/20 text-blue-300"
  }
}

export async function QuestsList() {
  const quests = await getActiveQuests()

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">Active Quests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quests.map((quest: Quest) => (
            <div key={quest.id} className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium">{quest.title}</h3>
                <Badge className={getDifficultyColor(quest.difficulty)}>{quest.difficulty}</Badge>
              </div>
              <p className="text-white/60 text-sm mb-3">{quest.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">
                  {quest.requirement_count} {quest.requirement_type}
                </span>
                <span className="text-white font-medium">
                  {quest.reward_amount} {quest.reward_currency}
                </span>
              </div>
            </div>
          ))}

          {quests.length === 0 && (
            <div className="text-center py-6">
              <p className="text-white/60">No active quests available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
