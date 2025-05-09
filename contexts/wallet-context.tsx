"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { PublicKey } from "@solana/web3.js"
import { toast } from "@/components/ui/use-toast"
import { detectWallets, getWalletProvider, type WalletProvider } from "@/utils/wallet-providers"
import { isMobileDevice } from "@/utils/mobile-wallet-adapter"

// Define the wallet context type
interface WalletContextType {
  connected: boolean
  connecting: boolean
  publicKey: PublicKey | null
  currentWallet: string | null
  availableWallets: Array<{
    name: string
    icon: string
    installed: boolean
  }>
  connectWallet: (walletName: string) => Promise<void>
  disconnectWallet: () => Promise<void>
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array; publicKey: PublicKey }>
  signTransaction: (transaction: any) => Promise<any>
  signAllTransactions: (transactions: any[]) => Promise<any[]>
  sendTransaction: (transaction: any) => Promise<string>
  isMobile: boolean
}

// Create the wallet context
const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Define the wallet provider props
interface WalletProviderProps {
  children: React.ReactNode
}

// Create the wallet provider component
export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [currentWallet, setCurrentWallet] = useState<string | null>(null)
  const [walletProvider, setWalletProvider] = useState<WalletProvider | null>(null)
  const [availableWallets, setAvailableWallets] = useState<
    Array<{
      name: string
      icon: string
      installed: boolean
    }>
  >([])
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile device
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(isMobileDevice())
    }
  }, [])

  // Detect available wallets
  useEffect(() => {
    if (typeof window !== "undefined") {
      const wallets = detectWallets()
      setAvailableWallets(wallets)
    }
  }, [])

  // Handle wallet connection events
  useEffect(() => {
    if (walletProvider) {
      const handleConnect = (publicKey: { toString: () => string }) => {
        try {
          const newPublicKey = new PublicKey(publicKey.toString())
          setPublicKey(newPublicKey)
          setConnected(true)
          toast({
            title: "Wallet Connected",
            description: `Connected to ${newPublicKey.toString().slice(0, 4)}...${newPublicKey.toString().slice(-4)}`,
          })
        } catch (error) {
          console.error("Error handling connect event:", error)
        }
      }

      const handleDisconnect = () => {
        setPublicKey(null)
        setConnected(false)
        setCurrentWallet(null)
        setWalletProvider(null)
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected",
        })
      }

      // Add event listeners
      walletProvider.on("connect", handleConnect)
      walletProvider.on("disconnect", handleDisconnect)

      // Clean up event listeners
      return () => {
        walletProvider.off("connect", handleConnect)
        walletProvider.off("disconnect", handleDisconnect)
      }
    }
  }, [walletProvider])

  // Check for wallet connection on page load
  useEffect(() => {
    const checkWalletConnection = async () => {
      // For mobile, we rely on deep linking and don't auto-connect
      if (isMobile) return

      // For browser extensions, try to auto-connect
      try {
        const wallets = detectWallets()
        for (const wallet of wallets) {
          if (wallet.installed && wallet.provider) {
            try {
              // Check if already connected
              if (wallet.provider.publicKey) {
                const publicKey = new PublicKey(wallet.provider.publicKey.toString())
                setPublicKey(publicKey)
                setConnected(true)
                setCurrentWallet(wallet.name)
                setWalletProvider(wallet.provider)
                break
              }
            } catch (error) {
              console.error(`Error checking ${wallet.name} connection:`, error)
            }
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }

    checkWalletConnection()
  }, [isMobile])

  // Connect to wallet
  const connectWallet = useCallback(async (walletName: string) => {
    try {
      setConnecting(true)

      // Get wallet provider
      const provider = getWalletProvider(walletName)
      if (!provider) {
        throw new Error(`${walletName} wallet is not installed`)
      }

      // Connect to wallet
      const response = await provider.connect()
      const newPublicKey = new PublicKey(response.publicKey.toString())

      // Update state
      setPublicKey(newPublicKey)
      setConnected(true)
      setCurrentWallet(walletName)
      setWalletProvider(provider)

      toast({
        title: "Wallet Connected",
        description: `Connected to ${newPublicKey.toString().slice(0, 4)}...${newPublicKey.toString().slice(-4)}`,
      })
    } catch (error: any) {
      console.error("Error connecting wallet:", error)

      // Handle user rejection
      if (error.code === 4001) {
        toast({
          title: "Connection Cancelled",
          description: "You cancelled the connection request",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Connection Failed",
          description: error.message || "Failed to connect wallet",
          variant: "destructive",
        })
      }

      throw error
    } finally {
      setConnecting(false)
    }
  }, [])

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    if (walletProvider) {
      try {
        await walletProvider.disconnect()
        setPublicKey(null)
        setConnected(false)
        setCurrentWallet(null)
        setWalletProvider(null)

        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected",
        })
      } catch (error) {
        console.error("Error disconnecting wallet:", error)
        toast({
          title: "Disconnection Failed",
          description: "Failed to disconnect wallet",
          variant: "destructive",
        })
        throw error
      }
    }
  }, [walletProvider])

  // Sign message
  const signMessage = useCallback(
    async (message: Uint8Array) => {
      if (!walletProvider || !connected) {
        throw new Error("Wallet not connected")
      }

      try {
        const { signature, publicKey } = await walletProvider.signMessage(message)
        return { signature, publicKey: new PublicKey(publicKey.toString()) }
      } catch (error) {
        console.error("Error signing message:", error)
        toast({
          title: "Signing Failed",
          description: "Failed to sign message",
          variant: "destructive",
        })
        throw error
      }
    },
    [walletProvider, connected],
  )

  // Sign transaction
  const signTransaction = useCallback(
    async (transaction: any) => {
      if (!walletProvider || !connected) {
        throw new Error("Wallet not connected")
      }

      try {
        return await walletProvider.signTransaction(transaction)
      } catch (error) {
        console.error("Error signing transaction:", error)
        toast({
          title: "Signing Failed",
          description: "Failed to sign transaction",
          variant: "destructive",
        })
        throw error
      }
    },
    [walletProvider, connected],
  )

  // Sign all transactions
  const signAllTransactions = useCallback(
    async (transactions: any[]) => {
      if (!walletProvider || !connected) {
        throw new Error("Wallet not connected")
      }

      try {
        return await walletProvider.signAllTransactions(transactions)
      } catch (error) {
        console.error("Error signing transactions:", error)
        toast({
          title: "Signing Failed",
          description: "Failed to sign transactions",
          variant: "destructive",
        })
        throw error
      }
    },
    [walletProvider, connected],
  )

  // Send transaction
  const sendTransaction = useCallback(
    async (transaction: any) => {
      if (!walletProvider || !connected) {
        throw new Error("Wallet not connected")
      }

      try {
        const { signature } = await walletProvider.signAndSendTransaction(transaction)
        return signature
      } catch (error) {
        console.error("Error sending transaction:", error)
        toast({
          title: "Transaction Failed",
          description: "Failed to send transaction",
          variant: "destructive",
        })
        throw error
      }
    },
    [walletProvider, connected],
  )

  // Create context value
  const contextValue: WalletContextType = {
    connected,
    connecting,
    publicKey,
    currentWallet,
    availableWallets,
    connectWallet,
    disconnectWallet,
    signMessage,
    signTransaction,
    signAllTransactions,
    sendTransaction,
    isMobile,
  }

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
}

// Create a hook to use the wallet context
export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
