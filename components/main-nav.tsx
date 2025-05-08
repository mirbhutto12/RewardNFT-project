import type React from "react"
import Image from "next/image"
import Link from "next/link"

interface MainNavProps {
  className?: string
}

const MainNav: React.FC<MainNavProps> = ({ className }) => {
  return (
    <nav className={`flex items-center justify-between p-4 ${className}`}>
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
        <span className="font-bold">Your Brand</span>
      </Link>

      <div className="space-x-4">
        <Link href="/about">About</Link>
        <Link href="/services">Services</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  )
}

export default MainNav
