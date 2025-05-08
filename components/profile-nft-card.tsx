import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface NFT {
  id: number
  name: string
  image: string
  rarity: string
  acquired: string
}

interface ProfileNFTCardProps {
  nft: NFT
}

export function ProfileNFTCard({ nft }: ProfileNFTCardProps) {
  return (
    <div className="bg-white/10 rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-colors">
      <div className="aspect-square relative">
        <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{nft.name}</h3>
          <Badge
            className={`
              ${nft.rarity === "Rare" ? "bg-purple-500/30 text-purple-200" : ""}
              ${nft.rarity === "Common" ? "bg-blue-500/30 text-blue-200" : ""}
              ${nft.rarity === "Legendary" ? "bg-yellow-500/30 text-yellow-200" : ""}
            `}
          >
            {nft.rarity}
          </Badge>
        </div>
        <p className="text-white/60 text-sm">Acquired: {new Date(nft.acquired).toLocaleDateString()}</p>
        <div className="flex justify-between items-center mt-4">
          <button className="text-white/80 hover:text-white text-sm underline">View Details</button>
          <button className="text-white/80 hover:text-white text-sm underline">Transfer</button>
        </div>
      </div>
    </div>
  )
}
