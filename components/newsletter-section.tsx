"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { subscribeToNewsletter } from "@/app/actions/newsletter-actions"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await subscribeToNewsletter(new FormData(e.target as HTMLFormElement))

      toast({
        title: result.success ? "Success!" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })

      if (result.success) {
        setEmail("")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Subscribe to Our Newsletter</h2>
            <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
              Stay updated with our latest products and exclusive offers.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2" onSubmit={handleSubmit}>
              <Input
                className="max-w-lg flex-1 bg-primary-foreground text-foreground"
                placeholder="Enter your email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            <p className="text-xs text-primary-foreground/60">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
