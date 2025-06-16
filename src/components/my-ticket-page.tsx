"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, TicketIcon, QrCodeIcon, Clock3Icon, SparklesIcon, RefreshCwIcon } from "lucide-react"
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

type ScannerState = "stopped" | "starting" | "running" | "stopping"

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
  const [isMounted, setIsMounted] = useState(false)

  // Refs for scanner management - using unknown to avoid type conflicts
  const scannerRef = useRef<unknown>(null)
  const scannerStateRef = useRef<ScannerState>("stopped")
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Ensure component is mounted before running client-side code
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getDayOfWeek = useCallback((dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleString("en-US", { weekday: "short" })
    } catch {
      return "N/A"
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!isMounted) return

    setIsLoading(true)
    setError(null)

    try {
      const orders: OrderResponse[] = await getOrders()
      const tickets: DashboardTicket[] = orders.map((order) => ({
        id: order.order_id.toString(),
        eventId: order.order_id.toString(),
        eventName: order.eventTitle || "Unnamed Event",
        date: order.eventDate || "",
        dayOfWeek: getDayOfWeek(order.eventDate || ""),
        time: order.eventTime || "",
        location: order.eventLocation || "",
        ticketType: order.ticketType || "General",
        quantity: order.quantity || 1,
        orderNumber: `ORD-${order.order_id.toString().padStart(8, "0")}`,
        price: Number.parseFloat(order.total) || 0,
        image: order.eventImage || "/placeholder.svg?height=200&width=300",
        purchaseDate: order.order_date.split(" ")[0] || "",
        scanned: order.is_scanned || false,
        qr_code: order.qr_code || null,
      }))

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const upcoming = tickets.filter((t) => {
        try {
          return new Date(t.date) >= today
        } catch {
          return false
        }
      })

      const past = tickets.filter((t) => {
        try {
          return new Date(t.date) < today
        } catch {
          return true
        }
      })

      setUpcomingTickets(upcoming)
      setPastTickets(past)

      // Cache tickets safely
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("purchasedTickets", JSON.stringify(tickets))
        }
      } catch (storageError) {
        console.warn("Failed to cache tickets:", storageError)
      }
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Failed to load tickets. Showing cached tickets if available.")

      // Load from cache safely
      try {
        if (typeof window !== "undefined") {
          const storedTickets = JSON.parse(localStorage.getItem("purchasedTickets") || "[]") as DashboardTicket[]
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          setUpcomingTickets(
            storedTickets.filter((t) => {
              try {
                return new Date(t.date) >= today
              } catch {
                return false
              }
            }),
          )
          setPastTickets(
            storedTickets.filter((t) => {
              try {
                return new Date(t.date) < today
              } catch {
                return true
              }
            }),
          )
        }
      } catch (cacheError) {
        console.error("Error loading cached tickets:", cacheError)
        setUpcomingTickets([])
        setPastTickets([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [getDayOfWeek, isMounted])

  // Safe scanner stop function
  const stopScanner = useCallback(async () => {
    if (scannerRef.current && scannerStateRef.current === "running") {
      try {
        scannerStateRef.current = "stopping"
        // Use type assertion to call stop method
        await (scannerRef.current as { stop: () => Promise<unknown> }).stop()
        scannerStateRef.current = "stopped"
        console.log("Scanner stopped successfully")
      } catch (error) {
        console.warn("Scanner stop warning:", error)
        // Force state to stopped even if stop() fails
        scannerStateRef.current = "stopped"
      }
    }
  }, [])

  // Cleanup function
  const cleanupScanner = useCallback(() => {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current)
      errorTimeoutRef.current = null
    }

    if (scannerRef.current) {
      stopScanner().catch(() => {
        // Ignore errors during cleanup
        scannerStateRef.current = "stopped"
      })
    }
  }, [stopScanner])

  useEffect(() => {
    if (isMounted) {
      fetchOrders()
    }
  }, [fetchOrders, isMounted])

  // QR Scanner effect with proper state management
  useEffect(() => {
    if (!isMounted || !showScanner || !selectedTicket || typeof window === "undefined") {
      return
    }

    const initScanner = async () => {
      try {
        // Clean up any existing scanner first
        await stopScanner()

        const { Html5Qrcode } = await import("html5-qrcode")
        scannerRef.current = new Html5Qrcode("qr-reader")
        scannerStateRef.current = "starting"

        const qrCodeSuccessCallback = async (decodedText: string) => {
          console.log("Decoded QR Code:", decodedText)
          setIsScanning(true)
          setScanResult(null)
          setScanError(null)

          try {
            // Stop scanner first
            await stopScanner()

            let qrData
            try {
              qrData = JSON.parse(decodedText)
              console.log("Parsed QR Data:", qrData)
            } catch {
              setScanResult("Invalid QR code: Not a valid JSON format")
              setIsScanning(false)
              return
            }

            // Scan the QR code
            const scanResponse = await scanQRCode(decodedText)
            console.log("Scan response:", scanResponse)

            // Update local state immediately
            setSelectedTicket((prev) => (prev ? { ...prev, scanned: true } : null))

            // Update tickets in state
            const updateTickets = (tickets: DashboardTicket[]) =>
              tickets.map((t) => (t.id === selectedTicket.id ? { ...t, scanned: true } : t))

            setUpcomingTickets((prev) => updateTickets(prev))
            setPastTickets((prev) => updateTickets(prev))

            // Update localStorage safely
            try {
              const allTickets = [...upcomingTickets, ...pastTickets]
              const updatedTickets = updateTickets(allTickets)
              if (typeof window !== "undefined") {
                localStorage.setItem("purchasedTickets", JSON.stringify(updatedTickets))
              }
            } catch (storageError) {
              console.warn("Failed to update localStorage:", storageError)
            }

            // Close scanner
            setShowScanner(false)

            // Show success message
            setScanResult("✅ Ticket successfully scanned!")

            // Show toast notification with delay
            setTimeout(() => {
              try {
                toast.success("🎉 Scan Successful!", {
                  description: "Your ticket has been successfully scanned and marked as used.",
                  duration: 5000,
                })
              } catch (toastError) {
                console.warn("Toast notification failed:", toastError)
              }
            }, 100)

            // Refresh data in background
            setTimeout(() => {
              fetchOrders().catch((error) => {
                console.warn("Background refresh failed:", error)
              })
            }, 1000)
          } catch (err: unknown) {
            console.error("Scan error details:", err)
            const errorMessage = err instanceof Error ? err.message : "Unknown error"
            setScanResult(`Error scanning QR code: ${errorMessage}`)

            setTimeout(() => {
              try {
                toast.error("Scan Failed", {
                  description: errorMessage,
                  duration: 5000,
                })
              } catch (toastError) {
                console.warn("Error toast failed:", toastError)
              }
            }, 100)
          } finally {
            setIsScanning(false)
          }
        }

        const qrCodeErrorCallback = (error: string) => {
          if (error.includes("No barcode or QR code detected") || error.includes("NotFoundException")) {
            setScanError("No QR code detected. Please align the QR code within the scan area.")
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
            errorTimeoutRef.current = setTimeout(() => setScanError(null), 3000)
          } else {
            console.error("QR scan error:", error)
            setScanError(`Error detecting QR code: ${error}`)
          }
        }

        // Use type assertion to call start method with proper parameters
        const scanner = scannerRef.current as {
          start: (
            camera: { facingMode: string },
            config: { fps: number; qrbox: { width: number; height: number }; aspectRatio: number },
            successCallback: (decodedText: string) => void,
            errorCallback: (error: string) => void,
          ) => Promise<unknown>
        }

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 20,
            qrbox: { width: 350, height: 350 },
            aspectRatio: 1.0,
          },
          qrCodeSuccessCallback,
          qrCodeErrorCallback,
        )

        scannerStateRef.current = "running"
        console.log("Scanner started successfully")
      } catch (err) {
        console.error("Failed to start scanner:", err)
        setScanResult("Failed to start scanner. Please try again.")
        setIsScanning(false)
        scannerStateRef.current = "stopped"
      }
    }

    initScanner()

    return cleanupScanner
  }, [showScanner, selectedTicket, upcomingTickets, pastTickets, fetchOrders, isMounted, stopScanner, cleanupScanner])

  // Cleanup on unmount
  useEffect(() => {
    return cleanupScanner
  }, [cleanupScanner])

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

  const handleToggleScanner = useCallback(async () => {
    if (!showScanner) {
      setShowScanConfirm(true)
    } else {
      await stopScanner()
      setShowScanner(false)
      setScanResult(null)
      setScanError(null)
    }
  }, [showScanner, stopScanner])

  const confirmScan = useCallback(() => {
    setShowScanConfirm(false)
    setShowQR(false)
    setScanResult(null)
    setScanError(null)
    setShowScanner(true)
  }, [])

  const memoizedUpcomingTickets = useMemo(() => upcomingTickets, [upcomingTickets])
  const memoizedPastTickets = useMemo(() => pastTickets, [pastTickets])

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
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
              disabled={isLoading}
            >
              <RefreshCwIcon className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
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
              ⚠️ {error}
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
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            {ticket.date.split(" ")[0] || "N/A"}
                          </div>
                          <div className="text-xs text-slate-600 font-medium">
                            {ticket.dayOfWeek} {ticket.date.split(" ")[2] || ""}
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
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            {ticket.date.split(" ")[0] || "N/A"}
                          </div>
                          <div className="text-xs text-slate-600 font-medium">
                            {ticket.dayOfWeek} {ticket.date.split(" ")[2] || ""}
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
                  <p className="mb-8 text-slate-600 max-w-md">Looks like you have attended any events yet.</p>
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
                        <span className="text-4xl font-bold">{selectedTicket.date.split(" ")[0] || "N/A"}</span>
                        <span className="text-purple-100 font-medium">
                          {selectedTicket.dayOfWeek}, {selectedTicket.date.split(" ")[2] || ""}
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
                        <img
                          src={selectedTicket.qr_code || "/placeholder.svg"}
                          alt="QR code for ticket"
                          width={200}
                          height={200}
                          className="object-contain"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200"
                          }}
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
