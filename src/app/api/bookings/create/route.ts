import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { propertyId, tenantId, date } = await req.json();

    if (!propertyId || !tenantId || !date) {
      return NextResponse.json(
        { error: "Brak wymaganych danych (propertyId, tenantId, date)" },
        { status: 400 }
      );
    }

    // 🧩 Ustal ownerId automatycznie na podstawie nieruchomości
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("owner_id")
      .eq("id", propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: "Nie znaleziono nieruchomości z podanym ID" },
        { status: 404 }
      );
    }

    const ownerId = property.owner_id;

    // 💾 Wstaw rezerwację
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          property_id: propertyId,
          tenant_id: tenantId,
          owner_id: ownerId,
          date,
          status: "pending",
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ booking: data[0] }, { status: 200 });
  } catch (err: any) {
    console.error("Błąd podczas tworzenia rezerwacji:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
