import Link from "next/link"
import { Github, Twitter, Disc } from "lucide-react" // Assuming you might want social icons

export function Footer() {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Reward NFT Platform"
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-theme-dark-surface border-t border-theme-dark-border text-theme-dark-text-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h5 className="font-semibold text-theme-dark-text-primary mb-3">{appName}</h5>
            <p className="text-sm">Mint, Refer, Earn. Your gateway to digital rewards on the Solana blockchain.</p>
          </div>
          <div>
            <h5 className="font-semibold text-theme-dark-text-primary mb-3">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mint" className="hover:text-theme-dark-primary">
                  Mint NFT
                </Link>
              </li>
              <li>
                <Link href="/referrals" className="hover:text-theme-dark-primary">
                  Referrals
                </Link>
              </li>
              <li>
                <Link href="/quests" className="hover:text-theme-dark-primary">
                  Quests
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-theme-dark-primary">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-theme-dark-text-primary mb-3">Community</h5>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter" className="hover:text-theme-dark-primary">
                <Twitter size={20} />
              </Link>
              <Link href="#" aria-label="GitHub" className="hover:text-theme-dark-primary">
                <Github size={20} />
              </Link>
              <Link href="#" aria-label="Discord" className="hover:text-theme-dark-primary">
                <Disc size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-theme-dark-border/50 pt-6 text-center text-sm">
          <p>
            &copy; {currentYear} {appName}. All Rights Reserved.
          </p>
          <p className="mt-1">
            Built with <span className="text-theme-dark-primary">&hearts;</span> on Solana.
          </p>
        </div>
      </div>
    </footer>
  )
}
