/**
 * Enhanced Wallet Persistence Service
 * Handles cross-page wallet connection persistence
 */

// Storage keys
const STORAGE_KEYS = {
  SELECTED_WALLET: "solana_selected_wallet",
  CONNECTION_TIMESTAMP: "solana_connection_timestamp",
  AUTO_CONNECT: "solana_auto_connect",
  WALLET_ADDRESS: "solana_wallet_address",
  SESSION_TOKEN: "solana_session_token",
  PREFERRED_WALLET: "solana_preferred_wallet",
  CONNECTION_PREFERENCES: "solana_connection_preferences",
} as const

// Session duration (24 hours)
const SESSION_DURATION = 24 * 60 * 60 * 1000

export interface WalletSession {
  walletName: string
  address: string
  timestamp: number
  sessionToken: string
}

export interface WalletConnectionPreferences {
  autoConnect: boolean
  rememberWallet: boolean
  sessionDuration: number
}

// Default preferences
const DEFAULT_PREFERENCES: WalletConnectionPreferences = {
  autoConnect: true,
  rememberWallet: true,
  sessionDuration: SESSION_DURATION,
}

/**
 * Get connection preferences
 */
export function getConnectionPreferences(): WalletConnectionPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONNECTION_PREFERENCES)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_PREFERENCES, ...parsed }
    }
    return DEFAULT_PREFERENCES
  } catch (error) {
    console.error("Failed to get connection preferences:", error)
    return DEFAULT_PREFERENCES
  }
}

/**
 * Save connection preferences
 */
export function saveConnectionPreferences(preferences: Partial<WalletConnectionPreferences>): void {
  if (typeof window === "undefined") return

  try {
    const current = getConnectionPreferences()
    const updated = { ...current, ...preferences }
    localStorage.setItem(STORAGE_KEYS.CONNECTION_PREFERENCES, JSON.stringify(updated))
  } catch (error) {
    console.error("Failed to save connection preferences:", error)
  }
}

/**
 * Save wallet session
 */
export function saveWalletSession(walletName: string, address: string): void {
  if (typeof window === "undefined") return

  try {
    const session: WalletSession = {
      walletName,
      address,
      timestamp: Date.now(),
      sessionToken: generateSessionToken(),
    }

    localStorage.setItem(STORAGE_KEYS.SELECTED_WALLET, walletName)
    localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address)
    localStorage.setItem(STORAGE_KEYS.CONNECTION_TIMESTAMP, session.timestamp.toString())
    localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, session.sessionToken)

    // Set preferred wallet
    localStorage.setItem(STORAGE_KEYS.PREFERRED_WALLET, walletName)
  } catch (error) {
    console.error("Failed to save wallet session:", error)
  }
}

/**
 * Save selected wallet
 */
export function saveSelectedWallet(walletName: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_WALLET, walletName)
    localStorage.setItem(STORAGE_KEYS.PREFERRED_WALLET, walletName)
  } catch (error) {
    console.error("Failed to save selected wallet:", error)
  }
}

/**
 * Save wallet address
 */
export function saveWalletAddress(address: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address)
  } catch (error) {
    console.error("Failed to save wallet address:", error)
  }
}

/**
 * Get selected wallet
 */
export function getSelectedWallet(): string | null {
  if (typeof window === "undefined") return null

  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_WALLET)
  } catch (error) {
    console.error("Failed to get selected wallet:", error)
    return null
  }
}

/**
 * Get wallet session
 */
export function getWalletSession(): WalletSession | null {
  if (typeof window === "undefined") return null

  try {
    const walletName = localStorage.getItem(STORAGE_KEYS.SELECTED_WALLET)
    const address = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS)
    const timestamp = localStorage.getItem(STORAGE_KEYS.CONNECTION_TIMESTAMP)
    const sessionToken = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN)

    if (!walletName || !address || !timestamp || !sessionToken) {
      return null
    }

    return {
      walletName,
      address,
      timestamp: Number.parseInt(timestamp, 10),
      sessionToken,
    }
  } catch (error) {
    console.error("Failed to get wallet session:", error)
    return null
  }
}

/**
 * Check if session is valid
 */
export function isSessionValid(): boolean {
  const session = getWalletSession()
  if (!session) return false

  const preferences = getConnectionPreferences()
  const now = Date.now()
  const sessionAge = now - session.timestamp

  return sessionAge < preferences.sessionDuration
}

/**
 * Refresh session timestamp
 */
export function refreshSession(): void {
  if (typeof window === "undefined") return

  try {
    const session = getWalletSession()
    if (session) {
      localStorage.setItem(STORAGE_KEYS.CONNECTION_TIMESTAMP, Date.now().toString())
    }
  } catch (error) {
    console.error("Failed to refresh session:", error)
  }
}

/**
 * Get preferred wallet
 */
export function getPreferredWallet(): string {
  if (typeof window === "undefined") return "phantom"

  try {
    return localStorage.getItem(STORAGE_KEYS.PREFERRED_WALLET) || "phantom"
  } catch (error) {
    return "phantom"
  }
}

/**
 * Set preferred wallet
 */
export function setPreferredWallet(walletName: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.PREFERRED_WALLET, walletName)
  } catch (error) {
    console.error("Failed to set preferred wallet:", error)
  }
}

/**
 * Clear wallet session
 */
export function clearWalletSession(): void {
  if (typeof window === "undefined") return

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error("Failed to clear wallet session:", error)
  }
}

/**
 * Clear wallet data
 */
export function clearWalletData(): void {
  clearWalletSession()
}

/**
 * Should auto-connect on page load
 */
export function shouldAutoConnect(): boolean {
  if (typeof window === "undefined") return false

  try {
    const preferences = getConnectionPreferences()
    return preferences.autoConnect
  } catch (error) {
    return true
  }
}

/**
 * Set auto-connect preference
 */
export function setAutoConnect(enabled: boolean): void {
  if (typeof window === "undefined") return

  try {
    const preferences = getConnectionPreferences()
    saveConnectionPreferences({ ...preferences, autoConnect: enabled })
  } catch (error) {
    console.error("Failed to set auto-connect:", error)
  }
}

/**
 * Generate session token
 */
function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Cross-tab synchronization
 */
export function setupCrossBrowserSync(onSessionChange: () => void): () => void {
  if (typeof window === "undefined") return () => {}

  const handleStorageChange = (event: StorageEvent) => {
    if (Object.values(STORAGE_KEYS).includes(event.key as any)) {
      onSessionChange()
    }
  }

  window.addEventListener("storage", handleStorageChange)
  return () => window.removeEventListener("storage", handleStorageChange)
}

/**
 * Cross-tab synchronization (alias for compatibility)
 */
export function setupCrossTabSync(onSessionChange: () => void): () => void {
  return setupCrossBrowserSync(onSessionChange)
}
