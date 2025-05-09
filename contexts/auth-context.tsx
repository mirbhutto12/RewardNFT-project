"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "@/contexts/wallet-context"
import { supabase } from "@/lib/supabase"
import { createSignMessage } from "@/lib/auth-utils"
import { toast } from "@/components/ui/use-toast"
import type { Session, User } from "@supabase/supabase-js"
import type { User as AppUser } from "@/types/database"

interface AuthContextType {
  session: Session | null
  user: User | null
  appUser: AppUser | null
  loading: boolean
  signInWithWallet: () => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  appUser: null,
  loading: true,
  signInWithWallet: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
  isAdmin: false,
  refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { publicKey, connected, signMessage } = useWallet()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch app user data from the database
  const fetchAppUser = async (walletAddress: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("wallet_address", walletAddress).single()

      if (error) {
        console.error("Error fetching user data:", error)
        return null
      }

      return data as AppUser
    } catch (error) {
      console.error("Error in fetchAppUser:", error)
      return null
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    if (!user) return

    try {
      const userData = user.user_metadata?.wallet_address ? await fetchAppUser(user.user_metadata.wallet_address) : null

      if (userData) {
        setAppUser(userData)
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()

        setSession(currentSession)
        setUser(currentSession?.user || null)

        if (currentSession?.user?.user_metadata?.wallet_address) {
          const userData = await fetchAppUser(currentSession.user.user_metadata.wallet_address)
          setAppUser(userData)
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user || null)

      if (newSession?.user?.user_metadata?.wallet_address) {
        const userData = await fetchAppUser(newSession.user.user_metadata.wallet_address)
        setAppUser(userData)
      } else {
        setAppUser(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign in with wallet
  const signInWithWallet = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Get a nonce from the server
      const nonceResponse = await fetch("/api/auth/nonce")
      const { nonce } = await nonceResponse.json()

      // Create a message for the user to sign
      const walletAddress = publicKey.toString()
      const message = createSignMessage(walletAddress, nonce)

      // Request signature from wallet
      let signature: string
      try {
        if (!signMessage) {
          throw new Error("Wallet does not support message signing")
        }
        signature = await signMessage(message)
      } catch (error: any) {
        toast({
          title: "Signature request failed",
          description: error.message || "Failed to sign message with wallet",
          variant: "destructive",
        })
        return
      }

      // Send the signature to the server for verification and login
      const loginResponse = await fetch("/api/auth/wallet-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          message,
          signature,
        }),
      })

      if (!loginResponse.ok) {
        const error = await loginResponse.json()
        throw new Error(error.error || "Authentication failed")
      }

      const { user: authUser, session: authSession } = await loginResponse.json()

      // Fetch the app user data
      const userData = await fetchAppUser(walletAddress)
      setAppUser(userData)

      toast({
        title: "Authentication successful",
        description: `Welcome, ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`,
      })
    } catch (error: any) {
      console.error("Error signing in with wallet:", error)
      toast({
        title: "Authentication failed",
        description: error.message || "Failed to authenticate with wallet",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      await fetch("/api/auth/logout", { method: "POST" })
      setAppUser(null)

      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      })
    } catch (error: any) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = appUser?.role === "admin"

  const value = {
    session,
    user,
    appUser,
    loading,
    signInWithWallet,
    signOut,
    isAuthenticated: !!session,
    isAdmin,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
