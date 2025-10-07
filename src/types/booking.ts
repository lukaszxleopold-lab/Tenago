export type BookingStatus = "pending" | "accepted" | "rejected";

export interface Booking {
  id: string;
  property_id: string;
  tenant_id: string;
  owner_id: string;
  date: string; // ISO string (np. "2025-10-08T14:00:00Z")
  status: BookingStatus;
  property_name?: string; // dodawane joinem z Property
  created_at: string;
}
