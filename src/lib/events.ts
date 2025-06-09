import axios from 'axios';
import { getAuthToken } from "@/lib/auth";

// Define interfaces for the API response
export interface Ticket {
  id: number; 
  name: string;
  price: number;
  discount: number;
  quantity_available: number;
  description: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  organizer: string;
  description: string;
  tickets: Ticket[];
  category: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchEvents(): Promise<Event[]> {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get<Event[]>(`${API_URL}/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}


export async function deleteEvent(eventId: string): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      await axios.delete(`${API_URL}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  }
