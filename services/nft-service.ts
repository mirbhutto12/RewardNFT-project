import type { Connection, PublicKey } from "@solana/web3.js"
import { createNftMintTransaction } from "@/utils/nft"

// Interface for NFT metadata
export interface NFTMetadata {
  name: string
  symbol: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
}

// Interface for minting result
export interface MintResult {
  success: boolean
  transactionId?: string
  error?: string
  mintAddress?: string
}

// NFT Service class
export class NFTService {
  private connection: Connection

  constructor(connection: Connection) {
    this.connection = connection
  }

  // Check if user has sufficient balance
  async checkBalance(walletAddress: PublicKey, requiredAmount = 10): Promise<boolean> {
    try {
      // Get SOL balance
      const solBalance = await this.connection.getBalance(walletAddress)
      const solBalanceInSol = solBalance / 10 ** 9 // Convert lamports to SOL

      // For demo purposes, we're using a conversion rate of 1 SOL = 10 USDC
      const estimatedUsdcBalance = solBalanceInSol * 10

      return estimatedUsdcBalance >= requiredAmount
    } catch (error) {
      console.error("Error checking balance:", error)
      return false
    }
  }

  // Mint NFT
  async mintNFT(walletAddress: PublicKey): Promise<MintResult> {
    try {
      // Check balance first
      const hasBalance = await this.checkBalance(walletAddress)
      if (!hasBalance) {
        return {
          success: false,
          error: "Insufficient balance. You need at least 10 USDC to mint an NFT.",
        }
      }

      // Create mint transaction
      const { transaction, mint } = await createNftMintTransaction(this.connection, walletAddress)

      // In a real implementation, this would be signed by the user's wallet
      // and sent to the blockchain

      // For demo purposes, we'll simulate a successful transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store minting status in localStorage for demo purposes
      localStorage.setItem(`nft_minted_${walletAddress.toString()}`, "true")

      // Return success
      return {
        success: true,
        transactionId: `sim_${Date.now().toString(36)}`,
        mintAddress: mint.publicKey.toString(),
      }
    } catch (error) {
      console.error("Error minting NFT:", error)
      return {
        success: false,
        error: "Failed to mint NFT. Please try again.",
      }
    }
  }

  // Get user's NFTs
  async getUserNFTs(walletAddress: PublicKey): Promise<NFTMetadata[]> {
    try {
      // In a real implementation, you would query the blockchain for NFTs owned by the wallet
      // For demo purposes, we'll return mock data if the user has minted an NFT

      const hasMinted = localStorage.getItem(`nft_minted_${walletAddress.toString()}`) === "true"

      if (!hasMinted) {
        return []
      }

      // Return mock NFT data
      return [
        {
          name: "Reward NFT #1",
          symbol: "RNFT",
          description: "A special NFT for the Reward NFT platform",
          image: "/images/mint-nft-box.png",
          attributes: [
            {
              trait_type: "Rarity",
              value: "Rare",
            },
            {
              trait_type: "Type",
              value: "Reward",
            },
          ],
        },
      ]
    } catch (error) {
      console.error("Error getting user NFTs:", error)
      return []
    }
  }
}

// Create a singleton instance
let nftServiceInstance: NFTService | null = null

// Get NFT service instance
export function getNFTService(connection: Connection): NFTService {
  if (!nftServiceInstance) {
    nftServiceInstance = new NFTService(connection)
  }
  return nftServiceInstance
}
