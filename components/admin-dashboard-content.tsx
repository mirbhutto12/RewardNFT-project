"use client"

import { useEffect, useState } from "react"
import { RoleGuard } from "@/components/role-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/user-management"
import { QuestManagement } from "@/components/quest-management"
import { AirdropManagement } from "@/components/airdrop-management"
import { NftManagement } from "@/components/nft-management"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function AdminDashboardContent() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={["admin"]} fallbackUrl="/">
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="quests">Quests</TabsTrigger>
            <TabsTrigger value="airdrops">Airdrops</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="quests" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quest Management</CardTitle>
                <CardDescription>Create and manage quests</CardDescription>
              </CardHeader>
              <CardContent>
                <QuestManagement />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="airdrops" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Airdrop Management</CardTitle>
                <CardDescription>Create and manage airdrops</CardDescription>
              </CardHeader>
              <CardContent>
                <AirdropManagement />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="nfts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>NFT Management</CardTitle>
                <CardDescription>Manage NFT metadata and collections</CardDescription>
              </CardHeader>
              <CardContent>
                <NftManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
