"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useWallet } from "@/contexts/wallet-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Save } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { ProfileWalletInfo } from "@/components/profile-wallet-info"
import { ProfileNFTCard } from "@/components/profile-nft-card"

export function ProfilePageContent() {
  const { user, isAuthenticated } = useAuth()
  const { publicKey } = useWallet()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!publicKey) return

      try {
        setInitialLoading(true)
        const { data, error } = await supabase
          .from("users")
          .select("username, email")
          .eq("wallet_address", publicKey.toString())
          .single()

        if (error) {
          console.error("Error fetching user profile:", error)
          return
        }

        if (data) {
          setUsername(data.username || "")
          setEmail(data.email || "")
        }
      } catch (error) {
        console.error("Unexpected error fetching profile:", error)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchUserProfile()
  }, [publicKey])

  const handleUpdateProfile = async () => {
    if (!publicKey) return

    try {
      setLoading(true)
      const { error } = await supabase
        .from("users")
        .update({
          username,
          email,
          updated_at: new Date().toISOString(),
        })
        .eq("wallet_address", publicKey.toString())

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {initialLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter a username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateProfile} disabled={loading || initialLoading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <ProfileWalletInfo />
            <ProfileNFTCard />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
