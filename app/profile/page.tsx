import { ProfilePageContent } from "@/components/profile-page-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile | Solana Reward NFT Platform",
  description: "View and manage your profile on the Solana Reward NFT Platform",
}

export default function ProfilePage() {
  return <ProfilePageContent />
}
