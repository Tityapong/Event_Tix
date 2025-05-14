// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import EventCard from "@/components/event-card"
// import { Search } from "lucide-react"

// export default function EventsPage() {
//   // Mock data for events
//   const events = [
//     {
//       id: "1",
//       title: "Summer Music Festival",
//       date: "June 15, 2025",
//       location: "Central Park, New York",
//       image:  "/event1.jpg",
//       organizer: "Music Events Inc.",
//       price: 49.99,
//     },
//     {
//       id: "2",
//       title: "Tech Conference 2025",
//       date: "July 10, 2025",
//       location: "Convention Center, San Francisco",
//       image:  "/event1.jpg",
//       organizer: "TechTalks",
//       price: 199.99,
//     },
//     {
//       id: "3",
//       title: "Food & Wine Festival",
//       date: "August 5, 2025",
//       location: "Waterfront Plaza, Chicago",
//       image:  "/event1.jpg",
//       organizer: "Culinary Arts Association",
//       price: 79.99,
//     },
//     {
//       id: "4",
//       title: "Business Leadership Summit",
//       date: "September 20, 2025",
//       location: "Grand Hotel, Boston",
//       image:  "/event1.jpg",
//       organizer: "Business Leaders Network",
//       price: 299.99,
//     },
//     {
//       id: "5",
//       title: "Art Exhibition Opening",
//       date: "October 8, 2025",
//       location: "Modern Art Gallery, Los Angeles",
//       image:  "/event1.jpg",
//       organizer: "Contemporary Arts Foundation",
//       price: 25.0,
//     },
//     {
//       id: "6",
//       title: "Charity Gala Dinner",
//       date: "November 15, 2025",
//       location: "Luxury Hotel, Miami",
//       image:  "/event1.jpg",
//       organizer: "Global Aid Foundation",
//       price: 150.0,
//     },
//   ]

//   return (
//     <main className="container mx-auto px-4 py-8">
//       <h1 className="mb-8 text-3xl font-bold">Discover Events</h1>

//       {/* Search and Filter */}
//       <div className="mb-8 grid gap-4 md:grid-cols-4">
//         <div className="relative md:col-span-2">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//           <Input placeholder="Search events..." className="pl-10" />
//         </div>
//         <Select>
//           <SelectTrigger>
//             <SelectValue placeholder="Category" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Categories</SelectItem>
//             <SelectItem value="music">Music</SelectItem>
//             <SelectItem value="business">Business</SelectItem>
//             <SelectItem value="food">Food & Drink</SelectItem>
//             <SelectItem value="arts">Arts</SelectItem>
//             <SelectItem value="sports">Sports</SelectItem>
//             <SelectItem value="tech">Technology</SelectItem>
//           </SelectContent>
//         </Select>
//         <Select>
//           <SelectTrigger>
//             <SelectValue placeholder="Date" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">Any Date</SelectItem>
//             <SelectItem value="today">Today</SelectItem>
//             <SelectItem value="tomorrow">Tomorrow</SelectItem>
//             <SelectItem value="week">This Week</SelectItem>
//             <SelectItem value="month">This Month</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Events Grid */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {events.map((event) => (
//           <EventCard key={event.id} event={event} />
//         ))}
//       </div>

//       {/* Pagination */}
//       <div className="mt-8 flex justify-center">
//         <div className="flex space-x-2">
//           <Button variant="outline" disabled>
//             Previous
//           </Button>
//           <Button variant="outline" className="bg-purple-700 text-white hover:bg-purple-800">
//             1
//           </Button>
//           <Button variant="outline">2</Button>
//           <Button variant="outline">3</Button>
//           <Button variant="outline">Next</Button>
//         </div>
//       </div>
//     </main>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import EventCard from "@/components/event-card"
import { events, categories } from "@/lib/events-data"

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

// Additional categories that might not be in the events data
const allCategories = [
  ...categories,
  "Concerts",
  "Sports",
  "Trade Show",
  "Networking",
  "Workshop",
  "Product Launch",
  "Art and Theater",
  "Family",
  "Movie",
  "Free Access",
  "Party",
]
  .filter((value, index, self) => self.indexOf(value) === index)
  .sort()

export default function EventsPage() {
  // State for selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  // State for filtered events
  const [filteredEvents, setFilteredEvents] = useState(events)
  // State for search query
  const [searchQuery, setSearchQuery] = useState("")

  // Handle category checkbox change
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category)
      } else {
        return [...prev, category]
      }
    })
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
      result = result.filter((event) => selectedCategories.includes(event.category || ""))
    }

    // Filter by search query if it exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query),
      )
    }

    setFilteredEvents(result)
  }, [selectedCategories, searchQuery])

  return (
    <>
      <style>
        {scrollbarStyles}
      </style>
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Discover Events</h1>

        {/* Search and Filter Container */}
        <div className="mb-8 grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <div className="rounded-lg border p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <button className="text-purple-600 text-sm hover:underline" onClick={resetFilters}>
                Reset
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Category</h3>
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {allCategories.map((category) => {
                  const id = category.toLowerCase().replace(/\s+/g, "-")
                  return (
                    <div key={id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={id}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor={id} className="ml-2 text-sm">
                        {category}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Active Filters */}
            {selectedCategories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                    <button
                      className="ml-2 text-purple-600 hover:text-purple-800"
                      onClick={() => handleCategoryChange(category)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Events Grid */}
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

            {/* Pagination - Only show if we have events */}
            {filteredEvents.length > 0 && (
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
