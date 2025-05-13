"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/wallet-context"

interface HeaderProps {
  transparent?: boolean
}

export function Header({ transparent = false }: HeaderProps) {
  const { connected } = useWallet()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const headerClass = transparent
    ? `w-full py-4 px-6 transition-all duration-300 ${isScrolled ? "bg-black/30 backdrop-blur-md" : "bg-transparent"}`
    : "w-full py-4 px-6 bg-black/20 backdrop-blur-md"

  return null // Header navigation removed as requested
}
