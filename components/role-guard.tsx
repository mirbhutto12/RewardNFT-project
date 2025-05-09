"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallbackUrl?: string
}

export function RoleGuard({ children, allowedRoles, fallbackUrl = "/" }: RoleGuardProps) {
  const { appUser, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait until authentication is complete
    if (loading) return

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    // If authenticated but not authorized, redirect to fallback
    if (appUser && !allowedRoles.includes(appUser.role)) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
      router.push(fallbackUrl)
    }
  }, [appUser, isAuthenticated, loading, allowedRoles, fallbackUrl, router])

  // Show nothing while checking authentication
  if (loading) {
    return null
  }

  // If authenticated and authorized, render children
  if (isAuthenticated && appUser && allowedRoles.includes(appUser.role)) {
    return <>{children}</>
  }

  // Otherwise render nothing
  return null
}
