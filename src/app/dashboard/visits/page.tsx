"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BookingList from "./components/BookingList";

export default function VisitsPage() {
  const [role, setRole] = useState<"tenant" | "owner">("tenant");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "owner") {
        setRole("owner");
      } else {
        setRole("tenant");
      }

      setLoading(false);
    };

    fetchUserRole();
  }, []);

  if (loading) return <p>Ładowanie danych użytkownika...</p>;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">📅 Twoje rezerwacje</h1>
      <BookingList role={role} />
    </div>
  );
}
