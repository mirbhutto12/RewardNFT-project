import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

// This script would be run separately to seed the database with initial data
async function seedDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables")
    return
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

  // Seed quests
  const quests = [
    {
      title: "Daily Check-in",
      description: "Check in daily to earn points and USDC rewards.",
      type: "daily",
      difficulty: "Easy",
      reward_amount: 0.5,
      reward_currency: "USDC",
      requirement_type: "daily_check_in",
      requirement_count: 1,
      requirement_data: { type: "check_in" },
      expires_at: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    },
    {
      title: "Share on Twitter",
      description: "Share your NFT or referral link on Twitter.",
      type: "daily",
      difficulty: "Easy",
      reward_amount: 1,
      reward_currency: "USDC",
      requirement_type: "social_share",
      requirement_count: 1,
      requirement_data: { platform: "twitter" },
      expires_at: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
    },
    {
      title: "Refer 3 Friends",
      description: "Refer 3 friends who mint an NFT.",
      type: "weekly",
      difficulty: "Medium",
      reward_amount: 5,
      reward_currency: "USDC",
      requirement_type: "referrals",
      requirement_count: 3,
      requirement_data: { min_referrals: 3 },
      expires_at: getEndOfWeek().toISOString(),
    },
    {
      title: "Complete 5 Daily Quests",
      description: "Complete 5 daily quests this week.",
      type: "weekly",
      difficulty: "Medium",
      reward_amount: 3,
      reward_currency: "USDC",
      requirement_type: "custom",
      requirement_count: 5,
      requirement_data: { quest_type: "daily" },
      expires_at: getEndOfWeek().toISOString(),
    },
    {
      title: "Top 10 Referrers",
      description: "End the month in the top 10 referrers on the leaderboard.",
      type: "special",
      difficulty: "Hard",
      reward_amount: 25,
      reward_currency: "USDC",
      requirement_type: "custom",
      requirement_count: 1,
      requirement_data: { leaderboard_position: 10 },
      expires_at: getEndOfMonth().toISOString(),
    },
  ]

  // Insert quests
  const { error: questsError } = await supabase.from("quests").insert(quests)

  if (questsError) {
    console.error("Error seeding quests:", questsError)
  } else {
    console.log("Successfully seeded quests")
  }

  // Add more seed data as needed
}

// Helper function to get end of week
function getEndOfWeek(): Date {
  const date = new Date()
  const day = date.getDay()
  const diff = day === 0 ? 6 : day - 1 // Adjust for Sunday
  date.setDate(date.getDate() - diff + 7) // Next Monday
  date.setHours(23, 59, 59, 999)
  return date
}

// Helper function to get end of month
function getEndOfMonth(): Date {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  date.setDate(0) // Last day of current month
  date.setHours(23, 59, 59, 999)
  return date
}

// Run the seed function
seedDatabase()
  .then(() => console.log("Database seeding completed"))
  .catch((error) => console.error("Error seeding database:", error))
