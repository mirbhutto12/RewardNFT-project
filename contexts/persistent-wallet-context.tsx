"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { PublicKey, Connection } from "@solana/web3.js"
import { toast } from "@/components/ui/use-toast"
import { PhantomWalletAdapter, WalletError, defaultConnectionManager } from "@/utils/wallet-adapter"
import { detectWalletProviders } from "@/utils/wallet-providers"
import * as WalletPersistence from "@/services/wallet-persistence-service"

// Define the wallet context type
interface PersistentWalletContextType {
  publicKey: PublicKey | null
  connected: boolean
  connecting: boolean
  reconnecting: boolean
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
  autoConnectEnabled: boolean
  setAutoConnectEnabled: (enabled: boolean) => void
  connectionPreferences: WalletPersistence.WalletConnectionPreferences
  updateConnectionPreferences: (prefs: Partial<WalletPersistence.WalletConnectionPreferences>) => void
  mintedNFTs: any[]
  setMintedNFTs: (nfts: any[]) => void
  refreshNFTs: () => Promise<void>
}

// Create the wallet context
const PersistentWalletContext = createContext<PersistentWalletContextType | undefined>(undefined)

// Create the wallet provider component
export function PersistentWalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const [walletProviders, setWalletProviders] = useState<string[]>([])
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [adapter, setAdapter] = useState<PhantomWalletAdapter | null>(null)
  const [hasNFT, setHasNFT] = useState(false)
  const [isCheckingNFT, setIsCheckingNFT] = useState(false)
  const [autoConnectEnabled, setAutoConnectEnabled] = useState(true)
  const [connectionPreferences, setConnectionPreferences] = useState<WalletPersistence.WalletConnectionPreferences>(
    () => {
      // Safe initialization with fallback
      try {
        return WalletPersistence.getConnectionPreferences()
      } catch (error) {
        console.error("Error getting connection preferences:", error)
        return {
          autoConnect: true,
          rememberWallet: true,
          sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
        }
      }
    },
  )
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([])

  // Update connection preferences
  const updateConnectionPreferences = useCallback((prefs: Partial<WalletPersistence.WalletConnectionPreferences>) => {
    try {
      WalletPersistence.saveConnectionPreferences(prefs)
      setConnectionPreferences((prev) => ({ ...prev, ...prefs }))
    } catch (error) {
      console.error("Error updating connection preferences:", error)
    }
  }, [])

  // Initialize wallet providers
  useEffect(() => {
    try {
      const providers = detectWalletProviders()
      setWalletProviders(providers)

      // Initialize adapter
      const phantomAdapter = new PhantomWalletAdapter()
      setAdapter(phantomAdapter)

      // Load preferences safely
      try {
        const preferences = WalletPersistence.getConnectionPreferences()
        setAutoConnectEnabled(preferences.autoConnect)
        setConnectionPreferences(preferences)
      } catch (error) {
        console.error("Error loading preferences:", error)
      }

      // Setup cross-browser sync
      const cleanup = WalletPersistence.setupCrossBrowserSync(() => {
        try {
          // When wallet state changes in another tab
          const currentWallet = WalletPersistence.getSelectedWallet()
          if (currentWallet && currentWallet !== selectedWallet) {
            // Another tab connected a wallet
            if (providers.includes(currentWallet) && connectionPreferences.autoConnect) {
              connectWallet(currentWallet, true)
            }
          } else if (!currentWallet && selectedWallet) {
            // Another tab disconnected the wallet
            disconnectWallet(true)
          }
        } catch (error) {
          console.error("Error in cross-browser sync:", error)
        }
      })

      return cleanup
    } catch (error) {
      console.error("Error initializing wallet providers:", error)
    }
  }, [])

  // Auto-reconnect on page load if session is valid
  useEffect(() => {
    const attemptReconnection = async () => {
      try {
        const persistedWallet = WalletPersistence.getSelectedWallet()
        const sessionValid = WalletPersistence.isSessionValid()
        const shouldAutoConnect = WalletPersistence.shouldAutoConnect()

        if (persistedWallet && sessionValid && shouldAutoConnect && walletProviders.includes(persistedWallet)) {
          try {
            setReconnecting(true)
            await connectWallet(persistedWallet, true)
          } catch (error) {
            console.error("Auto-reconnection failed:", error)
          } finally {
            setReconnecting(false)
          }
        }
      } catch (error) {
        console.error("Error in auto-reconnection:", error)
        setReconnecting(false)
      }
    }

    if (adapter && walletProviders.length > 0 && !connected && !connecting) {
      attemptReconnection()
    }
  }, [adapter, walletProviders, connected, connecting])

  // Refresh session periodically when connected
  useEffect(() => {
    if (connected) {
      // Refresh session timestamp every 5 minutes to extend it
      const intervalId = setInterval(
        () => {
          try {
            WalletPersistence.refreshSession()
          } catch (error) {
            console.error("Error refreshing session:", error)
          }
        },
        5 * 60 * 1000,
      )

      return () => clearInterval(intervalId)
    }
  }, [connected])

  // Connect to wallet
  const connectWallet = useCallback(
    async (providerName?: string, isReconnect = false) => {
      if (!adapter) return

      try {
        if (!isReconnect) {
          setConnecting(true)
        }

        await adapter.connect()

        const walletName = providerName || "phantom"
        setSelectedWallet(walletName)

        // Save connection state
        WalletPersistence.saveSelectedWallet(walletName)
        if (adapter.publicKey) {
          WalletPersistence.saveWalletAddress(adapter.publicKey.toString())
        }

        setPublicKey(adapter.publicKey)
        setConnected(true)

        // Check if user has NFT after connecting
        await checkNFTOwnership()
        await refreshNFTs()

        if (!isReconnect) {
          toast({
            title: "Wallet Connected",
            description: `Successfully connected to ${adapter.publicKey?.toString().slice(0, 4)}...${adapter.publicKey?.toString().slice(-4)}`,
          })
        }
      } catch (error) {
        console.error("Error connecting wallet:", error)

        if (!isReconnect) {
          const errorMessage =
            error instanceof WalletError ? error.message : "Failed to connect wallet. Please try again."

          toast({
            title: "Connection Failed",
            description: errorMessage,
            variant: "destructive",
          })
        }
      } finally {
        if (!isReconnect) {
          setConnecting(false)
        }
      }
    },
    [adapter],
  )

  // Disconnect wallet
  const disconnectWallet = useCallback(
    async (silent = false) => {
      if (!adapter) return

      try {
        await adapter.disconnect()
        setPublicKey(null)
        setConnected(false)
        setSelectedWallet(null)
        setHasNFT(false)
        setMintedNFTs([])

        // Clear persisted data
        WalletPersistence.clearWalletData()

        if (!silent) {
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
          })
        }
      } catch (error) {
        console.error("Error disconnecting wallet:", error)

        if (!silent) {
          toast({
            title: "Disconnection Failed",
            description: "Failed to disconnect wallet. Please try again.",
            variant: "destructive",
          })
        }
      }
    },
    [adapter],
  )

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
      // Check localStorage for minted NFTs
      const mintedNFTsData = localStorage.getItem(`minted_nfts_${publicKey.toString()}`)
      const nfts = mintedNFTsData ? JSON.parse(mintedNFTsData) : []

      const hasMinted = nfts.length > 0
      setHasNFT(hasMinted)
      setMintedNFTs(nfts)
      return hasMinted
    } catch (error) {
      console.error("Error checking NFT ownership:", error)
      return false
    } finally {
      setIsCheckingNFT(false)
    }
  }, [connected, publicKey])

  // Refresh NFTs
  const refreshNFTs = useCallback(async () => {
    if (!connected || !publicKey) return

    try {
      // Get minted NFTs from localStorage
      const mintedNFTsData = localStorage.getItem(`minted_nfts_${publicKey.toString()}`)
      const nfts = mintedNFTsData ? JSON.parse(mintedNFTsData) : []
      setMintedNFTs(nfts)
      setHasNFT(nfts.length > 0)
    } catch (error) {
      console.error("Error refreshing NFTs:", error)
    }
  }, [connected, publicKey])

  // Update auto-connect setting
  useEffect(() => {
    try {
      WalletPersistence.setAutoConnect(autoConnectEnabled)
    } catch (error) {
      console.error("Error setting auto-connect:", error)
    }
  }, [autoConnectEnabled])

  // Context value
  const value = {
    publicKey,
    connected,
    connecting,
    reconnecting,
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
    autoConnectEnabled,
    setAutoConnectEnabled,
    connectionPreferences,
    updateConnectionPreferences,
    mintedNFTs,
    setMintedNFTs,
    refreshNFTs,
  }

  return <PersistentWalletContext.Provider value={value}>{children}</PersistentWalletContext.Provider>
}

// Create the useWallet hook
export function usePersistentWallet() {
  const context = useContext(PersistentWalletContext)
  if (context === undefined) {
    throw new Error("usePersistentWallet must be used within a PersistentWalletProvider")
  }
  return context
}
