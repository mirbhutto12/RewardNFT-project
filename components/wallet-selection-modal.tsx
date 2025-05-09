"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { Loader2, Smartphone, QrCode } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { connectToPhantomMobile } from "@/utils/mobile-wallet-adapter"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WalletSelectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletSelectionModal({ open, onOpenChange }: WalletSelectionModalProps) {
  const { connectWallet, connecting, availableWallets } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const { isMobile } = useMobile()
  const [activeTab, setActiveTab] = useState<string>(isMobile ? "mobile" : "browser")
  const [showQrCode, setShowQrCode] = useState<boolean>(false)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedWallet(null)
      setShowQrCode(false)
    }
  }, [open])

  const handleWalletSelect = async (walletName: string) => {
    setSelectedWallet(walletName)

    try {
      if (isMobile && walletName === "phantom") {
        // Use mobile-specific connection for Phantom
        await connectToPhantomMobile()
      } else {
        // Use regular connection for browser extensions
        await connectWallet(walletName)
      }
      onOpenChange(false)
    } catch (error) {
      console.error("Wallet connection error:", error)
    } finally {
      setSelectedWallet(null)
    }
  }

  const handleQrCodeToggle = () => {
    setShowQrCode(!showQrCode)
  }

  // Generate a session-based connection URL for the QR code
  // In a real implementation, this would create a session on your backend
  const getConnectionQrUrl = () => {
    const baseUrl = window.location.origin
    const sessionId = Math.random().toString(36).substring(2, 15)
    return `${baseUrl}/connect?session=${sessionId}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-center">Connect Wallet</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="browser">Browser Extension</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="browser" className="space-y-4">
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

            {availableWallets.length === 0 && (
              <div className="text-center text-white/60 p-4">
                No wallet extensions detected. Please install a Solana wallet.
              </div>
            )}
          </TabsContent>

          <TabsContent value="mobile" className="space-y-4">
            {!showQrCode ? (
              <>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-4 bg-white/5 border-white/20 hover:bg-white/10 text-white h-16"
                  onClick={() => handleWalletSelect("phantom")}
                  disabled={connecting && selectedWallet === "phantom"}
                >
                  <div className="relative h-8 w-8">
                    <Image src="/images/phantom-icon.png" alt="Phantom" fill className="object-contain" />
                  </div>
                  <div className="flex-1 text-left">
                    <div>Phantom</div>
                    <div className="text-xs text-white/60">Open in Phantom app</div>
                  </div>
                  {connecting && selectedWallet === "phantom" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Smartphone className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-4 bg-white/5 border-white/20 hover:bg-white/10 text-white h-16"
                  onClick={handleQrCodeToggle}
                >
                  <div className="relative h-8 w-8 flex items-center justify-center">
                    <QrCode className="h-6 w-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <div>Scan QR Code</div>
                    <div className="text-xs text-white/60">Connect with any wallet app</div>
                  </div>
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getConnectionQrUrl())}`}
                    alt="Connection QR Code"
                    width={200}
                    height={200}
                  />
                </div>
                <p className="text-sm text-white/80 text-center">Scan this QR code with your wallet app to connect</p>
                <Button variant="outline" onClick={handleQrCodeToggle}>
                  Back to Options
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
