import { supabase } from "@/lib/supabaseClient";
import { Booking } from "@/types/booking";

// Funkcja pomocnicza – pobiera rezerwacje z Supabase
export async function getBookingsByRole(userId: string, role: "tenant" | "owner") {
  const column = role === "tenant" ? "tenant_id" : "owner_id";

  const { data, error } = await supabase
    .from("bookings")
    .select("*, properties(name)") // pobiera rezerwacje + nazwę nieruchomości
    .eq(column, userId)
    .order("date", { ascending: true });

  if (error) throw error;

  // Dodaj nazwę nieruchomości (z relacji)
  return (data ?? []).map((b: any) => ({
    ...b,
    property_name: b.properties?.name || "Nieruchomość",
  })) as Booking[];
}
