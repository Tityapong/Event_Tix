import Link from "next/link"
import { Button } from "@/components/ui/button"
import EventCard from "@/components/event-card"
import { ArrowRight } from "lucide-react"
import HomeHero from "@/components/home-hero"

export default function Home() {
  // Mock data for featured events
  const featuredEvents = [
    {
      id: "1",
      title: "Summer Music Festival",
      date: "June 15, 2025",
      location: "Central Park, New York",
      image: "/event1.jpg",
      organizer: "Music Events Inc.",
      price: 49.99,
    },
    {
      id: "2",
      title: "Tech Conference 2025",
      date: "July 10, 2025",
      location: "Convention Center, San Francisco",
      image: "/event1.jpg",
      organizer: "TechTalks",
      price: 199.99,
    },
    {
      id: "3",
      title: "Food & Wine Festival",
      date: "August 5, 2025",
      location: "Waterfront Plaza, Chicago",
      image: "/event1.jpg",
      organizer: "Culinary Arts Association",
      price: 79.99,
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      
      <HomeHero/>

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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {/* <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-3xl font-bold">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {["Music", "Business", "Food & Drink", "Arts", "Sports", "Technology", "Workshops", "Charity"].map(
              (category) => (
                <Card key={category} className="overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-0">
                    <Link href={`/events?category=${category.toLowerCase()}`} className="block p-6">
                      <h3 className="text-xl font-semibold">{category}</h3>
                    </Link>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </div>
      </section> */}

   
    </main>
  )
}
