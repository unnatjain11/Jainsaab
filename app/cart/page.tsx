"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { Trash, ShoppingBag, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { Trash2 } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleCheckout = () => {
    router.push('/checkout')
  }

  // Use consistent initial render structure to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <p>Loading cart...</p>
      </div>
    )
  }

  // Only render empty cart or full cart view after client hydration
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        className="w-16 text-center"
                        readOnly
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{getCartTotal().toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full" onClick={handleCheckout} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Proceed to Checkout"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
