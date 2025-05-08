// This file replaces phantom-provider.ts with a more generic approach that supports multiple wallets

// Type definitions for wallet providers
export interface WalletProvider {
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>
  disconnect: () => Promise<void>
  signAndSendTransaction: (transaction: any) => Promise<{ signature: string }>
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>
  on: (event: string, callback: (...args: any[]) => void) => void
  off: (event: string, callback: (...args: any[]) => void) => void
}

export interface DetectedWallet {
  name: string
  icon: string
  provider: WalletProvider | null
  installed: boolean
  url: string
}

// Check if Phantom wallet is installed
export function isPhantomInstalled(): boolean {
  return typeof window !== "undefined" && window.phantom?.solana?.isPhantom
}

// Check if Solflare wallet is installed
export function isSolflareInstalled(): boolean {
  return typeof window !== "undefined" && window.solflare?.isSolflare
}

// Get Phantom provider
export function getPhantomProvider(): WalletProvider {
  if (!isPhantomInstalled()) {
    throw new Error("Phantom wallet is not installed")
  }
  return window.phantom.solana
}

// Get Solflare provider
export function getSolflareProvider(): WalletProvider {
  if (!isSolflareInstalled()) {
    throw new Error("Solflare wallet is not installed")
  }
  return window.solflare
}

// Detect available wallets
export function detectWallets(): DetectedWallet[] {
  const wallets: DetectedWallet[] = [
    {
      name: "Phantom",
      icon: "/images/phantom-icon.png",
      provider: isPhantomInstalled() ? getPhantomProvider() : null,
      installed: isPhantomInstalled(),
      url: "https://phantom.app/",
    },
    {
      name: "Solflare",
      icon: "/images/solflare-icon.png",
      provider: isSolflareInstalled() ? getSolflareProvider() : null,
      installed: isSolflareInstalled(),
      url: "https://solflare.com/",
    },
  ]

  return wallets
}

// Get a wallet provider by name
export function getWalletProvider(name: string): WalletProvider | null {
  const wallets = detectWallets()
  const wallet = wallets.find((w) => w.name.toLowerCase() === name.toLowerCase())
  return wallet?.provider || null
}

// Declare global window interface to include wallet providers
declare global {
  interface Window {
    phantom?: {
      solana?: WalletProvider
    }
    solflare?: WalletProvider & {
      isSolflare: boolean
    }
  }
}
