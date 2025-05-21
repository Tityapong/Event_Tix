"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchEvents, Event } from "@/lib/events";
import { fetchCategories, Category } from "@/lib/categories";
import { getAuthToken } from "@/lib/auth";
import axios from "axios";
// import Image from "next/image";

export default function ManageEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    event_name: "",
    event_description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    event_location: "",
    category_id: "",
    image: null as File | null,
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch event
        const events = await fetchEvents();
        const foundEvent = events.find((e) => e.id === eventId);
        if (!foundEvent) {
          throw new Error("Event not found");
        }
        setEvent(foundEvent);
        setFormData({
          event_name: foundEvent.title,
          event_description: foundEvent.description,
          event_date: foundEvent.date,
          start_time: foundEvent.time.split(" - ")[0],
          end_time: foundEvent.time.split(" - ")[1] || "",
          event_location: foundEvent.location,
          category_id: foundEvent.category,
          image: null,
        });

        // Fetch categories
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch {
        setError("Failed to load event or categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token is missing. Please log in again.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("event_name", formData.event_name.trim());
      formDataToSend.append("event_description", formData.event_description.trim());
      formDataToSend.append("event_date", formData.event_date);
      formDataToSend.append("start_time", formData.start_time);
      formDataToSend.append("end_time", formData.end_time);
      formDataToSend.append("event_location", formData.event_location.trim());
      formDataToSend.append("category_id", formData.category_id);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Event updated successfully!", {
        description: "Your changes have been saved.",
      });
      router.push("/organizer/dashboard");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message || "Failed to update event. Please try again.");
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
      <h1 className="text-3xl font-bold mb-8">Manage Event: {event.title}</h1>
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Edit the details of your event</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event_name">Event Title</Label>
            <Input
              id="event_name"
              value={formData.event_name}
              onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event_description">Description</Label>
            <Textarea
              id="event_description"
              value={formData.event_description}
              onChange={(e) => setFormData({ ...formData, event_description: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
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
                value={formData.event_location}
                onChange={(e) => setFormData({ ...formData, event_location: e.target.value })}
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
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Event Image</Label>
            {event.image && (
              <img
                
                src={event.image}
                alt={`${event.title} image`}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            )}
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/organizer/dashboard")}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
