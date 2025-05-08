import { PublicKey } from "@solana/web3.js"

// Network configuration
export type SolanaNetwork = "mainnet" | "devnet" | "testnet"

// Get the current network from environment variables
export const CURRENT_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet") as SolanaNetwork

// Solana RPC endpoints from environment variables or QuikNode providers
export const SOLANA_RPC_ENDPOINTS = {
  mainnet:
    process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC ||
    "https://empty-falling-surf.solana-mainnet.quiknode.pro/6e4bdd1752fdda14b57a96ed5fac5e8cb1a71002",
  devnet:
    process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC ||
    "https://morning-indulgent-energy.solana-devnet.quiknode.pro/450ae68bfe8c733d96e2301292cc52bab5ceb2cf/",
  testnet:
    process.env.NEXT_PUBLIC_SOLANA_TESTNET_RPC ||
    "https://maximum-dawn-yard.solana-testnet.quiknode.pro/eb37711e1abff076a9f561ae4614b24d6f7ca093/",
}

// Default RPC endpoint based on current network
export const DEFAULT_RPC_ENDPOINT = SOLANA_RPC_ENDPOINTS[CURRENT_NETWORK]

// USDC token addresses
export const USDC_TOKEN_ADDRESS = {
  // Use environment variable for mainnet USDC address if provided, otherwise use the official USDC address
  mainnet: new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS || "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
  // For devnet, we'll use a mock token address or the official USDC devnet address if available
  devnet: new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS || "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
  // For testnet, we'll use the same mock token address
  testnet: new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS || "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
}

// Default USDC token address based on current network
export const DEFAULT_USDC_TOKEN_ADDRESS = USDC_TOKEN_ADDRESS[CURRENT_NETWORK]

// Add the USDT token addresses after the USDC token addresses
export const USDT_TOKEN_ADDRESS = {
  // Use environment variable for mainnet USDT address if provided, otherwise use a default address
  mainnet: new PublicKey(process.env.NEXT_PUBLIC_USDT_MINT_ADDRESS || "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
  // For devnet, we'll use a mock token address
  devnet: new PublicKey(process.env.NEXT_PUBLIC_USDT_MINT_ADDRESS || "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
  // For testnet, we'll use the same mock token address
  testnet: new PublicKey(process.env.NEXT_PUBLIC_USDT_MINT_ADDRESS || "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
}

// Default USDT token address based on current network
export const DEFAULT_USDT_TOKEN_ADDRESS = USDT_TOKEN_ADDRESS[CURRENT_NETWORK]

// Platform wallet address to receive payments
export const PLATFORM_WALLET_ADDRESS = new PublicKey(
  process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS || "7C4jsPZpht42Tw6MjXWF56Q5RQUocjBBmciEjDa8HRtp",
)

// NFT minting cost in USDC
export const NFT_MINT_COST_USDC = 10

// NFT metadata
export const NFT_METADATA = {
  name: "RewardNFT Mint Pass",
  symbol: "RNFT",
  description: "Mint and earn with RewardNFT. This is your gateway to quests, referrals, and rewards.",
  image: "/placeholder.svg?key=ascgd",
  attributes: [],
}

// Confirmation settings
export const CONFIRMATION_SETTINGS = {
  maxRetries: 30,
  retryInterval: 2000, // 2 seconds
}

// Solana explorer URLs
export const SOLANA_EXPLORER_URLS = {
  mainnet: "https://explorer.solana.com",
  devnet: "https://explorer.solana.com?cluster=devnet",
  testnet: "https://explorer.solana.com?cluster=testnet",
}

// Default Solana explorer URL based on current network
export const DEFAULT_SOLANA_EXPLORER_URL = SOLANA_EXPLORER_URLS[CURRENT_NETWORK]
