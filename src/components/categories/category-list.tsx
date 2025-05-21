// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { toast } from "sonner"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Loader2, PlusIcon, Pencil, Trash2 } from "lucide-react"

// // Define the Category interface
// interface Category {
//   id: number
//   category_name: string
//   created_at: string
//   updated_at: string
//   eventCount?: number
// }

// // Create Category Modal Component
// function CreateCategoryModal({ onSuccess }: { onSuccess: (category: Category) => void }) {
//   const [open, setOpen] = useState(false)
//   const [categoryName, setCategoryName] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setIsLoading(true)

//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
//         category_name: categoryName,
//       })

//       const newCategory = response.data
//       toast.success("Category created", {
//         description: `"${newCategory.category_name}" has been created successfully.`,
//       })

//       onSuccess(newCategory)
//       setCategoryName("")
//       setOpen(false)
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response) {
//         setError(err.response.data.message || "Failed to create category")
//       } else {
//         setError("An unexpected error occurred. Please try again.")
//       }
//       console.error("Error creating category:", err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <PlusIcon className="mr-2 h-4 w-4" />
//           Create Category
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Create New Category</DialogTitle>
//             <DialogDescription>
//               Add a new category for organizing your events. Click save when you're done.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             {error && (
//               <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>
//             )}
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="category_name" className="text-right">
//                 Name
//               </Label>
//               <Input
//                 id="category_name"
//                 value={categoryName}
//                 onChange={(e) => setCategoryName(e.target.value)}
//                 className="col-span-3"
//                 placeholder="Enter category name"
//                 required
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isLoading || !categoryName.trim()}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Creating...
//                 </>
//               ) : (
//                 "Save"
//               )}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// // Edit Category Modal Component
// function EditCategoryModal({ data, onSuccess }: { data: Category; onSuccess: (category: Category) => void }) {
//   const [open, setOpen] = useState(false)
//   const [categoryName, setCategoryName] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")

//   useEffect(() => {
//     if (open) {
//       setCategoryName(data.category_name)
//     }
//   }, [open, data])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setIsLoading(true)

//     try {
//       const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/categories/${data.id}`, {
//         category_name: categoryName,
//       })

//       const updatedCategory = response.data
//       toast.success("Category updated", {
//         description: `"${updatedCategory.category_name}" has been updated successfully.`,
//       })

//       onSuccess(updatedCategory)
//       setOpen(false)
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response) {
//         setError(err.response.data.message || "Failed to update category")
//       } else {
//         setError("An unexpected error occurred. Please try again.")
//       }
//       console.error("Error updating category:", err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="icon">
//           <Pencil className="h-4 w-4" />
//           <span className="sr-only">Edit {data.category_name}</span>
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Edit Category</DialogTitle>
//             <DialogDescription>Update the category name. Click save when you're done.</DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             {error && (
//               <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>
//             )}
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="edit_category_name" className="text-right">
//                 Name
//               </Label>
//               <Input
//                 id="edit_category_name"
//                 value={categoryName}
//                 onChange={(e) => setCategoryName(e.target.value)}
//                 className="col-span-3"
//                 placeholder="Enter category name"
//                 required
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isLoading || !categoryName.trim()}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Updating...
//                 </>
//               ) : (
//                 "Save Changes"
//               )}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// // Delete Category Modal Component
// function DeleteCategoryModal({ data, onSuccess }: { data: Category; onSuccess: (id: number) => void }) {
//   const [open, setOpen] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")

//   const handleDelete = async () => {
//     setError("")
//     setIsLoading(true)

//     try {
//       await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${data.id}`)

//       toast.success("Category deleted", {
//         description: `"${data.category_name}" has been deleted successfully.`,
//       })

//       onSuccess(data.id)
//       setOpen(false)
//     } catch (err) {
//       if (axios.isAxiosError(err) && err.response) {
//         setError(err.response.data.message || "Failed to delete category")
//       } else {
//         setError("An unexpected error occurred. Please try again.")
//       }
//       console.error("Error deleting category:", err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
//           <Trash2 className="h-4 w-4" />
//           <span className="sr-only">Delete {data.category_name}</span>
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Delete Category</DialogTitle>
//           <DialogDescription>
//             Are you sure you want to delete "{data.category_name}"? This action cannot be undone.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="py-4">
//           {error && <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}
//           <p className="text-sm text-gray-500">
//             Deleting this category will remove it from all associated events. Events will not be deleted.
//           </p>
//         </div>
//         <DialogFooter>
//           <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
//             Cancel
//           </Button>
//           <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Deleting...
//               </>
//             ) : (
//               "Delete Category"
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// // Main Category List Component
// // export function CategoryList() {
// //   const [categories, setCategories] = useState<Category[]>([])
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [error, setError] = useState("")

// //   const fetchCategories = async () => {
// //     setIsLoading(true)
// //     setError("")

// //     try {
// //       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
// //       setCategories(response.data)
// //     } catch (err) {
// //       console.error("Error fetching categories:", err)
// //       setError("Failed to load categories. Please try again.")
// //       toast.error("Error", {
// //         description: "Failed to load categories. Please try again.",
// //       })
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchCategories()
// //   }, [])

// //   const handleCategoryCreated = (newCategory: Category) => {
// //     const categoryWithCount = { ...newCategory, eventCount: 0 }
// //     setCategories((prev) => [...prev, categoryWithCount])
// //   }

// //   const handleCategoryUpdated = (updatedCategory: Category) => {
// //     setCategories((prev) =>
// //       prev.map((category) => {
// //         if (category.id === updatedCategory.id) {
// //           return { ...updatedCategory, eventCount: category.eventCount }
// //         }
// //         return category
// //       }),
// //     )
// //   }

// //   const handleCategoryDeleted = (categoryId: number) => {
// //     setCategories((prev) => prev.filter((category) => category.id !== categoryId))
// //   }

// //   if (isLoading) {
// //     return (
// //       <div className="flex justify-center items-center py-12">
// //         <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
// //       </div>
// //     )
// //   }

// //   if (error) {
// //     return (
// //       <Card>
// //         <CardContent className="flex flex-col items-center justify-center py-8 text-center">
// //           <p className="mb-4 text-red-500">{error}</p>
// //           <Button onClick={fetchCategories}>Try Again</Button>
// //         </CardContent>
// //       </Card>
// //     )
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center justify-between">
// //         <h2 className="text-xl font-semibold">Your Categories</h2>
// //         <CreateCategoryModal onSuccess={handleCategoryCreated} />
// //       </div>

// //       {categories.length > 0 ? (
// //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// //           {categories.map((category) => (
// //             <Card key={category.id}>
// //               <CardHeader>
// //                 <CardTitle>{category.category_name}</CardTitle>
// //                 <CardDescription>{category.eventCount || 0} events</CardDescription>
// //               </CardHeader>
// //               <CardFooter className="flex justify-end">
// //                 <div className="flex space-x-2">
// //                   <EditCategoryModal data={category} onSuccess={handleCategoryUpdated} />
// //                   <DeleteCategoryModal data={category} onSuccess={handleCategoryDeleted} />
// //                 </div>
// //               </CardFooter>
// //             </Card>
// //           ))}
// //         </div>
// //       ) : (
// //         <Card>
// //           <CardContent className="flex flex-col items-center justify-center py-8 text-center">
// //             <p className="mb-4 text-gray-500">You have not created any categories yet</p>
// //             <CreateCategoryModal onSuccess={handleCategoryCreated} />
// //           </CardContent>
// //         </Card>
// //       )}
// //     </div>
// //   )
// // }
// // Main Category List Component
// export function CategoryList() {
//     const [categories, setCategories] = useState<Category[]>([])
//     const [isLoading, setIsLoading] = useState(true)
//     const [error, setError] = useState("")
  
//     const fetchCategories = async () => {
//       setIsLoading(true)
//       setError("")
  
//       try {
//         const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
//         setCategories(response.data)
//       } catch (err) {
//         console.error("Error fetching categories:", err)
//         setError("Failed to load categories. Please try again.")
//         toast.error("Error", {
//           description: "Failed to load categories. Please try again.",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }
  
//     useEffect(() => {
//       fetchCategories()
//     }, [])
  
//     const handleCategoryCreated = (newCategory: Category) => {
//       const categoryWithCount = { ...newCategory, eventCount: 0 }
//       setCategories((prev) => [...prev, categoryWithCount])
//     }
  
//     const handleCategoryUpdated = (updatedCategory: Category) => {
//       setCategories((prev) =>
//         prev.map((category) => {
//           if (category.id === updatedCategory.id) {
//             return { ...updatedCategory, eventCount: category.eventCount }
//           }
//           return category
//         }),
//       )
//     }
  
//     const handleCategoryDeleted = (categoryId: number) => {
//       setCategories((prev) => prev.filter((category) => category.id !== categoryId))
//     }
  
//     if (isLoading) {
//       return (
//         <div className="flex justify-center items-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
//         </div>
//       )
//     }
  
//     if (error) {
//       return (
//         <Card>
//           <CardContent className="flex flex-col items-center justify-center py-8 text-center">
//             <p className="mb-4 text-red-500">{error}</p>
//             <Button onClick={fetchCategories}>Try Again</Button>
//           </CardContent>
//         </Card>
//       )
//     }
  
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-xl font-semibold">Your Categories</h2>
//           <CreateCategoryModal onSuccess={handleCategoryCreated} />
//         </div>
  
//         {categories.length > 0 ? (
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {categories.map((category) => (
//               <Card key={category.id}>
//                 <CardHeader>
//                   <CardTitle>{category.category_name}</CardTitle>
//                   <CardDescription>{category.eventCount || 0} events</CardDescription>
//                 </CardHeader>
//                 <CardFooter className="flex justify-end">
//                   <div className="flex space-x-2">
//                     <EditCategoryModal data={category} onSuccess={handleCategoryUpdated} />
//                     <DeleteCategoryModal data={category} onSuccess={handleCategoryDeleted} />
//                   </div>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <Card>
//             <CardContent className="flex flex-col items-center justify-center py-8 text-center">
//               <p className="mb-4 text-gray-500">No category results</p>
//               <CreateCategoryModal onSuccess={handleCategoryCreated} />
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     )
//   }


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, PlusIcon, Pencil, Trash2 } from "lucide-react"
import { getAuthToken, AUTH_CHANGE_EVENT } from "@/lib/auth"

// Define the Category interface
interface Category {
  id: number
  category_name: string
  created_at: string
  updated_at: string
  eventCount?: number
}

// Create Category Modal Component
function CreateCategoryModal({ onSuccess }: { onSuccess: (category: Category) => void }) {
  const [open, setOpen] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const token = getAuthToken()
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        {
          category_name: categoryName,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      )

      const newCategory = response.data
      toast.success("Category created", {
        description: `"${newCategory.category_name}" has been created successfully.`,
      })

      onSuccess(newCategory)
      setCategoryName("")
      setOpen(false)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to create category")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
      console.error("Error creating category:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category for organizing your events. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category_name" className="text-right">
                Name
              </Label>
              <Input
                id="category_name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="col-span-3"
                placeholder="Enter category name"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !categoryName.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Edit Category Modal Component
function EditCategoryModal({ data, onSuccess }: { data: Category; onSuccess: (category: Category) => void }) {
  const [open, setOpen] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setCategoryName(data.category_name)
    }
  }, [open, data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const token = getAuthToken()
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${data.id}`,
        {
          category_name: categoryName,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      )

      const updatedCategory = response.data
      toast.success("Category updated", {
        description: `"${updatedCategory.category_name}" has been updated successfully.`,
      })

      onSuccess(updatedCategory)
      setOpen(false)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to update category")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
      console.error("Error updating category:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit {data.category_name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category name. Click save when you are done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit_category_name" className="text-right">
                Name
              </Label>
              <Input
                id="edit_category_name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="col-span-3"
                placeholder="Enter category name"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !categoryName.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Delete Category Modal Component
function DeleteCategoryModal({ data, onSuccess }: { data: Category; onSuccess: (id: number) => void }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setError("")
    setIsLoading(true)

    try {
      const token = getAuthToken()
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${data.id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })

      toast.success("Category deleted", {
        description: `"${data.category_name}" has been deleted successfully.`,
      })

      onSuccess(data.id)
      setOpen(false)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to delete category")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
      console.error("Error deleting category:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete {data.category_name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {data.category_name} This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {error && <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}
          <p className="text-sm text-gray-500">
            Deleting this category will remove it from all associated events. Events will not be deleted.
          </p>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Category"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Main Category List Component
export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchCategories = async () => {
    setIsLoading(true)
    setError("")

    try {
      const token = getAuthToken()
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
      setCategories(response.data)
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError("Failed to load categories. Please try again.")
      toast.error("Error", {
        description: "Failed to load categories. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchCategories()

    // Listen for auth state changes
    const handleAuthChange = () => {
      fetchCategories()
    }

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange)

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
    }
  }, [])

  const handleCategoryCreated = (newCategory: Category) => {
    const categoryWithCount = { ...newCategory, eventCount: 0 }
    setCategories((prev) => [...prev, categoryWithCount])
  }

  const handleCategoryUpdated = (updatedCategory: Category) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === updatedCategory.id) {
          return { ...updatedCategory, eventCount: category.eventCount }
        }
        return category
      }),
    )
  }

  const handleCategoryDeleted = (categoryId: number) => {
    setCategories((prev) => prev.filter((category) => category.id !== categoryId))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <Button onClick={fetchCategories}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Categories</h2>
        <CreateCategoryModal onSuccess={handleCategoryCreated} />
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.category_name}</CardTitle>
                <CardDescription>{category.eventCount || 0} events</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-end">
                <div className="flex space-x-2">
                  <EditCategoryModal data={category} onSuccess={handleCategoryUpdated} />
                  <DeleteCategoryModal data={category} onSuccess={handleCategoryDeleted} />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-4 text-gray-500">No category results</p>
            <CreateCategoryModal onSuccess={handleCategoryCreated} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
