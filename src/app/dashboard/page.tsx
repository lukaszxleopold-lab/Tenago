"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
        return;
      }

      setUser(data.session.user);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();

      console.log("Profile data:", profile);
      console.log("Profile error:", error);

      if (!error && profile) {
        setRole(profile.role);
      }

      setLoading(false);
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Ładowanie...</p>
      </div>
    );
  }

  if (!user) {
    return null; // szybkie przekierowanie
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-2xl font-bold mb-4 text-purple-600">
          Witaj, {user.email}
        </h1>

        {role === "agent" && (
          <p className="text-lg text-gray-800">
            To jest <span className="font-semibold">Dashboard Agenta</span> 🏠
          </p>
        )}

        {role === "lokator" && (
          <p className="text-lg text-gray-800">
            To jest <span className="font-semibold">Dashboard Lokatora</span> 🏡
          </p>
        )}

        {!role && (
          <p className="text-lg text-red-500">
            Nie udało się pobrać roli użytkownika.
          </p>
        )}
      </div>
    </div>
  );
}
