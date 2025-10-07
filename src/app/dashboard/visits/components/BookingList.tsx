"use client";

import { useEffect, useState } from "react";
import { getBookingsByRole } from "@/lib/getBookings";   // ✅ ważny import
import { supabase } from "@/lib/supabaseClient";
import { Booking } from "@/types/booking";
import BookingCard from "./BookingCard";

export default function BookingList({ role }: { role: "tenant" | "owner" }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const data = await getBookingsByRole(user.id, role); // ✅ użycie helpera
      setBookings(data);
      setLoading(false);
    };
    fetchBookings();
  }, [role]);

  if (loading) return <p>Ładowanie rezerwacji...</p>;
  if (bookings.length === 0) return <p>Brak rezerwacji do wyświetlenia.</p>;

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <BookingCard key={b.id} booking={b} />
      ))}
    </div>
  );
}
