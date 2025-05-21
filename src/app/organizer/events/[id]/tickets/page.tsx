"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { fetchEvents, Event, Ticket } from "@/lib/events";
import { getAuthToken } from "@/lib/auth";
import axios from "axios";

export default function TicketsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true);
      try {
        const events = await fetchEvents();
        const foundEvent = events.find((e) => e.id === eventId);
        if (!foundEvent) {
          throw new Error("Event not found");
        }
        setEvent(foundEvent);
        setTickets(foundEvent.tickets);
      } catch {
        setError("Failed to load event or tickets. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadEvent();
  }, [eventId]);

  const addTicketType = () => {
    setTickets([
      ...tickets,
      {
        name: "",
        price: 0,
        discount: 0,
        quantity_available: 0,
        description: "",
      },
    ]);
  };

  const removeTicketType = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }

      const ticketData = tickets.map((ticket) => ({
        event_id: Number(eventId),
        ticket_name: ticket.name.trim(),
        price: Number(Number(ticket.price).toFixed(2)),
        quantity_available: Number(ticket.quantity_available),
        discount: Number(ticket.discount),
        description: ticket.description,
      }));

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/ticket-types/${eventId}`,
        { tickets: ticketData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Tickets updated successfully!", {
        description: "Your ticket changes have been saved.",
      });
      router.push("/organizer/dashboard");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message || "Failed to update tickets. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex justify-center py-8">Loading...</CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex justify-center py-8">Event not found</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Tickets: {event.title}</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Types</CardTitle>
          <CardDescription>Manage ticket types for your event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {tickets.map((ticket, index) => (
            <div key={index} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Ticket Type {index + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTicketType(index)}
                  className="h-8 w-8 p-0 text-red-500"
                >
                  <Trash2Icon className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`ticketName-${index}`}>Ticket Name</Label>
                  <Input
                    id={`ticketName-${index}`}
                    value={ticket.name}
                    onChange={(e) => {
                      const newTickets = [...tickets];
                      newTickets[index].name = e.target.value;
                      setTickets(newTickets);
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ticketPrice-${index}`}>Price ($)</Label>
                  <Input
                    id={`ticketPrice-${index}`}
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={ticket.price}
                    onChange={(e) => {
                      const newTickets = [...tickets];
                      newTickets[index].price = Number.parseFloat(e.target.value) || 0;
                      setTickets(newTickets);
                    }}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`ticketQuantity-${index}`}>Quantity Available</Label>
                <Input
                  id={`ticketQuantity-${index}`}
                  type="number"
                  min="1"
                  value={ticket.quantity_available}
                  onChange={(e) => {
                    const newTickets = [...tickets];
                    newTickets[index].quantity_available = Number.parseInt(e.target.value) || 0;
                    setTickets(newTickets);
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`ticketDiscount-${index}`}>Discount (%)</Label>
                <Input
                  id={`ticketDiscount-${index}`}
                  type="number"
                  min="0"
                  max="100"
                  value={ticket.discount}
                  onChange={(e) => {
                    const newTickets = [...tickets];
                    newTickets[index].discount = Number.parseInt(e.target.value) || 0;
                    setTickets(newTickets);
                  }}
                />
              </div>
              {ticket.discount > 0 && (
                <div className="mt-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Original price:</span>
                    <span>${ticket.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Discounted price:</span>
                    <span>${(ticket.price * (1 - ticket.discount / 100)).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addTicketType}
            className="flex w-full items-center justify-center"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Ticket Type
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/organizer/dashboard")}>
            Cancel
          </Button>
          <Button type="button" onClick={handleTicketSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Tickets"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
