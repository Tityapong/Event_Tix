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

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EventCard from "@/components/event-card"
import { Search } from "lucide-react"
import { events } from "@/lib/events-data"

export default function EventsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Discover Events</h1>

      {/* Search and Filter */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search events..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="food">Food & Drink</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="tech">Technology</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Date</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Pagination */}
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
    </main>
  )
}
