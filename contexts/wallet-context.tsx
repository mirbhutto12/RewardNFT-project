"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Connection, PublicKey, type Transaction } from "@solana/web3.js"
import { DEFAULT_RPC_ENDPOINT, DEFAULT_USDC_TOKEN_ADDRESS } from "@/config/solana"
import { getTokenBalance } from "@/utils/token"
import {
  type WalletProvider as WalletProviderUtil,
  detectWallets,
  getWalletProvider,
  isPhantomInstalled,
  isSolflareInstalled,
} from "@/utils/wallet-providers"
import { getOrCreateUser } from "@/services/user-service"
import { createReferralCode } from "@/services/referral-service"
import { updateLeaderboardEntry } from "@/services/leaderboard-service"
import bs58 from "bs58"

interface WalletContextType {
  connected: boolean
  publicKey: PublicKey | null
  connection: Connection
  solBalance: number
  usdcBalance: number
  connecting: boolean
  connectWallet: (walletName?: string) => Promise<void>
  disconnectWallet: () => void
  signAndSendTransaction: (transaction: Transaction) => Promise<string>
  signMessage: ((message: string) => Promise<string>) | null
  refreshBalances: () => Promise<void>
  currentWallet: string | null
  availableWallets: Array<{
    name: string
    icon: string
    installed: boolean
    url: string
  }>
  userId: string | null
  username: string | null
  referralCode: string | null
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  connection: new Connection(DEFAULT_RPC_ENDPOINT),
  solBalance: 0,
  usdcBalance: 0,
  connecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  signAndSendTransaction: async () => "",
  signMessage: null,
  refreshBalances: async () => {},
  currentWallet: null,
  availableWallets: [],
  userId: null,
  username: null,
  referralCode: null,
})

export const useWallet = () => useContext(WalletContext)

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [solBalance, setSolBalance] = useState(0)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [connecting, setConnecting] = useState(false)
  const [connection] = useState(new Connection(DEFAULT_RPC_ENDPOINT))
  const [currentWallet, setCurrentWallet] = useState<string | null>(null)
  const [currentProvider, setCurrentProvider] = useState<WalletProviderUtil | null>(null)
  const [availableWallets, setAvailableWallets] = useState<
    Array<{
      name: string
      icon: string
      installed: boolean
      url: string
    }>
  >([])
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [signMessage, setSignMessage] = useState<((message: string) => Promise<string>) | null>(null)

  // Detect available wallets
  useEffect(() => {
    const wallets = detectWallets()
    setAvailableWallets(
      wallets.map((wallet) => ({
        name: wallet.name,
        icon: wallet.icon,
        installed: wallet.installed,
        url: wallet.url,
      })),
    )
  }, [])

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      // Try to reconnect to Phantom
      if (isPhantomInstalled()) {
        try {
          const provider = getWalletProvider("Phantom")
          if (provider) {
            const response = await provider.connect({ onlyIfTrusted: true })
            const walletPublicKey = new PublicKey(response.publicKey.toString())

            setPublicKey(walletPublicKey)
            setConnected(true)
            setCurrentWallet("Phantom")
            setCurrentProvider(provider)

            // Set up message signing function
            setSignMessage(async (message: string) => {
              const encodedMessage = new TextEncoder().encode(message)
              const signedMessage = await provider.signMessage(encodedMessage)
              return bs58.encode(signedMessage.signature)
            })

            // Refresh balances
            refreshBalances(walletPublicKey)

            // Get or create user in Supabase
            const walletAddress = walletPublicKey.toString()
            const user = await getOrCreateUser(walletAddress)
            if (user) {
              setUserId(user.id)
              setUsername(user.username)

              // Get or create referral code
              const code = await createReferralCode(walletAddress)
              if (code) {
                setReferralCode(code)
              }

              // Initialize leaderboard entry
              await updateLeaderboardEntry({
                walletAddress,
                userId: user.id,
              })
            }
          }
        } catch (error) {
          // Wallet not connected or not trusted, that's okay
          console.log("Phantom wallet not connected:", error)
        }
      }

      // Try to reconnect to Solflare
      if (isSolflareInstalled() && !connected) {
        try {
          const provider = getWalletProvider("Solflare")
          if (provider) {
            const response = await provider.connect({ onlyIfTrusted: true })
            const walletPublicKey = new PublicKey(response.publicKey.toString())

            setPublicKey(walletPublicKey)
            setConnected(true)
            setCurrentWallet("Solflare")
            setCurrentProvider(provider)

            // Set up message signing function
            setSignMessage(async (message: string) => {
              const encodedMessage = new TextEncoder().encode(message)
              const signedMessage = await provider.signMessage(encodedMessage)
              return bs58.encode(signedMessage.signature)
            })

            // Refresh balances
            refreshBalances(walletPublicKey)

            // Get or create user in Supabase
            const walletAddress = walletPublicKey.toString()
            const user = await getOrCreateUser(walletAddress)
            if (user) {
              setUserId(user.id)
              setUsername(user.username)

              // Get or create referral code
              const code = await createReferralCode(walletAddress)
              if (code) {
                setReferralCode(code)
              }

              // Initialize leaderboard entry
              await updateLeaderboardEntry({
                walletAddress,
                userId: user.id,
              })
            }
          }
        } catch (error) {
          // Wallet not connected or not trusted, that's okay
          console.log("Solflare wallet not connected:", error)
        }
      }
    }

    checkWalletConnection()
  }, [])

  // Refresh balances when connected
  const refreshBalances = async (walletPublicKey?: PublicKey) => {
    const key = walletPublicKey || publicKey
    if (!key) return

    try {
      // Get SOL balance
      const solBal = await connection.getBalance(key)
      setSolBalance(solBal / 1e9) // Convert lamports to SOL

      // Get USDC balance
      const usdcBal = await getTokenBalance(connection, key, new PublicKey(DEFAULT_USDC_TOKEN_ADDRESS))
      setUsdcBalance(usdcBal)
    } catch (error) {
      console.error("Error refreshing balances:", error)
    }
  }

  // Connect wallet
  const connectWallet = async (walletName = "Phantom") => {
    const provider = getWalletProvider(walletName)

    if (!provider) {
      // If wallet is not installed, open the installation page
      const wallet = availableWallets.find((w) => w.name.toLowerCase() === walletName.toLowerCase())
      if (wallet) {
        window.open(wallet.url, "_blank")
      }
      return
    }

    try {
      setConnecting(true)
      const response = await provider.connect()
      const walletPublicKey = new PublicKey(response.publicKey.toString())

      setPublicKey(walletPublicKey)
      setConnected(true)
      setCurrentWallet(walletName)
      setCurrentProvider(provider)

      // Set up message signing function
      setSignMessage(async (message: string) => {
        const encodedMessage = new TextEncoder().encode(message)
        const signedMessage = await provider.signMessage(encodedMessage)
        return bs58.encode(signedMessage.signature)
      })

      // Refresh balances
      await refreshBalances(walletPublicKey)

      // Get or create user in Supabase
      const walletAddress = walletPublicKey.toString()
      const user = await getOrCreateUser(walletAddress)
      if (user) {
        setUserId(user.id)
        setUsername(user.username)

        // Get or create referral code
        const code = await createReferralCode(walletAddress)
        if (code) {
          setReferralCode(code)
        }

        // Initialize leaderboard entry
        await updateLeaderboardEntry({
          walletAddress,
          userId: user.id,
        })
      }
    } catch (error) {
      console.error(`Error connecting ${walletName} wallet:`, error)
    } finally {
      setConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    if (currentProvider) {
      try {
        currentProvider.disconnect()
      } catch (error) {
        console.error("Error disconnecting wallet:", error)
      }
    }

    setPublicKey(null)
    setConnected(false)
    setSolBalance(0)
    setUsdcBalance(0)
    setCurrentWallet(null)
    setCurrentProvider(null)
    setUserId(null)
    setUsername(null)
    setReferralCode(null)
    setSignMessage(null)
  }

  // Sign and send transaction
  const signAndSendTransaction = async (transaction: Transaction): Promise<string> => {
    if (!connected || !currentProvider) {
      throw new Error("Wallet not connected")
    }

    try {
      const { signature } = await currentProvider.signAndSendTransaction(transaction)

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed")

      // Refresh balances after transaction
      await refreshBalances()

      return signature
    } catch (error: any) {
      console.error("Error signing transaction:", error)
      throw new Error(error.message || "Failed to sign transaction")
    }
  }

  const value = {
    connected,
    publicKey,
    connection,
    solBalance,
    usdcBalance,
    connecting,
    connectWallet,
    disconnectWallet,
    signAndSendTransaction,
    signMessage,
    refreshBalances,
    currentWallet,
    availableWallets,
    userId,
    username,
    referralCode,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
