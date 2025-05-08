"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { getPhantomProvider, checkSolanaNetwork, type SolanaNetwork } from "@/lib/utils"

interface WalletOption {
  id: string
  name: string
  icon: string
  installed: boolean
}

interface WalletSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function WalletSelectionModal({ open, onOpenChange, onSuccess }: WalletSelectionModalProps) {
  const { connectWallet } = useWallet()
  const [connecting, setConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Check if Phantom is installed
  const isPhantomInstalled =
    typeof window !== "undefined" && window.hasOwnProperty("solana") && (window as any).solana?.isPhantom

  const walletOptions: WalletOption[] = [
    {
      id: "phantom",
      name: "Phantom",
      icon: "/images/phantom-icon.png",
      installed: isPhantomInstalled,
    },
    // Add more wallet options here in the future
  ]

  const handleWalletSelect = async (walletId: string) => {
    try {
      setError(null)
      setSelectedWallet(walletId)
      setConnecting(true)

      if (walletId === "phantom") {
        await connectPhantom()
        if (onSuccess) onSuccess()
        onOpenChange(false)
      }
    } catch (err: any) {
      console.error("Wallet connection error:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setConnecting(false)
    }
  }

  // Add this function inside the WalletSelectionModal component
  const connectPhantom = async () => {
    try {
      setConnecting(true)
      setError(null)

      const phantomProvider = await getPhantomProvider()

      if (!phantomProvider) {
        setError("Phantom wallet not found. Please install it first.")
        setConnecting(false)
        return
      }

      try {
        // Request connection to the wallet
        const response = await phantomProvider.connect()
        const publicKey = response.publicKey.toString()

        // Connection successful
        console.log("Connected to wallet:", publicKey)

        // Check network after connection
        const networkCheck = await checkSolanaNetwork(
          phantomProvider,
          (process.env.NEXT_PUBLIC_SOLANA_NETWORK as SolanaNetwork) || "devnet",
        )

        if (!networkCheck.isCorrectNetwork) {
          console.warn(
            `Wrong network detected: ${networkCheck.network}. Expected: ${process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"}`,
          )
          // We'll show a warning but not block the connection
        }

        // Close modal on successful connection
        onOpenChange(false)
      } catch (err: any) {
        console.error("Error connecting to Phantom wallet:", err)
        setError(err.message || "Failed to connect to Phantom wallet")
      }

      setConnecting(false)
    } catch (err: any) {
      console.error("Unexpected error during wallet connection:", err)
      setError("An unexpected error occurred. Please try again.")
      setConnecting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>Select a wallet to connect to the Reward NFT Platform</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {walletOptions.map((wallet) => (
            <Button
              key={wallet.id}
              variant="outline"
              className={`flex justify-between items-center h-16 px-4 ${
                selectedWallet === wallet.id ? "border-primary" : ""
              }`}
              onClick={() => handleWalletSelect(wallet.id)}
              disabled={connecting || !wallet.installed}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 mr-4 relative">
                  <Image src={wallet.icon || "/placeholder.svg"} alt={wallet.name} fill className="object-contain" />
                </div>
                <span>{wallet.name}</span>
              </div>
              {connecting && selectedWallet === wallet.id ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : !wallet.installed ? (
                <span className="text-xs text-muted-foreground">Not installed</span>
              ) : null}
            </Button>
          ))}
        </div>
        {!isPhantomInstalled && (
          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="font-medium mb-2">Phantom wallet is not installed</p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => window.open("https://phantom.app/download", "_blank")}
            >
              Install Phantom
            </Button>
          </div>
        )}
        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>}
      </DialogContent>
    </Dialog>
  )
}
