

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { fetchCategories, Category } from "@/lib/categories";
import axios from "axios";
import { toast } from "sonner";
import { getAuthToken } from "@/lib/auth";

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [eventId, setEventId] = useState<number | null>(null);
  const [eventData, setEventData] = useState({
    event_name: "",
    event_description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    event_location: "",
    category_id: "",
    image: null as File | null,
  });
  const [tickets, setTickets] = useState([
    {
      ticket_name: "",
      price: 0,
      description: "",
      quantity_available: 0,
      discount: 0,
    },
  ]);
  const [discount, setDiscount] = useState({
    discount_code: "",
    discount_percentage: 0,
    start_date: "",
    end_date: "",
  });
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch {
        setError("Failed to load categories. Please try again.");
      }
    };
    loadCategories();
  }, []);

  const addTicketType = () => {
    setTickets([
      ...tickets,
      {
        ticket_name: "",
        price: 0,
        description: "",
        quantity_available: 0,
        discount: 0,
      },
    ]);
  };

  const removeTicketType = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const validateEventForm = () => {
    if (!eventData.event_name.trim()) return "Event name is required";
    if (!eventData.event_description.trim()) return "Event description is required";
    if (!eventData.event_date) return "Event date is required";
    if (!eventData.start_time) return "Start time is required";
    if (!eventData.end_time) return "End time is required";
    if (!eventData.event_location.trim()) return "Event location is required";
    if (!eventData.category_id) return "Category is required";
    if (!categories.some((cat) => cat.id.toString() === eventData.category_id)) {
      return "Invalid category selected";
    }
    const today = new Date().toISOString().split("T")[0];
    if (eventData.event_date < today) return "Event date cannot be in the past";
    if (eventData.start_time >= eventData.end_time) {
      return "End time must be after start time";
    }
    return null;
  };

  const validateTicketsForm = () => {
    if (tickets.length === 0) return "At least one ticket type is required";
    for (const ticket of tickets) {
      if (!ticket.ticket_name.trim()) return "Ticket name is required";
      if (ticket.price <= 0 || isNaN(ticket.price)) return "Ticket price must be greater than 0";
      if (ticket.quantity_available <= 0 || isNaN(ticket.quantity_available)) {
        return "Ticket quantity must be greater than 0";
      }
      if (ticket.discount < 0 || ticket.discount > 100 || isNaN(ticket.discount)) {
        return "Ticket discount must be between 0 and 100";
      }
    }
    return null;
  };

  const validateDiscountForm = () => {
    if (discount.discount_code && discount.discount_percentage > 0) {
      if (!discount.start_date) return "Discount start date is required";
      if (!discount.end_date) return "Discount end date is required";
      if (discount.discount_percentage <= 0 || discount.discount_percentage > 100) {
        return "Discount percentage must be between 0 and 100";
      }
      const today = new Date().toISOString().split("T")[0];
      if (discount.start_date < today) return "Discount start date cannot be in the past";
      if (discount.end_date < discount.start_date) {
        return "Discount end date must be after start date";
      }
    }
    return null;
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateEventForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }

      const formData = new FormData();
      formData.append("event_name", eventData.event_name.trim());
      formData.append("event_description", eventData.event_description.trim());
      formData.append("event_date", eventData.event_date);
      formData.append("start_time", eventData.start_time);
      formData.append("end_time", eventData.end_time);
      formData.append("event_location", eventData.event_location.trim());
      formData.append("category_id", Number(eventData.category_id).toString());
      if (eventData.image) {
        formData.append("image", eventData.image);
      }

      const eventResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!eventResponse.data.id) {
        throw new Error("Event creation failed: No event ID returned");
      }

      setEventId(eventResponse.data.id);
      setActiveTab("ticket-types");
    } catch (error: unknown) {
      let errorMessage = "Failed to create event. Please check your input and try again.";
      if (axios.isAxiosError(error) && error.response?.data) {
        if (typeof error.response.data.message === "string") {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          const errs = error.response.data.errors;
          errorMessage = Array.isArray(errs)
            ? errs.join(", ")
            : typeof errs === "object"
            ? Object.values(errs).flat().join(", ")
            : String(errs);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateTicketsForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }

      const ticketData = tickets.map((ticket) => ({
        event_id: Number(eventId),
        ticket_name: ticket.ticket_name.trim(),
        price: Number(Number(ticket.price).toFixed(2)),
        quantity_available: Number(ticket.quantity_available),
        discount: Number(ticket.discount),
      }));

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ticket-types`,
        { tickets: ticketData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setActiveTab("discount");
    } catch (error: unknown) {
      let errorMessage = "Failed to create ticket types. Please check your input and try again.";
      if (axios.isAxiosError(error) && error.response?.data) {
        if (typeof error.response.data.message === "string") {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          const errs = error.response.data.errors;
          errorMessage = Array.isArray(errs)
            ? errs.join(", ")
            : typeof errs === "object"
            ? Object.values(errs).flat().join(", ")
            : String(errs);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  const handleDiscountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const validationError = validateDiscountForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }

      if (discount.discount_code && discount.discount_percentage > 0) {
        const discountData = {
          event_id: Number(eventId),
          discount_code: discount.discount_code.trim(),
          discount_percentage: Number(discount.discount_percentage),
          start_date: discount.start_date,
          end_date: discount.end_date,
        };

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/discounts`,
          discountData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      toast.success("Event created successfully!", {
        description: "Your event has been created and is now available.",
      });

      router.push("/organizer/dashboard");
    } catch (error: unknown) {
      let errorMessage = "Failed to create discount. Please check your input and try again.";
      if (axios.isAxiosError(error) && error.response?.data) {
        if (typeof error.response.data.message === "string") {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          const errs = error.response.data.errors;
          errorMessage = Array.isArray(errs)
            ? errs.join(", ")
            : typeof errs === "object"
            ? Object.values(errs).flat().join(", ")
            : String(errs);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Create New Event</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="ticket-types">Create Ticket Type</TabsTrigger>
          <TabsTrigger value="discount">Create Discount</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
              <CardDescription>Provide the basic details about your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event_name">Event Title</Label>
                <Input
                  id="event_name"
                  placeholder="Enter event title"
                  value={eventData.event_name}
                  onChange={(e) => setEventData({ ...eventData, event_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_description">Description</Label>
                <Textarea
                  id="event_description"
                  placeholder="Describe your event"
                  className="min-h-32"
                  value={eventData.event_description}
                  onChange={(e) => setEventData({ ...eventData, event_description: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    value={eventData.category_id}
                    onValueChange={(value) => setEventData({ ...eventData, category_id: value })}
                  >
                    <SelectTrigger id="category_id">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_location">Location</Label>
                  <Input
                    id="event_location"
                    placeholder="Event venue"
                    value={eventData.event_location}
                    onChange={(e) => setEventData({ ...eventData, event_location: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Date</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={eventData.event_date}
                    onChange={(e) => setEventData({ ...eventData, event_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={eventData.start_time}
                    onChange={(e) => setEventData({ ...eventData, start_time: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={eventData.end_time}
                    onChange={(e) => setEventData({ ...eventData, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Event Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEventData({ ...eventData, image: e.target.files?.[0] || null })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/organizer/dashboard")}>
                Cancel
              </Button>
              <Button type="button" onClick={handleEventSubmit}>
                Next: Create Ticket Type
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="ticket-types">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Types</CardTitle>
              <CardDescription>Create ticket types for your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {tickets.map((ticket, index) => (
                <div key={index} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Ticket Type {index + 1}</h3>
                    {tickets.length > 1 && (
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
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`ticketName-${index}`}>Ticket Name</Label>
                      <Input
                        id={`ticketName-${index}`}
                        placeholder="e.g., Standard, VIP, Early Bird"
                        value={ticket.ticket_name}
                        onChange={(e) => {
                          const newTickets = [...tickets];
                          newTickets[index].ticket_name = e.target.value;
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
                        placeholder="0.00"
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
                    <Label htmlFor={`ticketDescription-${index}`}>Description</Label>
                    <Textarea
                      id={`ticketDescription-${index}`}
                      placeholder="Describe what's included with this ticket"
                      value={ticket.description}
                      onChange={(e) => {
                        const newTickets = [...tickets];
                        newTickets[index].description = e.target.value;
                        setTickets(newTickets);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`ticketQuantity-${index}`}>Quantity Available</Label>
                    <Input
                      id={`ticketQuantity-${index}`}
                      type="number"
                      min="1"
                      placeholder="100"
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
                      placeholder="0"
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
                Add Another Ticket Type
              </Button>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setActiveTab("details")}>
                Back: Event Details
              </Button>
              <Button type="button" onClick={handleTicketSubmit}>
                Next: Create Discount
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="discount">
          <Card>
            <CardHeader>
              <CardTitle>Create Discount</CardTitle>
              <CardDescription>Configure a discount for your event (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Discount Details</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="discountCode">Discount Code</Label>
                    <Input
                      id="discountCode"
                      placeholder="e.g., SUMMER25"
                      value={discount.discount_code}
                      onChange={(e) => setDiscount({ ...discount, discount_code: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountAmount">Discount Amount (%)</Label>
                    <Input
                      id="discountAmount"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="25"
                      value={discount.discount_percentage}
                      onChange={(e) =>
                        setDiscount({ ...discount, discount_percentage: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountStartDate">Start Date</Label>
                    <Input
                      id="discountStartDate"
                      type="date"
                      value={discount.start_date}
                      onChange={(e) => setDiscount({ ...discount, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountEndDate">End Date</Label>
                    <Input
                      id="discountEndDate"
                      type="date"
                      value={discount.end_date}
                      onChange={(e) => setDiscount({ ...discount, end_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setActiveTab("ticket-types")}>
                Back: Ticket Types
              </Button>
              <Button type="button" onClick={handleDiscountSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Creating Event..." : "Finish"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
