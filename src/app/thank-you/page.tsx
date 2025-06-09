import Link from "next/link"
import {  Ticket, CheckCircle, Sparkles } from "lucide-react"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Success Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Success Icon with Animation */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-teal-400/20 rounded-full animate-ping"></div>
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 shadow-lg">
                  <CheckCircle className="h-10 w-10 text-white animate-bounce" />
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                    Success!
                  </h1>
                  <Sparkles className="h-6 w-6 text-teal-400 animate-pulse" />
                </div>
                <p className="text-white/80 text-lg">Your ticket purchase was completed</p>
                <p className="text-teal-300/70 text-sm">Check your email for confirmation details</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 mb-8">
              <Link 
                href="/mytickets" 
                className="group block w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 text-white py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <div className="flex items-center justify-center gap-3">
                  <Ticket className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-semibold">View Your Tickets</span>
                </div>
              </Link>

           
            </div>

            {/* Event Details Preview */}
        
          </div>

          {/* Additional Info */}
     
        </div>
      </div>
    </div>
  )
}