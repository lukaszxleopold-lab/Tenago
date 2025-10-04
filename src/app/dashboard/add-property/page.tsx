"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddPropertyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postal_code: "",
    rent_amount: "",
    admin_fee: "",
    average_utilities_cost: "",
    deposit_amount: "",
    utilities_included: false,
    utilities_on_tenant: false,
    wifi_available: false,
    available_from: "",
    available_to: "",
    min_rent_period: "",
    max_rent_period: "",
    pets_allowed: false,
    smoking_allowed: false,
    furnished: false,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🔑 Pobierz aktualnego użytkownika (właściciela)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      console.error("Brak aktywnego użytkownika:", userError);
      setSuccessMsg("❌ Musisz być zalogowany, aby dodać nieruchomość.");
      return;
    }

    // 🏠 Zapisz nieruchomość z przypisaniem owner_id
    const { error } = await supabase.from("properties").insert([
      {
        owner_id: user.id, // automatyczne przypisanie właściciela
        name: formData.name,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        rent_amount: Number(formData.rent_amount),
        admin_fee: Number(formData.admin_fee),
        average_utilities_cost: Number(formData.average_utilities_cost),
        deposit_amount: Number(formData.deposit_amount),
        utilities_included: formData.utilities_included,
        utilities_on_tenant: formData.utilities_on_tenant,
        wifi_available: formData.wifi_available,
        available_from: formData.available_from,
        available_to: formData.available_to,
        min_rent_period: formData.min_rent_period,
        max_rent_period: formData.max_rent_period,
        pets_allowed: formData.pets_allowed,
        smoking_allowed: formData.smoking_allowed,
        furnished: formData.furnished,
        description: formData.description,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("❌ Błąd przy zapisie:", error);
      setSuccessMsg("❌ Wystąpił błąd przy dodawaniu nieruchomości.");
    } else {
      setSuccessMsg("✅ Nieruchomość została dodana pomyślnie!");
      setFormData({
        name: "",
        address: "",
        city: "",
        postal_code: "",
        rent_amount: "",
        admin_fee: "",
        average_utilities_cost: "",
        deposit_amount: "",
        utilities_included: false,
        utilities_on_tenant: false,
        wifi_available: false,
        available_from: "",
        available_to: "",
        min_rent_period: "",
        max_rent_period: "",
        pets_allowed: false,
        smoking_allowed: false,
        furnished: false,
        description: "",
      });
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-black">
      <h1 className="text-2xl font-semibold mb-6 text-black">
        Dodaj nową nieruchomość
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        {/* --- pola formularza --- */}
        {/* (pozostają identyczne jak w poprzedniej wersji) */}

        {/* Przycisk zapisu */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded p-2 w-full hover:bg-gray-800 transition"
        >
          {loading ? "Zapisywanie..." : "Zapisz nieruchomość"}
        </button>
      </form>

      {successMsg && (
        <p className="mt-4 text-center text-sm text-black">{successMsg}</p>
      )}
    </div>
  );
}
