import { type Connection, type PublicKey, Transaction } from "@solana/web3.js"
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "@solana/spl-token"
import { CONFIRMATION_SETTINGS } from "@/config/solana"

/**
 * Get the associated token account for a wallet and token mint
 */
export async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
): Promise<PublicKey> {
  // Get the associated token account address
  const associatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    owner,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )

  // Check if the associated token account exists
  try {
    await connection.getTokenAccountBalance(associatedTokenAddress)
    return associatedTokenAddress
  } catch (error) {
    // If the account doesn't exist, return the address anyway
    // The account will be created during the transfer if needed
    return associatedTokenAddress
  }
}

/**
 * Create a transaction to transfer tokens
 */
export async function createTokenTransferTransaction(
  connection: Connection,
  fromPublicKey: PublicKey,
  toPublicKey: PublicKey,
  tokenMint: PublicKey,
  amount: number,
  decimals = 6, // USDT has 6 decimals
): Promise<Transaction> {
  // Get the associated token accounts for sender and receiver
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromPublicKey, tokenMint, fromPublicKey)

  const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromPublicKey, tokenMint, toPublicKey)

  // Create the transaction
  const transaction = new Transaction()

  // Check if the receiver's token account exists
  try {
    await connection.getTokenAccountBalance(toTokenAccount)
  } catch (error) {
    // If the receiver's token account doesn't exist, create it
    transaction.add(
      createAssociatedTokenAccountInstruction(
        fromPublicKey,
        toTokenAccount,
        toPublicKey,
        tokenMint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      ),
    )
  }

  // Add the transfer instruction
  transaction.add(
    createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      fromPublicKey,
      amount * 10 ** decimals,
      [],
      TOKEN_PROGRAM_ID,
    ),
  )

  // Get the latest blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  transaction.lastValidBlockHeight = lastValidBlockHeight
  transaction.feePayer = fromPublicKey

  return transaction
}

/**
 * Get token balance for a wallet
 */
export async function getTokenBalance(
  connection: Connection,
  walletAddress: PublicKey,
  tokenMint: PublicKey,
): Promise<number> {
  try {
    // Get the associated token account
    const tokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      walletAddress,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )

    try {
      // Get the token balance
      const balance = await connection.getTokenAccountBalance(tokenAccount)
      return balance.value.uiAmount || 0
    } catch (error) {
      // If the token account doesn't exist, return 0
      return 0
    }
  } catch (error) {
    console.error("Error getting token balance:", error)
    return 0
  }
}

/**
 * Send a signed transaction and confirm it
 */
export async function sendSignedTransaction(connection: Connection, signedTransaction: Buffer): Promise<string> {
  // Send the transaction
  const signature = await connection.sendRawTransaction(signedTransaction, {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  })

  // Confirm the transaction with retries
  let retries = CONFIRMATION_SETTINGS.maxRetries
  while (retries > 0) {
    try {
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: (JSON.parse(Buffer.from(signedTransaction).toString()) as Transaction).recentBlockhash!,
        lastValidBlockHeight: (JSON.parse(Buffer.from(signedTransaction).toString()) as Transaction)
          .lastValidBlockHeight!,
      })

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`)
      }

      return signature
    } catch (error) {
      retries--
      if (retries === 0) {
        throw error
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, CONFIRMATION_SETTINGS.retryInterval))
    }
  }

  throw new Error("Transaction confirmation timed out")
}
