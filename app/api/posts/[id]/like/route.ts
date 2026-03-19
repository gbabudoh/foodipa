import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
      return Response.json({ liked: false });
    } else {
      await prisma.like.create({ data: { userId, postId } });
      return Response.json({ liked: true });
    }
  } catch (err) {
    console.error("[like]", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
