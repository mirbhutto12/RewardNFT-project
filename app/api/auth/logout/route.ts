import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    await supabase.auth.signOut()

    // Clear cookies
    cookies().delete("sb-access-token")
    cookies().delete("sb-refresh-token")

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log out" }, { status: 500 })
  }
}
