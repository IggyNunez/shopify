"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronUp, Grip, Plus, Save, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

// Mock data for products
const mockProducts = [
  { id: 1, name: "T-Shirt", price: 19.99, image: "/plain-white-tshirt.png" },
  { id: 2, name: "Jeans", price: 49.99, image: "/folded-denim-stack.png" },
  { id: 3, name: "Sneakers", price: 79.99, image: "/diverse-sneaker-collection.png" },
  { id: 4, name: "Hat", price: 14.99, image: "/various-hats.png" },
  { id: 5, name: "Sunglasses", price: 24.99, image: "/stylish-sunglasses.png" },
  { id: 6, name: "Watch", price: 99.99, image: "/wrist-watch-close-up.png" },
]

interface Step {
  id: number
  title: string
  description: string
  type: "required" | "optional" | "upsell"
  products: number[]
  maxSelections: number
}

export default function NewBundle() {
  const [bundleName, setBundleName] = useState("New Bundle")
  const [bundleDescription, setBundleDescription] = useState("")
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Select a T-Shirt",
      description: "Choose your favorite style",
      type: "required",
      products: [1],
      maxSelections: 1,
    },
    {
      id: 2,
      title: "Add Bottoms",
      description: "Complete your outfit",
      type: "required",
      products: [2],
      maxSelections: 1,
    },
    {
      id: 3,
      title: "Add Accessories",
      description: "Customize your look",
      type: "optional",
      products: [4, 5],
      maxSelections: 2,
    },
    {
      id: 4,
      title: "Complete Your Look",
      description: "Add these premium items to your bundle",
      type: "upsell",
      products: [3, 6],
      maxSelections: 1,
    },
  ])

  const [discountType, setDiscountType] = useState("percentage")
  const [discountValue, setDiscountValue] = useState("10")
  const [basePrice, setBasePrice] = useState("")

  const addStep = () => {
    const newStep: Step = {
      id: steps.length + 1,
      title: `Step ${steps.length + 1}`,
      description: "",
      type: "optional",
      products: [],
      maxSelections: 1,
    }
    setSteps([...steps, newStep])
  }

  const removeStep = (id: number) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  const updateStep = (id: number, updatedStep: Partial<Step>) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, ...updatedStep } : step)))
  }

  const moveStep = (id: number, direction: "up" | "down") => {
    const index = steps.findIndex((step) => step.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === steps.length - 1)) {
      return
    }

    const newSteps = [...steps]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const temp = newSteps[index]
    newSteps[index] = newSteps[newIndex]
    newSteps[newIndex] = temp
    setSteps(newSteps)
  }

  const toggleProductInStep = (stepId: number, productId: number) => {
    const step = steps.find((s) => s.id === stepId)
    if (!step) return

    let updatedProducts
    if (step.products.includes(productId)) {
      updatedProducts = step.products.filter((id) => id !== productId)
    } else {
      updatedProducts = [...step.products, productId]
    }

    updateStep(stepId, { products: updatedProducts })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/admin" className="mr-6 flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="outline" className="mr-2">
              Preview Bundle
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Bundle
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Create New Bundle</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bundle Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="bundle-name">Bundle Name</Label>
                  <Input
                    id="bundle-name"
                    value={bundleName}
                    onChange={(e) => setBundleName(e.target.value)}
                    placeholder="Enter bundle name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bundle-description">Description</Label>
                  <Textarea
                    id="bundle-description"
                    value={bundleDescription}
                    onChange={(e) => setBundleDescription(e.target.value)}
                    placeholder="Enter bundle description"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Bundle Steps</CardTitle>
                <Button onClick={addStep} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Step
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step, index) => (
                  <Card key={step.id} className="border border-muted">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Grip className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">
                          Step {index + 1}: {step.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStep(step.id, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStep(step.id, "down")}
                          disabled={index === steps.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`step-title-${step.id}`}>Step Title</Label>
                          <Input
                            id={`step-title-${step.id}`}
                            value={step.title}
                            onChange={(e) => updateStep(step.id, { title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`step-type-${step.id}`}>Step Type</Label>
                          <Select
                            value={step.type}
                            onValueChange={(value) =>
                              updateStep(step.id, {
                                type: value as "required" | "optional" | "upsell",
                              })
                            }
                          >
                            <SelectTrigger id={`step-type-${step.id}`}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="required">Required</SelectItem>
                              <SelectItem value="optional">Optional</SelectItem>
                              <SelectItem value="upsell">Upsell</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`step-description-${step.id}`}>Description</Label>
                        <Textarea
                          id={`step-description-${step.id}`}
                          value={step.description}
                          onChange={(e) => updateStep(step.id, { description: e.target.value })}
                          placeholder="Enter step description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`step-max-${step.id}`}>Max Selections</Label>
                        <Input
                          id={`step-max-${step.id}`}
                          type="number"
                          min="1"
                          value={step.maxSelections}
                          onChange={(e) => updateStep(step.id, { maxSelections: Number.parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Products</Label>
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                          {mockProducts.map((product) => (
                            <div
                              key={product.id}
                              className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer ${
                                step.products.includes(product.id) ? "border-primary bg-primary/5" : "border-muted"
                              }`}
                              onClick={() => toggleProductInStep(step.id, product.id)}
                            >
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="h-10 w-10 object-cover rounded-md"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">${product.price.toFixed(2)}</div>
                              </div>
                              <div className="flex h-5 w-5 items-center justify-center rounded-full border">
                                {step.products.includes(product.id) && (
                                  <div className="h-3 w-3 rounded-full bg-primary" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {steps.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed">
                    <p className="mb-4 text-muted-foreground">No steps added yet</p>
                    <Button onClick={addStep}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Step
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Discounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-price">Base Price (Optional)</Label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <Input
                      id="base-price"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set a base price for the bundle, or leave empty to use sum of products
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount-type">Discount Type</Label>
                  <Select value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger id="discount-type">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="tiered">Tiered Discount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {discountType === "percentage" || discountType === "fixed" ? (
                  <div className="space-y-2">
                    <Label htmlFor="discount-value">
                      {discountType === "percentage" ? "Discount Percentage" : "Discount Amount"}
                    </Label>
                    <div className="flex items-center">
                      {discountType === "percentage" ? (
                        <>
                          <Input
                            id="discount-value"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            className="flex-1"
                          />
                          <span className="ml-2">%</span>
                        </>
                      ) : (
                        <>
                          <span className="mr-2">$</span>
                          <Input
                            id="discount-value"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            className="flex-1"
                          />
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">3+ items</span>
                      <div className="flex items-center">
                        <Input value="10" className="w-16 h-8 text-right" />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">5+ items</span>
                      <div className="flex items-center">
                        <Input value="15" className="w-16 h-8 text-right" />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="mr-2 h-3 w-3" />
                      Add Tier
                    </Button>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="show-savings" />
                  <Label htmlFor="show-savings">Show savings to customer</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="show-progress" defaultChecked />
                  <Label htmlFor="show-progress">Show progress bar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-summary" defaultChecked />
                  <Label htmlFor="show-summary">Show bundle summary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="allow-save" defaultChecked />
                  <Label htmlFor="allow-save">Allow customers to save bundles</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bundle-theme">Bundle Theme</Label>
                  <Select defaultValue="default">
                    <SelectTrigger id="bundle-theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
