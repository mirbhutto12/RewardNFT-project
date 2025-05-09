import { type NextRequest, NextResponse } from "next/server"
import { generateNonce } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const nonce = generateNonce()
    return NextResponse.json({ nonce })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate nonce" }, { status: 500 })
  }
}
