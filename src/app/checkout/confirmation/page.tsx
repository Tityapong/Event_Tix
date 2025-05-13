import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2 } from "lucide-react"

export default function ConfirmationPage() {
  // Mock confirmation data - in a real app, this would be fetched from an API
  const confirmation = {
    orderNumber: "ORD-12345678",
    event: {
      title: "Summer Music Festival",
      date: "June 15, 2025",
      time: "4:00 PM - 11:00 PM",
      location: "Central Park, New York",
    },
    ticket: {
      type: "Standard",
      quantity: 1,
      price: 49.99,
    },
    total: 55.98,
    purchaseDate: "May 12, 2025",
  }

  return (
    <div className="container mx-auto flex max-w-md flex-col items-center px-4 py-12">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>

      <h1 className="mb-2 text-center text-3xl font-bold">Payment Successful!</h1>
      <p className="mb-8 text-center text-gray-600">Your ticket has been confirmed and sent to your email.</p>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order Confirmation</CardTitle>
          <CardDescription>Order #{confirmation.orderNumber}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">{confirmation.event.title}</h3>
            <p className="text-sm text-gray-500">{confirmation.event.date}</p>
            <p className="text-sm text-gray-500">{confirmation.event.time}</p>
            <p className="text-sm text-gray-500">{confirmation.event.location}</p>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 font-medium">Ticket Details</h4>
            <p className="flex justify-between">
              <span>
                {confirmation.ticket.quantity} × {confirmation.ticket.type} Ticket
              </span>
              <span>${confirmation.ticket.price.toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-sm text-gray-500">
              <span>Service Fee</span>
              <span>${(confirmation.total - confirmation.ticket.price).toFixed(2)}</span>
            </p>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="flex justify-between font-bold">
              <span>Total Paid</span>
              <span>${confirmation.total.toFixed(2)}</span>
            </p>
            <p className="text-sm text-gray-500">Purchase Date: {confirmation.purchaseDate}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full">View E-Ticket</Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard">Go to My Tickets</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
