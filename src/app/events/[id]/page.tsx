"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, User, Plus, Minus } from "lucide-react";
import { fetchEvents, Event as EventType } from "@/lib/events";
import Image from "next/image";

interface TicketSelection {
  type: string;
  quantity: number;
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id ?? "";

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>([]);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      try {
        const events = await fetchEvents();
        const foundEvent = events.find((e) => e.id === eventId) || null;
        setEvent(foundEvent);

        if (foundEvent?.tickets) {
          // Initialize ticket selections with quantity 0
          setTicketSelections(
            foundEvent.tickets.map((ticket) => ({
              type: ticket.name.toLowerCase().replace(/\s+/g, "-"),
              quantity: 0,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) loadEvent();
  }, [eventId]);

  // Handle quantity change of tickets
  const handleQuantityChange = (ticketType: string, delta: number) => {
    setTicketSelections((prev) =>
      prev.map((selection) =>
        selection.type === ticketType
          ? { ...selection, quantity: Math.max(0, selection.quantity + delta) }
          : selection
      )
    );
  };

  // Calculate total price considering discounts
  const totalPrice = ticketSelections.reduce((sum, selection) => {
    const ticket = event?.tickets?.find(
      (t) => t.name.toLowerCase().replace(/\s+/g, "-") === selection.type
    );
    if (!ticket) return sum;

    // Calculate discounted price if discount exists
    const discountedPrice = ticket.discount
      ? ticket.price - ticket.discount
      : ticket.price;

    return sum + discountedPrice * selection.quantity;
  }, 0);

  const handleBuyTicket = () => {
    const selectedTickets = ticketSelections
      .filter((s) => s.quantity > 0)
      .map((s) => `${s.type}:${s.quantity}`)
      .join(",");

    if (selectedTickets && event) {
      router.push(`/checkout?eventId=${event.id}&tickets=${selectedTickets}`);
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl font-semibold">Event not found.</p>
        <Link href="/events" className="text-purple-600 hover:underline">
          ← Back to Events
        </Link>
      </main>
    );
  }

  const hasDiscount = event.tickets.some((ticket) => ticket.discount > 0);

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
          <div className="mb-6 overflow-hidden rounded-lg relative">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              width={1200}
              height={600}
              className="w-full object-cover"
            />
            {hasDiscount && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-600 text-white px-3 py-1 text-sm">
                  Special Offer
                </Badge>
              </div>
            )}
          </div>

          <h1 className="mb-4 text-3xl font-bold">{event.title}</h1>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-500" />
              <span>{event.time || "TBD"}</span>
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

                {hasDiscount && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">
                      Special offer available! Limited time discounts on select
                      tickets.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {event.tickets.map((ticket) => {
                    const typeKey = ticket.name.toLowerCase().replace(/\s+/g, "-");
                    const selection = ticketSelections.find(
                      (s) => s.type === typeKey
                    );
                    const quantity = selection ? selection.quantity : 0;
                    const discountedPrice =
                      ticket.discount > 0 ? ticket.price - ticket.discount : ticket.price;

                    return (
                      <div key={typeKey} className="rounded-lg border p-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <Label className="text-lg font-medium">{ticket.name}</Label>
                            <div className="text-right">
                              {ticket.discount > 0 ? (
                                <div>
                                  <span className="font-bold text-green-600">
                                    ${discountedPrice.toFixed(2)}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm line-through text-gray-500">
                                      ${ticket.price.toFixed(2)}
                                    </span>
                                    <Badge className="bg-green-100 text-green-800">
                                      Save {(
                                        (ticket.discount / ticket.price) *
                                        100
                                      ).toFixed(0)}
                                      %
                                    </Badge>
                                  </div>
                                </div>
                              ) : (
                                <span className="font-bold">${ticket.price.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{ticket.description}</p>
                          <div className="mt-4 flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(typeKey, -1)}
                              disabled={quantity === 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={quantity}
                              onChange={(e) => {
                                const val = Math.max(0, Number(e.target.value) || 0);
                                const delta = val - quantity;
                                handleQuantityChange(typeKey, delta);
                              }}
                              className="w-16 text-center"
                              min={0}
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(typeKey, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <p className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</p>
                  <Button
                    onClick={handleBuyTicket}
                    className="mt-2 w-full"
                    disabled={totalPrice === 0}
                  >
                    Buy Now
                  </Button>
                </div>
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
  );
}
