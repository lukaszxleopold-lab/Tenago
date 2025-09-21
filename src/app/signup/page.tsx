"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
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
  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-black"
/>
<input
  type="password"
  placeholder="Hasło"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 text-black"
/>


        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
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
