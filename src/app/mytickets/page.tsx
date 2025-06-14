// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { MapPinIcon, TicketIcon, QrCodeIcon, Clock3Icon, SparklesIcon } from "lucide-react"
// import { QRCodeCanvas } from "qrcode.react"
// import { Html5Qrcode } from "html5-qrcode"
// import { getOrders, type OrderResponse } from "@/lib/order"

// // Dashboard-specific ticket interface
// interface DashboardTicket {
//   id: string
//   eventId: string
//   eventName: string
//   date: string
//   dayOfWeek: string
//   time: string
//   location: string
//   ticketType: string
//   quantity: number
//   orderNumber: string
//   price: number
//   image: string
//   purchaseDate: string
//   scanned: boolean
// }

// export default function MyTicketPage() {
//   const [selectedTicket, setSelectedTicket] = useState<DashboardTicket | null>(null)
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [showQR, setShowQR] = useState(false)
//   const [showScanner, setShowScanner] = useState(false)
//   const [scanResult, setScanResult] = useState<string | null>(null)
//   const [upcomingTickets, setUpcomingTickets] = useState<DashboardTicket[]>([])
//   const [pastTickets, setPastTickets] = useState<DashboardTicket[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const getDayOfWeek = (dateStr: string) => {
//     const date = new Date(dateStr)
//     return date.toLocaleString("en-US", { weekday: "short" })
//   }

//   useEffect(() => {
//     async function fetchOrders() {
//       setIsLoading(true)
//       setError(null)

//       try {
//         const orders: OrderResponse[] = await getOrders()
//         const tickets: DashboardTicket[] = orders.map((order) => ({
//           id: order.order_id.toString(),
//           eventId: order.order_id.toString(),
//           eventName: order.eventTitle,
//           date: order.eventDate,
//           dayOfWeek: getDayOfWeek(order.eventDate),
//           time: order.eventTime,
//           location: order.eventLocation,
//           ticketType: order.ticketType,
//           quantity: order.quantity,
//           orderNumber: `ORD-${order.order_id.toString().padStart(8, "0")}`,
//           price: Number.parseFloat(order.total),
//           image: order.eventImage,
//           purchaseDate: order.order_date.split(" ")[0],
//           scanned: false,
//         }))

//         // Normalize "today" to midnight
//         const today = new Date()
//         today.setHours(0, 0, 0, 0)

//         // Pure date-only comparison
//         setUpcomingTickets(tickets.filter((t) => new Date(t.date) >= today))
//         setPastTickets(tickets.filter((t) => new Date(t.date) < today))

//         localStorage.setItem("purchasedTickets", JSON.stringify(tickets))
//       } catch (err) {
//         console.error("Error fetching orders:", err)
//         setError("Failed to load tickets. Showing cached tickets if available.")

//         const storedTickets = JSON.parse(localStorage.getItem("purchasedTickets") || "[]") as DashboardTicket[]

//         const today = new Date()
//         today.setHours(0, 0, 0, 0)

//         setUpcomingTickets(storedTickets.filter((t) => new Date(t.date) >= today))
//         setPastTickets(storedTickets.filter((t) => new Date(t.date) < today))
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchOrders()
//   }, [])

//   useEffect(() => {
//     if (showScanner && selectedTicket) {
//       const html5QrCode = new Html5Qrcode("qr-reader")
//       const qrCodeSuccessCallback = (decodedText: string) => {
//         setScanResult(decodedText)
//         html5QrCode.stop().then(() => {
//           try {
//             const qrData = JSON.parse(decodedText)
//             if (qrData.ticketId === selectedTicket.id && qrData.orderNumber === selectedTicket.orderNumber) {
//               const updated = [...upcomingTickets, ...pastTickets].map((t) =>
//                 t.id === selectedTicket.id ? { ...t, scanned: true } : t,
//               )
//               localStorage.setItem("purchasedTickets", JSON.stringify(updated))
//               // re-split by date-only again
//               const today = new Date()
//               today.setHours(0, 0, 0, 0)
//               setUpcomingTickets(updated.filter((t) => new Date(t.date) >= today))
//               setPastTickets(updated.filter((t) => new Date(t.date) < today))
//               setSelectedTicket({ ...selectedTicket, scanned: true })
//               setShowScanner(false)
//               setScanResult("Ticket successfully scanned!")
//             } else {
//               setScanResult("Invalid QR code!")
//             }
//           } catch {
//             setScanResult("Error parsing QR code!")
//           }
//         })
//       }
//       const qrCodeErrorCallback = (error: string) => {
//         console.error(error)
//       }

//       html5QrCode
//         .start(
//           { facingMode: "environment" },
//           { fps: 10, qrbox: { width: 250, height: 250 } },
//           qrCodeSuccessCallback,
//           qrCodeErrorCallback,
//         )
//         .catch((err) => {
//           setScanResult("Failed to start scanner: " + err)
//         })

//       return () => {
//         html5QrCode.stop().catch((err) => console.error("Failed to stop scanner", err))
//       }
//     }
//   }, [showScanner, selectedTicket, upcomingTickets, pastTickets])

//   const handleViewTicket = (ticket: DashboardTicket) => {
//     setSelectedTicket(ticket)
//     setIsDialogOpen(true)
//     setShowQR(false)
//     setShowScanner(false)
//     setScanResult(null)
//   }

//   const toggleQRCode = () => {
//     setShowQR(!showQR)
//     setShowScanner(false)
//     setScanResult(null)
//   }

//   const toggleScanner = () => {
//     setShowScanner(!showScanner)
//     setShowQR(false)
//     setScanResult(null)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
//       {/* Background blobs */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//       </div>

//       <div className="relative container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
//           <div className="space-y-2">
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
//                 <TicketIcon className="h-6 w-6 text-white" />
//               </div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                 My Tickets
//               </h1>
//             </div>
//           </div>
//           <Button className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
//             <Link href="/events" className="flex items-center gap-2">
//               <SparklesIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
//               Browse Events
//             </Link>
//           </Button>
//         </div>

//         {/* Loading & Error */}
//         {isLoading && (
//           <div className="space-y-8">
//             <div className="flex items-center justify-between">
//               <div className="h-8 w-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
//               <div className="h-8 w-20 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full animate-pulse"></div>
//             </div>

//             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//               {[...Array(6)].map((_, index) => (
//                 <div key={index} className="overflow-hidden border-0 bg-white/80 backdrop-blur-lg shadow-xl rounded-lg">
//                   {/* Image skeleton */}
//                   <div className="relative h-48 w-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 animate-pulse">
//                     {/* Date badge skeleton */}
//                     <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg">
//                       <div className="text-center space-y-1">
//                         <div className="h-6 w-8 bg-slate-300 rounded animate-pulse"></div>
//                         <div className="h-3 w-12 bg-slate-200 rounded animate-pulse"></div>
//                       </div>
//                     </div>

//                     {/* Quantity badge skeleton */}
//                     <div className="absolute top-4 right-4 h-6 w-8 bg-slate-300 rounded-full animate-pulse"></div>
//                   </div>

//                   {/* Content skeleton */}
//                   <div className="space-y-4 p-6">
//                     {/* Title */}
//                     <div className="h-6 w-3/4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>

//                     {/* Ticket type */}
//                     <div className="flex items-center gap-2">
//                       <div className="h-5 w-5 bg-purple-200 rounded animate-pulse"></div>
//                       <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
//                     </div>

//                     {/* Time */}
//                     <div className="flex items-center gap-2">
//                       <div className="h-5 w-5 bg-purple-200 rounded animate-pulse"></div>
//                       <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
//                     </div>

//                     {/* Location */}
//                     <div className="flex items-center gap-3">
//                       <div className="h-6 w-6 bg-purple-200 rounded animate-pulse"></div>
//                       <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
//                     </div>

//                     {/* Price and order number */}
//                     <div className="flex items-center justify-between">
//                       <div className="h-8 w-20 bg-gradient-to-r from-green-200 to-emerald-200 rounded animate-pulse"></div>
//                       <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
//                     </div>
//                   </div>

//                   {/* Button skeleton */}
//                   <div className="px-6 pb-6">
//                     <div className="w-full h-12 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-xl animate-pulse"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         {error && (
//           <div className="text-center py-8 mb-8">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-600 font-medium">
//               ⚠️ {error}
//             </div>
//           </div>
//         )}

//         {/* Tabs */}
//         <Tabs defaultValue="upcoming" className="space-y-8">
//           <TabsList className="bg-white border border-gray-200 rounded-lg p-1 w-fit">
//             <TabsTrigger
//               value="upcoming"
//               className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-purple-600 data-[state=active]:text-white"
//             >
//               Upcoming
//             </TabsTrigger>
//             <TabsTrigger
//               value="past"
//               className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-purple-600 data-[state=active]:text-white"
//             >
//               Past Events
//             </TabsTrigger>
         
//           </TabsList>

//           {/* Upcoming */}
//           <TabsContent value="upcoming" className="space-y-8">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-slate-800">Your Upcoming Events</h2>
//               <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
//                 {upcomingTickets.length} Tickets
//               </Badge>
//             </div>

//             {upcomingTickets.length > 0 ? (
//               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//                 {upcomingTickets.map((ticket) => (
//                   <Card key={ticket.id} className="overflow-hidden border-0 bg-white/80 backdrop-blur-lg shadow-xl">
//                     <div className="relative h-48 w-full overflow-hidden">
//                       <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-indigo-600/60 to-pink-600/40">
//                         <img
//                           src={ticket.image || "/placeholder.svg"}
//                           alt={ticket.eventName}
//                           className="h-full w-full object-cover"
//                         />
//                       </div>
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

//                       <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg">
//                         <div className="text-center">
//                           <div className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                             {ticket.date.split(" ")[0]}
//                           </div>
//                           <div className="text-xs text-slate-600 font-medium">
//                             {ticket.dayOfWeek} {ticket.date.split(" ")[2]}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
//                         x{ticket.quantity}
//                       </div>
//                     </div>

//                     <CardContent className="space-y-4 pb-4">
//                       <CardTitle className="text-xl font-bold text-slate-800">{ticket.eventName}</CardTitle>
//                       <CardDescription className="flex items-center gap-2 text-slate-600 font-medium">
//                         <div className="p-1 rounded-md bg-purple-100">
//                           <TicketIcon className="h-3 w-3 text-purple-600" />
//                         </div>
//                         {ticket.ticketType}
//                       </CardDescription>
//                       <CardDescription className="flex items-center gap-2 text-slate-600 font-medium">
//                         <div className="p-1 rounded-md bg-purple-100">
//                           <Clock3Icon className="h-3 w-3 text-purple-600" />
//                         </div>
//                         {ticket.time}
//                       </CardDescription>
//                       <div className="flex items-center text-slate-700">
//                         <div className="p-1 rounded-md bg-purple-100 mr-3">
//                           <MapPinIcon className="h-4 w-4 text-purple-600" />
//                         </div>
//                         <span className="text-sm font-medium">{ticket.location}</span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
//                           ${ticket.price.toFixed(2)}
//                         </div>
//                         <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
//                           #{ticket.orderNumber.slice(-4)}
//                         </span>
//                       </div>
//                     </CardContent>

//                     <CardFooter className="pt-0">
//                       <Button
//                         onClick={() => handleViewTicket(ticket)}
//                         className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                       >
//                         View Ticket
//                       </Button>
//                     </CardFooter>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <Card className="border-0 bg-white/80 backdrop-blur-lg shadow-xl">
//                 <CardContent className="flex flex-col items-center justify-center py-16 text-center">
//                   <div className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-purple-100 to-indigo-100">
//                     <TicketIcon className="h-12 w-12 text-purple-500" />
//                   </div>
//                   <h3 className="mb-3 text-2xl font-bold text-slate-800">No Upcoming Tickets</h3>
//                   <p className="mb-8 text-slate-600 max-w-md">
//                     Ready for your next adventure? Discover amazing events happening near you!
//                   </p>
//                   <Button
//                     asChild
//                     className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
//                   >
//                     <Link href="/events">Browse Events</Link>
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>

//           {/* Past Events */}
//           <TabsContent value="past" className="space-y-8">
//             <div className="flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-slate-800">Your Past Events</h2>
//               <Badge className="bg-gradient-to-r from-slate-500 to-gray-500 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
//                 {pastTickets.length} Tickets
//               </Badge>
//             </div>

//             {pastTickets.length > 0 ? (
//               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//                 {pastTickets.map((ticket) => (
//                   <Card key={ticket.id} className="overflow-hidden border-0 bg-white/80 backdrop-blur-lg shadow-xl">
//                     {/* …you can mirror the same card structure as Upcoming… */}
//                     <CardContent className="space-y-4 pb-4">
//                       <CardTitle className="text-xl font-bold text-slate-800">{ticket.eventName}</CardTitle>
//                       <CardDescription className="flex items-center gap-2 text-slate-600 font-medium">
//                         <div className="p-1 rounded-md bg-purple-100">
//                           <Clock3Icon className="h-3 w-3 text-purple-600" />
//                         </div>
//                         {ticket.dayOfWeek}, {ticket.date.split(" ")[0]} at {ticket.time}
//                       </CardDescription>
//                       <div className="flex items-center text-slate-700">
//                         <div className="p-1 rounded-md bg-purple-100 mr-3">
//                           <MapPinIcon className="h-4 w-4 text-purple-600" />
//                         </div>
//                         <span className="text-sm font-medium">{ticket.location}</span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <div className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
//                           ${ticket.price.toFixed(2)}
//                         </div>
//                         <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
//                           #{ticket.orderNumber.slice(-4)}
//                         </span>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <Card className="border-0 bg-white/80 backdrop-blur-lg shadow-xl">
//                 <CardContent className="flex flex-col items-center justify-center py-16 text-center">
//                   <h3 className="mb-3 text-2xl font-bold text-slate-800">No Past Events</h3>
//                   <p className="mb-8 text-slate-600 max-w-md">Looks like you haven’t attended any events yet.</p>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>

//           {/* Profile */}
//           <TabsContent value="profile" className="space-y-8">
//             {/* Your profile UI */}
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Ticket Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-md md:max-w-lg border-0 bg-white/95 backdrop-blur-xl shadow-2xl">
//           <DialogHeader className="text-center pb-2">
//             <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//               Digital Ticket
//             </DialogTitle>
//           </DialogHeader>

//           {selectedTicket && (
//             <div className="space-y-6">
//               <div className="overflow-hidden rounded-2xl border-0 shadow-2xl bg-white">
//                 {/* Ticket header */}
//                 <div className="relative">
//                   <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 p-6 text-white">
//                     <div className="flex items-center justify-between">
//                       <div className="flex flex-col">
//                         <span className="text-4xl font-bold">{selectedTicket.date.split(" ")[0]}</span>
//                         <span className="text-purple-100 font-medium">
//                           {selectedTicket.dayOfWeek}, {selectedTicket.date.split(" ")[2]}
//                         </span>
//                         <span className="text-purple-200 font-medium mt-1">{selectedTicket.time}</span>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-2xl font-bold">${selectedTicket.price.toFixed(2)}</div>
//                         <div className="text-lg font-semibold bg-white/20 px-3 py-1 rounded-full">
//                           {selectedTicket.ticketType}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Event info */}
//                   <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-6">
//                     <div className="flex items-center gap-4">
//                       <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500">
//                         <TicketIcon className="h-6 w-6 text-white" />
//                       </div>
//                       <div>
//                         <div className="font-bold text-slate-800">{selectedTicket.eventName}</div>
//                         <div className="text-sm text-slate-600 font-medium">{selectedTicket.location}</div>
//                       </div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                         x{selectedTicket.quantity}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* QR / Scanner / Details */}
//                 {showQR ? (
//                   <div className="flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-50 p-8">
//                     <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg">
//                       <QRCodeCanvas
//                         value={JSON.stringify({
//                           ticketId: selectedTicket.id,
//                           orderNumber: selectedTicket.orderNumber,
//                           eventId: selectedTicket.eventId,
//                         })}
//                         size={200}
//                       />
//                     </div>
//                     <p className="text-sm text-slate-600 font-medium mb-4 text-center">
//                       Show this QR code at the event entrance
//                     </p>
//                     <Button
//                       onClick={toggleQRCode}
//                       variant="outline"
//                       className="w-full border-2 border-slate-200 hover:border-slate-300 font-semibold py-3 rounded-xl"
//                     >
//                       Hide QR Code
//                     </Button>
//                   </div>
//                 ) : showScanner ? (
//                   <div className="flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-50 p-8">
//                     <div
//                       id="qr-reader"
//                       className="mb-6 w-full max-w-[300px] h-[300px] rounded-xl overflow-hidden"
//                     ></div>
//                     {scanResult && (
//                       <div
//                         className={`mb-4 p-3 rounded-xl text-center font-medium ${
//                           scanResult.includes("success")
//                             ? "bg-green-50 text-green-700 border border-green-200"
//                             : "bg-red-50 text-red-700 border border-red-200"
//                         }`}
//                       >
//                         {scanResult}
//                       </div>
//                     )}
//                     <Button
//                       onClick={toggleScanner}
//                       variant="outline"
//                       className="w-full border-2 border-slate-200 hover:border-slate-300 font-semibold py-3 rounded-xl"
//                     >
//                       Stop Scanner
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="bg-gradient-to-br from-white to-slate-50 p-6">
//                     <div className="space-y-4">
//                       <div className="flex items-center text-slate-700">
//                         <div className="p-2 rounded-xl bg-purple-100 mr-4">
//                           <MapPinIcon className="h-5 w-5 text-purple-600" />
//                         </div>
//                         <span className="font-medium">{selectedTicket.location}</span>
//                       </div>
//                       <div className="flex items-center text-slate-700">
//                         <div className="p-2 rounded-xl bg-indigo-100 mr-4">
//                           <TicketIcon className="h-5 w-5 text-indigo-600" />
//                         </div>
//                         <span className="font-medium">Order #{selectedTicket.orderNumber}</span>
//                       </div>
//                       <div className="flex items-center text-slate-700">
//                         <div className="p-2 rounded-xl bg-emerald-100 mr-4">
//                           <Clock3Icon className="h-5 w-5 text-emerald-600" />
//                         </div>
//                         <span className="font-medium">Purchased on {selectedTicket.purchaseDate}</span>
//                       </div>
//                       <div className="flex items-center text-slate-700">
//                         <div className="p-2 rounded-xl bg-blue-100 mr-4">
//                           <QrCodeIcon className="h-5 w-5 text-blue-600" />
//                         </div>
//                         <span className="font-medium">
//                           Status:{" "}
//                           {selectedTicket.scanned ? (
//                             <span className="text-green-600 font-semibold">✓ Scanned</span>
//                           ) : (
//                             <span className="text-orange-600 font-semibold">⏳ Not Scanned</span>
//                           )}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="mt-6 flex gap-3">
//                       <Button
//                         onClick={toggleQRCode}
//                         className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                       >
//                         <QrCodeIcon className="h-4 w-4 mr-2" />
//                         Show QR Code
//                       </Button>
//                       <Button
//                         onClick={toggleScanner}
//                         className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                         disabled={selectedTicket.scanned}
//                       >
//                         <SparklesIcon className="h-4 w-4 mr-2" />
//                         Scan QR Code
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }



"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, TicketIcon, QrCodeIcon, Clock3Icon, SparklesIcon, RefreshCwIcon } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"
import { getOrders, scanQRCode, type OrderResponse } from "@/lib/order"
import { toast } from "sonner"

// Dashboard-specific ticket interface
interface DashboardTicket {
  id: string
  eventId: string
  eventName: string
  date: string
  dayOfWeek: string
  time: string
  location: string
  ticketType: string
  quantity: number
  orderNumber: string
  price: number
  image: string
  purchaseDate: string
  scanned: boolean
  qr_code: string | null
}

export default function MyTicketPage() {
  const [selectedTicket, setSelectedTicket] = useState<DashboardTicket | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [upcomingTickets, setUpcomingTickets] = useState<DashboardTicket[]>([])
  const [pastTickets, setPastTickets] = useState<DashboardTicket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showScanConfirm, setShowScanConfirm] = useState(false)

  const getDayOfWeek = useCallback((dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString("en-US", { weekday: "short" })
  }, [])

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const orders: OrderResponse[] = await getOrders()
      const tickets: DashboardTicket[] = orders.map((order) => ({
        id: order.order_id.toString(),
        eventId: order.order_id.toString(),
        eventName: order.eventTitle,
        date: order.eventDate,
        dayOfWeek: getDayOfWeek(order.eventDate),
        time: order.eventTime,
        location: order.eventLocation,
        ticketType: order.ticketType,
        quantity: order.quantity,
        orderNumber: `ORD-${order.order_id.toString().padStart(8, "0")}`,
        price: Number.parseFloat(order.total),
        image: order.eventImage,
        purchaseDate: order.order_date.split(" ")[0],
        scanned: order.is_scanned,
        qr_code: order.qr_code,
      }))

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      setUpcomingTickets(tickets.filter((t) => new Date(t.date) >= today))
      setPastTickets(tickets.filter((t) => new Date(t.date) < today))

      localStorage.setItem("purchasedTickets", JSON.stringify(tickets))
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Failed to load tickets. Showing cached tickets if available.")

      const storedTickets = JSON.parse(localStorage.getItem("purchasedTickets") || "[]") as DashboardTicket[]
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      setUpcomingTickets(storedTickets.filter((t) => new Date(t.date) >= today))
      setPastTickets(storedTickets.filter((t) => new Date(t.date) < today))
    } finally {
      setIsLoading(false)
    }
  }, [getDayOfWeek])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    if (showScanner && selectedTicket) {
      const html5QrCode = new Html5Qrcode("qr-reader")
      let errorTimeout: NodeJS.Timeout | null = null

      const qrCodeSuccessCallback = async (decodedText: string) => {
        console.log("Decoded QR Code:", decodedText) // Debug
        console.log("Selected Ticket at Scan:", selectedTicket) // Debug current ticket
        setIsScanning(true)
        setScanResult(null)
        setScanError(null)
        try {
          await html5QrCode.stop() // Ensure scanner stops before processing
          let qrData
          try {
            qrData = JSON.parse(decodedText)
            console.log("Parsed QR Data:", qrData) // Debug
          } catch {
            setScanResult("Invalid QR code: Not a valid JSON format")
            setIsScanning(false)
            return
          }

          // Send the full decoded QR string to the backend
          const qrCodeToScan = decodedText
          if (!qrCodeToScan) {
            setScanResult("Invalid QR code: No QR code data provided")
            setIsScanning(false)
            return
          }
          const scanResponse = await scanQRCode(qrCodeToScan)

          // Update ticket state immediately
          const updatedTickets = [...upcomingTickets, ...pastTickets].map((t) =>
            t.id === selectedTicket.id ? { ...t, scanned: true } : t,
          )
          localStorage.setItem("purchasedTickets", JSON.stringify(updatedTickets))
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          setUpcomingTickets(updatedTickets.filter((t) => new Date(t.date) >= today))
          setPastTickets(updatedTickets.filter((t) => new Date(t.date) < today))
          setSelectedTicket({ ...selectedTicket, scanned: true })

          // Close scanner first
          setShowScanner(false)

          // Debug logs
          console.log("Scan response:", scanResponse)
          console.log("About to show toast...")

          // Show success toast immediately - use setTimeout to ensure it's called after state updates
          setTimeout(() => {
            console.log("Calling toast.success now...")
            toast.success("🎉 Scan Successful!", {
              description: "Your ticket has been successfully scanned and marked as used.",
              duration: 5000,
              position: "top-center",
            })
          }, 100)

          // Also set a success result message
          setScanResult("✅ Ticket successfully scanned!")

          // Refresh orders after a short delay
          setTimeout(async () => {
            await fetchOrders()
          }, 500)
        } catch (err: unknown) {
          console.error("Scan error details:", err) // Debug the error
          const errorMessage = err instanceof Error ? err.message : "Unknown error"
          setScanResult(`Error scanning QR code: ${errorMessage}`)
        } finally {
          setIsScanning(false)
        }
      }

      const qrCodeErrorCallback = (error: string) => {
        console.log("Detection error:", error) // Debug detection issues
        if (error.includes("No barcode or QR code detected") || error.includes("NotFoundException")) {
          setScanError("No QR code detected. Please align the QR code within the scan area.")
          if (errorTimeout) clearTimeout(errorTimeout)
          errorTimeout = setTimeout(() => setScanError(null), 3000) // Clear error after 3 seconds
        } else {
          console.error("QR scan error:", error)
          setScanError(`Error detecting QR code: ${error}`)
        }
      }

      html5QrCode
        .start(
          { facingMode: "environment" },
          {
            fps: 20, // Increased fps for better detection
            qrbox: { width: 350, height: 350 }, // Increased qrbox size
            aspectRatio: 1.0, // Ensure square aspect ratio
          },
          qrCodeSuccessCallback,
          qrCodeErrorCallback,
        )
        .catch((err) => {
          console.error("Failed to start scanner:", err)
          setScanResult("Failed to start scanner: " + err.message)
          setIsScanning(false)
        })

      return () => {
        if (errorTimeout) clearTimeout(errorTimeout)
        html5QrCode.stop().catch((err) => console.error("Failed to stop scanner:", err))
      }
    }
  }, [showScanner, selectedTicket, upcomingTickets, pastTickets, fetchOrders])

  const handleViewTicket = useCallback((ticket: DashboardTicket) => {
    setSelectedTicket(ticket)
    setIsDialogOpen(true)
    setShowQR(false)
    setShowScanner(false)
    setScanResult(null)
    setScanError(null)
    setShowScanConfirm(false)
  }, [])

  const toggleQRCode = useCallback(() => {
    setShowQR((prev) => !prev)
    setShowScanner(false)
    setScanResult(null)
    setScanError(null)
    setShowScanConfirm(false)
  }, [])

  const handleToggleScanner = useCallback(() => {
    if (!showScanner) {
      setShowScanConfirm(true)
    } else {
      setShowScanner(false)
      setScanResult(null)
      setScanError(null)
    }
  }, [showScanner])

  const confirmScan = useCallback(() => {
    setShowScanConfirm(false)
    setShowQR(false)
    setScanResult(null)
    setScanError(null)
    setShowScanner(true)
  }, [])

  const memoizedUpcomingTickets = useMemo(() => upcomingTickets, [upcomingTickets])
  const memoizedPastTickets = useMemo(() => pastTickets, [pastTickets])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                <TicketIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                My Tickets
              </h1>
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={fetchOrders}
              variant="outline"
              className="flex items-center gap-2 border-purple-200 hover:bg-purple-50"
              aria-label="Refresh tickets"
            >
              <RefreshCwIcon className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link href="/events" className="flex items-center gap-2">
                <SparklesIcon
                  className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300"
                  aria-hidden="true"
                />
                Browse Events
              </Link>
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
              <div className="h-8 w-20 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full animate-pulse"></div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="overflow-hidden border-0 bg-white/80 backdrop-blur-lg shadow-xl rounded-lg">
                  <div className="relative h-48 w-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 animate-pulse">
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                      <div className="text-center space-y-1">
                        <div className="h-6 w-8 bg-slate-300 rounded animate-pulse"></div>
                        <div className="h-3 w-12 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 h-6 w-8 bg-slate-300 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="h-6 w-3/4 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-pulse"></div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-purple-200 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-purple-200 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 bg-purple-200 rounded animate-pulse"></div>
                      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-20 bg-gradient-to-r from-green-200 to-emerald-200 rounded animate-pulse"></div>
                      <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="w-full h-12 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="text-center py-8 mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-600 font-medium"
              role="alert"
            >
              âš ï¸ {error}
            </div>
          </div>
        )}

        <Tabs defaultValue="upcoming" className="space-y-8">
          <TabsList className="bg-white border border-gray-200 rounded-lg p-1 w-fit">
            <TabsTrigger
              value="upcoming"
              className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Past Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Your Upcoming Events</h2>
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                {memoizedUpcomingTickets.length} Tickets
              </Badge>
            </div>

            {memoizedUpcomingTickets.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {memoizedUpcomingTickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden border-0 bg-white/80 backdrop-blur-lg shadow-xl">
                    <div className="relative h-48 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-indigo-600/60 to-pink-600/40">
                        <img
                          src={ticket.image || "/placeholder.svg"}
                          alt={ticket.eventName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            {ticket.date.split(" ")[0]}
                          </div>
                          <div className="text-xs text-slate-600 font-medium">
                            {ticket.dayOfWeek} {ticket.date.split(" ")[2]}
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        x{ticket.quantity}
                      </div>
                    </div>
                    <CardContent className="space-y-4 pb-4">
                      <CardTitle className="text-xl font-bold text-slate-800">{ticket.eventName}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-slate-600 font-medium">
                        <div className="p-1 rounded-md bg-purple-100">
                          <TicketIcon className="h-3 w-3 text-purple-600" aria-hidden="true" />
                        </div>
                        {ticket.ticketType}
                      </CardDescription>
                      <CardDescription className="flex items-center gap-2 text-slate-600 font-medium">
                        <div className="p-1 rounded-md bg-purple-100">
                          <Clock3Icon className="h-3 w-3 text-purple-600" aria-hidden="true" />
                        </div>
                        {ticket.time}
                      </CardDescription>
                      <div className="flex items-center text-slate-700">
                        <div className="p-1 rounded-md bg-purple-100 mr-3">
                          <MapPinIcon className="h-4 w-4 text-purple-600" aria-hidden="true" />
                        </div>
                        <span className="text-sm font-medium">{ticket.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ${ticket.price.toFixed(2)}
                        </div>
                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          #{ticket.orderNumber.slice(-4)}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        onClick={() => handleViewTicket(ticket)}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        aria-label={`View ticket for ${ticket.eventName}`}
                      >
                        View Ticket
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 bg-white/80 backdrop-blur-lg shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6 p-6 rounded-3xl bg-gradient-to-br from-purple-100 to-indigo-100">
                    <TicketIcon className="h-12 w-12 text-purple-500" aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-800">No Upcoming Tickets</h3>
                  <p className="mb-8 text-slate-600 max-w-md">
                    Ready for your next adventure? Discover amazing events happening near you!
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/events">Browse Events</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Your Past Events</h2>
              <Badge className="bg-gradient-to-r from-slate-500 to-gray-500 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                {memoizedPastTickets.length} Tickets
              </Badge>
            </div>

            {memoizedPastTickets.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {memoizedPastTickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden border-0 bg-white/80 backdrop-blur-lg shadow-xl">
                    <div className="relative h-48 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-indigo-600/60 to-pink-600/40">
                        <img
                          src={ticket.image || "/placeholder.svg"}
                          alt={ticket.eventName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            {ticket.date.split(" ")[0]}
                          </div>
                          <div className="text-xs text-slate-600 font-medium">
                            {ticket.dayOfWeek} {ticket.date.split(" ")[2]}
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        x{ticket.quantity}
                      </div>
                    </div>
                    <CardContent className="space-y-4 pb-4">
                      <CardTitle className="text-xl font-bold text-slate-800">{ticket.eventName}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-slate-600 font-medium">
                        <div className="p-1 rounded-md bg-purple-100">
                          <Clock3Icon className="h-3 w-3 text-purple-600" aria-hidden="true" />
                        </div>
                        {ticket.dayOfWeek}, {ticket.date.split(" ")[0]} at {ticket.time}
                      </CardDescription>
                      <div className="flex items-center text-slate-700">
                        <div className="p-1 rounded-md bg-purple-100 mr-3">
                          <MapPinIcon className="h-4 w-4 text-purple-600" aria-hidden="true" />
                        </div>
                        <span className="text-sm font-medium">{ticket.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">
                          ${ticket.price.toFixed(2)}
                        </div>
                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          #{ticket.orderNumber.slice(-4)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-0 bg-white/80 backdrop-blur-lg shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <h3 className="mb-3 text-2xl font-bold text-slate-800">No Past Events</h3>
                  <p className="mb-8 text-slate-600 max-w-md">Looks like you havenâ€™t attended any events yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg border-0 bg-white/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Digital Ticket
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border-0 shadow-2xl bg-white">
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-4xl font-bold">{selectedTicket.date.split(" ")[0]}</span>
                        <span className="text-purple-100 font-medium">
                          {selectedTicket.dayOfWeek}, {selectedTicket.date.split(" ")[2]}
                        </span>
                        <span className="text-purple-200 font-medium mt-1">{selectedTicket.time}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${selectedTicket.price.toFixed(2)}</div>
                        <div className="text-lg font-semibold bg-white/20 px-3 py-1 rounded-full">
                          {selectedTicket.ticketType}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500">
                        <TicketIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{selectedTicket.eventName}</div>
                        <div className="text-sm text-slate-600 font-medium">{selectedTicket.location}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        x{selectedTicket.quantity}
                      </div>
                    </div>
                  </div>
                </div>

                {showQR ? (
                  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-50 p-8">
                    {selectedTicket.qr_code ? (
                      <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg">
                        <Image
                          src={selectedTicket.qr_code || "/placeholder.svg"}
                          alt="QR code for ticket"
                          width={200}
                          height={200}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-red-600 font-medium mb-4">QR code not available</p>
                    )}
                    <p className="text-sm text-slate-600 font-medium mb-4 text-center">
                      Show this QR code at the event entrance
                    </p>
                    <Button
                      onClick={toggleQRCode}
                      variant="outline"
                      className="w-full border-2 border-slate-200 hover:border-slate-300 font-semibold py-3 rounded-xl"
                      aria-label="Hide QR code"
                    >
                      Hide QR Code
                    </Button>
                  </div>
                ) : showScanner ? (
                  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-50 p-8">
                    <div
                      id="qr-reader"
                      className="mb-6 w-full max-w-[350px] h-[350px] rounded-xl overflow-hidden border-2 border-dashed border-gray-300"
                      aria-live="polite"
                    ></div>
                    <p className="text-sm text-slate-600 font-medium mb-4 text-center">
                      Align the QR code within the dashed area
                    </p>
                    {(scanResult || scanError) && (
                      <div
                        className={`mb-4 p-3 rounded-xl text-center font-medium ${
                          scanResult?.includes("success")
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                        role="alert"
                      >
                        {scanResult || scanError}
                      </div>
                    )}
                    {isScanning && <div className="mb-4 text-slate-600 font-medium">Scanning...</div>}
                    <Button
                      onClick={handleToggleScanner}
                      variant="outline"
                      className="w-full border-2 border-slate-200 hover:border-slate-300 font-semibold py-3 rounded-xl"
                      aria-label="Stop QR code scanner"
                    >
                      Stop Scanner
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-white to-slate-50 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center text-slate-700">
                        <div className="p-2 rounded-xl bg-purple-100 mr-4">
                          <MapPinIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />
                        </div>
                        <span className="font-medium">{selectedTicket.location}</span>
                      </div>
                      <div className="flex items-center text-slate-700">
                        <div className="p-2 rounded-xl bg-indigo-100 mr-4">
                          <TicketIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                        </div>
                        <span className="font-medium">Order #{selectedTicket.orderNumber}</span>
                      </div>
                      <div className="flex items-center text-slate-700">
                        <div className="p-2 rounded-xl bg-emerald-100 mr-4">
                          <Clock3Icon className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                        </div>
                        <span className="font-medium">Purchased on {selectedTicket.purchaseDate}</span>
                      </div>
                      <div className="flex items-center text-slate-700">
                        <div className="p-2 rounded-xl bg-blue-100 mr-4">
                          <QrCodeIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                        </div>
                        <span className="font-medium">
                          Status:{" "}
                          {selectedTicket.scanned ? (
                            <span className="text-green-600 font-semibold"> ✅ Scanned</span>
                          ) : (
                            <span className="text-orange-600 font-semibold">⏳ Not Scanned</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={toggleQRCode}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        aria-label="Show QR code"
                      >
                        <QrCodeIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                        Show QR Code
                      </Button>
                      <Button
                        onClick={handleToggleScanner}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={selectedTicket.scanned || isScanning}
                        aria-label="Scan QR code"
                      >
                        <SparklesIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                        Scan QR Code
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showScanConfirm} onOpenChange={setShowScanConfirm}>
        <DialogContent className="sm:max-w-md border-0 bg-white/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Confirm QR Code Scan</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600">
            Are you sure you want to scan the QR code for this ticket? This action will mark the ticket as used.
          </p>
          <DialogFooter>
            <Button
              onClick={() => setShowScanConfirm(false)}
              variant="outline"
              className="border-2 border-slate-200 hover:border-slate-300"
              aria-label="Cancel scan"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmScan}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              aria-label="Confirm scan"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
