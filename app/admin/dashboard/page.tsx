import { AdminDashboardContent } from "@/components/admin-dashboard-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | Solana Reward NFT Platform",
  description: "Admin dashboard for the Solana Reward NFT Platform",
}

export default function AdminDashboardPage() {
  return <AdminDashboardContent />
}
