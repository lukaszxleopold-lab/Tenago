import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // backendowy klucz
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const propertyId = formData.get("propertyId") as string;
    const userId = formData.get("userId") as string;

    if (!file || !propertyId || !userId) {
      return NextResponse.json(
        { error: "Brak pliku, propertyId lub userId." },
        { status: 400 }
      );
    }

    // 📂 1️⃣ Zapis pliku do Supabase Storage
    const filePath = `${propertyId}/${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("property-docs")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    // 💾 2️⃣ Zapis metadanych w tabeli property_docs
    const { error: insertError } = await supabase.from("property_docs").insert({
      property_id: propertyId,
      file_name: file.name,
      file_path: uploadData?.path,
      uploaded_by: userId,
    });

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      message: "Plik przesłany pomyślnie!",
      path: uploadData?.path,
    });
  } catch (err: any) {
    console.error("❌ Błąd uploadu dokumentu:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
