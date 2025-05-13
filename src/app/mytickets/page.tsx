import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react"

export default function DashboardPage() {
  // Mock user data - in a real app, this would be fetched from an API
  const user = {
    name: "John Doe",
    email: "john@example.com",
  }

  // Mock tickets data - in a real app, this would be fetched from an API
  const upcomingTickets = [
    {
      id: "1",
      eventName: "Summer Music Festival",
      date: "June 15, 2025",
      location: "Central Park, New York",
      ticketType: "Standard",
      orderNumber: "ORD-12345678",
    },
    {
      id: "2",
      eventName: "Tech Conference 2025",
      date: "July 10, 2025",
      location: "Convention Center, San Francisco",
      ticketType: "Premium",
      orderNumber: "ORD-23456789",
    },
  ]

  const pastTickets = [
    {
      id: "3",
      eventName: "Winter Concert Series",
      date: "December 10, 2024",
      location: "Music Hall, Chicago",
      ticketType: "VIP",
      orderNumber: "ORD-34567890",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
        <Button asChild>
          <Link href="/events">Browse Events</Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Tickets</TabsTrigger>
          <TabsTrigger value="past">Past Tickets</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <h2 className="text-xl font-semibold">Your Upcoming Events</h2>
          {upcomingTickets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <CardTitle>{ticket.eventName}</CardTitle>
                    <CardDescription>Order #{ticket.orderNumber}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">{ticket.date}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">{ticket.location}</span>
                    </div>
                    <div className="flex items-center">
                      <TicketIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">{ticket.ticketType} Ticket</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Ticket
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="mb-4 text-gray-500">You don not have any upcoming tickets</p>
                <Button asChild>
                  <Link href="/events">Browse Events</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          <h2 className="text-xl font-semibold">Your Past Events</h2>
          {pastTickets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <CardTitle>{ticket.eventName}</CardTitle>
                    <CardDescription>Order #{ticket.orderNumber}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">{ticket.date}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">{ticket.location}</span>
                    </div>
                    <div className="flex items-center">
                      <TicketIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">{ticket.ticketType} Ticket</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Receipt
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="mb-4 text-gray-500">You do not have any past tickets</p>
                <Button asChild>
                  <Link href="/events">Browse Events</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <h2 className="text-xl font-semibold">Your Profile</h2>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p>{user.name}</p>
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{user.email}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Edit Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
