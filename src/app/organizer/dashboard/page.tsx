import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, PlusIcon, TicketIcon, UsersIcon } from "lucide-react"

export default function OrganizerDashboardPage() {
  // Mock organizer data - in a real app, this would be fetched from an API
  const organizer = {
    name: "Music Events Inc.",
    email: "contact@musicevents.com",
  }

  // Mock events data - in a real app, this would be fetched from an API
  const events = [
    {
      id: "1",
      title: "Summer Music Festival",
      date: "June 15, 2025",
      location: "Central Park, New York",
      status: "active",
      ticketsSold: 245,
      revenue: 12250.55,
    },
    {
      id: "2",
      title: "Jazz Night",
      date: "July 20, 2025",
      location: "Blue Note, New York",
      status: "draft",
      ticketsSold: 0,
      revenue: 0,
    },
  ]

  // Mock categories data - in a real app, this would be fetched from an API
  const categories = [
    { id: "1", name: "Music", eventCount: 5 },
    { id: "2", name: "Concerts", eventCount: 3 },
    { id: "3", name: "Festivals", eventCount: 2 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {organizer.name}</p>
        </div>
        <Button asChild>
          <Link href="/organizer/events/create">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="mb-2 rounded-full bg-purple-100 p-3">
              <CalendarIcon className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="text-xl font-bold">2</h3>
            <p className="text-sm text-gray-500">Total Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="mb-2 rounded-full bg-purple-100 p-3">
              <TicketIcon className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="text-xl font-bold">245</h3>
            <p className="text-sm text-gray-500">Tickets Sold</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="mb-2 rounded-full bg-purple-100 p-3">
              <UsersIcon className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="text-xl font-bold">210</h3>
            <p className="text-sm text-gray-500">Attendees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="mb-2 rounded-full bg-purple-100 p-3">
              <div className="flex h-6 w-6 items-center justify-center text-purple-700">$</div>
            </div>
            <h3 className="text-xl font-bold">$12,250.55</h3>
            <p className="text-sm text-gray-500">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Events</h2>
            <Button variant="outline" asChild>
              <Link href="/organizer/events">View All</Link>
            </Button>
          </div>

          {events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>{event.date}</CardDescription>
                      </div>
                      <Badge
                        className={
                          event.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {event.status === "active" ? "Active" : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center">
                      <MapPinIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <TicketIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm">{event.ticketsSold} tickets sold</span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 flex h-4 w-4 items-center justify-center text-gray-500">$</div>
                      <span className="text-sm">${event.revenue.toFixed(2)} revenue</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/organizer/events/${event.id}`}>Manage</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/organizer/events/${event.id}/tickets`}>Tickets</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="mb-4 text-gray-500">You have not created any events yet</p>
                <Button asChild>
                  <Link href="/organizer/events/create">Create Event</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Categories</h2>
            <Button variant="outline" asChild>
              <Link href="/organizer/categories/create">Create Category</Link>
            </Button>
          </div>

          {categories.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.eventCount} events</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href={`/organizer/categories/${category.id}`}>Edit</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="mb-4 text-gray-500">You have not created any categories yet</p>
                <Button asChild>
                  <Link href="/organizer/categories/create">Create Category</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-xl font-semibold">Organizer Settings</h2>
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <p className="text-sm font-medium text-gray-500">Organization Name</p>
                <p>{organizer.name}</p>
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{organizer.email}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Edit Organization</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
