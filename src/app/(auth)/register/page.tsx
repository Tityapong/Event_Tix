// "use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// export default function RegisterPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const [isLoading, setIsLoading] = useState(false)
//   const [accountType, setAccountType] = useState(searchParams.get("type") || "user")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // Simulate registration - in a real app, this would call an API
//     setTimeout(() => {
//       setIsLoading(false)
//       router.push(accountType === "organizer" ? "/organizer/dashboard" : "/dashboard")
//     }, 1000)
//   }

//   return (
//     <div className="container mx-auto flex h-screen items-center justify-center">
//       <Card className="mx-auto w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
//           <CardDescription>Enter your information to create your account</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input id="name" placeholder="John Doe" required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" placeholder="your@email.com" required />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input id="password" type="password" required />
//             </div>
//             <div className="space-y-2">
//               <Label>Account Type</Label>
//               <RadioGroup defaultValue={accountType} onValueChange={setAccountType} className="flex flex-col space-y-1">
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="user" id="user" />
//                   <Label htmlFor="user" className="font-normal">
//                     User - I want to browse and buy tickets
//                   </Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="organizer" id="organizer" />
//                   <Label htmlFor="organizer" className="font-normal">
//                     Organizer - I want to create and manage events
//                   </Label>
//                 </div>
//               </RadioGroup>
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4">
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Creating account..." : "Register"}
//             </Button>
//             <div className="text-center text-sm">
//               Already have an account?{" "}
//               <Link href="/auth/login" className="text-purple-600 hover:underline">
//                 Login
//               </Link>
//             </div>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate registration - in a real app, this would call an API
    setTimeout(() => {
      setIsLoading(false)
      router.push("/login")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-teal-50 flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-2 pb-6">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                A
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-slate-800">Create Account</CardTitle>
            <CardDescription className="text-center text-slate-500">
              Fill in your details to register
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Your name" 
                    className="pl-10 bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="pl-10 bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-10 bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                    required 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-5 pt-6 pb-6">
              <Button 
                type="submit" 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-5 rounded-md transition-colors" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
              <div className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-teal-600 hover:text-teal-800 font-medium transition-colors">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}