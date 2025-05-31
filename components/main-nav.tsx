import type React from "react"
import Link from "next/link"

interface MainNavProps {
  className?: string
}

export const MainNav: React.FC<MainNavProps> = ({ className }) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Reward NFT Platform"

  return (
    <nav className={`flex items-center justify-between p-4 ${className}`}>
      <div className="hidden md:flex items-center space-x-6">
        <Link
          href="/"
          className="text-sm font-medium text-theme-dark-text-secondary transition-colors hover:text-theme-dark-text"
        >
          Home
        </Link>
        <Link
          href="/mint"
          className="text-sm font-medium text-theme-dark-text-secondary transition-colors hover:text-theme-dark-text"
        >
          Mint
        </Link>
        <Link
          href="/profile"
          className="text-sm font-medium text-theme-dark-text-secondary transition-colors hover:text-theme-dark-text"
        >
          Profile
        </Link>
        <Link
          href="/leaderboard"
          className="text-sm font-medium text-theme-dark-text-secondary transition-colors hover:text-theme-dark-text"
        >
          Leaderboard
        </Link>
        <Link
          href="/referrals"
          className="text-sm font-medium text-theme-dark-text-secondary transition-colors hover:text-theme-dark-text"
        >
          Referrals
        </Link>
        <Link
          href="/quests"
          className="text-sm font-medium text-theme-dark-text-secondary transition-colors hover:text-theme-dark-text"
        >
          Quests
        </Link>
      </div>
    </nav>
  )
}

// Also export as default for backward compatibility
export default MainNav
