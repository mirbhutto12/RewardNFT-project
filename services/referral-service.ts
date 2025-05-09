import { supabase } from "@/lib/supabase"
import { updateLeaderboardEntry } from "./leaderboard-service"

export interface Referral {
  id: string
  referrerWallet: string | null
  referredWallet: string | null
  referralCode: string
  status: string
  rewardAmount: number | null
  transactionId: string | null
  createdAt: string
  updatedAt: string
}

// Generate a unique referral code
export function generateReferralCode(walletAddress: string): string {
  // Take the first 4 and last 4 characters of the wallet address
  const prefix = walletAddress.substring(0, 4)
  const suffix = walletAddress.substring(walletAddress.length - 4)

  // Add a timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36).substring(4, 8)

  return `${prefix}${timestamp}${suffix}`.toLowerCase()
}

// Create a referral code for a wallet
export async function createReferralCode(walletAddress: string): Promise<string | null> {
  try {
    // Check if wallet already has a referral code
    const { data: existingReferrals, error: fetchError } = await supabase
      .from("referrals")
      .select("referral_code")
      .eq("referrer_wallet", walletAddress)
      .limit(1)

    if (fetchError) {
      console.error("Error checking existing referral codes:", fetchError)
      return null
    }

    if (existingReferrals.length > 0) {
      return existingReferrals[0].referral_code
    }

    // Generate a new referral code
    const referralCode = generateReferralCode(walletAddress)

    // Store the referral code
    const { error: insertError } = await supabase.from("referrals").insert([
      {
        referrer_wallet: walletAddress,
        referral_code: referralCode,
        status: "active",
      },
    ])

    if (insertError) {
      console.error("Error creating referral code:", insertError)
      return null
    }

    return referralCode
  } catch (error) {
    console.error("Unexpected error in createReferralCode:", error)
    return null
  }
}

// Get referral by code
export async function getReferralByCode(referralCode: string): Promise<Referral | null> {
  try {
    const { data, error } = await supabase
      .from("referrals")
      .select("*")
      .eq("referral_code", referralCode)
      .eq("status", "active")
      .single()

    if (error) {
      console.error("Error fetching referral by code:", error)
      return null
    }

    return {
      id: data.id,
      referrerWallet: data.referrer_wallet,
      referredWallet: data.referred_wallet,
      referralCode: data.referral_code,
      status: data.status,
      rewardAmount: data.reward_amount,
      transactionId: data.transaction_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error("Unexpected error in getReferralByCode:", error)
    return null
  }
}

// Track a new referral
export async function trackReferral(referralCode: string, newWalletAddress: string): Promise<boolean> {
  try {
    // Get the referral
    const referral = await getReferralByCode(referralCode)
    if (!referral || !referral.referrerWallet) {
      return false
    }

    // Check if this wallet has already been referred
    const { data: existingReferrals, error: checkError } = await supabase
      .from("referrals")
      .select("id")
      .eq("referral_code", referralCode)
      .eq("referred_wallet", newWalletAddress)

    if (checkError) {
      console.error("Error checking existing referrals:", checkError)
      return false
    }

    if (existingReferrals.length > 0) {
      return false // Already referred
    }

    // Create a new referral record
    const { error: insertError } = await supabase.from("referrals").insert([
      {
        referrer_wallet: referral.referrerWallet,
        referred_wallet: newWalletAddress,
        referral_code: referralCode,
        status: "pending",
      },
    ])

    if (insertError) {
      console.error("Error tracking referral:", insertError)
      return false
    }

    // Update the referrer's leaderboard entry
    const { data: referrerReferrals, error: countError } = await supabase
      .from("referrals")
      .select("id")
      .eq("referrer_wallet", referral.referrerWallet)
      .neq("referred_wallet", null)

    if (countError) {
      console.error("Error counting referrals:", countError)
    } else {
      const referralCount = referrerReferrals.length
      await updateLeaderboardEntry({
        walletAddress: referral.referrerWallet,
        referralCount,
        totalPoints: referralCount * 10, // 10 points per referral
      })
    }

    return true
  } catch (error) {
    console.error("Unexpected error in trackReferral:", error)
    return false
  }
}

// Process referral payment
export async function processReferralPayment(
  referralId: string,
  rewardAmount: number,
  transactionId: string,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("referrals")
      .update({
        status: "completed",
        reward_amount: rewardAmount,
        transaction_id: transactionId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", referralId)

    if (error) {
      console.error("Error processing referral payment:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error in processReferralPayment:", error)
    return false
  }
}

// Get referrals by referrer wallet
export async function getReferralsByReferrer(referrerWallet: string): Promise<Referral[]> {
  try {
    const { data, error } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_wallet", referrerWallet)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching referrals by referrer:", error)
      return []
    }

    return data.map((referral) => ({
      id: referral.id,
      referrerWallet: referral.referrer_wallet,
      referredWallet: referral.referred_wallet,
      referralCode: referral.referral_code,
      status: referral.status,
      rewardAmount: referral.reward_amount,
      transactionId: referral.transaction_id,
      createdAt: referral.created_at,
      updatedAt: referral.updated_at,
    }))
  } catch (error) {
    console.error("Unexpected error in getReferralsByReferrer:", error)
    return []
  }
}

// Get referral link for a wallet
export function getReferralLink(referralCode: string): string {
  return `${typeof window !== "undefined" ? window.location.origin : "https://rewardnft.com"}/mint?ref=${referralCode}`
}
