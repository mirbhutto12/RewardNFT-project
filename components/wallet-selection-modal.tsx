"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { Loader2 } from "lucide-react"

interface WalletSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletSelectionModal({ open, onOpenChange }: WalletSelectionModalProps) {
  const { connectWallet, connecting, availableWallets } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  const handleWalletSelect = async (walletName: string) => {
    setSelectedWallet(walletName)
    await connectWallet(walletName)
    onOpenChange(false)
    setSelectedWallet(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {availableWallets.map((wallet) => (
            <Button
              key={wallet.name}
              variant="outline"
              className="w-full justify-start gap-4 bg-white/5 border-white/20 hover:bg-white/10 text-white"
              onClick={() => handleWalletSelect(wallet.name)}
              disabled={connecting && selectedWallet === wallet.name}
            >
              <div className="relative h-6 w-6">
                <Image src={wallet.icon || "/placeholder.svg"} alt={wallet.name} fill className="object-contain" />
              </div>
              <span className="flex-1">{wallet.name}</span>
              {connecting && selectedWallet === wallet.name ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : !wallet.installed ? (
                <span className="text-xs text-white/60">Install</span>
              ) : null}
            </Button>
          ))}
        </div>
        <div className="text-center text-white/60 text-sm">
          New to Solana?{" "}
          <a
            href="https://solana.com/developers/guides/getstarted/setup-a-wallet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Learn more about wallets
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
