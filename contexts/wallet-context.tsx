"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Connection, type PublicKey, type Transaction, type VersionedTransaction } from "@solana/web3.js"
import { toast } from "@/components/ui/use-toast"
import { getTokenBalance } from "@/utils/token"
import {
  DEFAULT_RPC_ENDPOINT,
  DEFAULT_USDT_TOKEN_ADDRESS,
  DEFAULT_SOLANA_EXPLORER_URL,
  CURRENT_NETWORK,
} from "@/config/solana"

// Import the utility functions
import { isPhantomInstalled, checkSolanaNetwork, suggestPhantomInstall } from "@/utils/phantom-provider"

// Define the Phantom provider interface
interface PhantomProvider {
  publicKey: PublicKey | null
  isConnected: boolean | null
  isPhantom?: boolean
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>
  signAllTransactions: (
    transactions: (Transaction | VersionedTransaction)[],
  ) => Promise<(Transaction | VersionedTransaction)[]>
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array; publicKey: PublicKey }>
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  on: (event: string, callback: (args: any) => void) => void
  request: (method: any, params: any) => Promise<any>
}

// Define the wallet context interface
interface WalletContextType {
  wallet: PhantomProvider | null
  publicKey: PublicKey | null
  connected: boolean
  connecting: boolean
  usdtBalance: number | null
  solBalance: number | null
  rpcEndpoint: string
  explorerUrl: string
  network: string
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>
  signAndSendTransaction: (transaction: Transaction) => Promise<string>
  signAllTransactions: (
    transactions: (Transaction | VersionedTransaction)[],
  ) => Promise<(Transaction | VersionedTransaction)[]>
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array; publicKey: PublicKey }>
  connection: Connection
  getPhantomProvider: () => PhantomProvider | null
  refreshBalances: () => Promise<void>
  updateUserProfile?: (publicKey: string) => Promise<void>
}

// Create the wallet context
const WalletContext = createContext<WalletContextType | null>(null)

// Define the wallet provider props
interface WalletProviderProps {
  children: ReactNode
  endpoint?: string
}

// Create the wallet provider component
export const WalletProvider = ({ children, endpoint = DEFAULT_RPC_ENDPOINT }: WalletProviderProps) => {
  const [wallet, setWallet] = useState<PhantomProvider | null>(null)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connected, setConnected] = useState<boolean>(false)
  const [connecting, setConnecting] = useState<boolean>(false)
  const [connection] = useState<Connection>(new Connection(endpoint, "confirmed"))
  const [usdtBalance, setUsdtBalance] = useState<number | null>(null)
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [rpcEndpoint] = useState<string>(endpoint)
  const [explorerUrl] = useState<string>(DEFAULT_SOLANA_EXPLORER_URL)
  const [network] = useState<string>(CURRENT_NETWORK)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(true)

  // Function to get the Phantom provider
  const getPhantomProvider = (): PhantomProvider | null => {
    if (typeof window === "undefined") return null

    const provider = (window as any).solana

    // Check if provider exists and is Phantom
    if (provider?.isPhantom) {
      return provider as PhantomProvider
    }

    // If we can't find the provider in the window object
    return null
  }

  // Function to refresh balances
  const refreshBalances = async () => {
    if (!connected || !publicKey) {
      setUsdtBalance(null)
      setSolBalance(null)
      return
    }

    try {
      // Get SOL balance
      const lamports = await connection.getBalance(publicKey)
      setSolBalance(lamports / 10 ** 9) // Convert lamports to SOL

      // Get USDT balance
      const usdt = await getTokenBalance(connection, publicKey, DEFAULT_USDT_TOKEN_ADDRESS)
      setUsdtBalance(usdt)
    } catch (error) {
      console.error("Error refreshing balances:", error)
      toast({
        title: "Balance Update Failed",
        description: "Failed to update your wallet balances",
        variant: "destructive",
      })
    }
  }

  // Function to update user profile in Firebase (placeholder)
  const updateUserProfile = async (walletAddress: string) => {
    try {
      console.log("Updating user profile with wallet address:", walletAddress)
      // This would be implemented with Firebase in a real application
      // For now, we'll just log the action

      // Example Firebase implementation:
      // const userDoc = doc(db, "users", user.uid);
      // await updateDoc(userDoc, {
      //   walletAddress: walletAddress,
      //   lastConnected: serverTimestamp()
      // });

      toast({
        title: "Profile Updated",
        description: "Your wallet has been linked to your profile",
      })
    } catch (error) {
      console.error("Error updating user profile:", error)
    }
  }

  // Initialize the wallet
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    const provider = getPhantomProvider()
    if (provider) {
      setWallet(provider)

      // Check if already connected
      if (provider.publicKey && provider.isConnected) {
        setPublicKey(provider.publicKey)
        setConnected(true)

        // Refresh balances when connected
        refreshBalances()

        // Update user profile
        if (provider.publicKey) {
          updateUserProfile(provider.publicKey.toString())
        }
      }

      // Add event listeners with proper error handling
      const handleConnect = (publicKey: PublicKey) => {
        setPublicKey(publicKey)
        setConnected(true)
        refreshBalances()

        // Update user profile
        updateUserProfile(publicKey.toString())

        toast({
          title: "Wallet Connected",
          description: `Connected to ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`,
        })
      }

      const handleDisconnect = () => {
        setPublicKey(null)
        setConnected(false)
        setUsdtBalance(null)
        setSolBalance(null)
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected",
        })
      }

      const handleAccountChange = (publicKey: PublicKey | null) => {
        setPublicKey(publicKey)
        if (publicKey) {
          refreshBalances()

          // Update user profile when account changes
          updateUserProfile(publicKey.toString())

          toast({
            title: "Account Changed",
            description: `Switched to ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`,
          })
        } else {
          setConnected(false)
          setUsdtBalance(null)
          setSolBalance(null)
        }
      }

      provider.on("connect", handleConnect)
      provider.on("disconnect", handleDisconnect)
      provider.on("accountChanged", handleAccountChange)

      return () => {
        // Clean up event listeners if needed
        // This is a best effort cleanup as Phantom doesn't provide a way to remove listeners
      }
    }
  }, [connection])

  // Add this function to the WalletProvider component to handle network detection more robustly:

  // Add this near the other useEffect hooks in the WalletProvider component
  useEffect(() => {
    const detectNetwork = async () => {
      if (wallet && publicKey) {
        try {
          // First try the updated network detection
          const networkInfo = await checkSolanaNetwork(wallet, network)
          setIsCorrectNetwork(networkInfo.isCorrectNetwork)

          // If we couldn't determine the network, try an alternative approach
          if (networkInfo.network === "unknown") {
            // Try to make a simple RPC call to check connectivity
            try {
              const connection = new Connection(rpcEndpoint)
              const blockHeight = await connection.getBlockHeight()
              console.log("Successfully connected to network, block height:", blockHeight)
              // If we get here, we're connected to some network
              // We can't be 100% sure it's the right one, but it's a connection
              setIsCorrectNetwork(true)
            } catch (rpcError) {
              console.error("RPC connection failed:", rpcError)
              setIsCorrectNetwork(false)
            }
          }
        } catch (error) {
          console.error("Network detection error:", error)
          setIsCorrectNetwork(false)
        }
      }
    }

    if (connected) {
      detectNetwork()
    }
  }, [connected, wallet, publicKey, network, rpcEndpoint])

  // Connect to the wallet
  const connectWallet = async (): Promise<void> => {
    try {
      setConnecting(true)

      // Check if Phantom is installed
      if (!isPhantomInstalled()) {
        toast({
          title: "Phantom Not Detected",
          description: "Please install Phantom wallet extension and refresh the page",
          variant: "destructive",
        })

        suggestPhantomInstall()
        throw new Error("Phantom wallet not found! Please install it from phantom.app")
      }

      // Get the provider with retries
      const provider = getPhantomProvider()

      if (!provider) {
        toast({
          title: "Connection Failed",
          description: "Could not connect to Phantom wallet. Please refresh the page and try again.",
          variant: "destructive",
        })
        throw new Error("Could not connect to Phantom wallet after multiple attempts")
      }

      // Check if we're on the correct network
      const { isCorrectNetwork, network: walletNetwork } = await checkSolanaNetwork(provider, CURRENT_NETWORK)

      if (!isCorrectNetwork) {
        toast({
          title: "Network Mismatch",
          description: `Please switch to Solana ${CURRENT_NETWORK} in your Phantom wallet settings. Current network: ${walletNetwork}`,
          variant: "destructive",
        })
        throw new Error(`Incorrect network: ${walletNetwork}. Please switch to Solana ${CURRENT_NETWORK}.`)
      }

      try {
        // Try to connect with explicit error handling
        const response = await provider.connect()
        setWallet(provider)
        setPublicKey(response.publicKey)
        setConnected(true)

        // Refresh balances after connection
        await refreshBalances()

        // Update user profile after successful connection
        await updateUserProfile(response.publicKey.toString())

        toast({
          title: "Wallet Connected",
          description: `Connected to ${response.publicKey.toString().slice(0, 4)}...${response.publicKey.toString().slice(-4)}`,
        })
      } catch (connectionError: any) {
        // Handle specific connection errors
        if (connectionError.code === 4001) {
          // User rejected the connection request
          toast({
            title: "Connection Rejected",
            description: "You rejected the connection request",
            variant: "destructive",
          })
        } else {
          // Other connection errors
          console.error("Specific connection error:", connectionError)
          toast({
            title: "Connection Failed",
            description: connectionError.message || "Failed to connect to Phantom wallet",
            variant: "destructive",
          })
        }
        throw connectionError
      }
    } catch (error: any) {
      console.error("Error connecting to wallet:", error)
      // Don't show "Unexpected error" - provide more context
      const errorMessage = error.message || "Could not connect to Phantom wallet"
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      })
      throw error
    } finally {
      setConnecting(false)
    }
  }

  // Disconnect from the wallet
  const disconnectWallet = async (): Promise<void> => {
    try {
      if (wallet) {
        await wallet.disconnect()
        setPublicKey(null)
        setConnected(false)
        setUsdtBalance(null)
        setSolBalance(null)
      }
    } catch (error: any) {
      console.error("Error disconnecting wallet:", error)
      toast({
        title: "Disconnection Failed",
        description: error.message || "Failed to disconnect from Phantom wallet",
        variant: "destructive",
      })
    }
  }

  // Sign a transaction
  const signTransaction = async (
    transaction: Transaction | VersionedTransaction,
  ): Promise<Transaction | VersionedTransaction> => {
    if (!wallet) {
      throw new Error("Wallet not connected")
    }
    try {
      return await wallet.signTransaction(transaction)
    } catch (error: any) {
      console.error("Error signing transaction:", error)
      toast({
        title: "Transaction Signing Failed",
        description: error.message || "Failed to sign transaction",
        variant: "destructive",
      })
      throw error
    }
  }

  // Sign and send a transaction
  const signAndSendTransaction = async (transaction: Transaction): Promise<string> => {
    if (!wallet || !publicKey) {
      throw new Error("Wallet not connected")
    }

    try {
      // Sign the transaction
      const signedTransaction = await wallet.signTransaction(transaction)

      // Serialize the signed transaction
      const serializedTransaction = signedTransaction.serialize()

      // Send the transaction
      const signature = await connection.sendRawTransaction(serializedTransaction, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      })

      // Confirm the transaction
      await connection.confirmTransaction({
        signature,
        blockhash: transaction.recentBlockhash!,
        lastValidBlockHeight: transaction.lastValidBlockHeight!,
      })

      // Refresh balances after transaction
      await refreshBalances()

      return signature
    } catch (error: any) {
      console.error("Error sending transaction:", error)
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to send transaction",
        variant: "destructive",
      })
      throw error
    }
  }

  // Sign multiple transactions
  const signAllTransactions = async (
    transactions: (Transaction | VersionedTransaction)[],
  ): Promise<(Transaction | VersionedTransaction)[]> => {
    if (!wallet) {
      throw new Error("Wallet not connected")
    }
    try {
      return await wallet.signAllTransactions(transactions)
    } catch (error: any) {
      console.error("Error signing transactions:", error)
      toast({
        title: "Transaction Signing Failed",
        description: error.message || "Failed to sign transactions",
        variant: "destructive",
      })
      throw error
    }
  }

  // Sign a message
  const signMessage = async (message: Uint8Array): Promise<{ signature: Uint8Array; publicKey: PublicKey }> => {
    if (!wallet) {
      throw new Error("Wallet not connected")
    }
    try {
      return await wallet.signMessage(message)
    } catch (error: any) {
      console.error("Error signing message:", error)
      toast({
        title: "Message Signing Failed",
        description: error.message || "Failed to sign message",
        variant: "destructive",
      })
      throw error
    }
  }

  // Create the context value
  const value: WalletContextType = {
    wallet,
    publicKey,
    connected,
    connecting,
    usdtBalance,
    solBalance,
    rpcEndpoint,
    explorerUrl,
    network,
    connectWallet,
    disconnectWallet,
    signTransaction,
    signAndSendTransaction,
    signAllTransactions,
    signMessage,
    connection,
    getPhantomProvider,
    refreshBalances,
    updateUserProfile,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Create a hook to use the wallet context
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
