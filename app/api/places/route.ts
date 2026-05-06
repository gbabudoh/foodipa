import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radius = parseFloat(searchParams.get("radius") || "5"); // default 5km
    const category = searchParams.get("category") || "All";

    // Production logic: Fetch places within radius using Haversine formula in SQL
    // This is much more efficient than fetching all and filtering in JS
    const places = await prisma.$queryRaw`
      SELECT *,
      (6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(lat)))) AS "calculatedDistance"
      FROM places
      WHERE 
        (${category} = 'All' OR category = ${category})
        AND (6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(lat)))) <= ${radius}
      ORDER BY "isSponsored" DESC, "calculatedDistance" ASC
      LIMIT 50
    `;

    return NextResponse.json(places);
  } catch (error) {
    console.error("[PLACES_GET]", error);
    return NextResponse.json({ error: "Failed to fetch nearby spots" }, { status: 500 });
  }
}
