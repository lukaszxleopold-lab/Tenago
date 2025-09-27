"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.session.user.id)
        .single();

      if (!error && profile?.role) {
        if (profile.role === "agent") {
          router.push("/dashboard/agent");
        } else {
          router.push("/dashboard/lokator");
        }
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

  return null; // szybkie przekierowanie
}
