import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompts: Record<string, string> = {
  recipe: `You are a world-class chef and food writer. When given a dish or cuisine request, provide a beautifully structured recipe with:
- A brief introduction (1-2 sentences)
- Ingredients list (with quantities)
- Step-by-step instructions
- Chef's tips section
- Serving suggestions
Keep it warm, encouraging, and practical. Format with clear sections using emoji headers.`,

  fridge: `You are a creative chef who specializes in using what's available. Given a list of ingredients, suggest 2-3 creative recipes that can be made with them.
For each recipe: provide a name, brief description, ingredients needed (marking which the user has), and key steps.
Be resourceful and inspiring — show how simple ingredients become great meals.`,

  cocktail: `You are a master mixologist. Given a cocktail request, provide:
- The cocktail name and vibe/occasion
- Ingredients with exact measurements
- Step-by-step mixing instructions
- Glass type and garnish
- Non-alcoholic variation (mocktail version)
Make it feel like a premium bar experience.`,

  substitute: `You are a culinary expert specializing in ingredient substitutions. For any ingredient swap question:
- Provide 3-5 alternatives with ratios
- Explain how each substitute affects the dish's flavor and texture
- Note any technique adjustments needed
- Give a recommended best substitute with explanation
Be precise and practical.`,
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, mode = "recipe" } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { recipe: "⚠️ GROQ_API_KEY not configured.\n\nAdd your Groq API key to .env.local:\n\nGROQ_API_KEY=your_key_here\n\nGet your free key at console.groq.com" },
        { status: 200 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompts[mode] || systemPrompts.recipe },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1200,
    });

    const recipe = completion.choices[0]?.message?.content || "No recipe generated.";

    return NextResponse.json({ recipe });
  } catch (err) {
    console.error("Groq API error:", err);
    return NextResponse.json(
      { recipe: "⚠️ Failed to generate recipe. Check your GROQ_API_KEY and try again." },
      { status: 200 }
    );
  }
}
