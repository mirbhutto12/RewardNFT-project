"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/contexts/wallet-context"
import { EnhancedUSDCService } from "@/services/enhanced-usdc-service"
import nftService from "@/services/nft-service" // Use singleton instance
import { Loader2, CheckCircle, AlertCircle, Coins, Gift, ExternalLink, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { getNetworkInfo } from "@/config/solana"

interface TokenBalance {
  mint: string
  balance: number
  symbol?: string
}

export function EnhancedMintButton() {
  const { connected, publicKey, signTransaction, connection } = useWallet()
  const [loading, setLoading] = useState(false)
  const [usdcBalance, setUsdcBalance] = useState<number>(0)
  const [allTokenBalances, setAllTokenBalances] = useState<TokenBalance[]>([])
  const [hasAlreadyMinted, setHasAlreadyMinted] = useState(false)
  const [mintProgress, setMintProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [mintedNFT, setMintedNFT] = useState("")
  const [checkingTokens, setCheckingTokens] = useState(false)
  const [networkInfo, setNetworkInfo] = useState<any>(null)
  const router = useRouter()

  // Safely get network info
  useEffect(() => {
    try {
      const info = getNetworkInfo()
      setNetworkInfo(info)
      console.log("Network Info:", info)
    } catch (error) {
      console.error("Error getting network info:", error)
      setNetworkInfo({
        currentNetwork: "devnet",
        rpcEndpoint: "https://api.devnet.solana.com",
        nftPrice: 10,
      })
    }
  }, [])

  // Update NFT service connection when wallet connection changes
  useEffect(() => {
    if (connection) {
      nftService.setConnection(connection)
    }
  }, [connection])

  // Check USDC balance and mint status
  useEffect(() => {
    if (connected && publicKey) {
      checkAllTokenBalances()
      checkMintStatus()
    }
  }, [connected, publicKey])

  const checkAllTokenBalances = async () => {
    if (!publicKey || !connection) return
    setCheckingTokens(true)

    try {
      const usdcService = new EnhancedUSDCService(connection)

      // Get all token balances
      const tokenBalances = await usdcService.getAllTokenBalances(publicKey)
      setAllTokenBalances(tokenBalances)

      // Get USDC balance specifically
      const usdcBal = await usdcService.getUSDCBalance(publicKey)
      setUsdcBalance(usdcBal)

      console.log("All token balances:", tokenBalances)
      console.log("USDC balance:", usdcBal)
    } catch (error) {
      console.error("Error checking token balances:", error)
      setError("Failed to check token balances")
    } finally {
      setCheckingTokens(false)
    }
  }

  const checkMintStatus = async () => {
    if (!publicKey) return

    try {
      console.log("Checking mint status for wallet:", publicKey.toString())
      console.log("NFT Service methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(nftService)))

      const hasMinted = await nftService.hasUserMinted(publicKey)
      console.log("Mint status result:", hasMinted)
      setHasAlreadyMinted(hasMinted)
    } catch (error) {
      console.error("Error checking mint status:", error)
      // Don't set an error state here, just log it
      setHasAlreadyMinted(false)
    }
  }

  const updateProgress = (stepId: string, completed = true) => {
    setCurrentStep(stepId)
    const progress = completed ? 100 : 50
    setMintProgress(progress)
  }

  const handleMint = async () => {
    if (!connected || !publicKey || !signTransaction) {
      setError("Please connect your wallet first")
      return
    }

    if (hasAlreadyMinted) {
      setError("You have already minted your NFT. Only 1 NFT per wallet is allowed.")
      return
    }

    if (usdcBalance < 10) {
      setError("Insufficient USDC balance. You need at least 10 USDC to mint.")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")
    setMintProgress(0)

    try {
      updateProgress("validate")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      updateProgress("payment")
      setCurrentStep("Processing USDC payment and minting NFT...")

      const result = await nftService.mintNFT(publicKey, signTransaction, 10)

      if (result.success && result.nftMint) {
        updateProgress("complete")
        setMintedNFT(result.nftMint)
        setSuccess(`🎉 NFT minted successfully! Mint: ${result.nftMint}`)

        nftService.markUserAsMinted(publicKey)
        setHasAlreadyMinted(true)

        await checkAllTokenBalances()

        setTimeout(() => {
          router.push(`/congratulations?nft=${result.nftMint}&signature=${result.signature}`)
        }, 3000)
      } else {
        setError(result.error || "Failed to mint NFT")
      }
    } catch (err: any) {
      setError(err.message || "Failed to mint NFT")
    } finally {
      setLoading(false)
    }
  }

  const getExplorerLink = (address: string) => {
    try {
      return `https://explorer.solana.com/address/${address}?cluster=devnet`
    } catch (error) {
      return `https://explorer.solana.com/address/${address}`
    }
  }

  if (!connected) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">Connect your wallet to mint your NFT</p>
          <Badge variant="outline">Wallet Required</Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Network Info Card */}
      {networkInfo && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Network Configuration</CardTitle>
            <CardDescription className="text-muted-foreground">Current network settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Network:</span>
              <span className="text-foreground">{networkInfo.currentNetwork}</span>
              <span className="text-muted-foreground">NFT Price:</span>
              <span className="text-foreground">{networkInfo.nftPrice} USDC</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Token Debug Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <span>Token Balances</span>
            <Button variant="ghost" size="sm" onClick={checkAllTokenBalances} disabled={checkingTokens}>
              <RefreshCw className={`w-4 h-4 ${checkingTokens ? "animate-spin" : ""}`} />
            </Button>
          </CardTitle>
          <CardDescription className="text-muted-foreground">Your current token balances on devnet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {checkingTokens ? (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking token balances...
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-lg font-semibold text-foreground">USDC Balance: {usdcBalance.toFixed(2)} USDC</div>
              {allTokenBalances.length > 0 && (
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">All Token Accounts:</p>
                  {allTokenBalances.map((token, index) => (
                    <div key={index} className="flex justify-between text-xs text-muted-foreground">
                      <span>{token.symbol || `${token.mint.slice(0, 8)}...${token.mint.slice(-4)}`}</span>
                      <span>{token.balance.toFixed(6)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* NFT Preview Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Gift className="w-5 h-5 mr-2" />
            RewardNFT Membership
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Exclusive NFT with referral access and platform benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Mint Price</p>
              <p className="text-sm text-muted-foreground">USDC Payment Required</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">10 USDC</p>
              <Badge variant="outline">+ network fees</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-foreground">Your USDC Balance:</strong>
              <span className="text-muted-foreground ml-1">{usdcBalance.toFixed(2)} USDC</span>
            </div>
            <div>
              <strong className="text-foreground">Status:</strong>{" "}
              {hasAlreadyMinted ? (
                <Badge variant="secondary">Already Minted</Badge>
              ) : (
                <Badge variant="outline">Available</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Card */}
      {loading && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Minting Progress</CardTitle>
            <CardDescription className="text-muted-foreground">{currentStep}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={mintProgress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Status Messages */}
      {success && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="flex items-center justify-between text-green-700 dark:text-green-300">
            <span>{success}</span>
            {mintedNFT && (
              <a
                href={getExplorerLink(mintedNFT)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Mint Button */}
      <Button
        onClick={handleMint}
        disabled={loading || hasAlreadyMinted || usdcBalance < 10}
        className="w-full h-12 text-lg"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Minting NFT...
          </>
        ) : hasAlreadyMinted ? (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            Already Minted ✓
          </>
        ) : usdcBalance < 10 ? (
          <>
            <AlertCircle className="w-5 h-5 mr-2" />
            Insufficient USDC ({usdcBalance.toFixed(2)}/10)
          </>
        ) : (
          <>
            <Coins className="w-5 h-5 mr-2" />
            Mint NFT (10 USDC)
          </>
        )}
      </Button>

      {/* Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>• Maximum 1 NFT per wallet</p>
        <p>• Grants access to referral system</p>
        <p>• All transactions on Solana Devnet</p>
        <p>• Supports multiple USDC mints</p>
      </div>
    </div>
  )
}
