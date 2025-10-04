import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // tylko backend
);

export async function POST(req: Request) {
  try {
    const { userId, message, propertyId } = await req.json();

    // 🧩 Walidacja danych wejściowych
    if (!userId?.trim()) {
      return NextResponse.json(
        { error: "Brak identyfikatora użytkownika. Zaloguj się ponownie." },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json({
        reply: "Wpisz wiadomość, aby rozpocząć rozmowę.",
      });
    }

    // 🏠 1️⃣ Pobierz dane nieruchomości (jeśli istnieje propertyId)
    let propertyInfo = "";
    if (propertyId) {
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select(
          "name, address, city, rent_amount, admin_fee, wifi_available, available_from, available_to, is_active"
        )
        .eq("id", propertyId)
        .single();

      if (propertyError) {
        console.error("Błąd pobierania nieruchomości:", propertyError);
      } else if (propertyData) {
        propertyInfo = `
📍 Nazwa: ${propertyData.name || "—"}
📫 Adres: ${propertyData.address || "—"}, ${propertyData.city || "—"}
💰 Czynsz: ${propertyData.rent_amount || "—"} zł
🏢 Opłata administracyjna: ${propertyData.admin_fee || "—"} zł
🌐 Wi-Fi: ${propertyData.wifi_available ? "tak" : "nie"}
📅 Dostępna od: ${propertyData.available_from || "—"} do ${propertyData.available_to || "—"}
⚙️ Status: ${propertyData.is_active ? "aktywna" : "nieaktywna"}
        `;
      }
    }

    // 🧠 2️⃣ Pobranie ostatnich wiadomości dla danej nieruchomości
    const { data: messages, error: historyError } = await supabase
      .from("messages")
      .select("role, content")
      .eq("user_id", userId)
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (historyError) {
      console.error("Błąd przy pobieraniu historii wiadomości:", historyError);
    }

    const history = messages?.reverse() || [];

    // 💾 3️⃣ Zapis nowej wiadomości użytkownika
    await supabase.from("messages").insert({
      user_id: userId,
      property_id: propertyId,
      role: "user",
      content: message,
    });

    // 💬 4️⃣ Budowa kontekstu rozmowy
    const conversation = [
      {
        role: "system",
        content: `
          Jesteś asystentem AI platformy Tenago. Odpowiadasz po polsku, naturalnie i konkretnie. 
          Jesteś pomocnym agentem nieruchomości, który zna szczegóły danej nieruchomości.
          Wykorzystuj zawsze dane podane poniżej, jeśli użytkownik pyta o tę nieruchomość.
          Jeśli użytkownik prosi o opis, przedstaw go w przystępny sposób (np. z emoji i podziałem na sekcje).
          Jeśli czegoś nie ma w danych, powiedz to wprost.
        `,
      },
      {
        role: "system",
        content: `📘 Dane nieruchomości:\n${propertyInfo}`,
      },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    // 🤖 5️⃣ Odpowiedź modelu OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversation,
    });

    const reply = response.choices[0].message?.content ?? "Brak odpowiedzi.";

    // 💾 6️⃣ Zapis odpowiedzi AI
    await supabase.from("messages").insert({
      user_id: userId,
      property_id: propertyId,
      role: "assistant",
      content: reply,
    });

    // 🚀 7️⃣ Zwróć odpowiedź do frontendu
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("❌ Błąd /api/ask-ai:", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
