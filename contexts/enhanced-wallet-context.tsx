"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { PublicKey, Connection } from "@solana/web3.js"
import { toast } from "@/components/ui/use-toast"
import { PhantomWalletAdapter, WalletError, defaultConnectionManager } from "@/utils/wallet-adapter"
import { detectWalletProviders } from "@/utils/wallet-providers"

// Define the wallet context type
interface WalletContextType {
  publicKey: PublicKey | null
  connected: boolean
  connecting: boolean
  walletProviders: string[]
  selectedWallet: string | null
  connect: (providerName?: string) => Promise<void>
  disconnect: () => Promise<void>
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array; publicKey: PublicKey }>
  connection: Connection
  hasNFT: boolean
  setHasNFT: (value: boolean) => void
  checkNFTOwnership: () => Promise<boolean>
  isCheckingNFT: boolean
}

// Create the wallet context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Create the wallet provider component
export function EnhancedWalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [walletProviders, setWalletProviders] = useState<string[]>([])
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [adapter, setAdapter] = useState<PhantomWalletAdapter | null>(null)
  const [hasNFT, setHasNFT] = useState(false)
  const [isCheckingNFT, setIsCheckingNFT] = useState(false)

  // Initialize wallet providers
  useEffect(() => {
    const providers = detectWalletProviders()
    setWalletProviders(providers)

    // Initialize adapter
    const phantomAdapter = new PhantomWalletAdapter()
    setAdapter(phantomAdapter)

    // Check for persisted connection
    const persistedWallet = localStorage.getItem("selectedWallet")
    if (persistedWallet) {
      setSelectedWallet(persistedWallet)
      // Auto-connect if wallet was previously connected
      if (providers.includes(persistedWallet)) {
        connectWallet(persistedWallet)
      }
    }
  }, [])

  // Connect to wallet
  const connectWallet = useCallback(
    async (providerName?: string) => {
      if (!adapter) return

      try {
        setConnecting(true)
        await adapter.connect()

        const walletName = providerName || "phantom"
        setSelectedWallet(walletName)
        localStorage.setItem("selectedWallet", walletName)

        setPublicKey(adapter.publicKey)
        setConnected(true)

        // Check if user has NFT after connecting
        checkNFTOwnership()

        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${adapter.publicKey?.toString().slice(0, 4)}...${adapter.publicKey?.toString().slice(-4)}`,
        })
      } catch (error) {
        console.error("Error connecting wallet:", error)
        const errorMessage =
          error instanceof WalletError ? error.message : "Failed to connect wallet. Please try again."

        toast({
          title: "Connection Failed",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setConnecting(false)
      }
    },
    [adapter],
  )

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    if (!adapter) return

    try {
      await adapter.disconnect()
      setPublicKey(null)
      setConnected(false)
      setSelectedWallet(null)
      setHasNFT(false)
      localStorage.removeItem("selectedWallet")
      localStorage.removeItem(`nft_minted_${adapter.publicKey?.toString()}`)

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      })
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }, [adapter])

  // Sign message
  const signMessage = useCallback(
    async (message: Uint8Array) => {
      if (!adapter || !connected) {
        throw new WalletError("Wallet not connected")
      }

      try {
        return await adapter.signMessage(message)
      } catch (error) {
        console.error("Error signing message:", error)
        throw new WalletError("Failed to sign message", error as Error)
      }
    },
    [adapter, connected],
  )

  // Check if user has minted an NFT
  const checkNFTOwnership = useCallback(async (): Promise<boolean> => {
    if (!connected || !publicKey) return false

    setIsCheckingNFT(true)
    try {
      // In a real implementation, you would query the blockchain
      // For this demo, we'll use localStorage to simulate NFT ownership
      const hasMinted = localStorage.getItem(`nft_minted_${publicKey.toString()}`) === "true"

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHasNFT(hasMinted)
      return hasMinted
    } catch (error) {
      console.error("Error checking NFT ownership:", error)
      return false
    } finally {
      setIsCheckingNFT(false)
    }
  }, [connected, publicKey])

  // Context value
  const value = {
    publicKey,
    connected,
    connecting,
    walletProviders,
    selectedWallet,
    connect: connectWallet,
    disconnect: disconnectWallet,
    signMessage,
    connection: defaultConnectionManager.connection,
    hasNFT,
    setHasNFT,
    checkNFTOwnership,
    isCheckingNFT,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Create the useWallet hook
export function useEnhancedWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useEnhancedWallet must be used within a EnhancedWalletProvider")
  }
  return context
}
