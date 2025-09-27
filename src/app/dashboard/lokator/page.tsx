"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LokatorDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "lokator") {
        router.push("/dashboard/agent");
      } else {
        setLoading(false);
      }
    };

    checkRole();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          Dashboard Lokatora 🏡
        </h1>
        <p className="mb-4">Zalogowany jako: {email}</p>

        <h2 className="text-lg font-semibold mb-2">Dostępne mieszkania:</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Pokój w Warszawie – ul. Piękna 12</li>
          <li>Mieszkanie w Gdańsku – ul. Długa 20</li>
        </ul>
      </div>
    </div>
  );
}
