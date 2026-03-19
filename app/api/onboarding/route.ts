import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadDataUrl } from "@/lib/minio";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, bio, location, dietaryPrefs, favCuisines, flavorProfile, avatarDataUrl } = body;

    // Save profile data immediately
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        bio: bio || undefined,
        location: location || undefined,
        dietaryPrefs: dietaryPrefs ?? [],
        favCuisines: favCuisines ?? [],
        flavorProfile: flavorProfile ?? [],
        onboardingComplete: true,
        onboardingStep: 5,
      },
    });

    // Upload avatar in background — never blocks the response
    if (avatarDataUrl) {
      const userId = session.user.id;
      const ext = avatarDataUrl.includes("image/png") ? "png" : "jpg";
      uploadDataUrl(avatarDataUrl, "avatars", `${userId}.${ext}`)
        .then((avatarUrl) =>
          prisma.user.update({ where: { id: userId }, data: { avatar: avatarUrl } })
        )
        .catch((err) => console.error("[onboarding] avatar upload failed:", err));
    }

    // Set a cookie so middleware immediately knows onboarding is done
    // (more reliable than waiting for JWT update to propagate)
    const response = NextResponse.json({ ok: true });
    response.cookies.set("onboarding_done", "1", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (err) {
    console.error("[onboarding]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
