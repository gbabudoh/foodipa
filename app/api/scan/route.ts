import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateFlavorDNA } from "@/lib/intelligence";

const SYSTEM_PROMPT = `You are a professional culinary expert AI. Analyze the food in the image and provide a detailed identification in JSON format.
The JSON must follow this structure:
{
  "dish": "Name of the dish",
  "cuisine": "Primary cuisine (e.g., Nigerian, Italian, Fusion)",
  "description": "Brief but appetizing description (2 sentences)",
  "origin": "Country or city of origin",
  "ingredients": ["List", "of", "key", "ingredients"],
  "pairsWith": ["Recommended", "side", "dishes", "or", "drinks"],
  "flavorProfile": {
    "spicy": number (0-1),
    "sweet": number (0-1),
    "savory": number (0-1),
    "sour": number (0-1),
    "bitter": number (0-1),
    "umami": number (0-1)
  },
  "confidence": number between 0 and 100
}
Output ONLY the JSON, no other text.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI Scanner service is not configured (API Key missing)" }, { status: 500 });
  }
  
  let imageDataUrl: string;
  try {
    const body = await req.json();
    imageDataUrl = body.imageDataUrl;
    if (!imageDataUrl) throw new Error("No image provided");
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check usage limits
  if (user.plan === "FREE" && user.aiUsageCount >= 50) {
    return NextResponse.json(
      { error: "Monthly AI scan limit reached. Upgrade to Foodipa+ for unlimited use." },
      { status: 402 } 
    );
  }

  const match = imageDataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
  }
  const mimeType = match[1];
  const base64Data = match[2];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [
              { inline_data: { mime_type: mimeType, data: base64Data } }, 
              { text: SYSTEM_PROMPT }
            ] 
          }],
          generationConfig: { 
            temperature: 0.1, 
            maxOutputTokens: 1024,
            responseMimeType: "application/json"
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[scan] Gemini API Error:", errorData);
      throw new Error("AI service failed to process the image");
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (!rawText) throw new Error("Empty response from AI");
    
    const finalResult = JSON.parse(rawText);

    // Sanitise and validate
    const sanitised = {
      dish: String(finalResult.dish ?? "Unknown Dish"),
      cuisine: String(finalResult.cuisine ?? "Unknown"),
      description: String(finalResult.description ?? ""),
      origin: String(finalResult.origin ?? "Unknown"),
      ingredients: Array.isArray(finalResult.ingredients) ? finalResult.ingredients.map(String) : [],
      pairsWith: Array.isArray(finalResult.pairsWith) ? finalResult.pairsWith.map(String) : [],
      confidence: Math.min(100, Math.max(0, Number(finalResult.confidence ?? 0))),
    };

    // Update Flavor DNA and increment usage count
    await Promise.all([
      updateFlavorDNA(session.user.id, finalResult.flavorProfile || {}),
      prisma.user.update({
        where: { id: session.user.id },
        data: { aiUsageCount: { increment: 1 } },
      })
    ]);

    return NextResponse.json(sanitised);
  } catch (err) {
    console.error("[scan] Final Error:", err);
    return NextResponse.json({ 
      error: "AI Scanner failed to identify the food. Please ensure the photo is clear and try again." 
    }, { status: 500 });
  }
}
