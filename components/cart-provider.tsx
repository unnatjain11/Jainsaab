"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartQuantity: () => number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Initialize from localStorage immediately if we're on the client side
    if (typeof window !== 'undefined') {
      try {
        // First try to load from regular cart storage
        const storedCart = localStorage.getItem("cart")
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          if (parsedCart && parsedCart.length > 0) {
            return parsedCart;
          }
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
    return [];
  });
  
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    } else {
      // Only remove cart from localStorage if we're not on the success page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('success')) {
        localStorage.removeItem("cart")
      }
    }
  }, [cartItems])

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
      }
      return [...prevItems, item]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    // Empty the cart state
    setCartItems([])
    
    // Special handling for cart clearing:
    // Only remove from localStorage if we're not on the success page
    if (typeof window !== 'undefined' && !window.location.pathname.includes('success')) {
      localStorage.removeItem("cart")
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartQuantity,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
