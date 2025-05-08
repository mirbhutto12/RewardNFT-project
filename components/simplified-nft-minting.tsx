"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from "@/contexts/wallet-context"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { MintNFTButton } from "./mint-nft-button"

export function SimplifiedNFTMinting() {
  const { toast } = useToast()
  const { connected, publicKey } = useWallet()
  const [minting, setMinting] = useState(false)
  const [mintingStep, setMintingStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [mintingComplete, setMintingComplete] = useState(false)
  const [mintingError, setMintingError] = useState<string | null>(null)
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null)

  // Simulate the minting process
  const handleMint = async () => {
    if (!connected || !publicKey) {
      return
    }

    try {
      setMinting(true)
      setMintingError(null)
      setMintingStep(1)
      setProgress(10)

      // Step 1: Prepare transaction
      await simulateStep("Preparing transaction...", 30, 1000)

      // Step 2: Sign transaction
      setMintingStep(2)
      await simulateStep("Signing transaction...", 50, 1500)

      // Step 3: Send transaction
      setMintingStep(3)
      await simulateStep("Sending transaction to network...", 70, 2000)

      // Step 4: Confirm transaction
      setMintingStep(4)
      await simulateStep("Confirming transaction...", 90, 2500)

      // Complete
      setProgress(100)
      setMintingStep(5)
      setMintingComplete(true)
      setTransactionSignature(
        "5KtPn1LGuxhFE5FzJTzMZ4VRZjEcAqxTKNxzJgJTGCnPHE7UVdXvKNu9Dkf9PzRHZj3qXA7jYLHxHhxNMPNPSPjR",
      )

      toast({
        title: "NFT Minted Successfully!",
        description: "Your NFT has been minted and added to your wallet.",
      })
    } catch (error: any) {
      console.error("Minting error:", error)
      setMintingError(error.message || "Failed to mint NFT")
      toast({
        variant: "destructive",
        title: "Minting Failed",
        description: error.message || "There was an error minting your NFT.",
      })
    } finally {
      setMinting(false)
    }
  }

  const simulateStep = async (message: string, targetProgress: number, delay: number) => {
    console.log(message)
    return new Promise<void>((resolve) => {
      const startProgress = progress
      const progressDiff = targetProgress - startProgress
      const startTime = Date.now()
      const endTime = startTime + delay

      const updateProgress = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const percentage = Math.min(elapsed / delay, 1)
        const currentProgress = startProgress + progressDiff * percentage
        setProgress(currentProgress)

        if (now < endTime) {
          requestAnimationFrame(updateProgress)
        } else {
          setProgress(targetProgress)
          resolve()
        }
      }

      requestAnimationFrame(updateProgress)
    })
  }

  const resetMinting = () => {
    setMintingComplete(false)
    setMintingError(null)
    setMintingStep(0)
    setProgress(0)
    setTransactionSignature(null)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Mint Your Reward NFT</h3>
            <p className="text-muted-foreground">Mint a unique NFT to join our rewards program and start earning.</p>
          </div>

          {!minting && !mintingComplete && !mintingError && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="font-medium">Price: 10 USDT</p>
                <p className="text-sm text-muted-foreground mt-1">Plus network fees</p>
              </div>

              <MintNFTButton onClick={handleMint} className="w-full" />
            </div>
          )}

          {(minting || mintingComplete || mintingError) && (
            <div className="space-y-4">
              <Progress value={progress} className="h-2 w-full" />

              <div className="space-y-2">
                <div className={`flex items-center ${mintingStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                  {mintingStep > 1 ? (
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                  ) : mintingStep === 1 ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <div className="mr-2 h-5 w-5 rounded-full border border-muted-foreground/30" />
                  )}
                  <span>Preparing transaction</span>
                </div>

                <div className={`flex items-center ${mintingStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                  {mintingStep > 2 ? (
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                  ) : mintingStep === 2 ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <div className="mr-2 h-5 w-5 rounded-full border border-muted-foreground/30" />
                  )}
                  <span>Signing transaction</span>
                </div>

                <div className={`flex items-center ${mintingStep >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                  {mintingStep > 3 ? (
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                  ) : mintingStep === 3 ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <div className="mr-2 h-5 w-5 rounded-full border border-muted-foreground/30" />
                  )}
                  <span>Sending to network</span>
                </div>

                <div className={`flex items-center ${mintingStep >= 4 ? "text-primary" : "text-muted-foreground"}`}>
                  {mintingStep > 4 ? (
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                  ) : mintingStep === 4 ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <div className="mr-2 h-5 w-5 rounded-full border border-muted-foreground/30" />
                  )}
                  <span>Confirming transaction</span>
                </div>
              </div>

              {mintingError && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Minting failed</p>
                    <p className="text-sm">{mintingError}</p>
                  </div>
                </div>
              )}

              {mintingComplete && (
                <div className="bg-primary/10 text-primary p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <p className="font-medium">NFT Minted Successfully!</p>
                  </div>
                  {transactionSignature && (
                    <p className="text-xs mt-2 truncate">
                      Transaction: {transactionSignature.slice(0, 8)}...{transactionSignature.slice(-8)}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-center">
                {mintingComplete || mintingError ? (
                  <Button onClick={resetMinting} variant="outline">
                    {mintingError ? "Try Again" : "Mint Another"}
                  </Button>
                ) : (
                  <Button disabled variant="outline">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Minting in progress...
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
