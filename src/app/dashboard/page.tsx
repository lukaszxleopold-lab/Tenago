"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
      } else {
        setUser(data.session.user);
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-purple-600">
        {user ? `Witaj, ${user.email}` : "Ładowanie..."}
      </h1>
    </div>
  );
}

