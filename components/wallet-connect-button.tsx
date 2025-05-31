"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { WalletSelectionModal } from "@/components/wallet-selection-modal"
import { Wallet, LogOut, Loader2 } from "lucide-react"

export function WalletConnectButton() {
  const wallet = useWallet()
  const [showWalletModal, setShowWalletModal] = useState(false)

  // Safe wallet hook usage with error boundary
  let walletState = {
    connected: false,
    connecting: false,
    publicKey: null,
    disconnect: async () => {},
    connectWallet: async () => {},
  }

  try {
    walletState = {
      connected: wallet.connected,
      connecting: wallet.connecting,
      publicKey: wallet.publicKey,
      disconnect: wallet.disconnect,
      connectWallet: wallet.connectWallet,
    }
  } catch (error) {
    console.warn("Wallet context not available in WalletConnectButton:", error)
  }

  const { connected, connecting, publicKey, disconnect, connectWallet } = walletState

  const handleConnect = async () => {
    try {
      if (connected) {
        await disconnect()
      } else {
        setShowWalletModal(true)
      }
    } catch (error) {
      console.error("Error handling wallet connection:", error)
    }
  }

  const handleWalletSelect = async (walletName: string) => {
    try {
      setShowWalletModal(false)
      await connectWallet(walletName)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  if (connecting) {
    return (
      <Button disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  if (connected && publicKey) {
    const address = publicKey.toString()
    const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`

    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="hidden sm:inline-flex">
          {shortAddress}
        </Badge>
        <Button variant="outline" size="sm" onClick={handleConnect} className="gap-2">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button onClick={handleConnect} className="gap-2">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>

      <WalletSelectionModal
        open={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSelectWallet={handleWalletSelect}
      />
    </>
  )
}
