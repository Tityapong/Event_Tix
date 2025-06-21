"use client"

import Link from "next/link"
import { Ticket, CheckCircle, Sparkles, ArrowRight } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-50 to-cyan-50 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Success Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50 transform hover:scale-[1.02] transition-all duration-500">
            {/* Success Icon with Animation */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 shadow-lg shadow-green-200">
                  <CheckCircle className="h-12 w-12 text-white animate-bounce" />
                </div>
              </div>

              <div className="space-y-3 animate-fade-in-up">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    Success!
                  </h1>
                  <Sparkles className="h-7 w-7 text-green-500 animate-pulse" />
                </div>
                <p className="text-gray-600 text-xl font-medium">Your ticket purchase was completed</p>
                <p className="text-gray-500 text-sm">Check your email for confirmation details</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 animate-fade-in-up delay-300">
              <Link
                href="/mytickets"
                className="group block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-white py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-green-200/50 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-3">
                  <Ticket className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-semibold text-lg">View Your Tickets</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>

              <Link
                href="/"
                className="group block w-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-gray-700 py-3 px-6 rounded-2xl border border-gray-200 hover:border-gray-300 transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="font-medium">Back to Home</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            </div>
          </div>

          {/* Additional floating elements */}
          <div className="mt-8 text-center animate-fade-in-up delay-500">
            <p className="text-gray-400 text-sm">
              Need help?{" "}
              <Link href="/support" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  )
}
