import { supabase } from "./supabase"
import nacl from "tweetnacl"
import bs58 from "bs58"

// Generate a random nonce for signing
export function generateNonce(): string {
  const nonceArray = new Uint8Array(32)
  crypto.getRandomValues(nonceArray)
  return bs58.encode(nonceArray)
}

// Create a message for the user to sign
export function createSignMessage(walletAddress: string, nonce: string): string {
  return `Sign this message to authenticate with Solana Reward NFT Platform.\n\nWallet: ${walletAddress}\nNonce: ${nonce}\nTimestamp: ${Date.now()}`
}

// Verify a signature from a wallet
export async function verifySignature(message: string, signature: string, publicKey: string): Promise<boolean> {
  try {
    const messageBytes = new TextEncoder().encode(message)
    const signatureBytes = bs58.decode(signature)
    const publicKeyBytes = bs58.decode(publicKey)

    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes)
  } catch (error) {
    console.error("Error verifying signature:", error)
    return false
  }
}

// Sign in with Supabase using a custom token
export async function signInWithCustomToken(token: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${token}@phantom.wallet`, // Using token as part of email
    password: token, // Using token as password
  })

  if (error) {
    throw error
  }

  return data
}

// Sign out from Supabase
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

// Get the current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    throw error
  }
  return data.session
}

// Get the current user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    throw error
  }
  return data.user
}
