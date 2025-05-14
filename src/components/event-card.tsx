// import Link from "next/link"
// import Image from "next/image"
// import { CalendarIcon, MapPinIcon } from "lucide-react"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"

// interface Event {
//   id: string
//   title: string
//   date: string
//   location: string
//   image: string
//   organizer: string
//   price: number
// }

// interface EventCardProps {
//   event: Event
// }

// export default function EventCard({ event }: EventCardProps) {
//   return (
//     <Card className="overflow-hidden  p-0 transition-all hover:shadow-md">
//       <div className="relative    h-48 w-full">
//         <Image
//           src={event.image || "/placeholder.svg"}
//           alt={event.title}
//           fill
//           className="object-cover"
          
//         />
//       </div>
//       <CardContent className="p-4">
//         <div className="mb-2">
//           <Badge variant="outline" className="bg-purple-50 text-purple-700">
//             Featured
//           </Badge>
//         </div>
//         <h3 className="mb-2 text-xl font-bold">{event.title}</h3>
//         <div className="mb-1 flex items-center text-gray-600">
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           <span className="text-sm">{event.date}</span>
//         </div>
//         <div className="flex items-center text-gray-600">
//           <MapPinIcon className="mr-2 h-4 w-4" />
//           <span className="text-sm">{event.location}</span>
//         </div>
//       </CardContent>
//       <CardFooter className="flex items-center justify-between border-t p-4">
//         <div>
//           <span className="text-lg font-bold">${event.price}</span>
//         </div>
//         <Button asChild>
//           <Link href={`/events/${event.id}`}>View Details</Link>
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }


// import Link from "next/link"
// import Image from "next/image"
// import { CalendarIcon, MapPinIcon } from "lucide-react"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"

// interface Event {
//   id: string
//   title: string
//   date: string
//   location: string
//   image: string
//   organizer: string
//   price: number
// }

// interface EventCardProps {
//   event: Event
// }

// export default function EventCard({ event }: EventCardProps) {
//   return (
//     <Card className="overflow-hidden p-0 transition-all hover:shadow-md">
//       <div className="relative h-48 w-full">
//         <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
//       </div>
//       <CardContent className="p-4">
//         <div className="mb-2">
//           <Badge variant="outline" className="bg-purple-50 text-purple-700">
//             Featured
//           </Badge>
//         </div>
//         <h3 className="mb-2 text-xl font-bold">{event.title}</h3>
//         <div className="mb-1 flex items-center text-gray-600">
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           <span className="text-sm">{event.date}</span>
//         </div>
//         <div className="flex items-center text-gray-600">
//           <MapPinIcon className="mr-2 h-4 w-4" />
//           <span className="text-sm">{event.location}</span>
//         </div>
//       </CardContent>
//       <CardFooter className="flex items-center justify-between border-t p-4">
//         <div>
//           <span className="text-lg font-bold">${event.price}</span>
//         </div>
//         <Button asChild>
//           <Link href={`/events/${event.id}`}>View Details</Link>
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }


import Link from "next/link"
import Image from "next/image"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Ticket {
  type: string
  name: string
  price: number
  description: string
}

interface Event {
  id: string
  title: string
  date: string
  time?: string
  location: string
  image: string
  organizer: string
  price: number
  description?: string
  tickets?: Ticket[]
  category?: string
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden p-0 transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex gap-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Featured
          </Badge>
          {event.category && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {event.category}
            </Badge>
          )}
        </div>
        <h3 className="mb-2 text-xl font-bold">{event.title}</h3>
        <div className="mb-1 flex items-center text-gray-600">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">{event.date}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPinIcon className="mr-2 h-4 w-4" />
          <span className="text-sm">{event.location}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div>
          <span className="text-lg font-bold">${event.price.toFixed(2)}</span>
        </div>
        <Button asChild>
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
