"use client";

import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // 🌀 stan ładowania

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true); // rozpoczęcie ładowania

    try {
      const res = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const aiMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("❌ Błąd komunikacji z AI:", error);
      const errorMsg = {
        role: "assistant",
        content: "Nie udało się połączyć z serwerem AI.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false); // zakończenie ładowania
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-lg mx-auto border rounded-2xl p-4 shadow-md bg-white text-black">
      {/* Historia wiadomości */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-xl w-fit max-w-[80%] break-words ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="p-2 rounded-xl bg-gray-200 text-black w-fit self-start animate-pulse">
            🤖 Piszę...
          </div>
        )}
      </div>

      {/* Pole tekstowe */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-xl p-2 text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napisz wiadomość..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Enter = Wyślij
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`rounded-xl px-4 text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "..." : "Wyślij"}
        </button>
      </div>
    </div>
  );
}
