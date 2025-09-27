"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"lokator" | "agent">("lokator");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async () => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setErrorMsg(authError.message);
      return;
    }

    if (authData.user) {
      // insert lub update roli
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: authData.user.id, role }, { onConflict: "id" });

      console.log("Nowy user:", authData.user);
      console.log("Wybrana rola:", role);

      if (profileError) {
        setErrorMsg("Błąd przy zapisie roli: " + profileError.message);
        return;
      }

      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Rejestracja</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-black"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-black"
        />

        {/* wybór roli */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-800 font-semibold">
            Wybierz rolę:
          </label>
          <div className="flex gap-6">
            <label className="flex items-center text-gray-800 font-medium">
              <input
                type="radio"
                value="lokator"
                checked={role === "lokator"}
                onChange={() => setRole("lokator")}
                className="mr-2"
              />
              Lokator 🏡
            </label>
            <label className="flex items-center text-gray-800 font-medium">
              <input
                type="radio"
                value="agent"
                checked={role === "agent"}
                onChange={() => setRole("agent")}
                className="mr-2"
              />
              Agent 🏠
            </label>
          </div>
        </div>

        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Zarejestruj się
        </button>
      </div>
    </div>
  );
}
