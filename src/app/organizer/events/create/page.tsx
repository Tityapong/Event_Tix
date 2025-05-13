"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, Trash2Icon } from "lucide-react"

export default function CreateEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tickets, setTickets] = useState([
    { type: "standard", name: "Standard", price: 49.99, description: "General admission", quantity: 100 },
    { type: "premium", name: "Premium", price: 99.99, description: "Priority seating, fast-track entry", quantity: 50 },
  ])
  const [activeTab, setActiveTab] = useState("details")

  const addTicketType = () => {
    setTickets([...tickets, { type: `ticket-${tickets.length + 1}`, name: "", price: 0, description: "", quantity: 0 }])
  }

  const removeTicketType = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate event creation - in a real app, this would call an API
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/organizer/dashboard")
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Create New Event</h1>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
                <CardDescription>Provide the basic details about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" placeholder="Enter event title" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your event" className="min-h-32" required />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="food">Food & Drink</SelectItem>
                        <SelectItem value="arts">Arts</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Event venue" required />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" type="time" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" type="time" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image</Label>
                  <Input id="image" type="file" accept="image/*" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => router.push("/organizer/dashboard")}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setActiveTab("tickets")}>
                  Next: Tickets
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Information</CardTitle>
                <CardDescription>Set up the different ticket types for your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tickets.map((ticket, index) => (
                  <div key={index} className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Ticket Type {index + 1}</h3>
                      {tickets.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTicketType(index)}
                          className="h-8 w-8 p-0 text-red-500"
                        >
                          <Trash2Icon className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`ticketName-${index}`}>Ticket Name</Label>
                        <Input
                          id={`ticketName-${index}`}
                          placeholder="e.g., Standard, VIP, Early Bird"
                          value={ticket.name}
                          onChange={(e) => {
                            const newTickets = [...tickets]
                            newTickets[index].name = e.target.value
                            setTickets(newTickets)
                          }}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`ticketPrice-${index}`}>Price ($)</Label>
                        <Input
                          id={`ticketPrice-${index}`}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={ticket.price}
                          onChange={(e) => {
                            const newTickets = [...tickets]
                            newTickets[index].price = Number.parseFloat(e.target.value)
                            setTickets(newTickets)
                          }}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`ticketDescription-${index}`}>Description</Label>
                      <Textarea
                        id={`ticketDescription-${index}`}
                        placeholder="Describe what's included with this ticket"
                        value={ticket.description}
                        onChange={(e) => {
                          const newTickets = [...tickets]
                          newTickets[index].description = e.target.value
                          setTickets(newTickets)
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`ticketQuantity-${index}`}>Quantity Available</Label>
                      <Input
                        id={`ticketQuantity-${index}`}
                        type="number"
                        min="1"
                        placeholder="100"
                        value={ticket.quantity}
                        onChange={(e) => {
                          const newTickets = [...tickets]
                          newTickets[index].quantity = Number.parseInt(e.target.value)
                          setTickets(newTickets)
                        }}
                        required
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addTicketType}
                  className="flex w-full items-center justify-center"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Another Ticket Type
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setActiveTab("details")}>
                  Back: Details
                </Button>
                <Button type="button" onClick={() => setActiveTab("settings")}>
                  Next: Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Event Settings</CardTitle>
                <CardDescription>Configure additional settings for your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Discounts</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="discountCode">Discount Code</Label>
                      <Input id="discountCode" placeholder="e.g., SUMMER25" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountAmount">Discount Amount (%)</Label>
                      <Input id="discountAmount" type="number" min="0" max="100" placeholder="25" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Visibility</h3>
                  <div className="space-y-2">
                    <Label htmlFor="status">Event Status</Label>
                    <Select defaultValue="draft">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft - Not visible to public</SelectItem>
                        <SelectItem value="published">Published - Visible to public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Additional Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="organizer">Organizer Name</Label>
                    <Input id="organizer" placeholder="Who is organizing this event?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" type="email" placeholder="Email for attendee inquiries" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => setActiveTab("tickets")}>
                  Back: Tickets
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Event..." : "Create Event"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
