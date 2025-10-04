"use client";

import { useSearchParams } from "next/navigation";
import Chat from "@/components/Chat";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");

  return (
    <main className="p-6 text-black bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Czat z AI Tenago
        {propertyId && (
          <span className="block text-base font-normal text-gray-600 mt-1">
            🔗 Nieruchomość ID: {propertyId}
          </span>
        )}
      </h1>

      {/* 🔽 Przekazanie propertyId do komponentu czatu */}
      <Chat propertyId={propertyId} />
    </main>
  );
}
