// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { CalendarIcon, Clock, MapPin, User } from "lucide-react"

// export default function EventDetailPage({ params }: { params: { id: string } }) {
//   const router = useRouter()
//   const [selectedTicket, setSelectedTicket] = useState("standard")

//   // Mock event data - in a real app, this would be fetched from an API
//   const event = {
//     id: params.id,
//     title: "Summer Music Festival",
//     date: "June 15, 2025",
//     time: "4:00 PM - 11:00 PM",
//     location: "Central Park, New York",
//     image:  "/event1.jpg",
//     organizer: "Music Events Inc.",
//     description:
//       "Join us for the biggest summer music festival featuring top artists from around the world. Enjoy a day of amazing performances, food, and fun activities for all ages.",
//     tickets: [
//       {
//         type: "vip",
//         name: "VIP",
//         price: 149.99,
//         description: "Front row access, exclusive lounge, complimentary drinks",
//       },
//       { type: "premium", name: "Premium", price: 99.99, description: "Priority seating, fast-track entry" },
//       { type: "standard", name: "Standard", price: 49.99, description: "General admission" },
//     ],
//   }

//   const handleBuyTicket = () => {
//     router.push(`/checkout?eventId=${event.id}&ticketType=${selectedTicket}`)
//   }

//   return (
//     <main className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <Link href="/events" className="text-purple-600 hover:underline">
//           ← Back to Events
//         </Link>
//       </div>

//       <div className="grid gap-8 lg:grid-cols-3">
//         {/* Event Details */}
//         <div className="lg:col-span-2">
//           <div className="mb-6 overflow-hidden rounded-lg">
//             <Image
//               src={event.image || "/placeholder.svg"}
//               alt={event.title}
//               width={1200}
//               height={600}
//               className="w-full object-cover"
//             />
//           </div>

//           <h1 className="mb-4 text-3xl font-bold">{event.title}</h1>

//           <div className="mb-6 grid gap-4 sm:grid-cols-2">
//             <div className="flex items-center">
//               <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
//               <span>{event.date}</span>
//             </div>
//             <div className="flex items-center">
//               <Clock className="mr-2 h-5 w-5 text-gray-500" />
//               <span>{event.time}</span>
//             </div>
//             <div className="flex items-center">
//               <MapPin className="mr-2 h-5 w-5 text-gray-500" />
//               <span>{event.location}</span>
//             </div>
//             <div className="flex items-center">
//               <User className="mr-2 h-5 w-5 text-gray-500" />
//               <span>{event.organizer}</span>
//             </div>
//           </div>

//           <div className="mb-8">
//             <h2 className="mb-4 text-2xl font-semibold">About This Event</h2>
//             <p className="text-gray-700">{event.description}</p>
//           </div>
//         </div>

//         {/* Ticket Selection */}
//         <div>
//           <Card>
//             <CardContent className="p-6">
//               <h2 className="mb-4 text-xl font-semibold">Select Tickets</h2>

//               <RadioGroup value={selectedTicket} onValueChange={setSelectedTicket} className="space-y-4">
//                 {event.tickets.map((ticket) => (
//                   <div key={ticket.type} className="rounded-lg border p-4">
//                     <div className="flex items-start space-x-3">
//                       <RadioGroupItem value={ticket.type} id={ticket.type} className="mt-1" />
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between">
//                           <Label htmlFor={ticket.type} className="text-lg font-medium">
//                             {ticket.name}
//                           </Label>
//                           <span className="font-bold">${ticket.price}</span>
//                         </div>
//                         <p className="text-sm text-gray-500">{ticket.description}</p>
//                         {ticket.type === "vip" && (
//                           <Badge className="mt-2 bg-purple-100 text-purple-800">Limited Availability</Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </RadioGroup>

//               <Button onClick={handleBuyTicket} className="mt-6 w-full">
//                 Buy Now
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </main>
//   )
// }



"use client"

import { useState } from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, MapPin, User } from "lucide-react"
import { events } from "@/lib/events-data"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function EventDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [selectedTicket, setSelectedTicket] = useState("standard")

  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params)
  const eventId = unwrappedParams.id

  // Find the event with the matching ID from our events data
  const event = events.find((event) => event.id === eventId) || {
    id: "not-found",
    title: "Event Not Found",
    date: "",
    time: "",
    location: "",
    image: "/placeholder.svg",
    organizer: "",
    description: "Sorry, the event you're looking for could not be found.",
    tickets: [],
  }

  const handleBuyTicket = () => {
    router.push(`/checkout?eventId=${event.id}&ticketType=${selectedTicket}`)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/events" className="text-purple-600 hover:underline">
          ← Back to Events
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Event Details */}
        <div className="lg:col-span-2">
          <div className="mb-6 overflow-hidden rounded-lg">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              width={1200}
              height={600}
              className="w-full object-cover"
            />
          </div>

          <h1 className="mb-4 text-3xl font-bold">{event.title}</h1>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-500" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-gray-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-gray-500" />
              <span>{event.organizer}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">About This Event</h2>
            <p className="text-gray-700">{event.description}</p>
          </div>
        </div>

        {/* Ticket Selection */}
        <div>
          {event.tickets.length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Select Tickets</h2>

                <RadioGroup value={selectedTicket} onValueChange={setSelectedTicket} className="space-y-4">
                  {event.tickets.map((ticket) => (
                    <div key={ticket.type} className="rounded-lg border p-4">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={ticket.type} id={ticket.type} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={ticket.type} className="text-lg font-medium">
                              {ticket.name}
                            </Label>
                            <span className="font-bold">${ticket.price}</span>
                          </div>
                          <p className="text-sm text-gray-500">{ticket.description}</p>
                          {ticket.type === "vip" && (
                            <Badge className="mt-2 bg-purple-100 text-purple-800">Limited Availability</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                <Button onClick={handleBuyTicket} className="mt-6 w-full">
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Tickets</h2>
                <p className="text-gray-700">No tickets available for this event.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
