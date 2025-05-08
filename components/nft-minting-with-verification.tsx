"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle2, AlertCircle, Shield } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { toast } from "@/components/ui/use-toast"
import { NFT_METADATA } from "@/config/solana"
import { NftVerificationBadge } from "@/components/nft-verification-badge"
import { Connection } from "@solana/web3.js"
import { DEFAULT_RPC_ENDPOINT } from "@/config/solana"
import { fetchAndVerifyNftMetadata } from "@/utils/nft-verification"

interface NftMintingWithVerificationProps {
  onSuccess?: (mintAddress: string) => void
  onError?: (error: Error) => void
}

export function NftMintingWithVerification({ onSuccess, onError }: NftMintingWithVerificationProps) {
  const { connected, publicKey } = useWallet()
  const [mintingStatus, setMintingStatus] = useState<"idle" | "minting" | "verifying" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [mintAddress, setMintAddress] = useState<string | null>(null)
  const [verification, setVerification] = useState<any>(null)

  const handleMintNft = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint an NFT",
        variant: "destructive",
      })
      return
    }

    try {
      // Start minting process
      setMintingStatus("minting")
      setErrorMessage(null)

      // Simulate minting process with a delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate a simulated mint address
      const simulatedMintAddress = `${publicKey.toString().slice(0, 8)}...${Math.random().toString(36).substring(2, 10)}`
      setMintAddress(simulatedMintAddress)

      // Start verification process
      setMintingStatus("verifying")

      // Simulate verification process
      const connection = new Connection(DEFAULT_RPC_ENDPOINT)
      const { verification: verificationResult } = await fetchAndVerifyNftMetadata(simulatedMintAddress, connection)
      setVerification(verificationResult)

      // Set success status
      setMintingStatus("success")

      // Call onSuccess callback if provided
      onSuccess && onSuccess(simulatedMintAddress)

      toast({
        title: "NFT Minted Successfully",
        description: "Your NFT has been minted, verified, and added to your wallet",
      })
    } catch (error: any) {
      console.error("NFT minting error:", error)
      setMintingStatus("error")
      setErrorMessage(error.message || "Failed to mint NFT")

      // Call onError callback if provided
      onError && onError(error)

      toast({
        title: "Mint Failed",
        description: error.message || "Failed to mint NFT. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderMintingStatus = () => {
    switch (mintingStatus) {
      case "idle":
        return (
          <Button onClick={handleMintNft} className="w-full bg-white hover:bg-white/90 text-black py-6 text-lg">
            Mint NFT
          </Button>
        )
      case "minting":
        return (
          <div className="space-y-4">
            <div className="bg-white/20 rounded-lg p-4 flex items-center justify-center">
              <Loader2 className="animate-spin h-6 w-6 text-white mr-2" />
              <span className="text-white">Minting in progress...</span>
            </div>
            <Progress value={65} className="h-2 bg-white/10" />
          </div>
        )
      case "verifying":
        return (
          <div className="space-y-4">
            <div className="bg-white/20 rounded-lg p-4 flex items-center justify-center">
              <Shield className="animate-pulse h-6 w-6 text-white mr-2" />
              <span className="text-white">Verifying NFT metadata...</span>
            </div>
            <Progress value={85} className="h-2 bg-white/10" />
          </div>
        )
      case "success":
        return (
          <div className="space-y-4">
            <div className="bg-green-500/20 rounded-lg p-4 flex items-center">
              <CheckCircle2 className="h-6 w-6 text-green-400 mr-2" />
              <span className="text-white">NFT successfully minted!</span>
            </div>
            {verification && (
              <div className="flex justify-center">
                <NftVerificationBadge verification={verification} size="lg" />
              </div>
            )}
          </div>
        )
      case "error":
        return (
          <div className="space-y-4">
            <div className="bg-red-500/20 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-6 w-6 text-red-400 mr-2" />
              <span className="text-white">{errorMessage || "Error minting NFT. Please try again."}</span>
            </div>
            <Button onClick={handleMintNft} className="w-full bg-white hover:bg-white/90 text-black">
              Try Again
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64 mb-4">
          <Image
            src={NFT_METADATA.image || "/placeholder.svg?height=300&width=300"}
            alt={NFT_METADATA.name}
            fill
            className="object-cover rounded-lg"
          />
          {mintingStatus === "success" && verification && verification.isVerified && (
            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-white">{NFT_METADATA.name}</h3>
        <p className="text-white/60 text-sm mt-1">{NFT_METADATA.description}</p>
      </div>

      {renderMintingStatus()}
    </div>
  )
}
