"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, Edit, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for bundles
const mockBundles = [
  {
    id: 1,
    name: "Summer Essentials Bundle",
    steps: 4,
    products: 12,
    status: "Active",
    sales: 124,
    revenue: "$3,240",
  },
  {
    id: 2,
    name: "Winter Collection Bundle",
    steps: 3,
    products: 9,
    status: "Draft",
    sales: 0,
    revenue: "$0",
  },
  {
    id: 3,
    name: "Home Office Setup",
    steps: 5,
    products: 15,
    status: "Active",
    sales: 87,
    revenue: "$6,525",
  },
]

export default function AdminDashboard() {
  const [bundles, setBundles] = useState(mockBundles)

  const deleteBundle = (id: number) => {
    setBundles(bundles.filter((bundle) => bundle.id !== id))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">BundleBuilder</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <Link href="/admin/bundles/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Bundle
            </Button>
          </Link>
        </div>
        <Tabs defaultValue="bundles">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="bundles">Bundles</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="bundles" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bundles.map((bundle) => (
                <Card key={bundle.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">{bundle.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/bundles/${bundle.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/bundle/${bundle.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteBundle(bundle.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <div className="grid grid-cols-2 gap-2">
                        <div>Steps:</div>
                        <div className="text-right">{bundle.steps}</div>
                        <div>Products:</div>
                        <div className="text-right">{bundle.products}</div>
                        <div>Status:</div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              bundle.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {bundle.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="grid w-full grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Sales</span>
                        <span className="font-medium">{bundle.sales}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-medium">{bundle.revenue}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
              <Card className="flex flex-col items-center justify-center p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-xl font-medium">Create New Bundle</h3>
                <p className="mb-4 mt-2 text-center text-sm text-muted-foreground">
                  Set up a new product bundle with customizable steps and pricing
                </p>
                <Link href="/admin/bundles/new">
                  <Button>Get Started</Button>
                </Link>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bundle Performance</CardTitle>
                <CardDescription>View sales and revenue data for your product bundles</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="mb-4 text-4xl font-bold">$9,765</div>
                  <p>Total Bundle Revenue</p>
                  <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">211</div>
                      <div className="text-sm text-muted-foreground">Total Sales</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">$46.28</div>
                      <div className="text-sm text-muted-foreground">Avg. Order Value</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">18%</div>
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>App Settings</CardTitle>
                <CardDescription>Configure global settings for your bundle app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Shopify Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Connected to: <span className="font-medium">your-store.myshopify.com</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Display Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure how bundles appear in your store</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Localization</h3>
                  <p className="text-sm text-muted-foreground">Manage languages and currencies</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
