"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/wallet-context"
import { WalletSelectionModal } from "./wallet-selection-modal"

interface MintNFTButtonProps {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
  children?: React.ReactNode
}

export function MintNFTButton({
  onClick,
  disabled = false,
  loading = false,
  className = "",
  children = "Mint NFT",
}: MintNFTButtonProps) {
  const { connected } = useWallet()
  const [showWalletModal, setShowWalletModal] = useState(false)

  const handleClick = () => {
    if (!connected) {
      setShowWalletModal(true)
    } else {
      onClick()
    }
  }

  const handleWalletConnected = () => {
    // After wallet is connected, trigger the mint action
    onClick()
  }

  return (
    <>
      <Button onClick={handleClick} disabled={disabled || loading} className={className}>
        {children}
      </Button>

      <WalletSelectionModal
        open={showWalletModal}
        onOpenChange={setShowWalletModal}
        onSuccess={handleWalletConnected}
      />
    </>
  )
}
