"use client";

import { useSearchParams } from "next/navigation";
import Chat from "@/components/Chat";
import UploadDocument from "@/components/UploadDocument"; // ✅ nowy import

export default function ChatPage() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");

  if (!propertyId) {
    return (
      <main className="p-6 text-black bg-white min-h-screen">
        <h1 className="text-2xl font-bold mb-2">Czat z AI Tenago</h1>
        <p className="text-gray-700">
          💡 Wybierz nieruchomość, aby rozpocząć rozmowę.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 text-black bg-white min-h-screen space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Czat z AI Tenago
          <span className="block text-base font-normal text-gray-600 mt-1">
            🔗 Nieruchomość ID: {propertyId}
          </span>
        </h1>

        {/* 🔽 Sekcja czatu */}
        <Chat propertyId={propertyId} />
      </div>

      {/* 🔽 Sekcja uploadu dokumentów */}
      <div>
        <UploadDocument propertyId={propertyId!} userId="test-user-id" />
      </div>
    </main>
  );
}
