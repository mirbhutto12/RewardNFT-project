import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { verifySignature } from "@/lib/auth-utils"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, message, signature } = await request.json()

    // Verify the signature
    const isValid = await verifySignature(message, signature, walletAddress)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Create a server-side Supabase client
    const supabase = createServerSupabaseClient()

    // Check if user exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("wallet_address", walletAddress).single()

    if (!existingUser) {
      // Create a new user if they don't exist
      await supabase.from("users").insert([
        {
          wallet_address: walletAddress,
          role: "user", // Default role for new users
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
    }

    // Get the user data (including role)
    const { data: userData } = await supabase.from("users").select("*").eq("wallet_address", walletAddress).single()

    // Create or get user in Supabase Auth
    const authEmail = `${walletAddress}@phantom.wallet`
    const authPassword = walletAddress // Using wallet address as password

    // Check if user exists in auth
    const { data: authUser, error: getUserError } = await supabase.auth.admin.getUserByEmail(authEmail)

    if (!authUser && !getUserError) {
      // Create user in auth
      await supabase.auth.admin.createUser({
        email: authEmail,
        password: authPassword,
        email_confirm: true,
        user_metadata: {
          wallet_address: walletAddress,
          role: userData.role,
        },
      })
    } else if (authUser) {
      // Update user metadata with current role
      await supabase.auth.admin.updateUserById(authUser.id, {
        user_metadata: {
          wallet_address: walletAddress,
          role: userData.role,
        },
      })
    }

    // Create a session for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
      email: authEmail,
      properties: {
        wallet_address: walletAddress,
        role: userData.role,
      },
    })

    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 500 })
    }

    // Set the session cookie
    cookies().set("sb-access-token", sessionData.session.access_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    cookies().set("sb-refresh-token", sessionData.session.refresh_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    return NextResponse.json({
      user: {
        id: sessionData.user.id,
        walletAddress,
        role: userData.role,
      },
      session: sessionData.session,
    })
  } catch (error: any) {
    console.error("Error in wallet login:", error)
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 })
  }
}
