"use client"

import type React from "react"
import { useState, Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Wallet } from "lucide-react"
import { events } from "@/lib/events-data"

interface Ticket {
  type: string
  name: string
  price: number
  description: string
  discount?: {
    percentage: number
    originalPrice: number
  }
}

// interface Event {
//   id: string
//   title: string
//   date: string
//   time?: string
//   location: string
//   image: string
//   organizer: string
//   description?: string
//   tickets?: Ticket[]
//   category?: string
// }

interface TicketSelection {
  type: string
  quantity: number
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get("eventId")
  const ticketsParam = searchParams.get("tickets")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isValidating, setIsValidating] = useState(true)

  // Parse tickets parameter
  const selectedTickets: TicketSelection[] = ticketsParam
    ? ticketsParam.split(",").map((t) => {
        const [type, quantity] = t.split(":")
        return { type, quantity: parseInt(quantity) }
      })
    : []

  // Find the event based on eventId
  const event = events.find((e) => e.id === eventId) || {
    id: "not-found",
    title: "Event Not Found",
    date: "",
    location: "",
    tickets: [],
  }

  // Validate tickets and calculate prices
  const ticketDetails = selectedTickets.map((sel) => {
    const ticket = event.tickets?.find((t) => t.type === sel.type)
    return ticket ? { ...ticket, quantity: sel.quantity } : null
  }).filter((t): t is Ticket & { quantity: number } => t !== null)

  const subtotal = ticketDetails.reduce((sum, ticket) => sum + ticket.price * ticket.quantity, 0)
  const serviceFee = 1.00
  const total = subtotal + serviceFee

  // Redirect to events page if event or tickets are invalid
  useEffect(() => {
    if (!eventId || !ticketsParam || event.id === "not-found" || ticketDetails.length === 0) {
      router.push("/events")
    } else {
      setIsValidating(false)
    }
  }, [eventId, ticketsParam, event, ticketDetails, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing - in a real app, this would call a payment API
    setTimeout(() => {
      setIsProcessing(false)
      router.push("/checkout/confirmation")
    }, 2000)
  }

  if (isValidating || !eventId || !ticketsParam || event.id === "not-found" || ticketDetails.length === 0) {
    return <div className="container mx-auto px-4 py-8">Validating checkout...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="card" className="space-y-4">
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center">
                      <Wallet className="mr-2 h-5 w-5" />
                      Digital Wallet
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Card Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input id="cardName" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input id="zipCode" required />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? "Processing Payment..." : `Pay $${total.toFixed(2)}`}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.date}</p>
                <p className="text-sm text-gray-500">{event.location}</p>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Ticket Details</h4>
                {ticketDetails.map((ticket) => (
                  <p key={ticket.type} className="flex justify-between">
                    <span>{ticket.quantity} × {ticket.name} Ticket</span>
                    <span>${(ticket.price * ticket.quantity).toFixed(2)}</span>
                  </p>
                ))}
              </div>

              <Separator />

              <div className="space-y-1">
                <p className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Service Fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </p>
                <p className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}