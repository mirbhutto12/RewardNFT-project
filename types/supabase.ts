export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          wallet_address: string
          username: string | null
          email: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wallet_address: string
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wallet_address?: string
          username?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nft_metadata: {
        Row: {
          id: string
          mint_address: string
          name: string
          description: string | null
          image_url: string | null
          attributes: Json | null
          owner_wallet: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mint_address: string
          name: string
          description?: string | null
          image_url?: string | null
          attributes?: Json | null
          owner_wallet?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mint_address?: string
          name?: string
          description?: string | null
          image_url?: string | null
          attributes?: Json | null
          owner_wallet?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leaderboard: {
        Row: {
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
        Insert: {
          id?: string
          user_id?: string | null
          wallet_address?: string | null
          total_points?: number
          referral_count?: number
          quest_count?: number
          mint_count?: number
          rank?: number | null
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          wallet_address?: string | null
          total_points?: number
          referral_count?: number
          quest_count?: number
          mint_count?: number
          rank?: number | null
          last_updated?: string
        }
      }
      referrals: {
        Row: {
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
        Insert: {
          id?: string
          referrer_wallet?: string | null
          referred_wallet?: string | null
          referral_code: string
          status?: string
          reward_amount?: number | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          referrer_wallet?: string | null
          referred_wallet?: string | null
          referral_code?: string
          status?: string
          reward_amount?: number | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quests: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          difficulty: string
          reward_amount: number | null
          reward_currency: string
          requirement_type: string
          requirement_count: number
          requirement_data: Json | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: string
          difficulty: string
          reward_amount?: number | null
          reward_currency?: string
          requirement_type: string
          requirement_count: number
          requirement_data?: Json | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: string
          difficulty?: string
          reward_amount?: number | null
          reward_currency?: string
          requirement_type?: string
          requirement_count?: number
          requirement_data?: Json | null
          expires_at?: string | null
          created_at?: string
        }
      }
      user_quests: {
        Row: {
          id: string
          user_id: string | null
          quest_id: string | null
          status: string
          progress: number
          completed_at: string | null
          claimed_at: string | null
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          quest_id?: string | null
          status?: string
          progress?: number
          completed_at?: string | null
          claimed_at?: string | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          quest_id?: string | null
          status?: string
          progress?: number
          completed_at?: string | null
          claimed_at?: string | null
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      airdrops: {
        Row: {
          id: string
          name: string
          description: string | null
          type: string
          token_address: string | null
          amount: number
          eligibility: string
          eligibility_params: Json | null
          status: string
          scheduled_at: string
          completed_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          type: string
          token_address?: string | null
          amount: number
          eligibility: string
          eligibility_params?: Json | null
          status?: string
          scheduled_at: string
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          type?: string
          token_address?: string | null
          amount?: number
          eligibility?: string
          eligibility_params?: Json | null
          status?: string
          scheduled_at?: string
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      airdrop_recipients: {
        Row: {
          id: string
          airdrop_id: string | null
          wallet_address: string | null
          amount: number
          status: string
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          airdrop_id?: string | null
          wallet_address?: string | null
          amount: number
          status?: string
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          airdrop_id?: string | null
          wallet_address?: string | null
          amount?: number
          status?: string
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
