import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured. Add GOOGLE_GEMINI_API_KEY to .env.local" },
      { status: 500 }
    );
  }

  let imageDataUrl: string;
  try {
    const body = await req.json();
    imageDataUrl = body.imageDataUrl;
    if (!imageDataUrl) throw new Error("No image provided");
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Extract base64 and mime type from data URL
  const match = imageDataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
  }
  const mimeType = match[1];
  const base64Data = match[2];

  const prompt = `You are a world-class food expert and culinary AI. Analyse this image and identify the food/dish shown.

Respond ONLY with a valid JSON object in exactly this structure (no markdown, no extra text):
{
  "dish": "Name of the dish",
  "cuisine": "Cuisine type (e.g. Italian, Japanese, Mexican)",
  "description": "2-3 sentence description of the dish, its flavours, and how it is typically prepared",
  "origin": "Country or region of origin",
  "ingredients": ["ingredient1", "ingredient2", "ingredient3", "ingredient4", "ingredient5"],
  "pairsWith": ["pairing1", "pairing2", "pairing3"],
  "confidence": 92
}

Rules:
- "confidence" must be an integer 0-100 representing how confident you are in the identification
- "ingredients" should list 4-6 key ingredients
- "pairsWith" should list 2-4 food or drink pairings
- If you cannot identify any food in the image, set confidence to 0 and dish to "Unknown"
- Always return valid JSON, nothing else`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data,
                  },
                },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("[scan] Gemini API error:", errText);
      return NextResponse.json(
        { error: "Gemini API error. Check your API key and quota." },
        { status: 502 }
      );
    }

    const geminiData = await response.json();
    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Strip any accidental markdown fences
    const cleaned = rawText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      console.error("[scan] Failed to parse Gemini response:", rawText);
      return NextResponse.json(
        { error: "Could not parse food identification result. Try a clearer image." },
        { status: 500 }
      );
    }

    // Validate and normalise
    const sanitised = {
      dish: String(result.dish ?? "Unknown"),
      cuisine: String(result.cuisine ?? "Unknown"),
      description: String(result.description ?? ""),
      origin: String(result.origin ?? "Unknown"),
      ingredients: Array.isArray(result.ingredients) ? result.ingredients.map(String) : [],
      pairsWith: Array.isArray(result.pairsWith) ? result.pairsWith.map(String) : [],
      confidence: Math.min(100, Math.max(0, Number(result.confidence ?? 0))),
    };

    return NextResponse.json(sanitised);
  } catch (err) {
    console.error("[scan] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected server error during food analysis." },
      { status: 500 }
    );
  }
}
