import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Pip, Foodipa's friendly and witty food AI assistant. You are:
- Knowledgeable about global cuisines, cooking techniques, food history, and nutrition
- Helpful with recipe ideas, ingredient substitutions, and cooking tips
- Conversational and fun — you love food puns and enthusiastic about culinary discovery
- Concise: keep responses under 150 words unless a recipe is requested

If asked for a recipe, provide a brief one. For general questions, be direct and engaging.
Always stay on topic — food, cooking, restaurants, food culture, and culinary travel.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        content: "⚠️ I need a GROQ_API_KEY to function! Add it to .env.local to chat with me.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-8), // keep last 8 messages for context
      ],
      temperature: 0.75,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content || "Hmm, I'm stumped! Try asking me something else. 🤔";

    return NextResponse.json({ content });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ content: "Oops! Something went wrong. Try again! 🙏" });
  }
}
