"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function HomeClient() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("🔎 Test Supabase:", { data, error });
    };

    testConnection();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Hello Tenago 🚀</h1>
    </main>
  );
}
