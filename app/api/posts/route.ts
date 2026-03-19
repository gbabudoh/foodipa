import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadDataUrl } from "@/lib/minio";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") ?? "forYou";

  const posts = await prisma.post.findMany({
    orderBy:
      filter === "trending"
        ? [{ likes: { _count: "desc" } }, { createdAt: "desc" }]
        : { createdAt: "desc" },
    take: 50,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
      _count: { select: { likes: true } },
      ...(userId ? { likes: { where: { userId }, select: { id: true } } } : {}),
    },
  });

  return Response.json(
    posts.map((p) => ({
      id: p.id,
      author: p.user.name ?? "Foodie",
      avatar: p.user.avatar,
      caption: p.caption,
      imageUrl: p.imageUrl,
      tags: p.tags,
      createdAt: p.createdAt,
      likeCount: p._count.likes,
      liked: userId ? ("likes" in p ? (p.likes as { id: string }[]).length > 0 : false) : false,
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { caption, imageDataUrl, tags } = await req.json();
    if (!caption?.trim())
      return Response.json({ error: "Caption required" }, { status: 400 });

    let imageUrl: string | undefined;
    if (imageDataUrl) {
      const ext = (imageDataUrl as string).includes("image/png") ? "png" : "jpg";
      imageUrl = await uploadDataUrl(
        imageDataUrl,
        "posts",
        `${session.user.id}-${Date.now()}.${ext}`
      );
    }

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        caption: caption.trim(),
        imageUrl,
        tags: tags ?? [],
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    return Response.json({
      ok: true,
      post: {
        id: post.id,
        author: post.user.name ?? "Foodie",
        avatar: post.user.avatar,
        caption: post.caption,
        imageUrl: post.imageUrl,
        tags: post.tags,
        createdAt: post.createdAt,
        likeCount: 0,
        liked: false,
      },
    });
  } catch (err) {
    console.error("[posts POST]", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
