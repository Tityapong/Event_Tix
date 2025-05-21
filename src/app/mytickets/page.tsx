"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, TicketIcon, QrCodeIcon, UserIcon, MailIcon, Clock3Icon } from "lucide-react"
// import { events } from "@/lib/events-data"
import { QRCodeCanvas } from "qrcode.react"
import { Html5Qrcode } from "html5-qrcode"
import Image from "next/image"

// Interfaces to match other files
// interface Ticket {
//   type: string
//   name: string
//   price: number
//   description: string
//   discount?: {
//     percentage: number
//     originalPrice: number
//   }
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

// Dashboard-specific ticket interface
interface DashboardTicket {
  id: string
  eventId: string
  eventName: string
  date: string
  dayOfWeek: string
  location: string
  ticketType: string
  quantity: number
  orderNumber: string
  price: number
  image: string
  organizer: string
  purchaseDate: string
  scanned: boolean // New field to track scan status
}

export default function DashboardPage() {
  // State for ticket dialog
  const [selectedTicket, setSelectedTicket] = useState<DashboardTicket | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)

  // State for tickets
  const [upcomingTickets, setUpcomingTickets] = useState<DashboardTicket[]>([])
  const [pastTickets, setPastTickets] = useState<DashboardTicket[]>([])

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
  }

  // Load tickets from local storage or mock data
  useEffect(() => {
    const initialTickets: DashboardTicket[] = [
      {
        id: "1",
        eventId: "1",
        eventName: "Summer Music Festival",
        date: "May 31, 2025",
        dayOfWeek: "Sat",
        location: "Central Park, New York",
        ticketType: "EARLY BIRD",
        quantity: 1,
        orderNumber: "ORD-12345678",
        price: 855,
        image: "/placeholder.svg?height=200&width=400",
        organizer: "Summer Fest Productions",
        purchaseDate: "May 10, 2025",
        scanned: false,
      },
      {
        id: "2",
        eventId: "2",
        eventName: "Tech Conference 2025",
        date: "July 10, 2025",
        dayOfWeek: "Thu",
        location: "Convention Center, San Francisco",
        ticketType: "[EARLY BIRD] GA Standing",
        quantity: 2,
        orderNumber: "ORD-23456789",
        price: 1200,
        image: "/placeholder.svg?height=200&width=400",
        organizer: "Baramey Production",
        purchaseDate: "May 12, 2025",
        scanned: false,
      },
      {
        id: "3",
        eventId: "3",
        eventName: "Winter Concert Series",
        date: "December 10, 2024",
        dayOfWeek: "Tue",
        location: "Music Hall, Chicago",
        ticketType: "VIP",
        quantity: 1,
        orderNumber: "ORD-34567890",
        price: 950,
        image: "/placeholder.svg?height=200&width=400",
        organizer: "Winter Music Productions",
        purchaseDate: "November 1, 2024",
        scanned: true,
      },
    ]

    const storedTickets = JSON.parse(localStorage.getItem("purchasedTickets") || "[]") as DashboardTicket[]
    const allTickets = [...initialTickets, ...storedTickets].reduce((acc, ticket) => {
      acc[ticket.id] = ticket
      return acc
    }, {} as Record<string, DashboardTicket>)

    const tickets = Object.values(allTickets)
    const now = new Date()
    const upcoming = tickets.filter((ticket) => new Date(ticket.date) >= now)
    const past = tickets.filter((ticket) => new Date(ticket.date) < now)

    setUpcomingTickets(upcoming)
    setPastTickets(past)
  }, [])

  // QR code scanner setup
  useEffect(() => {
    if (showScanner && selectedTicket) {
      const html5QrCode = new Html5Qrcode("qr-reader")
      const qrCodeSuccessCallback = (decodedText: string) => {
        setScanResult(decodedText)
        html5QrCode.stop().then(() => {
          // Validate QR code
          try {
            const qrData = JSON.parse(decodedText)
            if (qrData.ticketId === selectedTicket.id && qrData.orderNumber === selectedTicket.orderNumber) {
              // Update ticket as scanned
              const updatedTickets = [...upcomingTickets, ...pastTickets].map((t) =>
                t.id === selectedTicket.id ? { ...t, scanned: true } : t
              )
              localStorage.setItem("purchasedTickets", JSON.stringify(updatedTickets))
              setUpcomingTickets(updatedTickets.filter((t) => new Date(t.date) >= new Date()))
              setPastTickets(updatedTickets.filter((t) => new Date(t.date) < new Date()))
              setSelectedTicket({ ...selectedTicket, scanned: true })
              setShowScanner(false)
              setScanResult("Ticket successfully scanned!")
            } else {
              setScanResult("Invalid QR code!")
            }
          } catch {
            setScanResult("Error parsing QR code!")
          }
        })
      }
      const qrCodeErrorCallback = (error: string) => {
        console.error(error)
      }

      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      ).catch((err) => {
        setScanResult("Failed to start scanner: " + err)
      })

      return () => {
        html5QrCode.stop().catch((err) => console.error("Failed to stop scanner", err))
      }
    }
  }, [showScanner, selectedTicket, upcomingTickets, pastTickets])

  const handleViewTicket = (ticket: DashboardTicket) => {
    setSelectedTicket(ticket)
    setIsDialogOpen(true)
    setShowQR(false)
    setShowScanner(false)
    setScanResult(null)
  }

  const toggleQRCode = () => {
    setShowQR(!showQR)
    setShowScanner(false)
    setScanResult(null)
  }

  const toggleScanner = () => {
    setShowScanner(!showScanner)
    setShowQR(false)
    setScanResult(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Link href="/events" className="flex items-center gap-2">
              <TicketIcon className="h-4 w-4" />
              Browse Events
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-white border w-full justify-start rounded-lg p-1 mb-4">
            <TabsTrigger
              value="upcoming"
              className="rounded-md data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
            >
              Upcoming Tickets
            </TabsTrigger>
            <TabsTrigger
              value="past"
              className="rounded-md data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
            >
              Past Tickets
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-md data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
            >
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Your Upcoming Events</h2>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
                {upcomingTickets.length} Tickets
              </Badge>
            </div>

            {upcomingTickets.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingTickets.map((ticket) => (
                  <Card key={ticket.id} className="overflow-hidden border-gray-200 transition-all hover:shadow-md">
                    <div className="relative h-40 w-full bg-gray-100">
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-purple-900/60">
                        <Image
                          src={ticket.image}
                          alt={ticket.eventName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 p-2 backdrop-blur-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-800">{ticket.date.split(" ")[0]}</div>
                          <div className="text-sm text-gray-600">
                            {ticket.dayOfWeek}, {ticket.date.split(" ")[2]}
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-gray-800">{ticket.eventName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-gray-500">
                        <TicketIcon className="h-3.5 w-3.5" />
                        {ticket.ticketType}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-2">
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="mr-2 h-4 w-4 text-purple-500" />
                        <span className="text-sm">{ticket.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <UserIcon className="mr-2 h-4 w-4 text-purple-500" />
                        <span className="text-sm">{ticket.organizer}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          x{ticket.quantity}
                        </Badge>
                        <span className="text-sm font-medium text-gray-700">Order #{ticket.orderNumber.slice(-4)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button
                        onClick={() => handleViewTicket(ticket)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        View Ticket
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-purple-100 p-3">
                    <TicketIcon className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">No Upcoming Tickets</h3>
                  <p className="mb-6 text-gray-500">You do not have any upcoming tickets yet</p>
                  <Button asChild className="bg-purple-600 hover:bg-purple-700">
                    <Link href="/events">Browse Events</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Your Past Events</h2>
              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 px-3 py-1">
                {pastTickets.length} Tickets
              </Badge>
            </div>

            {pastTickets.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="overflow-hidden border-gray-200 opacity-80 transition-all hover:opacity-100"
                  >
                    <div className="relative h-40 w-full bg-gray-100">
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-gray-900/60">
                        <Image
                          src={ticket.image}
                          alt={ticket.eventName}
                          className="h-full w-full object-cover grayscale"
                        />
                      </div>
                      <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 p-2 backdrop-blur-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-800">{ticket.date.split(" ")[0]}</div>
                          <div className="text-sm text-gray-600">
                            {ticket.dayOfWeek}, {ticket.date.split(" ")[2]}
                          </div>
                        </div>
                      </div>
                      <div className="absolute right-4 top-4 rounded-full bg-gray-800/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        Completed
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-gray-800">{ticket.eventName}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-gray-500">
                        <TicketIcon className="h-3.5 w-3.5" />
                        {ticket.ticketType}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-2">
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-sm">{ticket.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="text-sm">{ticket.organizer}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                          x{ticket.quantity}
                        </Badge>
                        <span className="text-sm font-medium text-gray-700">Order #{ticket.orderNumber.slice(-4)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button onClick={() => handleViewTicket(ticket)} variant="outline" className="w-full">
                        View Receipt
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex.flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-gray-100 p-3">
                    <Clock3Icon className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">No Past Tickets</h3>
                  <p className="mb-6 text-gray-500">You do not have any past tickets yet</p>
                  <Button asChild variant="outline">
                    <Link href="/events">Browse Events</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Your Profile</h2>
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-800">Personal Information</CardTitle>
                <CardDescription>Manage your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                    <span className="text-xl font-bold">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{user.name}</h3>
                    <p className="text-gray-500">Account Member since May 2025</p>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <UserIcon className="h-4 w-4" />
                      <span>Full Name</span>
                    </div>
                    <p className="text-gray-800">{user.name}</p>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <MailIcon className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Change Password
                </Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Edit Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ticket View Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Tickets</DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="relative">
                  <div className="bg-gradient-to-b from-purple-900/20 to-purple-900/60 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-3xl font-bold text-gray-800">{selectedTicket.date.split(" ")[0]}</span>
                        <span className="text-gray-600">
                          {selectedTicket.dayOfWeek}, {selectedTicket.date.split(" ")[2]}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-800">${selectedTicket.price.toFixed(2)}</div>
                        <div className="text-xl font-bold text-purple-700">{selectedTicket.ticketType}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Event logo"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{selectedTicket.organizer}</div>
                        <div className="text-sm text-gray-500">{selectedTicket.eventName}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">x{selectedTicket.quantity}</div>
                    </div>
                  </div>
                </div>

                {showQR ? (
                  <div className="flex flex-col items-center justify-center bg-white p-6">
                    <div className="mb-4 h-48 w-48 bg-white flex items-center justify-center">
                      <QRCodeCanvas
                        value={JSON.stringify({
                          ticketId: selectedTicket.id,
                          orderNumber: selectedTicket.orderNumber,
                          eventId: selectedTicket.eventId,
                        })}
                        size={192}
                      />
                    </div>
                    <Button onClick={toggleQRCode} variant="outline" className="w-full">
                      Hide QR Code
                    </Button>
                  </div>
                ) : showScanner ? (
                  <div className="flex flex-col items-center justify-center bg-white p-6">
                    <div id="qr-reader" className="mb-4 w-full max-w-[300px] h-[300px]"></div>
                    {scanResult && (
                      <p className={`text-center ${scanResult.includes("success") ? "text-green-600" : "text-red-600"}`}>
                        {scanResult}
                      </p>
                    )}
                    <Button onClick={toggleScanner} variant="outline" className="w-full">
                      Stop Scanner
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white p-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <MapPinIcon className="mr-2 h-4 w-4 text-purple-500" />
                        <span>{selectedTicket.location}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <TicketIcon className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Order #{selectedTicket.orderNumber}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock3Icon className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Purchased on {selectedTicket.purchaseDate}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <QrCodeIcon className="mr-2 h-4 w-4 text-purple-500" />
                        <span>Scan Status: {selectedTicket.scanned ? "Scanned" : "Not Scanned"}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button onClick={toggleQRCode} className="flex-1 bg-purple-600 hover:bg-purple-700">
                        Show QR Code
                      </Button>
                      <Button
                        onClick={toggleScanner}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        disabled={selectedTicket.scanned}
                      >
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
    </div>
  )
}
