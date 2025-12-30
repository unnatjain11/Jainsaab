"use client"

import { useCart } from "./cart-provider"
import { Badge } from "./ui/badge"
import { useEffect, useState } from "react"

export function CartBadge() {
  const { getCartQuantity } = useCart()
  const [mounted, setMounted] = useState(false)

  // Only show the badge after the component has mounted on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || getCartQuantity() <= 0) {
    return null
  }

  return (
    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
      {getCartQuantity()}
    </Badge>
  )
} 