// import Link from "next/link"
// import Image from "next/image"
// import { Calendar, MapPin, User, Clock, Tag } from "lucide-react"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"

// interface Ticket {
//   type: string
//   name: string
//   price: number
//   description: string
// }

// interface Event {
//   id: string
//   title: string
//   date: string
//   time?: string
//   location: string
//   image: string
//   organizer: string
//   description?: string
//   tickets?: Ticket[]
//   category?: string
// }

// interface EventCardProps {
//   event: Event
// }

// export default function EventCard({ event }: EventCardProps) {
//   // Calculate min and max ticket prices
//   const ticketPrices = event.tickets?.map((ticket) => ticket.price) || []
//   const minPrice = ticketPrices.length > 0 ? Math.min(...ticketPrices) : 0
//   const maxPrice = ticketPrices.length > 0 ? Math.max(...ticketPrices) : 0

//   return (
//     <Card className="group relative overflow-hidden rounded-2xl border-none p-0 shadow-sm transition-all duration-300 hover:shadow-xl">
//       <div className="relative h-56 w-full overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
//         <Image 
//           src={event.image || "/placeholder.svg"} 
//           alt={event.title} 
//           fill 
//           className="object-cover transition-transform duration-700 group-hover:scale-110" 
//         />
//         {event.category && (
//           <div className="absolute top-4 right-4 z-20">
//             <Badge className="bg-teal-500/90 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-sm hover:bg-teal-600">
//               {event.category}
//             </Badge>
//           </div>
//         )}
//         <div className="absolute bottom-4 left-4 z-20">
//           <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-md">{event.title}</h3>
//           <div className="flex items-center">
//             <Badge className="bg-white/20 backdrop-blur-sm text-white border-none">
//               <Clock className="mr-1 h-3 w-3" />
//               <span className="text-xs">{event.date}{event.time && ` • ${event.time}`}</span>
//             </Badge>
//           </div>
//         </div>
//       </div>
      
//       <CardContent className="p-5">
//         <div className="flex flex-col space-y-3 text-gray-600">
//           <div className="flex items-center">
//             <MapPin className="mr-2 h-4 w-4 text-teal-600" />
//             <span className="text-sm font-medium line-clamp-1">{event.location}</span>
//           </div>
//           <div className="flex items-center">
//             <User className="mr-2 h-4 w-4 text-teal-600" />
//             <span className="text-sm font-medium line-clamp-1">By {event.organizer}</span>
//           </div>
//           {ticketPrices.length > 0 && (
//             <div className="flex items-center">
//               <Tag className="mr-2 h-4 w-4 text-teal-600" />
//               <div>
//                 <span className="text-base font-bold text-teal-600">
//                   ${minPrice.toFixed(2)}
//                   {minPrice !== maxPrice && ` - ${maxPrice.toFixed(2)}`}
//                 </span>
//                 <span className="ml-1 text-xs text-gray-500">per ticket</span>
//               </div>
//             </div>
//           )}
//           {ticketPrices.length === 0 && (
//             <div className="flex items-center">
//               <Tag className="mr-2 h-4 w-4 text-teal-600" />
//               <span className="text-base font-bold text-teal-600">Free Event</span>
//             </div>
//           )}
//         </div>
//       </CardContent>
      
//       <CardFooter className="flex items-center justify-end px-5 pb-5 pt-0">
//         <Button className="bg-teal-600 hover:bg-teal-700 transition-all duration-300 px-6 rounded-full" asChild>
//           <Link href={`/events/${event.id}`}>View Details</Link>
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }

import Link from "next/link";

import {  MapPin, User, Clock, Tag } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Ticket {
  name: string;
  price: number;
  discount: number;
  quantity_available: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  image: string;
  organizer: string;
  description?: string;
  tickets?: Ticket[];
  category?: string;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // Calculate min and max ticket prices
  const ticketPrices = event.tickets?.map((ticket) => ticket.price) || [];
  const minPrice = ticketPrices.length > 0 ? Math.min(...ticketPrices) : 0;
  const maxPrice = ticketPrices.length > 0 ? Math.max(...ticketPrices) : 0;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-none p-0 shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="relative h-56 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
        <Image
          src={event.image || "/placeholder.svg"} 
          alt={event.title} 
          fill         
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        {event.category && (
          <div className="absolute top-4 right-4 z-20">
            <Badge className="bg-teal-500/90 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur-sm hover:bg-teal-600">
              {event.category}
            </Badge>
          </div>
        )}
        <div className="absolute bottom-4 left-4 z-20">
          <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-md">{event.title}</h3>
          <div className="flex items-center">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-none">
              <Clock className="mr-1 h-3 w-3" />
              <span className="text-xs">{event.date}{event.time && ` • ${event.time}`}</span>
            </Badge>
          </div>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex flex-col space-y-3 text-gray-600">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-teal-600" />
            <span className="text-sm font-medium line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-teal-600" />
            <span className="text-sm font-medium line-clamp-1">By {event.organizer}</span>
          </div>
          {ticketPrices.length > 0 && (
            <div className="flex items-center">
              <Tag className="mr-2 h-4 w-4 text-teal-600" />
              <div>
                <span className="text-base font-bold text-teal-600">
                  ${minPrice.toFixed(2)}
                  {minPrice !== maxPrice && ` - ${maxPrice.toFixed(2)}`}
                </span>
                <span className="ml-1 text-xs text-gray-500">per ticket</span>
              </div>
            </div>
          )}
          {ticketPrices.length === 0 && (
            <div className="flex items-center">
              <Tag className="mr-2 h-4 w-4 text-teal-600" />
              <span className="text-base font-bold text-teal-600">Free Event</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-end px-5 pb-5 pt-0">
        <Button className="bg-teal-600 hover:bg-teal-700 transition-all duration-300 px-6 rounded-full" asChild>
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}