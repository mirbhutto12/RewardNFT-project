import { supabase, createServerSupabaseClient } from "@/lib/supabase"

export interface UserProfile {
  id: string
  walletAddress: string
  username: string | null
  email: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

// Get or create a user by wallet address
export async function getOrCreateUser(walletAddress: string): Promise<UserProfile | null> {
  try {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching user:", fetchError)
      return null
    }

    if (existingUser) {
      return {
        id: existingUser.id,
        walletAddress: existingUser.wallet_address,
        username: existingUser.username,
        email: existingUser.email,
        avatarUrl: existingUser.avatar_url,
        createdAt: existingUser.created_at,
        updatedAt: existingUser.updated_at,
      }
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ wallet_address: walletAddress }])
      .select()
      .single()

    if (insertError) {
      console.error("Error creating user:", insertError)
      return null
    }

    return {
      id: newUser.id,
      walletAddress: newUser.wallet_address,
      username: newUser.username,
      email: newUser.email,
      avatarUrl: newUser.avatar_url,
      createdAt: newUser.created_at,
      updatedAt: newUser.updated_at,
    }
  } catch (error) {
    console.error("Unexpected error in getOrCreateUser:", error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: { username?: string; email?: string; avatarUrl?: string },
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({
        username: updates.username,
        email: updates.email,
        avatar_url: updates.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating user profile:", error)
      return null
    }

    return {
      id: data.id,
      walletAddress: data.wallet_address,
      username: data.username,
      email: data.email,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error("Unexpected error in updateUserProfile:", error)
    return null
  }
}

// Get user by wallet address (server-side)
export async function getUserByWalletAddress(walletAddress: string): Promise<UserProfile | null> {
  try {
    const serverSupabase = createServerSupabaseClient()
    const { data, error } = await serverSupabase.from("users").select("*").eq("wallet_address", walletAddress).single()

    if (error) {
      console.error("Error fetching user by wallet address:", error)
      return null
    }

    return {
      id: data.id,
      walletAddress: data.wallet_address,
      username: data.username,
      email: data.email,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error("Unexpected error in getUserByWalletAddress:", error)
    return null
  }
}

// Verify a wallet signature to authenticate a user
export async function verifyWalletSignature(
  walletAddress: string,
  message: string,
  signature: string,
): Promise<boolean> {
  try {
    // In a real implementation, you would verify the signature here
    // For now, we'll just return true for demonstration purposes
    return true
  } catch (error) {
    console.error("Error verifying wallet signature:", error)
    return false
  }
}
