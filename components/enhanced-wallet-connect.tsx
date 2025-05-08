"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/hooks/use-solana-wallet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, LogOut, ExternalLink, Copy, Check, ChevronDown } from "lucide-react"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { DEFAULT_SOLANA_EXPLORER_URL } from "@/config/solana"

interface EnhancedWalletConnectProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onSuccess?: () => void
}

export function EnhancedWalletConnect({
  variant = "default",
  size = "default",
  className = "",
  onSuccess,
}: EnhancedWalletConnectProps) {
  const {
    publicKey,
    connected,
    connecting,
    walletProviders,
    solBalance,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  } = useSolanaWallet()

  const [showConnectModal, setShowConnectModal] = useState(false)
  const [copied, setCopied] = useState(false)

  // Refresh balance periodically when connected
  useEffect(() => {
    if (connected && publicKey) {
      refreshBalance()

      const intervalId = setInterval(() => {
        refreshBalance()
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(intervalId)
    }
  }, [connected, publicKey, refreshBalance])

  const handleConnect = async (walletName: string) => {
    try {
      await connectWallet(walletName)
      setShowConnectModal(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const openExplorer = () => {
    if (publicKey) {
      window.open(`${DEFAULT_SOLANA_EXPLORER_URL}/address/${publicKey.toString()}`, "_blank")
    }
  }

  if (connected && publicKey) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          {solBalance !== null && <div className="px-2 py-1.5 text-sm">Balance: {solBalance.toFixed(4)} SOL</div>}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyAddress}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openExplorer}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={refreshBalance}>
            <Loader2 className="mr-2 h-4 w-4" />
            Refresh Balance
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnectWallet}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowConnectModal(true)}
        disabled={connecting}
      >
        {connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>

      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>Select a wallet to connect to the Reward NFT Platform</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {walletProviders.includes("phantom") && (
              <Button
                variant="outline"
                className="flex justify-between items-center h-16 px-4"
                onClick={() => handleConnect("phantom")}
                disabled={connecting}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-4 relative">
                    <Image src="/images/phantom-icon.png" alt="Phantom" fill className="object-contain" />
                  </div>
                  <span>Phantom</span>
                </div>
                {connecting && <Loader2 className="h-5 w-5 animate-spin" />}
              </Button>
            )}

            {walletProviders.length === 0 && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <p className="font-medium mb-2">No wallet extensions detected</p>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => window.open("https://phantom.app/download", "_blank")}
                >
                  Install Phantom
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
