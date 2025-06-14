

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

export async function scanQRCode(qrCode: string): Promise<{ message: string; order_id?: number }> {
  const token = getAuthToken();
  try {
    const response = await axios.post(
      '/scan',
      { qr_code: qrCode }, // Send the full decoded QR string
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(JSON.stringify(error.response.data));
    }
    throw new Error("Failed to scan QR code");
  }
}