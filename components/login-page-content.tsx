"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useWallet } from "@/contexts/wallet-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { EnhancedWalletConnect } from "@/components/enhanced-wallet-connect"

export function LoginPageContent() {
  const { isAuthenticated, signInWithWallet, loading: authLoading } = useAuth()
  const { connected, connecting } = useWallet()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleAuthenticate = async () => {
    await signInWithWallet()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Solana Reward NFT</CardTitle>
          <CardDescription>Connect your wallet to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!connected ? (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Connect your Solana wallet to access the platform
              </p>
              <EnhancedWalletConnect className="w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Your wallet is connected. Authenticate to continue.
              </p>
              <Button className="w-full" onClick={handleAuthenticate} disabled={authLoading || connecting}>
                {authLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Authenticate Wallet"
                )}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-center text-xs text-muted-foreground">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
