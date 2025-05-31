"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import nftService from "@/services/nft-service"
import { CheckCircle, AlertCircle, TestTube, Play } from "lucide-react"

interface TestResult {
  method: string
  status: "success" | "error" | "pending"
  result?: any
  error?: string
  duration?: number
}

export function NFTServiceTest() {
  const { connected, publicKey, connection } = useWallet()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const updateTestResult = (
    method: string,
    status: "success" | "error" | "pending",
    result?: any,
    error?: string,
    duration?: number,
  ) => {
    setTestResults((prev) => {
      const existing = prev.find((r) => r.method === method)
      const newResult = { method, status, result, error, duration }

      if (existing) {
        return prev.map((r) => (r.method === method ? newResult : r))
      } else {
        return [...prev, newResult]
      }
    })
  }

  const runTest = async (methodName: string, testFn: () => Promise<any>) => {
    const startTime = Date.now()
    updateTestResult(methodName, "pending")

    try {
      const result = await testFn()
      const duration = Date.now() - startTime
      updateTestResult(methodName, "success", result, undefined, duration)
      return result
    } catch (error: any) {
      const duration = Date.now() - startTime
      updateTestResult(methodName, "error", undefined, error.message, duration)
      throw error
    }
  }

  const testAllMethods = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first")
      return
    }

    setIsRunning(true)
    setTestResults([])

    try {
      // Update connection
      if (connection) {
        nftService.setConnection(connection)
      }

      // Test 1: Check if hasUserMinted method exists and works
      await runTest("hasUserMinted", async () => {
        console.log("Testing hasUserMinted...")
        const result = await nftService.hasUserMinted(publicKey)
        console.log("hasUserMinted result:", result)
        return { hasMinted: result, type: typeof result }
      })

      // Test 2: Check markUserAsMinted method
      await runTest("markUserAsMinted", async () => {
        console.log("Testing markUserAsMinted...")
        nftService.markUserAsMinted(publicKey)
        return { success: true, message: "Method executed without error" }
      })

      // Test 3: Check getNFTMetadata method
      await runTest("getNFTMetadata", async () => {
        console.log("Testing getNFTMetadata...")
        const metadata = nftService.getNFTMetadata(1)
        console.log("getNFTMetadata result:", metadata)
        return metadata
      })

      // Test 4: Check getNFTsByOwner method
      await runTest("getNFTsByOwner", async () => {
        console.log("Testing getNFTsByOwner...")
        const nfts = await nftService.getNFTsByOwner(publicKey)
        console.log("getNFTsByOwner result:", nfts)
        return { nfts, count: nfts.length }
      })

      // Test 5: Check setConnection method
      await runTest("setConnection", async () => {
        console.log("Testing setConnection...")
        if (connection) {
          nftService.setConnection(connection)
          return { success: true, message: "Connection set successfully" }
        } else {
          throw new Error("No connection available")
        }
      })

      // Test 6: Check method availability
      await runTest("methodAvailability", async () => {
        console.log("Testing method availability...")
        const methods = [
          "hasUserMinted",
          "markUserAsMinted",
          "getNFTMetadata",
          "getNFTsByOwner",
          "setConnection",
          "mintNFT",
        ]

        const availability = methods.map((method) => ({
          method,
          available: typeof (nftService as any)[method] === "function",
          type: typeof (nftService as any)[method],
        }))

        console.log("Method availability:", availability)
        return availability
      })

      // Test 7: Test localStorage functionality
      await runTest("localStorageTest", async () => {
        console.log("Testing localStorage functionality...")

        if (typeof window === "undefined") {
          throw new Error("localStorage not available (SSR)")
        }

        const testKey = "nft-service-test"
        const testValue = ["test-wallet-1", "test-wallet-2"]

        // Test write
        localStorage.setItem(testKey, JSON.stringify(testValue))

        // Test read
        const retrieved = JSON.parse(localStorage.getItem(testKey) || "[]")

        // Cleanup
        localStorage.removeItem(testKey)

        return {
          written: testValue,
          retrieved,
          match: JSON.stringify(testValue) === JSON.stringify(retrieved),
        }
      })
    } catch (error: any) {
      console.error("Test suite error:", error)
    } finally {
      setIsRunning(false)
    }
  }

  const testSingleMethod = async (methodName: string) => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first")
      return
    }

    switch (methodName) {
      case "hasUserMinted":
        await runTest("hasUserMinted", () => nftService.hasUserMinted(publicKey))
        break
      case "markUserAsMinted":
        await runTest("markUserAsMinted", () => {
          nftService.markUserAsMinted(publicKey)
          return Promise.resolve({ success: true })
        })
        break
      case "getNFTMetadata":
        await runTest("getNFTMetadata", () => Promise.resolve(nftService.getNFTMetadata(1)))
        break
      case "getNFTsByOwner":
        await runTest("getNFTsByOwner", () => nftService.getNFTsByOwner(publicKey))
        break
    }
  }

  const getStatusIcon = (status: "success" | "error" | "pending") => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "pending":
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusColor = (status: "success" | "error" | "pending") => {
    switch (status) {
      case "success":
        return "border-green-500/50 bg-green-500/10"
      case "error":
        return "border-red-500/50 bg-red-500/10"
      case "pending":
        return "border-blue-500/50 bg-blue-500/10"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <TestTube className="w-5 h-5 mr-2" />
            NFT Service Method Testing
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Test all NFT service methods to ensure they're working correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testAllMethods} disabled={isRunning || !connected} className="flex items-center">
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </Button>

            {!connected && <Badge variant="outline">Connect Wallet Required</Badge>}
          </div>

          {connected && publicKey && (
            <div className="text-sm text-muted-foreground">
              <p>
                Testing with wallet: {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-4)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Method Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["hasUserMinted", "markUserAsMinted", "getNFTMetadata", "getNFTsByOwner"].map((method) => (
          <Card key={method} className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-foreground">{method}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                variant="outline"
                onClick={() => testSingleMethod(method)}
                disabled={!connected}
                className="w-full"
              >
                Test {method}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Test Results</CardTitle>
            <CardDescription className="text-muted-foreground">Results from NFT service method testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {testResults.map((result, index) => (
              <Alert key={index} className={getStatusColor(result.status)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(result.status)}
                    <div className="ml-2">
                      <div className="font-medium">{result.method}</div>
                      {result.duration && (
                        <div className="text-xs text-muted-foreground">Completed in {result.duration}ms</div>
                      )}
                    </div>
                  </div>
                  <Badge variant={result.status === "success" ? "default" : "destructive"}>{result.status}</Badge>
                </div>

                {result.error && (
                  <AlertDescription className="mt-2 text-red-700 dark:text-red-300">
                    Error: {result.error}
                  </AlertDescription>
                )}

                {result.result && (
                  <AlertDescription className="mt-2">
                    <details className="text-xs">
                      <summary className="cursor-pointer font-medium">View Result</summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(result.result, null, 2)}
                      </pre>
                    </details>
                  </AlertDescription>
                )}
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Service Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Service Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Service Type:</span>
            <span className="text-foreground">Singleton Instance</span>
            <span className="text-muted-foreground">Connection:</span>
            <span className="text-foreground">{connection ? "Available" : "Not Available"}</span>
            <span className="text-muted-foreground">Wallet:</span>
            <span className="text-foreground">{connected ? "Connected" : "Not Connected"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
