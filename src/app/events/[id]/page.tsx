"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, MapPin, User, Plus, Minus } from "lucide-react"
import { fetchEvents, type Event as EventType } from "@/lib/events"
import { createOrder, type OrderPayload } from "@/lib/order"


interface TicketSelection {
  type: string
  quantity: number
}

// Skeleton Components
function EventDetailSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Back link skeleton */}
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>

      <div className="grid gap-8 lg:grid-cols-3 mt-4">
        {/* Event Details Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image skeleton */}
          <div className="relative overflow-hidden rounded-lg">
            <div className="w-full h-96 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse">
              {/* Special offer badge skeleton */}
              <div className="absolute top-4 left-4 bg-gray-300 rounded px-3 py-1 h-6 w-24 animate-pulse"></div>
            </div>
          </div>

          {/* Title skeleton */}
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>

          {/* Event details grid skeleton */}
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* About section skeleton */}
          <div className="space-y-3">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Ticket Selection Skeleton */}
        <div>
          <Card>
            <CardContent className="space-y-4 p-6">
              {/* Title skeleton */}
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>

              {/* Special offer notification skeleton */}
              <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>

              {/* Ticket options skeleton */}
              {[...Array(3)].map((_, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  {/* Ticket header */}
                  <div className="flex justify-between items-start">
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="text-right space-y-1">
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Description skeleton */}
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>

                  {/* Available skeleton */}
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>

                  {/* Quantity controls skeleton */}
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 bg-gray-200 rounded border animate-pulse"></div>
                    <div className="h-9 w-16 bg-gray-200 rounded border animate-pulse"></div>
                    <div className="h-9 w-9 bg-gray-200 rounded border animate-pulse"></div>
                  </div>
                </div>
              ))}

              {/* Total and button skeleton */}
              <div className="mt-4 space-y-2">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default function EventDetailPage() {
  const router = useRouter()
  const { id: eventId } = useParams() as { id?: string }
  const [event, setEvent] = useState<EventType | null>(null)
  const [loading, setLoading] = useState(true)
  const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) return
    ;(async () => {
      setLoading(true)
      try {
        const evts = await fetchEvents()
        const found = evts.find((e) => e.id === eventId) ?? null
        setEvent(found)
        if (found) {
          setTicketSelections(
            found.tickets.map((t) => ({
              type: t.name.toLowerCase().replace(/\s+/g, "-"),
              quantity: 0,
            })),
          )
        } else {
          setError("Event not found.")
        }
      } catch {
        setError("Failed to load event.")
      } finally {
        setLoading(false)
      }
    })()
  }, [eventId])

  const handleQuantityChange = (type: string, delta: number) =>
    setTicketSelections((prev) =>
      prev.map((sel) => {
        if (sel.type !== type || !event) return sel
        const ticket = event.tickets.find((t) => t.name.toLowerCase().replace(/\s+/g, "-") === type)
        if (!ticket) return sel
        const q = Math.max(0, sel.quantity + delta)
        return {
          ...sel,
          quantity: Math.min(q, ticket.quantity_available),
        }
      }),
    )

  const totalPrice = ticketSelections.reduce((sum, sel) => {
    if (!event) return sum
    const ticket = event.tickets.find((t) => t.name.toLowerCase().replace(/\s+/g, "-") === sel.type)
    if (!ticket) return sum
    const unit = ticket.discount ? ticket.price - ticket.discount : ticket.price
    return sum + unit * sel.quantity
  }, 0)

  const handleBuyTicket = async () => {
    setError(null)
    if (!event) {
      setError("Event not found.")
      return
    }
    const selected = ticketSelections.filter((s) => s.quantity > 0)
    if (!selected.length) {
      setError("Please select at least one ticket.")
      return
    }

    // pull user from storage
    const userJson = sessionStorage.getItem("user")
    if (!userJson) {
      setError("Please log in to purchase.")
      return
    }
    let user: { id?: number }
    try {
      user = JSON.parse(userJson)
    } catch {
      setError("Invalid user data; log in again.")
      return
    }
    if (!user.id) {
      setError("User ID missing; log in again.")
      return
    }

    setLoading(true)
    try {
      await Promise.all(
        selected.map((sel) => {
          const ticket = event.tickets.find((t) => t.name.toLowerCase().replace(/\s+/g, "-") === sel.type)!
          const unit = ticket.discount ? ticket.price - ticket.discount : ticket.price
          const payload: OrderPayload = {
            user_id: user.id!,
            ticket_type_id: ticket.id,
            order_status: "Confirmed",
            payment_status: "Pending",
            quantity: sel.quantity,
            price_at_purchase: unit,
            total_amount: unit * sel.quantity,
          }
          return createOrder(payload)
        }),
      )
      router.push("/thank-you")
    } catch (err: unknown) {
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : "Order creation failed."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Show skeleton while loading
  if (loading) {
    return <EventDetailSkeleton />
  }

  if (!event) {
    return (
      <main className="container mx-auto p-8 text-center">
        <p className="text-xl font-semibold">{error || "Event not found."}</p>
        <Link href="/events" className="text-purple-600 hover:underline">
          ← Back to Events
        </Link>
      </main>
    )
  }

  const hasDiscount = event.tickets.some((t) => t.discount > 0)

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/events" className="text-purple-600 hover:underline">
        ← Back to Events
      </Link>

      <div className="grid gap-8 lg:grid-cols-3 mt-4">
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              width={1200}
              height={600}
              className="w-full object-cover"
            />
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 text-sm">Special Offer</Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <div className="grid grid-cols-2 gap-4 text-gray-600">
            <div className="flex items-center">
              <CalendarIcon className="mr-2" /> {event.date}
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" /> {event.time || "TBD"}
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2" /> {event.location}
            </div>
            <div className="flex items-center">
              <User className="mr-2" /> {event.organizer}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">About This Event</h2>
            <p className="text-gray-700">{event.description}</p>
          </div>
        </div>

        {/* Ticket Selection */}
        <div>
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-xl font-semibold">Select Tickets</h2>
              {hasDiscount && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">Special offer available!</p>
                </div>
              )}

              {event.tickets.map((ticket) => {
                const key = ticket.name.toLowerCase().replace(/\s+/g, "-")
                const sel = ticketSelections.find((s) => s.type === key)
                const qty = sel?.quantity ?? 0
                const unit = ticket.discount ? ticket.price - ticket.discount : ticket.price

                return (
                  <div key={key} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="font-medium">{ticket.name}</Label>
                      <div className="text-right">
                        <span className="font-bold">${unit.toFixed(2)}</span>
                        {ticket.discount > 0 && (
                          <div className="flex items-center space-x-1 text-gray-500 text-sm">
                            <span className="line-through">${ticket.price.toFixed(2)}</span>
                            <Badge className="bg-green-100 text-green-800">
                              Save {Math.round((ticket.discount / ticket.price) * 100)}%
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{ticket.description}</p>
                    <p className="text-sm text-gray-500">Available: {ticket.quantity_available}</p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(key, -1)}
                        disabled={qty === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        className="w-16 text-center"
                        value={qty}
                        min={0}
                        max={ticket.quantity_available}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0)
                          handleQuantityChange(key, val - qty)
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(key, 1)}
                        disabled={qty >= ticket.quantity_available}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}

              <div className="mt-4">
                <p className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</p>
                <Button onClick={handleBuyTicket} disabled={totalPrice === 0 || !!error} className="mt-2 w-full">
                  Buy Now
                </Button>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}



// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter, useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { CalendarIcon, Clock, MapPin, User, Plus, Minus } from "lucide-react";
// import { fetchEvents, Event as EventType } from "@/lib/events";
// import { createOrder, OrderPayload } from "@/lib/order";
// import Image from "next/image";

// interface TicketSelection {
//   type: string;
//   quantity: number;
// }

// export default function EventDetailPage() {
//   const router = useRouter();
//   const { id: eventId } = useParams() as { id?: string };
//   const [event, setEvent] = useState<EventType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!eventId) return;
//     (async () => {
//       setLoading(true);
//       try {
//         const evts = await fetchEvents();
//         const found = evts.find((e) => e.id === eventId) ?? null;
//         setEvent(found);
//         if (found) {
//           setTicketSelections(
//             found.tickets.map((t) => ({
//               type: t.name.toLowerCase().replace(/\s+/g, "-"),
//               quantity: 0,
//             }))
//           );
//         } else {
//           setError("Event not found.");
//         }
//       } catch {
//         setError("Failed to load event.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [eventId]);

//   const handleQuantityChange = (type: string, delta: number) =>
//     setTicketSelections((prev) =>
//       prev.map((sel) => {
//         if (sel.type !== type || !event) return sel;
//         const ticket = event.tickets.find(
//           (t) => t.name.toLowerCase().replace(/\s+/g, "-") === type
//         );
//         if (!ticket) return sel;
//         const q = Math.max(0, sel.quantity + delta);
//         return {
//           ...sel,
//           quantity: Math.min(q, ticket.quantity_available),
//         };
//       })
//     );

//   const totalPrice = ticketSelections.reduce((sum, sel) => {
//     if (!event) return sum;
//     const ticket = event.tickets.find(
//       (t) => t.name.toLowerCase().replace(/\s+/g, "-") === sel.type
//     );
//     if (!ticket) return sum;
//     const unit = ticket.discount ? ticket.price - ticket.discount : ticket.price;
//     return sum + unit * sel.quantity;
//   }, 0);

//   const handleBuyTicket = async () => {
//     setError(null);
//     if (!event) {
//       setError("Event not found.");
//       return;
//     }
//     const selected = ticketSelections.filter((s) => s.quantity > 0);
//     if (!selected.length) {
//       setError("Please select at least one ticket.");
//       return;
//     }

//     // pull user from storage
//     const userJson = sessionStorage.getItem("user");
//     if (!userJson) {
//       setError("Please log in to purchase.");
//       return;
//     }
//     let user: { id?: number };
//     try {
//       user = JSON.parse(userJson);
//     } catch {
//       setError("Invalid user data; log in again.");
//       return;
//     }
//     if (!user.id) {
//       setError("User ID missing; log in again.");
//       return;
//     }

//     setLoading(true);
//     try {
//       await Promise.all(
//         selected.map((sel) => {
//           const ticket = event.tickets.find(
//             (t) => t.name.toLowerCase().replace(/\s+/g, "-") === sel.type
//           )!;
//           const unit = ticket.discount ? ticket.price - ticket.discount : ticket.price;
//           const payload: OrderPayload = {
//             user_id: user.id!,
//             ticket_type_id: ticket.id,
//             order_status: "Confirmed",
//             payment_status: "Pending",
//             quantity: sel.quantity,
//             price_at_purchase: unit,
//             total_amount: unit * sel.quantity,
//           };
//           return createOrder(payload);
//         })
//       );
//       router.push("/thank-you");
//     } catch (err: any) {
//       console.error(err);
//       setError(err.message || "Order creation failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <main className="container mx-auto p-8 flex justify-center items-center">
//         <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-purple-600 rounded-full" />
//       </main>
//     );
//   }

//   if (!event) {
//     return (
//       <main className="container mx-auto p-8 text-center">
//         <p className="text-xl font-semibold">{error || "Event not found."}</p>
//         <Link href="/events" className="text-purple-600 hover:underline">
//           ← Back to Events
//         </Link>
//       </main>
//     );
//   }

//   const hasDiscount = event.tickets.some((t) => t.discount > 0);

//   return (
//     <main className="container mx-auto px-4 py-8">
//       <Link href="/events" className="text-purple-600 hover:underline">
//         ← Back to Events
//       </Link>

//       <div className="grid gap-8 lg:grid-cols-3 mt-4">
//         {/* Event Details */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="relative overflow-hidden rounded-lg">
//             <Image
//               src={event.image || "/placeholder.svg"}
//               alt={event.title}
//               width={1200}
//               height={600}
//               className="w-full object-cover"
//             />
//             {hasDiscount && (
//               <Badge className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 text-sm">
//                 Special Offer
//               </Badge>
//             )}
//           </div>
//           <h1 className="text-3xl font-bold">{event.title}</h1>
//           <div className="grid grid-cols-2 gap-4 text-gray-600">
//             <div className="flex items-center">
//               <CalendarIcon className="mr-2" /> {event.date}
//             </div>
//             <div className="flex items-center">
//               <Clock className="mr-2" /> {event.time || "TBD"}
//             </div>
//             <div className="flex items-center">
//               <MapPin className="mr-2" /> {event.location}
//             </div>
//             <div className="flex items-center">
//               <User className="mr-2" /> {event.organizer}
//             </div>
//           </div>
//           <div>
//             <h2 className="text-2xl font-semibold mb-2">About This Event</h2>
//             <p className="text-gray-700">{event.description}</p>
//           </div>
//         </div>

//         {/* Ticket Selection */}
//         <div>
//           <Card>
//             <CardContent className="space-y-4 p-6">
//               <h2 className="text-xl font-semibold">Select Tickets</h2>
//               {hasDiscount && (
//                 <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//                   <p className="text-green-800 text-sm">
//                     Special offer available!
//                   </p>
//                 </div>
//               )}

//               {event.tickets.map((ticket) => {
//                 const key = ticket.name.toLowerCase().replace(/\s+/g, "-");
//                 const sel = ticketSelections.find((s) => s.type === key);
//                 const qty = sel?.quantity ?? 0;
//                 const unit = ticket.discount
//                   ? ticket.price - ticket.discount
//                   : ticket.price;

//                 return (
//                   <div key={key} className="border rounded-lg p-4 space-y-2">
//                     <div className="flex justify-between items-center">
//                       <Label className="font-medium">{ticket.name}</Label>
//                       <div className="text-right">
//                         <span className="font-bold">${unit.toFixed(2)}</span>
//                         {ticket.discount > 0 && (
//                           <div className="flex items-center space-x-1 text-gray-500 text-sm">
//                             <span className="line-through">
//                               ${ticket.price.toFixed(2)}
//                             </span>
//                             <Badge className="bg-green-100 text-green-800">
//                               Save{" "}
//                               {Math.round(
//                                 (ticket.discount / ticket.price) * 100
//                               )}
//                               %
//                             </Badge>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <p className="text-sm text-gray-500">
//                       {ticket.description}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Available: {ticket.quantity_available}
//                     </p>
//                     <div className="flex items-center space-x-2">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => handleQuantityChange(key, -1)}
//                         disabled={qty === 0}
//                       >
//                         <Minus className="h-4 w-4" />
//                       </Button>
//                       <Input
//                         type="number"
//                         className="w-16 text-center"
//                         value={qty}
//                         min={0}
//                         max={ticket.quantity_available}
//                         onChange={(e) => {
//                           const val = Math.max(0, Number(e.target.value) || 0);
//                           handleQuantityChange(key, val - qty);
//                         }}
//                       />
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         onClick={() => handleQuantityChange(key, 1)}
//                         disabled={qty >= ticket.quantity_available}
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 );
//               })}

//               <div className="mt-4">
//                 <p className="text-lg font-semibold">
//                   Total: ${totalPrice.toFixed(2)}
//                 </p>
//                 <Button
//                   onClick={handleBuyTicket}
//                   disabled={totalPrice === 0 || !!error}
//                   className="mt-2 w-full"
//                 >
//                   Buy Now
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </main>
//   );
// }


