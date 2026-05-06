import { prisma } from "./prisma";

export interface FlavorDNA {
  spicy: number;
  sweet: number;
  savory: number;
  sour: number;
  bitter: number;
  umami: number;
}

const DEFAULT_DNA: FlavorDNA = {
  spicy: 0,
  sweet: 0,
  savory: 0,
  sour: 0,
  bitter: 0,
  umami: 0,
};

interface IntelligenceUser {
  flavorDNA: FlavorDNA | null;
}

/**
 * Updates a user's Flavor DNA using a weighted moving average.
 * This helps the platform "learn" the user's palate over time.
 */
export async function updateFlavorDNA(userId: string, newProfile: Partial<FlavorDNA>) {
  // Use raw SQL to fetch to avoid stale Prisma select types
  const users = await prisma.$queryRaw<IntelligenceUser[]>`
    SELECT "flavorDNA" FROM users WHERE id = ${userId}
  `;
  const user = users[0] || null;

  const currentDNA: FlavorDNA = (user?.flavorDNA as unknown as FlavorDNA) || { ...DEFAULT_DNA };
  const updatedDNA: FlavorDNA = { ...DEFAULT_DNA };

  // Learning rate (how quickly the profile adapts to new data)
  const ALPHA = 0.2; 

  (Object.keys(DEFAULT_DNA) as Array<keyof FlavorDNA>).forEach((key) => {
    const currentValue = currentDNA[key] || 0;
    const newValue = newProfile[key] || 0;
    updatedDNA[key] = Number((currentValue * (1 - ALPHA) + newValue * ALPHA).toFixed(3));
  });

  // Use raw SQL to bypass stale Prisma client types
  await prisma.$executeRaw`
    UPDATE users 
    SET "flavorDNA" = ${JSON.stringify(updatedDNA)}::jsonb 
    WHERE id = ${userId}
  `;

  return updatedDNA;
}

/**
 * Calculates the trending score for a post based on likes and age.
 * Score = Likes / (AgeInHours + 2)^1.5
 */
export function calculateTrendingScore(likesCount: number, createdAt: Date): number {
  const hoursSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
  const gravity = 1.5;
  const score = likesCount / Math.pow(hoursSinceCreation + 2, gravity);
  return Number(score.toFixed(4));
}
