import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface PlaceModel {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  distance: string;
  time: string;
  category: string;
  emoji: string;
  isSponsored: boolean;
  lat: number;
  lng: number;
  x: string;
  y: string;
  tag: string | null;
  tagColor: string | null;
  createdAt: Date;
}

export async function GET() {
  try {
    // We use a structured type cast to provide safety while the Prisma client syncs
    const p = prisma as unknown as { 
      place: { 
        findMany: (args: { orderBy: object[] }) => Promise<PlaceModel[]> 
      } 
    };
    
    const places = await p.place.findMany({
      orderBy: [
        { isSponsored: "desc" },
        { createdAt: "desc" }
      ]
    });
    return NextResponse.json(places);
  } catch (error) {
    console.error("[PLACES_GET]", error);
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
  }
}
