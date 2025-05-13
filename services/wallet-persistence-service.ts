/**
 * Wallet Persistence Service
 *
 * Handles storing and retrieving wallet connection state
 * in a secure and reliable manner.
 */

// Constants for storage keys
const STORAGE_KEYS = {
  SELECTED_WALLET: "solana_selected_wallet",
  CONNECTION_TIMESTAMP: "solana_connection_timestamp",
  AUTO_CONNECT: "solana_auto_connect",
  CONNECTION_PREFERENCES: "solana_connection_preferences",
  LAST_CONNECTED_ADDRESS: "solana_last_address",
  SESSION_DURATION: "solana_session_duration",
}

// Default session duration in milliseconds (24 hours)
const DEFAULT_SESSION_DURATION = 24 * 60 * 60 * 1000

// Interface for connection preferences
export interface WalletConnectionPreferences {
  autoConnect: boolean
  rememberWallet: boolean
  sessionDuration: number
  lastWallet: string | null
}

// Default connection preferences
const DEFAULT_PREFERENCES: WalletConnectionPreferences = {
  autoConnect: true,
  rememberWallet: true,
  sessionDuration: DEFAULT_SESSION_DURATION,
  lastWallet: null,
}

/**
 * Save the selected wallet provider to localStorage
 */
export function saveSelectedWallet(walletName: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_WALLET, walletName)
    localStorage.setItem(STORAGE_KEYS.CONNECTION_TIMESTAMP, Date.now().toString())
  } catch (error) {
    console.error("Failed to save wallet selection:", error)
  }
}

/**
 * Get the selected wallet provider from localStorage
 */
export function getSelectedWallet(): string | null {
  if (typeof window === "undefined") return null

  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_WALLET)
  } catch (error) {
    console.error("Failed to get wallet selection:", error)
    return null
  }
}

/**
 * Save the last connected wallet address
 */
export function saveWalletAddress(address: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.LAST_CONNECTED_ADDRESS, address)
  } catch (error) {
    console.error("Failed to save wallet address:", error)
  }
}

/**
 * Get the last connected wallet address
 */
export function getWalletAddress(): string | null {
  if (typeof window === "undefined") return null

  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_CONNECTED_ADDRESS)
  } catch (error) {
    console.error("Failed to get wallet address:", error)
    return null
  }
}

/**
 * Clear all wallet connection data
 */
export function clearWalletData(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_WALLET)
    localStorage.removeItem(STORAGE_KEYS.CONNECTION_TIMESTAMP)
    localStorage.removeItem(STORAGE_KEYS.LAST_CONNECTED_ADDRESS)
  } catch (error) {
    console.error("Failed to clear wallet data:", error)
  }
}

/**
 * Check if the wallet session is still valid
 */
export function isSessionValid(): boolean {
  if (typeof window === "undefined") return false

  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.CONNECTION_TIMESTAMP)
    if (!timestamp) return false

    const preferences = getConnectionPreferences()
    const sessionDuration = preferences.sessionDuration

    const connectionTime = Number.parseInt(timestamp, 10)
    const currentTime = Date.now()

    return currentTime - connectionTime < sessionDuration
  } catch (error) {
    console.error("Failed to check session validity:", error)
    return false
  }
}

/**
 * Save connection preferences
 */
export function saveConnectionPreferences(preferences: Partial<WalletConnectionPreferences>): void {
  if (typeof window === "undefined") return

  try {
    const currentPreferences = getConnectionPreferences()
    const updatedPreferences = { ...currentPreferences, ...preferences }

    localStorage.setItem(STORAGE_KEYS.CONNECTION_PREFERENCES, JSON.stringify(updatedPreferences))
  } catch (error) {
    console.error("Failed to save connection preferences:", error)
  }
}

/**
 * Get connection preferences
 */
export function getConnectionPreferences(): WalletConnectionPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES

  try {
    const preferencesJson = localStorage.getItem(STORAGE_KEYS.CONNECTION_PREFERENCES)
    if (!preferencesJson) return DEFAULT_PREFERENCES

    return { ...DEFAULT_PREFERENCES, ...JSON.parse(preferencesJson) }
  } catch (error) {
    console.error("Failed to get connection preferences:", error)
    return DEFAULT_PREFERENCES
  }
}

/**
 * Set auto-connect preference
 */
export function setAutoConnect(autoConnect: boolean): void {
  saveConnectionPreferences({ autoConnect })
}

/**
 * Check if auto-connect is enabled
 */
export function shouldAutoConnect(): boolean {
  return getConnectionPreferences().autoConnect
}

/**
 * Update session timestamp to extend the session
 */
export function refreshSession(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEYS.CONNECTION_TIMESTAMP, Date.now().toString())
  } catch (error) {
    console.error("Failed to refresh session:", error)
  }
}

/**
 * Set session duration
 */
export function setSessionDuration(duration: number): void {
  saveConnectionPreferences({ sessionDuration: duration })
}

/**
 * Synchronize wallet state across tabs
 */
export function setupCrossBrowserSync(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {}

  const handleStorageChange = (event: StorageEvent) => {
    if (Object.values(STORAGE_KEYS).includes(event.key as string)) {
      callback()
    }
  }

  window.addEventListener("storage", handleStorageChange)

  return () => {
    window.removeEventListener("storage", handleStorageChange)
  }
}
