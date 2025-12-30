"use server"

// In-memory contact messages (resets on server restart)
const contactMessages: { name: string; email: string; subject: string; message: string }[] = [];

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    if (!name || !email || !subject || !message) {
      return { success: false, message: "All fields are required" }
    }

    // Store the contact message in memory
    contactMessages.push({ name, email, subject, message })

    return { success: true, message: "Your message has been sent. We will get back to you soon!" }
  } catch (error: any) {
    console.error("Contact form submission error:", error)
    return { success: false, message: "Failed to send message. Please try again." }
  }
}
