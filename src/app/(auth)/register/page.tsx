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


export default function RegisterPage() {
    return (
        <div>
            <h1>Register Page</h1>
        </div>
    )
}