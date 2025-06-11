// // lib/order.ts
// import api from "./api";
// import { getAuthToken } from "./auth";

// export interface OrderPayload {
//   user_id: number;
//   ticket_type_id: number;
//   order_status?: "Cart" | "Confirmed" | "Paid" | "Cancelled";
//   payment_status?: "Pending" | "Paid" | "Failed";
//   quantity: number;
//   price_at_purchase: number;
//   total_amount: number;
//   purchased_at?: string;
//   qr_code?: string | null;
//   is_scanned?: boolean;
// }

// export async function createOrder(
//   payload: OrderPayload
// ): Promise<OrderPayload & { id: number }> {
//   const token = getAuthToken();
//   if (!token) throw new Error("No auth token found; please log in.");

//   try {
//     // <-- include "/api" here
//     const response = await api.post("/api/orders", payload, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (err: any) {
//     if (err.response?.data?.errors) {
//       throw new Error(JSON.stringify(err.response.data.errors));
//     }
//     throw new Error(err.message || "Order creation failed");
//   }
// }



// src/lib/order.ts
import axios, { AxiosError } from "axios";
import { getAuthToken } from "@/lib/auth";


export interface OrderPayload {
  user_id: number;
  ticket_type_id: number; // Changed to match backend expectation
  order_status: string;
  payment_status: string;
  quantity: number;
  price_at_purchase: number;
  total_amount: number;
}

export interface OrderResponse {
  order_id: number;
  order_date: string;
  order_status: string;
  paymentStatus: string;
  quantity: number;
  unitPrice: string;
  total: string;
  ticketType: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventImage: string;
  qr_code: string;
  is_scanned: boolean;
}

export async function createOrder(payload: OrderPayload) {
  const token = getAuthToken();
  try {
    const response = await axios.post('/orders', payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw new Error("Failed to create order");
  }
}


export async function getOrders(): Promise<OrderResponse[]> {
  const token = getAuthToken();
  try {
    const response = await axios.get('/orders', {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("getOrders() fetched:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw new Error("Failed to fetch orders");
  }
}