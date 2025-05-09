import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase"
import Image from "next/image"
import type { NftMetadata } from "@/types/database"

async function getRecentNfts() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.from("nft_metadata").select("*").order("created_at", { ascending: false }).limit(3)

  return data || []
}

export async function RecentNfts() {
  const nfts = await getRecentNfts()

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-xl">Recent NFTs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nfts.map((nft: NftMetadata) => (
            <div key={nft.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
              <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={nft.image_url || "/placeholder.svg?height=64&width=64&query=nft"}
                  alt={nft.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{nft.name}</h3>
                <p className="text-white/60 text-sm truncate">{nft.description}</p>
                <p className="text-white/80 text-xs mt-1">
                  Owner:{" "}
                  {nft.owner_wallet
                    ? `${nft.owner_wallet.substring(0, 4)}...${nft.owner_wallet.substring(nft.owner_wallet.length - 4)}`
                    : "Unknown"}
                </p>
              </div>
            </div>
          ))}

          {nfts.length === 0 && (
            <div className="text-center py-6">
              <p className="text-white/60">No NFTs minted yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
