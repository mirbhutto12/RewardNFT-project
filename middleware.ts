import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Protected routes that require authentication
const protectedRoutes = ["/profile", "/dashboard", "/mint", "/referrals", "/quests", "/airdrops"]

// Admin-only routes
const adminRoutes = ["/admin"]

export async function middleware(request: NextRequest) {
  // Check if the route is protected or admin-only
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (!isProtectedRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  try {
    // Get the session from the request
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If there's no session and the route is protected or admin-only, redirect to login
    if (!session && (isProtectedRoute || isAdminRoute)) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // If the route is admin-only, check if the user is an admin
    if (isAdminRoute) {
      const walletAddress = session?.user?.user_metadata?.wallet_address

      if (!walletAddress) {
        return NextResponse.redirect(new URL("/", request.url))
      }

      // Get the user's role from the database
      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("wallet_address", walletAddress)
        .single()

      if (error || userData?.role !== "admin") {
        // If there's an error or the user is not an admin, redirect to home
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  } catch (error) {
    console.error("Auth middleware error:", error)
    // On error, allow the request to proceed to the app, which will handle auth state
  }

  return NextResponse.next()
}
