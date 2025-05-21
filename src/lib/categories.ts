// lib/categories.ts
import axios from "axios";
import { getAuthToken } from "@/lib/auth";

// Define the Category interface
export interface Category {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
  eventCount?: number;
}

// Function to fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};