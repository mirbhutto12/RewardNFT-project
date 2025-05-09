import { LoginPageContent } from "@/components/login-page-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Solana Reward NFT Platform",
  description: "Connect your wallet and authenticate to access the Solana Reward NFT Platform",
}

export default function LoginPage() {
  return <LoginPageContent />
}
