



// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { motion } from "framer-motion"
// import { User, Mail, Lock, Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export default function RegisterPage() {
//   const router = useRouter()
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // Simulate registration - in a real app, this would call an API
//     setTimeout(() => {
//       setIsLoading(false)
//       router.push("/login")
//     }, 1000)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-teal-50 flex items-center justify-center p-4 sm:p-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
//         <Card className="border-none shadow-lg">
//           <CardHeader className="space-y-2 pb-6">
//             <div className="flex justify-center mb-2">
//               <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center text-white text-2xl font-bold">
//                 A
//               </div>
//             </div>
//             <CardTitle className="text-2xl font-bold text-center text-slate-800">Create Account</CardTitle>
//             <CardDescription className="text-center text-slate-500">
//               Fill in your details to register
//             </CardDescription>
//           </CardHeader>
//           <form onSubmit={handleSubmit}>
//             <CardContent className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="name" className="text-sm font-medium text-slate-700">
//                   Name
//                 </Label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input 
//                     id="name" 
//                     type="text" 
//                     placeholder="Your name" 
//                     className="pl-10 bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
//                     required 
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-sm font-medium text-slate-700">
//                   Email
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input 
//                     id="email" 
//                     type="email" 
//                     placeholder="your@email.com" 
//                     className="pl-10 bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
//                     required 
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-sm font-medium text-slate-700">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
//                   <Input 
//                     id="password" 
//                     type="password" 
//                     className="pl-10 bg-slate-50 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
//                     required 
//                   />
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex flex-col space-y-5 pt-6 pb-6">
//               <Button 
//                 type="submit" 
//                 className="w-full bg-teal-600 hover:bg-teal-700 text-white py-5 rounded-md transition-colors" 
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <span className="flex items-center justify-center">
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating account...
//                   </span>
//                 ) : (
//                   "Register"
//                 )}
//               </Button>
//               <div className="text-center text-sm text-slate-500">
//                 Already have an account?{" "}
//                 <Link href="/login" className="text-teal-600 hover:text-teal-800 font-medium transition-colors">
//                   Sign in
//                 </Link>
//               </div>
//             </CardFooter>
//           </form>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }


"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Make direct API call to your backend
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        name,
        email,
        password,
      })

      // Show success message with sonner toast
      toast.success("Registration successful", {
        description: "Your account has been created. Please log in.",
      })

      // Redirect to login page
      router.push("/login")
    } catch (err) {
      // Handle error
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Registration failed. Please try again.")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
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
            <CardDescription className="text-center text-slate-500">Fill in your details to register</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>
              )}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
