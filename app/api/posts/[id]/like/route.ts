import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateTrendingScore } from "@/lib/intelligence";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await params;
  const userId = session.user.id;

  try {
    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { userId_postId: { userId, postId } } });
    } else {
      await prisma.like.create({ data: { userId, postId } });
    }

    // ── Recalculate Trending Score ──
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { _count: { select: { likes: true } } }
    });

    if (post) {
      const newScore = calculateTrendingScore(post._count.likes, post.createdAt);
      await prisma.$executeRaw`
        UPDATE posts 
        SET "trendingScore" = ${newScore} 
        WHERE id = ${postId}
      `;
    }

    return Response.json({ liked: !existing });
  } catch (err) {
    console.error("[like]", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
