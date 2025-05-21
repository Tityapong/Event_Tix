export const events = [
  {
    id: "1",
    title: "Summer Music Festival",
    date: "June 15, 2025",
    time: "4:00 PM - 11:00 PM",
    location: "Central Park, New York",
    image: "/event1.jpg",
    organizer: "Music Events Inc.",
    description:
      "Join us for the biggest summer music festival featuring top artists from around the world. Enjoy a day of amazing performances, food, and fun activities for all ages.",
    tickets: [
      {
        type: "vip",
        name: "VIP2",
        price: 129.99,
        description: "Front row access, exclusive lounge, complimentary drinks",
        discount: {
          percentage: 13,
          originalPrice: 149.99,
        },
      },
      {
        type: "premium",
        name: "Premium",
        price: 79.99,
        description: "Priority seating, fast-track entry",
        discount: {
          percentage: 20,
          originalPrice: 99.99,
        },
      },
      { type: "standard", name: "Standard", price: 49.99, description: "General admission" },
    ],
    category: "Festival",
  },
  {
    id: "2",
    title: "Tech Conference 2025",
    date: "July 10, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Convention Center, San Francisco",
    image: "/event1.jpg",
    organizer: "TechTalks",
    description:
      "The premier tech conference featuring keynotes from industry leaders, workshops, and networking opportunities.",
    tickets: [
      {
        type: "vip",
        name: "VIP",
        price: 299.99,
        description: "VIP seating, exclusive networking events, conference swag",
        discount: {
          percentage: 14,
          originalPrice: 349.99,
        },
      },
      { type: "premium", name: "Premium", price: 249.99, description: "Priority seating, fast-track entry" },
      { type: "standard", name: "Standard", price: 199.99, description: "General admission" },
    ],
    category: "Conference",
  },
  {
    id: "3",
    title: "Food & Wine Festival",
    date: "August 5, 2025",
    time: "12:00 PM - 8:00 PM",
    location: "Waterfront Plaza, Chicago",
    image: "/event1.jpg",
    organizer: "Culinary Arts Association",
    description: "Sample cuisine from top chefs and wines from award-winning vineyards in this culinary celebration.",
    tickets: [
      {
        type: "vip",
        name: "VIP",
        price: 149.99,
        description: "Early access, chef meet & greet, premium tastings",
      },
      {
        type: "premium",
        name: "Premium",
        price: 79.99,
        description: "Priority entry, extra tasting tokens",
        discount: {
          percentage: 20,
          originalPrice: 99.99,
        },
      },
      {
        type: "standard",
        name: "Standard",
        price: 59.99,
        description: "General admission",
        discount: {
          percentage: 25,
          originalPrice: 79.99,
        },
      },
    ],
    category: "Food",
  },
  {
    id: "4",
    title: "Business Leadership Summit",
    date: "September 20, 2025",
    time: "8:00 AM - 5:00 PM",
    location: "Grand Hotel, Boston",
    image: "/event1.jpg",
    organizer: "Business Leaders Network",
    description: "Connect with industry leaders and learn cutting-edge business strategies at this premier summit.",
    tickets: [
      {
        type: "vip",
        name: "VIP",
        price: 399.99,
        description: "VIP seating, exclusive networking dinner, 1-on-1 coaching session",
        discount: {
          percentage: 20,
          originalPrice: 499.99,
        },
      },
      { type: "premium", name: "Premium", price: 399.99, description: "Priority seating, networking lunch" },
      { type: "standard", name: "Standard", price: 299.99, description: "General admission" },
    ],
    category: "Business",
  },
  {
    id: "5",
    title: "Art Exhibition Opening",
    date: "October 8, 2025",
    time: "7:00 PM - 10:00 PM",
    location: "Modern Art Gallery, Los Angeles",
    image: "/event1.jpg",
    organizer: "Contemporary Arts Foundation",
    description:
      "Be among the first to experience this groundbreaking exhibition featuring works from emerging artists.",
    tickets: [
      {
        type: "vip",
        name: "VIP",
        price: 60.0,
        description: "Early access, artist meet & greet, exhibition catalog",
        discount: {
          percentage: 20,
          originalPrice: 75.0,
        },
      },
      { type: "premium", name: "Premium", price: 45.0, description: "Priority entry, complimentary drink" },
      { type: "standard", name: "Standard", price: 25.0, description: "General admission" },
    ],
    category: "Arts",
  },
  {
    id: "6",
    title: "Charity Gala Dinner",
    date: "November 15, 2025",
    time: "6:30 PM - 11:00 PM",
    location: "Luxury Hotel, Miami",
    image: "/event1.jpg",
    organizer: "Global Aid Foundation",
    description: "An elegant evening of dining and entertainment to raise funds for global humanitarian efforts.",
    tickets: [
      {
        type: "vip",
        name: "VIP",
        price: 250.0,
        description: "Premium seating, champagne reception, photo opportunity with special guests",
        discount: {
          percentage: 17,
          originalPrice: 300.0,
        },
      },
      {
        type: "premium",
        name: "Premium",
        price: 175.0,
        description: "Priority seating, welcome gift",
        discount: {
          percentage: 12.5,
          originalPrice: 200.0,
        },
      },
      { type: "standard", name: "Standard", price: 150.0, description: "General admission" },
    ],
    category: "Charity",
  },
]

// Simulate fetching events (for compatibility with existing code)
export const fetchEvents = async () => {
  return events
}