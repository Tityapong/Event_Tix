"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Calendar, Heart, LogIn, Menu, Search, Ticket, User, X, Home, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// ──────────────────────────────────────────────
// Mock authentication state – replace with real auth
// ──────────────────────────────────────────────
const useAuth = () => ({
  isAuthenticated: true,
  user: {
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    notifications: 2,
    upcomingEvents: 1,
  },
})

// ──────────────────────────────────────────────
// Navbar component
// ──────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white border-b border-teal-100 shadow-sm" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto h-16 px-4 flex items-center justify-between">
        {/* ───────── Logo ───────── */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-500 text-white">
            <Ticket className="w-5 h-5" />
          </div>
          <span className="font-semibold text-xl text-teal-600">EventTix</span>
        </Link>

        {/* ───────── Desktop Navigation ───────── */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Home */}
          <Link
            href="/"
            className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-teal-600 ${
              pathname === "/" ? "text-teal-600" : "text-gray-600"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          {/* Events */}
          <Link
            href="/events"
            className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-teal-600 ${
              pathname === "/events" || pathname?.startsWith("/events/") ? "text-teal-600" : "text-gray-600"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Events</span>
          </Link>

          {/* My Tickets */}
          {isAuthenticated && (
            <Link
              href="/mytickets"
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-teal-600 ${
                pathname === "/mytickets" ? "text-teal-600" : "text-gray-600"
              }`}
            >
              <Ticket className="h-4 w-4" />
              <span>My Tickets</span>
            </Link>
          )}
        </nav>

        {/* ───────── Actions (right side) ───────── */}
        <div className="flex items-center gap-2">
          {/* Search (desktop) */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              className="w-[200px] lg:w-[300px] pl-9 h-9 rounded-full border-teal-100 focus-visible:ring-teal-500"
            />
          </div>

          {/* Search button (mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-600 hover:text-teal-600"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Search panel (mobile) */}
          {isSearchOpen && (
            <div className="absolute inset-x-0 top-16 z-50 bg-white p-4 shadow-md border-t border-teal-100 md:hidden">
              <div className="flex items-center">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  className="w-full pl-9 border-teal-100 focus-visible:ring-teal-500"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-gray-500"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── User‑specific actions ── */}
          {isAuthenticated ? (
            <>
              {/* Favorites */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                asChild
              >
                <Link href="/account/favorites">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Favorites</span>
                </Link>
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                  >
                    <Bell className="h-5 w-5" />
                    {user.notifications > 0 && (
                      <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-[10px] font-medium text-white">
                        {user.notifications}
                      </span>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <Link href="/notifications" className="text-xs text-teal-600 hover:text-teal-700">
                      View all
                    </Link>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    <div className="p-3 hover:bg-teal-50 cursor-pointer">
                      <p className="text-sm font-medium">Your ticket for Tech Conference is ready</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                    <div className="p-3 hover:bg-teal-50 cursor-pointer">
                      <p className="text-sm font-medium">Price drop for Summer Music Festival</p>
                      <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-teal-100 text-teal-700">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-teal-100 text-teal-700">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/organizer/dashboard" className="flex items-center cursor-pointer">
                      <List className="mr-2 h-4 w-4" />
                      <span>Go to Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mytickets" className="flex items-center cursor-pointer">
                      <Ticket className="mr-2 h-4 w-4" />
                      <span>My Tickets</span>
                      {user.upcomingEvents > 0 && (
                        <Badge className="ml-auto bg-teal-500 hover:bg-teal-600">{user.upcomingEvents}</Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/favorites" className="flex items-center cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Saved Events</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4 rotate-180" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" className="text-gray-700 hover:bg-teal-50 hover:text-teal-700" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-teal-500 text-white hover:bg-teal-600" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}

          {/* ───────── Mobile Menu Sheet ───────── */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-600 hover:text-teal-600">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                {/* ── Sheet header ── */}
                <div className="border-b border-teal-100 p-4">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-teal-100 text-teal-700">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="font-medium text-gray-900">Welcome to EventTix</p>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-teal-500 text-white hover:bg-teal-600" asChild>
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button className="flex-1" variant="outline" asChild>
                          <Link href="/register">Register</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Sheet links ── */}
                <div className="flex-1 overflow-auto py-4">
                  <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase">Navigation</div>

                  {/* Home */}
                  <Link
                    href="/"
                    className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 ${
                      pathname === "/" ? "bg-teal-50 text-teal-700" : ""
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>

                  {/* Events */}
                  <Link
                    href="/events"
                    className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 ${
                      pathname === "/events" ? "bg-teal-50 text-teal-700" : ""
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Events</span>
                  </Link>

                  {isAuthenticated && (
                    <>
                      <div className="mt-4 px-4 py-1 text-xs font-semibold text-gray-500 uppercase">Your Account</div>

                      <Link
                        href="/account"
                        className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 ${
                          pathname === "/account" ? "bg-teal-50 text-teal-700" : ""
                        }`}
                      >
                        <User className="h-4 w-4" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        href="/organizer/dashboard"
                        className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 ${
                          pathname === "/organizer/dashboard" ? "bg-teal-50 text-teal-700" : ""
                        }`}
                      >
                        <List className="h-4 w-4" />
                        <span>Go to Dashboard</span>
                      </Link>

                      <Link
                        href="/mytickets"
                        className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 ${
                          pathname === "/mytickets" ? "bg-teal-50 text-teal-700" : ""
                        }`}
                      >
                        <Ticket className="h-4 w-4" />
                        <span>My Tickets</span>
                        {user.upcomingEvents > 0 && (
                          <Badge className="ml-auto bg-teal-500 hover:bg-teal-600">{user.upcomingEvents}</Badge>
                        )}
                      </Link>

                      <Link
                        href="/account/favorites"
                        className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 ${
                          pathname === "/account/favorites" ? "bg-teal-50 text-teal-700" : ""
                        }`}
                      >
                        <Heart className="h-4 w-4" />
                        <span>Saved Events</span>
                      </Link>

                      <Link
                        href="/notifications"
                        className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700 ${
                          pathname === "/notifications" ? "bg-teal-50 text-teal-700" : ""
                        }`}
                      >
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                        {user.notifications > 0 && (
                          <Badge className="ml-auto bg-teal-500 hover:bg-teal-600">{user.notifications}</Badge>
                        )}
                      </Link>
                    </>
                  )}
                </div>

                {/* ── Sheet footer ── */}
                {isAuthenticated && (
                  <div className="border-t border-teal-100 p-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                    >
                      <LogIn className="mr-2 h-5 w-5 rotate-180" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
