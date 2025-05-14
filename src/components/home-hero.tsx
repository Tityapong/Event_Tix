"use client"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

import Link from "next/link"

export default function HomeHero() {
  return (
    <div className="relative overflow-hidden">
      {/* Background with mask effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-teal-100 z-0">
        <div
          className="absolute inset-0 bg-white"
          style={{
            maskImage: "radial-gradient(circle at 70% 30%, transparent 0%, black 70%)",
            WebkitMaskImage: "radial-gradient(circle at 70% 30%, transparent 0%, black 70%)",
          }}
        ></div>
        <div
          className="absolute top-0 right-0 w-full h-full opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2316a3b8' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      <div className="container relative mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24 z-10">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8">
            <div className="inline-block rounded-full bg-cyan-100 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium text-cyan-800 mb-2">
              Welcome to EvenTix
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 tracking-tight">
              Streamlined <span className="text-cyan-600">Event Management</span> Solutions
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl">
              Simplify your event management experience with our secure, fast, and reliable platform. Built for businesses
              of all sizes, ensuring seamless planning and execution of your events.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/signup"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base text-center font-medium"
              >
                Get Started
              </Link>
              <Link
                href="/events"
                className="border border-cyan-600 text-cyan-600 hover:bg-cyan-50 px-4 py-2 sm:px-5 sm:py-3 rounded-lg text-sm sm:text-base text-center font-medium"
              >
                Browse to Event
              </Link>
            </div>
          </div>

          {/* Right Illustration with mask */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              {/* Decorative elements */}
              <div className="absolute -top-8 -left-8 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

              {/* Masked animation container */}
              <div className="relative">
                <div className="absolute inset-0 opacity-20"></div>
                <div className="relative rounded-3xl overflow-hidden">
                  <DotLottieReact
                    src="/service.lottie"
                    loop
                    autoplay
                    className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave mask */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-white"
        style={{
          maskImage:
            "url(\"data:image/svg+xml,%3Csvg width='1200' height='120' viewBox='0 0 1200 120' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0V46.29C47.79 22.2 103.59 20 158 20C250 20 352 40 433 59C515 78 583 88 644 88C687 88 724 83 748 80C772 77 810 67 848 48C886 29 919 2 919 2V0H0Z' fill='white'/%3E%3C/svg%3E\")",
          WebkitMaskImage:
            "url(\"data:image/svg+xml,%3Csvg width='1200' height='120' viewBox='0 0 1200 120' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0V46.29C47.79 22.2 103.59 20 158 20C250 20 352 40 433 59C515 78 583 88 644 88C687 88 724 83 748 80C772 77 810 67 848 48C886 29 919 2 919 2V0H0Z' fill='white'/%3E%3C/svg%3E\")",
          maskSize: "cover",
          WebkitMaskSize: "cover",
        }}
      ></div>
    </div>
  )
}