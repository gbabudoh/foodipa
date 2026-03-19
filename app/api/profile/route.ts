import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadDataUrl } from "@/lib/minio";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user, postCount, savedCount, scanCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        location: true,
        dietaryPrefs: true,
        favCuisines: true,
        flavorProfile: true,
        createdAt: true,
      },
    }),
    prisma.post.count({ where: { userId: session.user.id } }),
    prisma.savedRecipe.count({ where: { userId: session.user.id } }),
    prisma.scanResult.count({ where: { userId: session.user.id } }),
  ]);

  return Response.json({
    user,
    stats: { posts: postCount, saved: savedCount, scans: scanCount },
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, bio, location, avatarDataUrl } = body;

    let avatarUrl: string | undefined;
    if (avatarDataUrl) {
      const ext = (avatarDataUrl as string).includes("image/png") ? "png" : "jpg";
      avatarUrl = await uploadDataUrl(avatarDataUrl, "avatars", `${session.user.id}.${ext}`);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(avatarUrl && { avatar: avatarUrl }),
      },
      select: { id: true, name: true, email: true, avatar: true, bio: true, location: true },
    });

    return Response.json({ ok: true, user: updated });
  } catch (err) {
    console.error("[profile PATCH]", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
