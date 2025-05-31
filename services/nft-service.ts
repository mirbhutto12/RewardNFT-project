import { Connection, PublicKey, Transaction, Keypair, SystemProgram } from "@solana/web3.js"
import {
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createTransferInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token"
import { PLATFORM_WALLET_ADDRESS } from "@/config/solana"

export interface NFTMintResult {
  success: boolean
  nftMint?: string
  signature?: string
  error?: string
}

export interface NFT {
  mint: string
  name: string
  image: string
  attributes: Array<{ trait_type: string; value: string }>
  collection?: string
  owner?: string
}

export class NFTService {
  private connection: Connection
  private isInitialized = false

  // Multiple USDC mint addresses to check
  private USDC_MINTS = [
    "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr", // Your USDC-Dev mint
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // Official devnet USDC
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Mainnet USDC (sometimes used)
  ]

  constructor(connection?: Connection) {
    try {
      this.connection = connection || new Connection("https://api.devnet.solana.com")
      this.isInitialized = true

      // Bind methods to ensure they're available
      this.hasUserMinted = this.hasUserMinted.bind(this)
      this.markUserAsMinted = this.markUserAsMinted.bind(this)
      this.mintNFT = this.mintNFT.bind(this)
      this.getNFTsByOwner = this.getNFTsByOwner.bind(this)
      this.getNFTMetadata = this.getNFTMetadata.bind(this)
      this.setConnection = this.setConnection.bind(this)

      console.log("NFTService initialized successfully")
    } catch (error) {
      console.error("Error initializing NFTService:", error)
      this.isInitialized = false
    }
  }

  // Check if service is properly initialized
  private checkInitialization(): void {
    if (!this.isInitialized) {
      throw new Error("NFTService is not properly initialized")
    }
  }

  setConnection = (connection: Connection): void => {
    try {
      this.connection = connection
      this.isInitialized = true
      console.log("NFTService connection updated")
    } catch (error) {
      console.error("Error setting connection:", error)
      throw new Error("Failed to set connection")
    }
  }

  // Check if user has already minted (localStorage check)
  hasUserMinted = async (userWallet: PublicKey): Promise<boolean> => {
    try {
      this.checkInitialization()

      if (!userWallet) {
        throw new Error("User wallet is required")
      }

      console.log(`Checking mint status for wallet: ${userWallet.toString()}`)

      // Check localStorage for minted wallets
      if (typeof window !== "undefined") {
        try {
          const mintedWallets = JSON.parse(localStorage.getItem("mintedWallets") || "[]")

          if (!Array.isArray(mintedWallets)) {
            console.warn("Invalid mintedWallets data in localStorage, resetting")
            localStorage.setItem("mintedWallets", "[]")
            return false
          }

          const hasMinted = mintedWallets.includes(userWallet.toString())
          console.log(`Mint status from localStorage: ${hasMinted}`)
          return hasMinted
        } catch (storageError) {
          console.error("Error reading from localStorage:", storageError)
          return false
        }
      }

      // If no localStorage (server-side), return false
      console.log("localStorage not available (SSR), returning false")
      return false
    } catch (error) {
      console.error("Error checking mint status:", error)
      return false
    }
  }

  // Mark user as minted
  markUserAsMinted = (userWallet: PublicKey): void => {
    try {
      this.checkInitialization()

      if (!userWallet) {
        throw new Error("User wallet is required")
      }

      if (typeof window !== "undefined") {
        try {
          const mintedWallets = JSON.parse(localStorage.getItem("mintedWallets") || "[]")

          if (!Array.isArray(mintedWallets)) {
            console.warn("Invalid mintedWallets data, creating new array")
            localStorage.setItem("mintedWallets", JSON.stringify([userWallet.toString()]))
            return
          }

          if (!mintedWallets.includes(userWallet.toString())) {
            mintedWallets.push(userWallet.toString())
            localStorage.setItem("mintedWallets", JSON.stringify(mintedWallets))
            console.log(`Marked wallet as minted: ${userWallet.toString()}`)
          } else {
            console.log(`Wallet already marked as minted: ${userWallet.toString()}`)
          }
        } catch (storageError) {
          console.error("Error writing to localStorage:", storageError)
          throw new Error("Failed to mark user as minted")
        }
      } else {
        console.warn("localStorage not available (SSR)")
      }
    } catch (error) {
      console.error("Error marking user as minted:", error)
      throw error
    }
  }

  // Get NFT metadata (simplified)
  getNFTMetadata = (tokenNumber: number): any => {
    try {
      this.checkInitialization()

      if (typeof tokenNumber !== "number" || tokenNumber < 1) {
        throw new Error("Valid token number is required")
      }

      return {
        name: `RewardNFT #${tokenNumber}`,
        symbol: "RNFT",
        description:
          "Exclusive membership NFT for the Reward Platform. Grants access to referrals, quests, and special rewards.",
        image: "https://quicknode.quicknode-ipfs.com/ipfs/QmWrmCfPm6L85p1o8KMc9WZCsdwsgW89n37nQMJ6UCVYNW",
        external_url: "https://reward-nft-platform.vercel.app",
        attributes: [
          { trait_type: "Collection", value: "RewardNFT" },
          { trait_type: "Rarity", value: "Legendary" },
          { trait_type: "Type", value: "Membership" },
          { trait_type: "Utility", value: "Referral Access" },
          { trait_type: "Mint Number", value: tokenNumber.toString() },
        ],
        properties: {
          files: [
            {
              uri: "https://quicknode.quicknode-ipfs.com/ipfs/QmWrmCfPm6L85p1o8KMc9WZCsdwsgW89n37nQMJ6UCVYNW",
              type: "image/png",
            },
          ],
          category: "image",
        },
      }
    } catch (error) {
      console.error("Error getting NFT metadata:", error)
      throw error
    }
  }

  // Get NFTs by owner
  getNFTsByOwner = async (owner: string | PublicKey): Promise<NFT[]> => {
    try {
      this.checkInitialization()

      if (!owner) {
        throw new Error("Owner is required")
      }

      const ownerPublicKey = typeof owner === "string" ? new PublicKey(owner) : owner
      console.log(`Fetching NFTs for owner: ${ownerPublicKey.toString()}`)

      // For now, return mock data since we're using simplified minting
      const hasMinted = await this.hasUserMinted(ownerPublicKey)

      if (hasMinted) {
        return [
          {
            mint: "mock-nft-mint-address",
            name: "RewardNFT #1",
            image: "https://quicknode.quicknode-ipfs.com/ipfs/QmWrmCfPm6L85p1o8KMc9WZCsdwsgW89n37nQMJ6UCVYNW",
            attributes: [
              { trait_type: "Collection", value: "RewardNFT" },
              { trait_type: "Rarity", value: "Legendary" },
            ],
            owner: ownerPublicKey.toString(),
          },
        ]
      }

      return []
    } catch (error) {
      console.error("Error fetching NFTs by owner:", error)
      throw error
    }
  }

  // Find which USDC mint the user has balance in
  private async findUserUSDCAccount(userWallet: PublicKey): Promise<{
    mint: PublicKey
    tokenAccount: PublicKey
    balance: number
  } | null> {
    for (const mintAddress of this.USDC_MINTS) {
      try {
        const mint = new PublicKey(mintAddress)
        const tokenAccount = await getAssociatedTokenAddress(mint, userWallet)

        const accountInfo = await getAccount(this.connection, tokenAccount)
        const balance = Number(accountInfo.amount) / 1_000_000 // Convert to USDC

        if (balance > 0) {
          console.log(
            `Found USDC account: ${tokenAccount.toString()} with balance: ${balance} for mint: ${mintAddress}`,
          )
          return { mint, tokenAccount, balance }
        }
      } catch (error) {
        console.log(`No USDC account found for mint: ${mintAddress}`)
        continue
      }
    }
    return null
  }

  // Get fresh blockhash with retry
  private async getFreshBlockhash(retries = 3): Promise<{
    blockhash: string
    lastValidBlockHeight: number
  }> {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await this.connection.getLatestBlockhash("confirmed")
        console.log(`Got fresh blockhash (attempt ${i + 1}):`, result.blockhash)
        return result
      } catch (error) {
        console.error(`Failed to get blockhash (attempt ${i + 1}):`, error)
        if (i === retries - 1) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
    throw new Error("Failed to get blockhash after retries")
  }

  // Simplified NFT minting with USDC payment
  mintNFT = async (
    minter: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
    price = 10, // 10 USDC default
  ): Promise<NFTMintResult> => {
    try {
      this.checkInitialization()

      if (!minter || !signTransaction) {
        throw new Error("Minter wallet and signTransaction function are required")
      }

      console.log("Starting NFT mint process...")
      console.log("Minter wallet:", minter.toString())
      console.log("Required price:", price, "USDC")

      // 1. Find user's USDC account
      const usdcAccount = await this.findUserUSDCAccount(minter)

      if (!usdcAccount) {
        return {
          success: false,
          error: "No USDC account found. Please ensure you have USDC-Dev tokens in your wallet.",
        }
      }

      console.log("Found USDC account:", {
        mint: usdcAccount.mint.toString(),
        account: usdcAccount.tokenAccount.toString(),
        balance: usdcAccount.balance,
      })

      // 2. Check sufficient balance
      if (usdcAccount.balance < price) {
        return {
          success: false,
          error: `Insufficient USDC balance. Required: ${price} USDC, Available: ${usdcAccount.balance.toFixed(2)} USDC`,
        }
      }

      // 3. Create company USDC account for the same mint
      const companyUSDCAccount = await getAssociatedTokenAddress(usdcAccount.mint, PLATFORM_WALLET_ADDRESS)

      // Check if company account exists, if not we'll create it
      let needsCompanyAccount = false
      try {
        await getAccount(this.connection, companyUSDCAccount)
        console.log("Company USDC account exists:", companyUSDCAccount.toString())
      } catch (error) {
        needsCompanyAccount = true
        console.log("Company USDC account needs to be created:", companyUSDCAccount.toString())
      }

      const nftMint = Keypair.generate()

      // 4. Get fresh blockhash
      const { blockhash, lastValidBlockHeight } = await this.getFreshBlockhash()

      // 5. Build transaction
      const transaction = new Transaction()
      transaction.recentBlockhash = blockhash
      transaction.lastValidBlockHeight = lastValidBlockHeight
      transaction.feePayer = minter

      // 6. Create company USDC account if needed
      if (needsCompanyAccount) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            minter, // payer
            companyUSDCAccount, // associated token account
            PLATFORM_WALLET_ADDRESS, // owner
            usdcAccount.mint, // mint
            TOKEN_PROGRAM_ID,
          ),
        )
        console.log("Added instruction to create company USDC account")
      }

      // 7. Transfer USDC to company wallet
      const usdcAmount = price * 1_000_000 // Convert to micro USDC
      transaction.add(
        createTransferInstruction(
          usdcAccount.tokenAccount, // from
          companyUSDCAccount, // to
          minter, // authority
          usdcAmount, // amount
          [], // signers
          TOKEN_PROGRAM_ID,
        ),
      )
      console.log(`Added USDC transfer instruction: ${price} USDC`)

      // 8. Create NFT mint account
      const mintRent = await getMinimumBalanceForRentExemptMint(this.connection)
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: minter,
          newAccountPubkey: nftMint.publicKey,
          space: 82, // Standard mint account size
          lamports: mintRent,
          programId: TOKEN_PROGRAM_ID,
        }),
      )

      // 9. Initialize NFT mint (0 decimals for NFT)
      transaction.add(
        createInitializeMintInstruction(
          nftMint.publicKey,
          0, // 0 decimals for NFT
          minter, // mint authority
          minter, // freeze authority
          TOKEN_PROGRAM_ID,
        ),
      )

      // 10. Create associated token account for minter
      const minterTokenAccount = await getAssociatedTokenAddress(nftMint.publicKey, minter)
      transaction.add(
        createAssociatedTokenAccountInstruction(
          minter, // payer
          minterTokenAccount, // associated token account
          minter, // owner
          nftMint.publicKey, // mint
          TOKEN_PROGRAM_ID,
        ),
      )

      // 11. Mint 1 NFT to minter
      transaction.add(
        createMintToInstruction(
          nftMint.publicKey, // mint
          minterTokenAccount, // destination
          minter, // authority
          1, // amount (1 NFT)
          [], // signers
          TOKEN_PROGRAM_ID,
        ),
      )

      console.log("Transaction prepared with", transaction.instructions.length, "instructions")

      // 12. Simulate transaction first
      try {
        const simulation = await this.connection.simulateTransaction(transaction)
        if (simulation.value.err) {
          console.error("Transaction simulation failed:", simulation.value.err)
          return {
            success: false,
            error: `Transaction simulation failed: ${JSON.stringify(simulation.value.err)}`,
          }
        }
        console.log("Transaction simulation successful")
      } catch (simError: any) {
        console.error("Simulation error:", simError)
        return {
          success: false,
          error: `Simulation failed: ${simError.message}`,
        }
      }

      console.log("Requesting wallet signature...")

      // 13. Sign transaction
      const signedTransaction = await signTransaction(transaction)
      signedTransaction.partialSign(nftMint)

      console.log("Transaction signed, sending to network...")

      // 14. Send transaction with retry logic
      let signature: string
      try {
        signature = await this.connection.sendRawTransaction(signedTransaction.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
          maxRetries: 3,
        })
        console.log("Transaction sent with signature:", signature)
      } catch (sendError: any) {
        console.error("Send transaction error:", sendError)
        return {
          success: false,
          error: `Failed to send transaction: ${sendError.message}`,
        }
      }

      // 15. Confirm transaction
      try {
        console.log("Confirming transaction...")
        const confirmation = await this.connection.confirmTransaction(
          {
            signature,
            blockhash,
            lastValidBlockHeight,
          },
          "confirmed",
        )

        if (confirmation.value.err) {
          console.error("Transaction confirmation failed:", confirmation.value.err)
          return {
            success: false,
            error: `Transaction failed: ${JSON.stringify(confirmation.value.err)}`,
          }
        }

        console.log("Transaction confirmed successfully")
      } catch (confirmError: any) {
        console.error("Confirmation error:", confirmError)
        // Transaction might still be successful, so we'll return success with a warning
        console.log("Transaction sent but confirmation uncertain. Signature:", signature)
      }

      console.log("NFT minted successfully:", {
        nftMint: nftMint.publicKey.toString(),
        signature,
        explorer: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      })

      return {
        success: true,
        nftMint: nftMint.publicKey.toString(),
        signature,
      }
    } catch (error: any) {
      console.error("NFT minting error:", error)
      return {
        success: false,
        error: error.message || "Failed to mint NFT",
      }
    }
  }

  // Get service status for debugging
  getServiceStatus = () => {
    return {
      initialized: this.isInitialized,
      hasConnection: !!this.connection,
      connectionEndpoint: this.connection?.rpcEndpoint || "unknown",
      availableMethods: [
        "hasUserMinted",
        "markUserAsMinted",
        "getNFTMetadata",
        "getNFTsByOwner",
        "setConnection",
        "mintNFT",
        "getServiceStatus",
      ],
      usdcMints: this.USDC_MINTS,
    }
  }
}

// Create a singleton instance
const nftService = new NFTService()

// Export both the class and the instance
export default nftService

// Named export for components that need it
export const getNFTService = () => nftService
