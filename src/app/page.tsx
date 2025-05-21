// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import EventCard from "@/components/event-card"
// import { ArrowRight } from "lucide-react"
// import HomeHero from "@/components/home-hero"

// export default function Home() {
//   // Mock data for featured events
//   const featuredEvents = [
//     {
//       id: "1",
//       title: "Summer Music Festival",
//       date: "June 15, 2025",
//       location: "Central Park, New York",
//       image: "/event1.jpg",
//       organizer: "Music Events Inc.",
//       price: 49.99,
//     },
//     {
//       id: "2",
//       title: "Tech Conference 2025",
//       date: "July 10, 2025",
//       location: "Convention Center, San Francisco",
//       image: "/event1.jpg",
//       organizer: "TechTalks",
//       price: 199.99,
//     },
//     {
//       id: "3",
//       title: "Food & Wine Festival",
//       date: "August 5, 2025",
//       location: "Waterfront Plaza, Chicago",
//       image: "/event1.jpg",
//       organizer: "Culinary Arts Association",
//       price: 79.99,
//     },
//   ]

//   return (
//     <main className="flex min-h-screen flex-col">
//       {/* Hero Section */}
      
//       <HomeHero/>

//       {/* Featured Events */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <div className="mb-10 flex items-center justify-between">
//             <h2 className="text-3xl font-bold">Featured Events</h2>
//             <Button asChild variant="ghost" className="gap-2">
//               <Link href="/events">
//                 View All <ArrowRight className="h-4 w-4" />
//               </Link>
//             </Button>
//           </div>
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {featuredEvents.map((event) => (
//               <EventCard key={event.id} event={event} />
//             ))}
//           </div>
//         </div>
//       </section>



   
//     </main>
//   )
// }
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/event-card";
import { ArrowRight } from "lucide-react";
import HomeHero from "@/components/home-hero";
import { fetchEvents, Event } from "@/lib/events";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents.slice(0, 3));
      } catch {
        setError("Failed to load featured events. Please try again later.");
      }
    }
    loadEvents();
  }, []);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <HomeHero />

      {/* Featured Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/events">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
