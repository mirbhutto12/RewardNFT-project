import { NFTServiceTest } from "@/components/nft-service-test"

export const metadata = {
  title: "NFT Service Test | Reward NFT Platform",
  description: "Test NFT service methods and functionality",
}

export default function NFTServiceTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">NFT Service Testing</h1>
          <p className="text-muted-foreground">
            Comprehensive testing suite for all NFT service methods and functionality.
          </p>
        </div>

        <NFTServiceTest />
      </div>
    </div>
  )
}
