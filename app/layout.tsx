import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google" // Assuming Inter is still desired
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientLayoutWrapper } from "@/components/client-layout-wrapper"

const inter = Inter({ subsets: ["latin"] }) // Assuming Inter font

export const metadata: Metadata = {
  title: "Reward NFT Platform", // Updated title
  description: "Mint NFTs, earn rewards, and build your network on Solana with a sleek dark theme.", // Updated description
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {" "}
        {/* Added Inter and antialiased */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false} // Forcing dark theme as per previous request
          disableTransitionOnChange
        >
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
