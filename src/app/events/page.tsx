"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import EventCard from "@/components/event-card";
import CategoryFilter from "@/components/category-filter";
import { fetchEvents, Event } from "@/lib/events";

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a1a1aa;
  }
`;

export default function EventsPage() {
  // State for events
  const [events, setEvents] = useState<Event[]>([]);
  // State for filtered events
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  // State for selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // State for loading
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events on component mount
  useEffect(() => {
    const getEvents = async () => {
      setIsLoading(true);
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
        setFilteredEvents(eventsData);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, []);

  // Handle category selection from the CategoryFilter component
  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  // Filter events based on selected categories and search query
  useEffect(() => {
    let result = events;

    // Filter by categories if any are selected
    if (selectedCategories.length > 0) {
      result = result.filter(
        (event) => event.category && selectedCategories.includes(event.category)
      );
    }

    // Filter by search query if it exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          (event.description?.toLowerCase().includes(query) || false) ||
          event.location.toLowerCase().includes(query)
      );
    }

    setFilteredEvents(result);
  }, [selectedCategories, searchQuery, events]);

  return (
    <>
      <style>{scrollbarStyles}</style>
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Discover Events</h1>

        {/* Search and Filter Container */}
        <div className="mb-8 grid gap-6 md:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <div className="rounded-lg border p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              {/* Uncomment if you want a reset button */}
              {/* <button
                className="text-purple-600 text-sm hover:underline"
                onClick={resetFilters}
              >
                Reset
              </button> */}
            </div>

            <CategoryFilter
              onCategoryChange={handleCategoryChange}
              initialSelected={selectedCategories}
            />
          </div>

          {/* Main Content */}
          <div>
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Active Filters */}
            {selectedCategories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    {category}
                    <button
                      className="ml-2 text-purple-600 hover:text-purple-800"
                      onClick={() =>
                        setSelectedCategories((prev) =>
                          prev.filter((cat) => cat !== category)
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Events Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <div className="col-span-3 py-10 text-center text-gray-500">
                    <p className="text-lg">No events found matching your criteria.</p>
                    <button
                      className="mt-4 text-purple-600 hover:underline"
                      onClick={resetFilters}
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pagination - Only show if we have events */}
            {filteredEvents.length > 0 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-purple-700 text-white hover:bg-purple-800"
                  >
                    1
                  </Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
