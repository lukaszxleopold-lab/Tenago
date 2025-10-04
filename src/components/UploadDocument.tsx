"use client";
import { useState } from "react";

interface UploadDocumentProps {
  propertyId: string;
  userId: string;
}

export default function UploadDocument({ propertyId, userId }: UploadDocumentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return setStatus("❗ Wybierz plik");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("propertyId", propertyId);
    formData.append("userId", userId);

    setStatus("⏳ Wysyłanie...");

    const res = await fetch("/api/upload-doc", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) setStatus("✅ Plik przesłany pomyślnie!");
    else setStatus(`❌ Błąd: ${data.error}`);
  };

  return (
    <div className="p-4 border rounded bg-gray-50 text-black">
      <h2 className="text-lg font-bold mb-2">📄 Prześlij dokument nieruchomości</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2 block"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Wyślij
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
