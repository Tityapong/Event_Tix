"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, MapPinIcon, PlusIcon, TicketIcon, UsersIcon, Trash2Icon } from "lucide-react"
import { CategoryList } from "@/components/categories/category-list"
import { fetchEvents, type Event, deleteEvent } from "@/lib/events"
// import Image from "next/image";

// Skeleton Components
function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6 animate-pulse">
        <div className="mb-2 h-6 w-6 rounded-full bg-gray-200"></div>
        <div className="h-6 w-16 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </CardContent>
    </Card>
  )
}

function EventCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image skeleton */}
        <div className="w-full h-40 bg-gray-200 rounded-md"></div>

        {/* Location skeleton */}
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>

        {/* Tickets skeleton */}
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>

        {/* Revenue skeleton */}
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
        </div>

        {/* Category skeleton */}
        <div className="flex items-center">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="h-9 w-20 bg-gray-200 rounded"></div>
        <div className="flex gap-2">
          <div className="h-9 w-20 bg-gray-200 rounded"></div>
          <div className="h-9 w-9 bg-gray-200 rounded"></div>
        </div>
      </CardFooter>
    </Card>
  )
}

function SettingsTabSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-48 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="h-9 w-36 bg-gray-200 rounded"></div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function OrganizerDashboardPage() {
  // const router = useRouter();
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<{
    id: string
    title: string
  } | null>(null)
  const [activeTab, setActiveTab] = useState("events")

  // Mock organizer data
  const organizer = {
    name: "Music Events Inc.",
    email: "contact@musicevents.com",
  }

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true)
      const fetchedEvents = await fetchEvents()
      setEvents(fetchedEvents)
      setIsLoading(false)
    }
    loadEvents()
  }, [])

  const openDeleteDialog = (eventId: string, eventTitle: string) => {
    setEventToDelete({ id: eventId, title: eventTitle })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!eventToDelete) return

    try {
      await deleteEvent(eventToDelete.id)
      setEvents((ev) => ev.filter((e) => e.id !== eventToDelete.id))
      toast.success("Event deleted successfully!", {
        description: `"${eventToDelete.title}" has been deleted.`,
      })
    } catch {
      toast.error("Failed to delete event", {
        description: "An error occurred while deleting the event. Please try again.",
      })
    } finally {
      setIsDialogOpen(false)
      setEventToDelete(null)
    }
  }

  // Stats
  const totalEvents = events.length
  const totalTicketsSold = events.reduce(
    (sum, e) => sum + e.tickets.reduce((ts, t) => ts + (t.quantity_available || 0), 0),
    0,
  )
  const totalRevenue = events.reduce(
    (sum, e) =>
      sum +
      e.tickets.reduce((ts, t) => {
        const dp = t.price * (1 - t.discount / 100)
        return ts + dp * (t.quantity_available || 0)
      }, 0),
    0,
  )
  const totalAttendees = totalTicketsSold

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <CalendarIcon className="mb-2 h-6 w-6 text-purple-700" />
                <h3 className="text-xl font-bold">{totalEvents}</h3>
                <p className="text-sm text-gray-500">Total Events</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <TicketIcon className="mb-2 h-6 w-6 text-purple-700" />
                <h3 className="text-xl font-bold">{totalTicketsSold}</h3>
                <p className="text-sm text-gray-500">Tickets Sold</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <UsersIcon className="mb-2 h-6 w-6 text-purple-700" />
                <h3 className="text-xl font-bold">{totalAttendees}</h3>
                <p className="text-sm text-gray-500">Attendees</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <div className="mb-2 flex h-6 w-6 items-center justify-center text-purple-700">$</div>
                <h3 className="text-xl font-bold">${totalRevenue.toFixed(2)}</h3>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="events" className="space-y-6" onValueChange={setActiveTab} value={activeTab}>
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

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          {event.date} • {event.time}
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          event.tickets.some((t) => t.quantity_available > 0)
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {event.tickets.some((t) => t.quantity_available > 0) ? "Active" : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {event.image && (
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={`${event.title} image`}
                        className="w-full h-40 object-cover rounded-md mb-4"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-image.png"
                          e.currentTarget.onerror = null
                        }}
                      />
                    )}
                    <div className="flex items-center">
                      <MapPinIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <TicketIcon className="mr-2 h-4 w-4 text-gray-500" />
                      <span>
                        {event.tickets.reduce((s, t) => s + (t.quantity_available || 0), 0)} tickets available
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 flex h-4 w-4 items-center justify-center text-gray-500">$</div>
                      <span>
                        $
                        {event.tickets
                          .reduce((s, t) => {
                            const dp = t.price * (1 - t.discount / 100)
                            return s + dp * (t.quantity_available || 0)
                          }, 0)
                          .toFixed(2)}{" "}
                        revenue
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500">Category: {event.category}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/organizer/events/${event.id}`}>Manage</Link>
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href={`/organizer/events/${event.id}/tickets`}>Tickets</Link>
                      </Button>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => openDeleteDialog(event.id, event.title)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Event</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete {eventToDelete?.title}? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p>You have not created any events yet</p>
                <Button asChild>
                  <Link href="/organizer/events/create">Create Event</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <CategoryList />
          )}
        </TabsContent>

        <TabsContent value="settings">
          {isLoading ? (
            <SettingsTabSkeleton />
          ) : (
            <>
              <h2 className="text-xl font-semibold">Organizer Settings</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Organization Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p>{organizer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p>{organizer.email}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Edit Organization</Button>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
