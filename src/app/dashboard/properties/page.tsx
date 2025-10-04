"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  rent_amount: number | null;
  admin_fee: number | null;
  wifi_available: boolean;
  available_from: string | null;
  available_to: string | null;
  is_active: boolean;
}

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);

      // 🔑 Pobranie zalogowanego użytkownika
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Musisz być zalogowany, aby zobaczyć swoje nieruchomości.");
        setLoading(false);
        return;
      }

      // 🧱 Pobranie nieruchomości przypisanych do właściciela
      const { data, error } = await supabase
        .from("properties")
        .select(
          "id, name, address, city, rent_amount, admin_fee, wifi_available, available_from, available_to, is_active"
        )
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Błąd pobierania nieruchomości:", error);
        setError("Nie udało się pobrać listy nieruchomości.");
      } else {
        setProperties(data || []);
      }

      setLoading(false);
    };

    fetchProperties(); // ✅ wywołanie funkcji wewnątrz useEffect
  }, []); // ✅ zamknięcie useEffect

  // 🧭 Widok – loader, błąd, lista nieruchomości
  if (loading) return <p className="text-center mt-10 text-black">Ładowanie...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-medium">{error}</p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 text-black bg-white">
      <h1 className="text-2xl font-semibold mb-6">
        Moje nieruchomości ({properties.length})
      </h1>

      {properties.length === 0 ? (
        <p className="text-gray-600">
          Nie dodałeś jeszcze żadnej nieruchomości.
        </p>
      ) : (
        <div className="space-y-4">
          {properties.map((p) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    p.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {p.is_active ? "Aktywna" : "Nieaktywna"}
                </span>
              </div>

              <p className="text-sm text-gray-700 mt-1">
                📍 {p.address}, {p.city}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 text-sm">
                <p>💰 Czynsz: {p.rent_amount ? `${p.rent_amount} zł` : "—"}</p>
                <p>🏢 Admin: {p.admin_fee ? `${p.admin_fee} zł` : "—"}</p>
                <p>
                  🌐 Wi-Fi:{" "}
                  {p.wifi_available ? (
                    <span className="text-green-600">tak</span>
                  ) : (
                    <span className="text-gray-500">nie</span>
                  )}
                </p>
                <p>
                  📅 Dostępność:{" "}
                  {p.available_from
                    ? new Date(p.available_from).toLocaleDateString("pl-PL")
                    : "—"}
                </p>
                <p>
                  ⏳ Do:{" "}
                  {p.available_to
                    ? new Date(p.available_to).toLocaleDateString("pl-PL")
                    : "—"}
                </p>
              </div>

              {/* 🔗 Przyciski */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => router.push(`/chat?propertyId=${p.id}`)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  💬 Zobacz czat
                </button>

                <button
                  onClick={() => router.push(`/dashboard/property/${p.id}`)}
                  className="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  📄 Szczegóły
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
