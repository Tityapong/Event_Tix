"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import EventCard from "@/components/event-card"
import { ArrowRight } from "lucide-react"
import HomeHero from "@/components/home-hero"
import { fetchEvents, type Event } from "@/lib/events"

// Skeleton Card Component
function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-48 bg-gray-200">
        {/* VIP badge skeleton */}
        <div className="absolute top-3 right-3 bg-gray-300 rounded-full px-3 py-1 h-6 w-12"></div>
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>

        {/* Date skeleton */}
        <div className="h-4 bg-gray-200 rounded w-full"></div>

        {/* Location skeleton */}
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>

        {/* Organizer skeleton */}
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>

        {/* Price skeleton */}
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Button skeleton */}
        <div className="pt-2">
          <div className="h-10 bg-gray-200 rounded-full w-full"></div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true)
        const fetchedEvents = await fetchEvents()
        setEvents(fetchedEvents.slice(0, 3))
      } catch {
        setError("Failed to load featured events. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    loadEvents()
  }, [])

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <HomeHero />

      {/* Featured Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/events">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? // Show skeleton cards while loading
                Array.from({ length: 3 }).map((_, index) => <EventCardSkeleton key={`skeleton-${index}`} />)
              : // Show actual event cards when loaded
                events.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      </section>
    </main>
  )
}
