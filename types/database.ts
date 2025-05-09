export interface User {
  id: string
  wallet_address: string
  username: string | null
  email: string | null
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
}

export interface NftMetadata {
  id: string
  mint_address: string
  name: string
  description: string | null
  image_url: string | null
  attributes: any
  owner_wallet: string | null
  created_at: string
  updated_at: string
}

export interface LeaderboardEntry {
  id: string
  user_id: string | null
  wallet_address: string | null
  total_points: number
  referral_count: number
  quest_count: number
  mint_count: number
  rank: number | null
  last_updated: string
}

export interface Referral {
  id: string
  referrer_wallet: string | null
  referred_wallet: string | null
  referral_code: string
  status: string
  reward_amount: number | null
  transaction_id: string | null
  created_at: string
  updated_at: string
}

export interface Quest {
  id: string
  title: string
  description: string | null
  type: string
  difficulty: string
  reward_amount: number
  reward_currency: string
  requirement_type: string
  requirement_count: number
  requirement_data: any
  expires_at: string | null
  created_at: string
}

export interface UserQuest {
  id: string
  user_id: string
  quest_id: string
  status: string
  progress: number
  completed_at: string | null
  claimed_at: string | null
  transaction_id: string | null
  created_at: string
  updated_at: string
}

export interface Airdrop {
  id: string
  name: string
  description: string | null
  type: string
  token_address: string | null
  amount: number
  eligibility: string
  eligibility_params: any
  status: string
  scheduled_at: string
  completed_at: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface AirdropRecipient {
  id: string
  airdrop_id: string
  wallet_address: string
  amount: number
  status: string
  transaction_id: string | null
  created_at: string
  updated_at: string
}
