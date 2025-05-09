import { supabase, createServerSupabaseClient } from "@/lib/supabase"

export interface LeaderboardEntry {
  id: string
  userId: string | null
  walletAddress: string | null
  totalPoints: number
  referralCount: number
  questCount: number
  mintCount: number
  rank: number | null
  lastUpdated: string
}

// Get leaderboard entries
export async function getLeaderboard(
  limit = 10,
  offset = 0,
  sortBy: "total_points" | "referral_count" | "quest_count" | "mint_count" = "total_points",
): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select(`
        id,
        user_id,
        wallet_address,
        total_points,
        referral_count,
        quest_count,
        mint_count,
        rank,
        last_updated,
        users (username, avatar_url)
      `)
      .order(sortBy, { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching leaderboard:", error)
      return []
    }

    return data.map((entry) => ({
      id: entry.id,
      userId: entry.user_id,
      walletAddress: entry.wallet_address,
      totalPoints: entry.total_points,
      referralCount: entry.referral_count,
      questCount: entry.quest_count,
      mintCount: entry.mint_count,
      rank: entry.rank,
      lastUpdated: entry.last_updated,
    }))
  } catch (error) {
    console.error("Unexpected error in getLeaderboard:", error)
    return []
  }
}

// Get user's leaderboard position
export async function getUserLeaderboardPosition(walletAddress: string): Promise<LeaderboardEntry | null> {
  try {
    const { data, error } = await supabase.from("leaderboard").select("*").eq("wallet_address", walletAddress).single()

    if (error) {
      console.error("Error fetching user leaderboard position:", error)
      return null
    }

    return {
      id: data.id,
      userId: data.user_id,
      walletAddress: data.wallet_address,
      totalPoints: data.total_points,
      referralCount: data.referral_count,
      questCount: data.quest_count,
      mintCount: data.mint_count,
      rank: data.rank,
      lastUpdated: data.last_updated,
    }
  } catch (error) {
    console.error("Unexpected error in getUserLeaderboardPosition:", error)
    return null
  }
}

// Update or create leaderboard entry
export async function updateLeaderboardEntry(entry: {
  walletAddress: string
  userId?: string
  totalPoints?: number
  referralCount?: number
  questCount?: number
  mintCount?: number
}): Promise<LeaderboardEntry | null> {
  try {
    // Check if entry exists
    const { data: existingEntry, error: fetchError } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("wallet_address", entry.walletAddress)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching leaderboard entry:", fetchError)
      return null
    }

    if (existingEntry) {
      // Update existing entry
      const { data, error } = await supabase
        .from("leaderboard")
        .update({
          user_id: entry.userId || existingEntry.user_id,
          total_points: entry.totalPoints !== undefined ? entry.totalPoints : existingEntry.total_points,
          referral_count: entry.referralCount !== undefined ? entry.referralCount : existingEntry.referral_count,
          quest_count: entry.questCount !== undefined ? entry.questCount : existingEntry.quest_count,
          mint_count: entry.mintCount !== undefined ? entry.mintCount : existingEntry.mint_count,
          last_updated: new Date().toISOString(),
        })
        .eq("id", existingEntry.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating leaderboard entry:", error)
        return null
      }

      return {
        id: data.id,
        userId: data.user_id,
        walletAddress: data.wallet_address,
        totalPoints: data.total_points,
        referralCount: data.referral_count,
        questCount: data.quest_count,
        mintCount: data.mint_count,
        rank: data.rank,
        lastUpdated: data.last_updated,
      }
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from("leaderboard")
        .insert([
          {
            wallet_address: entry.walletAddress,
            user_id: entry.userId,
            total_points: entry.totalPoints || 0,
            referral_count: entry.referralCount || 0,
            quest_count: entry.questCount || 0,
            mint_count: entry.mintCount || 0,
            last_updated: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        console.error("Error creating leaderboard entry:", error)
        return null
      }

      return {
        id: data.id,
        userId: data.user_id,
        walletAddress: data.wallet_address,
        totalPoints: data.total_points,
        referralCount: data.referral_count,
        questCount: data.quest_count,
        mintCount: data.mint_count,
        rank: data.rank,
        lastUpdated: data.last_updated,
      }
    }
  } catch (error) {
    console.error("Unexpected error in updateLeaderboardEntry:", error)
    return null
  }
}

// Update leaderboard ranks (should be run periodically)
export async function updateLeaderboardRanks(): Promise<boolean> {
  try {
    // This would typically be done with a database function or stored procedure
    // For now, we'll use a simple approach with the service role client
    const serverSupabase = createServerSupabaseClient()

    // Get all entries sorted by total points
    const { data, error } = await serverSupabase
      .from("leaderboard")
      .select("id, total_points")
      .order("total_points", { ascending: false })

    if (error) {
      console.error("Error fetching leaderboard for rank update:", error)
      return false
    }

    // Update ranks
    for (let i = 0; i < data.length; i++) {
      const { error: updateError } = await serverSupabase
        .from("leaderboard")
        .update({ rank: i + 1 })
        .eq("id", data[i].id)

      if (updateError) {
        console.error(`Error updating rank for entry ${data[i].id}:`, updateError)
      }
    }

    return true
  } catch (error) {
    console.error("Unexpected error in updateLeaderboardRanks:", error)
    return false
  }
}
