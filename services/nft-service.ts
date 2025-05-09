import { supabase } from "@/lib/supabase"

export interface NftMetadata {
  id: string
  mintAddress: string
  name: string
  description: string | null
  imageUrl: string | null
  attributes: any | null
  ownerWallet: string | null
  createdAt: string
  updatedAt: string
}

// Store NFT metadata
export async function storeNftMetadata(metadata: {
  mintAddress: string
  name: string
  description?: string
  imageUrl?: string
  attributes?: any
  ownerWallet?: string
}): Promise<NftMetadata | null> {
  try {
    const { data, error } = await supabase
      .from("nft_metadata")
      .insert([
        {
          mint_address: metadata.mintAddress,
          name: metadata.name,
          description: metadata.description,
          image_url: metadata.imageUrl,
          attributes: metadata.attributes,
          owner_wallet: metadata.ownerWallet,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error storing NFT metadata:", error)
      return null
    }

    return {
      id: data.id,
      mintAddress: data.mint_address,
      name: data.name,
      description: data.description,
      imageUrl: data.image_url,
      attributes: data.attributes,
      ownerWallet: data.owner_wallet,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error("Unexpected error in storeNftMetadata:", error)
    return null
  }
}

// Get NFT metadata by mint address
export async function getNftMetadataByMintAddress(mintAddress: string): Promise<NftMetadata | null> {
  try {
    const { data, error } = await supabase.from("nft_metadata").select("*").eq("mint_address", mintAddress).single()

    if (error) {
      console.error("Error fetching NFT metadata:", error)
      return null
    }

    return {
      id: data.id,
      mintAddress: data.mint_address,
      name: data.name,
      description: data.description,
      imageUrl: data.image_url,
      attributes: data.attributes,
      ownerWallet: data.owner_wallet,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error("Unexpected error in getNftMetadataByMintAddress:", error)
    return null
  }
}

// Get NFTs by owner wallet
export async function getNftsByOwnerWallet(ownerWallet: string): Promise<NftMetadata[]> {
  try {
    const { data, error } = await supabase.from("nft_metadata").select("*").eq("owner_wallet", ownerWallet)

    if (error) {
      console.error("Error fetching NFTs by owner:", error)
      return []
    }

    return data.map((nft) => ({
      id: nft.id,
      mintAddress: nft.mint_address,
      name: nft.name,
      description: nft.description,
      imageUrl: nft.image_url,
      attributes: nft.attributes,
      ownerWallet: nft.owner_wallet,
      createdAt: nft.created_at,
      updatedAt: nft.updated_at,
    }))
  } catch (error) {
    console.error("Unexpected error in getNftsByOwnerWallet:", error)
    return []
  }
}

// Update NFT owner
export async function updateNftOwner(mintAddress: string, newOwnerWallet: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("nft_metadata")
      .update({
        owner_wallet: newOwnerWallet,
        updated_at: new Date().toISOString(),
      })
      .eq("mint_address", mintAddress)

    if (error) {
      console.error("Error updating NFT owner:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error in updateNftOwner:", error)
    return false
  }
}
