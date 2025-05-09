import type { PublicKey, Transaction } from "@solana/web3.js"

export interface WalletProvider {
  name: string
  icon: string
  url: string
  installed: boolean
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>
}

// Check if Phantom wallet is installed
export function isPhantomInstalled(): boolean {
  const phantom = (window as any).phantom
  return phantom && phantom.solana && phantom.solana.isPhantom
}

// Check if Solflare wallet is installed
export function isSolflareInstalled(): boolean {
  const solflare = (window as any).solflare
  return solflare && solflare.isSolflare
}

// Get a wallet provider by name
export function getWalletProvider(name: string): WalletProvider | null {
  if (name.toLowerCase() === "phantom" && isPhantomInstalled()) {
    return {
      name: "Phantom",
      icon: "/images/phantom-icon.png",
      url: "https://phantom.app/download",
      installed: true,
      connect: (options) => (window as any).phantom.solana.connect(options),
      disconnect: () => (window as any).phantom.solana.disconnect(),
      signAndSendTransaction: (transaction) => (window as any).phantom.solana.signAndSendTransaction(transaction),
      signMessage: (message) => (window as any).phantom.solana.signMessage(message),
    }
  }

  if (name.toLowerCase() === "solflare" && isSolflareInstalled()) {
    return {
      name: "Solflare",
      icon: "/images/solflare-icon.png",
      url: "https://solflare.com/download",
      installed: true,
      connect: (options) => (window as any).solflare.connect(options),
      disconnect: () => (window as any).solflare.disconnect(),
      signAndSendTransaction: (transaction) => (window as any).solflare.signAndSendTransaction(transaction),
      signMessage: (message) => (window as any).solflare.signMessage(message),
    }
  }

  return null
}

// Detect available wallets
export function detectWallets(): WalletProvider[] {
  const wallets: WalletProvider[] = []

  // Check for Phantom
  if (isPhantomInstalled()) {
    wallets.push({
      name: "Phantom",
      icon: "/images/phantom-icon.png",
      url: "https://phantom.app/download",
      installed: true,
      connect: (options) => (window as any).phantom.solana.connect(options),
      disconnect: () => (window as any).phantom.solana.disconnect(),
      signAndSendTransaction: (transaction) => (window as any).phantom.solana.signAndSendTransaction(transaction),
      signMessage: (message) => (window as any).phantom.solana.signMessage(message),
    })
  } else {
    wallets.push({
      name: "Phantom",
      icon: "/images/phantom-icon.png",
      url: "https://phantom.app/download",
      installed: false,
      connect: async () => {
        throw new Error("Phantom wallet not installed")
      },
      disconnect: async () => {
        throw new Error("Phantom wallet not installed")
      },
      signAndSendTransaction: async () => {
        throw new Error("Phantom wallet not installed")
      },
      signMessage: async () => {
        throw new Error("Phantom wallet not installed")
      },
    })
  }

  // Check for Solflare
  if (isSolflareInstalled()) {
    wallets.push({
      name: "Solflare",
      icon: "/images/solflare-icon.png",
      url: "https://solflare.com/download",
      installed: true,
      connect: (options) => (window as any).solflare.connect(options),
      disconnect: () => (window as any).solflare.disconnect(),
      signAndSendTransaction: (transaction) => (window as any).solflare.signAndSendTransaction(transaction),
      signMessage: (message) => (window as any).solflare.signMessage(message),
    })
  } else {
    wallets.push({
      name: "Solflare",
      icon: "/images/solflare-icon.png",
      url: "https://solflare.com/download",
      installed: false,
      connect: async () => {
        throw new Error("Solflare wallet not installed")
      },
      disconnect: async () => {
        throw new Error("Solflare wallet not installed")
      },
      signAndSendTransaction: async () => {
        throw new Error("Solflare wallet not installed")
      },
      signMessage: async () => {
        throw new Error("Solflare wallet not installed")
      },
    })
  }

  return wallets
}
