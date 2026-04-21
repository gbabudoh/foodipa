import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const mockPlaces = [
  // Restaurants
  { name: "Seoul Kitchen", cuisine: "Korean · BBQ", rating: 4.6, distance: "0.7 km", time: "12 min", emoji: "🇰🇷", tag: "Featured", tagColor: "#FFD700", category: "Restaurants", isSponsored: true, x: "35%", y: "42%", lat: 51.5168, lng: -0.1301 },
  { name: "The Spice Route", cuisine: "Indian · Curry", rating: 4.7, distance: "1.1 km", time: "18 min", emoji: "🍛", tag: null, tagColor: "", category: "Restaurants", isSponsored: false, x: "60%", y: "28%", lat: 51.5155, lng: -0.1265 },
  { name: "Taco Libre", cuisine: "Mexican · Tacos", rating: 4.5, distance: "1.8 km", time: "25 min", emoji: "🌮", tag: null, tagColor: "", category: "Restaurants", isSponsored: false, x: "20%", y: "62%", lat: 51.5234, lng: -0.1376 },
  { name: "Sakura Ramen", cuisine: "Japanese · Ramen", rating: 4.8, distance: "2.1 km", time: "28 min", emoji: "🍜", tag: "Popular", tagColor: "#EC4899", category: "Restaurants", isSponsored: false, x: "72%", y: "56%", lat: 51.5180, lng: -0.1250 },
  // Markets
  { name: "Lagos Fresh Market", cuisine: "West African · Groceries", rating: 4.4, distance: "0.9 km", time: "14 min", emoji: "🛒", tag: "Hot Spot", tagColor: "#FF6B2B", category: "Markets", isSponsored: true, x: "47%", y: "72%", lat: 51.5471, lng: 0.0544 },
  { name: "Spice Bazaar", cuisine: "Middle Eastern · Spices", rating: 4.7, distance: "1.6 km", time: "20 min", emoji: "🌶️", tag: null, tagColor: "", category: "Markets", isSponsored: false, x: "15%", y: "45%", lat: 51.5105, lng: -0.1220 },
  { name: "Farmer's Co-op", cuisine: "Local · Organic Produce", rating: 4.6, distance: "2.3 km", time: "30 min", emoji: "🥦", tag: "Weekend Only", tagColor: "#F59E0B", category: "Markets", isSponsored: false, x: "55%", y: "15%", lat: 51.5205, lng: -0.1215 },
  // Street Food
  { name: "Nkemdi's Suya Spot", cuisine: "Nigerian · Suya", rating: 4.8, distance: "0.3 km", time: "8 min", emoji: "🔥", tag: "Trending", tagColor: "#FF6B2B", category: "Street Food", isSponsored: true, x: "82%", y: "30%", lat: 51.5160, lng: -0.1280 },
  { name: "Pad Thai Corner", cuisine: "Thai · Noodles", rating: 4.5, distance: "0.6 km", time: "10 min", emoji: "🍜", tag: null, tagColor: "", category: "Street Food", isSponsored: false, x: "40%", y: "85%", lat: 51.5085, lng: -0.1260 },
  { name: "Kebab King", cuisine: "Turkish · Kebab", rating: 4.3, distance: "1.0 km", time: "15 min", emoji: "🥙", tag: "Late Night", tagColor: "#7C3AED", category: "Street Food", isSponsored: false, x: "10%", y: "10%", lat: 51.5050, lng: -0.1210 },
  // Cafés
  { name: "Brew & Books", cuisine: "Café · Specialty Coffee", rating: 4.9, distance: "0.4 km", time: "9 min", emoji: "☕", tag: "Top Rated", tagColor: "#7C3AED", category: "Cafés", isSponsored: false, x: "85%", y: "80%", lat: 51.5030, lng: -0.1320 },
  { name: "The Matcha House", cuisine: "Japanese · Tea & Pastries", rating: 4.7, distance: "1.2 km", time: "17 min", emoji: "🍵", tag: "Cozy", tagColor: "#10B981", category: "Cafés", isSponsored: false, x: "90%", y: "10%", lat: 51.5190, lng: -0.1350 },
  { name: "Café Nomad", cuisine: "International · Coffee & Bites", rating: 4.5, distance: "1.9 km", time: "24 min", emoji: "🌍", tag: null, tagColor: "", category: "Cafés", isSponsored: false, x: "5%", y: "90%", lat: 51.5015, lng: -0.1255 },
  // Bakeries
  { name: "Maison du Croissant", cuisine: "French · Patisserie", rating: 4.9, distance: "1.4 km", time: "22 min", emoji: "🥐", tag: "New", tagColor: "#10B981", category: "Bakeries", isSponsored: false, x: "25%", y: "5%", lat: 51.5210, lng: -0.1285 },
  { name: "Sourdough & Co.", cuisine: "Artisan · Bread & Pastries", rating: 4.6, distance: "2.0 km", time: "26 min", emoji: "🍞", tag: null, tagColor: "", category: "Bakeries", isSponsored: false, x: "50%", y: "95%", lat: 51.5080, lng: -0.1340 },
  { name: "Sweet Crust", cuisine: "Nigerian · Cakes & Pastries", rating: 4.4, distance: "2.4 km", time: "32 min", emoji: "🎂", tag: "Local Fave", tagColor: "#FF6B2B", category: "Bakeries", isSponsored: false, x: "75%", y: "5%", lat: 51.5230, lng: -0.1300 },
];

export async function GET() {
  try {
    const p = prisma as unknown as { 
      place: { 
        deleteMany: () => Promise<{ count: number }>,
        create: (args: { data: {
          name: string;
          cuisine: string;
          rating: number;
          distance: string;
          time: string;
          emoji: string;
          category: string;
          isSponsored: boolean;
          lat: number | null;
          lng: number | null;
          x: string;
          y: string;
          tag: string | null;
          tagColor: string | null;
        } }) => Promise<unknown> 
      } 
    };

    // Clear existing places safely
    await p.place.deleteMany();

    for (const place of mockPlaces) {
      await p.place.create({
        data: {
          name: place.name,
          cuisine: place.cuisine,
          rating: place.rating,
          distance: place.distance,
          time: place.time,
          emoji: place.emoji,
          tag: place.tag,
          tagColor: place.tagColor,
          category: place.category,
          isSponsored: place.isSponsored,
          x: place.x,
          y: place.y,
          lat: place.lat,
          lng: place.lng
        }
      });
    }

    return NextResponse.json({ ok: true, message: "Places seeded successfully", count: mockPlaces.length });
  } catch (error) {
    console.error("[SEED_PLACES]", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to seed places", details: errorMessage }, { status: 500 });
  }
}
