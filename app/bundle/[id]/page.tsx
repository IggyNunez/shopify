"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, Heart, Home, Info, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for bundle
const mockBundle = {
  id: 1,
  name: "Summer Essentials Bundle",
  description: "Everything you need for the perfect summer look",
  steps: [
    {
      id: 1,
      title: "Select a T-Shirt",
      description: "Choose your favorite style",
      type: "required",
      products: [
        {
          id: 101,
          name: "Classic White Tee",
          price: 19.99,
          image: "/white-tshirt.png",
        },
        {
          id: 102,
          name: "Graphic Print Tee",
          price: 24.99,
          image: "/placeholder.svg?key=w839g",
        },
        {
          id: 103,
          name: "Striped Tee",
          price: 22.99,
          image: "/placeholder.svg?key=7gfmj",
        },
      ],
      maxSelections: 1,
    },
    {
      id: 2,
      title: "Add Bottoms",
      description: "Complete your outfit",
      type: "required",
      products: [
        {
          id: 201,
          name: "Denim Shorts",
          price: 39.99,
          image: "/denim-shorts.png",
        },
        {
          id: 202,
          name: "Chino Shorts",
          price: 34.99,
          image: "/placeholder.svg?key=rlq07",
        },
      ],
      maxSelections: 1,
    },
    {
      id: 3,
      title: "Add Accessories",
      description: "Customize your look",
      type: "optional",
      products: [
        {
          id: 301,
          name: "Baseball Cap",
          price: 14.99,
          image: "/baseball-cap.png",
        },
        {
          id: 302,
          name: "Sunglasses",
          price: 24.99,
          image: "/stylish-sunglasses.png",
        },
        {
          id: 303,
          name: "Beach Tote",
          price: 29.99,
          image: "/placeholder.svg?key=w6ve0",
        },
      ],
      maxSelections: 2,
    },
    {
      id: 4,
      title: "Complete Your Look",
      description: "Add these premium items to your bundle",
      type: "upsell",
      products: [
        {
          id: 401,
          name: "Premium Sandals",
          price: 49.99,
          image: "/placeholder.svg?height=200&width=200&query=sandals",
        },
        {
          id: 402,
          name: "Waterproof Watch",
          price: 79.99,
          image: "/placeholder.svg?height=200&width=200&query=waterproof+watch",
        },
      ],
      maxSelections: 1,
    },
  ],
  discountType: "percentage",
  discountValue: 15,
  basePrice: null,
}

interface Product {
  id: number
  name: string
  price: number
  image: string
}

export default function BundleBuilder({ params }: { params: { id: string } }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedProducts, setSelectedProducts] = useState<Record<number, Product[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
  })
  const [summaryOpen, setSummaryOpen] = useState(false)

  const bundle = mockBundle
  const step = bundle.steps[currentStep]

  const handleProductSelect = (product: Product) => {
    const currentSelections = selectedProducts[step.id] || []

    // If product is already selected, remove it
    if (currentSelections.some((p) => p.id === product.id)) {
      setSelectedProducts({
        ...selectedProducts,
        [step.id]: currentSelections.filter((p) => p.id !== product.id),
      })
      return
    }

    // If max selections reached, replace the first item
    if (currentSelections.length >= step.maxSelections) {
      const newSelections = [...currentSelections]
      newSelections.shift()
      newSelections.push(product)
      setSelectedProducts({
        ...selectedProducts,
        [step.id]: newSelections,
      })
      return
    }

    // Otherwise add the product
    setSelectedProducts({
      ...selectedProducts,
      [step.id]: [...currentSelections, product],
    })
  }

  const isProductSelected = (productId: number) => {
    return (selectedProducts[step.id] || []).some((p) => p.id === productId)
  }

  const canProceed = () => {
    if (step.type === "required") {
      return (selectedProducts[step.id] || []).length > 0
    }
    return true
  }

  const nextStep = () => {
    if (currentStep < bundle.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateTotalPrice = () => {
    let total = 0
    Object.values(selectedProducts).forEach((products) => {
      products.forEach((product) => {
        total += product.price
      })
    })
    return total
  }

  const calculateDiscount = () => {
    const total = calculateTotalPrice()
    if (bundle.discountType === "percentage") {
      return total * (bundle.discountValue / 100)
    }
    return bundle.discountValue
  }

  const calculateFinalPrice = () => {
    return calculateTotalPrice() - calculateDiscount()
  }

  const totalSelectedProducts = Object.values(selectedProducts).flat().length
  const progress = ((currentStep + 1) / bundle.steps.length) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span className="font-medium">BundleBuilder</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold md:text-3xl">{bundle.name}</h1>
            <p className="text-muted-foreground">{bundle.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">
                Step {currentStep + 1} of {bundle.steps.length}
              </div>
              <div className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                    {step.type !== "required" && (
                      <div className="text-sm text-muted-foreground">
                        {step.type === "optional" ? "Optional" : "Recommended"}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {step.products.map((product) => (
                      <div
                        key={product.id}
                        className={`relative flex flex-col overflow-hidden rounded-lg border cursor-pointer transition-all ${
                          isProductSelected(product.id)
                            ? "border-primary ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleProductSelect(product)}
                      >
                        {isProductSelected(product.id) && (
                          <div className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col p-3">
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="mt-1 flex items-center justify-between">
                            <div className="text-sm font-medium">${product.price.toFixed(2)}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Add to wishlist logic
                              }}
                            >
                              <Heart className="h-4 w-4" />
                              <span className="sr-only">Add to wishlist</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={nextStep} disabled={!canProceed() || currentStep === bundle.steps.length - 1}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Bundle Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {Object.entries(selectedProducts).map(([stepId, products]) => {
                      if (products.length === 0) return null
                      const stepInfo = bundle.steps.find((s) => s.id === Number.parseInt(stepId))
                      return (
                        <div key={stepId}>
                          <div className="font-medium text-sm">{stepInfo?.title}</div>
                          {products.map((product) => (
                            <div key={product.id} className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="h-8 w-8 rounded object-cover"
                                />
                                <span className="text-sm">{product.name}</span>
                              </div>
                              <span className="text-sm">${product.price.toFixed(2)}</span>
                            </div>
                          ))}
                          <Separator className="my-2" />
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${calculateTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>Bundle Discount ({bundle.discountValue}%)</span>
                      <span>-${calculateDiscount().toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span>${calculateFinalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full" disabled={totalSelectedProducts === 0}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add Bundle to Cart
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Save Bundle
                  </Button>
                </CardFooter>
              </Card>

              <div className="md:hidden">
                <Collapsible open={summaryOpen} onOpenChange={setSummaryOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full flex items-center justify-between">
                      <span>View Bundle Summary</span>
                      {summaryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Total Items:</span>
                            <span>{totalSelectedProducts}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Subtotal:</span>
                            <span>${calculateTotalPrice().toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-green-600">
                            <span className="font-medium">Discount:</span>
                            <span>-${calculateDiscount().toFixed(2)}</span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center justify-between font-bold">
                            <span>Total:</span>
                            <span>${calculateFinalPrice().toFixed(2)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    Bundle Information
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-2 h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            This bundle includes a {bundle.discountValue}% discount when you purchase all required items
                            together.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Save {bundle.discountValue}% with this bundle</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
