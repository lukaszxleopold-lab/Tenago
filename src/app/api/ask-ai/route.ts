import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // potrzebny do zapisu z backendu
);

export async function POST(req: Request) {
  try {
    const { userId, message } = await req.json();

    // 🧩 Walidacja — brak wiadomości
    if (!message || message.trim() === "") {
      return NextResponse.json({
        reply: "Wpisz wiadomość, aby rozpocząć rozmowę.",
      });
    }

    // 1️⃣ Zapis wiadomości użytkownika
    await supabase.from("messages").insert({
      user_id: userId,
      role: "user",
      content: message,
    });

    // 2️⃣ Wygenerowanie odpowiedzi AI (z wymuszeniem języka polskiego)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Jesteś asystentem Tenago. Zawsze odpowiadasz po polsku, niezależnie od języka użytkownika.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message?.content ?? "Brak odpowiedzi.";

    // 3️⃣ Zapis odpowiedzi AI
    await supabase.from("messages").insert({
      user_id: userId,
      role: "assistant",
      content: reply,
    });

    // 4️⃣ Odesłanie odpowiedzi do frontendu
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("❌ Błąd:", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
