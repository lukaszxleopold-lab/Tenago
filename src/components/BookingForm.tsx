"use client";

import { useState } from "react";

interface BookingFormProps {
  propertyId: string;
  tenantId: string;
}

export default function BookingForm({ propertyId, tenantId }: BookingFormProps) {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, tenantId, date }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Rezerwacja wysłana!");
      } else {
        setMessage(`❌ Błąd: ${data.error || "Nie udało się zapisać rezerwacji."}`);
      }
    } catch (err) {
      setMessage("❌ Błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 border rounded-xl space-y-4 bg-white shadow">
      <h2 className="text-lg font-semibold">Zarezerwuj wizytę</h2>

      <label className="block text-sm font-medium">
        Data i godzina wizyty:
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mt-1 border p-2 rounded-md"
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Wysyłanie..." : "Zarezerwuj termin"}
      </button>

      {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
    </form>
  );
}
