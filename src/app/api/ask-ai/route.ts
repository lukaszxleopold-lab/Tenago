import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Jesteś pomocnym asystentem platformy Tenago. Odpowiadasz krótko, konkretnie i uprzejmie.",
        },
        { role: "user", content: message },
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    return NextResponse.json({ reply: aiResponse });
  } catch (error) {
    console.error("❌ Błąd w /api/ask-ai:", error);
    return NextResponse.json(
      { reply: "Wystąpił błąd po stronie serwera AI." },
      { status: 500 }
    );
  }
}
