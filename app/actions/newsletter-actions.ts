"use server"

// In-memory newsletter subscribers (resets on server restart)
const subscribers: string[] = [];

export async function subscribeToNewsletter(formData: FormData) {
  try {
    const email = formData.get("email") as string

    if (!email) {
      return { success: false, message: "Email is required" }
    }

    // Check if already subscribed
    if (subscribers.includes(email)) {
      return { success: true, message: "You are already subscribed to our newsletter" }
    }

    // Add new subscriber
    subscribers.push(email)

    return { success: true, message: "Thank you for subscribing to our newsletter!" }
  } catch (error: any) {
    console.error("Newsletter subscription error:", error)
    return { success: false, message: "Failed to subscribe. Please try again." }
  }
}
