

import axios from "axios"

// Set the base URL for all API requests
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

// Custom event for auth state changes
export const AUTH_CHANGE_EVENT = "auth_state_changed"

// Define User type
export interface User {
  name: string
  email: string
  id?: string
  role?: string
  created_at?: string
}

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  return !!token
}

// Function to get the current user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

// Function to get the auth token
export const getAuthToken = () => {
  return localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
}

// Function to set user data after login
export const setUserData = (user: User, token: string, rememberMe: boolean) => {
  if (rememberMe) {
    localStorage.setItem("authToken", token)
    localStorage.setItem("user", JSON.stringify(user))
  } else {
    sessionStorage.setItem("authToken", token)
    sessionStorage.setItem("user", JSON.stringify(user))
  }

  // Set default Authorization header for future requests
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

  // Dispatch custom event to notify components about auth change
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  }
}

// Function to logout
export const logout = () => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("user")
  sessionStorage.removeItem("authToken")
  sessionStorage.removeItem("user")
  delete axios.defaults.headers.common["Authorization"]

  // Dispatch custom event to notify components about auth change
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
  }
}

// Setup axios interceptor to handle 401 errors (token expired)
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       logout()
//       window.location.href = "/login"
//     }
//     return Promise.reject(error)
//   },
// )

// Function to initialize auth from stored data
export const initAuth = () => {
  const token = getAuthToken()
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  }
}
