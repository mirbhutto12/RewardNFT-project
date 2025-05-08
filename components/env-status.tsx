"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, AlertCircle } from "lucide-react"
import {
  CURRENT_NETWORK,
  DEFAULT_RPC_ENDPOINT,
  DEFAULT_USDT_TOKEN_ADDRESS,
  PLATFORM_WALLET_ADDRESS,
  SOLANA_RPC_ENDPOINTS,
} from "@/config/solana"

export function EnvStatus() {
  const [open, setOpen] = useState(false)

  // Check if environment variables are set
  const envVars = [
    {
      name: "NEXT_PUBLIC_SOLANA_NETWORK",
      value: process.env.NEXT_PUBLIC_SOLANA_NETWORK || "Not set (using default: devnet)",
      isSet: !!process.env.NEXT_PUBLIC_SOLANA_NETWORK,
    },
    {
      name: `NEXT_PUBLIC_SOLANA_${CURRENT_NETWORK.toUpperCase()}_RPC`,
      value: SOLANA_RPC_ENDPOINTS[CURRENT_NETWORK].includes("quiknode")
        ? "Set to QuikNode endpoint"
        : "Not set (using default)",
      isSet: SOLANA_RPC_ENDPOINTS[CURRENT_NETWORK].includes("quiknode"),
    },
    {
      name: "NEXT_PUBLIC_USDT_MINT_ADDRESS",
      value: process.env.NEXT_PUBLIC_USDT_MINT_ADDRESS || "Not set (using default)",
      isSet: !!process.env.NEXT_PUBLIC_USDT_MINT_ADDRESS,
    },
    {
      name: "NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS",
      value: process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS || "Not set (using default)",
      isSet: !!process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS,
    },
  ]

  // Count how many environment variables are set
  const setCount = envVars.filter((v) => v.isSet).length
  const totalCount = envVars.length

  // Format RPC endpoint for display (hide API keys)
  const formatRpcEndpoint = (endpoint: string) => {
    if (endpoint.includes("quiknode")) {
      return endpoint.split("/").slice(0, 3).join("/") + "/..." // Hide API key
    }
    return endpoint
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${setCount === totalCount ? "text-green-500" : "text-yellow-500"}`}
        >
          {setCount === totalCount ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="sr-only">Environment Variables Status</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Environment Variables Status</DialogTitle>
          <DialogDescription>
            {setCount === totalCount
              ? "All environment variables are properly configured."
              : "Some environment variables are not set and using default values."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            {envVars.map((env) => (
              <div key={env.name} className="flex items-start gap-2">
                {env.isSet ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{env.name}</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                    {env.isSet ? "Set" : env.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-medium">Current Configuration</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Network:</span>
                <span className="text-sm font-medium">{CURRENT_NETWORK}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">RPC Endpoint:</span>
                <span className="text-sm font-mono break-all text-right">
                  {formatRpcEndpoint(DEFAULT_RPC_ENDPOINT)}
                  {DEFAULT_RPC_ENDPOINT.includes("quiknode") && (
                    <span className="text-xs text-green-500 ml-1">(QuikNode)</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">USDT Address:</span>
                <span className="text-sm font-mono truncate max-w-[200px]">
                  {DEFAULT_USDT_TOKEN_ADDRESS.toString().slice(0, 4)}...
                  {DEFAULT_USDT_TOKEN_ADDRESS.toString().slice(-4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Platform Wallet:</span>
                <span className="text-sm font-mono truncate max-w-[200px]">
                  {PLATFORM_WALLET_ADDRESS.toString().slice(0, 4)}...
                  {PLATFORM_WALLET_ADDRESS.toString().slice(-4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
