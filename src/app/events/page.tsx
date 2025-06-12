"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import EventCard from "@/components/event-card"
import CategoryFilter from "@/components/category-filter"
import { fetchEvents, type Event } from "@/lib/events"

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a1a1aa;
  }
`

// Skeleton Components
function FiltersSkeleton() {
  return (
    <div className="rounded-lg border p-5 h-fit animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        <div className="h-5 w-24 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SearchBarSkeleton() {
  return (
    <div className="relative mb-6">
      <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 bg-gray-200 rounded"></div>
      <div className="h-10 w-full bg-gray-200 rounded-md"></div>
    </div>
  )
}

function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border overflow-hidden animate-pulse">
      {/* Image skeleton with category badge */}
      <div className="relative h-48 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
        <div className="absolute top-3 right-3 h-6 w-16 bg-gray-300 rounded-full"></div>
      </div>

      {/* Event title skeleton */}
      <div className="p-4 space-y-4">
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>

        {/* Date skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-40 bg-gray-200 rounded"></div>
        </div>

        {/* Location skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>

        {/* Organizer skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* Price skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>

        {/* Button skeleton */}
        <div className="mt-4">
          <div className="h-10 w-full bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  )
}

export default function EventsPage() {
  // State for events
  const [events, setEvents] = useState<Event[]>([])
  // State for filtered events
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  // State for selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  // State for search query
  const [searchQuery, setSearchQuery] = useState("")
  // State for loading
  const [isLoading, setIsLoading] = useState(true)

  // Fetch events on component mount
  useEffect(() => {
    const getEvents = async () => {
      setIsLoading(true)
      try {
        const eventsData = await fetchEvents()
        setEvents(eventsData)
        setFilteredEvents(eventsData)
      } catch (error) {
        console.error("Failed to load events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getEvents()
  }, [])

  // Handle category selection from the CategoryFilter component
  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories)
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([])
    setSearchQuery("")
  }

  // Filter events based on selected categories and search query
  useEffect(() => {
    let result = events

    // Filter by categories if any are selected
    if (selectedCategories.length > 0) {
      result = result.filter((event) => event.category && selectedCategories.includes(event.category))
    }

    // Filter by search query if it exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          false ||
          event.location.toLowerCase().includes(query),
      )
    }

    setFilteredEvents(result)
  }, [selectedCategories, searchQuery, events])

  return (
    <>
      <style>{scrollbarStyles}</style>
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Discover Events</h1>

        {/* Search and Filter Container */}
        <div className="mb-8 grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          {isLoading ? (
            <FiltersSkeleton />
          ) : (
            <div className="rounded-lg border p-5 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                {/* Uncomment if you want a reset button */}
                {/* <button
                  className="text-purple-600 text-sm hover:underline"
                  onClick={resetFilters}
                >
                  Reset
                </button> */}
              </div>

              <CategoryFilter onCategoryChange={handleCategoryChange} initialSelected={selectedCategories} />
            </div>
          )}

          {/* Main Content */}
          <div>
            {/* Search Bar */}
            {isLoading ? (
              <SearchBarSkeleton />
            ) : (
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search events..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {/* Active Filters */}
            {!isLoading && selectedCategories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                    <button
                      className="ml-2 text-purple-600 hover:text-purple-800"
                      onClick={() => setSelectedCategories((prev) => prev.filter((cat) => cat !== category))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Events Grid */}
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <EventCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
                ) : (
                  <div className="col-span-3 py-10 text-center text-gray-500">
                    <p className="text-lg">No events found matching your criteria.</p>
                    <button className="mt-4 text-purple-600 hover:underline" onClick={resetFilters}>
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pagination - Only show if we have events and not loading */}
            {!isLoading && filteredEvents.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" className="bg-purple-700 text-white hover:bg-purple-800">
                    1
                  </Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
